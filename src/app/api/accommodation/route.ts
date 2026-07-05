import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const accommodation = await prisma.accommodation.create({
      data: body,
    });

    return NextResponse.json({ accommodation }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create accommodation' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const accommodations = await prisma.accommodation.findMany({
      include: { rooms: true },
      take: 50,
    });

    return NextResponse.json({ accommodations }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch accommodations' }, { status: 500 });
  }
}