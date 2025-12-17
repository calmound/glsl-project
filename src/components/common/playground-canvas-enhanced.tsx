'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import type { TextureConfig } from './texture-panel';

interface PlaygroundCanvasEnhancedProps {
  fragmentShader: string;
  vertexShader?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  uniforms?: Record<string, number | boolean | number[] | string>;
  textures?: TextureConfig[];
  timeControl?: {
    currentTime: number;
    isPaused: boolean;
    playbackSpeed: number;
  };
  onCompileError?: (error: string | null) => void;
  onTimeUpdate?: (time: number) => void;
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

const PlaygroundCanvasEnhanced: React.FC<PlaygroundCanvasEnhancedProps> = ({
  fragmentShader,
  vertexShader = defaultVertexShader,
  width = 300,
  height = 300,
  className = '',
  uniforms = {},
  textures = [],
  timeControl,
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
  const lastFrameTimeRef = useRef<number>(Date.now());

  // 纹理引用
  const texturesRef = useRef<Map<string, WebGLTexture>>(new Map());

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

  // 加载纹理
  const loadTexture = useCallback((gl: WebGLRenderingContext, url: string): WebGLTexture | null => {
    const texture = gl.createTexture();
    if (!texture) return null;

    gl.bindTexture(gl.TEXTURE_2D, texture);

    // 临时填充1x1像素
    const pixel = new Uint8Array([128, 128, 128, 255]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

    // 加载实际图片
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

      // 检查是否是2的幂
      const isPowerOf2 = (value: number) => (value & (value - 1)) === 0;
      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
    };
    image.src = url;

    return texture;
  }, []);

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
    let currentTime: number;
    if (timeControl) {
      currentTime = timeControl.currentTime;
    } else {
      const now = Date.now();
      lastFrameTimeRef.current = now;
      currentTime = ((now - startTimeRef.current) / 1000);
    }

    // 设置视口
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 激活着色器程序
    gl.useProgram(program);

    // 设置时间uniform
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    if (timeLocation !== null) {
      gl.uniform1f(timeLocation, currentTime);
    }

    // 设置分辨率uniform
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    if (resolutionLocation !== null) {
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    }

    // 设置纹理uniforms
    textures.forEach((texture, index) => {
      if (texture.url) {
        const location = gl.getUniformLocation(program, texture.name);
        if (location !== null) {
          gl.activeTexture(gl.TEXTURE0 + index);
          const webglTexture = texturesRef.current.get(texture.id);
          if (webglTexture) {
            gl.bindTexture(gl.TEXTURE_2D, webglTexture);
            gl.uniform1i(location, index);
          }
        }
      }
    });

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
  }, [uniforms, textures, showPerformance, timeControl]);

  // 更新纹理
  useEffect(() => {
    const gl = glRef.current;
    if (!gl) return;

    // 清理旧纹理
    texturesRef.current.forEach((texture, id) => {
      if (!textures.find((t) => t.id === id)) {
        gl.deleteTexture(texture);
        texturesRef.current.delete(id);
      }
    });

    // 加载新纹理
    textures.forEach((texture) => {
      if (texture.url && !texturesRef.current.has(texture.id)) {
        const webglTexture = loadTexture(gl, texture.url);
        if (webglTexture) {
          texturesRef.current.set(texture.id, webglTexture);
        }
      }
    });
  }, [textures, loadTexture]);

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
    lastFrameTimeRef.current = Date.now();

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
      // 清理纹理
      texturesRef.current.forEach((texture) => {
        gl.deleteTexture(texture);
      });
      texturesRef.current.clear();
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

export default PlaygroundCanvasEnhanced;
