import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { generateAssistantResponse } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const responseText = await generateAssistantResponse(message);

    // Save chat message to database (best effort: the assistant still replies
    // when no database is configured yet)
    try {
      await prisma.chatMessage.create({
        data: {
          userId: decoded.userId,
          message,
          response: responseText,
          context: { timestamp: new Date().toISOString() },
        },
      });
    } catch (error) {
      console.warn('Could not persist chat message:', error);
    }

    return NextResponse.json({
      message,
      response: responseText,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
