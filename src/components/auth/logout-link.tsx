"use client"
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { createBrowserSupabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LogoutLink() {
  const { t, language } = useLanguage()
  const { user, loading, refreshUser } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createBrowserSupabase()
    
    // 可选：添加确认对话框
    const confirmed = window.confirm(
      language === 'zh' 
        ? '确定要退出登录吗？' 
        : 'Are you sure you want to logout?'
    )
    
    if (!confirmed) return

    try {
      setIsLoggingOut(true)
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('登出错误:', error)
        alert(language === 'zh' ? '登出失败，请重试' : 'Logout failed, please try again')
        setIsLoggingOut(false)
        return
      }

      // 刷新用户状态
      await refreshUser()

      // 成功登出后重定向到首页并刷新
      router.push('/')
      router.refresh()
    } catch (err) {
      console.error('登出异常:', err)
      alert(language === 'zh' ? '登出出现异常，请重试' : 'Logout error, please try again')
      setIsLoggingOut(false)
    }
  }

  // 加载中或未登录时不显示登出按钮
  if (loading || !user) return null

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      title={user.email || undefined}
    >
      {isLoggingOut
        ? (language === 'zh' ? '退出中...' : 'Logging out...')
        : t('nav.logout', 'Logout')
      }
    </button>
  )
}

