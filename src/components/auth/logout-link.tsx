"use client"
import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { createBrowserSupabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LogoutLink() {
  const { t, language } = useLanguage()
  const [show, setShow] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    const supabase = createBrowserSupabase()
    
    // 检查用户登录状态
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!mounted) return
      setShow(!!user)
      setUserEmail(user?.email || null)
    }).catch(() => {
      if (!mounted) return
      setShow(false)
      setUserEmail(null)
    })

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setShow(!!session?.user)
      setUserEmail(session?.user?.email || null)
    })
    
    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, []) // 空依赖数组

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
      
      // 立即更新本地状态
      setShow(false)
      setUserEmail(null)
      
      // 成功登出后重定向到首页并刷新
      router.push('/')
      router.refresh()
    } catch (err) {
      console.error('登出异常:', err)
      alert(language === 'zh' ? '登出出现异常，请重试' : 'Logout error, please try again')
      setIsLoggingOut(false)
    }
  }

  if (!show) return null

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      title={userEmail || undefined}
    >
      {isLoggingOut 
        ? (language === 'zh' ? '退出中...' : 'Logging out...') 
        : t('nav.logout', 'Logout')
      }
    </button>
  )
}

