import { NextRequest, NextResponse } from 'next/server';
import { generateQuiz } from '@/lib/openai';
import { getLessonById, getLessonsByCourseId } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { lessonId, courseId, numQuestions = 5 } = await request.json();

    let lessonContent = '';

    if (lessonId) {
      const lesson = getLessonById(lessonId);
      if (!lesson) {
        return NextResponse.json(
          { error: 'Lesson not found' },
          { status: 404 }
        );
      }
      lessonContent = lesson.content;
    } else if (courseId) {
      const lessons = getLessonsByCourseId(courseId);
      if (lessons.length === 0) {
        return NextResponse.json(
          { error: 'No lessons found for this course' },
          { status: 404 }
        );
      }
      lessonContent = lessons.map(l => l.content).join('\n\n');
    } else {
      return NextResponse.json(
        { error: 'Either lessonId or courseId is required' },
        { status: 400 }
      );
    }

    const questions = await generateQuiz(lessonContent, numQuestions);

    return NextResponse.json({
      questions,
      success: true
    });
  } catch (error) {
    console.error('Quiz generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}