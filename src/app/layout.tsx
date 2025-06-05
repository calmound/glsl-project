import './globals.css';

import { LanguageProvider } from '../contexts/LanguageContext';
import StructuredData from '../components/seo/structured-data';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        {/* 基础 Meta 标签 */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>GLSL Learning - Professional Shader Programming Platform</title>
        <meta name="description" content="Professional GLSL shader programming learning platform, providing complete learning paths from basic to advanced. Master modern graphics programming skills through hands-on practice and deep understanding of WebGL and shader development." />
        <meta name="keywords" content="GLSL, WebGL, Shader, Graphics Programming, Tutorial, Learning, Fragment Shader, Vertex Shader, WebGL Programming" />
        <meta name="author" content="GLSL Learning Platform" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_BASE_URL || "https://www.shader-learn.com"} />
        
        {/* 预连接优化 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        
        {/* 安全性头部 */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* PWA 支持 */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GLSL 学习" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-6X7J4WLHJ6"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-6X7J4WLHJ6', {
                page_title: document.title,
                page_location: window.location.href
              });
            `
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <LanguageProvider>
          <StructuredData 
            type="website" 
            data={{
              name: "GLSL 学习平台",
              description: "专业的 GLSL 着色器编程学习平台，提供从基础到高级的完整学习路径",
              url: process.env.NEXT_PUBLIC_BASE_URL || "https://www.shader-learn.com"
            }} 
          />
          <StructuredData 
            type="organization" 
            data={{
              name: "GLSL Learning Platform"
            }} 
          />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
