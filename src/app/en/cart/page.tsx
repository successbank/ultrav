"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import QuantitySelector from "@/components/ui/QuantitySelector";
import { formatPrice, calculateDiscountedPrice } from "@/lib/utils";
import { ShoppingCart, Trash2, Package, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// 영문 장바구니 페이지 — 기존 /api/cart를 수정 없이 재사용한다. (KO src/app/cart/page.tsx 참고)
interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    nameEn: string | null;
    brand: string;
    price: number;
    discount: number;
    imageUrl: string;
    stock: number;
    isActive: boolean;
  };
}

interface Cart {
  id: string;
  items: CartItem[];
}

export default function EnCartPage() {
  const { status } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/en/login");
    }

    if (status === "authenticated") {
      fetchCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router]);

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    setUpdating(cartItemId);
    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId, quantity }),
      });

      if (response.ok) {
        await fetchCart();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update quantity.");
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
      alert("Failed to update quantity.");
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (cartItemId: string) => {
    if (!confirm("Remove this item from your cart?")) {
      return;
    }

    setUpdating(cartItemId);
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId }),
      });

      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
      alert("Failed to remove item.");
    } finally {
      setUpdating(null);
    }
  };

  const calculateTotal = () => {
    if (!cart || cart.items.length === 0) return 0;

    return cart.items.reduce((total, item) => {
      const price = item.product.discount
        ? calculateDiscountedPrice(item.product.price, item.product.discount)
        : item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Cart</h1>
          <div className="animate-pulse">
            <Card className="p-6 mb-4">
              <div className="h-32 bg-gray-200 rounded" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Cart</h1>
          <Card className="p-12 text-center">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Your cart is empty.
            </h2>
            <p className="text-gray-600 mb-6">
              Browse our products and add items to your cart.
            </p>
            <Link
              href="/en/products"
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Browse Products
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Cart ({cart.items.length})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 상품 목록 */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const displayName = item.product.nameEn ?? item.product.name;
              const discountedPrice = item.product.discount
                ? calculateDiscountedPrice(
                    item.product.price,
                    item.product.discount,
                  )
                : item.product.price;

              return (
                <Card key={item.id} className="p-6">
                  <div className="flex gap-4">
                    {/* 상품 이미지 */}
                    <Link
                      href={`/en/products/${item.product.id}`}
                      className="flex-shrink-0"
                    >
                      <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={displayName}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={32} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* 상품 정보 */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/en/products/${item.product.id}`}
                        className="hover:text-blue-600"
                      >
                        <p className="text-sm text-gray-600 mb-1">
                          {item.product.brand}
                        </p>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {displayName}
                        </h3>
                      </Link>

                      <div className="flex items-baseline gap-2 mb-4">
                        {item.product.discount > 0 ? (
                          <>
                            <span className="text-lg font-bold text-gray-900">
                              {formatPrice(discountedPrice)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(item.product.price)}
                            </span>
                            <span className="text-sm font-semibold text-red-600">
                              {item.product.discount}%
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(item.product.price)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <QuantitySelector
                          value={item.quantity}
                          max={Math.min(item.product.stock, 99)}
                          onChange={(quantity) =>
                            updateQuantity(item.id, quantity)
                          }
                          disabled={
                            updating === item.id || !item.product.isActive
                          }
                        />

                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={updating === item.id}
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>

                      {!item.product.isActive && (
                        <p className="text-sm text-red-600 mt-2">
                          This product is no longer available.
                        </p>
                      )}
                      {item.product.stock === 0 && (
                        <p className="text-sm text-red-600 mt-2">
                          Out of stock
                        </p>
                      )}
                    </div>

                    {/* 소계 */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(discountedPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* 주문 요약 */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Items</span>
                  <span>{cart.items.length}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Total Quantity</span>
                  <span>
                    {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
              </div>

              <button
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors mb-3"
                onClick={() => router.push("/checkout")}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={20} />
              </button>

              <Link
                href="/en/products"
                className="block w-full text-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
