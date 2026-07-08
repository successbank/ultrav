"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import {
  FileText,
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  Calendar,
  User,
  Briefcase,
} from "lucide-react"

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
  salesManager: {
    id: string
    email: string
    name: string | null
  }
  _count: {
    items: number
  }
}

interface Stats {
  total: number
  byStatus: Record<string, number>
  amounts: {
    totalQuoted: number
    totalDiscount: number
    totalOriginal: number
    avgQuoted: number
    avgDiscount: number
  }
  bySalesManager: Array<{
    manager: {
      id: string
      name: string | null
      email: string
    } | undefined
    quoteCount: number
    totalAmount: number
  }>
}

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [quotesRes, statsRes] = await Promise.all([
        fetch("/api/admin/quotes"),
        fetch("/api/admin/quotes/stats"),
      ])

      if (!quotesRes.ok || !statsRes.ok) {
        throw new Error("데이터를 불러오는데 실패했습니다")
      }

      const quotesData = await quotesRes.json()
      const statsData = await statsRes.json()

      setQuotes(quotesData)
      setStats(statsData)
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

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "HOSPITAL":
        return "병원"
      case "USER":
        return "일반회원"
      default:
        return role
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
      {/* 헤더 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">견적서 관리</h2>
        <p className="text-gray-600 mt-1">전체 견적서 및 통계를 관리합니다</p>
      </div>

      {/* 통계 카드 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">총 견적서</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText size={24} className="text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">승인률</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total > 0
                    ? Math.round((stats.byStatus.APPROVED / stats.total) * 100)
                    : 0}
                  %
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp size={24} className="text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">총 견적 금액</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(stats.amounts.totalQuoted)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <DollarSign size={24} className="text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">총 할인 금액</p>
                <p className="text-2xl font-bold text-red-600">
                  -{formatPrice(stats.amounts.totalDiscount)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <TrendingUp size={24} className="text-red-600" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 상태별 통계 */}
      {stats && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">상태별 통계</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(stats.byStatus).map(([status, count]) => {
              const statusInfo = getStatusInfo(status)
              return (
                <div key={status} className="text-center">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${statusInfo.color} mb-2`}
                  >
                    {statusInfo.label}
                  </span>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* 영업매니저별 실적 */}
      {stats && stats.bySalesManager.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">영업매니저별 실적</h3>
          <div className="space-y-3">
            {stats.bySalesManager.map((stat, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Briefcase size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {stat.manager?.name || "알 수 없음"}
                    </p>
                    <p className="text-sm text-gray-600">{stat.manager?.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">견적서 {stat.quoteCount}개</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatPrice(stat.totalAmount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

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

      {/* 견적서 목록 */}
      <div className="space-y-4">
        {filteredQuotes.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">견적서가 없습니다</h3>
            <p className="text-gray-600">조건에 맞는 견적서가 없습니다</p>
          </Card>
        ) : (
          filteredQuotes.map((quote) => {
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
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                      {isExpired && quote.status === "SENT" && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                          만료됨
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>
                          고객: {quote.customer.name || quote.customer.email} (
                          {getRoleLabel(quote.customer.role)})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span>
                          담당: {quote.salesManager.name || quote.salesManager.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>{quote._count.items}개 항목</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(quote.createdAt).toLocaleDateString("ko-KR")}</span>
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

                  <Link href={`/admin/quotes/${quote.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      상세보기
                    </Button>
                  </Link>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
