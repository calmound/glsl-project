import './globals.css';

import { LanguageProvider } from '../contexts/LanguageContext';
import StructuredData from '../components/seo/structured-data';
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {/* Google tag (gtag.js) 使用 next/script */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-6X7J4WLHJ6"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);} 
              gtag('js', new Date());
              gtag('config', 'G-6X7J4WLHJ6', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <LanguageProvider>
          <StructuredData
            type="website"
            data={{
              name: 'GLSL 学习平台',
              description:
                '专业的 GLSL 着色器编程学习平台，提供从基础到高级的完整学习路径',
              url: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com',
            }}
          />
          <StructuredData
            type="organization"
            data={{
              name: 'GLSL Learning Platform',
            }}
          />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
