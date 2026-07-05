import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { phone, message } = body;

    // In production, integrate with Africa's Talking
    console.log(`SMS sent to ${phone}: ${message}`);

    return NextResponse.json({
      message: 'SMS sent successfully',
      sms: { phone, message },
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send SMS' }, { status: 500 });
  }
}