import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

/**
 * GET /api/popups
 * 공개: 활성화 + 스케줄 범위 내 팝업 조회 (홈페이지용)
 */
export async function GET() {
  try {
    const now = new Date()

    const popups = await prisma.layerPopup.findMany({
      where: {
        isActive: true,
        OR: [{ startDate: null }, { startDate: { lte: now } }],
        AND: [{ OR: [{ endDate: null }, { endDate: { gte: now } }] }],
      },
      orderBy: { order: "asc" },
    })

    return NextResponse.json(popups)
  } catch (error) {
    console.error("레이어 팝업 조회 에러:", error)
    return NextResponse.json(
      { error: "레이어 팝업을 불러오는데 실패했습니다" },
      { status: 500 }
    )
  }
}
