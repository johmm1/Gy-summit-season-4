import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const delegates = await prisma.delegate.count();
    const registrationFee = 2000;
    const totalRevenue = delegates * registrationFee;
    const expenses = 500000; // Sample expenses
    const profit = totalRevenue - expenses;

    return NextResponse.json({
      report: {
        totalDelegates: delegates,
        registrationFee,
        totalRevenue,
        expenses,
        profit,
      },
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}