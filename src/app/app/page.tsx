import { createServerSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/logout-button";
import Link from "next/link";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Dashboard() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">欢迎回来 👋</h1>
                <p className="text-gray-600 mt-1">管理你的 GLSL 项目和学习进度</p>
              </div>
              <LogoutButton />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 mb-2">用户信息</h3>
                <p className="text-blue-700">用户：{profile?.name ?? user.email}</p>
                <p className="text-blue-700">邮箱：{user.email}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-900 mb-2">当前计划</h3>
                <p className="text-green-700">计划：{profile?.plan ?? 'free'}</p>
                <p className="text-green-700">角色：{profile?.role ?? 'user'}</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-purple-900 mb-2">最近活动</h3>
                <p className="text-purple-700">
                  最后登录：{profile?.last_login_at ? 
                    new Date(profile.last_login_at).toLocaleString('zh-CN') : 
                    '首次登录'
                  }
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">快速导航</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/learn" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <h3 className="font-medium text-gray-900">学习教程</h3>
                  <p className="text-gray-600 text-sm mt-1">开始学习 GLSL 基础知识</p>
                </Link>
                <Link href="/examples" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <h3 className="font-medium text-gray-900">示例代码</h3>
                  <p className="text-gray-600 text-sm mt-1">浏览精选的 GLSL 示例</p>
                </Link>
                <Link href="/glslify-guide" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <h3 className="font-medium text-gray-900">Glslify 指南</h3>
                  <p className="text-gray-600 text-sm mt-1">了解模块化 GLSL 开发</p>
                </Link>
                <Link href="/about" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <h3 className="font-medium text-gray-900">关于项目</h3>
                  <p className="text-gray-600 text-sm mt-1">了解更多项目信息</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
