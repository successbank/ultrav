import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * GET /api/admin/carousels/[id]
 * 관리자: 특정 캐러셀 조회
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    const { id } = await params

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

    const carousel = await prisma.carousel.findUnique({
      where: { id },
    })

    if (!carousel) {
      return NextResponse.json(
        { error: "캐러셀을 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    return NextResponse.json(carousel)
  } catch (error) {
    console.error("캐러셀 조회 에러:", error)
    return NextResponse.json(
      { error: "캐러셀 조회에 실패했습니다" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/carousels/[id]
 * 관리자: 캐러셀 수정
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    const { id } = await params

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

    const carousel = await prisma.carousel.update({
      where: { id },
      data: {
        title,
        subtitle,
        description,
        imageUrl,
        linkUrl,
        linkText,
        order,
        isActive,
      },
    })

    return NextResponse.json(carousel)
  } catch (error) {
    console.error("캐러셀 수정 에러:", error)
    return NextResponse.json(
      { error: "캐러셀 수정에 실패했습니다" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/carousels/[id]
 * 관리자: 캐러셀 삭제
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    const { id } = await params

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

    await prisma.carousel.delete({
      where: { id },
    })

    return NextResponse.json({ message: "캐러셀이 삭제되었습니다" })
  } catch (error) {
    console.error("캐러셀 삭제 에러:", error)
    return NextResponse.json(
      { error: "캐러셀 삭제에 실패했습니다" },
      { status: 500 }
    )
  }
}
