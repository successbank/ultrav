import type { Metadata } from "next"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import SessionProvider from "@/components/providers/SessionProvider"

export const metadata: Metadata = {
  title: "Ultra Shopping Mall - 온라인 쇼핑몰",
  description: "최고의 온라인 쇼핑 경험을 제공하는 Ultra 쇼핑몰",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen bg-gray-50">
        <SessionProvider>
          <Header />
          {children}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}
