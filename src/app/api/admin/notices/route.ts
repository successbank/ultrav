import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NoticeLocale } from "@prisma/client";

/**
 * GET /api/admin/notices
 * 관리자: 모든 공지사항 조회 (비활성 포함), locale 쿼리로 필터링 가능
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "관리자만 접근 가능합니다" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") as NoticeLocale | null;

    const where: any = {};
    if (locale && Object.values(NoticeLocale).includes(locale)) {
      where.locale = locale;
    }

    const notices = await prisma.notice.findMany({
      where,
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(notices);
  } catch (error) {
    console.error("공지사항 조회 에러:", error);
    return NextResponse.json(
      { error: "공지사항을 불러오는데 실패했습니다" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/notices
 * 관리자: 새 공지사항 생성
 */
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "관리자만 접근 가능합니다" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { title, content, category, locale, isPinned, isActive } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "제목과 내용은 필수입니다" },
        { status: 400 },
      );
    }

    const validCategories = ["GENERAL", "EVENT", "UPDATE", "IMPORTANT"];
    if (category && !validCategories.includes(category)) {
      return NextResponse.json(
        { error: "유효하지 않은 카테고리입니다" },
        { status: 400 },
      );
    }

    if (locale && !Object.values(NoticeLocale).includes(locale)) {
      return NextResponse.json(
        { error: "유효하지 않은 언어입니다" },
        { status: 400 },
      );
    }

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        category: category || "GENERAL",
        locale: locale || "KO",
        isPinned: isPinned || false,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(notice, { status: 201 });
  } catch (error) {
    console.error("공지사항 생성 에러:", error);
    return NextResponse.json(
      { error: "공지사항 생성에 실패했습니다" },
      { status: 500 },
    );
  }
}
