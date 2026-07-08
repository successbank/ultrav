'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { CheckCircle, Package, ShoppingBag } from 'lucide-react'

function OrderCompleteContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('orderNumber')

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-lg">
        <Card className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            주문이 완료되었습니다
          </h1>

          <p className="text-gray-600 mb-6">
            주문해 주셔서 감사합니다. 주문 내역은 마이페이지에서 확인하실 수 있습니다.
          </p>

          {orderNumber && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">주문번호</p>
              <p className="text-lg font-mono font-bold text-gray-900">
                {orderNumber}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/mypage/orders" className="flex-1">
              <Button variant="primary" className="w-full">
                <Package className="w-4 h-4 mr-2" />
                주문 내역 확인
              </Button>
            </Link>
            <Link href="/products" className="flex-1">
              <Button variant="outline" className="w-full">
                <ShoppingBag className="w-4 h-4 mr-2" />
                쇼핑 계속하기
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function CheckoutCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-lg">
            <Card className="p-8 text-center">
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-4" />
                <div className="h-4 bg-gray-200 rounded w-64 mx-auto" />
              </div>
            </Card>
          </div>
        </div>
      }
    >
      <OrderCompleteContent />
    </Suspense>
  )
}
