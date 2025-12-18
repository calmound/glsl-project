'use client';

import React, { useEffect, useState } from 'react';

interface AdminStatistics {
  userMetrics: {
    totalUsers: number;
    activeUsers: number;
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
  };
  learningMetrics: {
    totalCompletions: number;
    totalAttempts: number;
    avgLearningTimeMinutes: number;
    completionRate: number;
  };
  popularTutorials: Array<{
    tutorial_id: string;
    completion_count: number;
  }>;
  userGrowthData: Array<{
    date: string;
    new_users: number;
  }>;
  skillDistribution: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
}

interface AdminStatsProps {
  locale: 'en' | 'zh';
}

export default function AdminStats({ locale }: AdminStatsProps) {
  const [stats, setStats] = useState<AdminStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch('/api/admin/statistics');

      if (response.status === 401) {
        setError(locale === 'zh' ? '未登录' : 'Not authenticated');
        return;
      }

      if (response.status === 403) {
        // 不是管理员，不显示任何内容
        setError(null);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch admin statistics');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('获取管理员统计失败:', error);
      setError(locale === 'zh' ? '加载失败' : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  // 如果有错误或者不是管理员，不显示任何内容
  if (error || !stats) {
    return null;
  }

  if (loading) {
    return (
      <div className="mb-8 bg-gray-50 rounded-lg p-6 text-center">
        <div className="text-gray-600">
          {locale === 'zh' ? '加载管理员统计...' : 'Loading admin statistics...'}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 space-y-6">
      {/* 管理员标识 */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-4 text-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
          🔧 {locale === 'zh' ? '管理员统计' : 'Admin Statistics'}
        </h2>
        <p className="text-sm opacity-90 mt-1">
          {locale === 'zh' ? '仅管理员可见' : 'Visible to administrators only'}
        </p>
      </div>

      {/* 用户指标 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">
          👥 {locale === 'zh' ? '用户指标' : 'User Metrics'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.userMetrics.totalUsers}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {locale === 'zh' ? '总用户' : 'Total Users'}
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stats.userMetrics.activeUsers}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {locale === 'zh' ? '活跃用户' : 'Active Users'}
            </div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.userMetrics.dailyActiveUsers}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {locale === 'zh' ? '日活' : 'DAU'}
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {stats.userMetrics.weeklyActiveUsers}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {locale === 'zh' ? '周活' : 'WAU'}
            </div>
          </div>
          <div className="text-center p-4 bg-pink-50 rounded-lg">
            <div className="text-2xl font-bold text-pink-600">
              {stats.userMetrics.monthlyActiveUsers}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {locale === 'zh' ? '月活' : 'MAU'}
            </div>
          </div>
        </div>
      </div>

      {/* 学习指标 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">
          📚 {locale === 'zh' ? '学习指标' : 'Learning Metrics'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">
              {stats.learningMetrics.totalCompletions}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {locale === 'zh' ? '总完成数' : 'Total Completions'}
            </div>
          </div>
          <div className="text-center p-4 bg-cyan-50 rounded-lg">
            <div className="text-2xl font-bold text-cyan-600">
              {stats.learningMetrics.totalAttempts}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {locale === 'zh' ? '总尝试数' : 'Total Attempts'}
            </div>
          </div>
          <div className="text-center p-4 bg-teal-50 rounded-lg">
            <div className="text-2xl font-bold text-teal-600">
              {stats.learningMetrics.completionRate}%
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {locale === 'zh' ? '完成率' : 'Completion Rate'}
            </div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {stats.learningMetrics.avgLearningTimeMinutes}m
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {locale === 'zh' ? '平均学习时长' : 'Avg Learning Time'}
            </div>
          </div>
        </div>
      </div>

      {/* 技能分布 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">
          🎯 {locale === 'zh' ? '用户技能分布' : 'User Skill Distribution'}
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">
              {stats.skillDistribution.beginner}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {locale === 'zh' ? '初学者 (<10)' : 'Beginner (<10)'}
            </div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.skillDistribution.intermediate}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {locale === 'zh' ? '中级 (10-30)' : 'Intermediate (10-30)'}
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {stats.skillDistribution.advanced}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {locale === 'zh' ? '高级 (30+)' : 'Advanced (30+)'}
            </div>
          </div>
        </div>
      </div>

      {/* 最受欢迎教程 */}
      {stats.popularTutorials.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            ⭐ {locale === 'zh' ? '最受欢迎教程 (Top 10)' : 'Most Popular Tutorials (Top 10)'}
          </h3>
          <div className="space-y-2">
            {stats.popularTutorials.map((tutorial, index) => (
              <div
                key={tutorial.tutorial_id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-lg font-bold text-gray-400">#{index + 1}</div>
                  <div className="text-sm text-gray-700 font-mono">{tutorial.tutorial_id}</div>
                </div>
                <div className="text-sm font-semibold text-blue-600">
                  {tutorial.completion_count}{' '}
                  {locale === 'zh' ? '次完成' : 'completions'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 用户增长趋势 */}
      {stats.userGrowthData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            📈 {locale === 'zh' ? '最近30天用户增长' : 'User Growth (Last 30 Days)'}
          </h3>
          <div className="text-sm text-gray-600 mb-2">
            {locale === 'zh' ? '总新增:' : 'Total new users:'}{' '}
            <span className="font-bold text-gray-900">
              {stats.userGrowthData.reduce((sum, d) => sum + d.new_users, 0)}
            </span>
          </div>
          <div className="h-40 flex items-end gap-1">
            {stats.userGrowthData.slice(-30).map((data, index) => {
              const maxUsers = Math.max(...stats.userGrowthData.map((d) => d.new_users));
              const height = maxUsers > 0 ? (data.new_users / maxUsers) * 100 : 0;
              return (
                <div
                  key={index}
                  className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer relative group"
                  style={{ height: `${height}%`, minHeight: data.new_users > 0 ? '4px' : '0' }}
                  title={`${data.date}: ${data.new_users} ${locale === 'zh' ? '新用户' : 'new users'}`}
                >
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {data.date}
                    <br />
                    +{data.new_users}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
