import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  User,
  ShoppingBag,
  Heart,
  FileText,
  Shield,
  Settings,
} from "lucide-react";

// 영문 마이페이지 레이아웃 — KO src/app/mypage/layout.tsx 구성을 영문으로 미러링.
export default async function EnMyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/en/login");
  }

  const menuItems = [
    {
      href: "/en/mypage",
      icon: User,
      label: "Dashboard",
    },
    {
      href: "/en/mypage/orders",
      icon: ShoppingBag,
      label: "Orders",
    },
    {
      href: "/en/mypage/wishlist",
      icon: Heart,
      label: "Wishlist",
    },
    {
      href: "/en/mypage/quotes",
      icon: FileText,
      label: "Quotes",
    },
    {
      href: "/en/mypage/login-history",
      icon: Shield,
      label: "Login History",
    },
    {
      href: "/en/mypage/settings",
      icon: Settings,
      label: "Settings",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Page</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* 사이드바 네비게이션 */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-6 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* 사용자 정보 요약 */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white text-xl font-bold">
                  {session.user.name?.charAt(0) ||
                    session.user.email?.charAt(0) ||
                    "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session.user.name || "Customer"}
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
  );
}
