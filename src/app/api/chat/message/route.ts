import { NextRequest, NextResponse } from 'next/server';
import { prisma, isDatabaseAvailable } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

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

    // In production, call OpenAI API here
    // For now, return a mock response
    const mockResponse = `I understand you're asking about: "${message}". 
As your CloudImage Assistant, I'm here to help with image organization, enhancement, and cloud storage strategies.

Here are some recommendations:
1. **Organize by Date**: Create folders by year/month for easy navigation
2. **Use Descriptive Names**: Name files with content and date (e.g., "vacation-2024-08-12.jpg")
3. **Leverage Metadata**: Use tags for quick filtering and search
4. **Regular Backups**: Ensure important images are always backed up

Would you like specific advice on any of these areas?`;

    // Save chat message to database (if available)
    if (isDatabaseAvailable()) {
      await prisma!.chatMessage.create({
        data: {
          userId: decoded.userId,
          message,
          response: mockResponse,
          context: { timestamp: new Date().toISOString() },
        },
      });
    }

    return NextResponse.json({
      message,
      response: mockResponse,
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
