import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/Card"
import Link from "next/link"
import { Mail, ShoppingBag, Heart, Settings, Package, Shield, FileText } from "lucide-react"
import prisma from "@/lib/prisma"

export default async function MyPage() {
  const session = await auth()

  if (!session || !session.user) {
    redirect("/login")
  }

  const user = session.user

  // 통계 데이터 가져오기
  const [orderCount, wishlistCount, quoteCount] = await Promise.all([
    prisma.order.count({
      where: { userId: user.id },
    }),
    prisma.wishlist.count({
      where: { userId: user.id },
    }),
    prisma.quote.count({
      where: { customerId: user.id },
    }),
  ])

  return (
    <div className="space-y-6">
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

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">
              회원 등급: {user.role === 'ADMIN' ? '관리자' : '일반 회원'}
            </p>
          </div>
        </div>
      </Card>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">총 주문 수</p>
              <p className="text-3xl font-bold text-gray-900">{orderCount}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Package size={24} className="text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">찜한 상품</p>
              <p className="text-3xl font-bold text-gray-900">{wishlistCount}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <Heart size={24} className="text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">받은 견적서</p>
              <p className="text-3xl font-bold text-gray-900">{quoteCount}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <FileText size={24} className="text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* 빠른 링크 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Link href="/mypage/orders">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <ShoppingBag size={24} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">주문 내역</h3>
              <p className="text-sm text-gray-600">주문한 상품을 확인하세요</p>
            </div>
          </Card>
        </Link>

        <Link href="/mypage/wishlist">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                <Heart size={24} className="text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">찜 목록</h3>
              <p className="text-sm text-gray-600">관심 상품을 모아보세요</p>
            </div>
          </Card>
        </Link>

        <Link href="/mypage/quotes">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <FileText size={24} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">견적서</h3>
              <p className="text-sm text-gray-600">받은 견적서를 확인하세요</p>
            </div>
          </Card>
        </Link>

        <Link href="/mypage/login-history">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                <Shield size={24} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">로그인 기록</h3>
              <p className="text-sm text-gray-600">계정 보안을 확인하세요</p>
            </div>
          </Card>
        </Link>

        <Link href="/mypage/settings">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Settings size={24} className="text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">설정</h3>
              <p className="text-sm text-gray-600">회원 정보를 수정하세요</p>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  )
}
