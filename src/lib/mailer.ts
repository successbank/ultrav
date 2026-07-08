import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

interface SendInquiryNotificationParams {
  locale: "KO" | "EN";
  subject: string;
  html: string;
}

function getTransport() {
  const host = process.env.SMTP_HOST;

  if (!host) {
    return null;
  }

  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === "true";

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  });
}

export async function sendInquiryNotification({
  subject,
  html,
}: SendInquiryNotificationParams): Promise<void> {
  const transport = getTransport();

  if (!transport) {
    console.warn("[mailer] SMTP 미설정 — 알림 발송 스킵");
    return;
  }

  try {
    const recipients = await prisma.notificationEmail.findMany();

    if (recipients.length === 0) {
      return;
    }

    const from = process.env.SMTP_FROM || process.env.SMTP_USER;

    await transport.sendMail({
      from,
      to: recipients.map((r) => r.email),
      subject,
      html,
    });
  } catch (error) {
    console.error("[mailer] 알림 이메일 발송 실패:", error);
  }
}
