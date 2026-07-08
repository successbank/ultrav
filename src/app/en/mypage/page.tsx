import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import {
  Mail,
  ShoppingBag,
  Heart,
  Settings,
  Package,
  Shield,
  FileText,
} from "lucide-react";
import prisma from "@/lib/prisma";

// 영문 마이페이지 대시보드 — KO src/app/mypage/page.tsx와 동일한 데이터를 영문 라벨로 표시.
export default async function EnMyPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/en/login");
  }

  const user = session.user;

  const [orderCount, wishlistCount, quoteCount] = await Promise.all([
    prisma.order.count({ where: { userId: user.id } }),
    prisma.wishlist.count({ where: { userId: user.id } }),
    prisma.quote.count({ where: { customerId: user.id } }),
  ]);

  return (
    <div className="space-y-6">
      {/* 사용자 정보 카드 */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center text-white text-3xl font-bold">
            {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user.name || "Customer"}
            </h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-700">
            <Mail size={20} className="text-gray-400" />
            <span>{user.email}</span>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">
              Membership: {user.role === "ADMIN" ? "Administrator" : "Member"}
            </p>
          </div>
        </div>
      </Card>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{orderCount}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Package size={24} className="text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Wishlist Items</p>
              <p className="text-3xl font-bold text-gray-900">
                {wishlistCount}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <Heart size={24} className="text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Quotes Received</p>
              <p className="text-3xl font-bold text-gray-900">{quoteCount}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <FileText size={24} className="text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* 빠른 링크 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Link href="/en/mypage/orders">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <ShoppingBag size={24} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Orders</h3>
              <p className="text-sm text-gray-600">Check your order history</p>
            </div>
          </Card>
        </Link>

        <Link href="/en/mypage/wishlist">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                <Heart size={24} className="text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Wishlist</h3>
              <p className="text-sm text-gray-600">View products you saved</p>
            </div>
          </Card>
        </Link>

        <Link href="/en/mypage/quotes">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <FileText size={24} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quotes</h3>
              <p className="text-sm text-gray-600">Check quotes you received</p>
            </div>
          </Card>
        </Link>

        <Link href="/en/mypage/login-history">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                <Shield size={24} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Login History
              </h3>
              <p className="text-sm text-gray-600">
                Review your account security
              </p>
            </div>
          </Card>
        </Link>

        <Link href="/en/mypage/settings">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Settings size={24} className="text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Settings</h3>
              <p className="text-sm text-gray-600">Update your profile</p>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
