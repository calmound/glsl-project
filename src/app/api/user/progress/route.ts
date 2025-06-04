import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 获取用户ID
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 获取学习进度
    const { data: progress, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching progress:', error)
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
    }

    return NextResponse.json({ progress })
  } catch (error) {
    console.error('Error in progress API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { tutorial_id, category, status, completion_percentage } = body

    // 获取用户ID
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 更新或创建学习进度
    const { data: progress, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        tutorial_id,
        category,
        status,
        completion_percentage,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error updating progress:', error)
      return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
    }

    return NextResponse.json({ progress })
  } catch (error) {
    console.error('Error in progress update API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}