/**
 * 관리자 리뷰 개별 관리 API
 *
 * DELETE /api/admin/reviews/[id] - 리뷰 영구 삭제
 * PATCH /api/admin/reviews/[id] - 리뷰 상태 변경
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { ReviewStatus } from '@prisma/client'

// DELETE - 리뷰 영구 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 관리자 권한 확인
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다' },
        { status: 403 }
      )
    }

    const { id } = await params

    // 리뷰 존재 확인
    const review = await prisma.review.findUnique({
      where: { id }
    })

    if (!review) {
      return NextResponse.json(
        { error: '리뷰를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    // 리뷰 삭제
    await prisma.review.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: '리뷰가 삭제되었습니다'
    })
  } catch (error: any) {
    console.error('리뷰 삭제 실패:', error)
    return NextResponse.json(
      { error: '리뷰 삭제에 실패했습니다' },
      { status: 500 }
    )
  }
}

// PATCH - 리뷰 상태 변경
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 관리자 권한 확인
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다' },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { status } = body

    // 유효성 검사
    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: '유효하지 않은 상태값입니다' },
        { status: 400 }
      )
    }

    // 리뷰 존재 확인
    const review = await prisma.review.findUnique({
      where: { id }
    })

    if (!review) {
      return NextResponse.json(
        { error: '리뷰를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    // 상태 업데이트
    const updated = await prisma.review.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date()
      },
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
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: `리뷰가 ${status === 'APPROVED' ? '승인' : status === 'REJECTED' ? '거부' : '대기'} 처리되었습니다`,
      data: updated
    })
  } catch (error: any) {
    console.error('리뷰 상태 변경 실패:', error)
    return NextResponse.json(
      { error: '리뷰 상태 변경에 실패했습니다' },
      { status: 500 }
    )
  }
}
