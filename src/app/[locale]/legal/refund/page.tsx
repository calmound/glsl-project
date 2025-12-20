import { Metadata } from 'next';
import MainLayout from '../../../../components/layout/main-layout';
import { getValidLocale } from '../../../../lib/i18n';

interface RefundPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: RefundPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = getValidLocale(localeParam);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';
  const title = locale === 'zh' ? '退款政策 - Shader Learn' : 'Refund Policy - Shader Learn';
  const description =
    locale === 'zh'
      ? 'Shader Learn 退款政策，说明数字内容与订阅的退款规则。'
      : 'Shader Learn Refund Policy, including rules for digital content and subscriptions.';

  const canonical = locale === 'en' ? '/legal/refund' : `/${locale}/legal/refund`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: '/legal/refund',
        'zh-CN': '/zh/legal/refund',
        'x-default': '/legal/refund',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}${canonical}`,
      siteName: 'Shader Learn',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Shader Learn Refund Policy',
        },
      ],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    },
  };
}

export default async function RefundPage({ params }: RefundPageProps) {
  const { locale: localeParam } = await params;
  const locale = getValidLocale(localeParam);
  const email = 'support@shader-learn.com';

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {locale === 'zh' ? '退款政策' : 'Refund Policy'}
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          {locale === 'zh' ? '最后更新：2025-12-20' : 'Last Updated: December 20, 2025'}
        </p>

        <div className="prose prose-lg max-w-none text-gray-700">
          {locale === 'zh' ? (
            <>
              <h2>1. 订阅服务与访问说明</h2>
              <p>
                Shader Learn 提供的是基于订阅周期的数字化服务访问权限。用户在完成支付后，将立即获得相应订阅周期内的 Pro 权益访问权限。
                鉴于服务在支付完成后即时生效，除本政策明确列出的例外情况外，一般不提供无理由退款。我们建议用户在购买前充分了解产品功能并体验免费内容。
              </p>

              <h2>2. 可退款的例外情况</h2>
              <p>在以下情形下，我们可能根据具体情况酌情处理退款请求：</p>
              <ul>
                <li>因系统错误或技术问题导致的重复扣费或重复付款</li>
                <li>支付成功后，在合理时间内未能开通相应服务权限，且经核实无法解决</li>
                <li>根据适用法律法规明确要求必须退款的情况</li>
              </ul>
              <p>是否退款及退款金额将由我们根据实际情况进行评估和决定。</p>

              <h2>3. 不支持退款的情形</h2>
              <p>以下情况通常不支持退款：</p>
              <ul>
                <li>用户已正常获得并使用订阅服务访问权限</li>
                <li>用户在订阅周期内主动取消订阅</li>
                <li>因个人原因（包括但不限于误购、未使用、主观不满意）提出的退款请求</li>
              </ul>
              <p>
                订阅的取消不等同于退款。取消订阅后，用户仍可在当前已支付的订阅周期内继续使用相关服务。
              </p>

              <h2>4. 订阅与自动续费</h2>
              <p>
                本平台提供订阅制服务，当前可选订阅周期包括 3 个月 与 1 年。
                订阅将在每个计费周期结束时自动续费并扣费，除非用户在当前周期结束前主动取消。
                用户可通过站内“管理订阅”入口进入 Creem 客户门户，对订阅进行取消或更新支付方式等操作。
              </p>

              <h2>5. 退款申请流程</h2>
              <p>如你认为符合上述退款例外情形，请在支付后尽快联系我们，并提供以下信息：</p>
              <ul>
                <li>订单号</li>
                <li>账号信息</li>
                <li>退款原因说明</li>
              </ul>
              <p>我们将在核实后与您沟通处理结果。</p>

              <h2>6. 联系我们</h2>
              <p>
                如对本退款政策有任何疑问，请通过以下方式联系我们：
                <a href={`mailto:${email}`}>{email}</a>。
              </p>
            </>
          ) : (
            <>
              <h2>1. Subscription Services and Access</h2>
              <p>
                Shader Learn provides subscription-based digital service access. Upon successful payment, users are
                granted immediate access to Pro features for the applicable subscription period. Because access to the
                service is provided immediately after payment, refunds are generally not offered, except in the
                specific circumstances outlined in this policy. We recommend reviewing available free content before
                purchasing.
              </p>

              <h2>2. Refund Exceptions</h2>
              <p>Refund requests may be considered, at our discretion, under the following circumstances:</p>
              <ul>
                <li>Duplicate charges or duplicate payments caused by system or technical errors</li>
                <li>
                  Successful payment where access to the subscribed services was not granted within a reasonable time
                  and the issue cannot be resolved after verification
                </li>
                <li>Situations where refunds are explicitly required by applicable laws or regulations</li>
              </ul>
              <p>
                The decision on whether a refund is issued, and the refund amount (if any), will be determined based on
                the specific circumstances.
              </p>

              <h2>3. Non-Refundable Situations</h2>
              <p>Refunds are generally not provided in the following cases:</p>
              <ul>
                <li>The user has received and used access to the subscription services</li>
                <li>The user voluntarily cancels the subscription during an active billing period</li>
                <li>
                  Refund requests based on personal reasons, including but not limited to accidental purchase, lack of
                  usage, or subjective dissatisfaction
                </li>
              </ul>
              <p>
                Cancellation of a subscription does not constitute a refund. After cancellation, users will continue to
                have access to the services until the end of the current paid subscription period.
              </p>

              <h2>4. Subscriptions and Automatic Renewal</h2>
              <p>
                The Platform offers subscription-based services with available billing periods of 3 months and 1 year.
                Subscriptions automatically renew and are charged at the end of each billing cycle unless canceled by
                the user before the current billing period ends. Users may manage or cancel subscriptions through the
                in-platform “Manage Subscription” entry, which redirects to the Creem Customer Portal, where payment
                methods can also be updated.
              </p>

              <h2>5. Refund Request Process</h2>
              <p>
                If you believe your situation qualifies for a refund under the exceptions above, please contact us as
                soon as possible after payment and provide the following information:
              </p>
              <ul>
                <li>Order number</li>
                <li>Account information</li>
                <li>Reason for the refund request</li>
              </ul>
              <p>We will review the request and communicate the outcome after verification.</p>

              <h2>6. Contact Us</h2>
              <p>
                If you have any questions regarding this Refund Policy, please contact us at:
                <a href={`mailto:${email}`}>{email}</a>.
              </p>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
