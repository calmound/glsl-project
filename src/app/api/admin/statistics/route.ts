import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

// 管理员邮箱列表（从环境变量读取）
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'support@shader-learn.com').split(',');

export async function GET() {
  try {
    const supabase = await createServerSupabase();

    // 验证用户登录状态
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    // 验证是否为管理员
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    if (!profile || !ADMIN_EMAILS.includes(profile.email || '')) {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    // 获取总用户数
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // 获取有统计数据的活跃用户数
    const { count: activeUsers } = await supabase
      .from('user_statistics')
      .select('*', { count: 'exact', head: true })
      .gt('overall_score', 0);

    // 获取最近7天活跃用户
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const { count: weeklyActiveUsers } = await supabase
      .from('user_statistics')
      .select('*', { count: 'exact', head: true })
      .gte('last_active_at', sevenDaysAgo.toISOString());

    // 获取最近30天活跃用户
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const { count: monthlyActiveUsers } = await supabase
      .from('user_statistics')
      .select('*', { count: 'exact', head: true })
      .gte('last_active_at', thirtyDaysAgo.toISOString());

    // 获取今日活跃用户
    const today = new Date().toISOString().split('T')[0];
    const { count: dailyActiveUsers } = await supabase
      .from('user_daily_activity')
      .select('*', { count: 'exact', head: true })
      .eq('activity_date', today);

    // 获取教程完成统计
    const { data: tutorialStats } = await supabase
      .from('user_form_status')
      .select('form_id, is_passed')
      .eq('is_passed', true);

    // 统计最受欢迎的教程（完成次数最多）
    const tutorialCompletionMap: { [key: string]: number } = {};
    tutorialStats?.forEach((stat) => {
      tutorialCompletionMap[stat.form_id] = (tutorialCompletionMap[stat.form_id] || 0) + 1;
    });

    const popularTutorials = Object.entries(tutorialCompletionMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([id, count]) => ({ tutorial_id: id, completion_count: count }));

    // 获取总完成教程数
    const { count: totalCompletions } = await supabase
      .from('user_form_status')
      .select('*', { count: 'exact', head: true })
      .eq('is_passed', true);

    // 获取总练习尝试数
    const { count: totalAttempts } = await supabase
      .from('user_form_status')
      .select('*', { count: 'exact', head: true })
      .eq('has_submitted', true);

    // 获取最近30天的用户增长数据
    const { data: recentProfiles } = await supabase
      .from('profiles')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    // 按日期分组统计新增用户
    const userGrowthByDay: { [key: string]: number } = {};
    recentProfiles?.forEach((profile) => {
      const date = profile.created_at.split('T')[0];
      userGrowthByDay[date] = (userGrowthByDay[date] || 0) + 1;
    });

    const userGrowthData = Object.entries(userGrowthByDay).map(([date, count]) => ({
      date,
      new_users: count,
    }));

    // 获取平均学习时长
    const { data: learningTimeStats } = await supabase
      .from('user_statistics')
      .select('total_learning_time_minutes')
      .gt('total_learning_time_minutes', 0);

    const avgLearningTime =
      learningTimeStats && learningTimeStats.length > 0
        ? learningTimeStats.reduce((sum, s) => sum + s.total_learning_time_minutes, 0) /
        learningTimeStats.length
        : 0;

    // 获取难度分布
    const { data: difficultyStats } = await supabase.from('user_statistics').select('*');

    const beginnerCount = difficultyStats?.filter((s) => s.total_tutorials_completed < 10).length || 0;
    const intermediateCount =
      difficultyStats?.filter((s) => s.total_tutorials_completed >= 10 && s.total_tutorials_completed < 30)
        .length || 0;
    const advancedCount = difficultyStats?.filter((s) => s.total_tutorials_completed >= 30).length || 0;

    return NextResponse.json({
      userMetrics: {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        dailyActiveUsers: dailyActiveUsers || 0,
        weeklyActiveUsers: weeklyActiveUsers || 0,
        monthlyActiveUsers: monthlyActiveUsers || 0,
      },
      learningMetrics: {
        totalCompletions: totalCompletions || 0,
        totalAttempts: totalAttempts || 0,
        avgLearningTimeMinutes: Math.round(avgLearningTime),
        completionRate:
          totalAttempts && totalAttempts > 0
            ? Math.round(((totalCompletions || 0) / totalAttempts) * 100)
            : 0,
      },
      popularTutorials,
      userGrowthData,
      skillDistribution: {
        beginner: beginnerCount,
        intermediate: intermediateCount,
        advanced: advancedCount,
      },
    });
  } catch (error) {
    console.error('管理员统计 API 错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
