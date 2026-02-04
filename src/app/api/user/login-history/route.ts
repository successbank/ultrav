import { auth } from "@/lib/auth"
import { getLoginHistory } from "@/lib/loginHistory"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // 인증 확인
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "인증이 필요합니다" },
        { status: 401 }
      )
    }

    // URL 파라미터로 limit 받기 (기본값: 20)
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "20", 10)

    // 로그인 기록 조회
    const history = await getLoginHistory(session.user.id, limit)

    return NextResponse.json({
      success: true,
      data: history,
    })
  } catch (error) {
    console.error("로그인 기록 조회 실패:", error)
    return NextResponse.json(
      { error: "로그인 기록을 불러오는데 실패했습니다" },
      { status: 500 }
    )
  }
}
