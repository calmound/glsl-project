
* 输出完整案例文件，适合直接用于练习系统；
* 案例包含五个文件：
  1. `fragment.glsl`（参考代码）
  2. `README.md`（教学讲解文档，基于参考代码）
  3. `fragment-exercise.glsl`（学员填写用，部分留白、配有 TODO 注释）
  4. `config.json`（可选，用于描述案例的元数据）
  5. en-README.md 英文教学讲解文档
* 将五个文件放到文件夹内，文件夹的名称为案例名称（英文），如：`basic-gradients`；
    案例名称应符合以下命名规范：
    * 只能包含小写字母、数字、连字符（-）；
    * 不能以连字符开头或结尾；
    * 不能包含连续的连字符；
* 名称和config.json文件的名称应保持一致；

---
无需指定任何名称、描述、技术点，系统将：
1. 自动构思一个适合初学者的视觉效果（例如：水平渐变、双色混合、呼吸色块）
2. 自动命名案例名称（中英文）
  - 中文：简洁 + 描述性（如：“颜色混合渐变”）
  - 英文：语义清晰（如："Color Blending Gradient"）
3. 自动撰写中英文描述
4. 自动生成参考代码 fragment.glsl
5. 提炼核心知识点，生成教学讲解 README.md + en-README.md
6. 生成带引导注释的 fragment-exercise.glsl
7. 生成结构化的 config.json 元数据
---

### 📄 输出要求如下：

#### 1 `fragment.glsl`

* 完整正确的 GLSL 片元着色器代码；
* 定义的变量名、函数名应清晰易懂，不要通过uniform传递参数；而是在函数内部定义；

#### 2️`README.md`

* 教学引导文档，内容用于左侧教学面板；
* 结构应包含（不限于）以下部分：

  * `# 基础渐变效果`
  * `## 学习目标`
  * `## 核心概念`（fragment.glsl所用到的核心知识点的讲解）
* 每段内容需清晰解释概念 + 示例代码（不泄露完整实现）

#### 3️`fragment-exercise.glsl`
* 参考`fragment.glsl`的代码
* 保留完整框架结构；
* 留空关键步骤；
* 用 `// TODO:` 注释引导学员完成；

#### 4️`config.json`
* 用于描述案例的元数据；
* 应包含以下字段：
  * `id`：案例唯一标识符，如 `basic-gradients`
  * `title`：案例名称，如 `基础渐变效果`
  * `title_en`：英文案例名称，如 `Basic Gradient Effect`
  * `description`：案例描述，简要介绍案例的功能和目标；
  * `difficulty`：案例难度，如 `beginner`、`intermediate`、`advanced`；
  * `category`： "basic"；

#### 5️`en-README.md`
* 英文教学引导文档；
* 内容应与`README.md`一致，但使用英文进行描述；

---
