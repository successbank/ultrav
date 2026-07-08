import type { Metadata } from "next";
import EnHeader from "@/components/en/EnHeader";
import EnFooter from "@/components/en/EnFooter";

export const metadata: Metadata = {
  title: {
    default:
      "ULTRAVMALL - Global Manufacturer of PDO Threads & Collagen Stimulators",
    template: "%s | ULTRAVMALL",
  },
  description:
    "Ultra V is a global manufacturer of PDO threads and collagen stimulators, CE/ISO certified, exporting to 60+ countries with 15+ years of manufacturing experience.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ULTRAVMALL",
  },
  robots: { index: true, follow: true },
};

export default function EnLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <EnHeader />
      {children}
      <EnFooter />
    </>
  );
}
