import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

// PUT /api/reviews/[id] - 리뷰 수정
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 인증 확인
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다" },
        { status: 401 }
      )
    }

    const { id: reviewId } = await params
    const body = await request.json()
    const { rating, comment, images = [] } = body

    // 입력 검증
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: "별점은 1-5 사이여야 합니다" },
        { status: 400 }
      )
    }

    if (comment && comment.length < 10) {
      return NextResponse.json(
        { error: "리뷰는 최소 10자 이상 작성해주세요" },
        { status: 400 }
      )
    }

    if (images.length > 5) {
      return NextResponse.json(
        { error: "이미지는 최대 5장까지 첨부 가능합니다" },
        { status: 400 }
      )
    }

    // 기존 리뷰 조회 및 권한 확인
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    })

    if (!existingReview) {
      return NextResponse.json(
        { error: "리뷰를 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    if (existingReview.userId !== session.user.id) {
      return NextResponse.json(
        { error: "본인이 작성한 리뷰만 수정할 수 있습니다" },
        { status: 403 }
      )
    }

    // 리뷰 수정
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: rating || existingReview.rating,
        comment: comment !== undefined ? comment : existingReview.comment,
        images: images.length > 0 ? images : existingReview.images,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedReview,
    })
  } catch (error) {
    console.error("리뷰 수정 실패:", error)
    return NextResponse.json(
      { error: "리뷰 수정에 실패했습니다" },
      { status: 500 }
    )
  }
}

// DELETE /api/reviews/[id] - 리뷰 삭제
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 인증 확인
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다" },
        { status: 401 }
      )
    }

    const { id: reviewId } = await params

    // 기존 리뷰 조회 및 권한 확인
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    })

    if (!existingReview) {
      return NextResponse.json(
        { error: "리뷰를 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    if (existingReview.userId !== session.user.id) {
      return NextResponse.json(
        { error: "본인이 작성한 리뷰만 삭제할 수 있습니다" },
        { status: 403 }
      )
    }

    // 리뷰 삭제
    await prisma.review.delete({
      where: { id: reviewId },
    })

    return NextResponse.json({
      success: true,
      message: "리뷰가 삭제되었습니다",
    })
  } catch (error) {
    console.error("리뷰 삭제 실패:", error)
    return NextResponse.json(
      { error: "리뷰 삭제에 실패했습니다" },
      { status: 500 }
    )
  }
}
