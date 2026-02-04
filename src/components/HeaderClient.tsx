'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

interface HeaderClientProps {
  userId?: string
}

export default function HeaderClient({ userId }: HeaderClientProps) {
  const [cartItemCount, setCartItemCount] = useState(0)

  // 장바구니 개수 가져오기
  useEffect(() => {
    const fetchCartCount = async () => {
      if (userId) {
        try {
          const response = await fetch('/api/cart')
          if (response.ok) {
            const cart = await response.json()
            const totalItems = cart.items.reduce(
              (sum: number, item: any) => sum + item.quantity,
              0
            )
            setCartItemCount(totalItems)
          }
        } catch (error) {
          console.error('장바구니 개수 로드 실패:', error)
        }
      } else {
        setCartItemCount(0)
      }
    }

    fetchCartCount()

    // 페이지 포커스 시 장바구니 개수 업데이트
    const handleFocus = () => fetchCartCount()
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [userId])

  return (
    <Link
      href="/cart"
      className="relative flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
    >
      <div className="relative">
        <ShoppingCart size={20} />
        {cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {cartItemCount > 99 ? '99+' : cartItemCount}
          </span>
        )}
      </div>
      <span>장바구니</span>
    </Link>
  )
}
