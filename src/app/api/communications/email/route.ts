import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { to, subject, content } = body;

    // In production, integrate with Resend or SendGrid
    console.log(`Email sent to ${to}: ${subject}`);

    return NextResponse.json({
      message: 'Email sent successfully',
      email: { to, subject },
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}