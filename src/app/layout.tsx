import './globals.css';

import { LanguageProvider } from '../contexts/LanguageContext';
import StructuredData from '../components/seo/structured-data';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <StructuredData
        type="website"
        data={{
          name: 'GLSL 学习平台',
          description: '专业的 GLSL 着色器编程学习平台，提供从基础到高级的完整学习路径',
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
  );
}
