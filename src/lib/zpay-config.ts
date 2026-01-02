/**
 * ZPAY 支付配置和工具函数（中文站专用）
 * 文档：https://member.z-pay.cn/member/doc.html
 */

import crypto from 'crypto';

// ==================== 配置 ====================

export const ZPAY_CONFIG = {
  // API 地址
  SUBMIT_URL: 'https://zpayz.cn/submit.php', // 页面跳转支付
  MAPI_URL: 'https://zpayz.cn/mapi.php',       // API 接口支付
  QUERY_URL: 'https://zpayz.cn/api.php',       // 订单查询

  // 商户信息（从环境变量读取）
  PID: process.env.ZPAY_PID || '',
  PKEY: process.env.ZPAY_PKEY || '',

  // 支付方式
  PAYMENT_TYPES: {
    ALIPAY: 'alipay',
    WECHAT: 'wxpay',
  } as const,
};

// ==================== 定价配置（中文站） ====================

// 从环境变量读取价格（方便测试），如果没有配置则使用默认值
// 使用 NEXT_PUBLIC_ 前缀让前端也能读取
const getPrice = (envKey: string, defaultPrice: number): number => {
  const envValue = process.env[envKey];
  if (!envValue) return defaultPrice;
  const parsed = parseFloat(envValue);
  return isNaN(parsed) ? defaultPrice : parsed;
};

export const ZPAY_PRICING = {
  pro_3months: {
    name: 'Pro 3个月会员',
    price: getPrice('NEXT_PUBLIC_ZPAY_PRICE_3MONTHS', 49),
    duration_days: 90,
    plan_type: 'pro_3months',
  },
  pro_1year: {
    name: 'Pro 1年会员',
    price: getPrice('NEXT_PUBLIC_ZPAY_PRICE_1YEAR', 149),
    duration_days: 365,
    plan_type: 'pro_1year',
  },
} as const;

export type ZPayPlanType = keyof typeof ZPAY_PRICING;

// ==================== 工具函数 ====================

/**
 * 生成商户订单号
 * 格式: ZPAY_{timestamp}_{random}
 */
export function generateOutTradeNo(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `ZPAY_${timestamp}_${random}`;
}

/**
 * MD5 签名算法
 *
 * 算法步骤：
 * 1. 过滤掉 sign、sign_type 和空值
 * 2. 按参数名 ASCII 码排序
 * 3. 拼接成 a=b&c=d 格式（参数值不进行 URL 编码）
 * 4. 加上商户密钥后 MD5 加密（小写）
 *
 * 注意：签名时参数值不要进行 URL 编码，但发送时需要编码
 */
export function generateSign(
  params: Record<string, string | number>,
  key: string
): string {
  // 1. 过滤空值、sign、sign_type
  const filteredParams = Object.entries(params).filter(
    ([k, v]) =>
      k !== 'sign' &&
      k !== 'sign_type' &&
      v !== '' &&
      v !== null &&
      v !== undefined
  );

  // 2. 按 key 的 ASCII 码排序
  filteredParams.sort((a, b) => a[0].localeCompare(b[0]));

  // 3. 拼接成 a=b&c=d 格式（不进行 URL 编码）
  const signStr = filteredParams.map(([k, v]) => `${k}=${v}`).join('&');

  // 4. 加上商户密钥（直接拼接，不要有等号或其他符号）
  const signStrWithKey = signStr + key;

  // 5. MD5 加密（小写）
  const sign = crypto
    .createHash('md5')
    .update(signStrWithKey, 'utf8')  // 明确指定编码
    .digest('hex')
    .toLowerCase();

  return sign;
}

/**
 * 验证签名
 */
export function verifySign(
  params: Record<string, string | number>,
  key: string
): boolean {
  const receivedSign = params.sign as string;
  if (!receivedSign) return false;

  const calculatedSign = generateSign(params, key);
  return receivedSign === calculatedSign;
}

/**
 * 查询订单状态
 */
export async function queryOrder(outTradeNo: string): Promise<{
  code: number;
  msg: string;
  trade_no?: string;
  out_trade_no?: string;
  status?: number;
  money?: string;
  [key: string]: unknown;
}> {
  const pid = ZPAY_CONFIG.PID;
  const key = ZPAY_CONFIG.PKEY;

  const url = `${ZPAY_CONFIG.QUERY_URL}?act=order&pid=${pid}&key=${key}&out_trade_no=${outTradeNo}`;

  const response = await fetch(url);
  return response.json();
}
