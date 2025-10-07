import type { Metadata } from 'next'
import ContactLocalized, { generateMetadata as localizedMetadata } from '@/app/[locale]/contact/page'

export async function generateMetadata(): Promise<Metadata> {
  return localizedMetadata({ params: Promise.resolve({ locale: 'en' }) })
}

export default function ContactPage() {
  // 复用本地化页面，固定英文根路径 /contact
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return ContactLocalized({ params: Promise.resolve({ locale: 'en' }) })
}

