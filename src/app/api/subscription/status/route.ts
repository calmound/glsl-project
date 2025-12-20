import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: '请先登录' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('entitlements')
      .select('id, status, plan_type, start_date, end_date, creem_customer_id, creem_subscription_id')
      .eq('user_id', user.id)
      .order('end_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('❌ [SubscriptionStatus] 查询失败:', error);
      return NextResponse.json(
        { error: 'Query error', message: '订阅状态查询失败' },
        { status: 500 }
      );
    }

    const hasActiveSubscription =
      !!data && data.status === 'active' && new Date(data.end_date) > new Date();

    return NextResponse.json({
      hasActiveSubscription,
      entitlement: data || null,
    });
  } catch (error) {
    console.error('❌ [SubscriptionStatus] 服务器错误:', error);
    return NextResponse.json(
      { error: 'Internal error', message: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
