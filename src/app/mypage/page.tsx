import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { User, Mail, Phone, MapPin } from "lucide-react"

export default async function MyPage() {
  const session = await auth()

  if (!session || !session.user) {
    redirect("/login")
  }

  const user = session.user

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">마이페이지</h1>

        <div className="grid gap-6">
          {/* 사용자 정보 카드 */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name || "사용자"}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail size={20} className="text-gray-400" />
                <span>{user.email}</span>
              </div>

              {/* 추가 정보가 있다면 표시 */}
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  회원 등급: {user.role === 'ADMIN' ? '관리자' : '일반 회원'}
                </p>
              </div>
            </div>
          </Card>

          {/* 빠른 링크 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-2">주문 내역</h3>
              <p className="text-sm text-gray-600">주문한 상품을 확인하세요</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-2">찜 목록</h3>
              <p className="text-sm text-gray-600">관심 상품을 모아보세요</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-2">설정</h3>
              <p className="text-sm text-gray-600">회원 정보를 수정하세요</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
