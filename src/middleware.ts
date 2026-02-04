import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // /login 페이지 처리
  if (pathname === "/login") {
    // 이미 로그인된 사용자는 메인페이지로 리다이렉트
    if (session?.user) {
      return NextResponse.redirect(new URL("/", req.url))
    }
    return NextResponse.next()
  }

  // /admin/login 페이지 처리 (기존 관리자 로그인)
  if (pathname === "/admin/login") {
    if (session?.user?.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url))
    }
    return NextResponse.next()
  }

  // 비인증 사용자 → /login으로 리다이렉트
  if (!session || !session.user) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // 관리자 페이지 접근 제어
  if (pathname.startsWith("/admin")) {
    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon\\.ico|public/).*)",
  ],
}
