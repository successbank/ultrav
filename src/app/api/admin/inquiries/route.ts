/**
 * 관리자 영문 문의(Inquiry) 관리 API
 *
 * GET /api/admin/inquiries - 문의 목록 조회 (필터링, 페이지네이션)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { InquiryStatus, InquiryType } from "@prisma/client";

const PAGE_SIZE = 20;

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
    const status = searchParams.get("status") as InquiryStatus | null;
    const type = searchParams.get("type") as InquiryType | null;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));

    const where: any = {};

    if (status && Object.values(InquiryStatus).includes(status)) {
      where.status = status;
    }

    if (type && Object.values(InquiryType).includes(type)) {
      where.type = type;
    }

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.inquiry.count({ where }),
    ]);

    return NextResponse.json({
      inquiries,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    });
  } catch (error) {
    console.error("영문 문의 목록 조회 에러:", error);
    return NextResponse.json(
      { error: "문의 목록을 불러오는데 실패했습니다" },
      { status: 500 },
    );
  }
}
