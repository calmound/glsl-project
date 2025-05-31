# 噪声纹理

## 学习目标
- 理解伪随机数生成的原理
- 学习创建平滑噪声函数
- 掌握分形噪声的概念和实现
- 了解噪声在程序化纹理中的应用

## 核心概念

### 伪随机函数
```glsl
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
// 输入相同的坐标，总是返回相同的"随机"值
// 输出范围：0.0 到 1.0
```

### 噪声 vs 随机
- **随机**：相邻像素值完全不相关，产生"白噪声"
- **噪声**：相邻像素值平滑过渡，产生自然的变化

### 平滑插值
```glsl
// 线性插值
float linear = mix(a, b, t);

// 平滑插值（S曲线）
vec2 smooth = f * f * (3.0 - 2.0 * f);
// 这创建了更自然的过渡
```

### 双线性插值
```glsl
// 获取四个角的值
float a = random(i);                // 左下
float b = random(i + vec2(1.0, 0.0)); // 右下
float c = random(i + vec2(0.0, 1.0)); // 左上
float d = random(i + vec2(1.0, 1.0)); // 右上

// 先在 x 方向插值
float bottom = mix(a, b, u.x);
float top = mix(c, d, u.x);

// 再在 y 方向插值
float result = mix(bottom, top, u.y);
```

### 分形噪声（FBM - Fractal Brownian Motion）
```glsl
float fractalNoise = 0.0;
float amplitude = 0.5;  // 初始振幅
float frequency = 1.0;  // 初始频率

for (int i = 0; i < octaves; i++) {
    fractalNoise += amplitude * noise(pos * frequency);
    amplitude *= 0.5;  // 振幅减半
    frequency *= 2.0;  // 频率加倍
}
```

## 噪声类型

### 1. 基础噪声
```glsl
float n = noise(uv * scale);
// scale 控制噪声的频率/密度
```

### 2. 动画噪声
```glsl
float n = noise(uv * scale + u_time * speed);
// 噪声随时间流动
```

### 3. 湍流噪声
```glsl
float turbulence = 0.0;
for (int i = 0; i < 4; i++) {
    turbulence += abs(noise(uv * pow(2.0, float(i)))) / pow(2.0, float(i));
}
```

### 4. 脊状噪声
```glsl
float ridge = 1.0 - abs(noise(uv) * 2.0 - 1.0);
```

## 应用场景

### 自然纹理
```glsl
// 云朵
float cloud = smoothstep(0.3, 0.7, fractalNoise);

// 大理石
float marble = sin(uv.x * 10.0 + fractalNoise * 5.0);

// 木纹
float wood = sin((uv.x + noise(uv * 3.0)) * 20.0);
```

### 地形生成
```glsl
// 高度图
float height = fractalNoise;

// 基于高度的颜色
vec3 grass = vec3(0.2, 0.6, 0.1);
vec3 rock = vec3(0.5, 0.4, 0.3);
vec3 snow = vec3(0.9, 0.9, 1.0);

vec3 terrain = mix(grass, rock, smoothstep(0.3, 0.6, height));
terrain = mix(terrain, snow, smoothstep(0.7, 0.9, height));
```

### 动画效果
```glsl
// 火焰效果
float flame = noise(uv * 5.0 + vec2(0.0, u_time * 2.0));
flame *= smoothstep(0.0, 0.5, 1.0 - uv.y); // 底部更强

vec3 fireColor = mix(
    vec3(1.0, 0.0, 0.0),  // 红色
    vec3(1.0, 1.0, 0.0), // 黄色
    flame
);
```

## 性能优化

### 1. 减少循环次数
```glsl
// 通常 3-5 个八度音程就足够了
for (int i = 0; i < 4; i++) { ... }
```

### 2. 预计算常量
```glsl
// 避免在循环中重复计算
float freq = 1.0;
float amp = 0.5;
for (int i = 0; i < 4; i++) {
    // 使用预计算的值
    freq *= 2.0;
    amp *= 0.5;
}
```

## 练习建议
1. 调整噪声的缩放因子，观察频率变化
2. 修改分形噪声的参数（振幅衰减、频率倍增）
3. 尝试不同的随机函数
4. 创建基于噪声的动画效果
5. 实现不同类型的程序化纹理
6. 组合多种噪声创建复杂效果
7. 使用噪声控制其他效果的参数

## 扩展学习
- Perlin 噪声
- Simplex 噪声
- Worley 噪声（细胞噪声）
- 域扭曲（Domain Warping）

## 相关函数
- `fract()` - 小数部分
- `sin()` / `cos()` - 三角函数
- `dot()` - 点积
- `floor()` - 向下取整
- `mix()` - 线性插值
- `smoothstep()` - 平滑阶跃