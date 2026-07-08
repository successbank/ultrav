import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { OrderStatus } from "@prisma/client"

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

const TERMINAL_STATUSES: OrderStatus[] = ["CANCELLED", "REFUNDED"]
const RESTORE_STOCK_STATUSES: OrderStatus[] = ["CANCELLED", "REFUNDED"]

// GET - 주문 상세 조회
export async function GET(request: Request, context: RouteContext) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "권한이 없습니다" },
        { status: 403 }
      )
    }

    const { id } = await context.params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
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
                stock: true,
              },
            },
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: "주문을 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("주문 상세 조회 실패:", error)
    return NextResponse.json(
      { error: "주문 조회에 실패했습니다" },
      { status: 500 }
    )
  }
}

// PATCH - 주문 상태 변경
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "권한이 없습니다" },
        { status: 403 }
      )
    }

    const { id } = await context.params
    const { status } = await request.json()

    // OrderStatus enum 유효성 검사
    const validStatuses = Object.values(OrderStatus)
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `유효하지 않은 상태입니다. 가능한 상태: ${validStatuses.join(", ")}` },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: "주문을 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    // 취소/환불 상태의 주문은 변경 불가
    if (TERMINAL_STATUSES.includes(order.status)) {
      return NextResponse.json(
        { error: "취소 또는 환불된 주문은 상태를 변경할 수 없습니다" },
        { status: 400 }
      )
    }

    // 취소/환불로 변경 시 재고 복원
    if (RESTORE_STOCK_STATUSES.includes(status as OrderStatus)) {
      await prisma.$transaction(async (tx) => {
        // 재고 복원
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          })
        }

        // 주문 상태 변경
        await tx.order.update({
          where: { id },
          data: { status: status as OrderStatus },
        })
      })
    } else {
      // 일반 상태 변경
      await prisma.order.update({
        where: { id },
        data: { status: status as OrderStatus },
      })
    }

    const updatedOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        items: {
          include: {
            product: {
              select: { id: true, name: true, brand: true, imageUrl: true, stock: true },
            },
          },
        },
      },
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error("주문 상태 변경 실패:", error)
    return NextResponse.json(
      { error: "주문 상태 변경에 실패했습니다" },
      { status: 500 }
    )
  }
}
