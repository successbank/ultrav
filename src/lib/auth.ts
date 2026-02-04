import NextAuth, { type DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import type { UserRole } from "@prisma/client"
import { headers } from "next/headers"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: UserRole
    } & DefaultSession["user"]
  }

  interface User {
    role: UserRole
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role: UserRole
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  basePath: "/api/auth",
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // 로그인 성공 시 기록 저장
      try {
        const { saveLoginHistory, getClientIp } = await import("@/lib/loginHistory")
        const headersList = await headers()
        const ipAddress = getClientIp(headersList)
        const userAgent = headersList.get("user-agent") || "Unknown"

        if (user.id) {
          await saveLoginHistory({
            userId: user.id,
            ipAddress,
            userAgent,
            success: true,
          })
        }
      } catch (error) {
        console.error("Failed to record login history:", error)
      }
    },
  },
  callbacks: {
    authorized: async ({ auth, request }) => {
      const { pathname } = request.nextUrl

      // 로그인 페이지는 항상 접근 허용
      if (pathname === "/login" || pathname === "/admin/login") {
        return true
      }

      // 다른 페이지는 미들웨어에서 처리
      return undefined
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role
      }
      return session
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        // 로그인 실패 기록을 위한 헤더 정보 수집
        let ipAddress = "127.0.0.1"
        let userAgent = "Unknown"

        try {
          const headersList = await headers()
          const { getClientIp } = await import("@/lib/loginHistory")
          ipAddress = getClientIp(headersList)
          userAgent = headersList.get("user-agent") || "Unknown"
        } catch (error) {
          console.error("Failed to get headers:", error)
        }

        if (!user || !user.password) {
          // 사용자가 존재하지 않거나 비밀번호가 없는 경우
          if (user?.id) {
            const { saveLoginHistory } = await import("@/lib/loginHistory")
            await saveLoginHistory({
              userId: user.id,
              ipAddress,
              userAgent,
              success: false,
              failReason: "Invalid credentials",
            })
          }
          return null
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) {
          // 비밀번호가 일치하지 않는 경우
          const { saveLoginHistory } = await import("@/lib/loginHistory")
          await saveLoginHistory({
            userId: user.id,
            ipAddress,
            userAgent,
            success: false,
            failReason: "Invalid password",
          })
          return null
        }

        // 로그인 성공
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
})
