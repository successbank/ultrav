'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import StarRating from './StarRating'
import { X, Upload, ImageIcon } from 'lucide-react'

interface ReviewFormProps {
  productId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function ReviewForm({ productId, onSuccess, onCancel }: ReviewFormProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([])

  // 이미지 파일 선택 처리
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    // 최대 5개 제한
    if (selectedFiles.length + files.length > 5) {
      setError('이미지는 최대 5개까지 첨부할 수 있습니다')
      return
    }

    // 파일 타입 검증
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/')
      if (!isValid) {
        setError(`${file.name}은(는) 이미지 파일이 아닙니다`)
      }
      return isValid
    })

    // 파일 크기 검증 (5MB)
    const validSizeFiles = validFiles.filter(file => {
      const isValid = file.size <= 5 * 1024 * 1024
      if (!isValid) {
        setError(`${file.name}의 크기가 너무 큽니다 (최대 5MB)`)
      }
      return isValid
    })

    // 미리보기 URL 생성
    const newPreviewUrls = validSizeFiles.map(file => URL.createObjectURL(file))

    setSelectedFiles(prev => [...prev, ...validSizeFiles])
    setPreviewUrls(prev => [...prev, ...newPreviewUrls])
  }

  // 이미지 삭제
  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]) // 메모리 해제
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  // 이미지 업로드 (서버로 전송)
  const uploadImages = async (): Promise<string[]> => {
    if (selectedFiles.length === 0) return []

    const formData = new FormData()
    selectedFiles.forEach(file => {
      formData.append('images', file)
    })

    const response = await fetch('/api/upload/review-images', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || '이미지 업로드 실패')
    }

    const data = await response.json()
    return data.data.urls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // 로그인 확인
    if (status === 'unauthenticated') {
      if (confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
        router.push('/admin/login')
      }
      return
    }

    // 최소 글자 수 확인
    if (comment && comment.length < 10) {
      setError('리뷰는 최소 10자 이상 작성해주세요')
      return
    }

    setIsSubmitting(true)

    try {
      // 1. 이미지 업로드 (선택된 경우)
      let imageUrls: string[] = []
      if (selectedFiles.length > 0) {
        imageUrls = await uploadImages()
      }

      // 2. 리뷰 등록
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          comment: comment || null,
          images: imageUrls,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || '리뷰 작성에 실패했습니다')
        return
      }

      // 성공
      alert('리뷰가 등록되었습니다!')
      setRating(5)
      setComment('')
      setSelectedFiles([])
      setPreviewUrls([])
      setUploadedImageUrls([])

      if (onSuccess) {
        onSuccess()
      } else {
        // 페이지 새로고침으로 리뷰 목록 업데이트
        router.refresh()
      }
    } catch (err) {
      console.error('리뷰 작성 실패:', err)
      setError('리뷰 작성 중 오류가 발생했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <p className="text-gray-700 mb-4">리뷰를 작성하려면 로그인이 필요합니다</p>
        <button
          onClick={() => router.push('/admin/login')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          로그인하기
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">리뷰 작성하기</h3>
        <p className="text-sm text-gray-600">
          구매하신 제품에 대한 솔직한 후기를 남겨주세요
        </p>
      </div>

      {/* 별점 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          별점 <span className="text-red-500">*</span>
        </label>
        <StarRating rating={rating} onChange={setRating} size="lg" />
      </div>

      {/* 리뷰 내용 */}
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          리뷰 내용 (선택, 최소 10자)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="제품에 대한 솔직한 후기를 작성해주세요. 다른 고객들에게 큰 도움이 됩니다."
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
        <div className="mt-1 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {comment.length}자 {comment.length > 0 && comment.length < 10 && '(최소 10자)'}
          </span>
          {comment.length >= 10 && (
            <span className="text-sm text-green-600">✓ 입력 완료</span>
          )}
        </div>
      </div>

      {/* 이미지 업로드 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          이미지 (선택, 최대 5개)
        </label>

        {/* 파일 선택 버튼 */}
        {selectedFiles.length < 5 && (
          <label className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <Upload size={20} className="text-gray-500" />
            <span className="text-sm text-gray-600">이미지 선택</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
          </label>
        )}

        {/* 이미지 미리보기 그리드 */}
        {previewUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-5 gap-3">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative aspect-square group">
                <img
                  src={url}
                  alt={`미리보기 ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="mt-2 text-xs text-gray-500">
          {selectedFiles.length}/5 · JPG, PNG, WEBP · 파일당 최대 5MB
        </p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span className="text-sm">{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-700 hover:text-red-900"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* 버튼들 */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isSubmitting ? '등록 중...' : '리뷰 등록'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
        )}
      </div>
    </form>
  )
}
