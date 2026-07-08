import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/admin/notices/[id]
 * 관리자: 특정 공지사항 조회
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session || !session.user) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "관리자만 접근 가능합니다" },
        { status: 403 },
      );
    }

    const notice = await prisma.notice.findUnique({
      where: { id },
    });

    if (!notice) {
      return NextResponse.json(
        { error: "공지사항을 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    return NextResponse.json(notice);
  } catch (error) {
    console.error("공지사항 조회 에러:", error);
    return NextResponse.json(
      { error: "공지사항 조회에 실패했습니다" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/admin/notices/[id]
 * 관리자: 공지사항 수정
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

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

    if (category) {
      const validCategories = ["GENERAL", "EVENT", "UPDATE", "IMPORTANT"];
      if (!validCategories.includes(category)) {
        return NextResponse.json(
          { error: "유효하지 않은 카테고리입니다" },
          { status: 400 },
        );
      }
    }

    if (locale) {
      const validLocales = ["KO", "EN"];
      if (!validLocales.includes(locale)) {
        return NextResponse.json(
          { error: "유효하지 않은 언어입니다" },
          { status: 400 },
        );
      }
    }

    const notice = await prisma.notice.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(category !== undefined && { category }),
        ...(locale !== undefined && { locale }),
        ...(isPinned !== undefined && { isPinned }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(notice);
  } catch (error) {
    console.error("공지사항 수정 에러:", error);
    return NextResponse.json(
      { error: "공지사항 수정에 실패했습니다" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/notices/[id]
 * 관리자: 공지사항 삭제
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session || !session.user) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "관리자만 접근 가능합니다" },
        { status: 403 },
      );
    }

    await prisma.notice.delete({
      where: { id },
    });

    return NextResponse.json({ message: "공지사항이 삭제되었습니다" });
  } catch (error) {
    console.error("공지사항 삭제 에러:", error);
    return NextResponse.json(
      { error: "공지사항 삭제에 실패했습니다" },
      { status: 500 },
    );
  }
}
