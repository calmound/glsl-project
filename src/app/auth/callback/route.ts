import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (code) {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data?.user) {
      // ✅ 登录成功时：同步/更新资料表
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.full_name ?? data.user.email?.split("@")[0],
        avatar_url: data.user.user_metadata?.avatar_url ?? null,
        last_login_at: new Date().toISOString()
      });

      // ✅ 跳转到首页（/）而不是 /app
      return NextResponse.redirect(new URL("/", origin));
    }
  }

  // 登录失败，跳转到登录页
  return NextResponse.redirect(new URL("/signin", origin));
}
