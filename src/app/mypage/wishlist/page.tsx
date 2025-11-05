'use client'

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/Card"
import { formatPrice, calculateDiscountedPrice } from "@/lib/utils"
import { Heart, ShoppingCart, Trash2, Package } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

interface WishlistItem {
  id: string
  product: {
    id: string
    name: string
    brand: string
    price: number
    discount: number
    imageUrl: string
    stock: number
    isActive: boolean
  }
  createdAt: string
}

export default function WishlistPage() {
  const { data: session, status } = useSession()
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login')
    }

    if (status === 'authenticated') {
      fetchWishlist()
    }
  }, [status])

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist')
      if (response.ok) {
        const data = await response.json()
        setWishlist(data)
      }
    } catch (error) {
      console.error('찜 목록 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    setRemoving(productId)
    try {
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      })

      if (response.ok) {
        setWishlist(wishlist.filter((item) => item.product.id !== productId))
      }
    } catch (error) {
      console.error('찜 목록 제거 실패:', error)
    } finally {
      setRemoving(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">찜 목록</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (wishlist.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">찜 목록</h2>
        <Card className="p-12 text-center">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            찜한 상품이 없습니다
          </h3>
          <p className="text-gray-600 mb-6">
            마음에 드는 상품을 찜해보세요!
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            상품 둘러보기
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">찜 목록</h2>
        <p className="text-sm text-gray-600">총 {wishlist.length}개</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => {
          const discountedPrice = item.product.discount
            ? calculateDiscountedPrice(item.product.price, item.product.discount)
            : item.product.price

          return (
            <Card
              key={item.id}
              className="overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <Link href={`/products/${item.product.id}`}>
                <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={48} className="text-gray-400" />
                    </div>
                  )}
                  {item.product.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
                      {item.product.discount}%
                    </div>
                  )}
                  {!item.product.isActive && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold">판매 종료</span>
                    </div>
                  )}
                  {item.product.stock === 0 && item.product.isActive && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold">품절</span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <Link href={`/products/${item.product.id}`}>
                  <p className="text-sm text-gray-600 mb-1">
                    {item.product.brand}
                  </p>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600">
                    {item.product.name}
                  </h3>
                </Link>

                <div className="flex items-baseline gap-2 mb-4">
                  {item.product.discount > 0 ? (
                    <>
                      <span className="text-xl font-bold text-gray-900">
                        {formatPrice(discountedPrice)}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(item.product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(item.product.price)}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => removeFromWishlist(item.product.id)}
                    disabled={removing === item.product.id}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    <span className="text-sm">
                      {removing === item.product.id ? '제거 중...' : '제거'}
                    </span>
                  </button>
                  {item.product.isActive && item.product.stock > 0 && (
                    <Link
                      href={`/products/${item.product.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ShoppingCart size={16} />
                      <span className="text-sm">구매</span>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
