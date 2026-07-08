import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// DELETE /api/admin/settings/notification-emails/[id] - 알림 이메일 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    const { id } = await params;

    const existing = await prisma.notificationEmail.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "알림 이메일을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    await prisma.notificationEmail.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("알림 이메일 삭제 오류:", error);
    return NextResponse.json(
      { error: "알림 이메일 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
