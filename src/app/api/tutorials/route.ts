import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  preview: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'zh';
    
    const tutorialsDir = path.join(process.cwd(), 'src/lib/tutorials');
    const tutorials: Tutorial[] = [];

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

      for (const tutorialId of tutorialDirs) {
        const tutorialDir = path.join(categoryDir, tutorialId);
        const configPath = path.join(tutorialDir, 'config.json');
        
        // 检查config.json是否存在
        if (fs.existsSync(configPath)) {
          try {
            const configContent = fs.readFileSync(configPath, 'utf-8');
            const config = JSON.parse(configContent);
            
            // 验证必要字段
            if (config.id && config.title && config.description && config.difficulty && config.category) {
              // 根据语言选择标题和描述
              let title = config.title;
              let description = config.description;
              
              if (lang === 'en') {
                title = config.title_en || config.title;
                description = config.description_en || config.description;
              }
              
              tutorials.push({
                id: config.id,
                title: title,
                description: description,
                difficulty: config.difficulty,
                category: config.category,
                tags: config.tags || [],
                preview: config.preview || `/api/shader/${category}/${tutorialId}`
              });
            }
          } catch (error) {
            console.error(`Error parsing config for ${category}/${tutorialId}:`, error);
          }
        }
      }
    }

    return NextResponse.json({ tutorials });
  } catch (error) {
    console.error('Error loading tutorials:', error);
    return NextResponse.json(
      { error: 'Failed to load tutorials' },
      { status: 500 }
    );
  }
}