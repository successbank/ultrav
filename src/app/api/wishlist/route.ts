import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET - 찜 목록 조회
export async function GET() {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "인증이 필요합니다" },
        { status: 401 }
      )
    }

    const wishlist = await prisma.wishlist.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(wishlist)
  } catch (error) {
    console.error("찜 목록 조회 실패:", error)
    return NextResponse.json(
      { error: "찜 목록 조회에 실패했습니다" },
      { status: 500 }
    )
  }
}

// POST - 찜 목록에 추가
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "인증이 필요합니다" },
        { status: 401 }
      )
    }

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: "상품 ID가 필요합니다" },
        { status: 400 }
      )
    }

    // 이미 찜 목록에 있는지 확인
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: "이미 찜 목록에 있습니다" },
        { status: 400 }
      )
    }

    // 찜 목록에 추가
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: session.user.id,
        productId,
      },
      include: {
        product: true,
      },
    })

    return NextResponse.json(wishlistItem, { status: 201 })
  } catch (error) {
    console.error("찜 목록 추가 실패:", error)
    return NextResponse.json(
      { error: "찜 목록 추가에 실패했습니다" },
      { status: 500 }
    )
  }
}

// DELETE - 찜 목록에서 제거
export async function DELETE(request: Request) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "인증이 필요합니다" },
        { status: 401 }
      )
    }

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: "상품 ID가 필요합니다" },
        { status: 400 }
      )
    }

    await prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("찜 목록 제거 실패:", error)
    return NextResponse.json(
      { error: "찜 목록 제거에 실패했습니다" },
      { status: 500 }
    )
  }
}
