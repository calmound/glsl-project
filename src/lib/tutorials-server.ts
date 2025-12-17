import fs from 'fs';
import path from 'path';
import { type Locale } from './i18n';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

interface TutorialConfig {
  id: string;
  title: {
    zh: string;
    en: string;
  } | string;
  title_en?: string; // 向后兼容
  description: {
    zh: string;
    en: string;
  } | string;
  description_en?: string; // 向后兼容
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags?: string[];
  estimatedTime?: number;
  prerequisites?: string[];
  learningObjectives?: {
    zh: string[];
    en: string[];
  };
  uniforms?: Record<string, any>;
  preview?: string;
}

function getDifficultyRank(difficulty: Tutorial['difficulty']): number {
  switch (difficulty) {
    case 'beginner':
      return 0;
    case 'intermediate':
      return 1;
    case 'advanced':
      return 2;
    default:
      return 99;
  }
}

// 获取教程数据的服务端函数（从文件系统读取）
export async function getTutorials(locale: Locale): Promise<Tutorial[]> {
  return getTutorialsFromFileSystem(locale);
}

// 回退方案：从文件系统读取教程（原有逻辑）
function getTutorialsFromFileSystem(locale: Locale): Tutorial[] {
  const tutorialsWithMeta: Array<{
    tutorial: Tutorial;
    prerequisitesCount: number;
    estimatedTime: number;
  }> = [];
  const tutorialsDir = path.join(process.cwd(), 'src/lib/tutorials');

  try {
    // 读取所有分类目录
    const categories = fs.readdirSync(tutorialsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const category of categories) {
      const categoryDir = path.join(tutorialsDir, category);

      // 读取分类下的所有教程目录
      const tutorialDirs = fs.readdirSync(categoryDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const tutorialDir of tutorialDirs) {
        const configPath = path.join(categoryDir, tutorialDir, 'config.json');

        if (fs.existsSync(configPath)) {
          try {
            const configContent = fs.readFileSync(configPath, 'utf-8');
            const config: TutorialConfig = JSON.parse(configContent);

            // 根据语言选择标题和描述
            let title: string;
            let description: string;

            if (typeof config.title === 'object') {
              title = config.title[locale] || config.title.zh;
            } else {
              title = locale === 'en' && config.title_en ? config.title_en : config.title;
            }

            if (typeof config.description === 'object') {
              description = config.description[locale] || config.description.zh;
            } else {
              description = locale === 'en' && config.description_en ? config.description_en : config.description;
            }

            tutorialsWithMeta.push({
              tutorial: {
                id: config.id,
                title,
                description,
                difficulty: config.difficulty,
                category: config.category,
              },
              prerequisitesCount: config.prerequisites?.length ?? 0,
              estimatedTime: config.estimatedTime ?? Number.POSITIVE_INFINITY,
            });
          } catch (error) {
            console.error(`Error parsing config for ${tutorialDir}:`, error);
          }
        }
      }
    }

    tutorialsWithMeta.sort((a, b) => {
      const categoryCompare = a.tutorial.category.localeCompare(b.tutorial.category);
      if (categoryCompare !== 0) return categoryCompare;

      const difficultyCompare = getDifficultyRank(a.tutorial.difficulty) - getDifficultyRank(b.tutorial.difficulty);
      if (difficultyCompare !== 0) return difficultyCompare;

      const prereqCompare = a.prerequisitesCount - b.prerequisitesCount;
      if (prereqCompare !== 0) return prereqCompare;

      const timeCompare = a.estimatedTime - b.estimatedTime;
      if (timeCompare !== 0) return timeCompare;

      return a.tutorial.id.localeCompare(b.tutorial.id);
    });

    return tutorialsWithMeta.map(item => item.tutorial);
  } catch (error) {
    console.error('Error reading tutorials from file system:', error);
    return [];
  }
}

