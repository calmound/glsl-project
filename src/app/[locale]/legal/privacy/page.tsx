import { Metadata } from 'next';
import MainLayout from '../../../../components/layout/main-layout';
import { getValidLocale } from '../../../../lib/i18n';

interface PrivacyPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = getValidLocale(localeParam);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';
  const title = locale === 'zh' ? '隐私政策 - Shader Learn' : 'Privacy Policy - Shader Learn';
  const description =
    locale === 'zh'
      ? 'Shader Learn 隐私政策，说明我们如何收集、使用与保护你的个人信息。'
      : 'Shader Learn Privacy Policy describing how we collect, use, and protect your information.';

  const canonical = locale === 'en' ? '/legal/privacy' : `/${locale}/legal/privacy`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: '/legal/privacy',
        'zh-CN': '/zh/legal/privacy',
        'x-default': '/legal/privacy',
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
          alt: 'Shader Learn Privacy Policy',
        },
      ],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    },
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale: localeParam } = await params;
  const locale = getValidLocale(localeParam);
  const email = 'shaderlearn@hotmail.com';

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {locale === 'zh' ? '隐私政策' : 'Privacy Policy'}
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          {locale === 'zh' ? '最后更新：2025-12-20' : 'Last updated: 2025-12-20'}
        </p>

        <div className="prose prose-lg max-w-none text-gray-700">
          {locale === 'zh' ? (
            <>
              <h2>1. 我们收集的信息</h2>
              <ul>
                <li>账号信息：邮箱、昵称或第三方登录标识。</li>
                <li>使用数据：访问页面、学习进度、设备与浏览器信息。</li>
                <li>支付信息：由 Creem 处理的支付记录与交易标识（我们不会保存完整的银行卡信息）。</li>
              </ul>

              <h2>2. 信息的使用</h2>
              <p>
                我们使用这些信息来提供服务、开通权限、处理支付、改进内容、以及提供客户支持。
              </p>

              <h2>3. 第三方服务</h2>
              <p>
                支付由 Creem 提供，我们会与其共享必要的交易与身份标识信息。第三方服务的使用受其隐私政策约束。
              </p>

              <h2>4. 数据存储与安全</h2>
              <p>
                我们采取合理的技术措施保护你的数据，但无法保证绝对安全。请妥善保管你的账号信息。
              </p>

              <h2>5. 你的权利</h2>
              <p>
                你可以通过联系我们来访问、更正或删除你的个人信息（在法律允许的范围内）。
              </p>

              <h2>6. Cookie 与分析</h2>
              <p>
                我们可能使用 Cookie 和分析工具来改善体验。你可以在浏览器设置中管理 Cookie。
              </p>

              <h2>7. 未成年人保护</h2>
              <p>
                若你未满 18 岁，请在监护人同意下使用本平台。
              </p>

              <h2>8. 联系我们</h2>
              <p>
                如有隐私相关问题，请联系 <a href={`mailto:${email}`}>{email}</a>。
              </p>
            </>
          ) : (
            <>
              <h2>1. Information We Collect</h2>
              <ul>
                <li>Account data: email, display name, or third-party login identifiers.</li>
                <li>Usage data: pages visited, learning progress, device and browser info.</li>
                <li>Payment data: transaction records and identifiers processed by Creem (we do not store full card details).</li>
              </ul>

              <h2>2. How We Use Information</h2>
              <p>
                We use information to deliver services, grant access, process payments, improve content, and provide support.
              </p>

              <h2>3. Third-Party Services</h2>
              <p>
                Payments are processed by Creem. We share necessary transaction and identity identifiers with Creem. Their
                services are governed by their own privacy policies.
              </p>

              <h2>4. Data Storage & Security</h2>
              <p>
                We use reasonable measures to protect your data, but no method is 100% secure. Please protect your account credentials.
              </p>

              <h2>5. Your Rights</h2>
              <p>
                You may request access, correction, or deletion of your personal data where permitted by law.
              </p>

              <h2>6. Cookies & Analytics</h2>
              <p>
                We may use cookies and analytics tools to improve the experience. You can manage cookies in your browser settings.
              </p>

              <h2>7. Children</h2>
              <p>
                If you are under 18, please use the Platform with consent from a parent or guardian.
              </p>

              <h2>8. Contact</h2>
              <p>
                For privacy inquiries, contact <a href={`mailto:${email}`}>{email}</a>.
              </p>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
