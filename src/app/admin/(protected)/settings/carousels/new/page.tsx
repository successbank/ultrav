"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { ArrowLeft, Upload, Save, X } from "lucide-react"
import ImageUploader from "@/components/admin/ImageUploader"

export default function NewCarouselPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    imageUrl: "",
    linkUrl: "",
    linkText: "자세히 보기",
    order: 0,
    isActive: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.imageUrl) {
      alert("제목과 이미지는 필수입니다")
      return
    }

    try {
      setLoading(true)
      const response = await fetch("/api/admin/carousels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("캐러셀 생성 실패")

      alert("캐러셀이 추가되었습니다")
      router.push("/admin/settings/carousels")
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUploaded = (url: string) => {
    setFormData({ ...formData, imageUrl: url })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Link href="/admin/settings/carousels">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">새 캐러셀 추가</h2>
          <p className="text-gray-600 mt-1">메인페이지에 표시될 캐러셀을 추가합니다</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          {/* 이미지 업로드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이미지 <span className="text-red-500">*</span>
            </label>
            <ImageUploader onImageUploaded={handleImageUploaded} />
            {formData.imageUrl && (
              <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden">
                <Image
                  src={formData.imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, imageUrl: "" })}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="캐러셀 제목"
              required
            />
          </div>

          {/* 부제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">부제목</label>
            <Input
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="캐러셀 부제목 (선택사항)"
            />
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="캐러셀 설명"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* 링크 URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">링크 URL</label>
            <Input
              value={formData.linkUrl}
              onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
              placeholder="클릭시 이동할 URL (예: /products/123)"
            />
          </div>

          {/* 링크 버튼 텍스트 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              링크 버튼 텍스트
            </label>
            <Input
              value={formData.linkText}
              onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
              placeholder="버튼 텍스트 (예: 자세히 보기)"
            />
          </div>

          {/* 순서 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">표시 순서</label>
            <Input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              min={0}
            />
            <p className="text-xs text-gray-500 mt-1">낮은 숫자가 먼저 표시됩니다</p>
          </div>

          {/* 활성화 */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              활성화 (체크시 즉시 메인페이지에 표시)
            </label>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {loading ? "저장 중..." : "저장"}
            </Button>
            <Link href="/admin/settings/carousels" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                취소
              </Button>
            </Link>
          </div>
        </Card>
      </form>
    </div>
  )
}
