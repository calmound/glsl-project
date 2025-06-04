'use client'

import { useState, useRef, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

export default function UserMenu() {
  const { session, status } = useAuth()
  const { language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (status === 'loading') {
    return (
      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <Link
        href="/auth/signin"
        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        登录
      </Link>
    )
  }

  const user = session?.user

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <span className="hidden md:block text-sm font-medium">
          {user?.name || user?.email}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
          <div className="px-4 py-2 text-sm text-gray-700 border-b">
            <div className="font-medium">{user?.name || '用户'}</div>
            <div className="text-gray-500">{user?.email}</div>
          </div>
          
          <Link
            href={`/${language}/profile`}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            个人资料
          </Link>
          
          <Link
            href={`/${language}/dashboard`}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            学习进度
          </Link>
          
          <Link
            href={`/${language}/projects`}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            我的项目
          </Link>
          
          <div className="border-t">
            <button
              onClick={() => {
                setIsOpen(false)
                signOut({ callbackUrl: `/${language}` })
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              退出登录
            </button>
          </div>
        </div>
      )}
    </div>
  )
}