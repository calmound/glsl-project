# v2.md 方案与实际代码对比分析

**文档版本**: v1.0
**分析日期**: 2025-12-03
**分析范围**: 结合 v2.md 改进计划与当前代码实现

---

## 📋 总体评估

| 类别 | v2.md 规划 | 当前实现状态 | 优先级 |
|------|-----------|------------|--------|
| 数据完整性 | ✅ 已完成 UNIQUE 约束 | ✅ 已实施 | - |
| 性能优化 | 需要缓存表和视图 | ❌ 未实施 | 🔴 高 |
| 用户体验 | 需要进度可视化 | ❌ 未实施 | 🟡 中 |
| 代码质量 | 需要类型安全和错误处理 | ⚠️ 部分实施 | 🟡 中 |
| 安全性 | 需要 CSP、速率限制 | ❌ 未实施 | 🟡 中 |

---

## 🔍 详细分析

### 1. 性能优化问题 🔴 高优先级

#### 1.1 教程列表加载性能问题

**当前实现**（`src/lib/tutorials-server.ts:39-100`）：
```typescript
export async function getTutorials(locale: Locale): Promise<Tutorial[]> {
  const tutorials: Tutorial[] = [];
  const tutorialsDir = path.join(process.cwd(), 'src/lib/tutorials');

  // 读取所有分类目录
  const categories = fs.readdirSync(tutorialsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const category of categories) {
    // 为每个教程读取 config.json
    // ... 文件系统操作
  }
}
```

**问题**：
- ❌ 每次请求都读取 30 个 config.json 文件
- ❌ 涉及大量文件系统 I/O 操作
- ❌ 无缓存机制
- ❌ 在服务端渲染时会阻塞页面加载

**v2.md 建议**：创建 `tutorial_metadata` 表

**实施建议**：
1. **立即实施**：创建教程元数据缓存表
2. **迁移策略**：
   ```sql
   -- 创建表
   CREATE TABLE tutorial_metadata (...);

   -- 初始数据导入脚本
   -- scripts/import-tutorial-metadata.js
   ```
3. **更新查询逻辑**：
   ```typescript
   // src/lib/tutorials-server.ts
   export async function getTutorials(locale: Locale) {
     const supabase = await createServerSupabase();
     const { data } = await supabase
       .from('tutorial_metadata')
       .select('*')
       .order('order_index');
     return data;
   }
   ```

**预期收益**：
- ✅ 查询速度从 ~50ms 降低到 ~5ms
- ✅ 减少文件系统压力
- ✅ 支持高级搜索和过滤

---

#### 1.2 用户进度统计缺失

**当前状态**：
- ❌ 没有用户进度汇总查询
- ❌ 教程列表页不显示完成状态
- ❌ 无法快速获取用户的学习统计

**v2.md 建议**：创建 `user_progress_summary` 视图

**实施建议**：
```sql
-- 立即创建此视图
CREATE VIEW user_progress_summary AS
SELECT
  ufs.user_id,
  COUNT(*) AS total_tutorials,
  SUM(CASE WHEN ufs.is_passed THEN 1 ELSE 0 END) AS passed_count,
  SUM(CASE WHEN ufs.has_submitted THEN 1 ELSE 0 END) AS submitted_count,
  SUM(ufs.attempts) AS total_attempts,
  ROUND(100.0 * SUM(CASE WHEN ufs.is_passed THEN 1 ELSE 0 END) / COUNT(*), 2) AS completion_percentage
FROM user_form_status ufs
GROUP BY ufs.user_id;
```

**使用示例**：
```typescript
// src/app/[locale]/learn/page.tsx
const { data: progress } = await supabase
  .from('user_progress_summary')
  .select('*')
  .eq('user_id', user.id)
  .single();

// 显示：您已完成 12/30 个教程 (40%)
```

**预期收益**：
- ✅ 用户可以看到学习进度
- ✅ 提高用户学习动力
- ✅ 单次查询获取所有统计

---

#### 1.3 代码编辑器自动保存优化

**当前实现**（`src/app/[locale]/learn/[category]/[id]/tutorial-client.tsx:84-86`）：
```typescript
// 自动保存逻辑（防抖 2 秒）
const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
```

**问题**：
- ⚠️ 2 秒防抖可能过于频繁
- ❌ 没有 onBlur 立即保存
- ❌ 用户快速输入时可能感觉卡顿

**v2.md 建议**：增加到 5 秒 + onBlur 立即保存

