'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// 动态导入着色器展示组件
const ShaderShowcase = dynamic(() => import('./shader-showcase'), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map(id => (
        <div
          key={id}
          className="aspect-video bg-gray-200 rounded-lg animate-pulse flex items-center justify-center"
        >
          <div className="text-gray-400">加载中...</div>
        </div>
      ))}
    </div>
  ),
});

const ShaderShowcaseWrapper: React.FC = () => {
  return <ShaderShowcase />;
};

export default ShaderShowcaseWrapper;
