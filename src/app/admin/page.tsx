import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import {
  Users,
  Package,
  ShoppingCart,
  Star,
  TrendingUp,
  DollarSign,
} from 'lucide-react'

export default async function AdminPage() {
  const session = await auth()

  // 관리자 권한 확인
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            관리자 대시보드
          </h1>
          <p className="text-gray-600">
            Ultra 쇼핑몰 관리 시스템에 오신 것을 환영합니다
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">총 사용자</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">총 상품</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">총 주문</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">총 매출</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* 관리 메뉴 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/users"
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Users className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                사용자 관리
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              회원 정보 조회, 수정 및 관리
            </p>
          </Link>

          <Link
            href="/admin/products"
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-green-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Package className="text-green-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                상품 관리
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              상품 등록, 수정, 재고 관리
            </p>
          </Link>

          <Link
            href="/admin/orders"
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <ShoppingCart className="text-orange-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                주문 관리
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              주문 내역 조회 및 배송 관리
            </p>
          </Link>

          <Link
            href="/admin/categories"
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-purple-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                카테고리 관리
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              상품 카테고리 등록 및 수정
            </p>
          </Link>

          <Link
            href="/admin/reviews"
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-yellow-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                <Star className="text-yellow-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                리뷰 관리
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              상품 리뷰 조회 및 관리
            </p>
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 opacity-50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-gray-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                매출 통계
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              판매 데이터 분석 및 리포트 (준비 중)
            </p>
          </div>
        </div>

        {/* 알림 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>안내:</strong> 관리자 기능은 현재 개발 중입니다. 일부 기능은
            준비 중일 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}
