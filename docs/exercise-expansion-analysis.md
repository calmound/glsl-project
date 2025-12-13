# 习题扩充分析汇总（glsl-project）

本文档汇总当前仓库 `src/lib/tutorials` 下“习题（`fragment-exercise.glsl`）”的覆盖情况、主要问题与可执行的扩充方向，作为后续新增习题与目录规划的依据。

## 1. 现状盘点

### 1.1 教程与习题数量

- 教程以目录组织：`src/lib/tutorials/<category>/<tutorial-id>/`
- 教程元数据：`config.json`
- 教程内容：`fragment.glsl`（参考解/完整效果）、`fragment-exercise.glsl`（练习骨架）
- 文档：`en-README.md`、`zh-README.md`

统计（基于文件系统扫描）：

- 有 `config.json` 的教程：30 个
- 有 `fragment-exercise.glsl` 的教程（以 config 为准）：26 个
- 缺少 `fragment-exercise.glsl` 的教程：4 个
- 存在 `fragment-exercise.glsl` 但缺 `config.json` 的目录：1 个（会导致 Learn 列表不展示）

### 1.2 缺失项清单

#### A. 有 config 但缺 exercise（需要补齐 `fragment-exercise.glsl`）

- `src/lib/tutorials/lighting/phong-lighting/`
- `src/lib/tutorials/lighting/toon-shading/`
- `src/lib/tutorials/noise/noise-functions/`
- `src/lib/tutorials/noise/fractal-brownian-motion/`

#### B. 有 exercise 但缺 config（需要补齐 `config.json` 才会出现在 Learn 列表）

- `src/lib/tutorials/basic/circle-drawing/`

> 备注：Learn 页列表来源是 `getTutorials()`（优先 DB，失败回退文件系统）。回退逻辑只会读取存在 `config.json` 的目录，因此缺 config 的教程不会展示。

## 2. 难度与分类分布

### 2.1 难度（基于 `config.json`）

- `beginner`: 23
- `intermediate`: 6
- `advanced`: 1

整体偏入门，intermediate/advanced 的阶梯不足，后续扩充建议提升中阶题比例。

### 2.2 分类（基于 `config.json`）

- `basic`: 10（全部 beginner）
- `animation`: 4（全部 beginner）
- `patterns`: 6（beginner 4 / intermediate 2）
- `math`: 5（beginner 4 / intermediate 1）
- `noise`: 3（beginner 1 / intermediate 2，其中 2 个缺 exercise）
- `lighting`: 2（intermediate 1 / advanced 1，且都缺 exercise）

结论：

- `lighting` 分类在“练习层”完全空缺（0/2）。
- `noise` 分类已有中阶定位，但练习缺口大（2/3 缺）。

## 3. 现有习题内容特征（`fragment-exercise.glsl`）

### 3.1 题型形式

当前习题主要是“填空/补全”：

- `// TODO: ...` 注释式提示
- “请填写xxx”占位文本式提示

两种风格混用，且占位文本经常位于表达式/语句内部，存在“填不完就无法编译”的风险。

### 3.2 坐标与分辨率写法不统一

当前练习文件中：

- 使用 `vUv`（varying）风格：约 11 个
- 使用 `gl_FragCoord` 风格：约 15 个
- 显式使用/提及 `u_resolution` 的练习：约 3 个
- 硬编码 `vec2(300.0, 300.0)` 的练习：约 11 个

影响：

- 习题可移植性与一致性较差（不同题目之间切换，认知成本变高）。
- 画布尺寸/比例变化时，硬编码 300 会导致效果失真或不符合预期。

### 3.3 可编译性问题（至少 1 处硬错误）

示例：`src/lib/tutorials/noise/noise-texture/fragment-exercise.glsl` 在 `main()` 内部定义了函数 `random()` 与 `noise()`，这在 GLSL ES 1.0 中是非法的（函数必须定义在全局作用域）。

该文件即使把“请填写”全部填完，也会编译失败，需要结构性重写（把函数提出 `main`）。

### 3.4 练习“空题/弱题”

示例：`src/lib/tutorials/basic/basic-gradients/fragment-exercise.glsl` 目前仅输出 `gl_FragColor = vec4(1.,1.,1., 1.0);`，几乎没有练习任务点，属于“空题/弱题”。

## 4. 重复与覆盖空白

### 4.1 重复点

- `basic/basic-color-blend` 与 `patterns/color-blending-gradient` 都在做 `mix + vUv.x` 线性渐变，题面与训练点高度相似，区分度偏低。

### 4.2 覆盖空白（建议补齐的能力点）

当前题库对入门覆盖较好，但中阶关键能力点缺失较多：

