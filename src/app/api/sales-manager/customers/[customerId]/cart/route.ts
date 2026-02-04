import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

interface RouteParams {
  params: Promise<{
    customerId: string
  }>
}

/**
 * GET /api/sales-manager/customers/[customerId]/cart
 * 영업매니저: 특정 고객의 장바구니 상세 조회
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await auth()
    const { customerId } = await params

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

    // 고객 정보 및 장바구니 조회
    const customer = await prisma.user.findUnique({
      where: { id: customerId },
      include: {
        cart: {
          include: {
            items: {
              include: {
                product: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!customer) {
      return NextResponse.json(
        { error: "고객을 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    // 고객이 일반회원 또는 병원인지 확인
    if (!["USER", "HOSPITAL"].includes(customer.role)) {
      return NextResponse.json(
        { error: "해당 고객의 장바구니를 조회할 수 없습니다" },
        { status: 403 }
      )
    }

    if (!customer.cart) {
      return NextResponse.json(
        { error: "장바구니가 비어있습니다" },
        { status: 404 }
      )
    }

    // 장바구니 항목별 가격 계산
    const cartItems = customer.cart.items.map((item) => {
      const originalPrice = item.product.price
      const discountedPrice = Math.round(
        originalPrice * (1 - item.product.discount / 100)
      )
      const itemTotal = discountedPrice * item.quantity

      return {
        id: item.id,
        product: {
          id: item.product.id,
          name: item.product.name,
          brand: item.product.brand,
          imageUrl: item.product.imageUrl,
          category: item.product.category.name,
          originalPrice,
          discount: item.product.discount,
          discountedPrice,
        },
        quantity: item.quantity,
        itemTotal,
      }
    })

    // 총액 계산
    const totalOriginalPrice = cartItems.reduce(
      (sum, item) => sum + item.product.originalPrice * item.quantity,
      0
    )
    const totalDiscountedPrice = cartItems.reduce(
      (sum, item) => sum + item.itemTotal,
      0
    )

    return NextResponse.json({
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        role: customer.role,
        phone: customer.phone,
        address: customer.address,
      },
      cart: {
        id: customer.cart.id,
        items: cartItems,
        itemCount: cartItems.length,
        totalOriginalPrice,
        totalDiscountedPrice,
        totalDiscount: totalOriginalPrice - totalDiscountedPrice,
      },
    })
  } catch (error) {
    console.error("장바구니 조회 실패:", error)
    return NextResponse.json(
      { error: "장바구니 조회에 실패했습니다" },
      { status: 500 }
    )
  }
}
