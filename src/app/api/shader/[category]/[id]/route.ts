import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string; id: string } }
) {
  try {
    const { category, id } = params;

    if (!category || !id) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    // 构建新的文件夹路径
    const tutorialDir = path.join(process.cwd(), 'src/lib/tutorials', category, id);
    const configPath = path.join(tutorialDir, 'config.json');
    const fragmentPath = path.join(tutorialDir, 'fragment.glsl');
    const exercisePath = path.join(tutorialDir, 'fragment-exercise.glsl');
    const readmePath = path.join(tutorialDir, 'README.md');

    // 检查文件夹和必要文件是否存在
    if (!fs.existsSync(tutorialDir) || !fs.existsSync(configPath) || !fs.existsSync(fragmentPath)) {
      return NextResponse.json({ error: `找不到着色器文件: ${category}/${id}` }, { status: 404 });
    }

    // 读取配置文件和着色器文件
    const configContent = await fsPromises.readFile(configPath, 'utf8');
    const fragmentContent = await fsPromises.readFile(fragmentPath, 'utf8');
    
    // 读取练习文件（如果存在）
    let exerciseContent = '';
    if (fs.existsSync(exercisePath)) {
      exerciseContent = await fsPromises.readFile(exercisePath, 'utf8');
    }
    
    // 读取README文件（如果存在）
    let readmeContent = '';
    if (fs.existsSync(readmePath)) {
      readmeContent = await fsPromises.readFile(readmePath, 'utf8');
    }

    // 解析配置文件
    const config = JSON.parse(configContent);
    
    // 构建着色器数据
    const shaderData = {
      ...config,
      fragmentShader: fragmentContent,
      exerciseShader: exerciseContent,
      readme: readmeContent
    };

    return NextResponse.json(shaderData);
  } catch (error) {
    console.error('读取着色器文件时发生错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}