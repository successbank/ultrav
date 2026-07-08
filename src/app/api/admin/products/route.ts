import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST - 상품 생성
export async function POST(request: Request) {
  try {
    const session = await auth();

    // 관리자 권한 확인
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
    }

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

    // 유효성 검사 - 필수 항목
    if (
      !name ||
      !brand ||
      !categoryId ||
      price === undefined ||
      stock === undefined
    ) {
      return NextResponse.json(
        {
          error:
            "필수 항목을 입력해주세요 (name, brand, categoryId, price, stock)",
        },
        { status: 400 },
      );
    }

    const parsedPrice = parseInt(price);
    const parsedStock = parseInt(stock);
    const parsedDiscount = discount ? parseInt(discount) : 0;

    if (
      parsedPrice < 0 ||
      parsedStock < 0 ||
      parsedDiscount < 0 ||
      parsedDiscount > 100
    ) {
      return NextResponse.json(
        { error: "올바른 값을 입력해주세요" },
        { status: 400 },
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

    // 상품 생성
    const product = await prisma.product.create({
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
        price: parsedPrice,
        discount: parsedDiscount,
        categoryId,
        imageUrl: imageUrl || null,
        images: images || [],
        stock: parsedStock,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        isNew: isNew !== undefined ? Boolean(isNew) : false,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("상품 생성 실패:", error);
    return NextResponse.json(
      { error: "상품 생성에 실패했습니다" },
      { status: 500 },
    );
  }
}
