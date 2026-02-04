import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

interface RouteParams {
  params: Promise<{
    quoteId: string
  }>
}

/**
 * GET /api/sales-manager/quotes/[quoteId]
 * 영업매니저: 견적서 상세 조회
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    const { quoteId } = await params

    // 인증 확인
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "인증이 필요합니다" },
        { status: 401 }
      )
    }

    // 영업매니저 또는 관리자 권한 확인
    if (session.user.role !== "SALES_MANAGER" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "영업매니저 또는 관리자만 접근 가능합니다" },
        { status: 403 }
      )
    }

    // 견적서 조회
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        customer: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            phone: true,
            address: true,
          },
        },
        salesManager: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                brand: true,
                imageUrl: true,
                category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!quote) {
      return NextResponse.json(
        { error: "견적서를 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    // 영업매니저의 경우 본인이 생성한 견적서인지 확인 (관리자는 모든 견적서 조회 가능)
    if (session.user.role === "SALES_MANAGER" && quote.salesManagerId !== session.user.id) {
      return NextResponse.json(
        { error: "권한이 없습니다" },
        { status: 403 }
      )
    }

    return NextResponse.json(quote)
  } catch (error) {
    console.error("견적서 조회 실패:", error)
    return NextResponse.json(
      { error: "견적서 조회에 실패했습니다" },
      { status: 500 }
    )
  }
}
