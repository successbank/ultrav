'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Edit, Eye, Trash2 } from 'lucide-react'

interface ProductActionsProps {
  productId: string
  productName: string
}

export default function ProductActions({
  productId,
  productName,
}: ProductActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (
      !confirm(
        `정말로 "${productName}" 상품을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
      )
    ) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('상품이 삭제되었습니다')
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || '상품 삭제에 실패했습니다')
      }
    } catch (error) {
      console.error('상품 삭제 실패:', error)
      alert('상품 삭제에 실패했습니다')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* 바로보기 */}
      <Link
        href={`/products/${productId}`}
        target="_blank"
        className="inline-flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        title="상품 페이지 보기"
      >
        <Eye size={16} />
      </Link>

      {/* 수정 */}
      <Link
        href={`/admin/products/${productId}`}
        className="inline-flex items-center gap-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
        title="상품 수정"
      >
        <Edit size={16} />
      </Link>

      {/* 삭제 */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="inline-flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="상품 삭제"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
