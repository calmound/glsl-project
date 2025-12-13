/**
 * 导入教程元数据到 Supabase
 *
 * 用途：将 src/lib/tutorials/ 目录下的所有教程 config.json 数据导入到 tutorial_metadata 表
 * 运行：node scripts/import-tutorial-metadata.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 手动读取 .env.local 文件
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      process.env[key] = value;
    }
  });
}

// 初始化 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 错误：缺少 Supabase 环境变量');
  console.error('请确保 .env.local 文件包含:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY (或 NEXT_PUBLIC_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 教程目录
const tutorialsDir = path.join(process.cwd(), 'src/lib/tutorials');

// 分类排序
const categoryOrder = {
  'basic': 1,
  'math': 2,
  'patterns': 3,
  'animation': 4,
  'noise': 5,
  'lighting': 6
};

/**
 * 读取单个教程的配置
 */
function readTutorialConfig(category, tutorialId) {
  const configPath = path.join(tutorialsDir, category, tutorialId, 'config.json');

  if (!fs.existsSync(configPath)) {
    return null;
  }

  try {
    const configContent = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(configContent);
  } catch (error) {
    console.error(`❌ 解析配置失败: ${category}/${tutorialId}`, error.message);
    return null;
  }
}

/**
 * 提取本地化字符串
 */
function extractLocalizedString(value, fallbackKey) {
  if (typeof value === 'object' && value !== null) {
    return {
      zh: value.zh || value[fallbackKey] || '',
      en: value.en || value[fallbackKey] || ''
    };
  }
  return {
    zh: value || '',
    en: value || ''
  };
}

/**
 * 转换配置为数据库记录
 */
function convertConfigToRecord(config, category, orderIndex) {
  const title = extractLocalizedString(config.title, 'title');
  const description = extractLocalizedString(config.description, 'description');

  return {
    id: config.id,
    category: config.category || category,
    title_en: title.en || config.title_en || title.zh,
    title_zh: title.zh || config.title || title.en,
    description_en: description.en || config.description_en || description.zh,
    description_zh: description.zh || config.description || description.en,
    difficulty: config.difficulty || 'beginner',
    estimated_time: config.estimatedTime || null,
    tags: config.tags || [],
    is_premium: config.isPremium || false,
    prerequisites: config.prerequisites || [],
    order_index: orderIndex,
  };
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始导入教程元数据...\n');

  // 读取所有分类目录
  const categories = fs.readdirSync(tutorialsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .sort((a, b) => (categoryOrder[a] || 999) - (categoryOrder[b] || 999));

  console.log(`📂 找到 ${categories.length} 个分类:`, categories.join(', '));
  console.log('');

  const allRecords = [];
  let totalTutorials = 0;

  // 遍历每个分类
  for (const category of categories) {
    const categoryDir = path.join(tutorialsDir, category);
    const tutorialDirs = fs.readdirSync(categoryDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    console.log(`📁 ${category}: 找到 ${tutorialDirs.length} 个教程`);

    tutorialDirs.forEach((tutorialId, index) => {
      const config = readTutorialConfig(category, tutorialId);

      if (config) {
        const record = convertConfigToRecord(config, category, index + 1);
        allRecords.push(record);
        totalTutorials++;
        console.log(`  ✓ ${tutorialId} (${record.difficulty})`);
      } else {
        console.log(`  ✗ ${tutorialId} - 配置读取失败`);
      }
    });

    console.log('');
  }

  console.log(`📊 共准备导入 ${totalTutorials} 个教程\n`);

  // 清空现有数据
  console.log('🗑️  清空现有数据...');
  const { error: deleteError } = await supabase
    .from('tutorial_metadata')
    .delete()
    .neq('id', ''); // 删除所有记录

  if (deleteError) {
    console.error('❌ 清空数据失败:', deleteError);
    process.exit(1);
  }
  console.log('✅ 数据已清空\n');

  // 批量插入数据
  console.log('📥 开始批量插入...');
  const { data, error: insertError } = await supabase
    .from('tutorial_metadata')
    .insert(allRecords)
    .select();

  if (insertError) {
    console.error('❌ 插入失败:', insertError);
    process.exit(1);
  }

  console.log(`✅ 成功插入 ${data.length} 条记录\n`);

  // 验证数据
  console.log('🔍 验证数据...');
  const { data: verifyData, error: verifyError } = await supabase
    .from('tutorial_metadata')
    .select('category, count')
    .select('category');

  if (!verifyError) {
    const categoryCounts = {};
    verifyData.forEach(row => {
      categoryCounts[row.category] = (categoryCounts[row.category] || 0) + 1;
    });

    console.log('\n📊 各分类教程数量:');
    Object.entries(categoryCounts).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} 个教程`);
    });
  }

  console.log('\n🎉 导入完成！');
}

// 执行
main().catch(error => {
  console.error('❌ 执行失败:', error);
  process.exit(1);
});
