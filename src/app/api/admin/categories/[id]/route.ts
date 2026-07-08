import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/admin/categories/[id] - 카테고리 상세 조회 (연결된 상품 포함)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
          },
        },
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "카테고리를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("카테고리 조회 오류:", error);
    return NextResponse.json(
      { error: "카테고리 조회에 실패했습니다." },
      { status: 500 },
    );
  }
}

// PUT /api/admin/categories/[id] - 카테고리 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, nameEn, slug, description, level, parentId, sortOrder } =
      body;

    // 카테고리 존재 확인
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "카테고리를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 슬러그 중복 확인 (자기 자신 제외)
    if (slug && slug !== existingCategory.slug) {
      const duplicateSlug = await prisma.category.findUnique({
        where: { slug },
      });

      if (duplicateSlug) {
        return NextResponse.json(
          { error: "이미 존재하는 슬러그입니다." },
          { status: 400 },
        );
      }
    }

    // 카테고리 수정
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name || existingCategory.name,
        nameEn: nameEn !== undefined ? nameEn || null : existingCategory.nameEn,
        slug: slug || existingCategory.slug,
        description:
          description !== undefined
            ? description
            : existingCategory.description,
        level: level || existingCategory.level,
        parentId: parentId !== undefined ? parentId : existingCategory.parentId,
        ...(sortOrder !== undefined && { sortOrder }),
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

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("카테고리 수정 오류:", error);
    return NextResponse.json(
      { error: "카테고리 수정에 실패했습니다." },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/categories/[id] - 카테고리 삭제
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

    // 카테고리 존재 확인
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "카테고리를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 하위 카테고리가 있는지 확인
    if (category._count.children > 0) {
      return NextResponse.json(
        { error: "하위 카테고리가 있어 삭제할 수 없습니다." },
        { status: 400 },
      );
    }

    // 연결된 상품이 있는지 확인
    if (category._count.products > 0) {
      return NextResponse.json(
        { error: "이 카테고리에 연결된 상품이 있어 삭제할 수 없습니다." },
        { status: 400 },
      );
    }

    // 카테고리 삭제
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "카테고리가 삭제되었습니다." });
  } catch (error) {
    console.error("카테고리 삭제 오류:", error);
    return NextResponse.json(
      { error: "카테고리 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
