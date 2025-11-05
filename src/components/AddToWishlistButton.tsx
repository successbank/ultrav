'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface AddToWishlistButtonProps {
  productId: string
  productName: string
}

export default function AddToWishlistButton({
  productId,
  productName,
}: AddToWishlistButtonProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 찜 목록에 있는지 확인
  useEffect(() => {
    const checkWishlist = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/wishlist')
          if (response.ok) {
            const wishlist = await response.json()
            const isInList = wishlist.some(
              (item: any) => item.product.id === productId
            )
            setIsInWishlist(isInList)
          }
        } catch (error) {
          console.error('찜 목록 확인 실패:', error)
        }
      }
    }

    checkWishlist()
  }, [session, productId])

  const handleToggleWishlist = async () => {
    // 로그인 확인
    if (status === 'unauthenticated') {
      if (confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
        router.push('/login')
      }
      return
    }

    setIsLoading(true)
    try {
      if (isInWishlist) {
        // 찜 목록에서 제거
        const response = await fetch('/api/wishlist', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId }),
        })

        if (response.ok) {
          setIsInWishlist(false)
          alert(`${productName}을(를) 찜 목록에서 제거했습니다`)
        } else {
          const error = await response.json()
          alert(error.error || '찜 목록에서 제거하는데 실패했습니다')
        }
      } else {
        // 찜 목록에 추가
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId }),
        })

        if (response.ok) {
          setIsInWishlist(true)
          if (
            confirm(
              `${productName}을(를) 찜 목록에 추가했습니다!\n찜 목록으로 이동하시겠습니까?`
            )
          ) {
            router.push('/mypage/wishlist')
          }
        } else {
          const error = await response.json()
          alert(error.error || '찜 목록에 추가하는데 실패했습니다')
        }
      }
    } catch (error) {
      console.error('찜 목록 처리 실패:', error)
      alert('찜 목록 처리에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={isLoading || status === 'loading'}
      className={`flex items-center justify-center gap-2 px-6 py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
        isInWishlist
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-red-500 hover:text-red-500'
      }`}
      aria-label={isInWishlist ? '찜 목록에서 제거' : '찜 목록에 추가'}
    >
      <Heart
        size={24}
        className={isInWishlist ? 'fill-current' : ''}
        strokeWidth={2}
      />
      <span className="font-semibold">
        {isLoading
          ? '처리 중...'
          : isInWishlist
          ? '찜 완료'
          : '찜하기'}
      </span>
    </button>
  )
}
