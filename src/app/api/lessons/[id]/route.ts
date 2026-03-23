import { NextRequest, NextResponse } from 'next/server';
import { getLessonById, markLessonComplete } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lessonId = parseInt(params.id);
    
    if (isNaN(lessonId)) {
      return NextResponse.json(
        { error: 'Invalid lesson ID' },
        { status: 400 }
      );
    }

    const lesson = getLessonById(lessonId);
    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ lesson });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const lessonId = parseInt(params.id);
    
    if (isNaN(lessonId)) {
      return NextResponse.json(
        { error: 'Invalid lesson ID' },
        { status: 400 }
      );
    }

    const success = markLessonComplete(user.userId, lessonId);
    
    if (success) {
      return NextResponse.json({ success: true, message: 'Lesson marked as complete' });
    } else {
      return NextResponse.json(
        { error: 'Lesson already completed or error occurred' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error completing lesson:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}