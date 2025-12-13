"use client";
import { useAuth } from '@/contexts/AuthContext';

export default function WelcomeMessage() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">
              欢迎回来，{user.user_metadata?.full_name || user.email}！🎉
            </p>
            <p className="text-sm text-green-700 mt-1">
              您已成功登录，可以开始学习 GLSL 着色器了。
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
