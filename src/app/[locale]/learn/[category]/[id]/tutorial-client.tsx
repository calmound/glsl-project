'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { ToastContainer } from '@/components/ui/toast';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { useAuth } from '../../../../../contexts/AuthContext';
import { type Locale, addLocaleToPathname } from '../../../../../lib/i18n';
import ShaderCanvasNew from '../../../../../components/common/shader-canvas-new';
import CodeEditor from '../../../../../components/ui/code-editor';
import { createBrowserSupabase } from '../../../../../lib/supabase';
import { parseShaderError } from '../../../../../lib/shader-error-parser';
import LoginPromptOverlay from '../../../../../components/auth/login-prompt-overlay';
import SubscriptionPrompt from '../../../../../components/subscription/subscription-prompt';
import { savePendingCode, getPendingCode, clearPendingCode } from '../../../../../lib/code-storage';

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
  categoryTutorials: Tutorial[];
  initialCode?: string; // 从服务端预取的用户代码
  isFree: boolean; // 是否免费教程
}

export default function TutorialPageClient({
  tutorial,
  readme,
  shaders,
  locale,
  category,
  tutorialId,
  categoryTutorials,
  initialCode: serverInitialCode,
  isFree,
}: TutorialPageClientProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, hasActiveSubscription } = useAuth();

  // 权限控制：基于订阅的权限检查
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);

  // 计算访问权限状态
  const hasAccess = isFree || (!!user && hasActiveSubscription);
  const needsLogin = !isFree && !user;
  const needsSubscription = !isFree && !!user && !hasActiveSubscription;

  // 优先使用服务端预取的代码，其次是练习代码
  const exerciseCode = serverInitialCode || shaders.exercise || shaders.fragment;

  console.log('🔍 [客户端] TutorialPageClient 初始化:', {
    tutorialId,
    hasServerInitialCode: !!serverInitialCode,
    serverInitialCodeLength: serverInitialCode?.length || 0,
    hasExercise: !!shaders.exercise,
    hasFragment: !!shaders.fragment,
    finalExerciseCodeLength: exerciseCode.length,
    codeSource: serverInitialCode ? '数据库' : (shaders.exercise ? '练习代码' : '完整代码')
  });

  const [userCode, setUserCode] = useState(exerciseCode);
  const [initialCode, setInitialCode] = useState(exerciseCode);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'tutorial' | 'answer'>('tutorial');
  const [compileError, setCompileError] = useState<string | null>(null);
  const [isErrorDismissed, setIsErrorDismissed] = useState(false);
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

  // 处理编译错误
  const handleCompileError = useCallback((error: string | null) => {
    setCompileError(error);
  }, []);

  // 自动保存逻辑（防抖 2 秒）
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createBrowserSupabase();
  const fetchedOnceRef = useRef(false);

  // 权限检查：根据不同情况显示不同的提示
  useEffect(() => {
    if (needsLogin) {
      setShowLoginPrompt(true);
      setShowSubscriptionPrompt(false);
    } else if (needsSubscription) {
      setShowLoginPrompt(false);
      setShowSubscriptionPrompt(true);
    } else {
      setShowLoginPrompt(false);
      setShowSubscriptionPrompt(false);
    }
  }, [needsLogin, needsSubscription]);

  // 客户端兜底：挂载后尝试从数据库读取用户已保存代码
  useEffect(() => {
    // 如果服务端已经提供了初始代码，则无需再次读取；但考虑到会话不同步，仍做一次兜底。
    if (fetchedOnceRef.current) return;
    fetchedOnceRef.current = true;

    (async () => {
      try {
        console.log('🔄 [客户端] 尝试从数据库读取已保存代码...');
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError) {
          console.error('❌ [客户端] 获取用户失败，跳过读取：', authError);
          return;
        }
        if (!user) {
          console.log('ℹ️ [客户端] 未登录，跳过读取');
          return;
        }

        const { data, error } = await supabase
          .from('user_form_code')
          .select('code_content')
          .eq('form_id', tutorialId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('❌ [客户端] 读取用户代码失败：', error);
          return;
        }

        if (data?.code_content) {
          // 仅当和当前初始/用户代码不同，才更新，避免不必要刷新
          if (data.code_content !== userCode) {
            console.log('✅ [客户端] 成功读取用户代码，更新编辑器');
            setUserCode(data.code_content);
            setInitialCode(data.code_content);
          } else {
            console.log('ℹ️ [客户端] 数据库代码与当前一致，忽略更新');
          }
        } else {
          console.log('ℹ️ [客户端] 数据库中未找到该教程的用户代码');
        }
      } catch (e) {
        console.error('❌ [客户端] 读取用户代码发生异常：', e);
      }
    })();
  }, [supabase, tutorialId]);

  // 当切换到不同教程或服务端初始代码变化时，重置初始/用户代码
  useEffect(() => {
    setUserCode(exerciseCode);
    setInitialCode(exerciseCode);
  }, [tutorialId, serverInitialCode, shaders.exercise, shaders.fragment]);

  // 登录后恢复本地保存的代码
  useEffect(() => {
    // 只在用户登录状态下才尝试恢复
    if (user) {
      const savedCode = getPendingCode(tutorialId);
      if (savedCode) {
        console.log('🔄 检测到本地保存的代码，正在恢复...');
        setUserCode(savedCode);
        addToast(t('tutorial.code_restored', '已恢复您之前编辑的代码'), 'success', 3000);
        // 恢复后清除本地存储
        clearPendingCode(tutorialId);
      }
    }
  }, [user, tutorialId]);

  const saveCodeToDatabase = useCallback(async (code: string) => {
    console.log('💾 [客户端] 开始保存代码到数据库...');

    try {
      // 1. 获取用户信息
      console.log('💾 [客户端] 正在获取用户信息...');
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError) {
        console.error('❌ [客户端] 获取用户信息失败:', authError);
        return;
      }

      console.log('💾 [客户端] 用户状态:', user ? `已登录 (${user.id})` : '未登录');

      if (!user) {
        console.log('⚠️ [客户端] 未登录，跳过保存');
        return;
      }

      // 2. 准备数据
      const dataToSave = {
        user_id: user.id,
        form_id: tutorialId,
        code_content: code,
        language: 'glsl',
        is_draft: true,
      };

      console.log('💾 [客户端] 准备保存数据:', {
        formId: tutorialId,
        codeLength: code.length,
        userId: user.id
      });

      // 3. 执行 upsert - 不使用 .select()，避免额外的查询
      console.log('💾 [客户端] 发送 upsert 请求...');
      const startTime = Date.now();

      const { error } = await supabase
        .from('user_form_code')
        .upsert(dataToSave, {
          onConflict: 'user_id,form_id',
          ignoreDuplicates: false
        });

      const duration = Date.now() - startTime;
      console.log(`💾 [客户端] 请求耗时: ${duration}ms`);

      if (error) {
        console.error('❌ [客户端] 保存失败:', {
          error,
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
      } else {
        console.log('✅ [客户端] 代码保存成功:', {
          formId: tutorialId,
          codeLength: code.length,
          duration: `${duration}ms`
        });
      }
    } catch (error: any) {
      console.error('❌ [客户端] 保存异常:', {
        error,
        message: error?.message,
        name: error?.name,
        stack: error?.stack
      });
    }
  }, [supabase, tutorialId]);

  // 监听代码变化，实现防抖自动保存（优化：从 2 秒增加到 5 秒）
  useEffect(() => {
    console.log('⏱️ [客户端] 代码已更改，设置 5 秒后自动保存...');

    // 清除之前的定时器
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // 设置新的定时器（5秒后保存，减少数据库写入频率）
    saveTimeoutRef.current = setTimeout(() => {
      console.log('⏱️ [客户端] 5 秒已到，触发保存...');
      saveCodeToDatabase(userCode);
    }, 5000);

    // 清理函数
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [userCode, saveCodeToDatabase]);

  // 编辑器失去焦点时立即保存
  const handleEditorBlur = useCallback(() => {
    console.log('👁️ [客户端] 编辑器失去焦点，立即保存代码...');

    // 取消之前的延迟保存
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    // 立即保存
    saveCodeToDatabase(userCode);
  }, [userCode, saveCodeToDatabase]);

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
    setIsErrorDismissed(false); // 代码改变时重新显示错误
  };

  // 运行用户代码
  const handleRunCode = () => {
    console.log('运行用户代码:', userCode);
    setIsErrorDismissed(false); // 运行时重新显示错误

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

    // 比较Canvas渲染结果（本地验证）
    try {
      const isRenderingCorrect = await compareCanvasOutput(userCode, shaders.fragment);
      setIsCorrect(isRenderingCorrect);

      if (isRenderingCorrect) {
        // 先检查登录状态 - 使用 getUser() 验证 JWT 是否有效
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          // 未登录或登录已过期，保存代码到本地，然后提示用户去登录
          console.error('用户未登录或 session 已过期:', authError);

          // 保存当前代码到 localStorage
          savePendingCode(tutorialId, userCode);

          // 构造返回URL（当前页面的完整路径）
          const returnUrl = addLocaleToPathname(`/learn/${category}/${tutorialId}`, locale);

          addToast(
            '⚠️ ' + t('tutorial.login_required', '请先登录后再提交代码，您的代码已保存'),
            'info',
            5000
          );

          // 跳转到登录页，携带返回URL
          setTimeout(() => {
            router.push(`/signin?redirect=${encodeURIComponent(returnUrl)}`);
          }, 1500);
          return;
        }

        // 调用 Edge Function 提交到服务端
        try {
          const response = await supabase.functions.invoke('submit_form', {
            body: {
              formId: tutorialId,
              passed: true  // 前端验证通过，告知后端
            }
          });

          if (response.error) {
            console.error('提交到服务端失败:', response.error);
            console.error('错误详情:', JSON.stringify(response.error, null, 2));

            // 检查是否是 401 错误（未授权）
            // Supabase Functions 错误可能在 context.status 中包含状态码
            const is401Error =
              response.error.message?.includes('401') ||
              response.error.message?.includes('Unauthorized') ||
              (response.error as any).context?.status === 401 ||
              (response.error as any).status === 401;

            if (is401Error) {
              addToast(
                '🔒 ' + t('tutorial.session_expired', '登录已过期，请重新登录'),
                'error',
                5000
              );
              // 跳转到登录页
              setTimeout(() => {
                router.push('/signin');
              }, 1500);
              return;
            }

            // 其他错误
            addToast(
              '❌ ' + t('tutorial.submit_failed', '提交失败，请重试'),
              'error',
              4000
            );
            return;
          }

          // 提交成功
          console.log('服务端提交成功:', response.data);
          addToast('🎉 ' + t('tutorial.success_toast', '恭喜！渲染效果正确，代码通过验证！'), 'success', 4000);

          // 如果有下一个教程，显示跳转提示
          if (nextTutorial) {
            setTimeout(() => {
              addToast(
                `✨ ${t('tutorial.next_tutorial_hint', '准备好了吗？')} "${nextTutorial.title}" ${t('tutorial.next_tutorial_action', '等你来挑战！')}`,
                'info',
                6000
              );
            }, 2000);
          }
        } catch (error) {
          console.error('调用 Edge Function 失败:', error);
          addToast(
            '❌ ' + t('tutorial.submit_error', '提交过程中出现错误'),
            'error',
            4000
          );
        }
      } else {
        addToast(t('tutorial.incorrect_toast', '渲染效果与预期不符，请检查代码逻辑'), 'error');
      }
    } catch (error) {
      console.error('验证渲染效果时出错:', error);
      setIsCorrect(false);
      addToast(t('tutorial.error_toast', '验证过程中出现错误，请重试'), 'error');
    }
  };

  // 获取当前教程在列表中的位置
  const currentIndex = categoryTutorials.findIndex(t => t.id === tutorialId);
  const prevTutorial = currentIndex > 0 ? categoryTutorials[currentIndex - 1] : null;
  const nextTutorial = currentIndex < categoryTutorials.length - 1 ? categoryTutorials[currentIndex + 1] : null;

  // 返回列表页
  const handleBack = () => {
    router.push(addLocaleToPathname('/learn', locale));
  };

  // 导航到上一个教程
  const handlePrevTutorial = () => {
    if (prevTutorial) {
      router.push(addLocaleToPathname(`/learn/${category}/${prevTutorial.id}`, locale));
    }
  };

  // 导航到下一个教程
  const handleNextTutorial = () => {
    if (nextTutorial) {
      router.push(addLocaleToPathname(`/learn/${category}/${nextTutorial.id}`, locale));
    }
  };

  return (
    <>
      {/* 登录提示遮罩 */}
      {showLoginPrompt && (
        <LoginPromptOverlay
          onClose={() => setShowLoginPrompt(false)}
        />
      )}

      {showSubscriptionPrompt && (
        <SubscriptionPrompt
          onClose={() => setShowSubscriptionPrompt(false)}
        />
      )}

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
              <button
                onClick={() => setShowSubscriptionPrompt(true)}
                className="ml-2 px-2 py-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded shadow hover:shadow-md transition-shadow animate-pulse"
              >
                PRO
              </button>
            </div>

            {/* 导航按钮 */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevTutorial}
                disabled={!prevTutorial}
                className="flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t('tutorial.prev', '上一个')}
              </Button>

              <span className="text-sm text-gray-500">
                {currentIndex + 1} / {categoryTutorials.length}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextTutorial}
                disabled={!nextTutorial}
                className="flex items-center gap-1"
              >
                {t('tutorial.next', '下一个')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Tab 切换 */}
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('tutorial')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'tutorial'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
              >
                📚 {t('tutorial.tab.tutorial', '教程介绍')}
              </button>
              <button
                onClick={() => setActiveTab('answer')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'answer'
                  ? 'border-green-500 text-green-600 bg-green-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
              >
                💡 {t('tutorial.tab.answer', '参考答案')}
              </button>
            </div>
          </div>

          {/* Tab 内容 */}
          <div className="flex-1 overflow-auto p-4">
            {activeTab === 'tutorial' ? (
              <>
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
                      <ReactMarkdown
                        components={{
                          h1: () => null,
                          h2: ({ children }) => (
                            <h3 className="font-semibold text-green-700 mt-4 mb-2">{children}</h3>
                          ),
                          h3: ({ children }) => (
                            <h4 className="font-medium text-green-600 mt-3 mb-1">{children}</h4>
                          ),
                          p: ({ children }) => <p className="mb-2">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc pl-5 mb-2">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-5 mb-2">{children}</ol>,
                          li: ({ children }) => <li className="mb-1">{children}</li>,
                          code: ({ inline, className, children }) => {
                            const codeText = Array.isArray(children) ? children.join('') : String(children);
                            const isInline =
                              inline ?? (!className && !codeText.includes('\n') && !codeText.includes('\r'));
                            return isInline ? (
                              <code className="bg-slate-200 text-slate-900 px-1.5 py-0.5 rounded text-[0.85em]">
                                {children}
                              </code>
                            ) : (
                              <code className="block font-mono text-slate-100">{children}</code>
                            );
                          },
                          pre: ({ children }) => (
                            <pre className="bg-slate-900 text-slate-100 p-4 rounded-md overflow-auto text-sm leading-relaxed">
                              {children}
                            </pre>
                          ),
                          a: ({ children, href }) => (
                            <a className="text-blue-600 underline" href={href}>
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {readme}
                      </ReactMarkdown>
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
              </>
            ) : (
              <>
                {/* 参考答案 */}
                <div className="mb-6">
                  <h2 className="text-md font-semibold mb-3 text-green-600">✅ {t('tutorial.answer.title', '参考答案')}</h2>
                  <div className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg mb-4">
                    <p className="mb-2">{t('tutorial.answer.description', '以下是本练习的完整解决方案，你可以参考这个代码来理解正确的实现方式。')}</p>
                    <p className="text-amber-600">{t('tutorial.answer.tip', '💡 建议先尝试自己完成，遇到困难时再查看答案。')}</p>
                  </div>
                </div>

                {/* 答案代码展示 */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-3 text-gray-700">{t('tutorial.answer.code', 'GLSL 代码:')}</h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-xs font-mono">
                    <pre className="whitespace-pre-wrap">{shaders.fragment}</pre>
                  </div>
                </div>

                {/* 代码说明 */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-3 text-gray-700">{t('tutorial.answer.explanation', '代码说明:')}</h3>
                  <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                    <p className="mb-2">{t('tutorial.answer.explanation_1', '• 这段代码展示了如何正确实现本练习的要求')}</p>
                    <p className="mb-2">{t('tutorial.answer.explanation_2', '• 注意变量的声明和使用方式')}</p>
                    <p>{t('tutorial.answer.explanation_3', '• 观察输出结果与预期效果的对应关系')}</p>
                  </div>
                </div>

                {/* 学习建议 */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-3 text-gray-700">{t('tutorial.answer.tips', '学习建议:')}</h3>
                  <div className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg">
                    <p className="mb-2">{t('tutorial.answer.tip_1', '1. 尝试理解每一行代码的作用')}</p>
                    <p className="mb-2">{t('tutorial.answer.tip_2', '2. 可以修改参数值观察效果变化')}</p>
                    <p className="mb-2">{t('tutorial.answer.tip_3', '3. 将答案代码复制到编辑器中运行验证')}</p>
                    <p>{t('tutorial.answer.tip_4', '4. 基于答案代码尝试创造自己的变化')}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 右侧区域：代码编辑和预览 */}
        <div className="w-3/5 flex flex-col bg-gray-50" style={{ height: 'calc(100vh - 61px)' }}>
          {/* 上部分：代码编辑器 */}
          <div className="p-4 flex flex-col" style={{ height: 'calc(100vh - 61px - 280px)' }}>
            {/* 标题栏 */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-md font-semibold">{t('tutorial.editor', 'GLSL 代码编辑器')}</h3>
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
                  disabled={!hasAccess || !!(isSubmitted && isCorrect)}
                >
                  {!hasAccess
                    ? t('tutorial.login_to_submit', '登录后提交')
                    : (isSubmitted && isCorrect ? t('tutorial.passed', '已通过') : t('tutorial.submit', '提交'))
                  }
                </Button>
              </div>
            </div>

            {/* 代码编辑器 */}
            <div className="flex-1 border rounded-lg overflow-hidden">
              <CodeEditor
                initialCode={userCode}
                onChange={handleUserCodeChange}
                onBlur={handleEditorBlur}
                readOnly={!hasAccess}
                category={category}
                locale={locale}
              />
            </div>

            {/* 编译错误提示 - 放在编辑器下方 */}
            {compileError && !isErrorDismissed && (
              <div className="mt-3 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-red-800">
                        {parseShaderError(compileError, locale).title}
                      </h4>
                      <button
                        onClick={() => setIsErrorDismissed(true)}
                        className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
                        aria-label="关闭"
                        type="button"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {parseShaderError(compileError, locale).hint && (
                      <p className="text-sm text-red-700 mb-2">
                        💡 {parseShaderError(compileError, locale).hint}
                      </p>
                    )}
                    <details className="text-xs text-red-600 mt-2">
                      <summary className="cursor-pointer hover:text-red-800 font-medium">
                        {t('tutorial.error_details', '查看详细错误')}
                      </summary>
                      <pre className="mt-2 p-2 bg-red-100 rounded overflow-x-auto text-xs font-mono">
                        {compileError}
                      </pre>
                    </details>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 下部分：双预览区域 */}
          <div className="border-t bg-white p-4" style={{ height: '320px' }}>
            <div className="flex gap-4 h-full flex-col">
              {/* 预览区域 */}
              <div className="flex gap-4 flex-1">
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
                      onCompileError={handleCompileError}
                    />
                  </div>
                </div>
              </div>

              {/* 导航区域 - 只在完成练习后显示 */}
              {isCorrect && (
                <div className="border-t pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-medium">✅ {t('tutorial.completed', '练习完成！')}</span>
                      {nextTutorial && (
                        <span className="text-sm text-gray-600">
                          {t('tutorial.ready_for_next', '准备挑战下一个教程吗？')}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {prevTutorial && (
                        <Button variant="outline" size="sm" onClick={handlePrevTutorial}>
                          ← {prevTutorial.title}
                        </Button>
                      )}

                      {nextTutorial && (
                        <Button
                          onClick={handleNextTutorial}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          size="sm"
                        >
                          {nextTutorial.title} →
                        </Button>
                      )}

                      {!nextTutorial && (
                        <Button variant="outline" size="sm" onClick={handleBack}>
                          {t('tutorial.back_to_list', '返回列表')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
