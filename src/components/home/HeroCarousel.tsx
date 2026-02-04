"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

interface Carousel {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  imageUrl: string
  linkUrl: string | null
  linkText: string | null
  order: number
}

export default function HeroCarousel() {
  const [carousels, setCarousels] = useState<Carousel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCarousels()
  }, [])

  const fetchCarousels = async () => {
    try {
      const response = await fetch("/api/carousels")
      if (!response.ok) throw new Error("Failed to fetch carousels")
      const data = await response.json()
      setCarousels(data)
    } catch (error) {
      console.error("캐러셀 조회 에러:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full h-[500px] bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    )
  }

  if (carousels.length === 0) {
    // 캐러셀이 없으면 기본 Hero Section 표시
    return (
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Ultra 쇼핑몰에 오신 것을 환영합니다
          </h1>
          <p className="text-xl mb-8">
            최고 품질의 패션 아이템을 합리적인 가격에 만나보세요
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            쇼핑 시작하기
          </Link>
        </div>
      </section>
    )
  }

  return (
    <div className="w-full h-[500px] relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={carousels.length > 1}
        className="h-full"
      >
        {carousels.map((carousel) => (
          <SwiperSlide key={carousel.id}>
            <div className="relative w-full h-full">
              {/* 배경 이미지 */}
              <div className="absolute inset-0">
                <Image
                  src={carousel.imageUrl}
                  alt={carousel.title}
                  fill
                  className="object-cover"
                  priority
                />
                {/* 오버레이 */}
                <div className="absolute inset-0 bg-black bg-opacity-30" />
              </div>

              {/* 콘텐츠 */}
              <div className="relative z-10 h-full flex items-center justify-center">
                <div className="container mx-auto px-4 text-center text-white">
                  <h2 className="text-5xl font-bold mb-4 drop-shadow-lg">
                    {carousel.title}
                  </h2>
                  {carousel.subtitle && (
                    <p className="text-2xl mb-4 drop-shadow-lg">{carousel.subtitle}</p>
                  )}
                  {carousel.description && (
                    <p className="text-lg mb-8 max-w-2xl mx-auto drop-shadow-lg">
                      {carousel.description}
                    </p>
                  )}
                  {carousel.linkUrl && (
                    <Link
                      href={carousel.linkUrl}
                      className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      {carousel.linkText || "자세히 보기"}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: white !important;
          background: rgba(0, 0, 0, 0.3);
          width: 50px !important;
          height: 50px !important;
          border-radius: 50%;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(0, 0, 0, 0.5);
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px !important;
        }

        .swiper-pagination-bullet {
          width: 12px !important;
          height: 12px !important;
          background: white !important;
          opacity: 0.5 !important;
        }

        .swiper-pagination-bullet-active {
          opacity: 1 !important;
          background: white !important;
        }
      `}</style>
    </div>
  )
}
