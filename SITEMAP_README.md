# Sitemap 实现说明

本项目已成功实现了完整的 sitemap 生成功能，支持中英文双语网站的 SEO 优化。

## 实现的功能

### 1. 主要 Sitemap (`/sitemap.xml`)
- **首页**: 中文版 (`/`) 和英文版 (`/en/`)
- **学习页面**: 中文版 (`/learn`) 和英文版 (`/en/learn`)
- **教程详情页**: 基于 `/src/lib/tutorials` 文件夹自动生成所有教程的中英文版本
- **关于页面**: `/about`
- **GLSL指南页面**: `/glslify-guide`

### 2. Robots.txt (`/robots.txt`)
- 指向主 sitemap
- 设置爬虫规则
- 允许访问主要页面
- 禁止访问 API 路由

### 3. Sitemap 索引 (`/sitemap-index.xml`)
- 为将来可能的 sitemap 分割做准备
- 目前指向主 sitemap

## 文件结构

```
src/app/
├── sitemap.xml/
│   └── route.ts          # 主 sitemap 生成器
├── robots.txt/
│   └── route.ts          # robots.txt 生成器
└── sitemap-index.xml/
    └── route.ts          # sitemap 索引生成器
```

## 技术特性

### 1. 国际化支持
- 自动为每个页面生成中英文版本
- 使用 `hreflang` 标签指示语言版本
- 包含 `x-default` 标签指向默认语言版本

### 2. 动态内容生成
- 自动扫描 `/src/lib/tutorials` 文件夹
- 读取每个教程的 `config.json` 配置
- 生成对应的详情页 URL

### 3. SEO 优化
- 设置适当的 `lastmod`、`changefreq` 和 `priority`
- 缓存控制头优化性能
- 符合 XML sitemap 标准

### 4. 性能优化
- 服务端生成，减少客户端负担
- 设置合适的缓存策略
- 错误处理机制

## 配置说明

### 环境变量
```bash
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### Next.js 配置
在 `next.config.ts` 中添加了 headers 配置，确保 sitemap 和 robots.txt 的正确 MIME 类型和缓存策略。

### 布局配置
在 `src/app/[locale]/layout.tsx` 中添加了 sitemap meta 标签。

## 访问地址

- 主 Sitemap: `https://your-domain.com/sitemap.xml`
- Robots.txt: `https://your-domain.com/robots.txt`
- Sitemap 索引: `https://your-domain.com/sitemap-index.xml`

## 验证方法

1. **本地测试**:
   ```bash
   npm run dev
   curl http://localhost:3001/sitemap.xml
   curl http://localhost:3001/robots.txt
   ```

2. **生产环境**:
   - 在浏览器中访问 sitemap URL
   - 使用 Google Search Console 提交 sitemap
   - 使用在线 sitemap 验证工具

## 维护说明

### 添加新页面
1. 如果是静态页面，在 `generateUrlEntries` 函数中添加新的 URL 条目
2. 如果是动态页面，确保相关的数据获取逻辑包含在 sitemap 生成中

### 修改教程结构
如果教程文件夹结构发生变化，需要相应更新 `getTutorials` 函数的逻辑。

### 性能监控
- 监控 sitemap 生成时间
- 定期检查 sitemap 的完整性
- 关注搜索引擎的抓取情况

## 搜索引擎提交

建议将 sitemap 提交到以下搜索引擎:
- Google Search Console
- Bing Webmaster Tools
- 百度站长平台

## 注意事项

1. **URL 限制**: 单个 sitemap 最多包含 50,000 个 URL
2. **文件大小**: 未压缩的 sitemap 不应超过 50MB
3. **更新频率**: 根据内容更新频率设置合适的 `changefreq`
4. **优先级**: 合理设置页面的 `priority` 值（0.0-1.0）

当前实现已经考虑了这些限制，并为将来的扩展做好了准备。