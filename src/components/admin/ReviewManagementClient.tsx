'use client'

import { useState, useEffect } from 'react'
import { Check, X, Trash2, RefreshCw, Filter } from 'lucide-react'
import StarRating from '../reviews/StarRating'

interface Review {
  id: string
  rating: number
  comment: string | null
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string | Date
  user: {
    id: string
    name: string | null
    email: string
  }
  product: {
    id: string
    name: string
    brand: string
    imageUrl: string | null
  }
}

interface Stats {
  total: number
  pending: number
  approved: number
  rejected: number
}

interface Props {
  initialReviews: Review[]
  initialStats: Stats
}

export default function ReviewManagementClient({ initialReviews, initialStats }: Props) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [stats, setStats] = useState<Stats>(initialStats)
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchReviews = async (status: typeof filter = filter) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ status, limit: '100' })
      const response = await fetch(`/api/admin/reviews?${params}`)
      const data = await response.json()
      if (data.success) {
        setReviews(data.data.reviews)
        setStats(data.data.stats)
      }
    } catch (error) {
      console.error('리뷰 조회 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (status: 'APPROVED' | 'REJECTED' | 'PENDING') => {
    if (selectedIds.length === 0) {
      alert('변경할 리뷰를 선택하세요')
      return
    }

    if (!confirm(`선택한 ${selectedIds.length}개 리뷰를 ${status === 'APPROVED' ? '승인' : status === 'REJECTED' ? '거부' : '대기'}하시겠습니까?`)) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewIds: selectedIds, status })
      })
      const data = await response.json()
      if (data.success) {
        alert(data.message)
        setSelectedIds([])
        await fetchReviews()
      } else {
        alert(data.error)
      }
    } catch (error) {
      alert('상태 변경 실패')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('이 리뷰를 영구 삭제하시겠습니까?')) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' })
      const data = await response.json()
      if (data.success) {
        alert(data.message)
        await fetchReviews()
      } else {
        alert(data.error)
      }
    } catch (error) {
      alert('삭제 실패')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === reviews.length ? [] : reviews.map(r => r.id))
  }

  const filteredReviews = filter === 'ALL' ? reviews : reviews.filter(r => r.status === filter)

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard label="전체" count={stats.total} color="gray" onClick={() => { setFilter('ALL'); fetchReviews('ALL') }} active={filter === 'ALL'} />
        <StatsCard label="대기" count={stats.pending} color="yellow" onClick={() => { setFilter('PENDING'); fetchReviews('PENDING') }} active={filter === 'PENDING'} />
        <StatsCard label="승인" count={stats.approved} color="green" onClick={() => { setFilter('APPROVED'); fetchReviews('APPROVED') }} active={filter === 'APPROVED'} />
        <StatsCard label="거부" count={stats.rejected} color="red" onClick={() => { setFilter('REJECTED'); fetchReviews('REJECTED') }} active={filter === 'REJECTED'} />
      </div>

      {/* 일괄 처리 버튼 */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-blue-900 font-medium">{selectedIds.length}개 선택됨</span>
          <div className="flex gap-2">
            <button onClick={() => handleStatusChange('APPROVED')} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
              <Check size={16} /> 승인
            </button>
            <button onClick={() => handleStatusChange('REJECTED')} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2">
              <X size={16} /> 거부
            </button>
            <button onClick={() => handleStatusChange('PENDING')} className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center gap-2">
              <RefreshCw size={16} /> 대기로 변경
            </button>
          </div>
        </div>
      )}

      {/* 리뷰 목록 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">리뷰 목록 ({filteredReviews.length}개)</h2>
          <button onClick={toggleSelectAll} className="text-sm text-blue-600 hover:text-blue-700">
            {selectedIds.length === reviews.length ? '전체 해제' : '전체 선택'}
          </button>
        </div>
        <div className="divide-y">
          {filteredReviews.map(review => (
            <ReviewItem
              key={review.id}
              review={review}
              isSelected={selectedIds.includes(review.id)}
              onToggleSelect={toggleSelect}
              onDelete={handleDelete}
            />
          ))}
          {filteredReviews.length === 0 && (
            <div className="p-12 text-center text-gray-500">리뷰가 없습니다</div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatsCard({ label, count, color, onClick, active }: {
  label: string
  count: number
  color: 'gray' | 'yellow' | 'green' | 'red'
  onClick: () => void
  active: boolean
}) {
  const colors = {
    gray: 'bg-gray-100 text-gray-900',
    yellow: 'bg-yellow-100 text-yellow-900',
    green: 'bg-green-100 text-green-900',
    red: 'bg-red-100 text-red-900'
  }
  return (
    <button onClick={onClick} className={`p-6 rounded-lg ${active ? 'ring-2 ring-blue-500' : ''} ${colors[color]} hover:shadow-md transition-all`}>
      <div className="text-2xl font-bold">{count}</div>
      <div className="text-sm mt-1">{label}</div>
    </button>
  )
}

function ReviewItem({ review, isSelected, onToggleSelect, onDelete }: {
  review: Review
  isSelected: boolean
  onToggleSelect: (id: string) => void
  onDelete: (id: string) => void
}) {
  const [formattedDate, setFormattedDate] = useState('')

  // 클라이언트에서만 날짜 포맷팅 (hydration 에러 방지)
  useEffect(() => {
    setFormattedDate(new Date(review.createdAt).toLocaleString('ko-KR'))
  }, [review.createdAt])

  return (
    <div className={`p-6 ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
      <div className="flex gap-4">
        <input type="checkbox" checked={isSelected} onChange={() => onToggleSelect(review.id)} className="mt-1" />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <a href={`/products/${review.product.id}`} className="font-medium text-blue-600 hover:underline">{review.product.name}</a>
                <StatusBadge status={review.status} />
              </div>
              <StarRating rating={review.rating} readonly size="sm" />
            </div>
            <button onClick={() => onDelete(review.id)} className="text-red-600 hover:text-red-700 p-2">
              <Trash2 size={18} />
            </button>
          </div>
          {review.comment && <p className="text-gray-700 mb-2">{review.comment}</p>}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{review.user.name || '익명'}</span>
            {formattedDate && (
              <>
                <span>·</span>
                <span>{formattedDate}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800'
  }
  const labels = {
    PENDING: '대기',
    APPROVED: '승인',
    REJECTED: '거부'
  }
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
      {labels[status as keyof typeof labels]}
    </span>
  )
}
