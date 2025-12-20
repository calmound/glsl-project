'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabase } from '@/lib/supabase';
import Link from 'next/link';
import MainLayout from '@/components/layout/main-layout';

export default function TestSupabasePage() {
  const [status, setStatus] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function testConnection() {
      const supabase = createBrowserSupabase();
      const results: any = {};

      try {
        // 1. 测试客户端创建
        console.log('✅ Supabase 客户端已创建');
        results.clientCreated = true;

        // 2. 测试认证状态
        console.log('🔐 检查认证状态...');
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        results.authCheck = {
          success: !authError,
          user: user ? { id: user.id, email: user.email } : null,
          error: authError?.message
        };
        console.log('认证结果:', results.authCheck);

        // 3. 测试数据库连接（简单查询）
        console.log('🗄️ 测试数据库查询...');
        const { error: dbError } = await supabase
          .from('user_form_code')
          .select('*', { count: 'exact', head: true });
        
        results.dbConnection = {
          success: !dbError,
          error: dbError?.message,
          hint: dbError?.hint,
          details: dbError?.details
        };
        console.log('数据库查询结果:', results.dbConnection);

        // 4. 如果已登录，测试插入
        if (user) {
          console.log('💾 测试数据保存...');
          const testData = {
            user_id: user.id,
            form_id: 'test-connection',
            code_content: 'precision mediump float;\nvoid main() { gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); }',
            language: 'glsl',
            is_draft: true
          };

          const { error: insertError } = await supabase
            .from('user_form_code')
            .upsert(testData, { onConflict: 'user_id,form_id' });

          results.saveTest = {
            success: !insertError,
            error: insertError?.message,
            hint: insertError?.hint
          };
          console.log('保存测试结果:', results.saveTest);
        }

        setStatus(results);
      } catch (error: any) {
        console.error('❌ 测试失败:', error);
        results.exception = {
          message: error.message,
          stack: error.stack
        };
        setStatus(results);
      } finally {
        setLoading(false);
      }
    }

    testConnection();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>测试 Supabase 连接...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Supabase 连接测试</h1>

        {/* 客户端创建 */}
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            {status.clientCreated ? '✅' : '❌'} 客户端创建
          </h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {JSON.stringify({ created: status.clientCreated }, null, 2)}
          </pre>
        </div>

        {/* 认证状态 */}
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            {status.authCheck?.success ? '✅' : '❌'} 认证状态
          </h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {JSON.stringify(status.authCheck, null, 2)}
          </pre>
          {!status.authCheck?.user && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800">
                ⚠️ 未登录。请先<Link href="/signin" className="underline text-blue-600">登录</Link>
              </p>
            </div>
          )}
        </div>

        {/* 数据库连接 */}
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            {status.dbConnection?.success ? '✅' : '❌'} 数据库连接
          </h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {JSON.stringify(status.dbConnection, null, 2)}
          </pre>
        </div>

        {/* 保存测试 */}
        {status.saveTest && (
          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              {status.saveTest?.success ? '✅' : '❌'} 数据保存测试
            </h2>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
              {JSON.stringify(status.saveTest, null, 2)}
            </pre>
          </div>
        )}

        {/* 异常 */}
        {status.exception && (
          <div className="bg-white rounded-lg shadow p-6 mb-4 border-2 border-red-500">
            <h2 className="text-xl font-semibold mb-4 text-red-600">❌ 异常</h2>
            <pre className="bg-red-50 p-4 rounded overflow-x-auto text-red-800">
              {JSON.stringify(status.exception, null, 2)}
            </pre>
          </div>
        )}

        {/* 建议 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold mb-2">💡 下一步</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>如果认证失败，请先<Link href="/signin" className="underline text-blue-600">登录</Link></li>
            <li>打开浏览器控制台查看详细日志</li>
            <li>检查 Network 标签查看请求详情</li>
            <li>如果数据库连接失败，检查 RLS 策略</li>
          </ul>
        </div>
        </div>
      </div>
    </MainLayout>
  );
}
