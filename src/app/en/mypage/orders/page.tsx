import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import prisma from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

// 영문 주문 내역 — KO src/app/mypage/orders/page.tsx와 동일한 데이터를 영문 라벨로 표시.
const statusConfig = {
  PENDING: {
    label: "Pending",
    color: "text-yellow-600 bg-yellow-50",
    icon: Clock,
  },
  PAID: {
    label: "Paid",
    color: "text-green-600 bg-green-50",
    icon: CheckCircle,
  },
  PREPARING: {
    label: "Preparing",
    color: "text-blue-600 bg-blue-50",
    icon: Package,
  },
  SHIPPED: {
    label: "Shipped",
    color: "text-purple-600 bg-purple-50",
    icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    color: "text-green-600 bg-green-50",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-red-600 bg-red-50",
    icon: XCircle,
  },
  REFUNDED: {
    label: "Refunded",
    color: "text-gray-600 bg-gray-50",
    icon: XCircle,
  },
};

export default async function EnOrdersPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/en/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <Card className="p-12 text-center">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No orders yet
          </h3>
          <p className="text-gray-600 mb-6">
            You haven&apos;t placed any orders yet. Browse our products!
          </p>
          <Link
            href="/en/products"
            className="inline-block px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Browse Products
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <p className="text-sm text-gray-600">{orders.length} order(s)</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const config = statusConfig[order.status];
          const StatusIcon = config.icon;

          return (
            <Card
              key={order.id}
              className="p-6 hover:shadow-lg transition-shadow"
            >
              {/* 주문 헤더 */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order No: {order.orderNumber}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${config.color} flex items-center gap-1`}
                    >
                      <StatusIcon size={16} />
                      {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Order Date: {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>
              </div>

              {/* 주문 상품 목록 */}
              <div className="space-y-3 mb-4">
                {order.items.map((item) => {
                  const displayName = item.product.nameEn ?? item.product.name;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={displayName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={24} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/en/products/${item.product.id}`}
                          className="font-medium text-gray-900 hover:text-blue-600 line-clamp-1"
                        >
                          {displayName}
                        </Link>
                        <p className="text-sm text-gray-600">
                          {item.product.brand} · Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 배송 정보 */}
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Recipient</p>
                    <p className="font-medium text-gray-900">
                      {order.recipientName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Phone</p>
                    <p className="font-medium text-gray-900">
                      {order.recipientPhone}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600 mb-1">Shipping Address</p>
                    <p className="font-medium text-gray-900">
                      {order.shippingAddr}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
