import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { feedbackType, email, content } = body;

    // Validate required fields
    if (!feedbackType || !content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate feedback type
    const validTypes = ['suggestion', 'bug', 'feature', 'other'];
    if (!validTypes.includes(feedbackType)) {
      return NextResponse.json(
        { error: 'Invalid feedback type' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await createServerSupabase();

    // Get current user (if logged in)
    const { data: { user } } = await supabase.auth.getUser();

    // Insert feedback
    const { data, error } = await supabase
      .from('feedback')
      .insert([
        {
          user_id: user?.id || null,
          feedback_type: feedbackType,
          email: email || null,
          content: content.trim(),
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Failed to insert feedback:', error);
      return NextResponse.json(
        { error: 'Failed to submit feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Feedback submitted successfully',
        data
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in feedback API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
