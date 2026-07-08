'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatPrice, formatDate } from '@/lib/utils'
import { ArrowLeft, Package, Loader2 } from 'lucide-react'
import Link from 'next/link'

const statusText: Record<string, string> = {
  PENDING: '결제 대기',
  PAID: '결제 완료',
  PREPARING: '배송 준비',
  SHIPPED: '배송중',
  DELIVERED: '배송 완료',
  CANCELLED: '취소',
  REFUNDED: '환불',
}

const statusColor: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
}

// 현재 상태에 따라 가능한 다음 상태
const allowedTransitions: Record<string, string[]> = {
  PENDING: ['PAID', 'CANCELLED'],
  PAID: ['PREPARING', 'CANCELLED', 'REFUNDED'],
  PREPARING: ['SHIPPED', 'CANCELLED', 'REFUNDED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: ['REFUNDED'],
  CANCELLED: [],
  REFUNDED: [],
}

interface OrderDetail {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  shippingAddr: string
  recipientName: string
  recipientPhone: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    phone: string | null
  }
  items: Array<{
    id: string
    quantity: number
    price: number
    product: {
      id: string
      name: string
      brand: string
      imageUrl: string | null
      stock: number
    }
  }>
}

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    fetchOrder()
  }, [params.id])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
        setSelectedStatus(data.status)
      } else {
        alert('주문을 찾을 수 없습니다')
        router.push('/admin/orders')
      }
    } catch (error) {
      console.error('주문 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async () => {
    if (!order || selectedStatus === order.status) return
    if (updating) return

    const isDestructive = ['CANCELLED', 'REFUNDED'].includes(selectedStatus)
    if (isDestructive) {
      const confirmed = confirm(
        `주문을 "${statusText[selectedStatus]}" 상태로 변경하시겠습니까?\n재고가 복원됩니다.`
      )
      if (!confirmed) {
        setSelectedStatus(order.status)
        return
      }
    }

    setUpdating(true)
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedStatus }),
      })

      if (response.ok) {
        const updatedOrder = await response.json()
        setOrder(updatedOrder)
        setSelectedStatus(updatedOrder.status)
      } else {
        const data = await response.json()
        alert(data.error || '상태 변경에 실패했습니다')
        setSelectedStatus(order.status)
      }
    } catch (error) {
      console.error('상태 변경 실패:', error)
      alert('상태 변경 중 오류가 발생했습니다')
      setSelectedStatus(order.status)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
          <Card className="p-6">
            <div className="h-64 bg-gray-200 rounded" />
          </Card>
        </div>
      </div>
    )
  }

  if (!order) return null

  const transitions = allowedTransitions[order.status] || []

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              목록
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              주문 상세
            </h1>
            <p className="text-sm text-gray-500 font-mono">{order.orderNumber}</p>
          </div>
        </div>
        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${statusColor[order.status]}`}>
          {statusText[order.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 좌측: 주문 정보 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 주문 상품 */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">주문 상품</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">상품</th>
                    <th className="text-right px-4 py-2 text-sm font-medium text-gray-700">단가</th>
                    <th className="text-right px-4 py-2 text-sm font-medium text-gray-700">수량</th>
                    <th className="text-right px-4 py-2 text-sm font-medium text-gray-700">소계</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                            {item.product.imageUrl ? (
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={14} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                            <p className="text-xs text-gray-500">{item.product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900">
                        {formatPrice(item.price)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right font-bold text-gray-900">
                      총 금액
                    </td>
                    <td className="px-4 py-3 text-right text-lg font-bold text-blue-600">
                      {formatPrice(order.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>

          {/* 배송 정보 */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">배송 정보</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">받는 분</dt>
                <dd className="text-gray-900 font-medium">{order.recipientName}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">연락처</dt>
                <dd className="text-gray-900 font-medium">{order.recipientPhone}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm text-gray-500">배송 주소</dt>
                <dd className="text-gray-900 font-medium">{order.shippingAddr}</dd>
              </div>
            </dl>
          </Card>
        </div>

        {/* 우측: 주문자 정보 + 상태 변경 */}
        <div className="space-y-6">
          {/* 주문자 정보 */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">주문자 정보</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-500">이름</dt>
                <dd className="text-gray-900 font-medium">{order.user.name}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">이메일</dt>
                <dd className="text-gray-900 font-medium">{order.user.email}</dd>
              </div>
              {order.user.phone && (
                <div>
                  <dt className="text-sm text-gray-500">연락처</dt>
                  <dd className="text-gray-900 font-medium">{order.user.phone}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-gray-500">주문일시</dt>
                <dd className="text-gray-900 font-medium">{formatDate(order.createdAt)}</dd>
              </div>
            </dl>
          </Card>

          {/* 상태 변경 */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">상태 변경</h2>

            {transitions.length > 0 ? (
              <div className="space-y-3">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={updating}
                >
                  <option value={order.status}>
                    {statusText[order.status]} (현재)
                  </option>
                  {transitions.map((s) => (
                    <option key={s} value={s}>
                      {statusText[s]}
                    </option>
                  ))}
                </select>

                <Button
                  className="w-full"
                  onClick={handleStatusChange}
                  disabled={updating || selectedStatus === order.status}
                  variant={
                    ['CANCELLED', 'REFUNDED'].includes(selectedStatus)
                      ? 'danger'
                      : 'primary'
                  }
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      변경중...
                    </>
                  ) : (
                    '상태 변경'
                  )}
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                현재 상태에서는 변경할 수 없습니다.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