**实施建议**：
```typescript
// 优化后的自动保存
const debouncedSave = useMemo(
  () =>
    debounce(async (code: string) => {
      await saveCode(code);
    }, 5000), // 增加到 5 秒
  []
);

// 添加 onBlur 立即保存
const handleEditorBlur = () => {
  debouncedSave.flush(); // 立即执行保存
  debouncedSave.cancel(); // 取消等待中的保存
};

<CodeEditor
  value={userCode}
  onChange={setUserCode}
  onBlur={handleEditorBlur}
  locale={locale}
/>
```

**预期收益**：
- ✅ 减少不必要的数据库写入
- ✅ 提高编辑器响应速度
- ✅ 用户离开编辑器时立即保存，防止数据丢失

---

#### 1.4 Shader 编译优化

**当前实现**（`src/components/common/shader-canvas-new.tsx:145-200`）：

**问题分析**：
- ❌ 每次 fragmentShader 改变都会重新编译
- ❌ 如果代码有语法错误，会反复尝试编译失败的代码
- ❌ 没有编译结果缓存

**v2.md 建议**：添加编译错误检测，避免反复编译无效代码

**实施建议**：
```typescript
// src/components/common/shader-canvas-new.tsx
const [lastValidShader, setLastValidShader] = useState<string>('');
const [compileError, setCompileError] = useState<string | null>(null);
const compileAttemptRef = useRef(0);

const compileShader = useCallback((shader: string) => {
  // 如果代码没有变化，跳过编译
  if (shader === lastValidShader) return;

  // 如果连续编译失败超过3次，延迟重试
  if (compileError && compileAttemptRef.current > 3) {
    console.warn('多次编译失败，延迟重试');
    return;
  }

  try {
    const program = createProgram(gl, vertexShader, shader);
    if (program) {
      setLastValidShader(shader);
      setCompileError(null);
      compileAttemptRef.current = 0;
      programRef.current = program;
    } else {
      compileAttemptRef.current++;
      setCompileError('编译失败');
    }
  } catch (error) {
    compileAttemptRef.current++;
    setCompileError(error.message);
  }
}, [lastValidShader, compileError]);

// 使用防抖编译
const debouncedCompile = useMemo(
  () => debounce(compileShader, 500),
  [compileShader]
);
```

**预期收益**：
- ✅ 减少 CPU 占用
- ✅ 避免反复编译失败的代码
- ✅ 提高编辑器流畅度

---

### 2. 代码质量问题 🟡 中优先级

#### 2.1 调试代码清理

**问题**（`src/app/[locale]/learn/[category]/[id]/page.tsx:161-206`）：
```typescript
console.log('🔍 [服务端] 开始预取用户代码...');
console.log('🔍 [服务端] 用户登录状态:', user ? `已登录 (${user.id})` : '未登录');
console.log('🔍 [服务端] 教程ID:', tutorial.id);
console.log('🔍 [服务端] 正在查询数据库...');
console.log('🔍 [服务端] 数据库查询结果:', {...});
console.log('%c [ data ]-187', 'font-size:13px; background:pink; color:#bf2c9f;', data);
// ... 更多 console.log
```

**问题**：
- ❌ 生产环境会输出大量日志
- ❌ 可能泄露敏感信息（用户 ID、代码内容）
- ❌ 影响性能

**实施建议**：
```typescript
// src/lib/logger.ts
export const logger = {
  debug: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[DEBUG]', ...args);
    }
  },
  info: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.info('[INFO]', ...args);
    }
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  }
};

// 使用
import { logger } from '@/lib/logger';

logger.debug('🔍 [服务端] 开始预取用户代码...');
logger.info('✅ [服务端] 成功加载用户代码');
logger.error('❌ [服务端] 数据库查询错误:', error);
```

**预期收益**：
- ✅ 生产环境不输出调试日志
- ✅ 统一的日志格式
- ✅ 可以轻松切换日志级别

---

#### 2.2 类型定义统一

**当前状态**：
- `src/lib/tutorials-server.ts`: 定义了 `Tutorial` 和 `TutorialConfig`
- `src/app/[locale]/learn/[category]/[id]/tutorial-client.tsx`: 定义了 `Tutorial`
- 类型定义分散，不一致

**v2.md 建议**：统一到 `src/types/tutorial.ts`

