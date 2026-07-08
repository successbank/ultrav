import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & import("next-auth").DefaultSession["user"];
  }

  interface User {
    role: UserRole;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role: UserRole;
  }
}

export const authConfig: NextAuthConfig = {
  basePath: "/api/auth",
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: async ({ auth, request }) => {
      const { pathname } = request.nextUrl;

      // 로그인 페이지는 항상 접근 허용
      if (pathname === "/login" || pathname === "/admin/login") {
        return true;
      }

      // 다른 페이지는 미들웨어에서 처리
      return undefined;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
  providers: [],
};
