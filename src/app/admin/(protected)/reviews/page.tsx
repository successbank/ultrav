/**
 * 관리자 리뷰 관리 페이지
 * 경로: /admin/reviews
 */

import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import ReviewManagementClient from '@/components/admin/ReviewManagementClient'

export const metadata = {
  title: '리뷰 관리 - Ultra Admin',
  description: '고객 리뷰 승인/거부 관리',
}

export default async function AdminReviewsPage() {
  // 관리자 권한 확인
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  // 초기 데이터 로드
  const [initialReviews, stats] = await Promise.all([
    prisma.review.findMany({
      where: {},
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
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    getReviewStats()
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">리뷰 관리</h1>
        <p className="text-gray-600 mt-2">고객 리뷰를 검토하고 승인/거부 처리할 수 있습니다</p>
      </div>

      <Suspense fallback={<LoadingReviews />}>
        <ReviewManagementClient
          initialReviews={initialReviews}
          initialStats={stats}
        />
      </Suspense>
    </div>
  )
}

async function getReviewStats() {
  const statusCounts = await prisma.review.groupBy({
    by: ['status'],
    _count: { status: true }
  })

  return {
    total: await prisma.review.count(),
    pending: statusCounts.find(s => s.status === 'PENDING')?._count.status || 0,
    approved: statusCounts.find(s => s.status === 'APPROVED')?._count.status || 0,
    rejected: statusCounts.find(s => s.status === 'REJECTED')?._count.status || 0,
  }
}

function LoadingReviews() {
  return (
    <div className="bg-white rounded-lg shadow p-8">
      <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border-b pb-4">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
