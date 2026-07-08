"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

interface PopupData {
  id: string
  title: string
  contentType: string
  imageUrl: string
  content: string | null
  linkUrl: string | null
  width: number
  height: number
}

export default function LayerPopup() {
  const [popups, setPopups] = useState<PopupData[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    fetchPopups()
  }, [])

  const fetchPopups = async () => {
    try {
      const response = await fetch("/api/popups")
      if (!response.ok) return

      const data: PopupData[] = await response.json()

      // localStorage로 "오늘 하루 보지 않기" 필터링
      const today = new Date().toISOString().slice(0, 10)
      const filtered = data.filter((popup) => {
        const hiddenDate = localStorage.getItem(`ultra_popup_hidden_${popup.id}`)
        return hiddenDate !== today
      })

      if (filtered.length > 0) {
        setPopups(filtered)
        setVisible(true)
      }
    } catch {
      // 팝업 로드 실패 시 무시
    }
  }

  const handleClose = () => {
    setVisible(false)
  }

  const handleHideToday = () => {
    const today = new Date().toISOString().slice(0, 10)
    const current = popups[currentIndex]
    if (current) {
      localStorage.setItem(`ultra_popup_hidden_${current.id}`, today)
    }

    // 다음 팝업이 있으면 이동, 없으면 닫기
    if (currentIndex < popups.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setVisible(false)
    }
  }

  const handleImageClick = () => {
    const current = popups[currentIndex]
    if (current?.linkUrl) {
      window.open(current.linkUrl, "_blank", "noopener,noreferrer")
    }
  }

  if (!visible || popups.length === 0) return null

  const current = popups[currentIndex]

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
      onClick={handleClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-2xl overflow-hidden"
        style={{
          width: current.width,
          height: "auto",
          maxWidth: "calc(100vw - 32px)",
          maxHeight: "calc(100vh - 32px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 바: 카운터 + 닫기 */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-900 text-white text-sm">
          <span>
            {popups.length > 1 && `${currentIndex + 1}/${popups.length}`}
          </span>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-700 rounded"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 팝업 콘텐츠 */}
        {current.contentType === "html" && current.content ? (
          <div
            className="overflow-auto"
            style={{ maxHeight: `calc(100vh - 120px)` }}
            dangerouslySetInnerHTML={{ __html: current.content }}
          />
        ) : (
          <div
            className={current.linkUrl ? "cursor-pointer" : ""}
            onClick={current.linkUrl ? handleImageClick : undefined}
          >
            <img
              src={current.imageUrl}
              alt={current.title}
              style={{
                width: "100%",
                maxHeight: `calc(100vh - 120px)`,
                objectFit: "contain",
              }}
            />
          </div>
        )}

        {/* 하단 액션 바 */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
          <button
            onClick={handleHideToday}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            오늘 하루 보지 않기
          </button>
          <button
            onClick={handleClose}
            className="text-sm font-medium text-gray-900 hover:text-blue-600"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
