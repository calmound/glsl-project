#!/usr/bin/env node

/**
 * 批量更新教程的 isFree 状态
 *
 * 规则：
 * - basic 分类：所有教程免费
 * - 其他分类：第一个教程免费（按难度、前置课程、时长、ID排序）
 */

const fs = require('fs');
const path = require('path');

const tutorialsDir = path.join(__dirname, '../src/lib/tutorials');

// 难度排序
function getDifficultyRank(difficulty) {
  switch (difficulty) {
    case 'beginner': return 0;
    case 'intermediate': return 1;
    case 'advanced': return 2;
    default: return 99;
  }
}

// 读取分类下的所有教程
function getTutorialsInCategory(category) {
  const categoryDir = path.join(tutorialsDir, category);

  if (!fs.existsSync(categoryDir)) {
    return [];
  }

  const tutorialDirs = fs.readdirSync(categoryDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const tutorials = [];

  for (const tutorialDir of tutorialDirs) {
    const configPath = path.join(categoryDir, tutorialDir, 'config.json');

    if (fs.existsSync(configPath)) {
      try {
        const configContent = fs.readFileSync(configPath, 'utf-8');
        const config = JSON.parse(configContent);

        tutorials.push({
          id: config.id,
          dir: tutorialDir,
          configPath,
          config,
          prerequisitesCount: config.prerequisites?.length ?? 0,
          estimatedTime: config.estimatedTime ?? Number.POSITIVE_INFINITY,
        });
      } catch (error) {
        console.error(`❌ 解析 ${tutorialDir} 的 config.json 失败:`, error.message);
      }
    }
  }

  // 排序：难度 -> 前置课程数 -> 预估时长 -> ID
  tutorials.sort((a, b) => {
    const diffCompare = getDifficultyRank(a.config.difficulty) - getDifficultyRank(b.config.difficulty);
    if (diffCompare !== 0) return diffCompare;

    const prereqCompare = a.prerequisitesCount - b.prerequisitesCount;
    if (prereqCompare !== 0) return prereqCompare;

    const timeCompare = a.estimatedTime - b.estimatedTime;
    if (timeCompare !== 0) return timeCompare;

    return a.id.localeCompare(b.id);
  });

  return tutorials;
}

// 更新配置文件
function updateConfigFile(configPath, isFree) {
  try {
    const content = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(content);

    // 添加 isFree 字段
    config.isFree = isFree;

    // 格式化并写回
    const updatedContent = JSON.stringify(config, null, 2) + '\n';
    fs.writeFileSync(configPath, updatedContent, 'utf-8');

    return true;
  } catch (error) {
    console.error(`❌ 更新文件失败 ${configPath}:`, error.message);
    return false;
  }
}

// 主函数
function main() {
  console.log('🚀 开始批量更新教程的 isFree 状态...\n');

  const categories = fs.readdirSync(tutorialsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  let totalUpdated = 0;

  for (const category of categories) {
    console.log(`📁 处理分类: ${category}`);
    const tutorials = getTutorialsInCategory(category);

    if (tutorials.length === 0) {
      console.log(`  ⚠️  该分类下没有教程\n`);
      continue;
    }

    if (category === 'basic') {
      // basic 分类：所有教程免费
      console.log(`  ✨ basic 分类，所有教程设置为免费`);
      let updated = 0;

      for (const tutorial of tutorials) {
        if (updateConfigFile(tutorial.configPath, true)) {
          updated++;
          console.log(`    ✅ ${tutorial.id} → 免费`);
        }
      }

      console.log(`  📊 完成: ${updated}/${tutorials.length} 个教程\n`);
      totalUpdated += updated;
    } else {
      // 其他分类：第一个教程免费，其他付费
      console.log(`  ✨ ${category} 分类，第一个教程免费，其他付费`);
      let updated = 0;

      for (let i = 0; i < tutorials.length; i++) {
        const tutorial = tutorials[i];
        const isFree = i === 0; // 第一个免费

        if (updateConfigFile(tutorial.configPath, isFree)) {
          updated++;
          console.log(`    ${isFree ? '✅' : '🔒'} ${tutorial.id} → ${isFree ? '免费' : '付费'}`);
        }
      }

      console.log(`  📊 完成: ${updated}/${tutorials.length} 个教程 (1 免费, ${tutorials.length - 1} 付费)\n`);
      totalUpdated += updated;
    }
  }

  console.log(`\n🎉 全部完成！共更新 ${totalUpdated} 个教程配置`);
}

// 运行
main();
