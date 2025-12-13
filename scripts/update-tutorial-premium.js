#!/usr/bin/env node

/**
 * 批量更新教程的 isPremium 字段
 * 运行: node scripts/update-tutorial-premium.js
 */

const fs = require('fs');
const path = require('path');

// 定义付费规则
const PREMIUM_RULES = {
  basic: [], // basic 分类全部免费
  patterns: ['gradient-effects', 'vertical-color-fade'], // 前2个免费，其余付费
  math: ['sine-wave'], // 前1个免费，其余付费
  animation: ['time-animation'], // 前1个免费，其余付费
  noise: [], // 全部付费
  lighting: [], // 全部付费
};

const tutorialsDir = path.join(__dirname, '../src/lib/tutorials');

function updateTutorials() {
  console.log('🚀 开始更新教程的 isPremium 字段...\n');

  let updatedCount = 0;
  let errorCount = 0;

  // 遍历所有分类
  for (const [category, freeList] of Object.entries(PREMIUM_RULES)) {
    const categoryDir = path.join(tutorialsDir, category);

    if (!fs.existsSync(categoryDir)) {
      console.log(`⚠️  分类目录不存在: ${category}`);
      continue;
    }

    console.log(`📂 处理分类: ${category}`);

    // 遍历分类下的所有教程
    const tutorials = fs.readdirSync(categoryDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const tutorialId of tutorials) {
      const configPath = path.join(categoryDir, tutorialId, 'config.json');

      if (!fs.existsSync(configPath)) {
        console.log(`  ⚠️  配置文件不存在: ${category}/${tutorialId}`);
        continue;
      }

      try {
        // 读取配置
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

        // 判断是否应该免费
        const isFree = freeList.includes(tutorialId);
        const isPremium = !isFree;

        // 更新 isPremium 字段
        config.isPremium = isPremium;

        // 写回文件（格式化 JSON）
        fs.writeFileSync(
          configPath,
          JSON.stringify(config, null, 2) + '\n',
          'utf-8'
        );

        const icon = isPremium ? '🔒' : '✅';
        console.log(`  ${icon} ${tutorialId} → isPremium: ${isPremium}`);
        updatedCount++;
      } catch (error) {
        console.error(`  ❌ 更新失败: ${category}/${tutorialId}`, error.message);
        errorCount++;
      }
    }

    console.log('');
  }

  console.log('✅ 更新完成！');
  console.log(`   - 成功: ${updatedCount} 个`);
  console.log(`   - 失败: ${errorCount} 个`);
}

// 执行更新
updateTutorials();
