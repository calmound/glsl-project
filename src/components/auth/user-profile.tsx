"use client"
import { useEffect, useState } from 'react'
import { createBrowserSupabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const supabase = createBrowserSupabase()
    
    // 获取用户信息
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!mounted) return
      setUser(user)
      setLoading(false)
    }).catch(() => {
      if (!mounted) return
      setUser(null)
      setLoading(false)
    })

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setUser(session?.user ?? null)
    })
    
    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, []) // 空依赖数组，只在挂载时执行

  if (loading) {
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

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-50 border border-gray-200">
      {avatarUrl ? (
        <img 
          src={avatarUrl} 
          alt={displayName}
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
          {displayName.charAt(0).toUpperCase()}
        </div>
      )}
      <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
        {displayName}
      </span>
    </div>
  )
}
