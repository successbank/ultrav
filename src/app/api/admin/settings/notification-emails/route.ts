import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NOTIFICATION_EMAILS = 3;

// GET /api/admin/settings/notification-emails - 알림 이메일 목록 조회
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    const emails = await prisma.notificationEmail.findMany({
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(emails);
  } catch (error) {
    console.error("알림 이메일 조회 오류:", error);
    return NextResponse.json(
      { error: "알림 이메일 조회에 실패했습니다." },
      { status: 500 },
    );
  }
}

// POST /api/admin/settings/notification-emails - 알림 이메일 추가
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "유효한 이메일 주소를 입력해주세요." },
        { status: 400 },
      );
    }

    const existing = await prisma.notificationEmail.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "이미 등록된 이메일입니다." },
        { status: 409 },
      );
    }

    const count = await prisma.notificationEmail.count();

    if (count >= MAX_NOTIFICATION_EMAILS) {
      return NextResponse.json(
        { error: "알림 이메일은 최대 3개까지 등록할 수 있습니다" },
        { status: 400 },
      );
    }

    const created = await prisma.notificationEmail.create({
      data: { email },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("알림 이메일 등록 오류:", error);
    return NextResponse.json(
      { error: "알림 이메일 등록에 실패했습니다." },
      { status: 500 },
    );
  }
}
