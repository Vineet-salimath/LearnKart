import { NextRequest, NextResponse } from 'next/server';
import { getRecommendations } from '@/lib/openai';
import { getUserEnrollments, getAllCourses } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userProgress = getUserEnrollments(user.userId);
    const allCourses = getAllCourses();

    const recommendations = await getRecommendations(userProgress, allCourses);

    return NextResponse.json({
      recommendations,
      success: true
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}