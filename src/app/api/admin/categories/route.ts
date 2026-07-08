import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST /api/admin/categories - 카테고리 생성
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    const body = await request.json();
    const { name, nameEn, slug, description, level, parentId } = body;

    // 필수 필드 검증
    if (!name || !slug || !level) {
      return NextResponse.json(
        { error: "이름, 슬러그, 레벨은 필수입니다." },
        { status: 400 },
      );
    }

    // 슬러그 중복 확인
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "이미 존재하는 슬러그입니다." },
        { status: 400 },
      );
    }

    // 같은 그룹 내 max sortOrder 조회
    const maxSortOrder = await prisma.category.aggregate({
      where: { parentId: parentId || null },
      _max: { sortOrder: true },
    });
    const nextSortOrder = (maxSortOrder._max.sortOrder ?? -1) + 1;

    // 카테고리 생성
    const category = await prisma.category.create({
      data: {
        name,
        nameEn: nameEn || null,
        slug,
        description: description || null,
        level,
        parentId: parentId || null,
        sortOrder: nextSortOrder,
      },
      include: {
        parent: true,
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("카테고리 생성 오류:", error);
    return NextResponse.json(
      { error: "카테고리 생성에 실패했습니다." },
      { status: 500 },
    );
  }
}

// GET /api/admin/categories - 카테고리 목록 조회
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        parent: true,
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
      orderBy: [{ level: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("카테고리 조회 오류:", error);
    return NextResponse.json(
      { error: "카테고리 조회에 실패했습니다." },
      { status: 500 },
    );
  }
}
