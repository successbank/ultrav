'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import UserDropdown from '@/components/ui/UserDropdown'

export default function Header() {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'
  const [cartItemCount, setCartItemCount] = useState(0)

  // 장바구니 개수 가져오기
  useEffect(() => {
    const fetchCartCount = async () => {
      if (session?.user) {
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
  }, [session])

  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            ultra V
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/products"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              상품
            </Link>

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

            {isLoading ? (
              <div className="flex items-center gap-2 text-gray-400">
                <User size={20} />
                <span>로딩중...</span>
              </div>
            ) : session?.user ? (
              <UserDropdown
                userName={session.user.name || session.user.email || '사용자'}
                userEmail={session.user.email || undefined}
              />
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <User size={20} />
                <span>로그인</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
