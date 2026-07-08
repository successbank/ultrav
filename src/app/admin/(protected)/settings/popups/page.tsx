"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  ExternalLink,
  Code,
} from "lucide-react"

interface LayerPopup {
  id: string
  title: string
  contentType: string
  imageUrl: string
  content: string | null
  linkUrl: string | null
  startDate: string | null
  endDate: string | null
  order: number
  isActive: boolean
  width: number
  height: number
  createdAt: string
  updatedAt: string
}

function getScheduleBadge(popup: LayerPopup) {
  const now = new Date()
  const start = popup.startDate ? new Date(popup.startDate) : null
  const end = popup.endDate ? new Date(popup.endDate) : null

  if (end && end < now) {
    return { label: "종료", className: "bg-gray-200 text-gray-600" }
  }
  if (start && start > now) {
    return { label: "예정", className: "bg-yellow-100 text-yellow-700" }
  }
  return { label: "진행중", className: "bg-green-100 text-green-700" }
}

export default function PopupsManagementPage() {
  const [popups, setPopups] = useState<LayerPopup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPopups()
  }, [])

  const fetchPopups = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/popups")
      if (!response.ok) throw new Error("Failed to fetch popups")
      const data = await response.json()
      setPopups(data)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const popup = popups.find((p) => p.id === id)
      if (!popup) return

      const response = await fetch(`/api/admin/popups/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...popup,
          isActive: !currentStatus,
        }),
      })

      if (!response.ok) throw new Error("활성화 상태 변경 실패")
      await fetchPopups()
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return

    try {
      const response = await fetch(`/api/admin/popups/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("삭제 실패")
      await fetchPopups()
      alert("삭제되었습니다")
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0) return

    const newPopups = [...popups]
    const temp = newPopups[index]
    newPopups[index] = newPopups[index - 1]
    newPopups[index - 1] = temp

    await updateOrders(newPopups)
  }

  const handleMoveDown = async (index: number) => {
    if (index === popups.length - 1) return

    const newPopups = [...popups]
    const temp = newPopups[index]
    newPopups[index] = newPopups[index + 1]
    newPopups[index + 1] = temp

    await updateOrders(newPopups)
  }

  const updateOrders = async (newPopups: LayerPopup[]) => {
    try {
      const updates = newPopups.map((popup, index) =>
        fetch(`/api/admin/popups/${popup.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...popup,
            order: index,
          }),
        })
      )

      await Promise.all(updates)
      await fetchPopups()
    } catch (error: any) {
      alert("순서 변경 실패: " + error.message)
    }
  }

  if (loading) {
    return <div className="text-center py-12">로딩 중...</div>
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/settings">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">레이어 팝업 관리</h2>
            <p className="text-gray-600 mt-1">홈페이지 방문 시 표시되는 팝업을 관리합니다</p>
          </div>
        </div>
        <Link href="/admin/settings/popups/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            새 팝업 추가
          </Button>
        </Link>
      </div>

      {/* 팝업 목록 */}
      {popups.length === 0 ? (
        <Card className="p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">레이어 팝업이 없습니다</h3>
          <p className="text-gray-600 mb-6">첫 번째 팝업을 추가해보세요</p>
          <Link href="/admin/settings/popups/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              팝업 추가
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {popups.map((popup, index) => {
            const badge = getScheduleBadge(popup)
            return (
              <Card
                key={popup.id}
                className={`p-6 ${!popup.isActive ? "opacity-60 bg-gray-50" : ""}`}
              >
                <div className="flex gap-6">
                  {/* 미리보기 */}
                  <div className="flex-shrink-0 w-36 h-44 relative rounded-lg overflow-hidden bg-gray-200">
                    {popup.contentType === "html" ? (
                      <div className="w-full h-full p-2 text-xs text-gray-600 overflow-hidden">
                        <div className="flex items-center gap-1 mb-1 text-blue-600 font-medium">
                          <Code className="w-3 h-3" />
                          HTML
                        </div>
                        <p className="line-clamp-5">
                          {popup.content?.replace(/<[^>]*>/g, "").slice(0, 100) || "내용 없음"}
                        </p>
                      </div>
                    ) : popup.imageUrl ? (
                      <Image
                        src={popup.imageUrl}
                        alt={popup.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        이미지 없음
                      </div>
                    )}
                  </div>

                  {/* 정보 */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          {popup.title}
                          <span className={`px-2 py-0.5 text-xs rounded ${badge.className}`}>
                            {badge.label}
                          </span>
                          {!popup.isActive && (
                            <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">
                              비활성
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {popup.width} x {popup.height}px
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-2 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                          title="위로 이동"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === popups.length - 1}
                          className="p-2 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                          title="아래로 이동"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {popup.linkUrl && (
                      <div className="flex items-center gap-2 text-sm text-blue-600 mb-3">
                        <ExternalLink className="w-3 h-3" />
                        <span className="truncate">{popup.linkUrl}</span>
                      </div>
                    )}

                    {(popup.startDate || popup.endDate) && (
                      <p className="text-sm text-gray-500 mb-3">
                        {popup.startDate
                          ? new Date(popup.startDate).toLocaleDateString("ko-KR")
                          : "즉시"}{" "}
                        ~{" "}
                        {popup.endDate
                          ? new Date(popup.endDate).toLocaleDateString("ko-KR")
                          : "무기한"}
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(popup.id, popup.isActive)}
                        className={`px-3 py-1.5 text-sm rounded ${
                          popup.isActive
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {popup.isActive ? (
                          <>
                            <Eye className="w-3 h-3 inline mr-1" />
                            활성화
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 inline mr-1" />
                            비활성화
                          </>
                        )}
                      </button>

                      <Link href={`/admin/settings/popups/${popup.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-3 h-3 mr-1" />
                          수정
                        </Button>
                      </Link>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(popup.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        삭제
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
