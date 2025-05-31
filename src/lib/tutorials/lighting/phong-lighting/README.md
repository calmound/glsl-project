# Phong光照模型

学习经典的Phong光照模型，创建逼真的3D光照效果。

## 学习目标

- 理解Phong光照模型的三个组成部分
- 学习如何计算法向量和光照方向
- 掌握环境光、漫反射和镜面反射的实现

## 核心概念

### Phong光照模型组成

1. **环境光 (Ambient)**：基础照明，模拟间接光照
2. **漫反射 (Diffuse)**：表面粗糙度，光线均匀散射
3. **镜面反射 (Specular)**：表面光滑度，产生高光

### 光照计算公式

```glsl
vec3 ambient = ambientStrength * lightColor;
vec3 diffuse = max(dot(normal, lightDir), 0.0) * lightColor;
vec3 specular = pow(max(dot(viewDir, reflectDir), 0.0), shininess) * lightColor;
vec3 result = ambient + diffuse + specular;
```

### 关键向量

- **法向量 (Normal)**：表面垂直方向
- **光照方向 (Light Direction)**：从表面指向光源
- **视线方向 (View Direction)**：从表面指向观察者
- **反射方向 (Reflect Direction)**：光线反射方向

## 练习

实现一个完整的Phong光照模型，包含环境光、漫反射和镜面反射。

### 提示

1. 定义光源位置和颜色
2. 计算表面法向量（可以使用简单的球面法向量）
3. 实现三种光照分量的计算
4. 调整各分量的强度参数
5. 组合最终的光照结果

## 预期效果

你应该看到一个具有逼真光照效果的3D表面，包含柔和的环境光、根据角度变化的漫反射，以及明亮的镜面高光。