# 简单矩形

## 学习目标

通过本教程，你将学会：
- 理解基于坐标的形状绘制原理
- 掌握条件判断语句在着色器中的应用
- 学习如何定义和检测矩形区域
- 了解布尔运算在图形编程中的作用

## 核心概念

### 基于坐标的形状绘制
在着色器中，我们不是直接"绘制"形状，而是对每个像素进行判断：当前像素是否属于某个形状。这种思维方式是着色器编程的核心。

### 矩形的数学定义
一个矩形可以通过四个边界来定义：
- **左边界**：`x >= left`
- **右边界**：`x <= right`
- **下边界**：`y >= bottom`
- **上边界**：`y <= top`

只有当所有四个条件都满足时，点才在矩形内部。

### 坐标系统
在GLSL中，归一化坐标系统的特点：
- 原点(0,0)位于左下角
- X轴向右递增，Y轴向上递增
- 坐标范围通常是[0.0, 1.0]

## 相关函数和语法

### 条件判断语句
```glsl
if (condition) {
    // 条件为真时执行
} else {
    // 条件为假时执行
}
```

### 布尔运算符
```glsl
&&  // 逻辑与（AND）- 两个条件都为真
||  // 逻辑或（OR） - 至少一个条件为真
!   // 逻辑非（NOT）- 取反
```

### 比较运算符
```glsl
>=  // 大于等于
<=  // 小于等于
>   // 大于
<   // 小于
==  // 等于
!=  // 不等于
```

### 布尔变量
```glsl
bool isInside = true;
bool isOutside = false;
bool condition = (x > 0.5);
```

## 代码解析

在练习代码中，你需要完成以下任务：

1. **获取归一化坐标**：
   ```glsl
   vec2 uv = gl_FragCoord.xy / u_resolution.xy;
   ```

2. **定义矩形边界**：
   ```glsl
   float left = 0.3;    // 左边界（30%位置）
   float right = 0.7;   // 右边界（70%位置）
   float bottom = 0.4;  // 下边界（40%位置）
   float top = 0.6;     // 上边界（60%位置）
   ```

3. **检测点是否在矩形内**：
   ```glsl
   bool insideRect = (uv.x >= left && uv.x <= right) && 
                     (uv.y >= bottom && uv.y <= top);
   ```
   这个表达式检查：
   - X坐标是否在左右边界之间
   - Y坐标是否在上下边界之间
   - 只有两个条件都满足，点才在矩形内

4. **根据位置设置颜色**：
   ```glsl
   vec3 color;
   if (insideRect) {
       color = vec3(1.0, 1.0, 1.0);  // 白色
   } else {
       color = vec3(0.0, 0.0, 0.0);  // 黑色
   }
   ```

## 矩形绘制原理

### 边界检测
对于每个像素，我们需要检查它是否满足所有边界条件：

```glsl
// 分步检查
bool xInRange = (uv.x >= left) && (uv.x <= right);
bool yInRange = (uv.y >= bottom) && (uv.y <= top);
bool insideRect = xInRange && yInRange;
```

### 逻辑运算的组合
```glsl
// 方法1：分别检查X和Y
bool insideX = uv.x >= left && uv.x <= right;
bool insideY = uv.y >= bottom && uv.y <= top;
bool inside = insideX && insideY;

// 方法2：一次性检查所有条件
bool inside = uv.x >= left && uv.x <= right && 
              uv.y >= bottom && uv.y <= top;
```

### 颜色分配策略
```glsl
// 方法1：使用if-else
if (inside) {
    color = vec3(1.0);  // 白色
} else {
    color = vec3(0.0);  // 黑色
}

// 方法2：使用三元运算符（更高级）
vec3 color = inside ? vec3(1.0) : vec3(0.0);

// 方法3：使用数学转换
float factor = float(inside);  // bool转float
vec3 color = vec3(factor);
```

## 实践提示

- **坐标理解**：记住(0,0)在左下角，(1,1)在右上角
- **边界值**：注意使用`>=`和`<=`来包含边界像素
- **调试技巧**：可以先用不同颜色显示X和Y的范围来调试
- **精度考虑**：浮点数比较时要注意精度问题

## 常见变体

### 居中矩形
```glsl
float centerX = 0.5;
float centerY = 0.5;
float width = 0.4;
float height = 0.2;

float left = centerX - width * 0.5;
float right = centerX + width * 0.5;
float bottom = centerY - height * 0.5;
float top = centerY + height * 0.5;
```

### 多个矩形
```glsl
bool rect1 = /* 第一个矩形的条件 */;
bool rect2 = /* 第二个矩形的条件 */;
bool anyRect = rect1 || rect2;  // 在任一矩形内
```

### 矩形边框
```glsl
bool outerRect = /* 外矩形条件 */;
bool innerRect = /* 内矩形条件 */;
bool border = outerRect && !innerRect;  // 只有边框
```

## 扩展思考

完成基础练习后，可以尝试：
1. 创建多个不同颜色的矩形
2. 制作矩形边框效果
3. 使用数学函数创建动态大小的矩形
4. 结合旋转变换创建倾斜的矩形

通过掌握矩形绘制，你将理解基于坐标的形状绘制原理，这是创建更复杂几何形状的基础。
