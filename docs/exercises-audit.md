# 习题内容盘点（GLSL Tutorials）

更新时间：2025-12-16

## 1. 习题文件在哪里、如何被加载

- 习题文件：`src/lib/tutorials/<category>/<id>/fragment-exercise.glsl`
- 参考答案（完整实现）：`src/lib/tutorials/<category>/<id>/fragment.glsl`
- 页面初始代码选择逻辑：优先用 `exercise`，否则回退到 `fragment`
  - 服务端读取：`src/lib/tutorials-server.ts:336`
  - 客户端选择：`src/app/[locale]/learn/[category]/[id]/tutorial-client.tsx:60`

## 2. 覆盖范围（按教程目录统计）

教程总数（存在 `config.json`）：36  
提供习题（存在 `fragment-exercise.glsl`）：32  
缺少习题：4

### 2.1 缺少习题的教程

- `src/lib/tutorials/lighting/phong-lighting/`（无 `fragment-exercise.glsl`）
- `src/lib/tutorials/lighting/toon-shading/`（无 `fragment-exercise.glsl`）
- `src/lib/tutorials/noise/fractal-brownian-motion/`（无 `fragment-exercise.glsl`）
- `src/lib/tutorials/noise/noise-functions/`（无 `fragment-exercise.glsl`）

### 2.2 “孤儿”教程目录（不在列表里）

- 暂无（已为 `src/lib/tutorials/basic/circle-drawing/` 补充 `config.json`，现在会出现在教程列表中）。

## 3. 习题模板形态（可编译性）

按 32 个“在教程列表里”的习题统计：

- `TODO` 注释引导型：24 个（可编译；个别旧模板可能默认画面与目标不一致，需要按 TODO 补全）
- `/* 请填写 */` 占位符型：8 个（**默认无法编译**，页面打开即报错）
- 无占位/无 TODO：0 个

## 4. 知识点覆盖（按分类）

### 4.1 basic（基础）

- 颜色输出与通道映射：`solid-color`、`uv-visualizer`
- 坐标体系与网格：`uv-coordinates`（`gl_FragCoord` → UV、`fract` 网格）
- 插值与渐变：`color-mixing`、`basic-color-blend`
- 形状绘制：`simple-rectangle`、`simple-circle`
- 硬边/软边：`step-function-mask`、`smooth-edges`（`step/smoothstep`）
- 基础渐变：`basic-gradients`（但练习模板目前写死白色，见 5.2）

### 4.2 patterns（图案）

- 线性/径向渐变：`vertical-color-fade`、`radial-gradient-center`
- 颜色插值渐变：`color-blending-gradient`
- 棋盘格：`checkerboard-pattern`（`floor/mod/mix`）
- 重复图案与时间切换：`pattern-repetition`（`fract` + 形状组合 + `u_time`）
- 混合多种渐变：`gradient-effects`（`mix` + `u_time`）

### 4.3 animation（动画/交互）

- 基础分区：`rectangle-color-split`（`if`/条件判断）
- 呼吸动画：`breathing-color-block`（`sin(u_time)`）
- 时间驱动图形：`time-animation`（中心/半径/颜色随时间变化 + `smoothstep` 边缘）
- 鼠标交互：`mouse-interaction`（`u_mouse/u_resolution` 归一化 + 距离场 + 脉冲）

### 4.4 math（数学）

- 遮罩与距离：`centered-circle-mask`
- 软边衰减：`smoothstep-edge-fade`
- 正弦波：`sine-wave`（波带 + 颜色混合）
- 坐标变换：`coordinate-transformation`（旋转/缩放/重复）
- 简单迭代分形：`simple-fractal`（重复/振幅衰减/颜色混合）

### 4.5 noise（噪声）

- 噪声纹理：`noise-texture`（random → noise → fractal/turbulence/ridge → 颜色映射）
- 其它噪声教程（FBM、noise-functions）缺少习题文件（见 2.1）

## 5. 发现的问题（内容/实现一致性）

### 5.1 `noise/noise-texture` 练习模板存在 GLSL 语法错误

- `src/lib/tutorials/noise/noise-texture/fragment-exercise.glsl:14` 在 `main()` 内定义函数 `random()`/`noise()`，GLSL ES 通常不允许在函数内部再定义函数。
- 该文件还缺少 `u_resolution`，并硬编码 `vec2(300.0, 300.0)` 来归一化坐标，与答案实现不一致（答案使用 `u_resolution`：`src/lib/tutorials/noise/noise-texture/fragment.glsl:3`）。

### 5.2 `basic/basic-gradients` 练习目标与模板不一致

- 练习模板输出为纯白：`src/lib/tutorials/basic/basic-gradients/fragment-exercise.glsl:12`
- 参考答案输出为 `uv.y` 的蓝色渐变：`src/lib/tutorials/basic/basic-gradients/fragment.glsl:12`
- README 也描述的是垂直渐变目标：`src/lib/tutorials/basic/basic-gradients/zh-README.md:1`

### 5.3 坐标/分辨率输入不统一（学习体验割裂）

- 习题中同时存在 `vUv`、`gl_FragCoord`、`u_resolution`、以及硬编码 `vec2(300.0, 300.0)` 多套方式。
- 统计上：32 个 `fragment-exercise.glsl` 中，使用 `vUv` 的约 16 个、使用 `gl_FragCoord` 的约 15 个、显式使用 `u_resolution` 的约 10 个。

## 6. 可选的后续改进方向（建议）

- 将 `/* 请填写 */` 占位符型习题改为“默认可编译”的 TODO 引导型（至少保证能渲染基础画面）。
- 修复 `noise-texture`：把函数挪到 `main()` 外、补上 `u_resolution`、并统一坐标归一化方式。
- 对所有教程统一约定：优先用 `vUv`（若已有）或统一用 `u_resolution + gl_FragCoord`，避免同一阶段混用多套坐标体系。
