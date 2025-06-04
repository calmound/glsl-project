'use client'

import { createContext, useContext, ReactNode } from 'react'
import { SessionProvider, useSession } from 'next-auth/react'
import { Session } from 'next-auth'

interface AuthContextType {
  session: Session | null
  status: 'loading' | 'authenticated' | 'unauthenticated'
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextContent>{children}</AuthContextContent>
    </SessionProvider>
  )
}

function AuthContextContent({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()

  return (
    <AuthContext.Provider value={{ session, status }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}