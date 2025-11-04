'use client'

import { useState } from 'react'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import Button from '@/components/ui/Button'

interface Product {
  id: string
  name: string
  price: number
  discount: number
  stock: number
}

interface AddToCartButtonProps {
  product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const handleIncrease = () => {
    if (quantity < product.stock) setQuantity(quantity + 1)
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      // 로컬 스토리지에 장바구니 저장 (임시)
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')

      const existingItemIndex = cart.findIndex((item: any) => item.productId === product.id)

      if (existingItemIndex >= 0) {
        // 이미 있는 상품이면 수량 증가
        cart[existingItemIndex].quantity += quantity
      } else {
        // 새로운 상품 추가
        cart.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          discount: product.discount,
          quantity: quantity,
        })
      }

      localStorage.setItem('cart', JSON.stringify(cart))

      // 성공 알림
      alert(`${product.name}이(가) 장바구니에 추가되었습니다!`)

      // 수량 초기화
      setQuantity(1)
    } catch (error) {
      console.error('장바구니 추가 실패:', error)
      alert('장바구니 추가에 실패했습니다.')
    } finally {
      setIsAdding(false)
    }
  }

  if (product.stock === 0) {
    return (
      <Button variant="secondary" disabled className="w-full py-4 text-lg">
        품절
      </Button>
    )
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="font-semibold">수량</span>
        <div className="flex items-center border rounded-lg">
          <button
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus size={20} />
          </button>
          <span className="px-6 py-2 font-semibold min-w-[4rem] text-center">
            {quantity}
          </span>
          <button
            onClick={handleIncrease}
            disabled={quantity >= product.stock}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="w-full py-4 text-lg flex items-center justify-center gap-2"
      >
        <ShoppingCart size={24} />
        {isAdding ? '추가 중...' : '장바구니 담기'}
      </Button>
    </div>
  )
}
