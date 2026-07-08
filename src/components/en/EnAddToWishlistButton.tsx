"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// 영문 사이트용 찜하기 버튼 — AddToWishlistButton과 동일 로직, 라벨만 영문
interface EnAddToWishlistButtonProps {
  productId: string;
  productName: string;
}

export default function EnAddToWishlistButton({
  productId,
  productName,
}: EnAddToWishlistButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 찜 목록에 있는지 확인
  useEffect(() => {
    const checkWishlist = async () => {
      if (session?.user) {
        try {
          const response = await fetch("/api/wishlist");
          if (response.ok) {
            const wishlist = await response.json();
            const isInList = wishlist.some(
              (item: any) => item.product.id === productId,
            );
            setIsInWishlist(isInList);
          }
        } catch (error) {
          console.error("Failed to check wishlist:", error);
        }
      }
    };

    checkWishlist();
  }, [session, productId]);

  const handleToggleWishlist = async () => {
    // 로그인 확인
    if (status === "unauthenticated") {
      if (confirm("You need to log in. Go to the login page?")) {
        router.push("/en/login");
      }
      return;
    }

    setIsLoading(true);
    try {
      if (isInWishlist) {
        // 찜 목록에서 제거
        const response = await fetch("/api/wishlist", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        });

        if (response.ok) {
          setIsInWishlist(false);
          alert(`Removed ${productName} from your wishlist.`);
        } else if (response.status === 401) {
          if (confirm("You need to log in. Go to the login page?")) {
            router.push("/en/login");
          }
        } else {
          const error = await response.json();
          alert(error.error || "Failed to remove from wishlist.");
        }
      } else {
        // 찜 목록에 추가
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        });

        if (response.ok) {
          setIsInWishlist(true);
          if (
            confirm(
              `Added ${productName} to your wishlist!\nGo to wishlist now?`,
            )
          ) {
            router.push("/mypage/wishlist");
          }
        } else if (response.status === 401) {
          if (confirm("You need to log in. Go to the login page?")) {
            router.push("/en/login");
          }
        } else {
          const error = await response.json();
          alert(error.error || "Failed to add to wishlist.");
        }
      }
    } catch (error) {
      console.error("Wishlist action failed:", error);
      alert("Failed to update wishlist.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={isLoading || status === "loading"}
      className={`flex items-center justify-center w-full h-full min-h-[60px] rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
        isInWishlist
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-white text-gray-700 border-2 border-gray-300 hover:border-red-500 hover:text-red-500"
      }`}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      title={
        isLoading ? "Processing..." : isInWishlist ? "Wishlisted" : "Wishlist"
      }
    >
      <div className="flex flex-col items-center justify-center gap-1">
        <Heart
          size={24}
          className={isInWishlist ? "fill-current" : ""}
          strokeWidth={2}
        />
        <span className="text-xs font-medium">
          {isLoading ? "Processing" : "Wishlist"}
        </span>
      </div>
    </button>
  );
}
