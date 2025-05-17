# GLSL 项目

一个基于 Next.js 和 WebGL/GLSL 的项目，用于展示和学习 GLSL 着色器编程。

## 特点

- 使用 Next.js 13+ App Router 构建
- 使用 TypeScript 确保类型安全
- 使用 Tailwind CSS 实现响应式 UI
- 实时 GLSL 着色器预览和示例
- 符合现代前端开发规范和最佳实践

## 技术栈

- **前端框架**: Next.js 13+
- **样式方案**: Tailwind CSS
- **编程语言**: TypeScript
- **图形渲染**: WebGL, GLSL
- **包管理器**: pnpm

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm run dev
```

或者直接使用启动脚本:

```bash
chmod +x ./start.sh
./start.sh
```

访问 http://localhost:3000 查看项目运行效果。

## 项目结构

```
/
├── public/              # 静态资源
├── src/
│   ├── app/             # Next.js App Router 页面
│   ├── components/      # 可复用组件
│   │   ├── common/      # 通用组件
│   │   ├── examples/    # 着色器示例组件
│   │   ├── layout/      # 布局组件
│   │   └── ui/          # UI 组件
│   ├── hooks/           # 自定义 React Hooks
│   ├── lib/             # 工具库和函数
│   ├── styles/          # 样式文件
│   └── utils/           # 工具函数
```

## 着色器示例

项目包含多个 GLSL 着色器示例：

1. **波浪效果** - 使用正弦和余弦函数创建流动波浪
2. **火焰效果** - 使用噪声函数模拟火焰
3. **星空效果** - 创建动态星空背景

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
