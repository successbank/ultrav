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

    // 모든 견적서 조회
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        customer: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
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
    })

    return NextResponse.json(quotes)
  } catch (error) {
    console.error("견적서 목록 조회 에러:", error)
    return NextResponse.json(
      { error: "견적서 목록을 불러오는데 실패했습니다" },
      { status: 500 }
    )
  }
}
