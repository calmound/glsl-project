import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ZPAY_CONFIG, verifySign, ZPAY_PRICING } from '@/lib/zpay-config';

/**
 * ZPAY Webhook 回调接口
 *
 * 文档：https://member.z-pay.cn/member/doc.html
 *
 * 回调参数：
 * - pid: 商户ID
 * - trade_no: ZPAY 订单号
 * - out_trade_no: 商户订单号
 * - type: 支付方式
 * - name: 商品名称
 * - money: 订单金额
 * - trade_status: 支付状态（TRADE_SUCCESS 为成功）
 * - param: 业务扩展参数
 * - sign: 签名
 */

// ==================== Supabase Admin 客户端 ====================

let supabaseAdminClient: ReturnType<typeof createClient> | null = null;

function getSupabaseAdmin() {
  if (supabaseAdminClient) {
    return supabaseAdminClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase env vars for ZPAY webhook');
  }

  supabaseAdminClient = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseAdminClient;
}

// ==================== 主处理函数 ====================

export async function GET(request: NextRequest) {
  return handleWebhook(request);
}

export async function POST(request: NextRequest) {
  return handleWebhook(request);
}

async function handleWebhook(request: NextRequest) {
  try {
    // ==================== 1. 获取参数 ====================
    const { searchParams } = new URL(request.url);
    const params: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    console.log('📬 [ZPAY Webhook] 收到回调:', {
      out_trade_no: params.out_trade_no,
      trade_no: params.trade_no,
      trade_status: params.trade_status,
      money: params.money,
    });

    // ==================== 2. 验证签名 ====================
    const isValid = verifySign(params, ZPAY_CONFIG.PKEY);
    if (!isValid) {
      console.error('❌ [ZPAY Webhook] 签名验证失败');
      return new NextResponse('FAIL', { status: 400 });
    }

    // ==================== 3. 检查支付状态 ====================
    if (params.trade_status !== 'TRADE_SUCCESS') {
      console.log('⏸️ [ZPAY Webhook] 支付未成功:', params.trade_status);
      return new NextResponse('success', { status: 200 });
    }

    const outTradeNo = params.out_trade_no;
    const zpayTradeNo = params.trade_no;
    const money = parseFloat(params.money);

    // ==================== 4. 解析业务参数 ====================
    let userId: string | null = null;
    let planType: string | null = null;

    try {
      const param = JSON.parse(params.param || '{}');
      userId = param.user_id;
      planType = param.plan;
    } catch (error) {
      console.error('❌ [ZPAY Webhook] 解析参数失败:', error);
    }

    if (!userId || !planType) {
      console.error('❌ [ZPAY Webhook] 缺少用户ID或套餐信息');
      return new NextResponse('success', { status: 200 });
    }

    // ==================== 5. 检查订单是否已处理（幂等） ====================
    const { data: existingEvent } = await getSupabaseAdmin()
      .from('payment_events')
      .select('id, processed')
      .eq('event_id', zpayTradeNo)
      .maybeSingle();

    if (existingEvent?.processed) {
      console.log('✅ [ZPAY Webhook] 订单已处理，跳过:', zpayTradeNo);
      return new NextResponse('success', { status: 200 });
    }

    // ==================== 6. 记录支付事件 ====================
    await getSupabaseAdmin().from('payment_events').upsert(
      {
        event_id: zpayTradeNo,
        event_type: 'zpay.payment.success',
        user_id: userId,
        payment_provider: 'zpay',
        zpay_trade_no: zpayTradeNo,
        raw_payload: params,
        processed: false,
      },
      { onConflict: 'event_id' }
    );

    // ==================== 7. 更新订单状态 ====================
    const { error: updateOrderError } = await getSupabaseAdmin()
      .from('orders')
      .update({
        payment_status: 'paid',
        paid_at: new Date().toISOString(),
        zpay_trade_no: zpayTradeNo,
      })
      .eq('zpay_out_trade_no', outTradeNo);

    if (updateOrderError) {
      console.error('❌ [ZPAY Webhook] 更新订单失败:', updateOrderError);
    }

    // ==================== 8. 授予权限 ====================
    const planConfig = ZPAY_PRICING[planType as keyof typeof ZPAY_PRICING];
    if (!planConfig) {
      console.error('❌ [ZPAY Webhook] 无效的套餐类型:', planType);
      return new NextResponse('success', { status: 200 });
    }

    const now = new Date();
    const endDate = new Date(now.getTime() + planConfig.duration_days * 24 * 60 * 60 * 1000);

    const { error: entitlementError } = await getSupabaseAdmin()
      .from('entitlements')
      .upsert(
        {
          user_id: userId,
          status: 'active',
          plan_type: planConfig.plan_type,
          start_date: now.toISOString(),
          end_date: endDate.toISOString(),
          payment_provider: 'zpay',
          updated_at: now.toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (entitlementError) {
      console.error('❌ [ZPAY Webhook] 授予权限失败:', entitlementError);
    } else {
      console.log('✅ [ZPAY Webhook] 授予权限成功:', {
        userId,
        planType,
        endDate: endDate.toISOString(),
      });
    }

    // ==================== 9. 标记事件已处理 ====================
    await getSupabaseAdmin()
      .from('payment_events')
      .update({
        processed: true,
        processed_at: new Date().toISOString(),
      })
      .eq('event_id', zpayTradeNo);

    // ==================== 10. 返回 success ====================
    console.log('✅ [ZPAY Webhook] 处理完成:', outTradeNo);
    return new NextResponse('success', { status: 200 });
  } catch (error) {
    console.error('❌ [ZPAY Webhook] 处理失败:', error);
    return new NextResponse('FAIL', { status: 500 });
  }
}
