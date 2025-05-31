# 鼠标交互

## 学习目标
- 理解 uniform 变量的作用和传递
- 学习使用鼠标坐标创建交互效果
- 掌握距离计算和应用
- 了解实时交互的实现原理

## 核心概念

### uniform 变量
```glsl
uniform vec2 u_mouse;  // 鼠标坐标（像素值）
// uniform 变量由 JavaScript 传递给着色器
// 在整个绘制过程中保持不变
```

### 坐标标准化
```glsl
// 将像素坐标转换为 0.0 到 1.0 的标准化坐标
vec2 uv = gl_FragCoord.xy / u_resolution.xy;
vec2 mouse = u_mouse.xy / u_resolution.xy;

// 这样可以确保坐标系统一致
```

### 距离计算
```glsl
// 计算两点间的欧几里得距离
float dist = distance(uv, mouse);

// 等同于：
// vec2 diff = uv - mouse;
// float dist = length(diff);
// 或者：
// float dist = sqrt(dot(diff, diff));
```

### 交互效果类型

#### 1. 光晕效果
```glsl
float radius = 0.2;
float glow = 1.0 - smoothstep(0.0, radius, dist);
vec3 color = vec3(glow);
```

#### 2. 颜色渐变
```glsl
float normalizedDist = dist / maxDistance;
vec3 color = mix(nearColor, farColor, normalizedDist);
```

#### 3. 波纹效果
```glsl
float ripple = sin(dist * frequency - u_time * speed);
float intensity = 1.0 - smoothstep(0.0, radius, dist);
vec3 color = vec3(ripple * intensity);
```

#### 4. 磁场效果
```glsl
vec2 direction = normalize(uv - mouse);
float angle = atan(direction.y, direction.x);
vec3 color = vec3(
    0.5 + 0.5 * sin(angle + u_time),
    0.5 + 0.5 * cos(angle + u_time),
    0.5
);
```

## JavaScript 集成
```javascript
// 在 JavaScript 中传递鼠标坐标
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = rect.height - (event.clientY - rect.top); // 翻转 Y 轴
    
    gl.uniform2f(mouseLocation, mouseX, mouseY);
});
```

## 应用场景
- 交互式艺术作品
- 游戏中的光标效果
- UI 悬停动画
- 粒子系统控制
- 实时视觉反馈

## 练习建议
1. 调整光晕的大小和颜色
2. 创建多个跟随鼠标的效果
3. 实现鼠标拖尾效果
4. 制作基于距离的音频可视化
5. 创建鼠标控制的波纹动画
6. 实现颜色跟随鼠标位置变化
7. 制作鼠标控制的粒子效果

## 扩展效果
```glsl
// 鼠标拖尾
vec2 trail = mouse + vec2(sin(u_time), cos(u_time)) * 0.1;
float trailDist = distance(uv, trail);

// 多重光晕
float glow1 = 1.0 - smoothstep(0.0, 0.1, dist);
float glow2 = 1.0 - smoothstep(0.1, 0.3, dist);
vec3 color = glow1 * vec3(1.0, 0.5, 0.0) + glow2 * vec3(0.0, 0.5, 1.0);

// 鼠标控制的扭曲
vec2 distortion = (mouse - 0.5) * 0.1;
vec2 distortedUV = uv + distortion;
```

## 相关函数
- `distance()` - 距离计算
- `length()` - 向量长度
- `normalize()` - 向量归一化
- `atan()` - 反正切函数
- `smoothstep()` - 平滑插值