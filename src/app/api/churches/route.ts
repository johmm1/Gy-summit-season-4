import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const church = await prisma.church.create({
      data: body,
    });

    return NextResponse.json({ message: 'Church created', church }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create church' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const churches = await prisma.church.findMany({ take: 100 });
    return NextResponse.json({ churches }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch churches' }, { status: 500 });
  }
}