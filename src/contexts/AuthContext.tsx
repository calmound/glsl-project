'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { createBrowserSupabase } from '../lib/supabase';

// 订阅权限类型
interface Entitlement {
  id: string;
  status: 'active' | 'expired' | 'canceled' | 'pending';
  plan_type: string;
  start_date: string;
  end_date: string;
  creem_customer_id?: string | null;
  creem_subscription_id?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  entitlement: Entitlement | null;
  hasActiveSubscription: boolean;
  refreshUser: () => Promise<void>;
  refreshEntitlement: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  entitlement: null,
  hasActiveSubscription: false,
  refreshUser: async () => {},
  refreshEntitlement: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const supabase = createBrowserSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    }
  }, []);

  const refreshEntitlement = useCallback(async () => {
    if (!user) {
      setEntitlement(null);
      return;
    }

    try {
      const supabase = createBrowserSupabase();
      const { data, error } = await supabase
        .from('entitlements')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gt('end_date', new Date().toISOString())
        .maybeSingle();

      if (data && !error) {
        setEntitlement(data);
        console.log('✅ [AuthContext] 用户订阅状态:', {
          plan: data.plan_type,
          status: data.status,
          endDate: data.end_date,
        });
      } else {
        setEntitlement(null);
        console.log('ℹ️ [AuthContext] 用户无有效订阅');
      }
    } catch (error) {
      console.error('❌ [AuthContext] 获取订阅状态失败:', error);
      setEntitlement(null);
    }
  }, [user]);

  // 计算是否有有效订阅
  const hasActiveSubscription = useMemo(() => {
    if (!entitlement) return false;
    return (
      entitlement.status === 'active' &&
      new Date(entitlement.end_date) > new Date()
    );
  }, [entitlement]);

  useEffect(() => {
    const supabase = createBrowserSupabase();

    // 初始化时获取用户信息
    refreshUser().finally(() => setLoading(false));

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshUser]);

  // 当用户状态变化时，刷新订阅信息
  useEffect(() => {
    refreshEntitlement();
  }, [user, refreshEntitlement]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        entitlement,
        hasActiveSubscription,
        refreshUser,
        refreshEntitlement,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
