import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

/**
 * GET /api/carousels
 * 공개: 활성화된 캐러셀 목록 조회 (홈페이지용)
 */
export async function GET() {
  try {
    const carousels = await prisma.carousel.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: "asc",
      },
    })

    return NextResponse.json(carousels)
  } catch (error) {
    console.error("캐러셀 조회 에러:", error)
    return NextResponse.json(
      { error: "캐러셀을 불러오는데 실패했습니다" },
      { status: 500 }
    )
  }
}
