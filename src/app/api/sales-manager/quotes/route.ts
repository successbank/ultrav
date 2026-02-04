import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

/**
 * POST /api/sales-manager/quotes
 * 영업매니저: 견적서 생성
 */
export async function POST(request: Request) {
  try {
    const session = await auth()

    // 인증 확인
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "인증이 필요합니다" },
        { status: 401 }
      )
    }

    // 영업매니저 권한 확인
    if (session.user.role !== "SALES_MANAGER") {
      return NextResponse.json(
        { error: "영업매니저만 접근 가능합니다" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { customerId, items, validDays = 7, notes } = body

    // 입력 검증
    if (!customerId) {
      return NextResponse.json(
        { error: "고객 ID가 필요합니다" },
        { status: 400 }
      )
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "견적 항목이 필요합니다" },
        { status: 400 }
      )
    }

    // 고객 확인
    const customer = await prisma.user.findUnique({
      where: { id: customerId },
    })

    if (!customer) {
      return NextResponse.json(
        { error: "고객을 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    if (!["USER", "HOSPITAL"].includes(customer.role)) {
      return NextResponse.json(
        { error: "견적서를 생성할 수 없는 고객입니다" },
        { status: 403 }
      )
    }

    // 견적 번호 생성 (QT-YYYYMMDD-XXXX)
    const today = new Date()
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "")
    const count = await prisma.quote.count({
      where: {
        quoteNumber: {
          startsWith: `QT-${dateStr}-`,
        },
      },
    })
    const quoteNumber = `QT-${dateStr}-${String(count + 1).padStart(4, "0")}`

    // 견적 항목별 가격 계산 및 검증
    const quoteItemsData = []
    let totalOriginalAmount = 0
    let totalQuotedAmount = 0

    for (const item of items) {
      const { productId, quantity, quotedPrice } = item

      if (!productId || !quantity || quotedPrice === undefined) {
        return NextResponse.json(
          { error: "견적 항목 정보가 올바르지 않습니다" },
          { status: 400 }
        )
      }

      // 제품 정보 조회
      const product = await prisma.product.findUnique({
        where: { id: productId },
      })

      if (!product) {
        return NextResponse.json(
          { error: `제품을 찾을 수 없습니다: ${productId}` },
          { status: 404 }
        )
      }

      // 원가 계산 (할인 적용)
      const originalPrice = Math.round(
        product.price * (1 - product.discount / 100)
      )

      totalOriginalAmount += originalPrice * quantity
      totalQuotedAmount += quotedPrice * quantity

      quoteItemsData.push({
        productId,
        quantity,
        originalPrice,
        quotedPrice,
      })
    }

    // 유효기간 계산
    const validUntil = new Date()
    validUntil.setDate(validUntil.getDate() + validDays)

    // 견적서 생성
    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        customerId,
        salesManagerId: session.user.id,
        status: "SENT", // 생성 즉시 전송됨 상태로
        originalAmount: totalOriginalAmount,
        totalAmount: totalQuotedAmount,
        discountAmount: totalOriginalAmount - totalQuotedAmount,
        validUntil,
        notes,
        items: {
          create: quoteItemsData,
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
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
              },
            },
          },
        },
      },
    })

    return NextResponse.json(quote, { status: 201 })
  } catch (error) {
    console.error("견적서 생성 실패:", error)
    return NextResponse.json(
      { error: "견적서 생성에 실패했습니다" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/sales-manager/quotes
 * 영업매니저: 자신이 생성한 견적서 목록 조회
 */
export async function GET() {
  try {
    const session = await auth()

    // 인증 확인
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "인증이 필요합니다" },
        { status: 401 }
      )
    }

    // 영업매니저 권한 확인
    if (session.user.role !== "SALES_MANAGER") {
      return NextResponse.json(
        { error: "영업매니저만 접근 가능합니다" },
        { status: 403 }
      )
    }

    // 견적서 목록 조회
    const quotes = await prisma.quote.findMany({
      where: {
        salesManagerId: session.user.id,
      },
      include: {
        customer: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(quotes)
  } catch (error) {
    console.error("견적서 목록 조회 실패:", error)
    return NextResponse.json(
      { error: "견적서 목록 조회에 실패했습니다" },
      { status: 500 }
    )
  }
}
