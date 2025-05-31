import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">GLSL 项目</h1>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <a href="/" className="text-gray-600 hover:text-primary transition-colors">
                  首页
                </a>
              </li>
              <li>
                <a href="/learn" className="text-gray-600 hover:text-primary transition-colors">
                  学习
                </a>
              </li>
              <li>
                <a href="/glslify-guide" className="text-gray-600 hover:text-primary transition-colors">
                  Glslify 指南
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-600 hover:text-primary transition-colors">
                  关于
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow  mx-auto w-full">{children}</main>

      {/* <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-lg font-semibold mb-4">GLSL 项目</h2>
              <p className="text-gray-300">一个基于 WebGL 和 GLSL 的图形渲染项目</p>
            </div>
            <div>
              <h3 className="text-md font-semibold mb-3">链接</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://github.com"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="/docs" className="text-gray-300 hover:text-white transition-colors">
                    文档
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400">
            <p>© {new Date().getFullYear()} GLSL 项目. 保留所有权利。</p>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default MainLayout;
