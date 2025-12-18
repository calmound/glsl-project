import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

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

    // 获取用户统计数据
    const { data: statistics, error: statsError } = await supabase
      .from('user_statistics')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (statsError && statsError.code !== 'PGRST116') {
      // PGRST116 是 "not found" 错误
      console.error('获取用户统计失败:', statsError);
      return NextResponse.json({ error: '获取统计数据失败' }, { status: 500 });
    }

    // 如果没有统计数据，创建初始数据
    if (!statistics) {
      const { data: newStats, error: createError } = await supabase
        .from('user_statistics')
        .insert({
          user_id: user.id,
          total_tutorials_completed: 0,
          total_exercises_passed: 0,
          total_exercises_attempted: 0,
          overall_score: 0,
        })
        .select()
        .single();

      if (createError) {
        console.error('创建统计数据失败:', createError);
        return NextResponse.json({ error: '创建统计数据失败' }, { status: 500 });
      }

      return NextResponse.json({ statistics: newStats });
    }

    // 获取用户成就
    const { data: achievements } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', user.id)
      .order('unlocked_at', { ascending: false });

    // 获取最近30天的学习活动
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: dailyActivity } = await supabase
      .from('user_daily_activity')
      .select('*')
      .eq('user_id', user.id)
      .gte('activity_date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('activity_date', { ascending: true });

    return NextResponse.json({
      statistics,
      achievements: achievements || [],
      dailyActivity: dailyActivity || [],
    });
  } catch (error) {
    console.error('用户统计 API 错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 更新用户统计
export async function POST() {
  try {
    const supabase = await createServerSupabase();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    // 调用更新统计的数据库函数
    const { error: updateError } = await supabase.rpc('update_user_statistics', {
      p_user_id: user.id,
    });

    if (updateError) {
      console.error('更新统计失败:', updateError);
      return NextResponse.json({ error: '更新统计失败' }, { status: 500 });
    }

    // 获取更新后的数据
    const { data: statistics } = await supabase
      .from('user_statistics')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return NextResponse.json({ statistics, success: true });
  } catch (error) {
    console.error('更新统计 API 错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
