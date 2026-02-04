import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

/**
 * GET /api/sales-manager/customers
 * 영업매니저: 고객 목록 조회 (장바구니가 있는 사용자만)
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

    // 장바구니가 있는 고객 목록 조회
    const customers = await prisma.user.findMany({
      where: {
        role: {
          in: ["USER", "HOSPITAL"], // 일반회원과 병원만
        },
        cart: {
          isNot: null, // 장바구니가 있는 사용자만
        },
      },
      include: {
        cart: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
        _count: {
          select: {
            orders: true,
            quotesAsCustomer: true, // 받은 견적서 수
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    // 고객별 장바구니 총액 계산
    const customersWithTotal = customers.map((customer) => {
      let cartTotal = 0
      let cartItemCount = 0

      if (customer.cart && customer.cart.items) {
        customer.cart.items.forEach((item) => {
          const discountedPrice =
            item.product.price * (1 - item.product.discount / 100)
          cartTotal += discountedPrice * item.quantity
          cartItemCount += item.quantity
        })
      }

      return {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        role: customer.role,
        phone: customer.phone,
        cartItemCount,
        cartTotal: Math.round(cartTotal),
        orderCount: customer._count.orders,
        quoteCount: customer._count.quotesAsCustomer,
        lastActivity: customer.updatedAt,
      }
    })

    return NextResponse.json(customersWithTotal)
  } catch (error) {
    console.error("고객 목록 조회 실패:", error)
    return NextResponse.json(
      { error: "고객 목록 조회에 실패했습니다" },
      { status: 500 }
    )
  }
}
