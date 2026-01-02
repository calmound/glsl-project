import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
import {
  ZPAY_CONFIG,
  ZPAY_PRICING,
  generateOutTradeNo,
  generateSign,
  type ZPayPlanType,
} from '@/lib/zpay-config';

/**
 * ZPAY 支付接口（中文站专用）
 *
 * 流程：
 * 1. 验证用户登录
 * 2. 创建订单记录到数据库
 * 3. 生成 ZPAY 支付参数和签名
 * 4. 返回支付 URL 供前端跳转
 */
export async function POST(request: NextRequest) {
  try {
    // ==================== 1. 验证用户登录 ====================
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

    // ==================== 2. 获取请求参数 ====================
    const body = await request.json();
    const { plan = 'pro_1year' } = body as { plan?: ZPayPlanType };

    const planConfig = ZPAY_PRICING[plan];
    if (!planConfig) {
      return NextResponse.json(
        { error: 'Invalid plan', message: '无效的套餐类型' },
        { status: 400 }
      );
    }

    // ==================== 3. 检查配置 ====================
    const pid = ZPAY_CONFIG.PID;
    const pkey = ZPAY_CONFIG.PKEY;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    if (!pid || !pkey) {
      console.error('❌ [ZPAY] 配置缺失:', {
        hasPid: !!pid,
        hasPkey: !!pkey,
      });
      return NextResponse.json(
        { error: 'Configuration error', message: '支付配置错误，请联系管理员' },
        { status: 500 }
      );
    }

    // ==================== 4. 生成商户订单号 ====================
    const outTradeNo = generateOutTradeNo();

    console.log('🛒 [ZPAY] 创建支付订单:', {
      userId: user.id,
      email: user.email,
      plan,
      outTradeNo,
      price: planConfig.price,
    });

    // ==================== 5. 创建订单记录（数据库） ====================
    const { error: insertError } = await supabase.from('orders').insert({
      user_id: user.id,
      order_no: outTradeNo,
      plan_type: planConfig.plan_type,
      amount: planConfig.price,
      currency: 'CNY',
      payment_provider: 'zpay',
      payment_status: 'pending',
      zpay_out_trade_no: outTradeNo,
    });

    if (insertError) {
      console.error('❌ [ZPAY] 创建订单记录失败:', insertError);
      return NextResponse.json(
        { error: 'Database error', message: '创建订单失败，请稍后重试' },
        { status: 500 }
      );
    }

    // ==================== 6. 构建 ZPAY 支付参数 ====================
    // 注意：notify_url 和 return_url 都不支持带参数（文档要求）
    const paymentParams: Record<string, string> = {
      pid,
      type: 'wxpay', // 微信支付
      out_trade_no: outTradeNo,
      notify_url: `${baseUrl}/api/webhook/zpay`,
      return_url: `${baseUrl}/payment/success`, // 不能带参数
      name: planConfig.name,
      money: planConfig.price.toFixed(2),
      param: JSON.stringify({
        user_id: user.id,
        plan: planConfig.plan_type,
        order_no: outTradeNo, // 通过 param 传递订单号
      }),
      sign_type: 'MD5',
    };

    // ==================== 7. 生成签名 ====================
    const sign = generateSign(paymentParams, pkey);

    // ==================== 8. 构建 URL（参考官方示例）====================
    // 官方代码：直接拼接，不进行 URL 编码，让浏览器自动处理
    // 先生成签名字符串（已排序）
    const paramKeys = Object.keys(paymentParams).sort();
    const paramStr = paramKeys
      .map(key => `${key}=${paymentParams[key]}`)
      .join('&');

    // 拼接最终 URL：参数字符串 + sign + sign_type
    const checkoutUrl = `${ZPAY_CONFIG.SUBMIT_URL}?${paramStr}&sign=${sign}&sign_type=MD5`;

    console.log('✅ [ZPAY] 支付 URL 生成成功，订单号:', outTradeNo);

    // ==================== 9. 返回结果 ====================
    return NextResponse.json({
      success: true,
      checkout_url: checkoutUrl,
      order_no: outTradeNo,
    });
  } catch (error) {
    console.error('❌ [ZPAY] 服务器错误:', error);
    return NextResponse.json(
      { error: 'Internal error', message: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
