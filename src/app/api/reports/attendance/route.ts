import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const total = await prisma.delegate.count();
    const present = await prisma.attendance.count({ where: { status: 'PRESENT' } });
    const absent = total - present;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;

    const attendance = await prisma.attendance.findMany({
      include: { delegate: true },
      take: 100,
    });

    return NextResponse.json({
      report: { total, present, absent, attendanceRate: rate, attendance },
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}