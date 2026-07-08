'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSearch = searchParams.get('search') || ''

  const [query, setQuery] = useState(currentSearch)
  const [mobileOpen, setMobileOpen] = useState(false)
  const mobileInputRef = useRef<HTMLInputElement>(null)

  // URL 변경 시 입력값 동기화 (뒤로가기 대응)
  useEffect(() => {
    setQuery(currentSearch)
  }, [currentSearch])

  // 모바일 검색바 열릴 때 자동 포커스
  useEffect(() => {
    if (mobileOpen && mobileInputRef.current) {
      mobileInputRef.current.focus()
    }
  }, [mobileOpen])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return

    const params = new URLSearchParams()
    // 기존 category, sort 보존
    const category = searchParams.get('category')
    const sort = searchParams.get('sort')
    if (category) params.set('category', category)
    if (sort) params.set('sort', sort)
    params.set('search', trimmed)

    router.push(`/products?${params.toString()}`)
    setMobileOpen(false)
  }

  function handleClear() {
    setQuery('')
    // search만 제거하고 나머지 파라미터 보존
    const params = new URLSearchParams()
    const category = searchParams.get('category')
    const sort = searchParams.get('sort')
    if (category) params.set('category', category)
    if (sort) params.set('sort', sort)

    const qs = params.toString()
    router.push(qs ? `/products?${qs}` : '/products')
  }

  return (
    <>
      {/* 데스크탑: 인라인 검색 필드 */}
      <form onSubmit={handleSubmit} className="hidden md:flex items-center relative">
        <Search size={16} className="absolute left-3 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="상품 검색..."
          className="w-48 lg:w-64 pl-9 pr-8 py-1.5 text-sm border border-gray-300 rounded-full bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}
      </form>

      {/* 모바일: 돋보기 아이콘 */}
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
        aria-label="검색 열기"
      >
        <Search size={20} />
      </button>

      {/* 모바일: 확장 검색바 */}
      {mobileOpen && (
        <div className="absolute left-0 right-0 top-full bg-white border-b shadow-sm px-4 py-3 md:hidden z-50">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                ref={mobileInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="상품 검색..."
                className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-full bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none transition-colors"
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-gray-500 hover:text-gray-700 shrink-0"
            >
              취소
            </button>
          </form>
        </div>
      )}
    </>
  )
}
