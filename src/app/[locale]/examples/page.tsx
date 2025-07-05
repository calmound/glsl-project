import { Metadata } from 'next';
import { getValidLocale } from '../../../lib/i18n';
import MainLayout from '../../../components/layout/main-layout';

interface ExamplesPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: ExamplesPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = getValidLocale(localeParam);

  const title =
    locale === 'zh' ? 'GLSL 示例 - 着色器编程实例' : 'GLSL Examples - Shader Programming Samples';
  const description =
    locale === 'zh'
      ? '浏览各种 GLSL 着色器示例，包括基础几何、动画效果、光照和材质等。每个示例都包含完整的代码和详细解释。'
      : 'Browse various GLSL shader examples, including basic geometry, animation effects, lighting and materials. Each example includes complete code and detailed explanations.';

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';
  const url = locale === 'en' ? `${baseUrl}/examples` : `${baseUrl}/${locale}/examples`;

  return {
    title,
    description,
    keywords:
      locale === 'zh'
        ? 'GLSL示例, 着色器示例, WebGL示例, 图形编程, 视觉效果'
        : 'GLSL examples, shader examples, WebGL examples, graphics programming, visual effects',
    openGraph: {
      title,
      description,
      type: 'website',
      url,
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
      canonical: locale === 'en' ? '/examples' : `/${locale}/examples`,
      languages: {
        en: '/examples',
        zh: '/zh/examples',
      },
    },
  };
}

export default async function ExamplesPage({ params }: ExamplesPageProps) {
  const { locale: localeParam } = await params;
  const locale = getValidLocale(localeParam);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">
            {locale === 'zh' ? 'GLSL 示例' : 'GLSL Examples'}
          </h1>

          <div className="text-center mb-12">
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {locale === 'zh'
                ? '浏览各种 GLSL 着色器示例，从基础几何到复杂的视觉效果。每个示例都包含完整的代码和详细的解释。'
                : 'Browse various GLSL shader examples, from basic geometry to complex visual effects. Each example includes complete code and detailed explanations.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 基础几何 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">
                {locale === 'zh' ? '基础几何' : 'Basic Geometry'}
              </h3>
              <p className="text-gray-600 mb-4">
                {locale === 'zh'
                  ? '学习如何创建基本的几何形状，如圆形、矩形和三角形。'
                  : 'Learn how to create basic geometric shapes like circles, rectangles, and triangles.'}
              </p>
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                {locale === 'zh' ? '查看示例' : 'View Examples'}
              </button>
            </div>

            {/* 颜色与渐变 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 rounded-lg mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">
                {locale === 'zh' ? '颜色与渐变' : 'Colors & Gradients'}
              </h3>
              <p className="text-gray-600 mb-4">
                {locale === 'zh'
                  ? '探索颜色混合、渐变效果和色彩空间转换。'
                  : 'Explore color blending, gradient effects, and color space conversions.'}
              </p>
              <button className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors">
                {locale === 'zh' ? '查看示例' : 'View Examples'}
              </button>
            </div>

            {/* 动画效果 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">
                {locale === 'zh' ? '动画效果' : 'Animation Effects'}
              </h3>
              <p className="text-gray-600 mb-4">
                {locale === 'zh'
                  ? '创建动态的视觉效果，包括旋转、缩放和波浪动画。'
                  : 'Create dynamic visual effects including rotation, scaling, and wave animations.'}
              </p>
              <button className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors">
                {locale === 'zh' ? '查看示例' : 'View Examples'}
              </button>
            </div>

            {/* 噪声与纹理 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">
                {locale === 'zh' ? '噪声与纹理' : 'Noise & Textures'}
              </h3>
              <p className="text-gray-600 mb-4">
                {locale === 'zh'
                  ? '使用噪声函数创建复杂的纹理和程序化图案。'
                  : 'Use noise functions to create complex textures and procedural patterns.'}
              </p>
              <button className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors">
                {locale === 'zh' ? '查看示例' : 'View Examples'}
              </button>
            </div>

            {/* 光照与材质 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">
                {locale === 'zh' ? '光照与材质' : 'Lighting & Materials'}
              </h3>
              <p className="text-gray-600 mb-4">
                {locale === 'zh'
                  ? '实现真实的光照模型和各种材质效果。'
                  : 'Implement realistic lighting models and various material effects.'}
              </p>
              <button className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors">
                {locale === 'zh' ? '查看示例' : 'View Examples'}
              </button>
            </div>

            {/* 后处理效果 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">
                {locale === 'zh' ? '后处理效果' : 'Post-Processing'}
              </h3>
              <p className="text-gray-600 mb-4">
                {locale === 'zh'
                  ? '学习模糊、色彩校正和其他后处理技术。'
                  : 'Learn blur, color correction, and other post-processing techniques.'}
              </p>
              <button className="w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition-colors">
                {locale === 'zh' ? '查看示例' : 'View Examples'}
              </button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              {locale === 'zh' ? '更多示例正在开发中...' : 'More examples are in development...'}
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold mb-2 text-blue-800">
                {locale === 'zh' ? '贡献示例' : 'Contribute Examples'}
              </h3>
              <p className="text-blue-700">
                {locale === 'zh'
                  ? '如果您有有趣的 GLSL 示例想要分享，欢迎提交您的作品！'
                  : 'If you have interesting GLSL examples to share, we welcome your contributions!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
