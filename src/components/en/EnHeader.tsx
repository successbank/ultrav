"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  User,
  ShoppingCart,
  Headphones,
  Search,
  LogIn,
  LogOut,
} from "lucide-react";

// 영문 B2B 사이트 헤더 (한국어 Header.tsx 스타일 패턴을 따름)
export default function EnHeader() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    router.push(
      q ? `/en/products?search=${encodeURIComponent(q)}` : "/en/products",
    );
  };

  return (
    <header className="relative border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* 좌측: 로고 + 네비게이션 */}
          <div className="flex items-center gap-8">
            <Link href="/en">
              <Image
                src="/images/logo.png"
                alt="Ultra V"
                width={120}
                height={40}
                className="object-contain h-auto"
                unoptimized
              />
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/en/products"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Product
              </Link>
              <Link
                href="/en/inquiry"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Inquiry
              </Link>
              <Link
                href="/en/about"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                About Us
              </Link>
              <Link
                href="/en/notice"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Notice
              </Link>
            </nav>
          </div>

          {/* 언어 전환: 영문 사이트 → 한국어 사이트 */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/"
              className="text-gray-500 hover:text-blue-600 transition-colors"
            >
              KO
            </Link>
            <span className="text-gray-300">|</span>
            <span className="text-blue-600">EN</span>
          </div>

          {/* 우측: 검색 + 아이콘 링크 */}
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="hidden lg:block">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products…"
                  className="w-56 pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>

            <Link
              href="/en/mypage"
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="My page"
              title="My page"
            >
              <User size={20} />
            </Link>
            <Link
              href="/en/cart"
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="Cart"
              title="Cart"
            >
              <ShoppingCart size={20} />
            </Link>
            <Link
              href="/en/inquiry"
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="Customer Center"
              title="Customer Center"
            >
              <Headphones size={20} />
            </Link>

            {status === "authenticated" && session?.user ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-gray-700 max-w-[140px] truncate">
                  {session.user.name || session.user.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/en" })}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/en/login"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <LogIn size={16} />
                  Sign In
                </Link>
                <Link
                  href="/en/signup"
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
