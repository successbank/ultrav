import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

/**
 * GET /api/admin/carousels
 * 관리자: 모든 캐러셀 조회
 */
export async function GET() {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "인증이 필요합니다" },
        { status: 401 }
      )
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "관리자만 접근 가능합니다" },
        { status: 403 }
      )
    }

    const carousels = await prisma.carousel.findMany({
      orderBy: { order: "asc" },
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

/**
 * POST /api/admin/carousels
 * 관리자: 새 캐러셀 추가
 */
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "인증이 필요합니다" },
        { status: 401 }
      )
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "관리자만 접근 가능합니다" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, subtitle, description, imageUrl, linkUrl, linkText, order, isActive } = body

    // 필수 필드 검증
    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: "제목과 이미지는 필수입니다" },
        { status: 400 }
      )
    }

    const carousel = await prisma.carousel.create({
      data: {
        title,
        subtitle,
        description,
        imageUrl,
        linkUrl,
        linkText,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    })

    return NextResponse.json(carousel, { status: 201 })
  } catch (error) {
    console.error("캐러셀 생성 에러:", error)
    return NextResponse.json(
      { error: "캐러셀 생성에 실패했습니다" },
      { status: 500 }
    )
  }
}
