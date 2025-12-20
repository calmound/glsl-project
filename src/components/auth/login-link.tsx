"use client"
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'

export default function LoginLink() {
  const { t } = useLanguage()
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 避免 hydration 不匹配，在客户端挂载前不渲染
  if (!mounted || loading || user) return null

  return (
    <Link href="/signin" className="px-3 py-1 rounded bg-black text-white hover:opacity-90">
      {t('nav.login', 'Login')}
    </Link>
  )
}

