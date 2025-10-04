"use client"
import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { createBrowserSupabase } from '@/lib/supabase'

export default function LogoutLink() {
  const { t } = useLanguage()
  const [show, setShow] = useState(false)
  const supabase = createBrowserSupabase()

  useEffect(() => {
    let mounted = true
    
    // 检查用户登录状态
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!mounted) return
      setShow(!!user)
    }).catch(() => {
      if (!mounted) return
      setShow(false)
    })
    
    return () => {
      mounted = false
    }
  }, [supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (!show) return null

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-1 rounded border hover:bg-gray-50"
    >
      {t('nav.logout', 'Logout')}
    </button>
  )
}

