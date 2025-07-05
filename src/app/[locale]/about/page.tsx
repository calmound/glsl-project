import { Metadata } from 'next';
import { getValidLocale } from '../../../lib/i18n';
import MainLayout from '../../../components/layout/main-layout';

interface AboutPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = getValidLocale(localeParam);

  const title = locale === 'zh' ? '关于我们 - GLSL 学习平台' : 'About Us - GLSL Learning Platform';
  const description =
    locale === 'zh'
      ? '了解 GLSL 学习平台的使命和愿景。我们致力于为开发者提供最好的着色器编程学习体验，让图形编程变得更加简单易懂。'
      : 'Learn about the mission and vision of GLSL Learning Platform. We are committed to providing developers with the best shader programming learning experience, making graphics programming more accessible and understandable.';

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';

  return {
    title,
    description,
    keywords:
      locale === 'zh'
        ? '关于我们, GLSL平台, 着色器学习, 图形编程教育, WebGL教程'
        : 'about us, GLSL platform, shader learning, graphics programming education, WebGL tutorials',
    openGraph: {
      title,
      description,
      type: 'website',
      url: locale === 'en' ? `${baseUrl}/about` : `${baseUrl}/${locale}/about`,
      images: [`${baseUrl}/og-image.png`],
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.png`],
    },
    alternates: {
      canonical: locale === 'en' ? '/about' : `/${locale}/about`,
      languages: {
        en: '/about',
        zh: '/zh/about',
      },
    },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: localeParam } = await params;
  const locale = getValidLocale(localeParam);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">
            {locale === 'zh' ? '关于我们' : 'About Us'}
          </h1>

          <div className="prose prose-lg max-w-none">
            {locale === 'zh' ? (
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">我们的使命</h2>
                  <p className="text-gray-700 leading-relaxed">
                    GLSL 学习平台致力于为开发者提供最全面、最易懂的着色器编程学习资源。
                    我们相信图形编程不应该是高不可攀的技术，而应该是每个开发者都能掌握的技能。
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">我们的愿景</h2>
                  <p className="text-gray-700 leading-relaxed">
                    成为全球领先的 GLSL 和 WebGL 学习平台，帮助更多开发者掌握现代图形编程技术，
                    创造出令人惊叹的视觉体验。
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">我们提供什么</h2>
                  <ul className="space-y-3 text-gray-700">
                    <li>
                      🎯 <strong>循序渐进的教程</strong> - 从基础概念到高级技术
                    </li>
                    <li>
                      🔧 <strong>在线编辑器</strong> - 实时编写和测试 GLSL 代码
                    </li>
                    <li>
                      📚 <strong>丰富的示例</strong> - 涵盖各种应用场景
                    </li>
                    <li>
                      🌐 <strong>中英双语</strong> - 服务全球开发者
                    </li>
                    <li>
                      📖 <strong>详细文档</strong> - 完整的API和函数参考
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">为什么选择我们</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="font-semibold mb-2">专业性</h3>
                      <p className="text-sm text-gray-700">
                        内容由经验丰富的图形编程专家编写，确保技术准确性
                      </p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="font-semibold mb-2">实用性</h3>
                      <p className="text-sm text-gray-700">
                        所有教程都配有实际案例，学完即可应用到项目中
                      </p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-lg">
                      <h3 className="font-semibold mb-2">互动性</h3>
                      <p className="text-sm text-gray-700">在线编辑器让您可以即时验证学习成果</p>
                    </div>
                    <div className="bg-orange-50 p-6 rounded-lg">
                      <h3 className="font-semibold mb-2">持续更新</h3>
                      <p className="text-sm text-gray-700">定期更新内容，跟上技术发展的最新趋势</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">联系我们</h2>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-700 mb-4">
                      如果您有任何问题、建议或想要合作，欢迎联系我们：
                    </p>
                    <div className="space-y-2 text-gray-700">
                      <p>📧 邮箱：contact@shader-learn.com</p>
                      <p>🐛 问题反馈：通过 GitHub Issues</p>
                      <p>💬 讨论交流：加入我们的社区</p>
                    </div>
                  </div>
                </section>
              </div>
            ) : (
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                  <p className="text-gray-700 leading-relaxed">
                    GLSL Learning Platform is dedicated to providing developers with the most
                    comprehensive and accessible shader programming learning resources. We believe
                    that graphics programming should not be an insurmountable technology, but a
                    skill that every developer can master.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
                  <p className="text-gray-700 leading-relaxed">
                    To become the world&apos;s leading GLSL and WebGL learning platform, helping
                    more developers master modern graphics programming techniques and create
                    stunning visual experiences.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
                  <ul className="space-y-3 text-gray-700">
                    <li>
                      🎯 <strong>Progressive Tutorials</strong> - From basic concepts to advanced
                      techniques
                    </li>
                    <li>
                      🔧 <strong>Online Editor</strong> - Write and test GLSL code in real-time
                    </li>
                    <li>
                      📚 <strong>Rich Examples</strong> - Covering various application scenarios
                    </li>
                    <li>
                      🌐 <strong>Bilingual Support</strong> - Serving global developers
                    </li>
                    <li>
                      📖 <strong>Detailed Documentation</strong> - Complete API and function
                      reference
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="font-semibold mb-2">Professional</h3>
                      <p className="text-sm text-gray-700">
                        Content written by experienced graphics programming experts, ensuring
                        technical accuracy
                      </p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="font-semibold mb-2">Practical</h3>
                      <p className="text-sm text-gray-700">
                        All tutorials come with practical examples that can be applied to projects
                        immediately
                      </p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-lg">
                      <h3 className="font-semibold mb-2">Interactive</h3>
                      <p className="text-sm text-gray-700">
                        Online editor allows you to instantly verify your learning outcomes
                      </p>
                    </div>
                    <div className="bg-orange-50 p-6 rounded-lg">
                      <h3 className="font-semibold mb-2">Up-to-date</h3>
                      <p className="text-sm text-gray-700">
                        Regular content updates to keep up with the latest technology trends
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-700 mb-4">
                      If you have any questions, suggestions, or would like to collaborate, please
                      contact us:
                    </p>
                    <div className="space-y-2 text-gray-700">
                      <p>📧 Email: contact@shader-learn.com</p>
                      <p>🐛 Bug Reports: Through GitHub Issues</p>
                      <p>💬 Discussion: Join our community</p>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
