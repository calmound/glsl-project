import { Metadata } from 'next';
import MainLayout from '../../../../components/layout/main-layout';
import { getValidLocale } from '../../../../lib/i18n';

interface TermsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = getValidLocale(localeParam);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';
  const title = locale === 'zh' ? '服务条款 - Shader Learn' : 'Terms of Service - Shader Learn';
  const description =
    locale === 'zh'
      ? 'Shader Learn 平台服务条款，包含使用规则、付费与权限说明、责任限制等内容。'
      : 'Shader Learn Terms of Service, including usage rules, payment/access terms, and limitation of liability.';

  const canonical = locale === 'en' ? '/legal/terms' : `/${locale}/legal/terms`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: '/legal/terms',
        'zh-CN': '/zh/legal/terms',
        'x-default': '/legal/terms',
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
          alt: 'Shader Learn Terms of Service',
        },
      ],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    },
  };
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale: localeParam } = await params;
  const locale = getValidLocale(localeParam);
  const email = 'support@shader-learn.com';
  const refundPath = locale === 'en' ? '/legal/refund' : `/${locale}/legal/refund`;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {locale === 'zh' ? '服务条款' : 'Terms of Service'}
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          {locale === 'zh' ? '最后更新：2025-12-20' : 'Last updated: 2025-12-20'}
        </p>

        <div className="prose prose-lg max-w-none text-gray-700">
          {locale === 'zh' ? (
            <>
              <h2>1. 接受条款</h2>
              <p>
                欢迎使用 Shader Learn（以下简称“本平台”）。访问或使用本平台即表示你已阅读、理解并同意本服务条款及相关政策（包括隐私政策与退款政策）。
                如你不同意本条款的任何内容，请停止使用本平台。
              </p>

              <h2>2. 服务内容</h2>
              <p>
                本平台提供与 GLSL / 图形编程相关的学习内容，包括但不限于教程、示例代码、在线编辑器及练习功能。
                我们可能不定期对服务内容进行更新、调整或优化。
              </p>

              <h2>3. 账号与访问</h2>
              <p>
                用户需自行负责账号信息的安全，并对通过其账号进行的所有活动承担责任。
                若发现异常使用或违反本条款的行为，我们有权在必要时限制、暂停或终止相关访问权限。
              </p>

              <h2>4. 付费与权限</h2>
              <p>本平台提供订阅制付费服务。当前可选的订阅周期包括：</p>
              <ul>
                <li>3 个月订阅（USD 9.99）</li>
                <li>1 年订阅（USD 29.9）</li>
              </ul>
              <p>
                订阅服务将在每个计费周期结束时自动续费并扣费，除非用户在当前计费周期结束前主动取消订阅。成功支付后，用户将在对应的订阅周期内获得 Pro 权益访问权限。
              </p>
              <p>所有价格、计费周期及自动续费信息均会在支付页面明确展示，并在用户确认后生效。</p>

              <h2>5. 订阅管理与取消</h2>
              <p>
                用户可通过站内“管理订阅”入口进入 Creem 客户门户，对订阅进行取消、更新支付方式等操作。取消订阅后，订阅通常会在当前已支付周期结束后生效，在此之前用户仍可继续使用已购买的服务权益。
              </p>

              <h2>6. 退款</h2>
              <p>
                退款规则请参考本平台的 <a href={refundPath}>退款政策</a>。订阅服务的取消不等同于退款，是否支持退款及退款条件将以退款政策为准。如需申请退款，请联系我们并提供相关订单信息。
              </p>

              <h2>7. 用户行为规范</h2>
              <p>用户在使用本平台时，不得从事包括但不限于以下行为：</p>
              <ul>
                <li>上传、发布违法、侵权或有害内容</li>
                <li>尝试破坏平台的正常运行、安全机制或绕过访问控制</li>
                <li>以自动化方式恶意抓取内容或滥用平台资源</li>
              </ul>
              <p>如发现上述行为，我们有权采取限制访问、终止服务等措施。</p>

              <h2>8. 知识产权</h2>
              <p>
                本平台所提供的课程内容、代码示例、文本、商标及视觉设计等均受相关法律保护。未经许可，任何形式的复制、分发、修改或商业使用均被禁止。
              </p>

              <h2>9. 免责声明与责任限制</h2>
              <p>
                本平台按“现状”提供服务。在法律允许的范围内，我们不对因使用或无法使用本平台而产生的任何间接、附带或后果性损失承担责任。
                对于任何与本服务相关的索赔，我们的累计责任不超过用户在相关服务中实际支付的金额。
              </p>

              <h2>10. 条款变更</h2>
              <p>
                我们可能不时更新本服务条款。更新后的条款将在本平台公布，若你在条款生效后继续使用本平台，即视为你已接受更新后的条款。
                对于重大变更，我们可能通过站内提示或电子邮件进行通知。
              </p>

              <h2>11. 联系我们</h2>
              <p>
                如对本服务条款有任何疑问，请通过以下方式联系我们：<a href={`mailto:${email}`}>{email}</a>。
              </p>
            </>
          ) : (
            <>
              <h2>1. Acceptance of Terms</h2>
              <p>
                Welcome to Shader Learn (“the Platform”). By accessing or using the Platform, you acknowledge that you
                have read, understood, and agree to be bound by these Terms of Service and related policies, including
                the Privacy Policy and Refund Policy. If you do not agree to any part of these Terms, please discontinue
                use of the Platform.
              </p>

              <h2>2. Services</h2>
              <p>
                Shader Learn provides learning resources related to GLSL and graphics programming, including but not
                limited to tutorials, sample code, an online editor, and practice features. We may update, modify, or
                improve the services from time to time.
              </p>

              <h2>3. Accounts and Access</h2>
              <p>
                You are responsible for maintaining the security of your account credentials and for all activities
                conducted under your account. If abnormal usage or violations of these Terms are identified, we reserve
                the right to restrict, suspend, or terminate access as necessary.
              </p>

              <h2>4. Payments and Access Rights</h2>
              <p>The Platform offers subscription-based paid services. The currently available subscription plans include:</p>
              <ul>
                <li>3-month subscription (USD 9.99)</li>
                <li>1-year subscription (USD 29.99)</li>
              </ul>
              <p>
                Subscriptions will automatically renew and be charged at the end of each billing cycle unless you cancel
                the subscription before the current billing period ends. Upon successful payment, you will be granted
                access to Pro features for the duration of the applicable subscription period.
              </p>
              <p>
                All prices, billing intervals, and automatic renewal details are clearly displayed on the payment page
                and take effect only after your confirmation.
              </p>

              <h2>5. Subscription Management and Cancellation</h2>
              <p>
                You may manage or cancel your subscription through the in-platform “Manage Subscription” entry, which
                redirects to the Creem Customer Portal, where you can cancel subscriptions or update payment methods.
                Cancellation generally takes effect at the end of the current paid billing period, and you will continue
                to have access to the subscribed services until that period expires.
              </p>

              <h2>6. Refunds</h2>
              <p>
                Refund rules are governed by the Platform’s <a href={refundPath}>Refund Policy</a>. Cancellation of a
                subscription does not automatically entitle you to a refund. Refund eligibility and conditions, if any,
                are subject to the Refund Policy. To request a refund, please contact us and provide the relevant order
                information.
              </p>

              <h2>7. Acceptable Use</h2>
              <ul>
                <li>Uploading or distributing unlawful, infringing, or harmful content</li>
                <li>Attempting to disrupt the Platform’s operation, security mechanisms, or access controls</li>
                <li>Abusing the service through automated scraping or excessive resource consumption</li>
              </ul>
              <p>
                We reserve the right to take appropriate actions, including restricting access or terminating services,
                in response to such violations.
              </p>

              <h2>8. Intellectual Property</h2>
              <p>
                All content provided on the Platform, including courses, code examples, text, trademarks, and visual
                designs, is protected by applicable intellectual property laws. Any unauthorized copying, distribution,
                modification, or commercial use is strictly prohibited.
              </p>

              <h2>9. Disclaimer and Limitation of Liability</h2>
              <p>
                The Platform is provided on an “as is” basis. To the maximum extent permitted by law, we shall not be
                liable for any indirect, incidental, or consequential damages arising from the use of or inability to
                use the Platform, including data loss or business interruption. Our total liability for any claim
                related to the services shall not exceed the amount actually paid by you for the relevant service.
              </p>

              <h2>10. Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time. Updated terms will be posted on the Platform, and continued
                use after the effective date constitutes acceptance of the revised Terms. Material changes may be
                notified via in-platform notices or email.
              </p>

              <h2>11. Contact Us</h2>
              <p>
                If you have any questions regarding these Terms of Service, please contact us at:
                <a href={`mailto:${email}`}>{email}</a>.
              </p>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
