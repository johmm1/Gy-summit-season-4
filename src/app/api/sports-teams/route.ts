import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { sport, ...data } = body;

    if (sport === 'FOOTBALL') {
      const team = await prisma.footballTeam.create({ data });
      return NextResponse.json({ team }, { status: 201 });
    } else if (sport === 'VOLLEYBALL') {
      const team = await prisma.volleyballTeam.create({ data });
      return NextResponse.json({ team }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid sport' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const teams = await prisma.footballTeam.findMany({ take: 50 });
    return NextResponse.json({ teams }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}