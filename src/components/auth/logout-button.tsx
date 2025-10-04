"use client";
import { createBrowserSupabase } from "@/lib/supabase";

export default function LogoutButton() {
  const supabase = createBrowserSupabase();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/signin";
  };

  return (
    <button 
      onClick={handleLogout}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >
      退出登录
    </button>
  );
}
