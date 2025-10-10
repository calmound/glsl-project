import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

serve(async (req) => {
  try {
    // 获取环境变量
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // 获取 JWT token
    const authHeader = req.headers.get('Authorization') || '';
    const jwt = authHeader.replace('Bearer ', '');
    
    if (!jwt) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 解析请求体
    const { formId } = await req.json();
    
    if (!formId) {
      return new Response(
        JSON.stringify({ error: 'Missing formId' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 创建 Supabase 客户端（使用 service_role 以便写入 user_form_status）
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });

    // 验证用户身份
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = user.id;

    // 读取用户提交的代码
    const { data: codeRow, error: codeError } = await supabase
      .from('user_form_code')
      .select('code_content')
      .eq('user_id', userId)
      .eq('form_id', formId)
      .maybeSingle();

    if (codeError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user code', details: codeError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const code = codeRow?.code_content ?? '';

    // TODO: 实现真实的判题逻辑
    // 当前为占位逻辑，始终返回失败
    // 后续可以根据实际需求实现 WebGL 编译验证或其他判题机制
    const passed = false; // 占位：实际判题逻辑
    const lastResult = { 
      message: passed ? 'Shader compiled successfully' : 'Placeholder validation - please implement actual judging logic',
      timestamp: new Date().toISOString(),
    };

    // 查询现有状态
    const { data: statusRow, error: statusFetchError } = await supabase
      .from('user_form_status')
      .select('*')
      .eq('user_id', userId)
      .eq('form_id', formId)
      .maybeSingle();

    if (statusFetchError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch status', details: statusFetchError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
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
    if (passed && !currentFirstPassedAt) {
      updateData.first_passed_at = new Date().toISOString();
    }
    if (passed) {
      updateData.is_passed = true;
    }

    // 使用 service_role 权限更新 user_form_status
    const { data: updatedStatus, error: updateError } = await supabase
      .from('user_form_status')
      .upsert(updateData, { onConflict: 'user_id,form_id' })
      .select()
      .single();

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update status', details: updateError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 返回结果
    return new Response(
      JSON.stringify({
        passed,
        attempts: updatedStatus.attempts,
        lastResult,
        firstPassedAt: updatedStatus.first_passed_at || null,
        isPassed: updatedStatus.is_passed,
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Edge Function error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
