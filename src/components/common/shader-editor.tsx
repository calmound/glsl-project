'use client';

import React, { useState } from 'react';
import CodeEditor from '../ui/code-editor';
import ShaderCanvas from './shader-canvas';
import { Button } from '@/components/ui/button';

interface ShaderEditorProps {
  initialFragmentShader: string;
  initialVertexShader?: string;
  width?: number | string;
  height?: number | string;
  editable?: boolean;
  onFragmentShaderChange?: (code: string) => void;
  onVertexShaderChange?: (code: string) => void;
}

const defaultVertexShader = `
attribute vec3 position;
varying vec2 vUv;

void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position, 1.0);
}
`;

const ShaderEditor: React.FC<ShaderEditorProps> = ({
  initialFragmentShader,
  initialVertexShader = defaultVertexShader,
  width = '100%',
  height = 400,
  editable = true,
}) => {
  // 本地状态，用于编辑器内部使用
  const [localFragmentShader, setLocalFragmentShader] = useState(initialFragmentShader);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileError, setCompileError] = useState<string | null>(null);
  const timeScale = 1.0; // 固定动画速度
  const [currentCode, setCurrentCode] = useState<string>(localFragmentShader);

  // 处理着色器代码更改 - 只更新本地状态
  const handleShaderChange = (code: string) => {
    setCurrentCode(code);
    // 清除之前的错误
    setCompileError(null);
  };

  // 编译着色器并更新预览
  const compileShader = () => {
    setIsCompiling(true);
    setTimeout(() => {
      // 编译时更新本地着色器代码
      setLocalFragmentShader(currentCode);
      setIsCompiling(false);
      setCompileError(null);
    }, 300);
  };

  // 重置着色器代码
  const resetShader = () => {
    setCurrentCode(initialFragmentShader);
    setLocalFragmentShader(initialFragmentShader);
    setCompileError(null);
  };

  return (
    <>
      {/* 着色器编辑器部分 */}
      <div className="mb-2" style={{ height: 'calc(100vh - 300px)' }}>
        <div className="flex space-x-3 mb-2">
          <Button variant="outline" onClick={compileShader} disabled={isCompiling}>
            {isCompiling ? '编译中...' : '运行'}
          </Button>
          <Button variant="outline" onClick={resetShader}>
            重置
          </Button>
          <div className="ml-auto">
            <span className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-700 rounded">
              GLSL 片段着色器
            </span>
          </div>
        </div>
        <div style={{ height: 'calc(100% - 50px)' }}>
          <CodeEditor
            initialCode={currentCode}
            onChange={handleShaderChange}
            readOnly={!editable}
          />
        </div>

        {compileError && (
          <div className="bg-red-50 text-red-700 p-3 rounded border border-red-200 text-sm">
            {compileError}
          </div>
        )}
      </div>

      {/* 着色器预览部分 */}
      <div className="bg-gray-900 rounded-lg overflow-hidden h-[200px]">
        <ShaderCanvas
          fragmentShader={localFragmentShader}
          vertexShader={defaultVertexShader}
          width={width}
          height={height}
          timeScale={timeScale}
          uniforms={{
            u_time: 0.0,
            u_resolution: [300, 300],
          }}
          onError={setCompileError}
        />
      </div>
    </>
  );
};

export default ShaderEditor;
