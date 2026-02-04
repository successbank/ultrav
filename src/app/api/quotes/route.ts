import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

/**
 * GET /api/quotes
 * 고객: 자신에게 발행된 견적서 목록 조회
 */
export async function GET() {
  try {
    const session = await auth()

    // 인증 확인
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "인증이 필요합니다" },
        { status: 401 }
      )
    }

    // 견적서 목록 조회 (자신이 고객인 것만)
    const quotes = await prisma.quote.findMany({
      where: {
        customerId: session.user.id,
      },
      include: {
        salesManager: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(quotes)
  } catch (error) {
    console.error("견적서 목록 조회 실패:", error)
    return NextResponse.json(
      { error: "견적서 목록 조회에 실패했습니다" },
      { status: 500 }
    )
  }
}
