'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Star } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { formatPrice, calculateDiscountedPrice } from '@/lib/utils'

interface ProductCardProps {
  id: string
  name: string
  price: number
  discount: number
  imageUrl: string | null
  stock: number
  isNew: boolean
  category: { name: string }
  averageRating?: number
  reviewCount?: number
}

export default function ProductCard({
  id, name, price, discount, imageUrl, stock, isNew, category,
  averageRating = 0, reviewCount = 0,
}: ProductCardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const discountedPrice = calculateDiscountedPrice(price, discount)
  const isOutOfStock = stock === 0

  useEffect(() => {
    if (session?.user) {
      fetch('/api/wishlist')
        .then(res => res.ok ? res.json() : [])
        .then(items => {
          setIsInWishlist(items.some((item: any) => item.product.id === id))
        })
        .catch(() => {})
    }
  }, [session, id])

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (status === 'unauthenticated') {
      if (confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
        router.push('/login')
      }
      return
    }

    setWishlistLoading(true)
    try {
      const method = isInWishlist ? 'DELETE' : 'POST'
      const res = await fetch('/api/wishlist', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id }),
      })
      if (res.ok) setIsInWishlist(!isInWishlist)
    } catch {
      // silently fail
    }
    setWishlistLoading(false)
  }

  return (
    <Link
      href={`/products/${id}`}
      className={`group bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 ${
        isOutOfStock ? 'opacity-80' : ''
      }`}
    >
      {/* Image */}
      <div className="aspect-square bg-gray-200 relative overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            이미지 준비중
          </div>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span className="text-white text-lg font-bold bg-black/70 px-4 py-2 rounded">품절</span>
          </div>
        )}

        {/* Left badges (NEW) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
          {isNew && (
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-bold">
              NEW
            </span>
          )}
        </div>

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-20">
            {discount}% OFF
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlistToggle}
          disabled={wishlistLoading}
          className="absolute bottom-2 right-2 z-20 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-all disabled:opacity-50"
          aria-label={isInWishlist ? '찜 해제' : '찜하기'}
        >
          <Heart
            size={18}
            className={isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {name}
        </h3>

        {/* Rating */}
        {averageRating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          {discount > 0 ? (
            <>
              <span className="text-lg font-bold">{formatPrice(discountedPrice)}</span>
              <span className="text-sm text-gray-500 line-through">{formatPrice(price)}</span>
            </>
          ) : (
            <span className="text-lg font-bold">{formatPrice(price)}</span>
          )}
        </div>

        <p className="text-sm text-gray-500 mt-2">{category.name}</p>
      </div>
    </Link>
  )
}
