export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://www.shader-learn.com';
}

export const indexableRobots = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large' as const,
    'max-snippet': -1,
  },
};
