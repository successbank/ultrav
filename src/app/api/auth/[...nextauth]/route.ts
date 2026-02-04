import { handlers, auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  // Extract the path segments
  const url = new URL(req.url)
  const pathSegments = url.pathname.split('/').filter(Boolean)

  // Check if this is a session request: /api/auth/session
  if (pathSegments.length === 3 && pathSegments[2] === 'session') {
    const session = await auth()
    return NextResponse.json(session)
  }

  // For all other requests, use the default NextAuth handler
  return handlers.GET(req)
}

export const POST = handlers.POST
