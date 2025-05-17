#!/bin/bash

echo "===================================="
echo "启动 GLSL 项目开发环境"
echo "===================================="

# 检查依赖是否已安装
if ! command -v pnpm &> /dev/null; then
    echo "未检测到 pnpm，正在安装..."
    npm install -g pnpm
fi

# 安装依赖
echo "正在安装项目依赖..."
pnpm install

# 启动开发服务器
echo "正在启动开发服务器..."
pnpm run dev
