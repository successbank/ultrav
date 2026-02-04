'use client'

import { useState, useEffect } from 'react'
import ReviewCard from './ReviewCard'
import { ChevronDown } from 'lucide-react'

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

interface ReviewListProps {
  productId: string
  initialReviews?: Review[]
  initialTotal?: number
  initialHasMore?: boolean
}

export default function ReviewList({
  productId,
  initialReviews = [],
  initialTotal = 0,
  initialHasMore = false,
}: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [total, setTotal] = useState(initialTotal)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState('latest')
  const [filterRating, setFilterRating] = useState<string>('')

  // 리뷰 목록 로드
  const loadReviews = async (offset: number = 0, append: boolean = false) => {
    setIsLoading(true)

    try {
      const params = new URLSearchParams({
        limit: '5',
        offset: offset.toString(),
        sort: sortBy,
      })

      if (filterRating) {
        params.append('rating', filterRating)
      }

      const response = await fetch(`/api/products/${productId}/reviews?${params}`)
      const data = await response.json()

      if (data.success) {
        if (append) {
          setReviews((prev) => [...prev, ...data.data.reviews])
        } else {
          setReviews(data.data.reviews)
        }
        setTotal(data.data.pagination.total)
        setHasMore(data.data.pagination.hasMore)
      }
    } catch (error) {
      console.error('리뷰 로드 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 정렬 또는 필터 변경 시 리뷰 재로드
  useEffect(() => {
    if (initialReviews.length === 0) {
      loadReviews(0, false)
    }
  }, [sortBy, filterRating])

  // 더보기 버튼 클릭
  const handleLoadMore = () => {
    loadReviews(reviews.length, true)
  }

  // 리뷰 삭제 후 목록 갱신
  const handleReviewDelete = () => {
    loadReviews(0, false)
  }

  return (
    <div className="space-y-6">
      {/* 필터 및 정렬 */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-gray-700">총 {total}개의 리뷰</span>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* 정렬 선택 */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="latest">최신순</option>
            <option value="highest">평점 높은순</option>
            <option value="lowest">평점 낮은순</option>
          </select>

          {/* 별점 필터 */}
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">모든 별점</option>
            <option value="5">⭐⭐⭐⭐⭐ (5점)</option>
            <option value="4">⭐⭐⭐⭐ (4점 이상)</option>
            <option value="3">⭐⭐⭐ (3점 이상)</option>
            <option value="2">⭐⭐ (2점 이상)</option>
            <option value="1">⭐ (1점 이상)</option>
          </select>
        </div>
      </div>

      {/* 리뷰 목록 */}
      {isLoading && reviews.length === 0 ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse border-b border-gray-200 pb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {filterRating ? '조건에 맞는 리뷰가 없습니다' : '아직 리뷰가 없습니다'}
          </p>
          <p className="text-sm text-gray-400 mt-2">첫 번째 리뷰를 작성해보세요!</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                isVerifiedPurchase={true}
                onDelete={handleReviewDelete}
              />
            ))}
          </div>

          {/* 더보기 버튼 */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                    <span>로드 중...</span>
                  </>
                ) : (
                  <>
                    <span>더보기</span>
                    <ChevronDown size={20} />
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
