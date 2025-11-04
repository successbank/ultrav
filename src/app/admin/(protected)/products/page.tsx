import prisma from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { formatPrice, calculateDiscountedPrice } from "@/lib/utils"
import { Plus, Edit, Trash2 } from "lucide-react"

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">상품 관리</h1>
          <p className="text-gray-600 mt-2">총 {products.length}개의 상품</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            상품 추가
          </Button>
        </Link>
      </div>

      {/* 상품 목록 테이블 */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">상품 정보</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">카테고리</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">가격</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">재고</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">상태</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => {
                const discountedPrice = calculateDiscountedPrice(product.price, product.discount)
                const stockStatus = product.stock <= 10 ? 'low' : product.stock <= 50 ? 'medium' : 'high'
                const stockColor = stockStatus === 'low' ? 'text-red-600' : stockStatus === 'medium' ? 'text-yellow-600' : 'text-green-600'

                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.brand}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.category.name}</td>
                    <td className="px-6 py-4">
                      <div>
                        {product.discount > 0 ? (
                          <>
                            <p className="font-medium text-gray-900">{formatPrice(discountedPrice)}</p>
                            <p className="text-xs text-gray-500 line-through">{formatPrice(product.price)}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                              {product.discount}% OFF
                            </span>
                          </>
                        ) : (
                          <p className="font-medium text-gray-900">{formatPrice(product.price)}</p>
                        )}
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm font-medium ${stockColor}`}>
                      {product.stock}개
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        product.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.isActive ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link href={`/admin/products/${product.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">등록된 상품이 없습니다.</p>
              <Link href="/admin/products/new">
                <Button className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  첫 상품 추가하기
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
