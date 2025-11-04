"use client"

import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

interface AdminHeaderProps {
  user: {
    name?: string | null
    email?: string | null
  }
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 fixed top-0 left-64 right-0 z-10">
      {/* 검색 */}
      <div className="flex-1 max-w-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="search"
            placeholder="검색..."
            className="pl-10 pr-4"
          />
        </div>
      </div>

      {/* 우측 액션 */}
      <div className="flex items-center gap-4">
        {/* 알림 */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        {/* 사용자 정보 */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user.name || "관리자"}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
            {user.name?.charAt(0) || "A"}
          </div>
        </div>
      </div>
    </header>
  )
}
