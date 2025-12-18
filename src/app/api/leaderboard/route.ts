import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100');
    const timeRange = searchParams.get('timeRange') || 'all'; // 'all', 'month', 'week'

    // 获取排行榜数据
    let query = supabase
      .from('leaderboard_view')
      .select('*')
      .limit(limit);

    // 如果是月度或周度排行，过滤最近活跃的用户
    if (timeRange === 'month') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query = query.gte('last_active_at', thirtyDaysAgo.toISOString());
    } else if (timeRange === 'week') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      query = query.gte('last_active_at', sevenDaysAgo.toISOString());
    }

    const { data: leaderboard, error } = await query;

    if (error) {
      console.error('获取排行榜数据失败:', error);
      return NextResponse.json({ error: '获取排行榜数据失败' }, { status: 500 });
    }

    // 获取当前用户排名（如果已登录）
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let currentUserRank = null;
    if (user) {
      const { data: userRank } = await supabase
        .from('leaderboard_view')
        .select('*')
        .eq('user_id', user.id)
        .single();

      currentUserRank = userRank;
    }

    return NextResponse.json({
      leaderboard: leaderboard || [],
      currentUserRank,
      total: leaderboard?.length || 0,
    });
  } catch (error) {
    console.error('排行榜 API 错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