**实施建议**：
```typescript
// src/types/tutorial.ts
export interface TutorialConfig {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  estimatedTime: number;
  prerequisites?: string[];
  learningObjectives: LocalizedStringArray;
  uniforms: Record<string, number | number[]>;
  isPremium?: boolean;
  order_index?: number;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

export interface UserProgress {
  user_id: string;
  form_id: string;
  has_submitted: boolean;
  is_passed: boolean;
  attempts: number;
  last_submitted_at: string | null;
  first_passed_at: string | null;
  last_result: ValidationResult | null;
}

export interface ValidationResult {
  passed: boolean;
  message: string;
  errors?: string[];
}

export type LocalizedString = {
  zh: string;
  en: string;
};

export type LocalizedStringArray = {
  zh: string[];
  en: string[];
};

// Database types
export interface TutorialMetadata {
  id: string;
  category: string;
  title_en: string;
  title_zh: string;
  description_en: string;
  description_zh: string;
  difficulty: string;
  estimated_time: number;
  tags: string[];
  is_premium: boolean;
  prerequisites: string[];
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface UserProgressSummary {
  user_id: string;
  total_tutorials: number;
  passed_count: number;
  submitted_count: number;
  total_attempts: number;
  completion_percentage: number;
}
```

**迁移步骤**：
1. 创建 `src/types/tutorial.ts`
2. 更新所有导入
3. 删除重复定义

---

#### 2.3 错误处理改进

**当前状态**：
```typescript
// tutorials-server.ts
} catch (error) {
  console.error('Error reading tutorials:', error);
  return [];
}
```

**问题**：
- ❌ 只有 console.error，没有结构化错误
- ❌ 无法区分不同类型的错误
- ❌ 前端无法获取详细错误信息

**v2.md 建议**：统一的 AppError 类

**实施建议**：
```typescript
// src/lib/error-handler.ts
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const ErrorCodes = {
  TUTORIAL_NOT_FOUND: 'TUTORIAL_NOT_FOUND',
  CONFIG_PARSE_ERROR: 'CONFIG_PARSE_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  SHADER_COMPILE_ERROR: 'SHADER_COMPILE_ERROR',
} as const;

// 使用
export async function getTutorial(category: string, id: string, locale: Locale) {
  try {
    const configPath = path.join(process.cwd(), 'src/lib/tutorials', category, id, 'config.json');

    if (!fs.existsSync(configPath)) {
      throw new AppError(
        ErrorCodes.TUTORIAL_NOT_FOUND,
        `Tutorial ${category}/${id} not found`,
        404,
        { category, id }
      );
    }

    const configContent = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configContent);
    return config;
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      ErrorCodes.CONFIG_PARSE_ERROR,
      `Failed to parse tutorial config`,
      500,
      { category, id, originalError: error.message }
    );
  }
}
```

---

### 3. 用户体验改进 🟡 中优先级

#### 3.1 教程进度可视化缺失

**当前状态**（`src/app/[locale]/learn/learn-client.tsx:90-100`）：
```typescript
{filteredTutorials.map(tutorial => (
  <Card
    key={tutorial.id}
    className="cursor-pointer"
    onClick={() => router.push(...)}
  >
    <div className="flex justify-between items-start mb-3">
      {/* 只显示标题和描述，没有完成状态 */}
    </div>
  </Card>
))}
```

**问题**：
- ❌ 用户无法看到哪些教程已完成
- ❌ 没有进度指示器
- ❌ 无法快速找到未完成的教程

**v2.md 建议**：添加完成状态标识

**实施建议**：

1. **获取用户进度数据**：
```typescript
// src/app/[locale]/learn/page.tsx
const supabase = await createServerSupabase();
const { data: { user } } = await supabase.auth.getUser();

let userProgress: Record<string, boolean> = {};
if (user) {
  const { data } = await supabase
    .from('user_form_status')
    .select('form_id, is_passed')
    .eq('user_id', user.id);

  userProgress = Object.fromEntries(
    data?.map(p => [p.form_id, p.is_passed]) || []
  );
}

return (
  <LearnPageClient
    initialTutorials={tutorials}
    userProgress={userProgress}
    locale={locale}
  />
);
```

2. **显示完成状态**：
```typescript
// src/app/[locale]/learn/learn-client.tsx
{filteredTutorials.map(tutorial => (
  <Card key={tutorial.id}>
    <div className="relative">
      {/* 完成标识 */}
      {userProgress[tutorial.id] && (
        <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-2">
          <CheckIcon className="w-4 h-4" />
        </div>
      )}

      {/* 进行中标识 */}
      {userProgress[tutorial.id] === false && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white rounded-full p-2">
          <ClockIcon className="w-4 h-4" />
        </div>
      )}

      {/* 教程内容 */}
    </div>
  </Card>
))}
```

