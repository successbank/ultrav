'use client'

import { useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageLightboxProps {
  images: string[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
}

export default function ImageLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  // initialIndex 변경 시 currentIndex 업데이트
  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
      // 스크롤 방지
      document.body.style.overflow = 'hidden'
    }

    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // 화살표 키로 네비게이션
  useEffect(() => {
    const handleArrow = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
    }

    if (isOpen) {
      window.addEventListener('keydown', handleArrow)
    }

    return () => {
      window.removeEventListener('keydown', handleArrow)
    }
  }, [isOpen, currentIndex])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
      onClick={onClose}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full text-white transition-all"
        aria-label="닫기"
      >
        <X size={32} />
      </button>

      {/* 이전 버튼 */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            goToPrevious()
          }}
          className="absolute left-4 z-10 p-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full text-white transition-all"
          aria-label="이전 이미지"
        >
          <ChevronLeft size={32} />
        </button>
      )}

      {/* 이미지 */}
      <div
        className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]}
          alt={`이미지 ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain rounded-lg"
        />
      </div>

      {/* 다음 버튼 */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            goToNext()
          }}
          className="absolute right-4 z-10 p-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full text-white transition-all"
          aria-label="다음 이미지"
        >
          <ChevronRight size={32} />
        </button>
      )}

      {/* 인디케이터 */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-black bg-opacity-50 px-4 py-2 rounded-full text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  )
}
