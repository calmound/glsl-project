'use client';

import React from 'react';

export interface TimeControlState {
  currentTime: number;
  isPaused: boolean;
  playbackSpeed: number;
}

interface TimeControlProps {
  timeState: TimeControlState;
  onTimeChange: (time: number) => void;
  onPauseToggle: () => void;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
  t: (key: string) => string;
  maxTime?: number;
}

const SPEED_OPTIONS = [0.25, 0.5, 1, 2, 4];

const TimeControl: React.FC<TimeControlProps> = ({
  timeState,
  onTimeChange,
  onPauseToggle,
  onSpeedChange,
  onReset,
  t,
  maxTime = 60,
}) => {
  const { currentTime, isPaused, playbackSpeed } = timeState;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-900/50 rounded-lg border border-gray-700 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">⏱️ {t('playground.timeControl')}</span>
        <span className="text-xs text-gray-400 font-mono">{formatTime(currentTime)}</span>
      </div>

      {/* Time Slider */}
      <div className="space-y-1">
        <input
          type="range"
          min="0"
          max={maxTime}
          step="0.01"
          value={currentTime}
          onChange={(e) => onTimeChange(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>0:00</span>
          <span>{formatTime(maxTime)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Play/Pause */}
        <button
          onClick={onPauseToggle}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors flex items-center gap-2"
          title={isPaused ? t('playground.play') : t('playground.pause')}
        >
          {isPaused ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          )}
          <span className="text-sm">{isPaused ? t('playground.play') : t('playground.pause')}</span>
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          title={t('playground.resetTime')}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>

        {/* Speed Control */}
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-xs text-gray-400">{t('playground.speed')}:</span>
          {SPEED_OPTIONS.map((speed) => (
            <button
              key={speed}
              onClick={() => onSpeedChange(speed)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                playbackSpeed === speed
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeControl;
