import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { generateOrderNumber, calculateDiscountedPrice } from "@/lib/utils"

// POST - 주문 생성
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "인증이 필요합니다" },
        { status: 401 }
      )
    }

    const { recipientName, recipientPhone, shippingAddr } = await request.json()

    if (!recipientName || !recipientPhone || !shippingAddr) {
      return NextResponse.json(
        { error: "받는 분 이름, 연락처, 배송 주소는 필수입니다" },
        { status: 400 }
      )
    }

    const order = await prisma.$transaction(async (tx) => {
      // 1) 장바구니 + items + product 조회
      const cart = await tx.cart.findUnique({
        where: { userId: session.user.id },
        include: {
          items: {
            include: { product: true },
          },
        },
      })

      if (!cart || cart.items.length === 0) {
        throw new Error("장바구니가 비어있습니다")
      }

      // 2) 각 아이템 검증
      for (const item of cart.items) {
        if (!item.product.isActive) {
          throw new Error(`"${item.product.name}" 상품은 판매가 종료되었습니다`)
        }
        if (item.product.stock < item.quantity) {
          throw new Error(
            `"${item.product.name}" 상품의 재고가 부족합니다 (재고: ${item.product.stock}개, 요청: ${item.quantity}개)`
          )
        }
      }

      // 3) 총금액 계산
      const totalAmount = cart.items.reduce((sum, item) => {
        const unitPrice = calculateDiscountedPrice(
          item.product.price,
          item.product.discount
        )
        return sum + unitPrice * item.quantity
      }, 0)

      // 4) Order + OrderItem 생성
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: session.user.id,
          status: "PENDING",
          totalAmount,
          recipientName,
          recipientPhone,
          shippingAddr,
          items: {
            create: cart.items.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
              price: calculateDiscountedPrice(
                item.product.price,
                item.product.discount
              ),
            })),
          },
        },
        include: {
          items: true,
        },
      })

      // 5) 재고 차감
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.product.id },
          data: { stock: { decrement: item.quantity } },
        })
      }

      // 6) 장바구니 비우기
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      })

      return newOrder
    })

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
      },
    })
  } catch (error) {
    console.error("주문 생성 실패:", error)

    const message =
      error instanceof Error ? error.message : "주문 생성에 실패했습니다"

    return NextResponse.json({ error: message }, { status: 400 })
  }
}
