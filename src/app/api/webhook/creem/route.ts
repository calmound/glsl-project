import { Webhook } from '@creem_io/nextjs';
import { createClient } from '@supabase/supabase-js';

type Metadata = Record<string, string | number | null | undefined>;

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

function getEntityId(entity: unknown): string | null {
  if (!entity) return null;
  if (typeof entity === 'string') return entity;
  if (typeof entity === 'object' && 'id' in entity) {
    const id = (entity as { id?: string }).id;
    return id || null;
  }
  return null;
}

function getMetadata(entity: { metadata?: Metadata } | null | undefined): Metadata {
  return entity?.metadata || {};
}

function getReferenceId(metadata: Metadata): string | null {
  const referenceId = metadata?.referenceId;
  return referenceId ? String(referenceId) : null;
}

function toIsoDate(value: unknown): string | null {
  if (!value) return null;
  const date = new Date(value as string);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function resolvePlanType(metadata: Metadata): string {
  const plan = metadata?.plan;
  return typeof plan === 'string' ? plan : 'pro_90days';
}

function fallbackEndDate(planType: string) {
  const now = new Date();
  if (planType === 'pro_90days') {
    return new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
  }
  return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
}

async function recordEvent({
  eventId,
  eventType,
  userId,
  customerId,
  subscriptionId,
  payload,
}: {
  eventId: string;
  eventType: string;
  userId: string | null;
  customerId: string | null;
  subscriptionId: string | null;
  payload: Record<string, unknown>;
}) {
  const { data: existingEvent, error: existingError } = await supabaseAdmin
    .from('payment_events')
    .select('id, processed')
    .eq('event_id', eventId)
    .maybeSingle();

  if (existingError) {
    console.error('❌ [Webhook] 查询事件失败:', existingError);
  }

  if (existingEvent) {
    return { shouldProcess: !existingEvent.processed, processed: existingEvent.processed };
  }

  const { error: insertError } = await supabaseAdmin.from('payment_events').insert({
    event_id: eventId,
    event_type: eventType,
    user_id: userId,
    creem_customer_id: customerId,
    creem_subscription_id: subscriptionId,
    raw_payload: payload,
    processed: false,
  });

  if (insertError) {
    console.error('❌ [Webhook] 记录事件失败:', insertError);
    const { data: duplicateEvent } = await supabaseAdmin
      .from('payment_events')
      .select('id, processed')
      .eq('event_id', eventId)
      .maybeSingle();
    if (duplicateEvent) {
      return { shouldProcess: !duplicateEvent.processed, processed: duplicateEvent.processed };
    }
  }

  return { shouldProcess: true, processed: false };
}

async function markEventProcessed(eventId: string) {
  const { error } = await supabaseAdmin
    .from('payment_events')
    .update({ processed: true, processed_at: new Date().toISOString() })
    .eq('event_id', eventId);

  if (error) {
    console.error('❌ [Webhook] 更新事件状态失败:', error);
  }
}

async function upsertEntitlement({
  userId,
  status,
  planType,
  startDate,
  endDate,
  customerId,
  subscriptionId,
}: {
  userId: string;
  status: 'active' | 'expired' | 'canceled' | 'pending';
  planType: string;
  startDate: string;
  endDate: string;
  customerId: string | null;
  subscriptionId: string | null;
}) {
  const { error } = await supabaseAdmin
    .from('entitlements')
    .upsert(
      {
        user_id: userId,
        status,
        plan_type: planType,
        start_date: startDate,
        end_date: endDate,
        creem_customer_id: customerId,
        creem_subscription_id: subscriptionId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

  if (error) {
    console.error('❌ [Webhook] 更新权限失败:', error);
  }
}

async function updateEntitlementStatus({
  userId,
  status,
  customerId,
  subscriptionId,
  endDate,
}: {
  userId: string;
  status: 'expired' | 'canceled' | 'pending';
  customerId: string | null;
  subscriptionId: string | null;
  endDate: string | null;
}) {
  const now = new Date().toISOString();
  const updatePayload: Record<string, string | null> = {
    status,
    updated_at: now,
  };

  if (customerId) {
    updatePayload.creem_customer_id = customerId;
  }

  if (subscriptionId) {
    updatePayload.creem_subscription_id = subscriptionId;
  }

  if (endDate) {
    updatePayload.end_date = endDate;
  }

  const { data: existing } = await supabaseAdmin
    .from('entitlements')
    .select('id, start_date, end_date, plan_type')
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabaseAdmin
      .from('entitlements')
      .update(updatePayload)
      .eq('user_id', userId);

    if (error) {
      console.error('❌ [Webhook] 撤销权限失败:', error);
    }
    return;
  }

  const fallbackStart = new Date().toISOString();
  const fallbackEnd = endDate || new Date().toISOString();

  await upsertEntitlement({
    userId,
    status,
    planType: existing?.plan_type || 'pro_90days',
    startDate: existing?.start_date || fallbackStart,
    endDate: fallbackEnd,
    customerId,
    subscriptionId,
  });
}

async function handleGrantAccess({
  eventType,
  eventId,
  payload,
  metadata,
  customerId,
  subscriptionId,
  periodStart,
  periodEnd,
}: {
  eventType: string;
  eventId: string;
  payload: Record<string, unknown>;
  metadata: Metadata;
  customerId: string | null;
  subscriptionId: string | null;
  periodStart: string | null;
  periodEnd: string | null;
}) {
  const userId = getReferenceId(metadata);
  if (!userId) {
    console.error('❌ [Webhook] 缺少用户ID，无法授予权限');
  }

  const { shouldProcess } = await recordEvent({
    eventId,
    eventType,
    userId,
    customerId,
    subscriptionId,
    payload,
  });

  if (!shouldProcess || !userId) {
    return;
  }

  const planType = resolvePlanType(metadata);
  const startDate = periodStart || new Date().toISOString();
  const endDate = periodEnd || fallbackEndDate(planType).toISOString();

  await upsertEntitlement({
    userId,
    status: 'active',
    planType,
    startDate,
    endDate,
    customerId,
    subscriptionId,
  });

  await markEventProcessed(eventId);
}

async function handleRevokeAccess({
  eventType,
  eventId,
  payload,
  metadata,
  customerId,
  subscriptionId,
  periodEnd,
  status,
}: {
  eventType: string;
  eventId: string;
  payload: Record<string, unknown>;
  metadata: Metadata;
  customerId: string | null;
  subscriptionId: string | null;
  periodEnd: string | null;
  status: 'expired' | 'canceled' | 'pending';
}) {
  const userId = getReferenceId(metadata);
  if (!userId) {
    console.error('❌ [Webhook] 缺少用户ID，无法撤销权限');
  }

  const { shouldProcess } = await recordEvent({
    eventId,
    eventType,
    userId,
    customerId,
    subscriptionId,
    payload,
  });

  if (!shouldProcess || !userId) {
    return;
  }

  await updateEntitlementStatus({
    userId,
    status,
    customerId,
    subscriptionId,
    endDate: periodEnd,
  });

  await markEventProcessed(eventId);
}

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET || '',

  onCheckoutCompleted: async event => {
    const metadata = getMetadata(event);
    const customerId = getEntityId(event.customer);
    const subscriptionId = getEntityId(event.subscription);
    const subscription =
      event.subscription && typeof event.subscription === 'object' ? event.subscription : null;
    const periodStart = toIsoDate(
      subscription && 'current_period_start_date' in subscription
        ? subscription.current_period_start_date
        : null
    );
    const periodEnd = toIsoDate(
      subscription && 'current_period_end_date' in subscription
        ? subscription.current_period_end_date
        : null
    );

    await handleGrantAccess({
      eventType: event.webhookEventType,
      eventId: event.webhookId,
      payload: event,
      metadata,
      customerId,
      subscriptionId,
      periodStart,
      periodEnd,
    });
  },

  onSubscriptionActive: async event => {
    const metadata = getMetadata(event);
    await handleGrantAccess({
      eventType: event.webhookEventType,
      eventId: event.webhookId,
      payload: event,
      metadata,
      customerId: getEntityId(event.customer),
      subscriptionId: event.id,
      periodStart: toIsoDate(event.current_period_start_date),
      periodEnd: toIsoDate(event.current_period_end_date),
    });
  },

  onSubscriptionTrialing: async event => {
    const metadata = getMetadata(event);
    await handleGrantAccess({
      eventType: event.webhookEventType,
      eventId: event.webhookId,
      payload: event,
      metadata,
      customerId: getEntityId(event.customer),
      subscriptionId: event.id,
      periodStart: toIsoDate(event.current_period_start_date),
      periodEnd: toIsoDate(event.current_period_end_date),
    });
  },

  onSubscriptionPaid: async event => {
    const metadata = getMetadata(event);
    await handleGrantAccess({
      eventType: event.webhookEventType,
      eventId: event.webhookId,
      payload: event,
      metadata,
      customerId: getEntityId(event.customer),
      subscriptionId: event.id,
      periodStart: toIsoDate(event.current_period_start_date),
      periodEnd: toIsoDate(event.current_period_end_date),
    });
  },

  onSubscriptionExpired: async event => {
    const metadata = getMetadata(event);
    await handleRevokeAccess({
      eventType: event.webhookEventType,
      eventId: event.webhookId,
      payload: event,
      metadata,
      customerId: getEntityId(event.customer),
      subscriptionId: event.id,
      periodEnd: toIsoDate(event.current_period_end_date),
      status: 'expired',
    });
  },

  onSubscriptionCanceled: async event => {
    const metadata = getMetadata(event);
    await handleRevokeAccess({
      eventType: event.webhookEventType,
      eventId: event.webhookId,
      payload: event,
      metadata,
      customerId: getEntityId(event.customer),
      subscriptionId: event.id,
      periodEnd: toIsoDate(event.current_period_end_date),
      status: 'canceled',
    });
  },

  onSubscriptionPaused: async event => {
    const metadata = getMetadata(event);
    await handleRevokeAccess({
      eventType: event.webhookEventType,
      eventId: event.webhookId,
      payload: event,
      metadata,
      customerId: getEntityId(event.customer),
      subscriptionId: event.id,
      periodEnd: toIsoDate(event.current_period_end_date),
      status: 'pending',
    });
  },

  onSubscriptionUnpaid: async event => {
    const metadata = getMetadata(event);
    await handleRevokeAccess({
      eventType: event.webhookEventType,
      eventId: event.webhookId,
      payload: event,
      metadata,
      customerId: getEntityId(event.customer),
      subscriptionId: event.id,
      periodEnd: toIsoDate(event.current_period_end_date),
      status: 'pending',
    });
  },

  onSubscriptionPastDue: async event => {
    const metadata = getMetadata(event);
    await handleRevokeAccess({
      eventType: event.webhookEventType,
      eventId: event.webhookId,
      payload: event,
      metadata,
      customerId: getEntityId(event.customer),
      subscriptionId: event.id,
      periodEnd: toIsoDate(event.current_period_end_date),
      status: 'pending',
    });
  },

  onSubscriptionUpdate: async event => {
    const metadata = getMetadata(event);
    await handleGrantAccess({
      eventType: event.webhookEventType,
      eventId: event.webhookId,
      payload: event,
      metadata,
      customerId: getEntityId(event.customer),
      subscriptionId: event.id,
      periodStart: toIsoDate(event.current_period_start_date),
      periodEnd: toIsoDate(event.current_period_end_date),
    });
  },
});
