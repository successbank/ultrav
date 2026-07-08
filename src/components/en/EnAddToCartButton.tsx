"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import EnQuantitySelector from "@/components/en/EnQuantitySelector";

// 영문 사이트용 장바구니 담기 버튼 — AddToCartButton과 동일 로직, 라벨만 영문
interface Product {
  id: string;
  name: string;
  price: number;
  discount: number;
  stock: number;
  isActive: boolean;
}

interface EnAddToCartButtonProps {
  product: Product;
}

export default function EnAddToCartButton({ product }: EnAddToCartButtonProps) {
  const { status } = useSession();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    // 로그인 확인
    if (status === "unauthenticated") {
      if (confirm("You need to log in. Go to the login page?")) {
        router.push("/en/login");
      }
      return;
    }

    setIsAdding(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      });

      if (response.ok) {
        if (confirm(`Added to cart.\nGo to cart now?`)) {
          router.push("/cart");
        } else {
          setQuantity(1); // 수량 초기화
        }
      } else if (response.status === 401) {
        if (confirm("You need to log in. Go to the login page?")) {
          router.push("/en/login");
        }
      } else {
        const error = await response.json();
        alert(error.error || "Failed to add to cart.");
      }
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert("Failed to add to cart.");
    } finally {
      setIsAdding(false);
    }
  };

  if (!product.isActive) {
    return (
      <button
        disabled
        className="w-full py-4 text-lg bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
      >
        Discontinued
      </button>
    );
  }

  if (product.stock === 0) {
    return (
      <button
        disabled
        className="w-full py-4 text-lg bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="font-semibold text-gray-900">Quantity</span>
        <EnQuantitySelector
          value={quantity}
          max={Math.min(product.stock, 99)}
          onChange={setQuantity}
          disabled={isAdding}
        />
        <span className="text-sm text-gray-600">Stock: {product.stock}</span>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAdding || status === "loading"}
        className="w-full py-4 text-lg flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ShoppingCart size={24} />
        {isAdding ? "Adding..." : "Add to Cart"}
      </button>

      {status === "unauthenticated" && (
        <p className="text-sm text-gray-500 text-center">
          Please log in to use the cart.
        </p>
      )}
    </div>
  );
}