3. **添加总体进度条**：
```typescript
// 在分类页面顶部显示
<div className="mb-6 p-4 bg-blue-50 rounded-lg">
  <div className="flex justify-between items-center mb-2">
    <span className="text-sm font-medium">学习进度</span>
    <span className="text-sm text-gray-600">
      {completedCount}/{totalCount} 完成
    </span>
  </div>
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className="bg-blue-600 h-2 rounded-full transition-all"
      style={{ width: `${(completedCount / totalCount) * 100}%` }}
    />
  </div>
</div>
```

**预期收益**：
- ✅ 用户清楚看到学习进度
- ✅ 提高学习动力
- ✅ 更好的用户留存

---

#### 3.2 错误提示不够友好

**当前状态**（`src/components/common/shader-canvas-new.tsx:49-54`）：
```typescript
const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
if (success) return shader;

console.error(gl.getShaderInfoLog(shader));
gl.deleteShader(shader);
return null;
```

**问题**：
- ❌ 只在控制台输出原始 WebGL 错误
- ❌ 用户看不懂错误信息
- ❌ 没有中英文翻译

**v2.md 建议**：友好的错误消息解析

**实施建议**：
```typescript
// src/lib/shader-error-parser.ts
const ERROR_MESSAGES = {
  'undeclared identifier': {
    zh: '未声明的变量或函数',
    en: 'Undeclared variable or function',
    hint: {
      zh: '检查变量名是否拼写正确，或者是否忘记声明',
      en: 'Check if the variable name is spelled correctly or if you forgot to declare it'
    }
  },
  'syntax error': {
    zh: '语法错误',
    en: 'Syntax error',
    hint: {
      zh: '检查是否缺少分号、括号或其他符号',
      en: 'Check for missing semicolons, brackets, or other symbols'
    }
  },
  'no matching overloaded function': {
    zh: '函数参数不匹配',
    en: 'Function parameters do not match',
    hint: {
      zh: '检查函数调用的参数类型和数量是否正确',
      en: 'Check if the function call has the correct parameter types and count'
    }
  },
  'type mismatch': {
    zh: '类型不匹配',
    en: 'Type mismatch',
    hint: {
      zh: '检查变量类型是否一致（如 vec2 不能赋值给 float）',
      en: 'Check if variable types are consistent (e.g., vec2 cannot be assigned to float)'
    }
  }
};

export function parseShaderError(error: string, locale: string) {
  for (const [pattern, message] of Object.entries(ERROR_MESSAGES)) {
    if (error.toLowerCase().includes(pattern)) {
      return {
        title: message[locale] || message.zh,
        hint: message.hint[locale] || message.hint.zh,
        raw: error,
        pattern
      };
    }
  }

  return {
    title: locale === 'zh' ? '编译错误' : 'Compilation Error',
    hint: locale === 'zh' ? '请检查代码语法' : 'Please check code syntax',
    raw: error,
    pattern: null
  };
}
```

**使用**：
```typescript
// shader-canvas-new.tsx
import { parseShaderError } from '@/lib/shader-error-parser';

const compileShader = (gl, type, source, locale) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const rawError = gl.getShaderInfoLog(shader);
    const parsedError = parseShaderError(rawError, locale);

    // 通过 props 回调通知父组件
    onCompileError?.(parsedError);

    gl.deleteShader(shader);
    return null;
  }

  return shader;
};
```

**显示错误**：
```tsx
// tutorial-client.tsx
{compileError && (
  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
    <div className="flex items-start">
      <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h3 className="font-medium text-red-900">{compileError.title}</h3>
        {compileError.hint && (
          <p className="text-sm text-red-700 mt-1">{compileError.hint}</p>
        )}
        <details className="mt-2">
          <summary className="text-xs text-red-600 cursor-pointer">
            查看原始错误
          </summary>
          <pre className="text-xs text-red-600 mt-1 p-2 bg-red-100 rounded overflow-x-auto">
            {compileError.raw}
          </pre>
        </details>
      </div>
    </div>
  </div>
)}
```

---

### 4. 安全性增强 🟡 中优先级

#### 4.1 缺少 Content Security Policy

**当前状态**：
- ❌ next.config.ts 没有设置安全头部
- ❌ 可能受到 XSS 攻击

**v2.md 建议**：添加 CSP 头部

**实施建议**：
```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.creem.io",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://*.creem.io",
              "frame-src 'self' https://*.creem.io"
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  }
};
```

---

### 5. 功能增强建议

#### 5.1 教程搜索功能（v2.md 6.1）

**当前状态**：
- learn-client.tsx 只有分类过滤，没有搜索

