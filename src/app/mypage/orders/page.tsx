import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/Card"
import prisma from "@/lib/prisma"
import { formatPrice, formatDate } from "@/lib/utils"
import { Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

// 주문 상태별 스타일과 아이콘
const statusConfig = {
  PENDING: {
    label: "결제 대기",
    color: "text-yellow-600 bg-yellow-50",
    icon: Clock,
  },
  PAID: {
    label: "결제 완료",
    color: "text-green-600 bg-green-50",
    icon: CheckCircle,
  },
  PREPARING: {
    label: "배송 준비",
    color: "text-blue-600 bg-blue-50",
    icon: Package,
  },
  SHIPPED: {
    label: "배송중",
    color: "text-purple-600 bg-purple-50",
    icon: Truck,
  },
  DELIVERED: {
    label: "배송 완료",
    color: "text-green-600 bg-green-50",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "취소",
    color: "text-red-600 bg-red-50",
    icon: XCircle,
  },
  REFUNDED: {
    label: "환불",
    color: "text-gray-600 bg-gray-50",
    icon: XCircle,
  },
}

export default async function OrdersPage() {
  const session = await auth()

  if (!session || !session.user) {
    redirect("/login")
  }

  // 사용자의 주문 내역 가져오기
  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">주문 내역</h2>
        <Card className="p-12 text-center">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            주문 내역이 없습니다
          </h3>
          <p className="text-gray-600 mb-6">
            아직 주문한 상품이 없습니다. 다양한 상품을 둘러보세요!
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            상품 둘러보기
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">주문 내역</h2>
        <p className="text-sm text-gray-600">총 {orders.length}건</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const config = statusConfig[order.status]
          const StatusIcon = config.icon

          return (
            <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
              {/* 주문 헤더 */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      주문번호: {order.orderNumber}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color} flex items-center gap-1`}>
                      <StatusIcon size={16} />
                      {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    주문일: {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>
              </div>

              {/* 주문 상품 목록 */}
              <div className="space-y-3 mb-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={24} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="font-medium text-gray-900 hover:text-blue-600 line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-600">
                        {item.product.brand} · 수량: {item.quantity}개
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 배송 정보 */}
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">받는 사람</p>
                    <p className="font-medium text-gray-900">
                      {order.recipientName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">연락처</p>
                    <p className="font-medium text-gray-900">
                      {order.recipientPhone}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600 mb-1">배송지</p>
                    <p className="font-medium text-gray-900">
                      {order.shippingAddr}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
