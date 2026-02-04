"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { ArrowLeft, Plus, Minus, Trash2, FileText } from "lucide-react"
import Link from "next/link"

interface CartItem {
  id: string
  product: {
    id: string
    name: string
    brand: string
    imageUrl: string | null
    category: string
    originalPrice: number
    discount: number
    discountedPrice: number
  }
  quantity: number
  itemTotal: number
}

interface CustomerCart {
  customer: {
    id: string
    email: string
    name: string | null
    role: string
    phone: string | null
    address: string | null
  }
  cart: {
    id: string
    items: CartItem[]
    itemCount: number
    totalOriginalPrice: number
    totalDiscountedPrice: number
    totalDiscount: number
  }
}

interface QuoteItem {
  productId: string
  productName: string
  quantity: number
  originalPrice: number
  quotedPrice: number
}

export default function CreateQuotePage() {
  const params = useParams()
  const router = useRouter()
  const customerId = params.customerId as string

  const [customerCart, setCustomerCart] = useState<CustomerCart | null>(null)
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([])
  const [validDays, setValidDays] = useState(7)
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCustomerCart()
  }, [customerId])

  const fetchCustomerCart = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/sales-manager/customers/${customerId}/cart`)

      if (!response.ok) {
        throw new Error("장바구니를 불러오는데 실패했습니다")
      }

      const data = await response.json()
      setCustomerCart(data)

      // 장바구니 아이템을 견적 아이템으로 변환
      const items = data.cart.items.map((item: CartItem) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        originalPrice: item.product.discountedPrice,
        quotedPrice: item.product.discountedPrice, // 초기값은 할인가격
      }))
      setQuoteItems(items)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateQuotedPrice = (index: number, price: number) => {
    const updated = [...quoteItems]
    updated[index].quotedPrice = price
    setQuoteItems(updated)
  }

  const removeItem = (index: number) => {
    setQuoteItems(quoteItems.filter((_, i) => i !== index))
  }

  const calculateTotals = () => {
    const originalTotal = quoteItems.reduce(
      (sum, item) => sum + item.originalPrice * item.quantity,
      0
    )
    const quotedTotal = quoteItems.reduce(
      (sum, item) => sum + item.quotedPrice * item.quantity,
      0
    )
    const discountAmount = originalTotal - quotedTotal
    const discountRate = originalTotal > 0 ? (discountAmount / originalTotal) * 100 : 0

    return {
      originalTotal,
      quotedTotal,
      discountAmount,
      discountRate,
    }
  }

  const handleSubmit = async () => {
    if (quoteItems.length === 0) {
      alert("견적 항목을 추가해주세요")
      return
    }

    try {
      setSubmitting(true)

      const response = await fetch("/api/sales-manager/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          items: quoteItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            quotedPrice: item.quotedPrice,
          })),
          validDays,
          notes,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "견적서 생성에 실패했습니다")
      }

      const quote = await response.json()
      alert("견적서가 생성되었습니다!")
      router.push(`/sales-manager/quotes/${quote.id}`)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price)
  }

  const totals = calculateTotals()

  if (loading) {
    return <div className="text-center py-12">로딩 중...</div>
  }

  if (error || !customerCart) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || "데이터를 불러올 수 없습니다"}</p>
        <Link href="/sales-manager/customers">
          <Button className="mt-4">고객 목록으로</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Link href="/sales-manager/customers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">견적서 작성</h2>
          <p className="text-gray-600 mt-1">
            {customerCart.customer.name || customerCart.customer.email}
          </p>
        </div>
      </div>

      {/* 고객 정보 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">고객 정보</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">이름:</span>{" "}
            <span className="font-medium">{customerCart.customer.name || "-"}</span>
          </div>
          <div>
            <span className="text-gray-600">이메일:</span>{" "}
            <span className="font-medium">{customerCart.customer.email}</span>
          </div>
          <div>
            <span className="text-gray-600">전화번호:</span>{" "}
            <span className="font-medium">{customerCart.customer.phone || "-"}</span>
          </div>
          <div>
            <span className="text-gray-600">주소:</span>{" "}
            <span className="font-medium">{customerCart.customer.address || "-"}</span>
          </div>
        </div>
      </Card>

      {/* 견적 항목 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">견적 항목</h3>
        <div className="space-y-4">
          {quoteItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-gray-600">수량: {item.quantity}개</p>
                <p className="text-sm text-gray-600">
                  원가: {formatPrice(item.originalPrice)}원
                </p>
              </div>
              <div className="w-48">
                <label className="block text-xs text-gray-600 mb-1">견적가 (단가)</label>
                <input
                  type="number"
                  value={item.quotedPrice}
                  onChange={(e) => updateQuotedPrice(index, parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="0"
                />
              </div>
              <div className="w-32 text-right">
                <p className="text-sm text-gray-600">합계</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatPrice(item.quotedPrice * item.quantity)}원
                </p>
              </div>
              <button
                onClick={() => removeItem(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* 견적 옵션 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">견적 옵션</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              유효기간
            </label>
            <select
              value={validDays}
              onChange={(e) => setValidDays(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value={3}>3일</option>
              <option value={7}>7일 (기본)</option>
              <option value={14}>14일</option>
              <option value={30}>30일</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              메모 (선택사항)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="고객에게 전달할 메시지를 입력하세요"
            />
          </div>
        </div>
      </Card>

      {/* 총액 */}
      <Card className="p-6 bg-gray-50">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">원가 총액</span>
            <span className="font-medium">{formatPrice(totals.originalTotal)}원</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">할인 금액</span>
            <span className="text-red-600 font-medium">
              -{formatPrice(totals.discountAmount)}원 ({totals.discountRate.toFixed(1)}%)
            </span>
          </div>
          <div className="border-t pt-3 flex justify-between">
            <span className="text-lg font-semibold">견적 총액</span>
            <span className="text-2xl font-bold text-green-600">
              {formatPrice(totals.quotedTotal)}원
            </span>
          </div>
        </div>
      </Card>

      {/* 액션 버튼 */}
      <div className="flex gap-4">
        <Link href="/sales-manager/customers" className="flex-1">
          <Button variant="outline" className="w-full">
            취소
          </Button>
        </Link>
        <Button
          onClick={handleSubmit}
          disabled={submitting || quoteItems.length === 0}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <FileText className="w-4 h-4 mr-2" />
          {submitting ? "생성 중..." : "견적서 생성"}
        </Button>
      </div>
    </div>
  )
}
