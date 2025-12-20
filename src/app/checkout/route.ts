import { Checkout } from '@creem_io/nextjs';

export const GET = Checkout({
  apiKey: process.env.CREEM_API_KEY || '',
  testMode: process.env.NEXT_PUBLIC_CREEM_TEST_MODE === 'true',
  defaultSuccessUrl: '/payment/success',
});
