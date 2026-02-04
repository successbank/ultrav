import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { FileText, Users, LayoutDashboard } from "lucide-react"

export default async function SalesManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // 영업매니저 권한 확인
  if (!session || session.user.role !== "SALES_MANAGER") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">영업매니저 대시보드</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {session.user.name || session.user.email}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 네비게이션 */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-6">
            <Link
              href="/sales-manager"
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 hover:text-green-600 hover:border-b-2 hover:border-green-600"
            >
              <LayoutDashboard className="w-4 h-4" />
              대시보드
            </Link>
            <Link
              href="/sales-manager/customers"
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 hover:text-green-600 hover:border-b-2 hover:border-green-600"
            >
              <Users className="w-4 h-4" />
              고객 관리
            </Link>
            <Link
              href="/sales-manager/quotes"
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 hover:text-green-600 hover:border-b-2 hover:border-green-600"
            >
              <FileText className="w-4 h-4" />
              견적서 관리
            </Link>
          </div>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
