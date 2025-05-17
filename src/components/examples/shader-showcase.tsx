'use client';

import React from 'react';
import WaveShaderExample from './wave-shader-example';
import FireShaderExample from './fire-shader-example';
import StarsShaderExample from './stars-shader-example';

const ShaderShowcase: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <WaveShaderExample />
      <FireShaderExample />
      <StarsShaderExample />
    </div>
  );
};

export default ShaderShowcase;
