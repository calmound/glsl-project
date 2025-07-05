'use client';

import React, { useEffect, useRef, useCallback } from 'react';

interface ShaderCanvasProps {
  fragmentShader: string;
  vertexShader?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  timeScale?: number;
  uniforms?: Record<string, number | boolean | number[] | string>;
}

const defaultVertexShader = `
  attribute vec4 position;
  varying vec2 vUv;
  
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = position;
  }
`;

const ShaderCanvas: React.FC<ShaderCanvasProps> = ({
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
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  // 创建着色器
  const createShader = useCallback(
    (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      if (success) return shader;

      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    },
    []
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

    // 继续渲染循环
    animationRef.current = requestAnimationFrame(render);
  }, [timeScale, uniforms]);

  // 初始化GL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    console.log('ShaderCanvas初始化:', {
      fragmentShaderLength: fragmentShader.length,
      uniformsKeys: Object.keys(uniforms),
      canvasWidth: typeof width === 'number' ? width : 'string',
      canvasHeight: typeof height === 'number' ? height : 'string',
    });

    // 设置画布尺寸
    if (typeof width === 'number') canvas.width = width;
    if (typeof height === 'number') canvas.height = height;

    // 获取WebGL上下文
    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    glRef.current = gl;

    // 创建着色器程序
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) {
      console.error('Failed to create shader program');
      return;
    }
    programRef.current = program;

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

    // 清理函数
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (gl && program) {
        gl.deleteProgram(program);
      }
    };
  }, [vertexShader, fragmentShader, width, height, createProgram, render, uniforms]);

  return (
    <canvas
      ref={canvasRef}
      className={`shader-canvas ${className}`}
      style={{
        width: typeof width === 'string' ? width : `${width}px`,
        height: typeof height === 'string' ? height : `${height}px`,
      }}
    />
  );
};

export default ShaderCanvas;
