import { Locale } from './i18n';

export interface Translations {
  [key: string]: string;
}

export const translations: Record<Locale, Translations> = {
  zh: {
    // Header
    'header.title': 'Shader 学习',
    'nav.home': '首页',
    'nav.learn': '学习',
    'nav.examples': '示例',
    'nav.about': '关于',
    
    // Language switcher
    'language.chinese': '中文',
    'language.english': 'English',
    
    // Learn page
    'learn.title': 'GLSL 学习平台',
    'learn.description': '掌握现代图形编程技能，通过实战练习深入理解 GLSL 着色器开发。从基础语法到高级特效，打造属于你的视觉作品。',
    'learn.basic': '基础教程',
    'learn.intermediate': '中级教程',
    'learn.advanced': '高级教程',
    'learn.filter.difficulty': '难度筛选',
    'learn.no_tutorials': '没有找到匹配的教程',
    
    // Difficulty levels
    'learn.difficulty.beginner': '初级',
    'learn.difficulty.intermediate': '中级',
    'learn.difficulty.advanced': '高级',
    'learn.difficulty.all': '全部',
    
    // Categories
    'learn.category.basic': '基础入门',
    'learn.category.math': '数学公式',
    'learn.category.patterns': '图案纹理',
    'learn.category.animation': '动画交互',
    'learn.category.noise': '噪声函数',
    'learn.category.lighting': '光照渲染',
    'learn.category.all': '全部',
    
    // Learning path
    'learn.path.title': '🎯 探索学习路径',
    'learn.path.subtitle': '选择感兴趣的主题，开启你的 GLSL 编程之旅',
    'learn.path.tutorials_count': '个教程',
    'learn.path.basic.desc': '从最基础的概念开始，学习 GLSL 语法和基本图形绘制',
    'learn.path.math.desc': '掌握图形编程中的数学函数和坐标变换',
    'learn.path.patterns.desc': '创建各种图案和纹理效果',
    'learn.path.animation.desc': '学习时间动画和交互效果',
    'learn.path.noise.desc': '掌握噪声函数生成自然纹理',
    'learn.path.lighting.desc': '实现光照模型和渲染效果',
    'learn.back_to_categories': '返回分类选择',
    
    // Tutorial page
    'tutorial.objective': '📝 练习目标',
    'tutorial.content': '💡 教程内容',
    'tutorial.knowledge': '💡 知识点',
    'tutorial.editor': 'GLSL 代码编辑器',
    'tutorial.run': '运行',
    'tutorial.reset': '重置',
    'tutorial.submit': '提交',
    'tutorial.passed': '已通过',
    'tutorial.correct_preview': '正确代码预览',
    'tutorial.current_preview': '当前代码预览',
    
    // Home page
    'home.title': '掌握 GLSL 着色器编程',
    'home.subtitle': '从零开始学习 GLSL 着色器语言，释放 GPU 的强大图形渲染能力，创建令人惊叹的视觉效果。',
    'home.start_learning': '开始学习',
    'home.view_examples': '查看示例',
    
    // Home features
    'home.feature.editor': '交互式在线编辑器，实时预览效果',
    'home.feature.path': '从基础到高级的完整学习路径',
    'home.feature.projects': '丰富的示例和实战项目',
    
    'home.features.title': '我们能帮助您什么？',
    'home.features.description': '无论您是图形编程新手还是想要提升技能的开发者，我们的平台都能为您提供全面的学习支持',
    
    'home.features.beginner.title': '零基础入门',
    'home.features.beginner.description': '从最基础的概念开始，循序渐进地学习 GLSL 语法、WebGL 基础和图形编程原理，让初学者也能轻松上手。',
    
    'home.features.realtime.title': '实时编程体验',
    'home.features.realtime.description': '内置在线代码编辑器，支持实时预览和调试，让您边学边练，立即看到代码效果，提升学习效率。',
    
    'home.features.projects.title': '项目实战导向',
    'home.features.projects.description': '提供丰富的实际项目案例和练习，从简单的渐变效果到复杂的粒子系统，帮您构建完整的作品集。',
    
    // Applications
    'home.applications.title': 'GLSL 的应用场景',
    'home.applications.description': '掌握 GLSL 后，您将能够在多个领域创造令人惊叹的视觉效果',
    
    'home.applications.game.title': '游戏开发',
    'home.applications.game.description': '创建游戏中的特效、材质、光照和后处理效果',
    
    'home.applications.web.title': 'Web 开发',
    'home.applications.web.description': '为网站添加动态背景、交互动画和视觉特效',
    
    'home.applications.art.title': '数字艺术',
    'home.applications.art.description': '创作生成艺术、视觉装置和创意编程作品',
    
    'home.applications.data.title': '数据可视化',
    'home.applications.data.description': '构建高性能的图表、图形和交互式数据展示',
    
    // Learning system
    'home.learning.title': '完整的学习体系',
    'home.learning.description': '我们为您精心设计了完整的学习路径，从零基础到专业水平，每一步都有详细的指导和实践练习。无论您的目标是什么，我们都能帮您实现。',
    'home.learning.basic': '基础教程：从 UV 坐标、颜色混合到基本图形绘制',
    'home.learning.advanced': '进阶技巧：噪声函数、光照模型和动画效果',
    'home.learning.projects': '实战项目：完整的视觉效果和交互体验开发',
    'home.learning.optimization': '性能优化：让您的着色器在各种设备上流畅运行',
    
    // Call to action
    'home.cta.title': '准备好开始您的 GLSL 学习之旅了吗？',
    'home.cta.description': '加入我们的学习平台，从今天开始掌握现代图形编程技能。无论您是想要提升职业技能，还是纯粹出于兴趣，我们都将陪伴您的每一步成长。',
    'home.cta.features': ' 🚀 即学即用 • 💡 持续更新',
    
    // Tutorial detail page
    'tutorial.exercise_goal': '练习目标',
    'tutorial.knowledge_points': '知识点',
    'tutorial.tab.tutorial': '教程介绍',
    'tutorial.tab.answer': '参考答案',
    'tutorial.answer.title': '参考答案',
    'tutorial.answer.description': '以下是本练习的完整解决方案，你可以参考这个代码来理解正确的实现方式。',
    'tutorial.answer.tip': '💡 建议先尝试自己完成，遇到困难时再查看答案。',
    'tutorial.answer.code': 'GLSL 代码:',
    'tutorial.answer.explanation': '代码说明:',
    'tutorial.answer.explanation_1': '• 这段代码展示了如何正确实现本练习的要求',
    'tutorial.answer.explanation_2': '• 注意变量的声明和使用方式',
    'tutorial.answer.explanation_3': '• 观察输出结果与预期效果的对应关系',
    'tutorial.answer.tips': '学习建议:',
    'tutorial.answer.tip_1': '1. 尝试理解每一行代码的作用',
    'tutorial.answer.tip_2': '2. 可以修改参数值观察效果变化',
    'tutorial.answer.tip_3': '3. 将答案代码复制到编辑器中运行验证',
    'tutorial.answer.tip_4': '4. 基于答案代码尝试创造自己的变化',
    
    // Tutorial navigation
    'tutorial.prev': '上一个',
    'tutorial.next': '下一个',
    'tutorial.completed': '练习完成！',
    'tutorial.ready_for_next': '准备挑战下一个教程吗？',
    'tutorial.next_tutorial_hint': '准备好了吗？',
    'tutorial.next_tutorial_action': '等你来挑战！',
    'tutorial.back_to_list': '返回列表',
    
    // Common
    'common.back': '返回',
    
    // Footer
    'footer.rights': '保留所有权利',
    
    // Common
    'loading': '加载中...',
    'error': '错误',
    'success': '成功',
  },
  en: {
    // Header
    'header.title': 'GLSL Learning',
    'nav.home': 'Home',
    'nav.learn': 'Learn',
    'nav.examples': 'Examples',
    'nav.about': 'About',
    
    // Language switcher
    'language.chinese': '中文',
    'language.english': 'English',
    
    // Learn page
    'learn.title': 'GLSL Learning Platform',
    'learn.description': 'Master modern graphics programming skills through hands-on practice and deep understanding of GLSL shader development. From basic syntax to advanced effects, create your own visual masterpieces.',
    'learn.basic': 'Basic Tutorials',
    'learn.intermediate': 'Intermediate Tutorials',
    'learn.advanced': 'Advanced Tutorials',
    'learn.filter.difficulty': 'Filter by Difficulty',
    'learn.no_tutorials': 'No matching tutorials found',
    
    // Difficulty levels
    'learn.difficulty.beginner': 'Beginner',
    'learn.difficulty.intermediate': 'Intermediate',
    'learn.difficulty.advanced': 'Advanced',
    'learn.difficulty.all': 'All',
    
    // Categories
    'learn.category.basic': 'Basic',
    'learn.category.math': 'Math',
    'learn.category.patterns': 'Patterns',
    'learn.category.animation': 'Animation',
    'learn.category.noise': 'Noise',
    'learn.category.lighting': 'Lighting',
    'learn.category.all': 'All',
    
    // Learning path
    'learn.path.title': '🎯 Explore Learning Paths',
    'learn.path.subtitle': 'Choose topics that interest you and begin your GLSL programming journey',
    'learn.path.tutorials_count': 'tutorials',
    'learn.path.basic.desc': 'Start with the most basic concepts, learn GLSL syntax and basic graphics rendering',
    'learn.path.math.desc': 'Master mathematical functions and coordinate transformations in graphics programming',
    'learn.path.patterns.desc': 'Create various patterns and texture effects',
    'learn.path.animation.desc': 'Learn time-based animations and interactive effects',
    'learn.path.noise.desc': 'Master noise functions to generate natural textures',
    'learn.path.lighting.desc': 'Implement lighting models and rendering effects',
    'learn.back_to_categories': 'Back to Categories',
    
    // Tutorial page
    'tutorial.objective': '📝 Exercise Objective',
    'tutorial.content': '💡 Tutorial Content',
    'tutorial.knowledge': '💡 Knowledge Points',
    'tutorial.editor': 'GLSL Code Editor',
    'tutorial.run': 'Run',
    'tutorial.reset': 'Reset',
    'tutorial.submit': 'Submit',
    'tutorial.passed': 'Passed',
    'tutorial.correct_preview': 'Correct Code Preview',
    'tutorial.current_preview': 'Current Code Preview',
    
    // Home page
    'home.title': 'Master GLSL Shader Programming',
    'home.subtitle': 'Learn GLSL shader language from scratch, unleash the powerful graphics rendering capabilities of GPU, and create stunning visual effects.',
    'home.start_learning': 'Start Learning',
    'home.view_examples': 'View Examples',
    
    // Home features
    'home.feature.editor': 'Interactive online editor with real-time preview',
    'home.feature.path': 'Complete learning path from basic to advanced',
    'home.feature.projects': 'Rich examples and practical projects',
    
    'home.features.title': 'How Can We Help You?',
    'home.features.description': 'Whether you are a graphics programming beginner or a developer looking to enhance your skills, our platform provides comprehensive learning support',
    
    'home.features.beginner.title': 'Beginner Friendly',
    'home.features.beginner.description': 'Starting from the most basic concepts, progressively learn GLSL syntax, WebGL basics, and graphics programming principles, making it easy for beginners to get started.',
    
    'home.features.realtime.title': 'Real-time Programming Experience',
    'home.features.realtime.description': 'Built-in online code editor with real-time preview and debugging support, allowing you to learn while practicing and see code effects immediately.',
    
    'home.features.projects.title': 'Project-oriented Practice',
    'home.features.projects.description': 'Provides rich practical project cases and exercises, from simple gradient effects to complex particle systems, helping you build a complete portfolio.',
    
    // Applications
    'home.applications.title': 'GLSL Application Scenarios',
    'home.applications.description': 'After mastering GLSL, you will be able to create stunning visual effects in multiple fields',
    
    'home.applications.game.title': 'Game Development',
    'home.applications.game.description': 'Create special effects, materials, lighting and post-processing effects in games',
    
    'home.applications.web.title': 'Web Development',
    'home.applications.web.description': 'Add dynamic backgrounds, interactive animations and visual effects to websites',
    
    'home.applications.art.title': 'Digital Art',
    'home.applications.art.description': 'Create generative art, visual installations and creative programming works',
    
    'home.applications.data.title': 'Data Visualization',
    'home.applications.data.description': 'Build high-performance charts, graphics and interactive data displays',
    
    // Learning system
    'home.learning.title': 'Complete Learning System',
    'home.learning.description': 'We have carefully designed a complete learning path for you, from zero foundation to professional level, with detailed guidance and practical exercises at every step. Whatever your goal, we can help you achieve it.',
    'home.learning.basic': 'Basic Tutorials: From UV coordinates, color mixing to basic shape drawing',
    'home.learning.advanced': 'Advanced Techniques: Noise functions, lighting models and animation effects',
    'home.learning.projects': 'Practical Projects: Complete visual effects and interactive experience development',
    'home.learning.optimization': 'Performance Optimization: Make your shaders run smoothly on various devices',
    
    // Call to action
    'home.cta.title': 'Ready to Start Your GLSL Learning Journey?',
    'home.cta.description': 'Join our learning platform and start mastering modern graphics programming skills today. Whether you want to enhance your professional skills or pursue it out of pure interest, we will accompany you every step of your growth.',
    'home.cta.features': ' 🚀 Learn and Apply • 💡 Continuously Updated',
    
    // Tutorial detail page
    'tutorial.exercise_goal': 'Exercise Goal',
    'tutorial.knowledge_points': 'Knowledge Points',
    'tutorial.tab.tutorial': 'Tutorial',
    'tutorial.tab.answer': 'Answer',
    'tutorial.answer.title': 'Reference Answer',
    'tutorial.answer.description': 'Below is the complete solution for this exercise. You can refer to this code to understand the correct implementation approach.',
    'tutorial.answer.tip': '💡 It is recommended to try completing it yourself first, and check the answer when you encounter difficulties.',
    'tutorial.answer.code': 'GLSL Code:',
    'tutorial.answer.explanation': 'Code Explanation:',
    'tutorial.answer.explanation_1': '• This code demonstrates how to correctly implement the requirements of this exercise',
    'tutorial.answer.explanation_2': '• Pay attention to variable declaration and usage patterns',
    'tutorial.answer.explanation_3': '• Observe the correspondence between output results and expected effects',
    'tutorial.answer.tips': 'Learning Tips:',
    'tutorial.answer.tip_1': '1. Try to understand the purpose of each line of code',
    'tutorial.answer.tip_2': '2. Modify parameter values to observe effect changes',
    'tutorial.answer.tip_3': '3. Copy the answer code to the editor to run and verify',
    'tutorial.answer.tip_4': '4. Try to create your own variations based on the answer code',
    
    // Tutorial navigation
    'tutorial.prev': 'Previous',
    'tutorial.next': 'Next',
    'tutorial.completed': 'Exercise Completed!',
    'tutorial.ready_for_next': 'Ready for the next tutorial?',
    'tutorial.next_tutorial_hint': 'Ready?',
    'tutorial.next_tutorial_action': 'is waiting for your challenge!',
    'tutorial.back_to_list': 'Back to List',
    
    // Common
    'common.back': 'Back',
    
    // Footer
    'footer.rights': 'All rights reserved',
    
    // Common
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
  },
};

// 获取翻译文本的函数
export function getTranslation(locale: Locale, key: string, defaultValue?: string): string {
  return translations[locale]?.[key] || defaultValue || key;
}

// 获取翻译函数的函数（用于组件中）
export function getTranslationFunction(locale: Locale): (key: string, defaultValue?: string) => string {
  return (key: string, defaultValue?: string) => getTranslation(locale, key, defaultValue);
}