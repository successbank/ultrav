import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { User, ShoppingBag, Heart, Settings } from "lucide-react"

export default async function MyPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session || !session.user) {
    redirect("/login")
  }

  const menuItems = [
    {
      href: "/mypage",
      icon: User,
      label: "내 정보",
      exact: true,
    },
    {
      href: "/mypage/orders",
      icon: ShoppingBag,
      label: "주문 내역",
    },
    {
      href: "/mypage/wishlist",
      icon: Heart,
      label: "찜 목록",
    },
    {
      href: "/mypage/settings",
      icon: Settings,
      label: "설정",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">마이페이지</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* 사이드바 네비게이션 */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-6 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* 사용자 정보 요약 */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                  {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session.user.name || "사용자"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* 메인 컨텐츠 영역 */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
