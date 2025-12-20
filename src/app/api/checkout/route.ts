import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

/**
 * Checkout API - 创建 Creem 支付会话
 *
 * 该接口会：
 * 1. 验证用户登录状态
 * 2. 调用 Creem API 创建 checkout session
 * 3. 返回 checkout URL 供前端跳转
 */
export async function POST(request: NextRequest) {
  try {
    // 验证用户登录
    const supabase = await createServerSupabase();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: '请先登录' },
        { status: 401 }
      );
    }

    // 获取请求参数
    const body = await request.json();
    const { plan = 'pro_90days' } = body;

    // 读取环境变量
    const creemApiKey = process.env.CREEM_API_KEY;
    const creemProductId = process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const testMode = process.env.NEXT_PUBLIC_CREEM_TEST_MODE === 'true';

    if (!creemApiKey || !creemProductId) {
      console.error('❌ Creem 配置缺失:', {
        hasApiKey: !!creemApiKey,
        hasProductId: !!creemProductId
      });
      return NextResponse.json(
        { error: 'Configuration error', message: '支付配置错误，请联系管理员' },
        { status: 500 }
      );
    }

    console.log('🛒 [Checkout] 创建支付会话:', {
      userId: user.id,
      email: user.email,
      plan,
      testMode,
    });

    // 调用 Creem API 创建 checkout session
    const creemResponse = await fetch('https://api.creem.io/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${creemApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: creemProductId,
        success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/pricing`,

        // 关键：传递用户标识，用于 webhook 回调时识别用户
        customer_reference_id: user.id,

        // 元数据：额外信息，在 webhook 中可以获取
        metadata: {
          user_id: user.id,
          user_email: user.email || '',
          plan,
          source: 'web',
        },

        // 测试模式
        test_mode: testMode,
      }),
    });

    if (!creemResponse.ok) {
      const errorData = await creemResponse.text();
      console.error('❌ [Checkout] Creem API 错误:', {
        status: creemResponse.status,
        statusText: creemResponse.statusText,
        error: errorData,
      });
      return NextResponse.json(
        { error: 'Payment error', message: '创建支付会话失败，请稍后重试' },
        { status: 500 }
      );
    }

    const checkoutData = await creemResponse.json();

    console.log('✅ [Checkout] 支付会话创建成功:', {
      sessionId: checkoutData.id,
      checkoutUrl: checkoutData.url,
    });

    return NextResponse.json({
      success: true,
      checkout_url: checkoutData.url,
      session_id: checkoutData.id,
    });

  } catch (error) {
    console.error('❌ [Checkout] 服务器错误:', error);
    return NextResponse.json(
      { error: 'Internal error', message: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
