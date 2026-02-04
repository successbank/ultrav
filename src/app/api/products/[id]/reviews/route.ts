import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET /api/products/[id]/reviews - 제품 리뷰 목록 조회
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params
    const { searchParams } = new URL(request.url)

    // 쿼리 파라미터 파싱
    const limit = parseInt(searchParams.get("limit") || "5", 10)
    const offset = parseInt(searchParams.get("offset") || "0", 10)
    const sort = searchParams.get("sort") || "latest" // latest, highest, lowest
    const ratingFilter = searchParams.get("rating")
    const withImages = searchParams.get("withImages") === "true"

    // 정렬 조건 설정
    let orderBy: any = { createdAt: "desc" } // 기본값: 최신순
    if (sort === "highest") {
      orderBy = { rating: "desc" }
    } else if (sort === "lowest") {
      orderBy = { rating: "asc" }
    }

    // 필터 조건 설정
    const where: any = {
      productId,
      status: 'APPROVED', // 승인된 리뷰만 표시
    }

    if (ratingFilter) {
      where.rating = parseInt(ratingFilter, 10)
    }

    if (withImages) {
      where.images = {
        isEmpty: false,
      }
    }

    // 리뷰 조회
    const [reviews, totalCount, stats] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy,
        take: limit,
        skip: offset,
      }),
      prisma.review.count({ where }),
      prisma.review.groupBy({
        by: ["rating"],
        where: { productId },
        _count: {
          rating: true,
        },
      }),
    ])

    // 평균 별점 계산
    const allReviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    })
    const averageRating =
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0

    // 별점 분포 생성
    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    }
    stats.forEach((stat) => {
      ratingDistribution[stat.rating as keyof typeof ratingDistribution] = stat._count.rating
    })

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount,
        },
        stats: {
          averageRating: parseFloat(averageRating.toFixed(1)),
          totalReviews: allReviews.length,
          ratingDistribution,
        },
      },
    })
  } catch (error) {
    console.error("리뷰 조회 실패:", error)
    return NextResponse.json(
      { error: "리뷰를 불러오는데 실패했습니다" },
      { status: 500 }
    )
  }
}

// POST /api/products/[id]/reviews - 새 리뷰 작성
export async function POST(
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

    const { id: productId } = await params
    const body = await request.json()
    const { rating, comment, images = [] } = body

    // 입력 검증
    if (!rating || rating < 1 || rating > 5) {
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

    // 구매 검증: 사용자가 이 제품을 구매했는지 확인
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: session.user.id,
          status: "DELIVERED", // 배송 완료된 주문만
        },
      },
    })

    if (!hasPurchased) {
      return NextResponse.json(
        { error: "구매한 제품에 대해서만 리뷰를 작성할 수 있습니다" },
        { status: 403 }
      )
    }

    // 중복 리뷰 확인
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: "이미 이 제품에 대한 리뷰를 작성하셨습니다" },
        { status: 400 }
      )
    }

    // 리뷰 생성
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        productId,
        rating,
        comment: comment || null,
        images,
        status: 'PENDING', // 기본값: 승인 대기
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
      data: review,
    })
  } catch (error) {
    console.error("리뷰 작성 실패:", error)
    return NextResponse.json(
      { error: "리뷰 작성에 실패했습니다" },
      { status: 500 }
    )
  }
}
