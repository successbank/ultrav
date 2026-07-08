import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

/**
 * GET /api/admin/popups
 * 관리자: 모든 레이어 팝업 조회
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

    const popups = await prisma.layerPopup.findMany({
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

/**
 * POST /api/admin/popups
 * 관리자: 새 레이어 팝업 추가
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

    const popup = await prisma.layerPopup.create({
      data: {
        title,
        contentType: type,
        imageUrl: imageUrl || "",
        content: content || null,
        linkUrl: linkUrl || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        width: width || 480,
        height: height || 600,
      },
    })

    return NextResponse.json(popup, { status: 201 })
  } catch (error) {
    console.error("레이어 팝업 생성 에러:", error)
    return NextResponse.json(
      { error: "레이어 팝업 생성에 실패했습니다" },
      { status: 500 }
    )
  }
}
