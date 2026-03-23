import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/openai';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { messages, courseContext } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Add system message with course context if provided
    const systemMessages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a helpful AI tutor for LearnKart, an online learning platform. You help students understand concepts, answer questions, and provide guidance. Be encouraging, clear, and educational in your responses.${
          courseContext ? ` Current course context: ${courseContext}` : ''
        }`
      }
    ];

    const aiMessages = [...systemMessages, ...messages];
    const response = await generateAIResponse(aiMessages);

    return NextResponse.json({ 
      message: response,
      success: true 
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    );
  }
}