- 坐标体系：宽高比校正、局部坐标/平铺坐标、极坐标
- 图形表达：SDF 组合（并/交/差）、重复与变形、抗锯齿（`fwidth`）
- 噪声应用：噪声本身 → 材质/形变/域扭曲等“应用型题”
- 光照分层：Lambert/Phong/Toon 的分步练习与参数控制

## 5. 可执行的扩充策略（先增量、后体系化）

### 5.1 “立刻增量”的 5 个动作（最短路径提升题量）

1. 为 `basic/circle-drawing` 补 `config.json`（目录已有 fragment 与 exercise 与 README），即可在 Learn 列表展示（+1）。
2. 为 4 个缺失练习的教程补 `fragment-exercise.glsl`（+4）：
   - `lighting/phong-lighting`
   - `lighting/toon-shading`
   - `noise/noise-functions`
   - `noise/fractal-brownian-motion`

优先级建议：

- 先补 `lighting`（当前该分类 0 练习，补齐后学习路径更完整）
- 再补 `noise`（已有中阶定位，练习缺口影响体验）

### 5.2 新增一批“更有梯度”的习题方向（示例清单）

在不新增分类的前提下（Learn 页分类顺序写死），建议按现有分类扩充：

- `basic`
  - `aspect-ratio-uv`：宽高比校正（uv.x *= res.x/res.y）
  - `alpha-blending`：透明度/叠加与输出
  - `hsl-color-wheel`：色相/调色基础（更贴近实际 shader 调色）
- `math`
  - `rotate-uv`：旋转矩阵与坐标变换
  - `sdf-ops`：SDF 组合（union/intersection/subtraction）
  - `fwidth-antialias`：抗锯齿边缘（`fwidth` + smoothstep）
- `patterns`
  - `stripes`：条纹/斜纹/可控频率
  - `dot-grid`：点阵与平铺
  - `truchet-tiles`：Truchet 平铺（中阶图案思维）
  - `polar-patterns`：极坐标图案（角度/半径控制）
- `animation`
  - `easing-functions`：缓动与循环（提升动画质感）
  - `uv-scroll-loop`：平铺滚动与无缝循环
- `noise`
  - `voronoi-cells`：Voronoi/细胞噪声
  - `domain-warping`：域扭曲（噪声“应用型题”）
- `lighting`
  - `lambert-diffuse`：Lambert 基础与参数
  - `rim-lighting`：边缘光（可与 toon 风格结合）

> 上述为“选题方向示例”，最终数量与优先级应根据目标题量与用户学习路径调整。

## 6. 落地注意事项（保证“可用、好用、可维护”）

### 6.1 目录与文件规范

每个新教程（含练习）建议保持一致结构：

- `src/lib/tutorials/<category>/<id>/config.json`
- `src/lib/tutorials/<category>/<id>/en-README.md`
- `src/lib/tutorials/<category>/<id>/zh-README.md`
- `src/lib/tutorials/<category>/<id>/fragment.glsl`
- `src/lib/tutorials/<category>/<id>/fragment-exercise.glsl`

### 6.2 不新增分类

Learn 页分类顺序由客户端固定列表控制（见 `src/app/[locale]/learn/learn-client.tsx`），新增 category 可能不展示或排序异常；扩充优先在现有分类内完成。

### 6.3 习题骨架应“可编译”

建议避免在源码里放“不可编译占位符”，例如：

- 不要把“请填写xxx”直接放进表达式中导致语法错误
- 不要在 `main()` 内定义函数（GLSL ES 1.0 不支持）

更稳妥的做法：

- 用合法默认值占位（例如 0.0、vec2(0.0)、vec3(0.0)）
- 用清晰的 TODO 注释引导修改

### 6.4 统一使用 `u_resolution` / `u_time`

渲染组件会注入常见 uniforms（例如 `u_time`、`u_resolution`），建议习题统一使用：

- 坐标：`vec2 uv = gl_FragCoord.xy / u_resolution.xy;`
- 比例修正（需要时）：`uv.x *= u_resolution.x / u_resolution.y;`

尽量不要硬编码 `vec2(300.0, 300.0)`，以避免尺寸变化导致题目失真。

### 6.5 题目区分度与梯度

避免多个题目重复训练同一技能点（例如多个“mix + uv.x 线性渐变”）；新增题建议每个都有明确的新知识点/技能点，并在 README 的练习任务中体现“分步目标”。

## 7. 下一步建议（可选）

如果目标是“尽快增加题量且保证质量”：

1. 先补齐 5 个缺口（+5）
2. 修复 `noise/noise-texture/fragment-exercise.glsl` 的可编译性（提升可用性）
3. 按分类补 10~20 个中阶题（优先 `noise`、`lighting`、`math`、`patterns`）
4. 统一习题模板（TODO 风格、uniform 使用、坐标规范），降低后续维护成本

