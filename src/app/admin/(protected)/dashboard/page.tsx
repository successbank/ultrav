import prisma from "@/lib/prisma"
import { Card } from "@/components/ui/Card"
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  DollarSign,
  AlertTriangle
} from "lucide-react"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"

async function getDashboardStats() {
  const [
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue,
    pendingOrders,
    lowStockProducts,
    recentOrders,
    topProducts
  ] = await Promise.all([
    // 총 상품 수
    prisma.product.count({ where: { isActive: true } }),

    // 총 주문 수
    prisma.order.count(),

    // 총 사용자 수
    prisma.user.count(),

    // 총 매출 (PAID 이상 상태)
    prisma.order.aggregate({
      where: {
        status: {
          in: ['PAID', 'PREPARING', 'SHIPPED', 'DELIVERED']
        }
      },
      _sum: {
        totalAmount: true
      }
    }),

    // 대기 중인 주문
    prisma.order.count({
      where: { status: 'PENDING' }
    }),

    // 재고 부족 상품 (10개 이하)
    prisma.product.count({
      where: {
        isActive: true,
        stock: {
          lte: 10
        }
      }
    }),

    // 최근 주문 10건
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      }
    }),

    // 인기 상품 TOP 5 (주문 아이템 수 기준)
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    })
  ])

  // 인기 상품 상세 정보 가져오기
  const topProductsWithDetails = await prisma.product.findMany({
    where: {
      id: {
        in: topProducts.map(p => p.productId)
      }
    }
  })

  return {
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    pendingOrders,
    lowStockProducts,
    recentOrders,
    topProducts: topProducts.map(tp => ({
      ...topProductsWithDetails.find(p => p.id === tp.productId)!,
      soldQuantity: tp._sum.quantity || 0
    }))
  }
}

const statusText: Record<string, string> = {
  PENDING: '결제 대기',
  PAID: '결제 완료',
  PREPARING: '배송 준비',
  SHIPPED: '배송중',
  DELIVERED: '배송 완료',
  CANCELLED: '취소',
  REFUNDED: '환불'
}

const statusColor: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800'
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600 mt-2">Ultra 쇼핑몰 관리자 대시보드</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">총 상품</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">총 주문</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
              {stats.pendingOrders > 0 && (
                <p className="text-xs text-yellow-600 mt-1">대기 {stats.pendingOrders}건</p>
              )}
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">총 회원</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">총 매출</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatPrice(stats.totalRevenue)}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* 경고 알림 */}
      {stats.lowStockProducts > 0 && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">
                재고 부족 상품이 {stats.lowStockProducts}개 있습니다.
              </p>
              <Link href="/admin/products?filter=low-stock" className="text-sm text-yellow-700 hover:underline">
                확인하기 →
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* 최근 주문 & 인기 상품 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 주문 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">최근 주문</h2>
            <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">
              전체 보기 →
            </Link>
          </div>

          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{order.orderNumber}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[order.status]}`}>
                    {statusText[order.status]}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>{order.user.name} ({order.user.email})</p>
                  <p className="mt-1">{formatPrice(order.totalAmount)} · {order.items.length}개 상품</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* 인기 상품 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">인기 상품 TOP 5</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {stats.topProducts.map((product, index) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{product.soldQuantity}개 판매</p>
                    <p className="text-xs text-gray-500">{formatPrice(product.price)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
