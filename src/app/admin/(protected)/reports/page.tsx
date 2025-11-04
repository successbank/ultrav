import prisma from "@/lib/prisma"
import { Card } from "@/components/ui/Card"
import { formatPrice } from "@/lib/utils"
import { TrendingUp, Package, ShoppingCart, Users } from "lucide-react"

export default async function AdminReportsPage() {
  // 기본 통계
  const stats = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      where: { status: { in: ['PAID', 'PREPARING', 'SHIPPED', 'DELIVERED'] } },
      _sum: { totalAmount: true }
    })
  ])

  const [totalProducts, totalOrders, totalUsers, revenueAgg] = stats
  const totalRevenue = revenueAgg._sum.totalAmount || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">통계 및 리포트</h1>
        <p className="text-gray-600 mt-2">전체 통계 데이터</p>
      </div>

      {/* 요약 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">총 상품</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalProducts}</p>
            </div>
            <Package className="w-12 h-12 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">총 주문</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalOrders}</p>
            </div>
            <ShoppingCart className="w-12 h-12 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">총 회원</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalUsers}</p>
            </div>
            <Users className="w-12 h-12 text-purple-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">총 매출</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatPrice(totalRevenue)}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-yellow-600" />
          </div>
        </Card>
      </div>

      {/* 추가 리포트 섹션 */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">상세 리포트</h2>
        <p className="text-gray-600">
          상세한 매출 분석, 상품별 판매 통계, 카테고리별 매출 등의 리포트 기능은 추가 개발이 필요합니다.
        </p>
      </Card>
    </div>
  )
}
