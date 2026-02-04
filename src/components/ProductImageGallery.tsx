'use client'

import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

interface ProductImageGalleryProps {
  productName: string
  mainImage: string | null
  additionalImages: string[]
  discount?: number
}

export default function ProductImageGallery({
  productName,
  mainImage,
  additionalImages,
  discount = 0,
}: ProductImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // 모든 이미지를 하나의 배열로 통합
  const allImages = [
    ...(mainImage ? [mainImage] : []),
    ...additionalImages,
  ]

  // Lightbox용 slides 데이터 구조
  const slides = allImages.map((image) => ({
    src: image,
    alt: productName,
  }))

  // 이미지 클릭 핸들러
  const handleImageClick = (index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
  }

  return (
    <>
      <div>
        {/* 메인 이미지 */}
        <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative mb-4 cursor-pointer hover:opacity-95 transition-opacity">
          {allImages[0] ? (
            <img
              src={allImages[0]}
              alt={productName}
              className="w-full h-full object-cover"
              onClick={() => handleImageClick(0)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg">
              이미지 준비중
            </div>
          )}
          {discount > 0 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg z-10">
              {discount}% OFF
            </div>
          )}
        </div>

        {/* 추가 썸네일 이미지들 */}
        {additionalImages.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {additionalImages.map((image, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity hover:ring-2 hover:ring-blue-500"
                onClick={() => handleImageClick(index + 1)}
              >
                <img
                  src={image}
                  alt={`${productName} - 이미지 ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox 모달 */}
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={slides}
        index={currentIndex}
        controller={{ closeOnBackdropClick: true }}
        animation={{ fade: 300, swipe: 300 }}
        carousel={{
          finite: false,
          preload: 2,
        }}
        render={{
          buttonPrev: slides.length <= 1 ? () => null : undefined,
          buttonNext: slides.length <= 1 ? () => null : undefined,
        }}
      />
    </>
  )
}
