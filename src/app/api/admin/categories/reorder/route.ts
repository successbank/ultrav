import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

// PUT /api/admin/categories/reorder - 카테고리 순서 일괄 변경
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 })
    }

    const body = await request.json()
    const { items } = body as { items: { id: string; sortOrder: number }[] }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "정렬할 항목이 필요합니다." },
        { status: 400 }
      )
    }

    // 트랜잭션으로 원자적 업데이트
    await prisma.$transaction(
      items.map((item) =>
        prisma.category.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder }
        })
      )
    )

    return NextResponse.json({ message: "순서가 변경되었습니다." })
  } catch (error) {
    console.error("카테고리 순서 변경 오류:", error)
    return NextResponse.json(
      { error: "카테고리 순서 변경에 실패했습니다." },
      { status: 500 }
    )
  }
}
