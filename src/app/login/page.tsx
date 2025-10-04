import type { Metadata } from 'next'
import LoginClient from './login-client'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Login with Google to access your account.',
}

export default function LoginPage() {
  return <LoginClient />
}

