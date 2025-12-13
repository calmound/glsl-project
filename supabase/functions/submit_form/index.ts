import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

// CORS 响应头
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // 获取环境变量
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // 获取 JWT token
    const authHeader = req.headers.get('Authorization') || '';
    const jwt = authHeader.replace('Bearer ', '');

    if (!jwt) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 解析请求体
    const { formId, passed } = await req.json();

    if (!formId) {
      return new Response(
        JSON.stringify({ error: 'Missing formId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // passed 参数由前端验证后传递，默认为 false
    const isPassed = passed === true;

    // 步骤1: 使用 anon key 验证用户的 JWT token
    const authClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await authClient.auth.getUser(jwt);

    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({
          error: 'Unauthorized',
          details: authError?.message || 'Invalid or expired token'
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = user.id;

    // 步骤2: 创建 service_role 客户端用于特权数据库操作
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // 读取用户提交的代码
    const { data: codeRow, error: codeError } = await adminClient
      .from('user_form_code')
      .select('code_content')
      .eq('user_id', userId)
      .eq('form_id', formId)
      .maybeSingle();

    if (codeError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user code', details: codeError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const code = codeRow?.code_content ?? '';

    // 基本的代码验证：确保代码非空
    if (!code || code.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'No code submitted for this form' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 使用前端传递的验证结果
    // 前端已经进行了 WebGL 编译验证和渲染结果比较
    const lastResult = {
      message: isPassed ? 'Shader compiled successfully and rendering is correct' : 'Shader validation failed',
      timestamp: new Date().toISOString(),
      validatedBy: 'client-webgl-renderer'
    };

    // 查询现有状态
    const { data: statusRow, error: statusFetchError } = await adminClient
      .from('user_form_status')
      .select('*')
      .eq('user_id', userId)
      .eq('form_id', formId)
      .maybeSingle();

    if (statusFetchError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch status', details: statusFetchError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const currentAttempts = statusRow?.attempts ?? 0;
    const currentFirstPassedAt = statusRow?.first_passed_at;

    // 准备更新数据
    const updateData: any = {
      user_id: userId,
      form_id: formId,
      has_submitted: true,
      attempts: currentAttempts + 1,
      last_submitted_at: new Date().toISOString(),
      last_result: lastResult,
    };

    // 仅在首次通过时写入 first_passed_at，且 is_passed 只能设为 true，不回退
    if (isPassed && !currentFirstPassedAt) {
      updateData.first_passed_at = new Date().toISOString();
    }
    if (isPassed) {
      updateData.is_passed = true;
    }

    // 使用 service_role 权限更新 user_form_status
    const { data: updatedStatus, error: updateError } = await adminClient
      .from('user_form_status')
      .upsert(updateData, { onConflict: 'user_id,form_id' })
      .select()
      .single();

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update status', details: updateError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 返回结果
    return new Response(
      JSON.stringify({
        passed: isPassed,
        attempts: updatedStatus.attempts,
        lastResult,
        firstPassedAt: updatedStatus.first_passed_at || null,
        isPassed: updatedStatus.is_passed,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Edge Function error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
