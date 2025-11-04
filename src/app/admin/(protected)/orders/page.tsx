import prisma from "@/lib/prisma"
import Link from "next/link"
import { Card } from "@/components/ui/Card"
import { formatPrice } from "@/lib/utils"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/Button"

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

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">주문 관리</h1>
        <p className="text-gray-600 mt-2">총 {orders.length}개의 주문</p>
      </div>

      {/* 주문 목록 */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">주문번호</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">주문자</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">상품 수</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">금액</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">상태</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-900">주문일</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-900">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-gray-900">{order.orderNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{order.user.name}</p>
                      <p className="text-sm text-gray-500">{order.user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.items.length}개</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{formatPrice(order.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColor[order.status]}`}>
                      {statusText[order.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">주문 내역이 없습니다.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
