import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { ArrowLeft, ChevronLeft, ChevronRight, Eye, Calendar } from 'lucide-react'

const categoryStyle: Record<string, string> = {
  GENERAL: 'bg-gray-100 text-gray-700',
  EVENT: 'bg-green-100 text-green-700',
  UPDATE: 'bg-blue-100 text-blue-700',
  IMPORTANT: 'bg-red-100 text-red-700',
}

const categoryLabel: Record<string, string> = {
  GENERAL: '일반',
  EVENT: '이벤트',
  UPDATE: '업데이트',
  IMPORTANT: '중요',
}

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const notice = await prisma.notice.findUnique({
    where: { id, isActive: true },
  })

  if (!notice) {
    notFound()
  }

  // 조회수 증가
  await prisma.notice.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  })

  // 이전/다음 공지
  const [prevNotice, nextNotice] = await Promise.all([
    prisma.notice.findFirst({
      where: {
        isActive: true,
        createdAt: { lt: notice.createdAt },
      },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true },
    }),
    prisma.notice.findFirst({
      where: {
        isActive: true,
        createdAt: { gt: notice.createdAt },
      },
      orderBy: { createdAt: 'asc' },
      select: { id: true, title: true },
    }),
  ])

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero 섹션 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-2">공지사항</h1>
          <p className="text-blue-100">울트라 메디컬의 새로운 소식과 안내사항을 확인하세요</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 목록으로 돌아가기 */}
        <Link
          href="/notices"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로
        </Link>

        {/* 공지 헤더 카드 */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="mb-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                categoryStyle[notice.category]
              }`}
            >
              {categoryLabel[notice.category]}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">{notice.title}</h2>

          <div className="flex items-center gap-4 text-sm text-gray-500 pb-6 border-b">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(notice.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>조회 {(notice.viewCount + 1).toLocaleString()}</span>
            </div>
          </div>

          {/* 본문 */}
          <div className="pt-6 text-gray-700 leading-relaxed whitespace-pre-wrap">
            {notice.content}
          </div>
        </div>

        {/* 이전/다음 네비게이션 */}
        <div className="bg-white rounded-lg shadow-sm divide-y">
          {nextNotice && (
            <Link
              href={`/notices/${nextNotice.id}`}
              className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-500 flex-shrink-0 w-16">다음글</span>
              <span className="text-sm text-gray-900 truncate">{nextNotice.title}</span>
            </Link>
          )}
          {prevNotice && (
            <Link
              href={`/notices/${prevNotice.id}`}
              className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-500 flex-shrink-0 w-16">이전글</span>
              <span className="text-sm text-gray-900 truncate">{prevNotice.title}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
