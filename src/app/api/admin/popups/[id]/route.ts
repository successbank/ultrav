import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * GET /api/admin/popups/[id]
 * 관리자: 특정 레이어 팝업 조회
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

    const popup = await prisma.layerPopup.findUnique({
      where: { id },
    })

    if (!popup) {
      return NextResponse.json(
        { error: "레이어 팝업을 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    return NextResponse.json(popup)
  } catch (error) {
    console.error("레이어 팝업 조회 에러:", error)
    return NextResponse.json(
      { error: "레이어 팝업 조회에 실패했습니다" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/popups/[id]
 * 관리자: 레이어 팝업 수정
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
    const { title, contentType, imageUrl, content, linkUrl, startDate, endDate, order, isActive, width, height } = body

    const type = contentType || "image"

    if (!title) {
      return NextResponse.json(
        { error: "제목은 필수입니다" },
        { status: 400 }
      )
    }

    if (type === "image" && !imageUrl) {
      return NextResponse.json(
        { error: "이미지는 필수입니다" },
        { status: 400 }
      )
    }

    if (type === "html" && !content) {
      return NextResponse.json(
        { error: "HTML 콘텐츠는 필수입니다" },
        { status: 400 }
      )
    }

    const popup = await prisma.layerPopup.update({
      where: { id },
      data: {
        title,
        contentType: type,
        imageUrl: imageUrl || "",
        content: content || null,
        linkUrl: linkUrl || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        order,
        isActive,
        width: width || 480,
        height: height || 600,
      },
    })

    return NextResponse.json(popup)
  } catch (error) {
    console.error("레이어 팝업 수정 에러:", error)
    return NextResponse.json(
      { error: "레이어 팝업 수정에 실패했습니다" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/popups/[id]
 * 관리자: 레이어 팝업 삭제
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

    await prisma.layerPopup.delete({
      where: { id },
    })

    return NextResponse.json({ message: "레이어 팝업이 삭제되었습니다" })
  } catch (error) {
    console.error("레이어 팝업 삭제 에러:", error)
    return NextResponse.json(
      { error: "레이어 팝업 삭제에 실패했습니다" },
      { status: 500 }
    )
  }
}
