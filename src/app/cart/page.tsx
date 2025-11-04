'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import Button from '@/components/ui/Button'
import { formatPrice, calculateDiscountedPrice } from '@/lib/utils'

interface CartItem {
  productId: string
  name: string
  price: number
  discount: number
  quantity: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 장바구니 로드
  useEffect(() => {
    const loadCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        setCartItems(cart)
      } catch (error) {
        console.error('장바구니 로드 실패:', error)
        setCartItems([])
      } finally {
        setIsLoading(false)
      }
    }

    loadCart()
  }, [])

  // 장바구니 저장
  const saveCart = (items: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(items))
    setCartItems(items)
  }

  // 수량 증가
  const handleIncrease = (productId: string) => {
    const updatedCart = cartItems.map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
    saveCart(updatedCart)
  }

  // 수량 감소
  const handleDecrease = (productId: string) => {
    const updatedCart = cartItems.map((item) =>
      item.productId === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    )
    saveCart(updatedCart)
  }

  // 상품 삭제
  const handleRemove = (productId: string) => {
    if (confirm('이 상품을 장바구니에서 삭제하시겠습니까?')) {
      const updatedCart = cartItems.filter((item) => item.productId !== productId)
      saveCart(updatedCart)
    }
  }

  // 전체 삭제
  const handleClearCart = () => {
    if (confirm('장바구니를 비우시겠습니까?')) {
      saveCart([])
    }
  }

  // 총 금액 계산
  const totalAmount = cartItems.reduce((sum, item) => {
    const itemPrice = calculateDiscountedPrice(item.price, item.discount)
    return sum + itemPrice * item.quantity
  }, 0)

  const totalDiscount = cartItems.reduce((sum, item) => {
    const originalPrice = item.price * item.quantity
    const discountedPrice = calculateDiscountedPrice(item.price, item.discount) * item.quantity
    return sum + (originalPrice - discountedPrice)
  }, 0)

  const totalOriginalPrice = cartItems.reduce((sum, item) => {
    return sum + item.price * item.quantity
  }, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">장바구니</h1>
          <p className="text-gray-600">{cartItems.length}개의 상품</p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingBag size={64} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-semibold mb-2 text-gray-700">
              장바구니가 비어있습니다
            </h2>
            <p className="text-gray-500 mb-6">
              마음에 드는 상품을 장바구니에 담아보세요!
            </p>
            <Link href="/products">
              <Button>상품 둘러보기</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between">
                  <h2 className="text-xl font-semibold">상품 목록</h2>
                  <Button variant="ghost" size="sm" onClick={handleClearCart}>
                    전체 삭제
                  </Button>
                </div>

                {/* Items List */}
                <div className="divide-y">
                  {cartItems.map((item) => {
                    const discountedPrice = calculateDiscountedPrice(item.price, item.discount)
                    const itemTotal = discountedPrice * item.quantity

                    return (
                      <div key={item.productId} className="p-6">
                        <div className="flex gap-4">
                          {/* Product Image Placeholder */}
                          <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">이미지</span>
                          </div>

                          {/* Product Info */}
                          <div className="flex-1">
                            <Link
                              href={`/products/${item.productId}`}
                              className="font-semibold hover:text-blue-600 transition-colors mb-1 block"
                            >
                              {item.name}
                            </Link>

                            {/* Price */}
                            <div className="flex items-center gap-2 mb-3">
                              {item.discount > 0 ? (
                                <>
                                  <span className="font-bold text-lg">
                                    {formatPrice(discountedPrice)}
                                  </span>
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(item.price)}
                                  </span>
                                  <span className="text-sm text-red-600 font-semibold">
                                    {item.discount}% OFF
                                  </span>
                                </>
                              ) : (
                                <span className="font-bold text-lg">
                                  {formatPrice(item.price)}
                                </span>
                              )}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-4">
                              <div className="flex items-center border rounded-lg">
                                <button
                                  onClick={() => handleDecrease(item.productId)}
                                  disabled={item.quantity <= 1}
                                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleIncrease(item.productId)}
                                  className="p-2 hover:bg-gray-100"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>

                              {/* Item Total */}
                              <span className="font-bold text-lg ml-auto">
                                {formatPrice(itemTotal)}
                              </span>

                              {/* Remove Button */}
                              <button
                                onClick={() => handleRemove(item.productId)}
                                className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">주문 요약</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>상품 금액</span>
                    <span>{formatPrice(totalOriginalPrice)}</span>
                  </div>

                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>할인 금액</span>
                      <span>-{formatPrice(totalDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-700">
                    <span>배송비</span>
                    <span className="text-green-600">무료</span>
                  </div>

                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span>총 결제 금액</span>
                      <span className="text-blue-600">{formatPrice(totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link href="/login">
                  <Button className="w-full py-4 text-lg">
                    결제하기
                  </Button>
                </Link>

                <p className="text-center text-sm text-gray-500 mt-4">
                  로그인 후 결제를 진행하실 수 있습니다
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