**实施建议**：
```typescript
// src/app/[locale]/learn/learn-client.tsx
const [searchQuery, setSearchQuery] = useState('');

// 搜索过滤
const searchedTutorials = filteredTutorials.filter(tutorial =>
  tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
  tutorial.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
);

// UI
<div className="mb-6">
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder={locale === 'zh' ? '搜索教程...' : 'Search tutorials...'}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
  />
</div>
```

---

## 📊 实施优先级建议

### 🔴 高优先级（立即实施）

1. **创建 tutorial_metadata 表**（2.1.1）
   - 影响：显著提升性能
   - 工作量：1-2 天
   - 依赖：无

2. **创建 user_progress_summary 视图**（2.1.2）
   - 影响：启用进度功能
   - 工作量：0.5 天
   - 依赖：无

3. **清理调试代码**（2.2.1）
   - 影响：防止信息泄露
   - 工作量：0.5 天
   - 依赖：创建 logger 工具

### 🟡 中优先级（1-2 周内）

4. **优化代码编辑器自动保存**（2.2.1）
   - 影响：提升用户体验
   - 工作量：0.5 天
   - 依赖：无

5. **添加教程进度可视化**（3.3.1）
   - 影响：提高用户参与度
   - 工作量：1-2 天
   - 依赖：user_progress_summary 视图

6. **统一类型定义**（2.2.2）
   - 影响：代码可维护性
   - 工作量：1 天
   - 依赖：无

7. **改进错误提示**（3.3.2）
   - 影响：用户体验
   - 工作量：1-2 天
   - 依赖：无

### 🟢 低优先级（可选）

8. **添加 CSP 头部**（4.4.1）
   - 影响：安全性
   - 工作量：0.5 天
   - 依赖：测试所有页面

9. **实现教程搜索**（5.5.1）
   - 影响：用户体验
   - 工作量：1 天
   - 依赖：tutorial_metadata 表

10. **优化 Shader 编译**（2.2.2）
    - 影响：性能
    - 工作量：1-2 天
    - 依赖：无

---

## 🎯 额外发现的问题

### 额外问题 1: 客户端重复读取用户代码

**位置**：
- `page.tsx:160-204` - 服务端读取
- `tutorial-client.tsx:90-140` - 客户端兜底读取

**问题**：
- 大部分情况下，客户端读取是不必要的
- 增加数据库查询次数

**建议**：
```typescript
// tutorial-client.tsx
useEffect(() => {
  // 只有在服务端没有提供代码时才读取
  if (!serverInitialCode && !fetchedOnceRef.current) {
    fetchedOnceRef.current = true;
    // 读取逻辑...
  }
}, [serverInitialCode]);
```

---

### 额外问题 2: 缺少加载状态

**问题**：
- 页面切换时没有加载指示器
- 用户不知道是否正在加载

**建议**：
```typescript
// 添加 Suspense 和 loading.tsx
// src/app/[locale]/learn/[category]/[id]/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}
```

---

### 额外问题 3: 缺少 Error Boundary

**问题**：
- 组件错误会导致整个页面崩溃
- 用户看到白屏

**建议**：
```typescript
// src/app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">出错了</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        重试
      </button>
    </div>
  );
}
```

---

## 📋 实施检查清单

### Phase 1: 数据库优化（1-2 天）
- [ ] 创建 tutorial_metadata 表并迁移数据
- [ ] 创建 user_progress_summary 视图
- [ ] 更新 getTutorials 使用数据库查询
- [ ] 验证性能提升

### Phase 2: 代码质量（2-3 天）
- [ ] 创建统一的类型定义文件
- [ ] 实现 logger 工具
- [ ] 清理所有 console.log
- [ ] 实现 AppError 类和错误处理

### Phase 3: 用户体验（3-4 天）
- [ ] 优化代码编辑器自动保存（5秒 + onBlur）
- [ ] 实现教程进度可视化
- [ ] 实现友好的错误消息
- [ ] 添加加载状态和 Error Boundary

### Phase 4: 性能和安全（2-3 天）
- [ ] 优化 Shader 编译逻辑
- [ ] 添加 CSP 安全头部
- [ ] 实现教程搜索功能
- [ ] 性能测试和优化

---

## 🔗 相关文档

- [v2 改进计划](./v2.md)
- [订阅系统实施方案](./SUBSCRIPTION_IMPLEMENTATION_PLAN.md)
- [数据库迁移完成报告](./DATABASE_MIGRATION_COMPLETED.md)

---

**文档版本**: v1.0
**创建时间**: 2025-12-03
**维护者**: Claude Code
