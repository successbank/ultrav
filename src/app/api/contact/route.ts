import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { sendInquiryNotification } from "@/lib/mailer";

const contactSchema = z.object({
  name: z.string().min(2, "이름은 2자 이상이어야 합니다"),
  email: z.string().email("유효한 이메일 주소를 입력해주세요"),
  phone: z.string().optional(),
  type: z.enum(["PRODUCT", "SHIPPING", "RETURN", "OTHER"]),
  subject: z.string().min(3, "제목은 3자 이상이어야 합니다"),
  message: z.string().min(10, "문의 내용은 10자 이상이어야 합니다"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 입력 유효성 검사
    const validatedData = contactSchema.parse(body);

    // 데이터베이스에 저장
    const contact = await prisma.contact.create({
      data: validatedData,
    });

    await sendInquiryNotification({
      locale: "KO",
      subject: `[Ultra] 새 문의: ${validatedData.subject} (${validatedData.name})`,
      html: `
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
          <tr><td><strong>이름</strong></td><td>${validatedData.name}</td></tr>
          <tr><td><strong>이메일</strong></td><td>${validatedData.email}</td></tr>
          <tr><td><strong>전화번호</strong></td><td>${validatedData.phone || "-"}</td></tr>
          <tr><td><strong>문의 유형</strong></td><td>${validatedData.type}</td></tr>
          <tr><td><strong>제목</strong></td><td>${validatedData.subject}</td></tr>
          <tr><td><strong>내용</strong></td><td>${validatedData.message}</td></tr>
        </table>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message: "문의가 성공적으로 접수되었습니다.",
        contact: {
          id: contact.id,
          createdAt: contact.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Contact submission error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "입력 데이터가 올바르지 않습니다.",
          errors: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "문의 접수 중 오류가 발생했습니다. 다시 시도해주세요.",
      },
      { status: 500 },
    );
  }
}

// GET 요청으로 문의 내역 조회 (관리자용, 추후 구현)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const contacts = await prisma.contact.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.error("Contacts fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "문의 내역을 불러오는 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
