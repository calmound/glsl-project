import { NextRequest, NextResponse } from 'next/server';
import { Portal } from '@creem_io/nextjs';
import { createServerSupabase } from '@/lib/supabase-server';

const portalHandler = Portal({
  apiKey: process.env.CREEM_API_KEY || '',
  testMode: process.env.NEXT_PUBLIC_CREEM_TEST_MODE === 'true',
});

export async function GET(request: NextRequest) {
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

  const customerId = request.nextUrl.searchParams.get('customerId');
  if (!customerId) {
    return NextResponse.json(
      { error: 'Missing customerId', message: '缺少客户信息' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('entitlements')
    .select('creem_customer_id')
    .eq('user_id', user.id)
    .order('end_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('❌ [Portal] 查询权限失败:', error);
    return NextResponse.json(
      { error: 'Query error', message: '订阅信息查询失败' },
      { status: 500 }
    );
  }

  if (!data?.creem_customer_id || data.creem_customer_id !== customerId) {
    return NextResponse.json(
      { error: 'Forbidden', message: '无权限访问订阅管理' },
      { status: 403 }
    );
  }

  return portalHandler(request);
}
