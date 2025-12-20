import type { Metadata } from 'next';
import Link from 'next/link';
import MainLayout from '@/components/layout/main-layout';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Login with Google to access your account.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <MainLayout>
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-4 p-8 bg-white rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Sign in</h1>
          <p className="text-gray-600">Please use the main sign-in page.</p>
          <Link
            href="/signin"
            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-black text-white hover:opacity-90"
          >
            Go to /signin
          </Link>
        </div>
      </main>
    </MainLayout>
  );
}
