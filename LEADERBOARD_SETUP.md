# 排行榜系统使用说明

## 功能概述

排行榜系统提供以下功能：

### 用户端功能
1. **个人学习统计**
   - 完成教程数量
   - 练习通过数量
   - 学习连续天数（Streak）
   - 综合评分
   - 个人排名

2. **全站排行榜**
   - 前100名用户排名
   - 可按全部时间/本月/本周筛选
   - 显示用户技能等级
   - 显示通过率和总分

3. **成就系统**
   - 自动记录用户成就
   - 在个人统计卡片中展示

### 管理员功能
1. **用户活跃统计**
   - 总用户数
   - 日活/周活/月活
   - 活跃用户数

2. **学习指标**
   - 总完成数
   - 总尝试数
   - 完成率
   - 平均学习时长

3. **数据分析**
   - 用户技能分布
   - 最受欢迎教程 Top 10
   - 30天用户增长趋势图

## 数据库设置

### 1. 运行数据库迁移

首先需要在 Supabase 中运行数据库迁移脚本：

```bash
# 如果使用 Supabase CLI
supabase db push

# 或者手动在 Supabase SQL Editor 中运行
# 文件位置: supabase/migrations/20250118000000_add_statistics_and_achievements.sql
```

这将创建以下表：
- `user_statistics` - 用户统计数据
- `user_learning_sessions` - 学习会话记录
- `user_achievements` - 用户成就
- `user_daily_activity` - 每日活跃记录
- `leaderboard_view` - 排行榜视图（包含排名计算）

### 2. 初始化用户统计

对于现有用户，运行以下 SQL 来初始化统计数据：

```sql
-- 为所有现有用户初始化统计
INSERT INTO user_statistics (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- 更新所有用户的统计数据
SELECT update_user_statistics(id) FROM auth.users;
```

## 评分规则

综合评分计算方式：
- 完成一个教程：+100 分
- 通过一个练习：+50 分
- 尝试一个练习：+10 分

**公式**：`总分 = (完成教程数 × 100) + (通过练习数 × 50) + (尝试练习数 × 10)`

## 技能等级

根据完成教程数量自动分配：
- **初学者 (Beginner)**: 0-4 个教程
- **中级 (Intermediate)**: 5-14 个教程
- **进阶 (Advanced)**: 15-29 个教程
- **专家 (Expert)**: 30-49 个教程
- **大师 (Master)**: 50+ 个教程

## 管理员配置

### 设置管理员

在 `.env.local` 文件中配置管理员邮箱：

```env
ADMIN_EMAILS=your-admin-email@example.com,another-admin@example.com
```

多个邮箱用逗号分隔。默认管理员邮箱是 `support@shader-learn.com`。

只有管理员才能看到以下内容：
- 网站使用统计
- 用户活跃度数据
- 教程完成统计
- 用户增长趋势

## API 路由

系统提供以下 API 端点：

### 用户端 API
- `GET /api/leaderboard?timeRange=all&limit=100` - 获取排行榜
  - `timeRange`: `all` | `month` | `week`
  - `limit`: 返回数量，默认 100

- `GET /api/user/statistics` - 获取当前用户统计（需要登录）
- `POST /api/user/statistics` - 更新当前用户统计（需要登录）

### 管理员 API
- `GET /api/admin/statistics` - 获取管理员统计数据（需要管理员权限）

## 更新统计数据

### 自动更新
系统会在以下情况自动更新统计：
- 用户完成练习时
- 用户提交表单时

### 手动更新
可以通过调用 API 手动触发更新：

```javascript
// 前端代码
await fetch('/api/user/statistics', { method: 'POST' });
```

或在数据库中直接调用函数：

```sql
SELECT update_user_statistics('用户ID');
```

## 页面访问

- **排行榜页面**: `/leaderboard` (英文) 或 `/zh/leaderboard` (中文)
- 已添加到导航栏，用户可以直接点击访问

## 成就系统（可扩展）

成就系统已经建立了基础结构，可以添加各种成就类型：

```sql
-- 示例：添加成就
INSERT INTO user_achievements (user_id, achievement_id, achievement_type, level)
VALUES ('用户ID', 'first_tutorial', 'tutorial_completion', 1);
```

可以自定义的成就类型：
- `tutorial_completion` - 完成教程相关
- `streak` - 连续学习相关
- `skill_level` - 技能等级相关
- `speed` - 学习速度相关
- `perfect` - 完美通过相关

## SEO 优化

排行榜页面已经配置了完整的 SEO：
- Meta 标签（title, description, keywords）
- Open Graph 标签
- Twitter Card
- hreflang 多语言支持
- 已添加到 sitemap.xml

## 性能考虑

1. **排行榜视图**：使用数据库视图预先计算排名，提高查询效率
2. **索引**：所有主要查询字段都已添加索引
3. **RLS 策略**：使用 Row Level Security 确保数据安全
4. **缓存**：前端可以根据需要添加缓存策略

## 故障排查

### 排行榜显示为空
1. 检查数据库迁移是否成功运行
2. 确认 `leaderboard_view` 视图已创建
3. 运行统计更新函数初始化数据

### 管理员统计不显示
1. 检查 `.env.local` 中的 `ADMIN_EMAILS` 配置
2. 确认当前登录用户的邮箱在管理员列表中
3. 检查浏览器控制台是否有权限错误

### 统计数据不更新
1. 手动调用更新 API
2. 检查 `user_form_status` 表是否有数据
3. 确认数据库函数 `update_user_statistics` 可以正常执行

## 未来扩展建议

1. **实时通知**
   - 当被超越时通知用户
   - 达到新成就时通知

2. **好友系统**
   - 关注其他用户
   - 查看好友排名

3. **周期性排行榜**
   - 每周排行榜重置
   - 赛季系统

4. **更多统计图表**
   - 学习时间分布
   - 学习曲线
   - 完成速度趋势

5. **导出功能**
   - 导出个人学习报告
   - 管理员数据导出

## 联系支持

如有问题，请联系：support@shader-learn.com
