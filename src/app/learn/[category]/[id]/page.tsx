'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '../../../../components/layout/main-layout';
import { Button } from '@/components/ui/button';

import { usePathname, useRouter } from 'next/navigation';
import { ShaderExample, getShaderById, loadShaderFromFile } from '../../../../lib/shader-data';
import ShaderCanvasNew from '../../../../components/common/shader-canvas-new';
import ShaderEditor from '../../../../components/common/shader-editor';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

// 着色器详情页面
export default function ShaderDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  // 从路径中提取参数
  const segments = pathname.split('/');
  const category = segments[2];
  const id = segments[3];

  const [shader, setShader] = useState<ShaderExample | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fragmentShader, setFragmentShader] = useState<string>('');
  const [vertexShader, setVertexShader] = useState<string>('');

  // 处理着色器数据的辅助函数
  const processShaderData = (shaderData: ShaderExample) => {
    console.log('处理着色器数据:', shaderData);
    setShader(shaderData);

    // 设置正确的着色器代码
    const fragmentCode = shaderData.fragmentShader || '';
    const vertexCode = shaderData.vertexShader || '';

    console.log('片段着色器代码:', fragmentCode.substring(0, 100) + '...');
    console.log('顶点着色器代码:', vertexCode ? vertexCode.substring(0, 100) + '...' : '无');

    setFragmentShader(fragmentCode);
    setVertexShader(vertexCode);

    setLoading(false);
  };

  // 加载着色器数据
  useEffect(() => {
    setLoading(true);
    setError(null);

    const loadShader = async () => {
      try {
        // 优先尝试从预定义数据获取
        const shaderData = getShaderById(id) || (await loadShaderFromFile(category, id));

        if (shaderData) {
          processShaderData(shaderData);
        } else {
          setError(`找不到ID为 "${id}" 的着色器`);
          setLoading(false);
        }
      } catch (err) {
        console.error('加载着色器时出错:', err);
        setError('加载着色器时发生错误');
        setLoading(false);
      }
    };

    loadShader();
  }, [category, id]);

  // 重置参数到默认值

  // 处理着色器代码更新
  const handleFragmentShaderChange = (code: string) => {
    setFragmentShader(code);
  };

  const handleVertexShaderChange = (code: string) => {
    setVertexShader(code);
  };

  // 返回列表页
  const handleBack = () => {
    router.push(`/learn/${category}`);
  };

  // 删除或修改有问题的console.log
  // 安全的日志记录方式
  useEffect(() => {
    if (shader) {
      console.log('Shader loaded successfully');
    }
  }, [shader]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="h-6 w-40 bg-gray-300 rounded mx-auto mb-4"></div>
              <p className="text-lg text-gray-500">正在加载着色器示例...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !shader) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="text-center py-12">
            <p className="text-lg text-red-500">{error || '找不到该着色器示例'}</p>
            <Button
              variant="primary"
              size="md"
              className="mt-4"
              handleClick={() => router.push('/learn')}
            >
              返回学习中心
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex overflow-hidden">
        {/* 左侧区域：简洁侧边栏 */}
        <div
          style={{ height: 'calc(100vh - 61px)' }}
          className="w-2/5 border-r bg-white flex flex-col "
        >
          {/* 返回按钮和标题 */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" handleClick={handleBack}>
                返回
              </Button>
              <h1 className="text-lg font-semibold">{shader.title}</h1>
            </div>
          </div>

          {/* 着色器详情信息 */}
          <div className="flex-1 overflow-auto p-4">
            <div className="text-sm text-gray-600 mb-6">{shader.description}</div>

            {/* 正确效果预览区 */}
            <div className="mb-4">
              <h3 className="text-md font-medium mb-2">预期效果</h3>
              <div
                className="border rounded-md shadow-sm overflow-hidden"
                style={{ height: '300px' }}
              >
                {/* 使用新版本的ShaderCanvas */}
                <ShaderCanvasNew
                  fragmentShader={fragmentShader}
                  vertexShader={vertexShader || undefined}
                  uniforms={{
                    u_time: 0.1,
                    u_resolution: [300, 300],
                  }}
                  width="100%"
                  height="100%"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 右侧区域：代码编辑和预览效果 - 使用更多空间 */}
        <div className="w-3/5 flex flex-col h-full bg-gray-50 px-2">
          <div className="flex-1 flex flex-col overflow-hidden w-full">
            {/* 代码编辑器 - 占据70%高度 */}
            <ShaderEditor
              initialFragmentShader={fragmentShader}
              initialVertexShader={vertexShader}
              width="100%"
              height="100%"
              editable={true}
              onFragmentShaderChange={handleFragmentShaderChange}
              onVertexShaderChange={handleVertexShaderChange}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
