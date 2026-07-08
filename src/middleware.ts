import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // /login 페이지 처리
  if (pathname === "/login") {
    if (session?.user) {
      if (session.user.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // /admin/login 페이지 처리 (기존 관리자 로그인)
  if (pathname === "/admin/login") {
    if (session?.user?.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // /en/login 페이지 처리 (영문 로그인)
  if (pathname === "/en/login") {
    if (session?.user) {
      return NextResponse.redirect(new URL("/en", req.url));
    }
    return NextResponse.next();
  }

  // 영문 사이트 보호 경로 (마이페이지/장바구니) → 비로그인 시 영문 로그인으로
  if (pathname.startsWith("/en/mypage") || pathname.startsWith("/en/cart")) {
    if (!session || !session.user) {
      return NextResponse.redirect(new URL("/en/login", req.url));
    }
    return NextResponse.next();
  }

  // 영문 사이트(/en/*)와 영문 문의 API는 로그인 없이 공개 접근 허용
  if (
    pathname === "/en" ||
    pathname.startsWith("/en/") ||
    pathname === "/api/inquiries"
  ) {
    return NextResponse.next();
  }

  // 비인증 사용자 → /login으로 리다이렉트
  if (!session || !session.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 관리자 페이지 접근 제어
  if (pathname.startsWith("/admin")) {
    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/auth|api/popups|_next/static|_next/image|favicon\\.ico|images/).*)",
  ],
};
