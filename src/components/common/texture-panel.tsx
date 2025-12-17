'use client';

import React, { useRef, useState } from 'react';

export interface TextureConfig {
  id: string;
  name: string;
  file: File | null;
  url: string | null;
  preview: string | null;
}

interface TexturePanelProps {
  textures: TextureConfig[];
  onChange: (textures: TextureConfig[]) => void;
  t: (key: string) => string;
  maxTextures?: number;
}

const TexturePanel: React.FC<TexturePanelProps> = ({
  textures,
  onChange,
  t,
  maxTextures = 4,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const addTexture = () => {
    if (textures.length >= maxTextures) return;

    const newTexture: TextureConfig = {
      id: `texture${textures.length}`,
      name: `u_texture${textures.length}`,
      file: null,
      url: null,
      preview: null,
    };
    onChange([...textures, newTexture]);
  };

  const removeTexture = (index: number) => {
    onChange(textures.filter((_, i) => i !== index));
  };

  const handleFileSelect = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // 创建预览 URL
    const preview = URL.createObjectURL(file);

    const updated = [...textures];
    updated[index] = {
      ...updated[index],
      file,
      url: preview,
      preview,
    };
    onChange(updated);
  };

  const updateTextureName = (index: number, name: string) => {
    const updated = [...textures];
    updated[index] = { ...updated[index], name };
    onChange(updated);
  };

  const triggerFileInput = (id: string) => {
    fileInputRefs.current[id]?.click();
  };

  return (
    <div className="bg-gray-900/50 rounded-lg border border-gray-700">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">🖼️ {t('playground.textures')}</span>
          <span className="text-xs text-gray-400">({textures.length}/{maxTextures})</span>
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
          {textures.map((texture, index) => (
            <div key={texture.id} className="bg-gray-800/50 rounded p-3 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={texture.name}
                  onChange={(e) => updateTextureName(index, e.target.value)}
                  className="flex-1 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm"
                  placeholder="uniform name"
                />
                <button
                  onClick={() => removeTexture(index)}
                  className="px-2 py-1 text-red-400 hover:text-red-300 text-sm"
                  title="Remove"
                >
                  ✕
                </button>
              </div>

              {/* 文件上传 */}
              <input
                ref={(el) => (fileInputRefs.current[texture.id] = el)}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(index, e)}
                className="hidden"
              />

              {texture.preview ? (
                <div className="relative group">
                  <img
                    src={texture.preview}
                    alt={texture.name}
                    className="w-full h-32 object-cover rounded border border-gray-600"
                  />
                  <button
                    onClick={() => triggerFileInput(texture.id)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm"
                  >
                    {t('playground.changeTexture')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => triggerFileInput(texture.id)}
                  className="w-full h-32 border-2 border-dashed border-gray-600 rounded hover:border-gray-500 hover:bg-gray-800/30 transition-colors flex flex-col items-center justify-center text-gray-400 hover:text-gray-300"
                >
                  <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm">{t('playground.uploadTexture')}</span>
                </button>
              )}
            </div>
          ))}

          {textures.length < maxTextures && (
            <button
              onClick={addTexture}
              className="w-full py-2 border border-dashed border-gray-600 rounded hover:border-gray-500 hover:bg-gray-800/30 transition-colors text-sm text-gray-400 hover:text-gray-300"
            >
              + {t('playground.addTexture')}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TexturePanel;
