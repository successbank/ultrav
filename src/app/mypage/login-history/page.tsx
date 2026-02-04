"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/Card"
import {
  Monitor,
  Smartphone,
  Tablet,
  CheckCircle,
  XCircle,
  MapPin,
  Globe,
  Calendar,
  AlertTriangle,
} from "lucide-react"

interface LoginRecord {
  id: string
  ipAddress: string
  device: string | null
  browser: string | null
  os: string | null
  country: string | null
  city: string | null
  success: boolean
  failReason: string | null
  createdAt: string
}

export default function LoginHistoryPage() {
  const [history, setHistory] = useState<LoginRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLoginHistory()
  }, [])

  const fetchLoginHistory = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/user/login-history?limit=20")
      const data = await response.json()

      if (data.success) {
        setHistory(data.data)
      } else {
        setError("로그인 기록을 불러올 수 없습니다.")
      }
    } catch (err) {
      setError("로그인 기록을 불러오는 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const getDeviceIcon = (device: string | null) => {
    switch (device) {
      case "Mobile":
        return <Smartphone size={20} className="text-blue-600" />
      case "Tablet":
        return <Tablet size={20} className="text-purple-600" />
      default:
        return <Monitor size={20} className="text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date)
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "방금 전"
    if (diffMins < 60) return `${diffMins}분 전`
    if (diffHours < 24) return `${diffHours}시간 전`
    if (diffDays < 7) return `${diffDays}일 전`
    return formatDate(dateString)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <AlertTriangle size={48} className="mx-auto mb-4" />
          <p>{error}</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">로그인 기록</h1>
        <p className="text-gray-600">
          최근 로그인 활동을 확인하고 계정 보안을 관리하세요.
        </p>
      </div>

      {history.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500">로그인 기록이 없습니다.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((record) => (
            <Card
              key={record.id}
              className={`p-6 ${
                !record.success ? "border-l-4 border-red-500" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* 디바이스 아이콘 */}
                  <div className="mt-1">{getDeviceIcon(record.device)}</div>

                  <div className="flex-1 space-y-3">
                    {/* 헤더 */}
                    <div className="flex items-center gap-2">
                      {record.success ? (
                        <CheckCircle size={20} className="text-green-600" />
                      ) : (
                        <XCircle size={20} className="text-red-600" />
                      )}
                      <span
                        className={`font-semibold ${
                          record.success ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {record.success ? "로그인 성공" : "로그인 실패"}
                      </span>
                      <span className="text-gray-500 text-sm ml-auto">
                        {getRelativeTime(record.createdAt)}
                      </span>
                    </div>

                    {/* 실패 이유 */}
                    {!record.success && record.failReason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-700">
                          실패 이유: {record.failReason}
                        </p>
                      </div>
                    )}

                    {/* 세부 정보 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {/* 디바이스 정보 */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <Monitor size={16} className="text-gray-400" />
                        <span>
                          {record.device || "Unknown"} · {record.browser || "Unknown Browser"}
                        </span>
                      </div>

                      {/* OS 정보 */}
                      {record.os && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Globe size={16} className="text-gray-400" />
                          <span>{record.os}</span>
                        </div>
                      )}

                      {/* 위치 정보 */}
                      {(record.country || record.city) && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin size={16} className="text-gray-400" />
                          <span>
                            {record.city && record.country
                              ? `${record.city}, ${record.country}`
                              : record.country || record.city}
                          </span>
                        </div>
                      )}

                      {/* IP 주소 */}
                      <div className="flex items-center gap-2 text-gray-700">
                        <Globe size={16} className="text-gray-400" />
                        <span className="font-mono text-xs">
                          {record.ipAddress}
                        </span>
                      </div>

                      {/* 정확한 시간 */}
                      <div className="flex items-center gap-2 text-gray-700 md:col-span-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{formatDate(record.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 보안 팁 */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <AlertTriangle size={20} />
          보안 팁
        </h3>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• 알 수 없는 위치에서의 로그인 시도가 있다면 즉시 비밀번호를 변경하세요.</li>
          <li>• 로그인 실패 기록이 많다면 누군가 계정에 접근을 시도하고 있을 수 있습니다.</li>
          <li>• 정기적으로 로그인 기록을 확인하여 계정 보안을 유지하세요.</li>
        </ul>
      </Card>
    </div>
  )
}
