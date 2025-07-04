# 基础渐变效果

在这个案例中，我们将通过一个简单的垂直渐变，学习 GLSL 中位置与颜色的关系。你将掌握如何将屏幕坐标转为归一化 UV，并将其映射为像素颜色。

---

## 学习目标

- 理解如何通过 `gl_FragCoord` 获取当前像素位置
- 掌握坐标归一化方法，构造标准 UV 坐标系
- 将位置数据映射为颜色强度，生成渐变视觉效果
- 熟悉 `vec4` 色彩向量的构造与使用

---

## 核心概念

### 1. 获取当前像素位置

在片元着色器中，每个像素都有一个固定的位置坐标，使用 `gl_FragCoord.xy` 获取，单位是像素。

```glsl
vec2 pos = gl_FragCoord.xy;
```

这一步告诉我们：着色器是以“像素为单位”进行渲染的。

---

### 2. 坐标归一化为 UV

不同设备分辨率不同，为了统一处理逻辑，我们通常将像素坐标转换成 0~1 范围的比例坐标，即 UV。

做法是：将每个像素的位置除以画布总尺寸（用 `u_resolution` 传入）。

```glsl
vec2 uv = gl_FragCoord.xy / u_resolution.xy;
```

- 左下角的 UV 是 (0.0, 0.0)
- 右上角的 UV 是 (1.0, 1.0)

UV 坐标是图形学中非常基础、非常关键的概念。

---

### 3. 使用 UV 控制颜色通道

将 UV 坐标的某个分量映射为颜色的某个通道，就能根据像素位置制造出颜色渐变。

- `uv.y` 表示垂直方向上的归一化位置（从下 0 到上 1）；
- 如果将 `uv.y` 的值赋给蓝色通道，会得到一个从下到上逐渐变蓝的 **垂直渐变**；
- 如果改为使用 `uv.x`，颜色变化将从左到右，形成 **水平渐变**。

你还可以使用更复杂的组合，例如 `(uv.x + uv.y) / 2.0`，实现对角线渐变。这种方式将空间位置数据映射为颜色，是构建视觉图像的基础技巧。

---

### 4. 输出颜色

在 GLSL 中，颜色使用 `vec4` 表示：分别对应 R（红）、G（绿）、B（蓝）和 A（不透明度）。

```glsl
vec4 color = vec4(R, G, B, A);
gl_FragColor = color;
```

每个通道的值范围是 `0.0` 到 `1.0`。例如，当蓝色通道设置为 `uv.y` 时，就会随着 y 值增加而变蓝。

---

## 练习建议

请根据上面的知识点，尝试实现一个从白色逐渐变为蓝色的垂直渐变：

1. 使用 `gl_FragCoord.xy` 获取像素位置
2. 使用 `u_resolution` 将其归一化为 `uv`
3. 取 `uv.y` 作为蓝色通道值
4. 保持红色和绿色为常量
5. 使用 `vec4` 构造颜色，并输出到 `gl_FragColor`

---

## 相关函数/变量参考表

| 名称              | 类型     | 说明                                     |
|-------------------|----------|------------------------------------------|
| `gl_FragCoord`     | `vec4`   | 当前片元的屏幕像素坐标（单位：像素）       |
| `u_resolution`     | `vec2`   | 画布分辨率，由外部传入                     |
| `vec2(x, y)`       | `vec2`   | 二维向量，用于表示坐标                     |
| `vec4(r, g, b, a)` | `vec4`   | 四维颜色向量，R/G/B/A 分别代表颜色通道     |
| `/`                | 运算符   | 用于坐标归一化处理                         |

---

