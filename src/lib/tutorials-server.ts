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
}

// 获取教程数据的服务端函数
export async function getTutorials(locale: Locale): Promise<Tutorial[]> {
  const tutorials: Tutorial[] = [];
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
            
            tutorials.push({
              id: config.id,
              title,
              description,
              difficulty: config.difficulty,
              category: config.category,
            });
          } catch (error) {
            console.error(`Error parsing config for ${tutorialDir}:`, error);
          }
        }
      }
    }
    
    return tutorials;
  } catch (error) {
    console.error('Error reading tutorials:', error);
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

    console.log('%c [  ]-142', 'font-size:13px; background:pink; color:#bf2c9f;', locale);

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
    console.log('157',readmePath)
    
    if (fs.existsSync(readmePath)) {
      console.log('%c [  ]-161', 'font-size:13px; background:pink; color:#bf2c9f;', fs.existsSync(readmePath))
      return fs.readFileSync(readmePath, 'utf-8');
    }
    console.log('163',fs.existsSync(readmePath))
    return '';
  } catch (error) {
    console.error(`Error reading README for ${category}/${id}:`, error);
    return '';
  }
}

// 获取指定分类下的所有教程
export async function getTutorialsByCategory(category: string, locale: Locale): Promise<Tutorial[]> {
  const tutorials: Tutorial[] = [];
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
          
          tutorials.push({
            id: config.id,
            title,
            description,
            difficulty: config.difficulty,
            category: config.category,
          });
        } catch (error) {
          console.error(`Error parsing config for ${tutorialDir}:`, error);
        }
      }
    }
    
    return tutorials;
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