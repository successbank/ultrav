import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// 영문 사이트 회원가입 — /api/auth/register 와 동일 로직에
// locale: EN 저장 + 영문 에러 메시지만 다름 (한국어 API는 무수정 유지)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, phone } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password and name are required." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "This email is already registered." },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone: phone || null,
        role: "USER",
        locale: "EN",
      },
    });

    return NextResponse.json(
      { message: "Registration completed successfully." },
      { status: 201 },
    );
  } catch (error) {
    console.error("EN registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong while processing your registration." },
      { status: 500 },
    );
  }
}
