"use client";
import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  language?: 'zh' | 'en';
}

export default function LogoutButton({ language = 'zh' }: LogoutButtonProps) {
  const supabase = createBrowserSupabase();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleLogout = async () => {
    const confirmed = window.confirm(
      language === 'zh' 
        ? '确定要退出登录吗？' 
        : 'Are you sure you want to logout?'
    );
    
    if (!confirmed) return;

    try {
      setIsLoggingOut(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('登出错误:', error);
        alert(language === 'zh' ? '登出失败，请重试' : 'Logout failed, please try again');
        setIsLoggingOut(false);
        return;
      }
      
      // 成功登出后重定向到登录页并刷新
      router.push("/signin");
      router.refresh();
    } catch (err) {
      console.error('登出异常:', err);
      alert(language === 'zh' ? '登出出现异常，请重试' : 'Logout error, please try again');
      setIsLoggingOut(false);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isLoggingOut 
        ? (language === 'zh' ? '退出中...' : 'Logging out...') 
        : (language === 'zh' ? '退出登录' : 'Logout')
      }
    </button>
  );
}
