/**
 * 统一定价配置
 * 根据 locale 返回对应的定价和支付方式
 */

// ==================== 国际站定价（Creem 美元） ====================

export const PRICING_EN = {
  pro_3months: {
    name: 'Pro 3 Months',
    price: 9.99,
    currency: 'USD',
    duration_days: 90,
    payment_provider: 'creem' as const,
    plan_type: 'pro_3months',
  },
  pro_1year: {
    name: 'Pro 1 Year',
    price: 29.99,
    currency: 'USD',
    duration_days: 365,
    payment_provider: 'creem' as const,
    plan_type: 'pro_1year',
  },
} as const;

// ==================== 中文站定价（ZPAY 人民币） ====================

export const PRICING_ZH = {
  pro_3months: {
    name: 'Pro 3个月会员',
    price: 49,
    currency: 'CNY',
    duration_days: 90,
    payment_provider: 'zpay' as const,
    plan_type: 'pro_3months',
  },
  pro_1year: {
    name: 'Pro 1年会员',
    price: 149,
    currency: 'CNY',
    duration_days: 365,
    payment_provider: 'zpay' as const,
    plan_type: 'pro_1year',
  },
} as const;

// ==================== 类型定义 ====================

export type Locale = 'en' | 'zh';
export type PlanType = 'pro_3months' | 'pro_1year';
export type PaymentProvider = 'creem' | 'zpay';

export type PricingPlan = {
  name: string;
  price: number;
  currency: 'USD' | 'CNY';
  duration_days: number;
  payment_provider: PaymentProvider;
  plan_type: PlanType;
};

// ==================== 获取定价函数 ====================

/**
 * 根据 locale 获取对应的定价配置
 */
export function getPricing(locale: Locale): typeof PRICING_EN | typeof PRICING_ZH {
  return locale === 'zh' ? PRICING_ZH : PRICING_EN;
}

/**
 * 根据 locale 和 plan 获取单个定价
 */
export function getPricingPlan(locale: Locale, planType: PlanType): PricingPlan {
  const pricing = getPricing(locale);
  return pricing[planType];
}

/**
 * 获取支付提供商
 */
export function getPaymentProvider(locale: Locale): PaymentProvider {
  return locale === 'zh' ? 'zpay' : 'creem';
}
