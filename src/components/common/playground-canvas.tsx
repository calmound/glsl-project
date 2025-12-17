'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';

interface PlaygroundCanvasProps {
  fragmentShader: string;
  vertexShader?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  timeScale?: number;
  uniforms?: Record<string, number | boolean | number[] | string>;
  onCompileError?: (error: string | null) => void;
  showPerformance?: boolean;
  onScreenshot?: (dataUrl: string) => void;
  isFullscreen?: boolean;
}

const defaultVertexShader = `
  attribute vec4 position;
  varying vec2 vUv;

  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = position;
  }
`;

const PlaygroundCanvas: React.FC<PlaygroundCanvasProps> = ({
  fragmentShader,
  vertexShader = defaultVertexShader,
  width = 300,
  height = 300,
  className = '',
  timeScale = 1.0,
  uniforms = {},
  onCompileError,
  showPerformance = false,
  onScreenshot,
  isFullscreen = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  // 性能监控
  const [fps, setFps] = useState<number>(0);
  const frameCountRef = useRef<number>(0);
  const lastFpsUpdateRef = useRef<number>(Date.now());

  // 编译状态
  const [compileError, setCompileError] = useState<string | null>(null);
  const compileTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 创建着色器
  const createShader = useCallback(
    (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      if (success) {
        setCompileError(null);
        if (onCompileError) {
          onCompileError(null);
        }
        return shader;
      }

      const errorLog = gl.getShaderInfoLog(shader);
      console.error('Shader compilation error:', errorLog);
      setCompileError(errorLog);
      if (onCompileError && errorLog) {
        onCompileError(errorLog);
      }
      gl.deleteShader(shader);
      return null;
    },
    [onCompileError]
  );

  // 创建着色器程序
  const createProgram = useCallback(
    (
      gl: WebGLRenderingContext,
      vertexSource: string,
      fragmentSource: string
    ): WebGLProgram | null => {
      const vertShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
      const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

      if (!vertShader || !fragShader) return null;

      const program = gl.createProgram();
      if (!program) return null;

      gl.attachShader(program, vertShader);
      gl.attachShader(program, fragShader);
      gl.linkProgram(program);

      const success = gl.getProgramParameter(program, gl.LINK_STATUS);
      if (success) return program;

      console.error(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    },
    [createShader]
  );

  // 截图功能
  const captureScreenshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !onScreenshot) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      onScreenshot(dataUrl);
    } catch (error) {
      console.error('Screenshot capture failed:', error);
    }
  }, [onScreenshot]);

  // 渲染循环
  const render = useCallback(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;

    if (!gl || !program || !canvas) return;

    // 计算当前时间
    const elapsed = ((Date.now() - startTimeRef.current) / 1000) * timeScale;

    // 设置视口
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 激活着色器程序
    gl.useProgram(program);

    // 设置时间uniform
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    if (timeLocation !== null) {
      gl.uniform1f(timeLocation, elapsed);
    }

    // 设置分辨率uniform
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    if (resolutionLocation !== null) {
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    }

    // 设置用户提供的uniforms
    Object.entries(uniforms).forEach(([name, value]) => {
      const location = gl.getUniformLocation(program, name);
      if (location !== null) {
        if (Array.isArray(value)) {
          if (value.length === 2) {
            gl.uniform2f(location, value[0], value[1]);
          } else if (value.length === 3) {
            gl.uniform3f(location, value[0], value[1], value[2]);
          } else if (value.length === 4) {
            gl.uniform4f(location, value[0], value[1], value[2], value[3]);
          }
        } else if (typeof value === 'number') {
          gl.uniform1f(location, value);
        }
      }
    });

    // 绘制
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // 性能监控
    if (showPerformance) {
      frameCountRef.current++;
      const now = Date.now();
      const elapsed = now - lastFpsUpdateRef.current;
      if (elapsed >= 1000) {
        const currentFps = Math.round((frameCountRef.current * 1000) / elapsed);
        setFps(currentFps);
        frameCountRef.current = 0;
        lastFpsUpdateRef.current = now;
      }
    }

    // 继续渲染循环
    animationRef.current = requestAnimationFrame(render);
  }, [timeScale, uniforms, showPerformance]);

  // 初始化GL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 设置画布尺寸
    if (typeof width === 'number') canvas.width = width;
    if (typeof height === 'number') canvas.height = height;

    // 获取WebGL上下文
    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    glRef.current = gl;

    // 编译着色器
    const compileShader = () => {
      const program = createProgram(gl, vertexShader, fragmentShader);
      if (!program) {
        console.error('Failed to create shader program');
        return false;
      }
      programRef.current = program;
      return true;
    };

    // 延迟编译防抖
    if (compileError) {
      if (compileTimeoutRef.current) {
        clearTimeout(compileTimeoutRef.current);
      }
      compileTimeoutRef.current = setTimeout(() => {
        compileShader();
      }, 1000);
      return;
    }

    // 立即编译
    const success = compileShader();
    if (!success) {
      return;
    }

    const program = programRef.current;
    if (!program) {
      console.error('Program not available after compilation');
      return;
    }

    // 设置顶点数据
    const positionLocation = gl.getAttribLocation(program, 'position');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // 重置开始时间
    startTimeRef.current = Date.now();

    // 开始渲染
    render();

    // 清理函数
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (compileTimeoutRef.current) {
        clearTimeout(compileTimeoutRef.current);
      }
      if (gl && program) {
        gl.deleteProgram(program);
      }
    };
  }, [vertexShader, fragmentShader, width, height, createProgram, render, compileError]);

  // 暴露截图方法
  useEffect(() => {
    if (onScreenshot) {
      (window as any).__captureShaderScreenshot = captureScreenshot;
    }
    return () => {
      if ((window as any).__captureShaderScreenshot) {
        delete (window as any).__captureShaderScreenshot;
      }
    };
  }, [captureScreenshot, onScreenshot]);

  return (
    <div
      ref={containerRef}
      className={`relative ${isFullscreen ? 'w-full h-full' : ''} ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="shader-canvas w-full h-full"
        style={{
          width: isFullscreen ? '100%' : typeof width === 'string' ? width : `${width}px`,
          height: isFullscreen ? '100%' : typeof height === 'string' ? height : `${height}px`,
        }}
      />
      {showPerformance && (
        <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded text-sm font-mono">
          FPS: {fps}
        </div>
      )}
      {compileError && (
        <div className="absolute inset-0 bg-red-900/20 flex items-center justify-center p-4">
          <div className="bg-red-900/90 text-white p-4 rounded max-w-lg max-h-64 overflow-auto text-xs font-mono">
            <div className="font-bold mb-2">Shader Compilation Error:</div>
            <pre className="whitespace-pre-wrap">{compileError}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaygroundCanvas;
