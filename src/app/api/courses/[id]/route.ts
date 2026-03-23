import { NextRequest, NextResponse } from 'next/server';
import { getCourseById, getLessonsByCourseId, isUserEnrolled } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = parseInt(params.id);
    
    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      );
    }

    const course = getCourseById(courseId);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    const lessons = getLessonsByCourseId(courseId);
    
    // Check if user is enrolled (if authenticated)
    const user = getUserFromRequest(request);
    let isEnrolled = false;
    
    if (user) {
      isEnrolled = isUserEnrolled(user.userId, courseId);
    }

    return NextResponse.json({
      course: {
        ...course,
        lessons,
        isEnrolled
      }
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}