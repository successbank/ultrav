import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { sendInquiryNotification } from "@/lib/mailer";

// 영문 B2B 사이트 문의(Inquiry) — 로그인 없이 공개 접근 허용 (middleware.ts에서 /api/inquiries 예외 처리됨)
const inquirySchema = z.object({
  type: z
    .enum([
      "PRODUCT_QUOTATION",
      "OEM_ODM",
      "DISTRIBUTOR",
      "TECHNICAL",
      "GENERAL",
    ])
    .default("PRODUCT_QUOTATION"),
  companyName: z.string().min(1, "Company name is required"),
  country: z.string().min(1, "Country is required"),
  website: z.string().optional().nullable(),
  contactPerson: z.string().optional().nullable(),
  email: z.string().email("A valid email address is required"),
  phone: z.string().optional().nullable(),
  orderQuantity: z.string().min(1, "Estimated order quantity is required"),
  orderTimeline: z.string().optional().nullable(),
  targetMarket: z.string().optional().nullable(),
  interestedProducts: z.array(z.string()).optional().default([]),
  message: z.string().min(1, "Message is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = inquirySchema.parse(body);

    const inquiry = await prisma.inquiry.create({
      data: {
        type: validatedData.type,
        companyName: validatedData.companyName,
        country: validatedData.country,
        website: validatedData.website || null,
        contactPerson: validatedData.contactPerson || null,
        email: validatedData.email,
        phone: validatedData.phone || null,
        orderQuantity: validatedData.orderQuantity,
        orderTimeline: validatedData.orderTimeline || null,
        targetMarket: validatedData.targetMarket || null,
        interestedProducts: validatedData.interestedProducts,
        message: validatedData.message,
      },
    });

    await sendInquiryNotification({
      locale: "EN",
      subject: `[ULTRAVMALL] New inquiry from ${validatedData.companyName} (${validatedData.country})`,
      html: `
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
          <tr><td><strong>Type</strong></td><td>${validatedData.type}</td></tr>
          <tr><td><strong>Company Name</strong></td><td>${validatedData.companyName}</td></tr>
          <tr><td><strong>Country</strong></td><td>${validatedData.country}</td></tr>
          <tr><td><strong>Website</strong></td><td>${validatedData.website || "-"}</td></tr>
          <tr><td><strong>Contact Person</strong></td><td>${validatedData.contactPerson || "-"}</td></tr>
          <tr><td><strong>Email</strong></td><td>${validatedData.email}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${validatedData.phone || "-"}</td></tr>
          <tr><td><strong>Order Quantity</strong></td><td>${validatedData.orderQuantity}</td></tr>
          <tr><td><strong>Order Timeline</strong></td><td>${validatedData.orderTimeline || "-"}</td></tr>
          <tr><td><strong>Target Market</strong></td><td>${validatedData.targetMarket || "-"}</td></tr>
          <tr><td><strong>Interested Products</strong></td><td>${validatedData.interestedProducts.join(", ") || "-"}</td></tr>
          <tr><td><strong>Message</strong></td><td>${validatedData.message}</td></tr>
        </table>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your inquiry has been submitted successfully.",
        inquiry: {
          id: inquiry.id,
          createdAt: inquiry.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Inquiry submission error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input data.",
          errors: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "An error occurred while submitting your inquiry. Please try again.",
      },
      { status: 500 },
    );
  }
}
