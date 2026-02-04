'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import StarRating from './StarRating'
import ImageLightbox from '../ImageLightbox'
import { BadgeCheck, Trash2, Edit } from 'lucide-react'

interface Review {
  id: string
  rating: number
  comment: string | null
  images: string[]
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string | null
    email: string
  }
}

interface ReviewCardProps {
  review: Review
  isVerifiedPurchase?: boolean
  onDelete?: () => void
}

export default function ReviewCard({ review, isVerifiedPurchase = true, onDelete }: ReviewCardProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [formattedDate, setFormattedDate] = useState('')
  const [relativeTime, setRelativeTime] = useState('')
  const [updatedDate, setUpdatedDate] = useState('')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const isOwnReview = session?.user?.id === review.user.id

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffDays === 0) return '오늘'
    if (diffDays === 1) return '어제'
    if (diffDays < 7) return `${diffDays}일 전`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`
    return `${Math.floor(diffDays / 365)}년 전`
  }

  // 클라이언트에서만 날짜 포맷팅 (hydration 에러 방지)
  useEffect(() => {
    setFormattedDate(formatDate(review.createdAt))
    setRelativeTime(getRelativeTime(review.createdAt))
    if (review.createdAt !== review.updatedAt) {
      setUpdatedDate(formatDate(review.updatedAt))
    }
  }, [review.createdAt, review.updatedAt])

  const handleDelete = async () => {
    if (!confirm('정말 이 리뷰를 삭제하시겠습니까?')) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/reviews/${review.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        alert(data.error || '리뷰 삭제에 실패했습니다')
        return
      }

      alert('리뷰가 삭제되었습니다')

      if (onDelete) {
        onDelete()
      } else {
        router.refresh()
      }
    } catch (error) {
      console.error('리뷰 삭제 실패:', error)
      alert('리뷰 삭제 중 오류가 발생했습니다')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="border-b border-gray-200 pb-6 last:border-b-0">
      {/* 헤더: 사용자 정보 및 별점 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* 사용자 아바타 */}
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {review.user.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">
                {review.user.name || '익명 사용자'}
              </span>
              {isVerifiedPurchase && (
                <div className="flex items-center gap-1 text-green-600" title="구매 인증">
                  <BadgeCheck size={16} />
                  <span className="text-xs font-medium">구매 인증</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {relativeTime && <span>{relativeTime}</span>}
              {relativeTime && formattedDate && <span>·</span>}
              {formattedDate && <span>{formattedDate}</span>}
            </div>
          </div>
        </div>

        {/* 본인 리뷰일 때 수정/삭제 버튼 */}
        {isOwnReview && (
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="삭제"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      {/* 별점 */}
      <div className="mb-3">
        <StarRating rating={review.rating} readonly size="sm" />
      </div>

      {/* 리뷰 내용 */}
      {review.comment && (
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{review.comment}</p>
      )}

      {/* 이미지 */}
      {review.images && review.images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {review.images.map((image, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => {
                setLightboxIndex(index)
                setLightboxOpen(true)
              }}
            >
              <img
                src={image}
                alt={`리뷰 이미지 ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* 이미지 라이트박스 */}
      {review.images && review.images.length > 0 && (
        <ImageLightbox
          images={review.images}
          initialIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* 수정됨 표시 */}
      {review.createdAt !== review.updatedAt && updatedDate && (
        <p className="mt-2 text-xs text-gray-500">
          (수정됨: {updatedDate})
        </p>
      )}
    </div>
  )
}
