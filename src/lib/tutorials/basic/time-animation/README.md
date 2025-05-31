# 时间动画

## 学习目标

通过本教程，你将学会：
- 理解时间在着色器动画中的核心作用
- 掌握三角函数在创建周期性动画中的应用
- 学习如何控制动画的速度、幅度和相位
- 了解各种动画模式和组合技巧

## 核心概念

### 时间变量（Time Variable）
在着色器中，时间通常作为uniform变量传入，表示从程序开始运行到当前的时间（通常以秒为单位）。时间是创建动态效果的基础。

### 周期性函数
动画的本质是值随时间的周期性变化。最常用的周期性函数包括：
- **正弦函数（sin）**：平滑的波动，范围[-1, 1]
- **余弦函数（cos）**：与正弦相似，但相位不同
- **锯齿波**：线性上升然后突然下降
- **方波**：在两个值之间突然切换

### 动画参数控制
- **频率（Frequency）**：控制动画的快慢
- **幅度（Amplitude）**：控制变化的范围
- **相位（Phase）**：控制动画的起始位置
- **偏移（Offset）**：控制动画的中心值

## 相关函数和语法

### 三角函数
```glsl
// 基础三角函数
float sin(float x);  // 正弦函数，范围[-1, 1]
float cos(float x);  // 余弦函数，范围[-1, 1]
float tan(float x);  // 正切函数

// 反三角函数
float asin(float x);  // 反正弦
float acos(float x);  // 反余弦
float atan(float y, float x);  // 反正切（两参数版本）
```

### 数学函数
```glsl
// 取小数部分（创建锯齿波）
float fract(float x);

// 取整函数
float floor(float x);
float ceil(float x);

// 绝对值
float abs(float x);

// 幂函数
float pow(float x, float y);

// 指数和对数
float exp(float x);
float log(float x);
```

### 插值和平滑函数
```glsl
// 线性插值
float mix(float a, float b, float t);
vec3 mix(vec3 a, vec3 b, float t);

// 平滑阶跃
float smoothstep(float edge0, float edge1, float x);

// 限制范围
float clamp(float x, float minVal, float maxVal);
```

## 代码解析

在练习代码中，你需要完成以下任务：

1. **获取时间变量**：
   ```glsl
   uniform float u_time;  // 时间变量（通常由应用程序传入）
   ```

2. **创建基础动画**：
   ```glsl
   // 简单的正弦波动画
   float wave = sin(u_time);
   
   // 调整范围到[0, 1]
   float normalizedWave = (sin(u_time) + 1.0) * 0.5;
   ```

3. **控制动画速度**：
   ```glsl
   float speed = 2.0;  // 动画速度倍数
   float wave = sin(u_time * speed);
   ```

4. **应用到颜色动画**：
   ```glsl
   vec3 color1 = vec3(1.0, 0.0, 0.0);  // 红色
   vec3 color2 = vec3(0.0, 0.0, 1.0);  // 蓝色
   float t = (sin(u_time) + 1.0) * 0.5;  // 归一化到[0,1]
   vec3 color = mix(color1, color2, t);
   ```

## 动画类型详解

### 颜色动画

#### 颜色渐变动画
```glsl
// 在红色和蓝色之间循环
vec3 color1 = vec3(1.0, 0.0, 0.0);
vec3 color2 = vec3(0.0, 0.0, 1.0);
float t = (sin(u_time * 2.0) + 1.0) * 0.5;
vec3 color = mix(color1, color2, t);
```

#### 彩虹色相动画
```glsl
// HSV到RGB转换函数
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// 色相随时间变化
float hue = fract(u_time * 0.1);  // 慢速色相变化
vec3 color = hsv2rgb(vec3(hue, 1.0, 1.0));
```

#### 闪烁效果
```glsl
// 快速闪烁
float blink = step(0.5, fract(u_time * 5.0));
vec3 color = vec3(blink);

// 平滑闪烁
float smoothBlink = (sin(u_time * 10.0) + 1.0) * 0.5;
vec3 color = vec3(smoothBlink);
```

### 位置动画

#### 移动动画
```glsl
// 水平移动
vec2 center = vec2(0.5 + 0.3 * sin(u_time), 0.5);

// 圆形轨道
float radius = 0.2;
vec2 center = vec2(0.5, 0.5) + radius * vec2(cos(u_time), sin(u_time));

// 8字形轨道
vec2 center = vec2(0.5 + 0.2 * sin(u_time), 0.5 + 0.1 * sin(u_time * 2.0));
```

#### 缩放动画
```glsl
// 脉动效果
float baseRadius = 0.2;
float pulseRadius = baseRadius + 0.1 * sin(u_time * 3.0);

// 呼吸效果（更平滑）
float breathe = (sin(u_time * 2.0) + 1.0) * 0.5;
float radius = mix(0.1, 0.3, breathe);
```

### 形状变形动画

#### 波浪效果
```glsl
// 基于位置的波浪
vec2 uv = gl_FragCoord.xy / vec2(300.0, 300.0);
float wave = sin(uv.x * 10.0 + u_time * 5.0) * 0.1;
uv.y += wave;  // 垂直波浪变形
```

#### 旋转动画
```glsl
// 旋转矩阵
float angle = u_time;
mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));

// 应用旋转
vec2 center = vec2(0.5, 0.5);
vec2 uv = gl_FragCoord.xy / vec2(300.0, 300.0);
vec2 rotatedUV = rotation * (uv - center) + center;
```

## 高级动画技巧

