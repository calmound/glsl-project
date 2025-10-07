"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { createBrowserSupabase } from '@/lib/supabase'

export default function LoginLink() {
  const { t } = useLanguage()
  const [show, setShow] = useState(false)

  useEffect(() => {
    let mounted = true
    const supabase = createBrowserSupabase()
    
    // 检查用户登录状态
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!mounted) return
      setShow(!user)
    }).catch(() => {
      if (!mounted) return
      // On error, conservatively show Login to allow auth
      setShow(true)
    })

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setShow(!session?.user)
    })
    
    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, []) // 空依赖数组

  if (!show) return null

  return (
    <Link href="/signin" className="px-3 py-1 rounded bg-black text-white hover:opacity-90">
      {t('nav.login', 'Login')}
    </Link>
  )
}

