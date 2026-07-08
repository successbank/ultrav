"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

// 영문 사이트용 공유 버튼 — ShareButton과 동일 로직, 라벨만 영문
interface EnShareButtonProps {
  url: string;
  title: string;
  text?: string;
}

export default function EnShareButton({
  url,
  title,
  text,
}: EnShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);

    try {
      // Web Share API 지원 확인 (모바일 및 일부 데스크탑)
      if (navigator.share) {
        await navigator.share({
          title,
          text: text || title,
          url,
        });
      } else {
        // 폴백: 클립보드 복사
        await copyToClipboard(url);
        alert("Link copied!");
      }
    } catch (error) {
      // 사용자가 공유 취소한 경우는 무시
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      // 다른 에러는 폴백으로 처리
      try {
        await copyToClipboard(url);
        alert("Link copied!");
      } catch (clipboardError) {
        console.error("Share failed:", clipboardError);
        alert("Failed to share. Please try again.");
      }
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    // 최신 Clipboard API 사용
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // 폴백: 구형 브라우저용
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
      } finally {
        textArea.remove();
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={isSharing}
      className="flex items-center justify-center w-full h-full min-h-[60px] rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-500 hover:text-blue-500"
      aria-label="Share product"
      title={isSharing ? "Sharing..." : "Share"}
    >
      <div className="flex flex-col items-center justify-center gap-1">
        <Share2 size={24} strokeWidth={2} />
        <span className="text-xs font-medium">
          {isSharing ? "Sharing" : "Share"}
        </span>
      </div>
    </button>
  );
}
