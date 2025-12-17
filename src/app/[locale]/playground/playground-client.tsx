'use client';

import React, { useState, useEffect, useCallback } from 'react';
import CodeEditor from '@/components/ui/code-editor';
import PlaygroundCanvasEnhanced from '@/components/common/playground-canvas-enhanced';
import UniformsPanel, { UniformConfig } from '@/components/common/uniforms-panel';
import TexturePanel, { TextureConfig } from '@/components/common/texture-panel';
import TimeControl, { TimeControlState } from '@/components/common/time-control';
import { getTranslationFunction } from '@/lib/translations';
import { type Locale } from '@/lib/i18n';

const DEFAULT_FRAGMENT_SHADER = `precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
varying vec2 vUv;

void main() {
  // 将 UV 坐标转换到屏幕中心
  vec2 st = vUv - 0.5;

  // 计算到中心的距离
  float dist = length(st);

  // 创建一个脉动的圆
  float circle = smoothstep(0.3, 0.29, dist);
  circle *= 0.5 + 0.5 * sin(u_time * 2.0);

  // 设置颜色
  vec3 color = vec3(0.2, 0.6, 1.0) * circle;

  gl_FragColor = vec4(color, 1.0);
}`;

const DEFAULT_VERTEX_SHADER = `attribute vec4 position;
varying vec2 vUv;

void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = position;
}`;

interface PlaygroundClientProps {
  locale: Locale;
}

