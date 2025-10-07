import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// 单例实例
let supabaseInstance: SupabaseClient | null = null;

// ✅ 客户端（CSR）- 使用单例模式
export function createBrowserSupabase() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  supabaseInstance = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  return supabaseInstance;
}
