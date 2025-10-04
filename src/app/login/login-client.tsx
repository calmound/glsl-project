"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginClient() {
  const router = useRouter()

  useEffect(() => {
    // 重定向到新的登录页面
    router.replace('/signin')
  }, [router])

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <p className="text-gray-500">重定向到登录页面...</p>
    </div>
  )
}