const PlaygroundClient: React.FC<PlaygroundClientProps> = ({ locale }) => {
  const t = getTranslationFunction(locale);
  const [fragmentShader, setFragmentShader] = useState(DEFAULT_FRAGMENT_SHADER);
  const [vertexShader, setVertexShader] = useState(DEFAULT_VERTEX_SHADER);
  const [activeTab, setActiveTab] = useState<'fragment' | 'vertex'>('fragment');
  const [uniforms, setUniforms] = useState<UniformConfig[]>([]);
  const [textures, setTextures] = useState<TextureConfig[]>([]);
  const [timeState, setTimeState] = useState<TimeControlState>({
    currentTime: 0,
    isPaused: false,
    playbackSpeed: 1,
  });
  const [showPerformance, setShowPerformance] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(true);

  // 从 localStorage 加载代码
  useEffect(() => {
    try {
      const saved = localStorage.getItem('playground_code');
      if (saved) {
        const data = JSON.parse(saved);
        // 只有当保存的代码不为空时才加载
        if (data.fragmentShader && data.fragmentShader.trim()) {
          setFragmentShader(data.fragmentShader);
        }
        if (data.vertexShader && data.vertexShader.trim()) {
          setVertexShader(data.vertexShader);
        }
        if (data.uniforms && Array.isArray(data.uniforms)) {
          setUniforms(data.uniforms);
        }
        // 注意：textures 包含 File 对象，无法直接存储到 localStorage
      }
    } catch (error) {
      console.error('Failed to load saved code:', error);
    }
  }, []);

  // 时间控制逻辑
  useEffect(() => {
    if (timeState.isPaused) return;

    let lastTime = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const deltaTime = (now - lastTime) / 1000;
      lastTime = now;

      setTimeState((prev) => ({
        ...prev,
        currentTime: prev.currentTime + deltaTime * prev.playbackSpeed,
      }));
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [timeState.isPaused, timeState.playbackSpeed]);

  // 保存到 localStorage
  const saveToLocal = useCallback(() => {
    try {
      const data = {
        fragmentShader,
        vertexShader,
        uniforms,
        timestamp: Date.now(),
      };
      localStorage.setItem('playground_code', JSON.stringify(data));
      setIsSaved(true);
    } catch (error) {
      console.error('Failed to save code:', error);
    }
  }, [fragmentShader, vertexShader, uniforms]);

  // 监听代码变化，标记为未保存
  useEffect(() => {
    setIsSaved(false);
  }, [fragmentShader, vertexShader, uniforms]);

  // 自动保存（5秒延迟）
  useEffect(() => {
    if (isSaved) return;
    const timer = setTimeout(() => {
      saveToLocal();
    }, 5000);
    return () => clearTimeout(timer);
  }, [fragmentShader, vertexShader, uniforms, isSaved, saveToLocal]);

  // 重置代码
  const handleReset = () => {
    if (confirm(t('playground.confirmReset'))) {
      // 清除 localStorage
      localStorage.removeItem('playground_code');

      // 重置所有状态到默认值
      setFragmentShader(DEFAULT_FRAGMENT_SHADER);
      setVertexShader(DEFAULT_VERTEX_SHADER);
      setUniforms([]);
      setTextures([]);
      setTimeState({
        currentTime: 0,
        isPaused: false,
        playbackSpeed: 1,
      });
      setIsSaved(true);
    }
  };

  // 截图功能
  const handleScreenshot = useCallback((dataUrl: string) => {
    const link = document.createElement('a');
    link.download = `shader-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  }, []);

  // 全屏切换
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // 时间控制处理函数
  const handleTimeChange = useCallback((time: number) => {
    setTimeState((prev) => ({ ...prev, currentTime: time }));
  }, []);

  const handlePauseToggle = useCallback(() => {
    setTimeState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const handleSpeedChange = useCallback((speed: number) => {
    setTimeState((prev) => ({ ...prev, playbackSpeed: speed }));
  }, []);

  const handleTimeReset = useCallback(() => {
    setTimeState((prev) => ({ ...prev, currentTime: 0 }));
  }, []);

  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 转换 uniforms 为 shader 格式
  const shaderUniforms = uniforms.reduce((acc, uniform) => {
    acc[uniform.name] = uniform.value;
    return acc;
  }, {} as Record<string, number | number[]>);

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      {/* Header Toolbar */}
      <div className="bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">🎨 {t('playground.title')}</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPerformance(!showPerformance)}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              showPerformance
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={t('playground.togglePerformance')}
          >
            📊 FPS
          </button>

          <button
            onClick={() => {
              if ((window as any).__captureShaderScreenshot) {
                (window as any).__captureShaderScreenshot();
              }
            }}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
            title={t('playground.screenshot')}
          >
            📸 {t('playground.screenshot')}
          </button>

          <button
            onClick={toggleFullscreen}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
            title={t('playground.fullscreen')}
          >
            {isFullscreen ? '⛶' : '⛶'} {t('playground.fullscreen')}
          </button>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
            title={t('playground.reset')}
          >
            🔄 {t('playground.reset')}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Code Editor */}
        <div className="w-1/2 flex flex-col border-r border-gray-700">
          {/* Shader Type Tabs */}
          <div className="bg-gray-900 border-b border-gray-700 flex">
            <button
              onClick={() => setActiveTab('fragment')}
              className={`px-4 py-2 text-sm transition-colors ${
                activeTab === 'fragment'
                  ? 'bg-gray-800 text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              Fragment Shader
            </button>
            <button
              onClick={() => setActiveTab('vertex')}
              className={`px-4 py-2 text-sm transition-colors ${
                activeTab === 'vertex'
                  ? 'bg-gray-800 text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              Vertex Shader
            </button>
          </div>

          {/* Code Editor */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'fragment' ? (
              <CodeEditor
                initialCode={fragmentShader}
                onChange={setFragmentShader}
                height="100%"
              />
            ) : (
              <CodeEditor
                initialCode={vertexShader}
                onChange={setVertexShader}
                height="100%"
              />
            )}
          </div>

          {/* Error Display */}
          {compileError && (
            <div className="bg-red-900/20 border-t border-red-700 p-3 max-h-32 overflow-auto">
              <div className="text-xs font-mono text-red-400 whitespace-pre-wrap">
                {compileError}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Preview & Controls */}
        <div className="w-1/2 flex flex-col bg-gray-950">
          {/* Preview Header - 与左侧标签页对齐 */}
          <div className="bg-gray-900 border-b border-gray-700 px-4 py-2 flex items-center">
            <span className="text-sm text-gray-400">Preview</span>
          </div>

          {/* Preview Canvas */}
          <div className="flex-1 flex items-center justify-center p-4">
            <PlaygroundCanvasEnhanced
              fragmentShader={fragmentShader}
              vertexShader={vertexShader}
              width="100%"
              height="100%"
              uniforms={shaderUniforms}
              textures={textures}
              timeControl={timeState}
              showPerformance={showPerformance}
              onCompileError={setCompileError}
              onScreenshot={handleScreenshot}
              isFullscreen={false}
              className="max-w-full max-h-full"
            />
          </div>

          {/* Control Panels */}
          <div className="p-4 border-t border-gray-700 max-h-96 overflow-auto space-y-3">
            {/* Time Control */}
            <TimeControl
              timeState={timeState}
              onTimeChange={handleTimeChange}
              onPauseToggle={handlePauseToggle}
              onSpeedChange={handleSpeedChange}
              onReset={handleTimeReset}
              t={t}
            />

            {/* Texture Panel */}
            <TexturePanel textures={textures} onChange={setTextures} t={t} />

            {/* Uniforms Panel */}
            <UniformsPanel uniforms={uniforms} onChange={setUniforms} t={t} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaygroundClient;
