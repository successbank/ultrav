"use client";

import { usePathname } from "next/navigation";

// 영문 사이트(/en/*)에서는 한국어 Header/Footer를 숨기고
// /en 레이아웃의 EnHeader/EnFooter만 노출한다.
export default function LocaleChrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isEnglishSite = pathname === "/en" || pathname.startsWith("/en/");

  return (
    <>
      {!isEnglishSite && header}
      {children}
      {!isEnglishSite && footer}
    </>
  );
}
