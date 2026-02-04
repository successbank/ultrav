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
} from "lucide-react"

interface Carousel {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  imageUrl: string
  linkUrl: string | null
  linkText: string | null
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function CarouselsManagementPage() {
  const [carousels, setCarousels] = useState<Carousel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCarousels()
  }, [])

  const fetchCarousels = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/carousels")
      if (!response.ok) throw new Error("Failed to fetch carousels")
      const data = await response.json()
      setCarousels(data)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const carousel = carousels.find((c) => c.id === id)
      if (!carousel) return

      const response = await fetch(`/api/admin/carousels/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...carousel,
          isActive: !currentStatus,
        }),
      })

      if (!response.ok) throw new Error("활성화 상태 변경 실패")
      await fetchCarousels()
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return

    try {
      const response = await fetch(`/api/admin/carousels/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("삭제 실패")
      await fetchCarousels()
      alert("삭제되었습니다")
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0) return

    const newCarousels = [...carousels]
    const temp = newCarousels[index]
    newCarousels[index] = newCarousels[index - 1]
    newCarousels[index - 1] = temp

    await updateOrders(newCarousels)
  }

  const handleMoveDown = async (index: number) => {
    if (index === carousels.length - 1) return

    const newCarousels = [...carousels]
    const temp = newCarousels[index]
    newCarousels[index] = newCarousels[index + 1]
    newCarousels[index + 1] = temp

    await updateOrders(newCarousels)
  }

  const updateOrders = async (newCarousels: Carousel[]) => {
    try {
      const updates = newCarousels.map((carousel, index) =>
        fetch(`/api/admin/carousels/${carousel.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...carousel,
            order: index,
          }),
        })
      )

      await Promise.all(updates)
      await fetchCarousels()
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
            <h2 className="text-2xl font-bold text-gray-900">캐러셀 관리</h2>
            <p className="text-gray-600 mt-1">메인페이지 캐러셀 슬라이드를 관리합니다</p>
          </div>
        </div>
        <Link href="/admin/settings/carousels/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            새 캐러셀 추가
          </Button>
        </Link>
      </div>

      {/* 캐러셀 목록 */}
      {carousels.length === 0 ? (
        <Card className="p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">캐러셀이 없습니다</h3>
          <p className="text-gray-600 mb-6">첫 번째 캐러셀을 추가해보세요</p>
          <Link href="/admin/settings/carousels/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              캐러셀 추가
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {carousels.map((carousel, index) => (
            <Card
              key={carousel.id}
              className={`p-6 ${!carousel.isActive ? "opacity-60 bg-gray-50" : ""}`}
            >
              <div className="flex gap-6">
                {/* 이미지 미리보기 */}
                <div className="flex-shrink-0 w-48 h-32 relative rounded-lg overflow-hidden bg-gray-200">
                  {carousel.imageUrl ? (
                    <Image
                      src={carousel.imageUrl}
                      alt={carousel.title}
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
                        {carousel.title}
                        {!carousel.isActive && (
                          <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">
                            비활성
                          </span>
                        )}
                      </h3>
                      {carousel.subtitle && (
                        <p className="text-sm text-gray-600">{carousel.subtitle}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {/* 순서 변경 */}
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
                        disabled={index === carousels.length - 1}
                        className="p-2 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        title="아래로 이동"
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {carousel.description && (
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                      {carousel.description}
                    </p>
                  )}

                  {carousel.linkUrl && (
                    <div className="flex items-center gap-2 text-sm text-blue-600 mb-3">
                      <ExternalLink className="w-3 h-3" />
                      <span className="truncate">{carousel.linkUrl}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(carousel.id, carousel.isActive)}
                      className={`px-3 py-1.5 text-sm rounded ${
                        carousel.isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {carousel.isActive ? (
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

                    <Link href={`/admin/settings/carousels/${carousel.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-3 h-3 mr-1" />
                        수정
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(carousel.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      삭제
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
