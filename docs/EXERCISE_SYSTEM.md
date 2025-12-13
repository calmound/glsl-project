# GLSL 学习平台 - 习题系统文档

本文档详细说明了 GLSL 学习平台的习题系统架构、数据流程和管理方式。

## 目录
- [系统概览](#系统概览)
- [数据库架构](#数据库架构)
- [文件系统结构](#文件系统结构)
- [前端逻辑](#前端逻辑)
- [后端验证](#后端验证)
- [权限控制](#权限控制)
- [添加新习题](#添加新习题)

---

## 系统概览

### 架构图
```
┌─────────────────┐
│   用户界面      │
│  (tutorial-     │
│   client.tsx)   │
└────────┬────────┘
         │
         ├─ 自动保存代码
         │  └─> user_form_code
         │
         ├─ WebGL 验证
         │  └─> 编译 + 渲染比较
         │
         └─ 提交验证
            └─> Edge Function: submit_form
                └─> user_form_status
```

### 核心功能
1. **代码编辑** - 实时编辑 GLSL 代码，自动保存
2. **即时反馈** - WebGL 编译错误提示
3. **渲染验证** - 将用户代码与答案代码进行像素级比较
4. **进度跟踪** - 记录提交次数、通过状态、完成时间

---

## 数据库架构

### 表结构

#### 1. `user_form_code` - 用户代码存储表

存储用户编写的 GLSL 代码，支持自动保存和草稿功能。

```sql
CREATE TABLE user_form_code (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_id TEXT NOT NULL,                    -- 习题 ID (格式: category-id)
  code_content TEXT NOT NULL,               -- GLSL 代码内容
  language TEXT DEFAULT 'glsl',             -- 代码语言（默认 glsl）
  is_draft BOOLEAN DEFAULT true,            -- 是否为草稿
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 唯一约束：每个用户每个习题只能有一份代码
  CONSTRAINT user_form_code_unique UNIQUE (user_id, form_id)
);

-- 索引
CREATE INDEX idx_user_form_code_user ON user_form_code(user_id);
CREATE INDEX idx_user_form_code_form ON user_form_code(form_id);
```

**字段说明**:
- `form_id`: 习题的唯一标识符，通常为 `category-tutorialId`（如 `basic-two-color-gradient`）
- `code_content`: 用户编写的 GLSL 代码
- `is_draft`: 标记是否为草稿（当前未使用，保留字段）
- `updated_at`: 最后修改时间（用于自动保存）

**RLS (Row Level Security)**:
```sql
-- 用户只能访问自己的代码
CREATE POLICY "Users can view their own code"
  ON user_form_code FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own code"
  ON user_form_code FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own code"
  ON user_form_code FOR UPDATE
  USING (auth.uid() = user_id);
```

---

#### 2. `user_form_status` - 习题状态表

记录用户的习题完成状态、提交记录和成绩。

```sql
CREATE TABLE user_form_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_id TEXT NOT NULL,                    -- 习题 ID
  has_submitted BOOLEAN DEFAULT false,      -- 是否已提交过
  attempts INT DEFAULT 0,                   -- 尝试次数
  is_passed BOOLEAN DEFAULT false,          -- 是否通过
  first_passed_at TIMESTAMPTZ,              -- 首次通过时间
  last_submitted_at TIMESTAMPTZ,            -- 最后提交时间
  last_result JSONB,                        -- 最后一次验证结果
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 唯一约束：每个用户每个习题只能有一条状态记录
  CONSTRAINT user_form_status_unique UNIQUE (user_id, form_id)
);

-- 索引
CREATE INDEX idx_user_form_status_user ON user_form_status(user_id);
CREATE INDEX idx_user_form_status_form ON user_form_status(form_id);
CREATE INDEX idx_user_form_status_passed ON user_form_status(is_passed);
```

**字段说明**:
- `has_submitted`: 是否至少提交过一次
- `attempts`: 累计提交次数（包括失败的尝试）
- `is_passed`: 是否通过验证（一旦为 true，不会回退）
- `first_passed_at`: 首次通过的时间戳
- `last_result`: 最后一次验证结果（JSON 格式）
  ```json
  {
    "message": "Shader compiled successfully and rendering is correct",
    "timestamp": "2025-12-13T10:30:00Z",
    "validatedBy": "client-webgl-renderer"
  }
  ```

**RLS (Row Level Security)**:
```sql
-- 用户只能查看自己的状态
CREATE POLICY "Users can view their own status"
  ON user_form_status FOR SELECT
  USING (auth.uid() = user_id);

-- 用户不能直接修改状态（只能通过 Edge Function）
-- Edge Function 使用 service_role 权限进行更新
```

---

### Edge Functions

#### `submit_form` - 习题提交验证

**位置**: `supabase/functions/submit_form/index.ts`

**功能**:
1. 验证用户身份（JWT token）
2. 读取用户提交的代码
3. 接收前端传递的验证结果（`passed: boolean`）
4. 更新习题状态到 `user_form_status` 表

**请求格式**:
```typescript
POST /functions/v1/submit_form
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "formId": "basic-two-color-gradient",
  "passed": true  // 前端 WebGL 验证结果
}
```

**响应格式**:
```typescript
{
  "passed": true,
  "attempts": 3,
  "lastResult": {
    "message": "Shader compiled successfully and rendering is correct",
    "timestamp": "2025-12-13T10:30:00Z",
    "validatedBy": "client-webgl-renderer"
  },
  "firstPassedAt": "2025-12-13T10:30:00Z",
  "isPassed": true
}
```

**验证逻辑**:
- ✅ **前端验证**: WebGL 编译 + Canvas 像素比较
- ✅ **后端记录**: 更新状态和统计信息
- ⚠️ **注意**: 当前版本信任前端的验证结果

**权限验证流程**:
```typescript
// 1. 使用 anon key 验证用户 JWT
const authClient = createClient(supabaseUrl, supabaseAnonKey);
const { data: { user }, error } = await authClient.auth.getUser(jwt);

// 2. 使用 service_role 进行特权数据库操作
const adminClient = createClient(supabaseUrl, serviceRoleKey);
await adminClient.from('user_form_status').upsert(...);
```

---

## 文件系统结构

### 习题目录组织

所有习题存储在 `src/lib/tutorials/[category]/[id]/` 目录下。

```
src/lib/tutorials/
├── basic/                          # 基础分类（免费）
│   ├── two-color-gradient/
│   │   ├── config.json            # 习题配置
│   │   ├── fragment.glsl          # 完整答案代码
│   │   ├── fragment-exercise.glsl # 练习模板（初始代码）
│   │   ├── en-README.md           # 英文教程
│   │   └── zh-README.md           # 中文教程
│   └── solid-color-fill/
│       └── ...
├── math/                           # 数学公式（需登录）
│   └── circle-drawing/
│       └── ...
├── patterns/                       # 图案纹理（需登录）
├── animation/                      # 动画交互（需登录）
├── noise/                          # 噪声函数（需登录）
└── lighting/                       # 光照渲染（需登录）
```

### 必需文件详解

#### 1. `config.json` - 习题配置

定义习题的元数据、难度、前置要求等。

```json
{
  "id": "two-color-gradient",
  "title": {
    "zh": "双色混合渐变",
    "en": "Two-Color Blended Gradient"
  },
  "description": {
    "zh": "通过线性插值实现左右双色渐变效果，掌握 mix 函数和 UV 坐标的基础应用。",
    "en": "Achieve a left-to-right two-color gradient effect through linear interpolation, mastering the basics of blending and UV coordinates in GLSL."
  },
  "difficulty": "beginner",           // beginner | intermediate | advanced
  "category": "basic",                 // basic | math | patterns | animation | noise | lighting
  "tags": ["gradient", "mix", "uv"],
  "estimatedTime": 10,                 // 预计完成时间（分钟）
  "prerequisites": [],                 // 前置习题 ID 列表
  "learningObjectives": {
    "zh": [
      "学习如何使用 GLSL 线性插值函数 mix 实现颜色混合",
      "理解 UV 坐标在着色器中的应用"
    ],
    "en": [
      "Learn to use GLSL linear interpolation function mix for color blending",
      "Understand UV coordinate applications in shaders"
    ]
  },
  "uniforms": {                        // 自定义 uniform 变量（可选）
    "u_time": 0.0,
    "u_resolution": [300, 300]
  }
}
```

**字段说明**:
- `id`: 习题唯一标识符（与目录名一致）
- `title` / `description` / `learningObjectives`: 多语言支持
- `difficulty`: 难度等级，影响 UI 显示
- `category`: 所属分类，影响权限控制
- `tags`: 标签，用于搜索和分类
- `prerequisites`: 前置习题，用于学习路径规划
- `uniforms`: 自定义 uniform 变量（会传递给 ShaderCanvas）

---

#### 2. `fragment.glsl` - 完整答案代码

标准的 GLSL Fragment Shader 代码，作为正确答案。

```glsl
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    // 归一化坐标 (0.0 - 1.0)
    vec2 uv = gl_FragCoord.xy / u_resolution;

    // 定义两个颜色
    vec3 colorLeft = vec3(1.0, 0.0, 0.0);   // 红色
    vec3 colorRight = vec3(0.0, 0.0, 1.0);  // 蓝色

    // 使用 mix 函数根据 x 坐标混合颜色
    vec3 color = mix(colorLeft, colorRight, uv.x);

    gl_FragColor = vec4(color, 1.0);
}
```

**用途**:
- 提供正确的渲染结果（用于像素比较）
- 作为"查看答案"功能的内容
- 参考实现

---

#### 3. `fragment-exercise.glsl` - 练习模板

提供给用户的初始代码，通常包含框架代码和 TODO 标记。

```glsl
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
    // 归一化坐标
    vec2 uv = gl_FragCoord.xy / u_resolution;

    // TODO: 定义左侧颜色（红色）
    vec3 colorLeft = vec3(1.0, 0.0, 0.0);

    // TODO: 定义右侧颜色（蓝色）
    vec3 colorRight = vec3(0.0, 0.0, 1.0);

    // TODO: 使用 mix 函数实现颜色混合
    // 提示：mix(a, b, t) 可以在 a 和 b 之间进行线性插值
    vec3 color = vec3(0.0); // 修改这里

    gl_FragColor = vec4(color, 1.0);
}
```

**设计原则**:
- 保留必要的框架代码（uniform、main 函数等）
- 用 `TODO` 标记需要学生完成的部分
- 提供适当的提示和注释
- 确保代码可编译（即使输出不正确）

---

#### 4. `en-README.md` / `zh-README.md` - 教程文档

使用 Markdown 编写的教程内容，支持多语言。

```markdown
# 双色混合渐变

## 💡 知识点

### 1. UV 坐标系统
在片段着色器中，`gl_FragCoord` 表示当前像素的屏幕坐标...

### 2. mix 函数
`mix(a, b, t)` 是 GLSL 中的线性插值函数...

## 📝 练习目标

实现一个从左到右的双色渐变效果：
- 左边为红色 (1.0, 0.0, 0.0)
- 右边为蓝色 (0.0, 0.0, 1.0)

## 💻 实现步骤

1. 定义两个颜色向量
2. 使用 UV 坐标的 x 分量作为混合因子
3. 使用 mix 函数混合两个颜色

## 🎯 验证标准

正确的渲染结果应该是：
- 最左边是纯红色
- 最右边是纯蓝色
- 中间平滑过渡为紫色
```

**Markdown 支持的特性**:
- 标题、列表、代码块
- 公式（通过 KaTeX 渲染）
- 图片（放在 `public/` 目录）
- 链接

---

## 前端逻辑

### 页面组件架构

```
src/app/[locale]/learn/[category]/[id]/
├── page.tsx                           # 服务端组件（SSR）
│   └── 读取教程数据
│   └── 预取用户代码
│   └── 传递给客户端组件
│
└── tutorial-client.tsx                # 客户端组件
    ├── 代码编辑器 (CodeEditor)
    ├── 渲染预览 (ShaderCanvas)
    ├── 自动保存逻辑
    ├── 验证逻辑
    └── 提交逻辑
```

### 核心功能实现

#### 1. 代码自动保存

**触发时机**: 用户停止编辑 2 秒后

```typescript
// 防抖保存（2秒）
const handleUserCodeChange = useCallback((newCode: string) => {
  setUserCode(newCode);

  // 清除之前的定时器
  if (saveTimeoutRef.current) {
    clearTimeout(saveTimeoutRef.current);
  }

  // 设置新的定时器
  saveTimeoutRef.current = setTimeout(() => {
    saveUserCode(newCode);
  }, 2000);
}, []);

// 保存到数据库
const saveUserCode = async (code: string) => {
  const supabase = createBrowserSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return; // 未登录用户不保存

  await supabase
    .from('user_form_code')
    .upsert({
      user_id: user.id,
      form_id: tutorialId,
      code_content: code,
      language: 'glsl',
      is_draft: true
    }, { onConflict: 'user_id,form_id' });
};
```

**优化**:
- 使用防抖（debounce）避免频繁保存
- 使用 `upsert` 避免重复插入
- 失败静默处理，不影响用户体验

---

#### 2. WebGL 编译验证

**实时编译检查**:

```typescript
const handleCompileError = (error: string | null) => {
  if (error) {
    const parsedError = parseShaderError(error);
    const formattedError = formatErrorMessage(parsedError);
    setCompileError(formattedError);
  } else {
    setCompileError(null);
  }
};
```

**错误解析**: 将 WebGL 错误转换为友好的提示

```typescript
// 示例：ERROR: 0:10: 'vec' : syntax error
// 转换为：第 10 行: 语法错误 - 'vec' 附近
```

---

#### 3. 渲染结果比较

**验证流程**:

```typescript
const handleSubmitCode = async () => {
  // 1. 获取两个 canvas 的渲染结果
  const userCanvas = userCanvasRef.current?.getCanvas();
  const answerCanvas = answerCanvasRef.current?.getCanvas();

  if (!userCanvas || !answerCanvas) {
    addToast('无法获取渲染结果', 'error');
    return;
  }

  // 2. 比较像素数据
  const userImageData = userCanvas.getContext('2d')
    ?.getImageData(0, 0, userCanvas.width, userCanvas.height);
  const answerImageData = answerCanvas.getContext('2d')
    ?.getImageData(0, 0, answerCanvas.width, answerCanvas.height);

  const isPassed = comparePixels(userImageData, answerImageData);

  // 3. 调用 Edge Function 提交结果
  const response = await fetch('/functions/v1/submit_form', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      formId: tutorialId,
      passed: isPassed
    })
  });
};

// 像素比较函数（容许小误差）
function comparePixels(img1, img2, tolerance = 5) {
  if (img1.data.length !== img2.data.length) return false;

  let differentPixels = 0;
  for (let i = 0; i < img1.data.length; i += 4) {
    const diff = Math.abs(img1.data[i] - img2.data[i]) +
                 Math.abs(img1.data[i+1] - img2.data[i+1]) +
                 Math.abs(img1.data[i+2] - img2.data[i+2]);

    if (diff > tolerance) {
      differentPixels++;
    }
  }

  // 允许 1% 的像素误差
  const errorRate = differentPixels / (img1.data.length / 4);
  return errorRate < 0.01;
}
```

**验证标准**:
- 像素级比较
- 容许小误差（tolerance = 5）
- 允许 1% 的像素差异

---

#### 4. 进度显示

**学习路径可视化** (`src/components/learn/learning-path.tsx`):

```typescript
export function LearningPath({ tutorials, userProgress, locale }) {
  return (
    <div>
      {tutorials.map((tutorial, index) => {
        const progress = userProgress[tutorial.id];
        const isCompleted = progress?.is_passed || false;

        return (
          <div key={tutorial.id}>
            {/* 完成标记 */}
            <div className={isCompleted ? 'bg-green-500' : 'bg-gray-200'}>
              {isCompleted ? '✓' : index + 1}
            </div>

            {/* 教程信息 */}
            <div>
              <h4>{tutorial.title}</h4>
              {progress && <p>{progress.attempts} 次尝试</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

**进度数据获取**:

```typescript
useEffect(() => {
  const fetchUserProgress = async () => {
    const { user } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('user_form_status')
      .select('*')
      .eq('user_id', user.id);

    // 转换为 Map 结构
    const progressMap = {};
    data.forEach(item => {
      progressMap[item.form_id] = item;
    });

    setUserProgress(progressMap);
  };

  fetchUserProgress();
}, [user]);
```

---

## 权限控制

### 访问规则

定义在 `src/lib/access-control.ts`:

```typescript
// 免费分类
export const FREE_CATEGORIES = ['basic'];

// 高级分类（需登录）
export const PREMIUM_CATEGORIES = [
  'math',
  'lighting',
  'patterns',
  'animation',
  'noise'
];

export function requiresAuth(category: string): boolean {
  return PREMIUM_CATEGORIES.includes(category);
}

export function hasAccessToCategory(
  category: string,
  isAuthenticated: boolean
): boolean {
  if (FREE_CATEGORIES.includes(category)) {
    return true;
  }
  return isAuthenticated;
}
```

### 前端权限检查

**学习列表页面**:
- 高级分类显示"需登录"标记
- 所有分类可见（SEO 友好）

**教程详情页面**:
- 服务端正常渲染（SEO 友好）
- 客户端检测权限
- 未登录访问高级章节：
  - 显示登录提示遮罩
  - 编辑器只读模式
  - 禁用提交按钮

---

## 添加新习题

### 步骤清单

#### 1. 创建习题目录

```bash
mkdir -p src/lib/tutorials/[category]/[new-tutorial-id]
cd src/lib/tutorials/[category]/[new-tutorial-id]
```

#### 2. 创建必需文件

**a. `config.json`**
```json
{
  "id": "new-tutorial-id",
  "title": {
    "zh": "习题标题",
    "en": "Tutorial Title"
  },
  "description": {
    "zh": "习题描述",
    "en": "Tutorial Description"
  },
  "difficulty": "beginner",
  "category": "basic",
  "tags": ["tag1", "tag2"],
  "estimatedTime": 15,
  "prerequisites": [],
  "learningObjectives": {
    "zh": ["学习目标1", "学习目标2"],
    "en": ["Learning Objective 1", "Learning Objective 2"]
  },
  "uniforms": {
    "u_time": 0.0,
    "u_resolution": [300, 300]
  }
}
```

**b. `fragment.glsl`** - 完整答案代码
```glsl
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

void main() {
    // 你的答案代码
    gl_FragColor = vec4(1.0);
}
```

**c. `fragment-exercise.glsl`** - 练习模板
```glsl
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

void main() {
    // TODO: 完成这里的代码

    gl_FragColor = vec4(0.0);
}
```

**d. `zh-README.md` 和 `en-README.md`**
```markdown
# 习题标题

## 💡 知识点

### 核心概念
说明...

## 📝 练习目标

具体要求...

## 💻 实现步骤

1. 步骤1
2. 步骤2

## 🎯 验证标准

预期结果...
```

#### 3. 测试验证

1. **本地开发测试**:
   ```bash
   pnpm dev
   ```

2. **访问习题页面**:
   ```
   http://localhost:3000/learn/[category]/[new-tutorial-id]
   ```

3. **检查清单**:
   - [ ] 教程内容正确显示
   - [ ] 代码编辑器加载成功
   - [ ] WebGL 编译无错误
   - [ ] 答案代码渲染正确
   - [ ] 练习模板可编译
   - [ ] 提交验证功能正常
   - [ ] 进度保存正确

#### 4. 提交代码

```bash
git add src/lib/tutorials/[category]/[new-tutorial-id]
git commit -m "feat(learn): 添加新习题 [new-tutorial-id]"
git push
```

---

## 最佳实践

### 习题设计原则

1. **循序渐进**:
   - 从简单到复杂
   - 每个习题专注一个知识点
   - 设置合理的前置要求

2. **清晰的目标**:
   - 明确的学习目标
   - 具体的完成标准
   - 可验证的输出结果

3. **友好的提示**:
   - 提供必要的代码框架
   - 添加有用的注释和 TODO
   - 给出适当的提示（不直接给答案）

4. **合理的难度**:
   - 初级：5-10 分钟
   - 中级：10-20 分钟
   - 高级：20-30 分钟

### 代码质量要求

1. **着色器代码**:
   - 使用标准 GLSL 语法
   - 添加适当的注释
   - 保持代码简洁易读
   - 使用有意义的变量名

2. **配置文件**:
   - 双语完整支持
   - 准确的难度标记
   - 合理的标签分类

3. **教程文档**:
   - 清晰的结构
   - 详细的解释
   - 丰富的示例
   - 相关的参考链接

---

## 常见问题

### Q: 如何修改已有习题？

A: 直接修改对应目录下的文件，刷新页面即可看到更新（开发环境）。生产环境需要重新部署。

### Q: 可以添加图片吗？

A: 可以。将图片放在 `public/images/tutorials/` 目录，然后在 Markdown 中引用：
```markdown
![描述](/images/tutorials/your-image.png)
```

### Q: 如何调试验证逻辑？

A:
1. 打开浏览器开发者工具
2. 查看 Console 日志
3. 检查 Network 面板的 Edge Function 请求
4. 使用 `console.log` 打印中间结果

### Q: 用户数据如何备份？

A: Supabase 自动备份数据库。也可以手动导出：
```bash
# 导出用户代码
supabase db dump --table user_form_code > backup.sql

# 导出用户状态
supabase db dump --table user_form_status >> backup.sql
```

### Q: 如何重置用户进度？

A: 通过 Supabase Dashboard 或 SQL:
```sql
-- 重置特定用户的特定习题
DELETE FROM user_form_status
WHERE user_id = 'xxx' AND form_id = 'basic-xxx';

-- 重置特定用户的所有进度
DELETE FROM user_form_status WHERE user_id = 'xxx';
DELETE FROM user_form_code WHERE user_id = 'xxx';
```

---

## 技术栈

- **前端**: Next.js 15, React 19, TypeScript
- **样式**: Tailwind CSS 4
- **编辑器**: CodeMirror
- **渲染**: WebGL (Three.js)
- **后端**: Supabase (PostgreSQL + Edge Functions)
- **认证**: Supabase Auth (OAuth)
- **部署**: Vercel

---

## 更新日志

### 2025-12-13
- ✅ 添加权限控制系统（Basic 免费，其他需登录）
- ✅ 实现登录提示遮罩
- ✅ 优化用户认证流程（AuthContext）
- ✅ 修复 Edge Function 401 错误
- ✅ 创建本文档

---

## 相关文档

- [数据库架构文档](./ACTUAL_DATABASE_SCHEMA.md)
- [VIP 访问控制实现](./VIP_ACCESS_CONTROL_IMPLEMENTATION.md)
- [项目总览](../CLAUDE.md)

---

**维护者**: GLSL Learning Platform Team
**最后更新**: 2025-12-13