// 获取单个教程数据
export async function getTutorial(category: string, id: string, locale: Locale): Promise<Tutorial | null> {
  const configPath = path.join(process.cwd(), 'src/lib/tutorials', category, id, 'config.json');
  
  try {
    if (!fs.existsSync(configPath)) {
      return null;
    }
    
    const configContent = fs.readFileSync(configPath, 'utf-8');
    const config: TutorialConfig = JSON.parse(configContent);
    
    // 根据语言选择标题和描述
    let title: string;
    let description: string;
    
    if (typeof config.title === 'object') {
      title = config.title[locale] || config.title.zh;
    } else {
      title = locale === 'en' && config.title_en ? config.title_en : config.title;
    }
    
    if (typeof config.description === 'object') {
      description = config.description[locale] || config.description.zh;
    } else {
      description = locale === 'en' && config.description_en ? config.description_en : config.description;
    }
    
    return {
      id: config.id,
      title,
      description,
      difficulty: config.difficulty,
      category: config.category,
    };
  } catch (error) {
    console.error(`Error reading tutorial ${category}/${id}:`, error);
    return null;
  }
}

// 获取教程的README内容
export async function getTutorialReadme(category: string, id: string, locale?: Locale): Promise<string> {
  const tutorialDir = path.join(process.cwd(), 'src/lib/tutorials', category, id);
  
  try {
    // 根据语言选择对应的README文件
    let readmePath: string;

    if (locale === 'en') {
      // 优先尝试英文README
      const enReadmePath = path.join(tutorialDir, 'en-README.md');
      if (fs.existsSync(enReadmePath)) {
        readmePath = enReadmePath;
      } else {
        // 如果没有英文版本，回退到中文版本
        readmePath = path.join(tutorialDir, 'zh-README.md');
      }
    } else {
      // 中文或其他语言，使用zh-README
      readmePath = path.join(tutorialDir, 'zh-README.md');
    }
    
    if (fs.existsSync(readmePath)) {
      return fs.readFileSync(readmePath, 'utf-8');
    }
    return '';
  } catch (error) {
    console.error(`Error reading README for ${category}/${id}:`, error);
    return '';
  }
}

// 获取指定分类下的所有教程（从文件系统读取）
export async function getTutorialsByCategory(category: string, locale: Locale): Promise<Tutorial[]> {
  return getTutorialsByCategoryFromFileSystem(category, locale);
}

// 回退方案：从文件系统读取指定分类的教程
function getTutorialsByCategoryFromFileSystem(category: string, locale: Locale): Tutorial[] {
  const tutorialsWithMeta: Array<{
    tutorial: Tutorial;
    prerequisitesCount: number;
    estimatedTime: number;
  }> = [];
  const categoryDir = path.join(process.cwd(), 'src/lib/tutorials', category);

  try {
    if (!fs.existsSync(categoryDir)) {
      return [];
    }

    // 读取分类下的所有教程目录
    const tutorialDirs = fs.readdirSync(categoryDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const tutorialDir of tutorialDirs) {
      const configPath = path.join(categoryDir, tutorialDir, 'config.json');

      if (fs.existsSync(configPath)) {
        try {
          const configContent = fs.readFileSync(configPath, 'utf-8');
          const config: TutorialConfig = JSON.parse(configContent);

          // 根据语言选择标题和描述
          let title: string;
          let description: string;

          if (typeof config.title === 'object') {
            title = config.title[locale] || config.title.zh;
          } else {
            title = locale === 'en' && config.title_en ? config.title_en : config.title;
          }

          if (typeof config.description === 'object') {
            description = config.description[locale] || config.description.zh;
          } else {
            description = locale === 'en' && config.description_en ? config.description_en : config.description;
          }

          tutorialsWithMeta.push({
            tutorial: {
              id: config.id,
              title,
              description,
              difficulty: config.difficulty,
              category: config.category,
            },
            prerequisitesCount: config.prerequisites?.length ?? 0,
            estimatedTime: config.estimatedTime ?? Number.POSITIVE_INFINITY,
          });
        } catch (error) {
          console.error(`Error parsing config for ${tutorialDir}:`, error);
        }
      }
    }

    tutorialsWithMeta.sort((a, b) => {
      const difficultyCompare = getDifficultyRank(a.tutorial.difficulty) - getDifficultyRank(b.tutorial.difficulty);
      if (difficultyCompare !== 0) return difficultyCompare;

      const prereqCompare = a.prerequisitesCount - b.prerequisitesCount;
      if (prereqCompare !== 0) return prereqCompare;

      const timeCompare = a.estimatedTime - b.estimatedTime;
      if (timeCompare !== 0) return timeCompare;

      return a.tutorial.id.localeCompare(b.tutorial.id);
    });

    return tutorialsWithMeta.map(item => item.tutorial);
  } catch (error) {
    console.error(`Error reading tutorials for category ${category}:`, error);
    return [];
  }
}

