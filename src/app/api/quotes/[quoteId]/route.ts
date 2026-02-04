import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

interface RouteParams {
  params: Promise<{
    quoteId: string
  }>
}

/**
 * GET /api/quotes/[quoteId]
 * 고객: 견적서 상세 조회
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
            phone: true,
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

    // 본인의 견적서인지 확인
    if (quote.customerId !== session.user.id) {
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

/**
 * PATCH /api/quotes/[quoteId]
 * 고객: 견적서 승인/거부
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    const { quoteId } = await params
    const body = await request.json()
    const { action } = body // "approve" or "reject"

    // 인증 확인
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "인증이 필요합니다" },
        { status: 401 }
      )
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "올바른 액션이 아닙니다" },
        { status: 400 }
      )
    }

    // 견적서 조회
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
    })

    if (!quote) {
      return NextResponse.json(
        { error: "견적서를 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    // 권한 확인
    if (quote.customerId !== session.user.id) {
      return NextResponse.json(
        { error: "권한이 없습니다" },
        { status: 403 }
      )
    }

    // 상태 확인 (SENT 상태에서만 승인/거부 가능)
    if (quote.status !== "SENT") {
      return NextResponse.json(
        { error: "이미 처리된 견적서입니다" },
        { status: 400 }
      )
    }

    // 유효기간 확인
    if (new Date() > quote.validUntil) {
      // 만료된 경우
      await prisma.quote.update({
        where: { id: quoteId },
        data: { status: "EXPIRED" },
      })
      return NextResponse.json(
        { error: "견적서가 만료되었습니다" },
        { status: 400 }
      )
    }

    // 상태 업데이트
    const updatedQuote = await prisma.quote.update({
      where: { id: quoteId },
      data: {
        status: action === "approve" ? "APPROVED" : "REJECTED",
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json(updatedQuote)
  } catch (error) {
    console.error("견적서 상태 변경 실패:", error)
    return NextResponse.json(
      { error: "견적서 상태 변경에 실패했습니다" },
      { status: 500 }
    )
  }
}
