'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ToastContainer } from '@/components/ui/toast';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { type Locale } from '../../../../../lib/i18n';
import ShaderCanvasNew from '../../../../../components/common/shader-canvas-new';
import CodeEditor from '../../../../../components/ui/code-editor';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

interface TutorialPageClientProps {
  tutorial: Tutorial;
  readme: string;
  shaders: {
    fragment: string;
    vertex: string;
    exercise: string;
  };
  locale: Locale;
  category: string;
  tutorialId: string;
}

export default function TutorialPageClient({
  tutorial,
  readme,
  shaders,
  locale,
}: TutorialPageClientProps) {
  const router = useRouter();
  const { t } = useLanguage();
  // 优先使用练习代码，确保学员看到需要补全的代码
  const exerciseCode = shaders.exercise || shaders.fragment;
  const [userCode, setUserCode] = useState(exerciseCode);
  const [initialCode] = useState(exerciseCode);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [toasts, setToasts] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
  }>>([]);

  // Toast 管理函数
  const addToast = (message: string, type: 'success' | 'error' | 'info', duration = 3000) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // WebGL 着色器编译验证
  const validateShaderWithWebGL = (fragmentShaderCode: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!fragmentShaderCode.trim()) {
      errors.push('error: empty shader source');
      return { isValid: false, errors };
    }

    try {
      // 创建临时canvas进行WebGL编译测试
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');
      
      if (!gl) {
        errors.push('error: WebGL not supported');
        return { isValid: false, errors };
      }

      // 编译片段着色器
      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      if (!fragmentShader) {
        errors.push('error: failed to create fragment shader');
        return { isValid: false, errors };
      }

      gl.shaderSource(fragmentShader, fragmentShaderCode);
      gl.compileShader(fragmentShader);

      if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        const errorInfo = gl.getShaderInfoLog(fragmentShader);
        if (errorInfo) {
          // 解析WebGL错误信息，提取有用的错误描述
          const errorLines = errorInfo.split('\n').filter(line => line.trim());
          errorLines.forEach(line => {
            if (line.includes('ERROR')) {
              errors.push(line.trim());
            }
          });
        }
        gl.deleteShader(fragmentShader);
        return { isValid: false, errors };
      }

      // 编译顶点着色器（使用默认的）
      const defaultVertexShader = `
        attribute vec4 position;
        varying vec2 vUv;
        
        void main() {
          vUv = position.xy * 0.5 + 0.5;
          gl_Position = position;
        }
      `;
      
      const vertexShader = gl.createShader(gl.VERTEX_SHADER);
      if (!vertexShader) {
        errors.push('error: failed to create vertex shader');
        gl.deleteShader(fragmentShader);
        return { isValid: false, errors };
      }

      gl.shaderSource(vertexShader, defaultVertexShader);
      gl.compileShader(vertexShader);

      if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        errors.push('error: vertex shader compilation failed');
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return { isValid: false, errors };
      }

      // 创建和链接程序
      const program = gl.createProgram();
      if (!program) {
        errors.push('error: failed to create shader program');
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return { isValid: false, errors };
      }

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const linkError = gl.getProgramInfoLog(program);
        if (linkError) {
          errors.push(`link error: ${linkError}`);
        }
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return { isValid: false, errors };
      }

      // 清理资源
      gl.deleteProgram(program);
      gl.deleteShader(fragmentShader);
      gl.deleteShader(vertexShader);

      return { isValid: true, errors: [] };
    } catch (error) {
      errors.push(`error: ${error instanceof Error ? error.message : 'unknown error'}`);
      return { isValid: false, errors };
    }
  };

  // 比较Canvas渲染结果
  const compareCanvasOutput = (userCode: string, correctCode: string): Promise<boolean> => {
    return new Promise((resolve) => {
      console.log('开始比较Canvas渲染结果');
      console.log('用户代码长度:', userCode.length);
      console.log('正确代码长度:', correctCode.length);
      
      try {
        // 创建两个临时canvas进行渲染比较
        const canvas1 = document.createElement('canvas');
        const canvas2 = document.createElement('canvas');
        canvas1.width = canvas2.width = 256;
        canvas1.height = canvas2.height = 256;
        
        const gl1 = canvas1.getContext('webgl', { preserveDrawingBuffer: true });
        const gl2 = canvas2.getContext('webgl', { preserveDrawingBuffer: true });
        
        if (!gl1 || !gl2) {
          console.log('WebGL上下文创建失败');
          resolve(false);
          return;
        }

        const defaultVertexShader = `
          attribute vec4 position;
          varying vec2 vUv;
          
          void main() {
            vUv = position.xy * 0.5 + 0.5;
            gl_Position = position;
          }
        `;

        // 渲染着色器的函数
        const renderShader = (gl: WebGLRenderingContext, fragmentCode: string, label: string): boolean => {
          try {
            console.log(`开始渲染${label}`);
            
            // 编译顶点着色器
            const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
            gl.shaderSource(vertexShader, defaultVertexShader);
            gl.compileShader(vertexShader);
            
            if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
              console.log(`${label}顶点着色器编译失败:`, gl.getShaderInfoLog(vertexShader));
              return false;
            }

            // 编译片段着色器
            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
            gl.shaderSource(fragmentShader, fragmentCode);
            gl.compileShader(fragmentShader);

            if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
              console.log(`${label}片段着色器编译失败:`, gl.getShaderInfoLog(fragmentShader));
              return false;
            }

            // 创建和链接程序
            const program = gl.createProgram()!;
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
              console.log(`${label}程序链接失败:`, gl.getProgramInfoLog(program));
              return false;
            }

            gl.useProgram(program);

            // 设置顶点数据
            const positionLocation = gl.getAttribLocation(program, 'position');
            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
            
            if (positionLocation >= 0) {
              gl.enableVertexAttribArray(positionLocation);
              gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            }

            // 设置uniforms
            const timeLocation = gl.getUniformLocation(program, 'u_time');
            if (timeLocation) gl.uniform1f(timeLocation, 0.0);
            
            const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
            if (resolutionLocation) gl.uniform2f(resolutionLocation, 256, 256);

            // 渲染
            gl.viewport(0, 0, 256, 256);
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            
            // 确保渲染完成
            gl.finish();
            
            console.log(`${label}渲染完成`);
            return true;
          } catch (error) {
            console.log(`${label}渲染出错:`, error);
            return false;
          }
        };

        const success1 = renderShader(gl1, userCode, '用户代码');
        const success2 = renderShader(gl2, correctCode, '正确代码');

        if (!success1) {
          console.log('用户代码渲染失败');
          resolve(false);
          return;
        }
        
        if (!success2) {
          console.log('正确代码渲染失败');
          resolve(false);
          return;
        }

        // 比较渲染结果
        setTimeout(() => {
          try {
            console.log('开始读取像素数据');
            
            // 创建像素数据数组
            const pixels1 = new Uint8Array(256 * 256 * 4);
            const pixels2 = new Uint8Array(256 * 256 * 4);
            
            // 读取像素数据
            gl1.readPixels(0, 0, 256, 256, gl1.RGBA, gl1.UNSIGNED_BYTE, pixels1);
            gl2.readPixels(0, 0, 256, 256, gl2.RGBA, gl2.UNSIGNED_BYTE, pixels2);
            
            console.log('像素数据读取完成');
            
            // 计算像素差异
            let diffCount = 0;
            const threshold = 10; // 增加容错阈值
            
            // 采样比较（每隔4个像素比较一次，减少计算量）
            const sampleStep = 4;
            let sampleCount = 0;
            
            for (let y = 0; y < 256; y += sampleStep) {
              for (let x = 0; x < 256; x += sampleStep) {
                const i = (y * 256 + x) * 4;
                sampleCount++;
                
                const r1 = pixels1[i], g1 = pixels1[i + 1], b1 = pixels1[i + 2];
                const r2 = pixels2[i], g2 = pixels2[i + 1], b2 = pixels2[i + 2];
                
                // 计算颜色距离
                const colorDistance = Math.sqrt(
                  Math.pow(r1 - r2, 2) + 
                  Math.pow(g1 - g2, 2) + 
                  Math.pow(b1 - b2, 2)
                );
                
                if (colorDistance > threshold) {
                  diffCount++;
                }
              }
            }
            
            const similarity = 1 - (diffCount / sampleCount);
            const isMatch = similarity > 0.90; // 降低相似度要求到90%
            
            console.log(`像素比较结果:`);
            console.log(`- 采样像素数: ${sampleCount}`);
            console.log(`- 差异像素数: ${diffCount}`);
            console.log(`- 相似度: ${(similarity * 100).toFixed(2)}%`);
            console.log(`- 阈值: ${threshold}`);
            console.log(`- 是否匹配: ${isMatch}`);
            
            resolve(isMatch);
          } catch (error) {
            console.log('像素比较出错:', error);
            resolve(false);
          }
        }, 200); // 增加等待时间确保渲染完成
      } catch (error) {
        console.log('Canvas比较出错:', error);
        resolve(false);
      }
    });
  };

  // 处理用户代码变化
  const handleUserCodeChange = (code: string) => {
    setUserCode(code);
    setIsSubmitted(false);
    setIsCorrect(null);
  };

  // 运行用户代码
  const handleRunCode = () => {
    console.log('运行用户代码:', userCode);
    
    // WebGL 编译验证
    const validation = validateShaderWithWebGL(userCode);
    
    if (!validation.isValid) {
      // 显示每个错误作为单独的通知
      validation.errors.forEach((error, index) => {
        setTimeout(() => {
          addToast(error, 'error', 5000);
        }, index * 200); // 错开显示时间
      });
      return;
    }
    
    addToast(t('tutorial.compile_success'), 'success');
    console.log('着色器编译成功');
  };

  // 重置代码到初始状态（练习代码）
  const handleResetCode = () => {
    setUserCode(initialCode);
    setIsSubmitted(false);
    setIsCorrect(null);
  };

  // 提交代码进行检查
  const handleSubmitCode = async () => {
    // 首先进行WebGL编译验证
    const validation = validateShaderWithWebGL(userCode);
    
    if (!validation.isValid) {
      // 显示每个错误作为单独的通知
      validation.errors.forEach((error, index) => {
        setTimeout(() => {
          addToast(error, 'error', 5000);
        }, index * 200); // 错开显示时间
      });
      return;
    }
    
    setIsSubmitted(true);
    
    // 比较Canvas渲染结果
    try {
      const isRenderingCorrect = await compareCanvasOutput(userCode, shaders.fragment);
      setIsCorrect(isRenderingCorrect);
      
      if (isRenderingCorrect) {
        addToast('🎉 ' + t('tutorial.success_toast', '恭喜！渲染效果正确，代码通过验证！'), 'success', 4000);
      } else {
        addToast(t('tutorial.incorrect_toast', '渲染效果与预期不符，请检查代码逻辑'), 'error');
      }
    } catch (error) {
      console.error('验证渲染效果时出错:', error);
      setIsCorrect(false);
      addToast(t('tutorial.error_toast', '验证过程中出现错误，请重试'), 'error');
    }
  };

  // 返回列表页
  const handleBack = () => {
    router.push(`/${locale}/learn`);
  };

  return (
    <>
      {/* Toast 容器 */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      
      <div className="flex overflow-hidden">
        {/* 左侧区域：问题描述和知识点介绍 */}
        <div
          style={{ height: 'calc(100vh - 61px)' }}
          className="w-2/5 border-r bg-white flex flex-col"
        >
          {/* 返回按钮和标题 */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleBack}>
                {t('common.back', '返回')}
              </Button>
              <h1 className="text-lg font-semibold">{tutorial.title}</h1>
            </div>
          </div>

          {/* 问题描述和知识点 */}
          <div className="flex-1 overflow-auto p-4">
            {/* 练习目标 */}
            <div className="mb-6">
              <h2 className="text-md font-semibold mb-3 text-blue-600">📝 {t('tutorial.exercise_goal', '练习目标')}</h2>
              <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                {tutorial.description}
              </div>
            </div>

            {/* README 内容 */}
            {readme && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-md font-semibold text-green-600">💡 {t('tutorial.content', '教程内容')}</h2>
                </div>
                <div className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg prose prose-sm max-w-none">
                  <div 
                    className="markdown-content"
                    dangerouslySetInnerHTML={{ 
                      __html: readme
                        .replace(/^# .+$/gm, '') // 移除一级标题
                        .replace(/^## (.+)$/gm, '<h3 class="font-semibold text-green-700 mt-4 mb-2">$1</h3>') // 二级标题
                        .replace(/^### (.+)$/gm, '<h4 class="font-medium text-green-600 mt-3 mb-1">$1</h4>') // 三级标题
                        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // 粗体
                        .replace(/`(.+?)`/g, '<code class="bg-gray-200 px-1 rounded text-xs">$1</code>') // 行内代码
                        .replace(/\n\n/g, '</p><p class="mb-2">') // 段落
                        .replace(/^(.+)$/gm, '<p class="mb-2">$1</p>') // 包装段落
                        .replace(/<p class="mb-2"><\/p>/g, '') // 移除空段落
                    }}
                  />
                </div>
              </div>
            )}

            {/* 如果没有README内容，显示默认知识点 */}
            {!readme && (
              <div className="mb-6">
                <h2 className="text-md font-semibold mb-3 text-green-600">💡 {t('tutorial.knowledge_points', '知识点')}</h2>
                <div className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg">
                  <p className="mb-2">{t('tutorial.default_knowledge_1', '在GLSL中，gl_FragColor 是片段着色器的输出变量。')}</p>
                  <p className="mb-2">{t('tutorial.default_knowledge_2', '它是一个 vec4 类型，表示RGBA颜色值。')}</p>
                  <p>{t('tutorial.default_knowledge_3', '每个分量的取值范围是 0.0 到 1.0。')}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 右侧区域：代码编辑和预览 */}
        <div className="w-3/5 flex flex-col bg-gray-50" style={{ height: 'calc(100vh - 61px)' }}>
          {/* 上部分：代码编辑器 */}
          <div className="p-4" style={{ height: 'calc(100vh - 61px - 280px)' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-md font-semibold">{t('tutorial.code_editor', 'GLSL 代码编辑器')}</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRunCode}>
                  {t('tutorial.run', '运行')}
                </Button>
                <Button variant="outline" size="sm" onClick={handleResetCode}>
                  {t('tutorial.reset', '重置')}
                </Button>
                <Button 
                  variant={"default"} 
                  size="sm" 
                  onClick={handleSubmitCode}
                  disabled={!!(isSubmitted && isCorrect)}
                >
                  {isSubmitted && isCorrect ? t('tutorial.passed', '已通过') : t('tutorial.submit', '提交')}
                </Button>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden" style={{ height: 'calc(100% - 60px)' }}>
              <CodeEditor
                initialCode={userCode}
                onChange={handleUserCodeChange}
                readOnly={false}
              />
            </div>
          </div>

          {/* 下部分：双预览区域 */}
          <div className="border-t bg-white p-4" style={{ height: '280px' }}>
            <div className="flex gap-4 h-full">
              {/* 正确代码预览 */}
              <div className="flex-1">
                <h4 className="text-sm font-medium mb-2 text-green-600">{t('tutorial.correct_preview', '正确代码预览')}</h4>
                <div className="border rounded-lg overflow-hidden h-full">
                  <ShaderCanvasNew
                    fragmentShader={shaders.fragment}
                    vertexShader={shaders.vertex || undefined}
                    uniforms={{
                      u_time: 0.1,
                      u_resolution: [200, 200],
                    }}
                    width="100%"
                    height="100%"
                  />
                </div>
              </div>

              {/* 当前代码预览 */}
              <div className="flex-1">
                <h4 className="text-sm font-medium mb-2 text-blue-600">{t('tutorial.current_preview', '当前代码预览')}</h4>
                <div className="border rounded-lg overflow-hidden h-full">
                  <ShaderCanvasNew
                    fragmentShader={userCode}
                    vertexShader={shaders.vertex || undefined}
                    uniforms={{
                      u_time: 0.1,
                      u_resolution: [200, 200],
                    }}
                    width="100%"
                    height="100%"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}