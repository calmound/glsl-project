# 正弦波动画

## 学习目标
- 理解 `sin()` 函数的基本用法
- 学习波形的基本参数：频率、振幅、相位
- 掌握时间动画的实现方法
- 了解坐标映射和距离计算

## 核心概念

### 正弦函数基础
```glsl
float wave = sin(x);
// sin() 函数输入角度（弧度），输出 -1.0 到 1.0
```

### 波形参数
```glsl
float frequency = 5.0;  // 频率：控制波的密度
float amplitude = 0.1;  // 振幅：控制波的高度
float speed = 2.0;      // 速度：控制动画快慢
float phase = 0.0;      // 相位：控制波的起始位置

// 完整波形公式
float wave = amplitude * sin(frequency * x + phase + u_time * speed);
```

### 坐标映射
```glsl
// 将 sin 的输出 [-1, 1] 映射到屏幕坐标 [0, 1]
float waveY = 0.5 + amplitude * sin(...);

// 或映射到任意范围 [min, max]
float waveY = mix(minY, maxY, (sin(...) + 1.0) * 0.5);
```

### 距离场绘制
```glsl
// 计算像素到波形的距离
float dist = abs(uv.y - waveY);

// 使用 smoothstep 创建平滑线条
float lineWidth = 0.02;
float line = 1.0 - smoothstep(0.0, lineWidth, dist);
```

### 波形组合
```glsl
// 多个波形叠加
float wave1 = sin(5.0 * uv.x + u_time);
float wave2 = sin(10.0 * uv.x + u_time * 1.5) * 0.5;
float combined = wave1 + wave2;

// 波形调制
float carrier = sin(20.0 * uv.x + u_time);
float modulator = sin(2.0 * uv.x + u_time * 0.5);
float modulated = carrier * modulator;
```

## 应用场景
- 水波效果
- 音频可视化
- 能量条动画
- 心电图效果
- 信号波形显示

## 练习建议
1. 调整频率值，观察波形密度变化
2. 修改振幅，看波形高度变化
3. 改变速度参数，控制动画快慢
4. 尝试使用 `cos()` 函数
5. 创建多重波形叠加效果
6. 实现彩色波形（颜色随位置变化）
7. 制作垂直方向的波形

## 数学扩展
```glsl
// 其他有用的三角函数
float cosWave = cos(x);     // 余弦波
float tanWave = tan(x);     // 正切波（注意范围）

// 波形变换
float squareWave = sign(sin(x));           // 方波
float sawWave = fract(x / (2.0 * 3.14159)); // 锯齿波
float triangleWave = abs(fract(x) - 0.5);   // 三角波
```

## 相关函数
- `sin()` / `cos()` - 三角函数
- `abs()` - 绝对值
- `smoothstep()` - 平滑阶跃
- `mix()` - 线性插值
- `fract()` - 小数部分