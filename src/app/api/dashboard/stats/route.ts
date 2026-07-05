import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const stats = {
      totalDelegates: await prisma.delegate.count(),
      checkedInDelegates: await prisma.delegate.count({
        where: { checkedIn: true },
      }),
      totalChurches: await prisma.church.count(),
      totalAccommodations: await prisma.accommodation.count(),
      pendingApprovals: await prisma.delegate.count({
        where: { approvalStatus: "PENDING" },
      }),
      totalAnnouncements: await prisma.announcement.count(),
    };

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
