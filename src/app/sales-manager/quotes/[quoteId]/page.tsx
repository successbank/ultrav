"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { ArrowLeft, Download, Mail, Phone, MapPin } from "lucide-react"
import { generateQuotePDF } from "@/lib/pdfGenerator"

interface QuoteDetail {
  id: string
  quoteNumber: string
  status: string
  totalAmount: number
  originalAmount: number
  discountAmount: number
  validUntil: string
  notes: string | null
  createdAt: string
  customer: {
    id: string
    email: string
    name: string | null
    role: string
    phone: string | null
    address: string | null
  }
  salesManager: {
    id: string
    email: string
    name: string | null
    phone: string | null
  }
  items: Array<{
    id: string
    quantity: number
    originalPrice: number
    quotedPrice: number
    product: {
      id: string
      name: string
      brand: string
      imageUrl: string | null
      category: {
        name: string
      }
    }
  }>
}

export default function QuoteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const quoteId = params.quoteId as string

  const [quote, setQuote] = useState<QuoteDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuote()
  }, [quoteId])

  const fetchQuote = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/sales-manager/quotes/${quoteId}`)
      if (!response.ok) throw new Error("견적서를 불러오는데 실패했습니다")
      const data = await response.json()
      setQuote(data)
    } catch (err: any) {
      alert(err.message)
      router.push("/sales-manager/quotes")
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price)
  }

  const handleDownloadPDF = () => {
    if (!quote) return
    generateQuotePDF(quote)
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "SENT":
        return { label: "전송됨", color: "bg-blue-100 text-blue-800" }
      case "APPROVED":
        return { label: "승인됨", color: "bg-green-100 text-green-800" }
      case "REJECTED":
        return { label: "거부됨", color: "bg-red-100 text-red-800" }
      default:
        return { label: status, color: "bg-gray-100 text-gray-800" }
    }
  }

  if (loading || !quote) {
    return <div className="text-center py-12">로딩 중...</div>
  }

  const statusInfo = getStatusInfo(quote.status)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/sales-manager/quotes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{quote.quoteNumber}</h2>
            <p className="text-gray-600 mt-1">
              {new Date(quote.createdAt).toLocaleDateString("ko-KR")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <Download className="w-4 h-4 mr-2" />
            PDF 다운로드
          </Button>
          <span className={`px-4 py-2 text-sm font-medium rounded-full ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* 고객 정보 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">고객 정보</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-sm">
              <strong>{quote.customer.name || "이름 없음"}</strong> ({quote.customer.email})
            </span>
          </div>
          {quote.customer.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{quote.customer.phone}</span>
            </div>
          )}
          {quote.customer.address && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{quote.customer.address}</span>
            </div>
          )}
        </div>
      </Card>

      {/* 견적 항목 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">견적 항목</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">제품</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-900">수량</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-900">원가</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-900">견적가</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-900">합계</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {quote.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{item.product.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.product.brand} · {item.product.category.name}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-sm">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-500 line-through">
                    {formatPrice(item.originalPrice)}원
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium">
                    {formatPrice(item.quotedPrice)}원
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-green-600">
                    {formatPrice(item.quotedPrice * item.quantity)}원
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 메모 */}
      {quote.notes && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">메모</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{quote.notes}</p>
        </Card>
      )}

      {/* 총액 */}
      <Card className="p-6 bg-gray-50">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">원가 총액</span>
            <span className="font-medium">{formatPrice(quote.originalAmount)}원</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">할인 금액</span>
            <span className="text-red-600 font-medium">
              -{formatPrice(quote.discountAmount)}원
            </span>
          </div>
          <div className="border-t pt-3 flex justify-between">
            <span className="text-lg font-semibold">견적 총액</span>
            <span className="text-2xl font-bold text-green-600">
              {formatPrice(quote.totalAmount)}원
            </span>
          </div>
          <div className="text-sm text-gray-600 text-right">
            유효기간: {new Date(quote.validUntil).toLocaleDateString("ko-KR")}
          </div>
        </div>
      </Card>
    </div>
  )
}
