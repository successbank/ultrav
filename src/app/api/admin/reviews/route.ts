/**
 * 관리자 리뷰 관리 API
 *
 * GET /api/admin/reviews - 리뷰 목록 조회 (필터링, 페이지네이션)
 * PATCH /api/admin/reviews - 리뷰 상태 일괄 변경
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { ReviewStatus } from '@prisma/client'

// GET - 리뷰 목록 조회
export async function GET(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as ReviewStatus | 'ALL' | null
    const productId = searchParams.get('productId')
    const search = searchParams.get('search') // 리뷰 내용 검색
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const sort = searchParams.get('sort') || 'latest' // latest, oldest, rating_high, rating_low

    // WHERE 조건 구성
    const where: any = {}

    if (status && status !== 'ALL') {
      where.status = status
    }

    if (productId) {
      where.productId = productId
    }

    if (search) {
      where.comment = {
        contains: search,
        mode: 'insensitive'
      }
    }

    // 정렬 조건
    let orderBy: any = { createdAt: 'desc' } // 기본: 최신순
    switch (sort) {
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'rating_high':
        orderBy = { rating: 'desc' }
        break
      case 'rating_low':
        orderBy = { rating: 'asc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    // 리뷰 조회
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
          product: {
            select: {
              id: true,
              name: true,
              brand: true,
              imageUrl: true,
            }
          }
        },
        orderBy,
        take: limit,
        skip: offset,
      }),
      prisma.review.count({ where })
    ])

    // 상태별 통계
    const statusCounts = await prisma.review.groupBy({
      by: ['status'],
      _count: { status: true }
    })

    const stats = {
      total: await prisma.review.count(),
      pending: statusCounts.find(s => s.status === 'PENDING')?._count.status || 0,
      approved: statusCounts.find(s => s.status === 'APPROVED')?._count.status || 0,
      rejected: statusCounts.find(s => s.status === 'REJECTED')?._count.status || 0,
    }

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + reviews.length < total
        },
        stats
      }
    })
  } catch (error: any) {
    console.error('리뷰 목록 조회 실패:', error)
    return NextResponse.json(
      { error: '리뷰 목록을 불러오는데 실패했습니다' },
      { status: 500 }
    )
  }
}

// PATCH - 리뷰 상태 일괄 변경
export async function PATCH(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { reviewIds, status } = body

    // 유효성 검사
    if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
      return NextResponse.json(
        { error: '리뷰 ID 목록이 필요합니다' },
        { status: 400 }
      )
    }

    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: '유효하지 않은 상태값입니다' },
        { status: 400 }
      )
    }

    // 상태 일괄 업데이트
    const result = await prisma.review.updateMany({
      where: {
        id: {
          in: reviewIds
        }
      },
      data: {
        status,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: `${result.count}개의 리뷰가 ${status === 'APPROVED' ? '승인' : status === 'REJECTED' ? '거부' : '대기'} 처리되었습니다`,
      data: {
        count: result.count
      }
    })
  } catch (error: any) {
    console.error('리뷰 상태 변경 실패:', error)
    return NextResponse.json(
      { error: '리뷰 상태 변경에 실패했습니다' },
      { status: 500 }
    )
  }
}
