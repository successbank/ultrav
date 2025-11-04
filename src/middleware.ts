import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAdminRoute = pathname.startsWith("/admin")
  const isLoginPage = pathname === "/admin/login"

  // 로그인 페이지는 항상 허용
  if (isLoginPage) {
    // 이미 인증된 관리자가 로그인 페이지에 접근하는 경우만 대시보드로 리다이렉트
    if (req.auth?.user?.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url))
    }
    // 인증되지 않은 사용자는 로그인 페이지 접근 허용
    return NextResponse.next()
  }

  // 다른 관리자 페이지 접근 시
  if (isAdminRoute) {
    const session = req.auth

    // 인증되지 않은 경우
    if (!session || !session.user) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }

    // 관리자 권한이 없는 경우
    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*"],
}
