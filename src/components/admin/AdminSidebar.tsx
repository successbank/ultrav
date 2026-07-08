"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  Users,
  Megaphone,
  BarChart3,
  Settings,
  LogOut,
  FileText,
  Globe,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

const navigation = [
  { name: "대시보드", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "상품 관리", href: "/admin/products", icon: Package },
  { name: "주문 관리", href: "/admin/orders", icon: ShoppingCart },
  { name: "견적서 관리", href: "/admin/quotes", icon: FileText },
  { name: "카테고리", href: "/admin/categories", icon: FolderTree },
  { name: "사용자 관리", href: "/admin/users", icon: Users },
  { name: "영문 문의", href: "/admin/inquiries", icon: Globe },
  { name: "공지사항 관리", href: "/admin/notices", icon: Megaphone },
  { name: "통계/리포트", href: "/admin/reports", icon: BarChart3 },
  { name: "시스템 설정", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col">
      {/* 로고 */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
            U
          </div>
          <span className="text-xl font-bold">Ultra Admin</span>
        </Link>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 로그아웃 버튼 */}
      <div className="p-4 border-t border-gray-800">
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
        >
          <LogOut className="w-5 h-5 mr-3" />
          로그아웃
        </Button>
      </div>
    </aside>
  );
}
