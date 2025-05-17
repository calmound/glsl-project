import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

export async function GET(request: NextRequest) {
  try {
    // 从查询参数获取文件路径
    const urlParams = new URL(request.url).searchParams;
    const shaderPath = urlParams.get('path');

    if (!shaderPath) {
      return NextResponse.json({ error: '缺少路径参数' }, { status: 400 });
    }

    // 构建完整的文件路径（相对于项目根目录）
    const filePath = path.join(process.cwd(), 'src/lib/tutorials', shaderPath + '.glsl');

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: '找不到着色器文件' }, { status: 404 });
    }

    // 读取文件内容
    const fileContent = await fsPromises.readFile(filePath, 'utf8');

    // 返回文件内容
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('读取着色器文件时发生错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
