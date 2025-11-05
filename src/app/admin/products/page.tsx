import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { Package, Edit, Plus, Search } from 'lucide-react'

export default async function AdminProductsPage() {
  const session = await auth()

  // 관리자 권한 확인
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  // 상품 목록 가져오기
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const activeCount = products.filter((p) => p.isActive).length
  const inactiveCount = products.filter((p) => !p.isActive).length
  const lowStockCount = products.filter((p) => p.stock < 10).length

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* 헤더 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              상품 관리
            </h1>
            <p className="text-gray-600">등록된 상품을 관리합니다</p>
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>상품 등록</span>
          </Link>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">전체 상품</p>
            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">판매 중</p>
            <p className="text-2xl font-bold text-green-600">{activeCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">판매 중지</p>
            <p className="text-2xl font-bold text-gray-400">{inactiveCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">재고 부족</p>
            <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
          </div>
        </div>

        {/* 상품 목록 테이블 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상품
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    가격
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    재고
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Package size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">등록된 상품이 없습니다</p>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={24} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {product.brand}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {product.category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">
                            {formatPrice(product.price)}
                          </p>
                          {product.discount > 0 && (
                            <p className="text-xs text-red-600">
                              {product.discount}% 할인
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm font-medium ${
                            product.stock === 0
                              ? 'text-red-600'
                              : product.stock < 10
                              ? 'text-orange-600'
                              : 'text-gray-900'
                          }`}
                        >
                          {product.stock}개
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {product.isActive ? '판매중' : '판매중지'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                          <span>수정</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 안내 메시지 */}
        {products.length > 0 && (
          <div className="mt-6 text-sm text-gray-500 text-center">
            총 {products.length}개의 상품이 등록되어 있습니다
          </div>
        )}
      </div>
    </div>
  )
}
