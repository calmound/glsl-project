'use client';

import React, { useState } from 'react';

export type UniformType = 'float' | 'vec2' | 'vec3' | 'vec4' | 'color';

export interface UniformConfig {
  name: string;
  type: UniformType;
  value: number | number[];
  min?: number;
  max?: number;
  step?: number;
}

interface UniformsPanelProps {
  uniforms: UniformConfig[];
  onChange: (uniforms: UniformConfig[]) => void;
  t: (key: string) => string;
}

const UniformsPanel: React.FC<UniformsPanelProps> = ({ uniforms, onChange, t }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const addUniform = () => {
    const newUniform: UniformConfig = {
      name: `u_custom${uniforms.length}`,
      type: 'float',
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
    };
    onChange([...uniforms, newUniform]);
  };

  const removeUniform = (index: number) => {
    onChange(uniforms.filter((_, i) => i !== index));
  };

  const updateUniform = (index: number, updates: Partial<UniformConfig>) => {
    const updated = [...uniforms];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const updateUniformValue = (index: number, valueIndex: number, newValue: number) => {
    const uniform = uniforms[index];
    if (Array.isArray(uniform.value)) {
      const newArray = [...uniform.value];
      newArray[valueIndex] = newValue;
      updateUniform(index, { value: newArray });
    } else {
      updateUniform(index, { value: newValue });
    }
  };

  const changeUniformType = (index: number, newType: UniformType) => {
    let newValue: number | number[];

    switch (newType) {
      case 'float':
        newValue = 0.5;
        break;
      case 'vec2':
        newValue = [0.5, 0.5];
        break;
      case 'vec3':
        newValue = [0.5, 0.5, 0.5];
        break;
      case 'vec4':
      case 'color':
        newValue = [1.0, 1.0, 1.0, 1.0];
        break;
    }

    updateUniform(index, { type: newType, value: newValue });
  };

  const hexToRgb = (hex: string): number[] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16) / 255,
          parseInt(result[2], 16) / 255,
          parseInt(result[3], 16) / 255,
          1.0,
        ]
      : [1, 1, 1, 1];
  };

  const rgbToHex = (rgb: number[]): string => {
    const r = Math.round(rgb[0] * 255);
    const g = Math.round(rgb[1] * 255);
    const b = Math.round(rgb[2] * 255);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  return (
    <div className="bg-gray-900/50 rounded-lg border border-gray-700">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">🎛️ {t('playground.uniforms')}</span>
          <span className="text-xs text-gray-400">({uniforms.length})</span>
        </div>
        <svg
          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {uniforms.map((uniform, index) => (
            <div key={index} className="bg-gray-800/50 rounded p-3 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={uniform.name}
                  onChange={(e) => updateUniform(index, { name: e.target.value })}
                  className="flex-1 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm"
                  placeholder="uniform name"
                />
                <select
                  value={uniform.type}
                  onChange={(e) => changeUniformType(index, e.target.value as UniformType)}
                  className="bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm"
                >
                  <option value="float">float</option>
                  <option value="vec2">vec2</option>
                  <option value="vec3">vec3</option>
                  <option value="vec4">vec4</option>
                  <option value="color">color</option>
                </select>
                <button
                  onClick={() => removeUniform(index)}
                  className="px-2 py-1 text-red-400 hover:text-red-300 text-sm"
                  title="Remove"
                >
                  ✕
                </button>
              </div>

              {uniform.type === 'color' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={rgbToHex(uniform.value as number[])}
                    onChange={(e) => updateUniform(index, { value: hexToRgb(e.target.value) })}
                    className="w-12 h-8 rounded cursor-pointer"
                  />
                  <span className="text-xs text-gray-400 font-mono">
                    {rgbToHex(uniform.value as number[])}
                  </span>
                </div>
              ) : uniform.type === 'float' ? (
                <div className="space-y-1">
                  <input
                    type="range"
                    min={uniform.min ?? 0}
                    max={uniform.max ?? 1}
                    step={uniform.step ?? 0.01}
                    value={uniform.value as number}
                    onChange={(e) => updateUniform(index, { value: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{uniform.min ?? 0}</span>
                    <span className="font-mono">{(uniform.value as number).toFixed(2)}</span>
                    <span>{uniform.max ?? 1}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {(uniform.value as number[]).map((val, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-4">
                        {['x', 'y', 'z', 'w'][i]}
                      </span>
                      <input
                        type="range"
                        min={uniform.min ?? 0}
                        max={uniform.max ?? 1}
                        step={uniform.step ?? 0.01}
                        value={val}
                        onChange={(e) =>
                          updateUniformValue(index, i, parseFloat(e.target.value))
                        }
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-400 font-mono w-12 text-right">
                        {val.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button
            onClick={addUniform}
            className="w-full py-2 border border-dashed border-gray-600 rounded hover:border-gray-500 hover:bg-gray-800/30 transition-colors text-sm text-gray-400 hover:text-gray-300"
          >
            + {t('playground.addUniform')}
          </button>
        </div>
      )}
    </div>
  );
};

export default UniformsPanel;
