import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET - 장바구니 조회
export async function GET() {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "인증이 필요합니다" },
        { status: 401 }
      )
    }

    // 사용자의 장바구니 가져오기 (없으면 생성)
    let cart = await prisma.cart.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // 장바구니가 없으면 새로 생성
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.user.id,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })
    }

    return NextResponse.json(cart)
  } catch (error) {
    console.error("장바구니 조회 실패:", error)
    return NextResponse.json(
      { error: "장바구니 조회에 실패했습니다" },
      { status: 500 }
    )
  }
}

// POST - 장바구니에 상품 추가
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "인증이 필요합니다" },
        { status: 401 }
      )
    }

    const { productId, quantity = 1 } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: "상품 ID가 필요합니다" },
        { status: 400 }
      )
    }

    if (quantity < 1) {
      return NextResponse.json(
        { error: "수량은 1개 이상이어야 합니다" },
        { status: 400 }
      )
    }

    // 상품 존재 여부 및 재고 확인
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json(
        { error: "상품을 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    if (!product.isActive) {
      return NextResponse.json(
        { error: "판매가 종료된 상품입니다" },
        { status: 400 }
      )
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: "재고가 부족합니다" },
        { status: 400 }
      )
    }

    // 사용자의 장바구니 가져오기 또는 생성
    let cart = await prisma.cart.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.user.id,
        },
      })
    }

    // 이미 장바구니에 있는 상품인지 확인
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    })

    let cartItem

    if (existingItem) {
      // 기존 상품의 수량 증가
      const newQuantity = existingItem.quantity + quantity

      if (product.stock < newQuantity) {
        return NextResponse.json(
          { error: "재고가 부족합니다" },
          { status: 400 }
        )
      }

      cartItem = await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: newQuantity,
        },
        include: {
          product: true,
        },
      })
    } else {
      // 새 상품 추가
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
        include: {
          product: true,
        },
      })
    }

    return NextResponse.json(cartItem, { status: 201 })
  } catch (error) {
    console.error("장바구니 추가 실패:", error)
    return NextResponse.json(
      { error: "장바구니 추가에 실패했습니다" },
      { status: 500 }
    )
  }
}

// PUT - 장바구니 상품 수량 변경
export async function PUT(request: Request) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "인증이 필요합니다" },
        { status: 401 }
      )
    }

    const { cartItemId, quantity } = await request.json()

    if (!cartItemId) {
      return NextResponse.json(
        { error: "장바구니 항목 ID가 필요합니다" },
        { status: 400 }
      )
    }

    if (quantity < 1) {
      return NextResponse.json(
        { error: "수량은 1개 이상이어야 합니다" },
        { status: 400 }
      )
    }

    // 장바구니 항목 확인
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true,
        product: true,
      },
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: "장바구니 항목을 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    // 소유권 확인
    if (cartItem.cart.userId !== session.user.id) {
      return NextResponse.json(
        { error: "권한이 없습니다" },
        { status: 403 }
      )
    }

    // 재고 확인
    if (cartItem.product.stock < quantity) {
      return NextResponse.json(
        { error: "재고가 부족합니다" },
        { status: 400 }
      )
    }

    // 수량 업데이트
    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        product: true,
      },
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("장바구니 수량 변경 실패:", error)
    return NextResponse.json(
      { error: "장바구니 수량 변경에 실패했습니다" },
      { status: 500 }
    )
  }
}

// DELETE - 장바구니 상품 삭제
export async function DELETE(request: Request) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "인증이 필요합니다" },
        { status: 401 }
      )
    }

    const { cartItemId } = await request.json()

    if (!cartItemId) {
      return NextResponse.json(
        { error: "장바구니 항목 ID가 필요합니다" },
        { status: 400 }
      )
    }

    // 장바구니 항목 확인
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true,
      },
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: "장바구니 항목을 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    // 소유권 확인
    if (cartItem.cart.userId !== session.user.id) {
      return NextResponse.json(
        { error: "권한이 없습니다" },
        { status: 403 }
      )
    }

    // 삭제
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("장바구니 삭제 실패:", error)
    return NextResponse.json(
      { error: "장바구니 삭제에 실패했습니다" },
      { status: 500 }
    )
  }
}
