import { Metadata } from 'next';
import { getValidLocale } from '../../../lib/i18n';
import MainLayout from '../../../components/layout/main-layout';

interface GlslifyGuidePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: GlslifyGuidePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = getValidLocale(localeParam);

  const title = 'Glslify Guide - GLSL Library Management';
  const description =
    locale === 'zh'
      ? 'Glslify 是一个 GLSL 模块化管理工具，帮助您组织和重用 GLSL 代码。学习如何使用 Glslify 来提高您的着色器开发效率。'
      : 'Glslify is a GLSL module management tool that helps you organize and reuse GLSL code. Learn how to use Glslify to improve your shader development efficiency.';

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';
  const url = locale === 'en' ? `${baseUrl}/glslify-guide` : `${baseUrl}/${locale}/glslify-guide`;

  return {
    title,
    description,
    keywords:
      locale === 'zh'
        ? 'Glslify, GLSL, 模块化, 着色器, 代码重用, WebGL'
        : 'Glslify, GLSL, modular, shader, code reuse, WebGL',
    openGraph: {
      title,
      description,
      type: 'article',
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
      canonical: locale === 'en' ? '/glslify-guide' : `/${locale}/glslify-guide`,
      languages: {
        en: '/glslify-guide',
        zh: '/zh/glslify-guide',
      },
    },
  };
}

export default async function GlslifyGuidePage({ params }: GlslifyGuidePageProps) {
  const { locale: localeParam } = await params;
  const locale = getValidLocale(localeParam);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">
            {locale === 'zh' ? 'Glslify 指南' : 'Glslify Guide'}
          </h1>

          <div className="prose prose-lg max-w-none">
            {locale === 'zh' ? (
              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">什么是 Glslify？</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Glslify 是一个 GLSL 模块化管理工具，允许您将 GLSL 代码分解为可重用的模块。
                    它类似于 JavaScript 的模块系统，让您可以 import 和 export GLSL 函数和变量。
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">为什么使用 Glslify？</h2>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>代码重用：避免重复编写相同的函数</li>
                    <li>模块化：将复杂的着色器分解为小的、可管理的部分</li>
                    <li>维护性：更容易更新和维护代码</li>
                    <li>社区库：可以使用社区贡献的 GLSL 模块</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">基本使用方法</h2>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">1. 安装 Glslify</h3>
                    <pre className="bg-black text-green-400 p-3 rounded text-sm">
                      npm install -g glslify
                    </pre>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg mt-4">
                    <h3 className="font-semibold mb-2">2. 创建模块</h3>
                    <pre className="bg-black text-green-400 p-3 rounded text-sm">
                      {`// noise.glsl
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

#pragma glslify: export(random)`}
                    </pre>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg mt-4">
                    <h3 className="font-semibold mb-2">3. 使用模块</h3>
                    <pre className="bg-black text-green-400 p-3 rounded text-sm">
                      {`// main.glsl
#pragma glslify: random = require('./noise.glsl')

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  float noise = random(uv);
  gl_FragColor = vec4(vec3(noise), 1.0);
}`}
                    </pre>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">在本项目中的应用</h2>
                  <p className="text-gray-700 leading-relaxed">
                    本学习平台已经集成了 Glslify，您可以在教程中看到如何使用它来组织和重用 GLSL
                    代码。 我们提供了一些常用的 GLSL 模块，包括数学函数、噪声函数和颜色工具。
                  </p>
                </section>
              </div>
            ) : (
              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">What is Glslify?</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Glslify is a GLSL module management tool that allows you to break down GLSL code
                    into reusable modules. It&apos;s similar to JavaScript&apos;s module system,
                    allowing you to import and export GLSL functions and variables.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Why Use Glslify?</h2>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Code reuse: Avoid rewriting the same functions</li>
                    <li>Modularity: Break complex shaders into small, manageable parts</li>
                    <li>Maintainability: Easier to update and maintain code</li>
                    <li>Community libraries: Use community-contributed GLSL modules</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Basic Usage</h2>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">1. Install Glslify</h3>
                    <pre className="bg-black text-green-400 p-3 rounded text-sm">
                      npm install -g glslify
                    </pre>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg mt-4">
                    <h3 className="font-semibold mb-2">2. Create a Module</h3>
                    <pre className="bg-black text-green-400 p-3 rounded text-sm">
                      {`// noise.glsl
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

#pragma glslify: export(random)`}
                    </pre>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg mt-4">
                    <h3 className="font-semibold mb-2">3. Use the Module</h3>
                    <pre className="bg-black text-green-400 p-3 rounded text-sm">
                      {`// main.glsl
#pragma glslify: random = require('./noise.glsl')

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  float noise = random(uv);
  gl_FragColor = vec4(vec3(noise), 1.0);
}`}
                    </pre>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Application in This Project</h2>
                  <p className="text-gray-700 leading-relaxed">
                    This learning platform has integrated Glslify, and you can see how to use it to
                    organize and reuse GLSL code in the tutorials. We provide some common GLSL
                    modules, including math functions, noise functions, and color utilities.
                  </p>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
