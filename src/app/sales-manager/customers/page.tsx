"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { ShoppingCart, FileText, Building2, User, Phone } from "lucide-react"

interface Customer {
  id: string
  email: string
  name: string | null
  role: string
  phone: string | null
  cartItemCount: number
  cartTotal: number
  orderCount: number
  quoteCount: number
  lastActivity: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/sales-manager/customers")

      if (!response.ok) {
        throw new Error("고객 목록을 불러오는데 실패했습니다")
      }

      const data = await response.json()
      setCustomers(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price)
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "HOSPITAL":
        return { label: "병원", color: "bg-blue-100 text-blue-800", icon: Building2 }
      case "USER":
        return { label: "일반회원", color: "bg-gray-100 text-gray-800", icon: User }
      default:
        return { label: role, color: "bg-gray-100 text-gray-800", icon: User }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <Button onClick={fetchCustomers} className="mt-4">
          다시 시도
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">고객 관리</h2>
          <p className="text-gray-600 mt-1">
            장바구니에 상품을 담은 고객 목록입니다
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-green-600">{customers.length}</p>
          <p className="text-sm text-gray-600">활성 고객</p>
        </div>
      </div>

      {customers.length === 0 ? (
        <Card className="p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            장바구니가 있는 고객이 없습니다
          </h3>
          <p className="text-gray-600">
            고객이 장바구니에 상품을 담으면 여기에 표시됩니다
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => {
            const roleInfo = getRoleLabel(customer.role)
            const RoleIcon = roleInfo.icon

            return (
              <Card key={customer.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {customer.name || "이름 없음"}
                    </h3>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${roleInfo.color}`}>
                    <RoleIcon className="w-3 h-3" />
                    {roleInfo.label}
                  </span>
                </div>

                {customer.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Phone className="w-4 h-4" />
                    {customer.phone}
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">장바구니</span>
                    <span className="font-semibold text-gray-900">
                      {customer.cartItemCount}개 상품
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">장바구니 금액</span>
                    <span className="font-semibold text-green-600">
                      {formatPrice(customer.cartTotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">총 주문</span>
                    <span className="font-medium text-gray-900">
                      {customer.orderCount}건
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">견적서</span>
                    <span className="font-medium text-gray-900">
                      {customer.quoteCount}건
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/sales-manager/customers/${customer.id}/cart`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      장바구니 보기
                    </Button>
                  </Link>
                  <Link href={`/sales-manager/customers/${customer.id}/quote`} className="flex-1">
                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                      <FileText className="w-4 h-4 mr-2" />
                      견적서 작성
                    </Button>
                  </Link>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
