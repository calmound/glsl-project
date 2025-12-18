'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/main-layout';
import type { Locale } from '@/lib/i18n';
import AdminStats from './admin-stats';

interface LeaderboardEntry {
  user_id: string;
  name: string | null;
  avatar_url: string | null;
  total_tutorials_completed: number;
  total_exercises_passed: number;
  total_exercises_attempted: number;
  overall_score: number;
  current_streak_days: number;
  total_learning_time_minutes: number;
  last_active_at: string;
  rank: number;
}

interface UserStatistics {
  total_tutorials_completed: number;
  total_exercises_passed: number;
  total_exercises_attempted: number;
  overall_score: number;
  current_streak_days: number;
  longest_streak_days: number;
  total_learning_time_minutes: number;
  total_login_days: number;
}

interface Achievement {
  achievement_id: string;
  achievement_type: string;
  level: number;
  unlocked_at: string;
}

interface LeaderboardClientProps {
  locale: Locale;
}

export default function LeaderboardClient({ locale }: LeaderboardClientProps) {
  const { user } = useAuth();

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardEntry | null>(null);
  const [userStatistics, setUserStatistics] = useState<UserStatistics | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`/api/leaderboard?timeRange=all&limit=100`);
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
      setCurrentUserRank(data.currentUserRank);
    } catch (error) {
      console.error('获取排行榜失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStatistics = async () => {
    try {
      const response = await fetch('/api/user/statistics');
      const data = await response.json();
      setUserStatistics(data.statistics);
      setAchievements(data.achievements || []);
    } catch (error) {
      console.error('获取用户统计失败:', error);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    if (user) {
      fetchUserStatistics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);



  const getRankMedal = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getSkillLevel = (tutorialsCompleted: number) => {
    if (tutorialsCompleted >= 50) return { label: locale === 'zh' ? '大师' : 'Master', color: 'text-purple-600' };
    if (tutorialsCompleted >= 30) return { label: locale === 'zh' ? '专家' : 'Expert', color: 'text-blue-600' };
    if (tutorialsCompleted >= 15) return { label: locale === 'zh' ? '进阶' : 'Advanced', color: 'text-green-600' };
    if (tutorialsCompleted >= 5) return { label: locale === 'zh' ? '中级' : 'Intermediate', color: 'text-yellow-600' };
    return { label: locale === 'zh' ? '初学者' : 'Beginner', color: 'text-gray-600' };
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 管理员统计（仅管理员可见） */}
        <AdminStats locale={locale as 'en' | 'zh'} />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {locale === 'zh' ? '🏆 学习排行榜' : '🏆 Learning Leaderboard'}
          </h1>
          <p className="text-gray-600">
            {locale === 'zh'
              ? '与其他开发者一起学习，挑战更高排名！'
              : 'Learn with other developers and challenge for higher rankings!'}
          </p>
        </div>

        {/* 个人统计卡片 */}
        {user && userStatistics && (
          <div className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">
                {locale === 'zh' ? '我的学习统计' : 'My Learning Statistics'}
              </h2>
              {currentUserRank && (
                <div className="text-3xl font-bold">
                  {getRankMedal(currentUserRank.rank)}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-sm opacity-90">
                  {locale === 'zh' ? '完成教程' : 'Completed'}
                </div>
                <div className="text-3xl font-bold">{userStatistics.total_tutorials_completed}</div>
              </div>

              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-sm opacity-90">
                  {locale === 'zh' ? '练习通过' : 'Passed'}
                </div>
                <div className="text-3xl font-bold">{userStatistics.total_exercises_passed}</div>
              </div>

              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-sm opacity-90">
                  {locale === 'zh' ? '连续天数' : 'Streak'}
                </div>
                <div className="text-3xl font-bold">
                  {userStatistics.current_streak_days}🔥
                </div>
              </div>

              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-sm opacity-90">
                  {locale === 'zh' ? '总分' : 'Score'}
                </div>
                <div className="text-3xl font-bold">{userStatistics.overall_score.toLocaleString()}</div>
              </div>
            </div>

            {/* 成就徽章 */}
            {achievements.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="text-sm opacity-90 mb-2">
                  {locale === 'zh' ? '获得成就' : 'Achievements'}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {achievements.slice(0, 5).map((achievement) => (
                    <div
                      key={achievement.achievement_id}
                      className="bg-white/20 rounded px-3 py-1 text-sm"
                      title={achievement.achievement_id}
                    >
                      ⭐ {achievement.achievement_type}
                    </div>
                  ))}
                  {achievements.length > 5 && (
                    <div className="bg-white/20 rounded px-3 py-1 text-sm">
                      +{achievements.length - 5}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 未登录提示 */}
        {!user && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              {locale === 'zh' ? '登录查看你的排名' : 'Sign in to see your ranking'}
            </h3>
            <p className="text-blue-700 text-sm">
              {locale === 'zh'
                ? '登录后可以查看个人学习统计、获得成就徽章，并参与排行榜竞争！'
                : 'Sign in to view your learning statistics, earn achievement badges, and compete on the leaderboard!'}
            </p>
          </div>
        )}



        {/* 排行榜列表 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === 'zh' ? '排名' : 'Rank'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === 'zh' ? '用户' : 'User'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === 'zh' ? '等级' : 'Level'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {locale === 'zh' ? '完成' : 'Completed'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      {locale === 'zh' ? '加载中...' : 'Loading...'}
                    </td>
                  </tr>
                ) : leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      {locale === 'zh' ? '暂无排行榜数据' : 'No leaderboard data yet'}
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((entry) => {
                    const skillLevel = getSkillLevel(entry.total_tutorials_completed);
                    const isCurrentUser = user && entry.user_id === user.id;

                    return (
                      <tr
                        key={entry.user_id}
                        className={`hover:bg-gray-50 transition-colors ${isCurrentUser ? 'bg-blue-50' : ''
                          }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-2xl font-bold">{getRankMedal(entry.rank)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={
                                  entry.avatar_url ||
                                  `https://api.dicebear.com/9.x/avataaars/svg?seed=${entry.user_id}`
                                }
                                alt={entry.name || 'User'}
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {entry.name || (locale === 'zh' ? '匿名用户' : 'Anonymous')}
                                {isCurrentUser && (
                                  <span className="ml-2 text-xs text-blue-600">
                                    ({locale === 'zh' ? '我' : 'You'})
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-semibold ${skillLevel.color}`}>
                            {skillLevel.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.total_tutorials_completed}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 评分说明 */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            {locale === 'zh' ? '📊 评分规则' : '📊 Scoring Rules'}
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
              <span className="font-medium">
                {locale === 'zh' ? '完成教程:' : 'Complete Tutorial:'}
              </span>{' '}
              +100 {locale === 'zh' ? '分' : 'pts'}
            </div>
            <div>
              <span className="font-medium">
                {locale === 'zh' ? '通过练习:' : 'Pass Exercise:'}
              </span>{' '}
              +50 {locale === 'zh' ? '分' : 'pts'}
            </div>
            <div>
              <span className="font-medium">
                {locale === 'zh' ? '尝试练习:' : 'Attempt Exercise:'}
              </span>{' '}
              +10 {locale === 'zh' ? '分' : 'pts'}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
