"use client"
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { createBrowserSupabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function UserProfile() {
  const { user, loading, hasActiveSubscription, refreshUser } = useAuth()
  const { t, language } = useLanguage()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 避免 hydration 不匹配，在客户端挂载前不渲染
  if (!mounted || loading) {
    return null
  }

  if (!user) {
    return null
  }

  // 获取用户名或邮箱前缀
  const displayName = user.user_metadata?.full_name
    || user.user_metadata?.name
    || user.email?.split('@')[0]
    || 'User'

  // 获取头像
  const avatarUrl = user.user_metadata?.avatar_url

  const handleLogout = async () => {
    const confirmed = window.confirm(
      language === 'zh'
        ? '确定要退出登录吗？'
        : 'Are you sure you want to logout?'
    )

    if (!confirmed) return

    try {
      setIsLoggingOut(true)
      const supabase = createBrowserSupabase()
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('登出错误:', error)
        alert(language === 'zh' ? '登出失败，请重试' : 'Logout failed, please try again')
        setIsLoggingOut(false)
        return
      }

      await refreshUser()
      router.push('/')
      router.refresh()
    } catch (err) {
      console.error('登出异常:', err)
      alert(language === 'zh' ? '登出出现异常，请重试' : 'Logout error, please try again')
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="relative group">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-gray-300 transition-colors">
        <div className="relative">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          {hasActiveSubscription && (
            <span className="absolute -top-1 -right-2 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-semibold leading-none shadow">
              PRO
            </span>
          )}
        </div>
        <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
          {displayName}
        </span>
        <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div className="absolute inset-x-0 top-full h-2" aria-hidden="true" />
      <div className="absolute right-0 mt-1 w-34 rounded-xl border border-gray-200 bg-white shadow-lg opacity-0 pointer-events-none translate-y-1 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 transition-all duration-150">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-primary/5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoggingOut
            ? (language === 'zh' ? '退出中...' : 'Logging out...')
            : t('nav.logout', 'Logout')}
        </button>
      </div>
    </div>
  )
}
