import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

export async function GET(request: Request, { params }: { params: { category: string; id: string } }) {
  try {
    const { category, id } = params;
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'zh'; // 默认中文
    
    // 构建教程目录路径
    const tutorialDir = path.join(process.cwd(), 'src', 'lib', 'tutorials', category, id);
    
    // 检查目录是否存在
    if (!fs.existsSync(tutorialDir)) {
      return NextResponse.json({ error: 'Tutorial not found' }, { status: 404 });
    }
    
    // 读取配置文件
    const configPath = path.join(tutorialDir, 'config.json');
    let config = {};
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf-8');
      config = JSON.parse(configContent);
    }
    
    // 读取片段着色器
    const fragmentPath = path.join(tutorialDir, 'fragment.glsl');
    let fragmentShader = '';
    if (fs.existsSync(fragmentPath)) {
      fragmentShader = fs.readFileSync(fragmentPath, 'utf-8');
    }
    
    // 读取练习文件
    const exercisePath = path.join(tutorialDir, 'fragment-exercise.glsl');
    let exerciseShader = '';
    if (fs.existsSync(exercisePath)) {
      exerciseShader = fs.readFileSync(exercisePath, 'utf-8');
    }
    
    // 读取多语言README文件
    let readme = '';
    const readmeFiles = [
      `${lang}-README.md`,  // 优先读取指定语言的README
      'README.md'           // 回退到默认README
    ];
    
    for (const readmeFile of readmeFiles) {
      const readmePath = path.join(tutorialDir, readmeFile);
      if (fs.existsSync(readmePath)) {
        readme = fs.readFileSync(readmePath, 'utf-8');
        break;
      }
    }
    
    // 读取顶点着色器（可选）
    const vertexPath = path.join(tutorialDir, 'vertex.glsl');
    let vertexShader = '';
    if (fs.existsSync(vertexPath)) {
      vertexShader = fs.readFileSync(vertexPath, 'utf-8');
    }
    
    return NextResponse.json({
      id,
      category,
      fragmentShader,
      exerciseShader,
      readme,
      vertexShader,
      language: lang,
      ...config
    });
  } catch (error) {
    console.error('Error loading shader:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}