"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { FileText, Eye, Calendar, User } from "lucide-react"

interface Quote {
  id: string
  quoteNumber: string
  status: string
  totalAmount: number
  originalAmount: number
  discountAmount: number
  validUntil: string
  createdAt: string
  customer: {
    id: string
    email: string
    name: string | null
    role: string
  }
  _count: {
    items: number
  }
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchQuotes()
  }, [])

  const fetchQuotes = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/sales-manager/quotes")
      if (!response.ok) throw new Error("견적서 목록을 불러오는데 실패했습니다")
      const data = await response.json()
      setQuotes(data)
    } catch (err: any) {
      alert(err.message)
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

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PENDING":
        return { label: "작성중", color: "bg-gray-100 text-gray-800" }
      case "SENT":
        return { label: "전송됨", color: "bg-blue-100 text-blue-800" }
      case "APPROVED":
        return { label: "승인됨", color: "bg-green-100 text-green-800" }
      case "REJECTED":
        return { label: "거부됨", color: "bg-red-100 text-red-800" }
      case "EXPIRED":
        return { label: "만료됨", color: "bg-orange-100 text-orange-800" }
      case "ORDERED":
        return { label: "주문완료", color: "bg-purple-100 text-purple-800" }
      default:
        return { label: status, color: "bg-gray-100 text-gray-800" }
    }
  }

  const filteredQuotes = quotes.filter(
    (q) => statusFilter === "all" || q.status === statusFilter
  )

  if (loading) {
    return <div className="text-center py-12">로딩 중...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">견적서 관리</h2>
          <p className="text-gray-600 mt-1">발행한 견적서 목록입니다</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-green-600">{quotes.length}</p>
          <p className="text-sm text-gray-600">총 견적서</p>
        </div>
      </div>

      {/* 필터 */}
      <div className="flex gap-2">
        <Button
          variant={statusFilter === "all" ? "primary" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("all")}
        >
          전체
        </Button>
        <Button
          variant={statusFilter === "SENT" ? "primary" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("SENT")}
        >
          전송됨
        </Button>
        <Button
          variant={statusFilter === "APPROVED" ? "primary" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("APPROVED")}
        >
          승인됨
        </Button>
        <Button
          variant={statusFilter === "REJECTED" ? "primary" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("REJECTED")}
        >
          거부됨
        </Button>
      </div>

      {filteredQuotes.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            견적서가 없습니다
          </h3>
          <p className="text-gray-600 mb-4">고객에게 견적서를 발행해보세요</p>
          <Link href="/sales-manager/customers">
            <Button>고객 목록 보기</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredQuotes.map((quote) => {
            const statusInfo = getStatusInfo(quote.status)
            const validDate = new Date(quote.validUntil)
            const isExpired = validDate < new Date()

            return (
              <Card key={quote.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {quote.quoteNumber}
                      </h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      {isExpired && quote.status === "SENT" && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                          만료됨
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {quote.customer.name || quote.customer.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {quote._count.items}개 항목
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(quote.createdAt).toLocaleDateString("ko-KR")}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">원가:</span>{" "}
                        <span className="font-medium text-gray-400 line-through">
                          {formatPrice(quote.originalAmount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">할인:</span>{" "}
                        <span className="font-medium text-red-600">
                          -{formatPrice(quote.discountAmount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">견적가:</span>{" "}
                        <span className="text-xl font-bold text-green-600">
                          {formatPrice(quote.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link href={`/sales-manager/quotes/${quote.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      상세보기
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
