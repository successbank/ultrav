import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

// POST /api/admin/categories/[id]/move-products - 상품 일괄 이동
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 })
    }

    const { id: fromCategoryId } = await params
    const body = await request.json()
    const { targetCategoryId, productIds } = body

    if (!targetCategoryId) {
      return NextResponse.json(
        { error: "이동할 카테고리를 선택해주세요." },
        { status: 400 }
      )
    }

    // 원본 카테고리 확인
    const fromCategory = await prisma.category.findUnique({
      where: { id: fromCategoryId }
    })

    if (!fromCategory) {
      return NextResponse.json(
        { error: "원본 카테고리를 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 대상 카테고리 확인
    const targetCategory = await prisma.category.findUnique({
      where: { id: targetCategoryId }
    })

    if (!targetCategory) {
      return NextResponse.json(
        { error: "대상 카테고리를 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 같은 카테고리로 이동 방지
    if (fromCategoryId === targetCategoryId) {
      return NextResponse.json(
        { error: "같은 카테고리로는 이동할 수 없습니다." },
        { status: 400 }
      )
    }

    // 상품 이동
    let updateResult
    if (productIds && Array.isArray(productIds) && productIds.length > 0) {
      // 선택된 상품만 이동
      updateResult = await prisma.product.updateMany({
        where: {
          id: { in: productIds },
          categoryId: fromCategoryId
        },
        data: {
          categoryId: targetCategoryId
        }
      })
    } else {
      // 모든 상품 이동
      updateResult = await prisma.product.updateMany({
        where: {
          categoryId: fromCategoryId
        },
        data: {
          categoryId: targetCategoryId
        }
      })
    }

    return NextResponse.json({
      message: `${updateResult.count}개의 상품이 이동되었습니다.`,
      movedCount: updateResult.count,
      fromCategory: fromCategory.name,
      toCategory: targetCategory.name
    })
  } catch (error) {
    console.error("상품 이동 오류:", error)
    return NextResponse.json(
      { error: "상품 이동에 실패했습니다." },
      { status: 500 }
    )
  }
}
