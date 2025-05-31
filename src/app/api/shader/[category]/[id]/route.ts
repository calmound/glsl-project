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

    // 构建文件路径
    const filePath = path.join(process.cwd(), 'src/lib/tutorials', category, `${id}.glsl`);

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: `找不到着色器文件: ${category}/${id}` }, { status: 404 });
    }

    // 读取文件内容
    const fileContent = await fsPromises.readFile(filePath, 'utf8');

    // 解析GLSL文件内容，提取元数据和着色器代码
    const shaderData = parseGLSLFile(fileContent, category, id);

    return NextResponse.json(shaderData);
  } catch (error) {
    console.error('读取着色器文件时发生错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

/**
 * 解析GLSL文件内容，提取元数据和着色器代码
 */
function parseGLSLFile(content: string, category: string, id: string) {
  const lines = content.split('\n');
  const metadata: any = {
    id,
    category,
    title: id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: '',
    difficulty: 'beginner',
    fragmentShader: '',
    tags: [],
    uniforms: {
      u_time: 0.0,
      u_resolution: [300, 300],
    },
  };

  let inFragmentShader = false;
  let fragmentShaderLines: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    // 解析注释中的元数据
    if (trimmedLine.startsWith('//')) {
      const comment = trimmedLine.substring(2).trim();
      
      if (comment.startsWith('title:')) {
        metadata.title = comment.substring(6).trim();
      } else if (comment.startsWith('description:')) {
        metadata.description = comment.substring(12).trim();
      } else if (comment.startsWith('difficulty:')) {
        metadata.difficulty = comment.substring(11).trim();
      } else if (comment.startsWith('tags:')) {
        metadata.tags = comment.substring(5).trim().split(',').map(tag => tag.trim());
      }
    }

    // 检测片段着色器开始
    if (trimmedLine.includes('precision mediump float;') || 
        trimmedLine.includes('precision highp float;') ||
        trimmedLine.includes('precision lowp float;')) {
      inFragmentShader = true;
    }

    // 收集片段着色器代码
    if (inFragmentShader) {
      fragmentShaderLines.push(line);
    }
  }

  metadata.fragmentShader = fragmentShaderLines.join('\n');

  return metadata;
}