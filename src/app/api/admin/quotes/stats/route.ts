import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "관리자만 접근 가능합니다" },
        { status: 403 }
      )
    }

    // 전체 통계
    const [totalQuotes, statusCounts, amountStats, salesManagerStats] = await Promise.all([
      // 총 견적서 수
      prisma.quote.count(),

      // 상태별 count
      prisma.quote.groupBy({
        by: ["status"],
        _count: true,
      }),

      // 금액 통계
      prisma.quote.aggregate({
        _sum: {
          totalAmount: true,
          discountAmount: true,
          originalAmount: true,
        },
        _avg: {
          totalAmount: true,
          discountAmount: true,
        },
      }),

      // 영업매니저별 통계
      prisma.quote.groupBy({
        by: ["salesManagerId"],
        _count: true,
        _sum: {
          totalAmount: true,
        },
      }),
    ])

    // 영업매니저 정보 가져오기
    const managerIds = salesManagerStats.map((s) => s.salesManagerId)
    const managers = await prisma.user.findMany({
      where: { id: { in: managerIds } },
      select: { id: true, name: true, email: true },
    })

    const managerMap = new Map(managers.map((m) => [m.id, m]))

    const salesManagerStatsWithInfo = salesManagerStats.map((stat) => ({
      manager: managerMap.get(stat.salesManagerId),
      quoteCount: stat._count,
      totalAmount: stat._sum.totalAmount || 0,
    }))

    // 상태별 카운트를 객체로 변환
    const statusCountsMap = statusCounts.reduce(
      (acc, curr) => {
        acc[curr.status] = curr._count
        return acc
      },
      {} as Record<string, number>
    )

    const stats = {
      total: totalQuotes,
      byStatus: {
        PENDING: statusCountsMap.PENDING || 0,
        SENT: statusCountsMap.SENT || 0,
        APPROVED: statusCountsMap.APPROVED || 0,
        REJECTED: statusCountsMap.REJECTED || 0,
        EXPIRED: statusCountsMap.EXPIRED || 0,
        ORDERED: statusCountsMap.ORDERED || 0,
      },
      amounts: {
        totalQuoted: amountStats._sum.totalAmount || 0,
        totalDiscount: amountStats._sum.discountAmount || 0,
        totalOriginal: amountStats._sum.originalAmount || 0,
        avgQuoted: Math.round(amountStats._avg.totalAmount || 0),
        avgDiscount: Math.round(amountStats._avg.discountAmount || 0),
      },
      bySalesManager: salesManagerStatsWithInfo,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("통계 조회 에러:", error)
    return NextResponse.json(
      { error: "통계를 불러오는데 실패했습니다" },
      { status: 500 }
    )
  }
}
