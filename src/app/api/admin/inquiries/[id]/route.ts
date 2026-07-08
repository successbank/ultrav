/**
 * 관리자 영문 문의(Inquiry) 상세 관리 API
 *
 * GET /api/admin/inquiries/[id] - 문의 상세 조회
 * PATCH /api/admin/inquiries/[id] - 상태/관리자 메모 수정
 * DELETE /api/admin/inquiries/[id] - 문의 삭제
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { InquiryStatus } from "@prisma/client";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
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

    const inquiry = await prisma.inquiry.findUnique({ where: { id } });

    if (!inquiry) {
      return NextResponse.json(
        { error: "문의를 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("영문 문의 조회 에러:", error);
    return NextResponse.json(
      { error: "문의 조회에 실패했습니다" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
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
    const { status, adminNotes } = body;

    if (status && !Object.values(InquiryStatus).includes(status)) {
      return NextResponse.json(
        { error: "유효하지 않은 상태입니다" },
        { status: 400 },
      );
    }

    const existing = await prisma.inquiry.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "문의를 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(adminNotes !== undefined && { adminNotes }),
      },
    });

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("영문 문의 수정 에러:", error);
    return NextResponse.json(
      { error: "문의 수정에 실패했습니다" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    const existing = await prisma.inquiry.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "문의를 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    await prisma.inquiry.delete({ where: { id } });

    return NextResponse.json({ message: "문의가 삭제되었습니다" });
  } catch (error) {
    console.error("영문 문의 삭제 에러:", error);
    return NextResponse.json(
      { error: "문의 삭제에 실패했습니다" },
      { status: 500 },
    );
  }
}
