import { Metadata } from 'next';
import PaymentSuccessClient from '../../[locale]/payment/success/success-client';

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Payment Success - Shader Learn',
    description: 'Your subscription is now active. Start exploring all premium tutorials!',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const { session_id } = await searchParams;

  return <PaymentSuccessClient locale="en" sessionId={session_id} />;
}
