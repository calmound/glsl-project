'use client';

import React, { useEffect, useRef, useState } from 'react';

interface DebugShaderCanvasProps {
  fragmentShader: string;
  vertexShader?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  timeScale?: number;
  uniforms?: Record<string, any>;
}

const defaultVertexShader = `
  attribute vec4 position;
  varying vec2 vUv;
  
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = position;
  }
`;

const DebugShaderCanvas: React.FC<DebugShaderCanvasProps> = ({
  fragmentShader,
  vertexShader = defaultVertexShader,
  width = 300,
  height = 300,
  className = '',
  timeScale = 1.0,
  uniforms = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const [error, setError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState<boolean>(false);

  // 确保基本的uniforms存在
  const actualUniforms = {
    u_time: 0.0,
    u_resolution: [300, 300],
    ...uniforms,
  };

  // 创建着色器
  const createShader = (
    gl: WebGLRenderingContext,
    type: number,
    source: string
  ): WebGLShader | null => {
    console.log(
      '创建着色器',
      type === gl.VERTEX_SHADER ? '顶点' : '片段',
      source.substring(0, 50) + '...'
    );
    const shader = gl.createShader(type);
    if (!shader) {
      setError('无法创建着色器对象');
      return null;
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) return shader;

    const errorMsg = gl.getShaderInfoLog(shader) || '未知着色器错误';
    console.error('着色器编译错误:', errorMsg);
    setError(`着色器编译错误: ${errorMsg}`);
    gl.deleteShader(shader);
    return null;
  };

  // 创建着色器程序
  const createProgram = (
    gl: WebGLRenderingContext,
    vertexSource: string,
    fragmentSource: string
  ): WebGLProgram | null => {
    console.log('创建着色器程序');
    const vertShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    if (!vertShader || !fragShader) {
      return null;
    }

    const program = gl.createProgram();
    if (!program) {
      setError('无法创建着色器程序');
      return null;
    }

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) return program;

    const errorMsg = gl.getProgramInfoLog(program) || '未知程序链接错误';
    console.error('程序链接错误:', errorMsg);
    setError(`程序链接错误: ${errorMsg}`);
    gl.deleteProgram(program);
    return null;
  };

  // 渲染循环
  const render = () => {
    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;

    if (!gl || !program || !canvas) {
      console.error('渲染失败: GL上下文或程序或画布不存在');
      return;
    }

    setIsRendering(true);

    try {
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

      // 继续渲染循环
      animationRef.current = requestAnimationFrame(render);
    } catch (err) {
      console.error('渲染循环中出错:', err);
      setError(`渲染错误: ${err instanceof Error ? err.message : '未知错误'}`);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
  };

  // 初始化GL
  useEffect(() => {
    console.log('初始化DebugShaderCanvas...');
    setError(null);

    const canvas = canvasRef.current;
    if (!canvas) {
      setError('Canvas元素不存在');
      return;
    }

    // 设置画布尺寸
    try {
      if (typeof width === 'number') {
        canvas.width = width;
      } else if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
      }

      if (typeof height === 'number') {
        canvas.height = height;
      } else if (canvas.parentElement) {
        canvas.height = canvas.parentElement.clientHeight;
      }

      console.log(`Canvas尺寸设置为 ${canvas.width}x${canvas.height}`);
    } catch (err) {
      console.error('设置画布尺寸时出错:', err);
      setError(`设置画布尺寸错误: ${err instanceof Error ? err.message : '未知错误'}`);
      return;
    }

    // 获取WebGL上下文
    try {
      const gl = canvas.getContext('webgl');
      if (!gl) {
        setError('WebGL不受支持');
        return;
      }
      glRef.current = gl;
      console.log('WebGL上下文创建成功');
    } catch (err) {
      console.error('获取WebGL上下文时出错:', err);
      setError(`WebGL上下文错误: ${err instanceof Error ? err.message : '未知错误'}`);
      return;
    }

    // 创建着色器程序
    try {
      const gl = glRef.current;
      if (!gl) return;

      const program = createProgram(gl, vertexShader, fragmentShader);
      if (!program) {
        return; // 错误已在createProgram中设置
      }
      programRef.current = program;
      console.log('着色器程序创建成功');

      // 设置顶点数据
      const positionLocation = gl.getAttribLocation(program, 'position');
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

      // 创建一个覆盖整个画布的矩形（两个三角形）
      const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

      // 设置顶点属性指针
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(
        positionLocation,
        2, // 每个顶点有2个浮点数
        gl.FLOAT, // 数据类型是浮点数
        false, // 不需要归一化
        0, // 步长（0表示紧密打包）
        0 // 起始偏移量
      );

      // 重置开始时间
      startTimeRef.current = Date.now();

      // 开始渲染
      render();
      console.log('渲染启动成功');
    } catch (err) {
      console.error('初始化渲染时出错:', err);
      setError(`初始化渲染错误: ${err instanceof Error ? err.message : '未知错误'}`);
    }

    // 清理函数
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      if (glRef.current && programRef.current) {
        glRef.current.deleteProgram(programRef.current);
      }

      console.log('DebugShaderCanvas清理完成');
    };
  }, [vertexShader, fragmentShader, width, height]);

  return (
    <div
      className={`debug-shader-canvas-container ${className}`}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      <canvas
        ref={canvasRef}
        className="debug-shader-canvas"
        style={{
          width: typeof width === 'string' ? width : `${width}px`,
          height: typeof height === 'string' ? height : `${height}px`,
          display: 'block',
        }}
      />

      {error && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(255, 0, 0, 0.8)',
            color: 'white',
            padding: '8px',
            fontFamily: 'monospace',
            fontSize: '12px',
            maxHeight: '100%',
            overflow: 'auto',
          }}
        >
          <strong>错误:</strong> {error}
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          padding: '2px 4px',
          fontFamily: 'monospace',
          fontSize: '10px',
          borderTopLeftRadius: '3px',
        }}
      >
        {isRendering ? 'Rendering' : 'Stopped'}
      </div>
    </div>
  );
};

export default DebugShaderCanvas;
