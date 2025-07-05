import { permanentRedirect } from 'next/navigation';

export default function RootPage() {
  // 直接永久重定向到英文版本
  // 这是最简单和最可靠的方法
  permanentRedirect('/en');
}
