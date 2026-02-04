import prisma from "@/lib/prisma"
import geoip from "geoip-lite"
import { UAParser } from "ua-parser-js"

interface LoginHistoryData {
  userId: string
  ipAddress: string
  userAgent: string
  success: boolean
  failReason?: string
}

/**
 * 로그인 기록을 저장하는 함수
 */
export async function saveLoginHistory(data: LoginHistoryData) {
  try {
    // IP 주소로부터 위치 정보 추출
    const geo = geoip.lookup(data.ipAddress)

    // User-Agent 파싱
    const parser = new UAParser(data.userAgent)
    const result = parser.getResult()

    // 디바이스 타입 결정
    let device = "Desktop"
    if (result.device.type === "mobile") {
      device = "Mobile"
    } else if (result.device.type === "tablet") {
      device = "Tablet"
    }

    // 로그인 기록 저장
    const loginHistory = await prisma.loginHistory.create({
      data: {
        userId: data.userId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        device,
        browser: result.browser.name
          ? `${result.browser.name} ${result.browser.version || ""}`
          : undefined,
        os: result.os.name
          ? `${result.os.name} ${result.os.version || ""}`
          : undefined,
        country: geo?.country || undefined,
        city: geo?.city || undefined,
        success: data.success,
        failReason: data.failReason,
      },
    })

    return loginHistory
  } catch (error) {
    console.error("Failed to save login history:", error)
    // 로그인 기록 저장 실패는 로그인 프로세스에 영향을 주지 않도록 에러를 던지지 않음
    return null
  }
}

/**
 * 사용자의 최근 로그인 기록을 조회하는 함수
 */
export async function getLoginHistory(userId: string, limit: number = 10) {
  try {
    const history = await prisma.loginHistory.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    })

    return history
  } catch (error) {
    console.error("Failed to fetch login history:", error)
    return []
  }
}

/**
 * 클라이언트 IP 주소를 추출하는 함수
 * Next.js의 headers()를 사용하여 요청 헤더에서 IP를 추출
 */
export function getClientIp(headers: Headers): string {
  // x-forwarded-for 헤더 확인 (프록시/로드밸런서 뒤에 있을 경우)
  const forwardedFor = headers.get("x-forwarded-for")
  if (forwardedFor) {
    // 여러 IP가 있을 경우 첫 번째가 실제 클라이언트 IP
    return forwardedFor.split(",")[0].trim()
  }

  // x-real-ip 헤더 확인
  const realIp = headers.get("x-real-ip")
  if (realIp) {
    return realIp
  }

  // Vercel의 경우
  const vercelIp = headers.get("x-vercel-forwarded-for")
  if (vercelIp) {
    return vercelIp.split(",")[0].trim()
  }

  // 기본값 (로컬 개발 환경)
  return "127.0.0.1"
}
