import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// PUT - 상품 수정
export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await auth();

    // 관리자 권한 확인
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const {
      name,
      nameEn,
      brand,
      description,
      descriptionEn,
      detailContent,
      detailContentEn,
      moq,
      isFeaturedEn,
      price,
      discount,
      categoryId,
      imageUrl,
      images,
      stock,
      isActive,
      isNew,
    } = body;

    // 유효성 검사
    if (!name || !brand || !categoryId) {
      return NextResponse.json(
        { error: "필수 항목을 입력해주세요" },
        { status: 400 },
      );
    }

    if (price < 0 || stock < 0 || discount < 0 || discount > 100) {
      return NextResponse.json(
        { error: "올바른 값을 입력해주세요" },
        { status: 400 },
      );
    }

    // 상품 존재 확인
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "상품을 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    // 카테고리 존재 확인
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "카테고리를 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    // 상품 업데이트
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        nameEn: nameEn || null,
        brand,
        description: description || null,
        descriptionEn: descriptionEn || null,
        detailContent: detailContent || null,
        detailContentEn: detailContentEn || null,
        moq: moq || null,
        isFeaturedEn:
          isFeaturedEn !== undefined ? Boolean(isFeaturedEn) : false,
        price: parseFloat(price),
        discount: parseFloat(discount),
        categoryId,
        imageUrl: imageUrl || null,
        images: images || [],
        stock: parseInt(stock),
        isActive: Boolean(isActive),
        isNew: isNew !== undefined ? Boolean(isNew) : false,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("상품 수정 실패:", error);
    return NextResponse.json(
      { error: "상품 수정에 실패했습니다" },
      { status: 500 },
    );
  }
}

// DELETE - 상품 삭제
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const session = await auth();

    // 관리자 권한 확인
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
    }

    const { id } = await context.params;

    // 상품 존재 확인
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "상품을 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    // 관련 데이터 확인 (주문, 리뷰 등)
    const relatedOrders = await prisma.orderItem.count({
      where: { productId: id },
    });

    if (relatedOrders > 0) {
      return NextResponse.json(
        {
          error:
            "이 상품과 연관된 주문이 있어 삭제할 수 없습니다. 대신 판매 중지 상태로 변경해주세요.",
        },
        { status: 400 },
      );
    }

    // 상품 삭제 (CASCADE로 리뷰, 찜, 장바구니도 삭제됨)
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("상품 삭제 실패:", error);
    return NextResponse.json(
      { error: "상품 삭제에 실패했습니다" },
      { status: 500 },
    );
  }
}
