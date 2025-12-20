"use client"
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function UserProfile() {
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

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

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-50 border border-gray-200">
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
      <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
        {displayName}
      </span>
    </div>
  )
}
