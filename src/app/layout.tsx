import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LocaleChrome from "@/components/LocaleChrome";
import SessionProvider from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: {
    default: "Ultra Shopping Mall - 의료기기 전문 쇼핑몰",
    template: "%s | Ultra",
  },
  description:
    "의료기기 및 미용의료 용품 전문 B2B/B2C 쇼핑몰. ULTRACOL, 리프팅 실, 의료기기를 합리적인 가격에 만나보세요.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "Ultra Shopping Mall",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen bg-gray-50">
        <SessionProvider>
          <LocaleChrome header={<Header />} footer={<Footer />}>
            {children}
          </LocaleChrome>
        </SessionProvider>
      </body>
    </html>
  );
}
