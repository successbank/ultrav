'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Trash2 } from 'lucide-react'
import ImageUploader from './ImageUploader'
import RichTextEditor from './RichTextEditor'

interface Product {
  id: string
  name: string
  brand: string
  description: string | null
  detailContent?: string | null
  price: number
  discount: number
  categoryId: string
  imageUrl: string | null
  images: string[]
  stock: number
  isActive: boolean
}

interface Category {
  id: string
  name: string
}

interface ProductEditFormProps {
  product: Product
  categories: Category[]
}

export default function ProductEditForm({
  product,
  categories,
}: ProductEditFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // 초기 이미지 배열 (기존 imageUrl + images 배열 합치기)
  const initialImages = [
    product.imageUrl || '',
    ...product.images,
  ].filter(Boolean)

  const [formData, setFormData] = useState({
    name: product.name,
    brand: product.brand,
    description: product.description || '',
    detailContent: product.detailContent || '',
    price: product.price,
    discount: product.discount,
    categoryId: product.categoryId,
    stock: product.stock,
    isActive: product.isActive,
    images: initialImages,
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleImagesChange = (images: string[]) => {
    setFormData((prev) => ({
      ...prev,
      images,
    }))
  }

  const handleDetailContentChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      detailContent: content,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrl: formData.images[0] || null,
          images: formData.images.slice(1), // 첫 번째 제외 나머지
        }),
      })

      if (response.ok) {
        alert('상품이 수정되었습니다')
        router.push('/admin/products')
        router.refresh()
      } else {
        const error = await response.json()
        alert(error.error || '상품 수정에 실패했습니다')
      }
    } catch (error) {
      console.error('상품 수정 실패:', error)
      alert('상품 수정에 실패했습니다')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (
      !confirm(
        '정말로 이 상품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
      )
    ) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('상품이 삭제되었습니다')
        router.push('/admin/products')
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 상품 이미지 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상품 이미지 (최대 5장)
          </label>
          <ImageUploader
            images={formData.images}
            onChange={handleImagesChange}
            maxImages={5}
          />
          <p className="mt-2 text-sm text-gray-500">
            첫 번째 이미지가 메인 이미지로 사용됩니다
          </p>
        </div>

        {/* 기본 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 상품명 */}
          <div className="md:col-span-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              상품명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 브랜드 */}
          <div>
            <label
              htmlFor="brand"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              브랜드 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              카테고리 <span className="text-red-500">*</span>
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 간단한 설명 */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            간단한 설명
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="상품 목록에 표시될 간단한 설명을 입력하세요"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 상세 내용 (리치 텍스트 에디터) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상세 내용
          </label>
          <RichTextEditor
            value={formData.detailContent}
            onChange={handleDetailContentChange}
            placeholder="상품의 상세 설명, 사용 방법, 특징 등을 입력하세요"
          />
        </div>

        {/* 가격 및 할인 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              가격 (원) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="discount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              할인율 (%)
            </label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              재고 수량 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 판매 상태 */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
            판매 활성화
          </label>
        </div>

        {/* 버튼 */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            <span>{isSaving ? '저장 중...' : '저장'}</span>
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-6 py-3 flex items-center gap-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={20} />
            <span>{isDeleting ? '삭제 중...' : '삭제'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
