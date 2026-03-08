import { Metadata } from 'next';
import PaymentSuccessClient from './success-client';
import { type Locale } from '@/lib/i18n';
import { resolveLocaleFromParams } from '@/lib/locale-page';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = await resolveLocaleFromParams(params);

  const title = locale === 'zh' ? '支付成功 - Shader Learn' : 'Payment Success - Shader Learn';
  const description = locale === 'zh'
    ? '您的订阅已激活，开始探索所有高级教程吧！'
    : 'Your subscription is now active. Start exploring all premium tutorials!';

  return {
    title,
    description,
    robots: {
      index: false, // 不希望搜索引擎索引支付成功页
      follow: false,
    },
  };
}

export default async function PaymentSuccessPage({ params, searchParams }: PageProps) {
  const locale = (await resolveLocaleFromParams(params)) as Locale;
  const { session_id } = await searchParams;

  return <PaymentSuccessClient locale={locale} sessionId={session_id} />;
}
