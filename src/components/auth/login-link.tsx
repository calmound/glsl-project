"use client"
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginLink() {
  const { t } = useLanguage()
  const { user, loading } = useAuth()

  // 加载中或已登录时不显示登录按钮
  if (loading || user) return null

  return (
    <Link href="/signin" className="px-3 py-1 rounded bg-black text-white hover:opacity-90">
      {t('nav.login', 'Login')}
    </Link>
  )
}

