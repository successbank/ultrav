import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
import { auth } from "@/lib/auth";
import UserDropdown from "@/components/ui/UserDropdown";
import HeaderClient from "@/components/HeaderClient";
import SearchBar from "@/components/SearchBar";

export default async function Header() {
  const session = await auth();

  return (
    <header className="relative border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 좌측: 로고 + 네비게이션 메뉴 */}
          <div className="flex items-center gap-8">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="Ultra"
                width={120}
                height={40}
                className="object-contain h-auto"
                unoptimized
              />
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/products"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                제품구매
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                제품문의
              </Link>
              <Link
                href="/notices"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                공지사항
              </Link>
            </nav>
          </div>

          {/* 언어 전환: 한국어 사이트 → 영문 사이트 */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium">
            <span className="text-blue-600">KO</span>
            <span className="text-gray-300">|</span>
            <Link
              href="/en"
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              EN
            </Link>
          </div>

          {/* 우측: 검색 + 장바구니 + 사용자 */}
          <div className="flex items-center gap-6">
            <Suspense fallback={null}>
              <SearchBar />
            </Suspense>

            <HeaderClient userId={session?.user?.id} />

            {session?.user ? (
              <UserDropdown
                userName={session.user.name || session.user.email || "사용자"}
                userEmail={session.user.email || undefined}
                userRole={session.user.role}
              />
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <User size={20} />
                <span>로그인</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
