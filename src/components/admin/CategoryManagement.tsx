"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, X, AlertTriangle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"

type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  level: number
  parentId: string | null
  parent?: { id: string; name: string } | null
  _count: {
    products: number
    children: number
  }
}

type CategoryFormData = {
  name: string
  slug: string
  description: string
  level: number
  parentId: string
}

type ProductInCategory = {
  id: string
  name: string
  price: number
  imageUrl: string | null
}

type DeleteModalState = {
  isOpen: boolean
  category: Category | null
  products: ProductInCategory[]
  targetCategoryId: string
}

export default function CategoryManagement({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    slug: "",
    description: "",
    level: 1,
    parentId: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    isOpen: false,
    category: null,
    products: [],
    targetCategoryId: ""
  })

  const topLevelCategories = categories.filter(c => c.level === 1)

  // 카테고리 목록 새로고침
  const refreshCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("카테고리 목록 새로고침 실패:", error)
    }
  }

  const resetForm = () => {
    setFormData({ name: "", slug: "", description: "", level: 1, parentId: "" })
    setEditingCategory(null)
    setIsFormOpen(false)
    setError("")
  }

  const handleOpenAddForm = () => {
    resetForm()
    setIsFormOpen(true)
  }

  const handleOpenEditForm = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      level: category.level,
      parentId: category.parentId || ""
    })
    setIsFormOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories"

      const method = editingCategory ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          description: formData.description || null,
          level: formData.level,
          parentId: formData.parentId || null
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "요청에 실패했습니다.")
      }

      // 성공 시 카테고리 목록 새로고침
      await refreshCategories()
      resetForm()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    setLoading(true)
    setError("")

    try {
      // 먼저 카테고리 정보와 연결된 상품 조회
      const categoryResponse = await fetch(`/api/admin/categories/${id}`)
      const categoryData = await categoryResponse.json()

      if (!categoryResponse.ok) {
        throw new Error(categoryData.error || "카테고리 정보를 불러올 수 없습니다.")
      }

      // 하위 카테고리가 있는 경우
      if (categoryData._count.children > 0) {
        alert("하위 카테고리가 있어 삭제할 수 없습니다. 하위 카테고리를 먼저 삭제해주세요.")
        return
      }

      // 연결된 상품이 있는 경우 모달 표시
      if (categoryData._count.products > 0) {
        setDeleteModal({
          isOpen: true,
          category: { ...categoryData, _count: categoryData._count },
          products: categoryData.products,
          targetCategoryId: ""
        })
        return
      }

      // 연결된 상품이 없는 경우 바로 삭제 확인
      if (!confirm(`"${name}" 카테고리를 삭제하시겠습니까?`)) {
        return
      }

      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE"
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "삭제에 실패했습니다.")
      }

      // 성공 시 카테고리 목록 새로고침
      await refreshCategories()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMoveProductsAndDelete = async () => {
    if (!deleteModal.category || !deleteModal.targetCategoryId) {
      alert("이동할 카테고리를 선택해주세요.")
      return
    }

    setLoading(true)

    try {
      // 상품 이동
      const moveResponse = await fetch(`/api/admin/categories/${deleteModal.category.id}/move-products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetCategoryId: deleteModal.targetCategoryId })
      })

      const moveData = await moveResponse.json()

      if (!moveResponse.ok) {
        throw new Error(moveData.error || "상품 이동에 실패했습니다.")
      }

      // 카테고리 삭제
      const deleteResponse = await fetch(`/api/admin/categories/${deleteModal.category.id}`, {
        method: "DELETE"
      })

      const deleteData = await deleteResponse.json()

      if (!deleteResponse.ok) {
        throw new Error(deleteData.error || "카테고리 삭제에 실패했습니다.")
      }

      // 성공 - 모달 닫고 카테고리 목록 새로고침
      setDeleteModal({ isOpen: false, category: null, products: [], targetCategoryId: "" })
      await refreshCategories()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, category: null, products: [], targetCategoryId: "" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">카테고리 관리</h1>
          <p className="text-gray-600 mt-2">총 {categories.length}개의 카테고리</p>
        </div>
        <Button onClick={handleOpenAddForm} disabled={loading}>
          <Plus className="w-4 h-4 mr-2" />
          카테고리 추가
        </Button>
      </div>

      {/* 카테고리 폼 */}
      {isFormOpen && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {editingCategory ? "카테고리 수정" : "새 카테고리 추가"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  카테고리 이름 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  슬러그 (URL용) *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                  disabled={loading}
                  placeholder="예: ultra-call-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설명
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    레벨 *
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: Number(e.target.value), parentId: "" })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                    disabled={loading}
                  >
                    <option value={1}>1 (대분류)</option>
                    <option value={2}>2 (중분류)</option>
                    <option value={3}>3 (소분류)</option>
                  </select>
                </div>

                {formData.level > 1 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      상위 카테고리
                    </label>
                    <select
                      value={formData.parentId}
                      onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                      disabled={loading}
                    >
                      <option value="">선택하세요</option>
                      {categories
                        .filter(c => c.level === formData.level - 1)
                        .map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm} disabled={loading}>
                  취소
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "처리중..." : editingCategory ? "수정" : "추가"}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}

      {/* 카테고리 목록 */}
      <Card>
        <div className="p-6">
          <div className="space-y-4">
            {topLevelCategories.map((category) => {
              const subCategories = categories.filter(c => c.parentId === category.id)

              return (
                <div key={category.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                      <span className="text-sm text-gray-500">
                        ({category._count.products}개 상품)
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditForm(category)}
                        disabled={loading}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleDelete(category.id, category.name)}
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {subCategories.length > 0 && (
                    <div className="ml-6 space-y-2">
                      {subCategories.map((sub) => (
                        <div key={sub.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900">{sub.name}</span>
                            <span className="text-xs text-gray-500">
                              ({sub._count.products}개 상품)
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEditForm(sub)}
                              disabled={loading}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                              onClick={() => handleDelete(sub.id, sub.name)}
                              disabled={loading}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {/* 상품 이동 모달 */}
      {deleteModal.isOpen && deleteModal.category && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">카테고리 삭제 불가</h2>
                  <p className="text-sm text-gray-600">
                    "{deleteModal.category.name}" 카테고리에 {deleteModal.products.length}개의 상품이 있습니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <h3 className="font-medium text-gray-900 mb-3">연결된 상품 목록</h3>
              <div className="space-y-2 mb-6">
                {deleteModal.products.map((product) => (
                  <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {product.price.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-3">
                  상품을 다른 카테고리로 이동 후 삭제
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                      <p className="font-medium text-red-700">{deleteModal.category.name}</p>
                      <p className="text-xs text-red-500">삭제 예정</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <select
                      value={deleteModal.targetCategoryId}
                      onChange={(e) => setDeleteModal({ ...deleteModal, targetCategoryId: e.target.value })}
                      className="w-full px-3 py-3 border rounded-lg"
                      disabled={loading}
                    >
                      <option value="">이동할 카테고리 선택</option>
                      {categories
                        .filter(c => c.id !== deleteModal.category?.id)
                        .map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.level > 1 ? "└ " : ""}{cat.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={closeDeleteModal}
                disabled={loading}
              >
                취소
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleMoveProductsAndDelete}
                disabled={loading || !deleteModal.targetCategoryId}
              >
                {loading ? "처리 중..." : "상품 이동 후 카테고리 삭제"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