### 多频率组合
```glsl
// 组合不同频率的波
float wave1 = sin(u_time * 2.0) * 0.5;        // 慢波
float wave2 = sin(u_time * 8.0) * 0.2;        // 快波
float wave3 = sin(u_time * 15.0) * 0.1;       // 高频波
float combined = wave1 + wave2 + wave3;

// 归一化到[0,1]
float normalized = (combined + 0.8) / 1.6;
vec3 color = vec3(normalized);
```

### 相位偏移
```glsl
// 为不同位置添加相位偏移
vec2 uv = gl_FragCoord.xy / vec2(300.0, 300.0);
float phase = uv.x * 3.14159 * 2.0;  // 基于X位置的相位
float wave = sin(u_time * 3.0 + phase);
vec3 color = vec3((wave + 1.0) * 0.5);
```

### 缓动函数
```glsl
// 缓入缓出（ease-in-out）
float easeInOut(float t) {
    return t * t * (3.0 - 2.0 * t);
}

// 弹性效果
float elastic(float t) {
    return sin(t * 3.14159 * 6.0) * exp(-t * 5.0);
}

// 应用缓动
float t = fract(u_time * 0.5);  // 0到1的循环
t = easeInOut(t);
vec3 color = mix(color1, color2, t);
```

### 噪声动画
```glsl
// 简单的伪随机函数
float random(float x) {
    return fract(sin(x * 12.9898) * 43758.5453);
}

// 时间噪声
float timeNoise = random(floor(u_time * 10.0));
vec3 color = vec3(timeNoise);

// 平滑噪声
float t = fract(u_time * 10.0);
float noise1 = random(floor(u_time * 10.0));
float noise2 = random(floor(u_time * 10.0) + 1.0);
float smoothNoise = mix(noise1, noise2, smoothstep(0.0, 1.0, t));
```

## 性能优化

### 减少三角函数调用
```glsl
// 慢：多次调用sin
float r = sin(u_time);
float g = sin(u_time + 2.0);
float b = sin(u_time + 4.0);

// 快：计算一次，然后偏移
float base = sin(u_time);
float r = base;
float g = sin(u_time + 2.094);  // 2π/3
float b = sin(u_time + 4.188);  // 4π/3
```

### 预计算常量
```glsl
const float PI = 3.14159265359;
const float TWO_PI = 6.28318530718;
const float HALF_PI = 1.57079632679;
```

### 使用查找表（对于复杂函数）
```glsl
// 对于复杂的周期性函数，可以考虑使用纹理查找表
// texture2D(lookupTable, vec2(fract(u_time), 0.0))
```

## 实践提示

- **时间单位**：确保理解时间变量的单位（通常是秒）
- **频率控制**：使用乘法控制动画速度，除法会降低精度
- **范围转换**：记住sin/cos的范围是[-1,1]，需要时转换到[0,1]
- **相位关系**：cos(x) = sin(x + π/2)
- **周期性**：sin和cos的周期是2π

## 常见应用场景

### UI动画
```glsl
// 按钮悬停效果
float hover = (sin(u_time * 8.0) + 1.0) * 0.5;
vec3 baseColor = vec3(0.3, 0.6, 1.0);
vec3 highlightColor = vec3(0.5, 0.8, 1.0);
vec3 buttonColor = mix(baseColor, highlightColor, hover * 0.3);
```

### 水面效果
```glsl
// 水波动画
vec2 uv = gl_FragCoord.xy / vec2(300.0, 300.0);
float wave1 = sin(uv.x * 10.0 + u_time * 2.0) * 0.02;
float wave2 = sin(uv.y * 8.0 + u_time * 1.5) * 0.015;
uv += vec2(wave1, wave2);

// 水的颜色
vec3 waterColor = vec3(0.1, 0.3, 0.8);
vec3 foamColor = vec3(0.9, 0.95, 1.0);
float foam = sin(uv.x * 20.0 + u_time * 5.0) * sin(uv.y * 15.0 + u_time * 3.0);
foam = smoothstep(0.7, 1.0, foam);
vec3 color = mix(waterColor, foamColor, foam);
```

### 粒子效果
```glsl
// 简单的粒子闪烁
vec2 uv = gl_FragCoord.xy / vec2(300.0, 300.0);
float particle = 0.0;

// 多个粒子
for (int i = 0; i < 5; i++) {
    vec2 particlePos = vec2(
        0.2 + 0.6 * sin(u_time * 0.5 + float(i) * 1.2),
        0.2 + 0.6 * cos(u_time * 0.3 + float(i) * 0.8)
    );
    
    float dist = distance(uv, particlePos);
    float size = 0.02 + 0.01 * sin(u_time * 3.0 + float(i));
    particle += smoothstep(size, 0.0, dist);
}

vec3 color = vec3(particle);
```

## 扩展思考

完成基础练习后，可以尝试：
1. 创建复杂的轨道动画（椭圆、螺旋、李萨如图形）
2. 实现弹性和阻尼动画效果
3. 制作音频可视化效果
4. 创建粒子系统动画
5. 实现形态变换动画
6. 结合噪声函数创建自然动画

## 数学背景

### 三角函数的性质
```
sin(x + 2π) = sin(x)     // 周期性
sin(-x) = -sin(x)        // 奇函数
cos(-x) = cos(x)         // 偶函数
sin²(x) + cos²(x) = 1    // 勾股定理
```

### 频率和周期的关系
```
频率 f = 1/周期 T
角频率 ω = 2πf = 2π/T
y = A·sin(ωt + φ) + C
其中：A=幅度，ω=角频率，φ=相位，C=偏移
```

### 傅里叶级数
任何周期函数都可以表示为正弦和余弦函数的和：
```
f(t) = a₀ + Σ[aₙcos(nωt) + bₙsin(nωt)]
```

通过掌握时间动画，你将理解如何让静态图形变得生动，这是创建引人入胜的视觉效果的关键技能。