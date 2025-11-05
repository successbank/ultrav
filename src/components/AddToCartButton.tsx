'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import QuantitySelector from '@/components/ui/QuantitySelector'

interface Product {
  id: string
  name: string
  price: number
  discount: number
  stock: number
  isActive: boolean
}

interface AddToCartButtonProps {
  product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    // 로그인 확인
    if (status === 'unauthenticated') {
      if (confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
        router.push('/login')
      }
      return
    }

    setIsAdding(true)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      })

      if (response.ok) {
        if (confirm(`${product.name}이(가) 장바구니에 추가되었습니다!\n장바구니로 이동하시겠습니까?`)) {
          router.push('/cart')
        } else {
          setQuantity(1) // 수량 초기화
        }
      } else {
        const error = await response.json()
        alert(error.error || '장바구니 추가에 실패했습니다')
      }
    } catch (error) {
      console.error('장바구니 추가 실패:', error)
      alert('장바구니 추가에 실패했습니다')
    } finally {
      setIsAdding(false)
    }
  }

  if (!product.isActive) {
    return (
      <button
        disabled
        className="w-full py-4 text-lg bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
      >
        판매 종료
      </button>
    )
  }

  if (product.stock === 0) {
    return (
      <button
        disabled
        className="w-full py-4 text-lg bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
      >
        품절
      </button>
    )
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="font-semibold text-gray-900">수량</span>
        <QuantitySelector
          value={quantity}
          max={Math.min(product.stock, 99)}
          onChange={setQuantity}
          disabled={isAdding}
        />
        <span className="text-sm text-gray-600">
          재고: {product.stock}개
        </span>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAdding || status === 'loading'}
        className="w-full py-4 text-lg flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ShoppingCart size={24} />
        {isAdding ? '추가 중...' : '장바구니 담기'}
      </button>

      {status === 'unauthenticated' && (
        <p className="text-sm text-gray-500 text-center">
          장바구니를 사용하려면 로그인이 필요합니다
        </p>
      )}
    </div>
  )
}