// 获取教程的着色器代码
export async function getTutorialShaders(category: string, id: string): Promise<{
  fragment: string;
  vertex: string;
  exercise: string;
}> {
  const tutorialDir = path.join(process.cwd(), 'src/lib/tutorials', category, id);
  
  const result = {
    fragment: '',
    vertex: '',
    exercise: '',
  };
  
  try {
    // 读取片段着色器
    const fragmentPath = path.join(tutorialDir, 'fragment.glsl');
    if (fs.existsSync(fragmentPath)) {
      result.fragment = fs.readFileSync(fragmentPath, 'utf-8');
    }
    
    // 读取顶点着色器
    const vertexPath = path.join(tutorialDir, 'vertex.glsl');
    if (fs.existsSync(vertexPath)) {
      result.vertex = fs.readFileSync(vertexPath, 'utf-8');
    }
    
    // 读取练习着色器
    const exercisePath = path.join(tutorialDir, 'fragment-exercise.glsl');
    if (fs.existsSync(exercisePath)) {
      result.exercise = fs.readFileSync(exercisePath, 'utf-8');
    }
    
    return result;
  } catch (error) {
    console.error(`Error reading shaders for ${category}/${id}:`, error);
    return result;
  }
}

function stripGlslComments(code: string): string {
  // Remove block comments first, then line comments.
  // This is a pragmatic implementation for our tutorial shaders (no string literals expected).
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
}

function buildEnglishShaderHeader(config: TutorialConfig | null): string {
  if (!config || typeof config.title !== 'object' || typeof config.description !== 'object') {
    return '/* Tutorial */\n\n';
  }

  const title = config.title.en || config.title.zh;
  const description = config.description.en || config.description.zh;
  const objectives = config.learningObjectives?.en || config.learningObjectives?.zh || [];

  const lines = [
    `/* ${title}`,
    '',
    description,
  ];

  if (objectives.length > 0) {
    lines.push('', 'Learning objectives:', ...objectives.map(o => `- ${o}`));
  }

  lines.push('*/', '');
  return `${lines.join('\n')}\n`;
}

export async function getTutorialShadersLocalized(
  category: string,
  id: string,
  locale: Locale,
): Promise<{
  fragment: string;
  vertex: string;
  exercise: string;
}> {
  const shaders = await getTutorialShaders(category, id);

  if (locale !== 'en') {
    return shaders;
  }

  const config = await getTutorialConfig(category, id);
  const header = buildEnglishShaderHeader(config);

  const normalize = (code: string) => `${header}${stripGlslComments(code).trim()}\n`;

  return {
    fragment: normalize(shaders.fragment),
    vertex: shaders.vertex ? normalize(shaders.vertex) : '',
    exercise: normalize(shaders.exercise || shaders.fragment),
  };
}

// 获取教程的完整配置信息（用于SEO）
export async function getTutorialConfig(category: string, id: string): Promise<TutorialConfig | null> {
  const configPath = path.join(process.cwd(), 'src/lib/tutorials', category, id, 'config.json');
  
  try {
    if (!fs.existsSync(configPath)) {
      return null;
    }
    
    const configContent = fs.readFileSync(configPath, 'utf-8');
    const config: TutorialConfig = JSON.parse(configContent);
    
    return config;
  } catch (error) {
    console.error(`Error reading config for ${category}/${id}:`, error);
    return null;
  }
}
