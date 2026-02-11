import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { headers } from "next/headers"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
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
