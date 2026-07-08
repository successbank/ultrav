import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Package, Plus, Search, Globe } from "lucide-react";
import ProductActions from "@/components/admin/ProductActions";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const session = await auth();

  // 관리자 권한 확인
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // 탭: 한국어(기본) / 영어
  const isEnTab = searchParams.tab === "en";

  // 상품 목록 가져오기
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const activeCount = products.filter((p) => p.isActive).length;
  const inactiveCount = products.filter((p) => !p.isActive).length;
  const newCount = products.filter((p) => p.isNew).length;
  const lowStockCount = products.filter((p) => p.stock < 10).length;

  // 영어 탭 통계
  const enNameCount = products.filter((p) => p.nameEn).length;
  const enDescCount = products.filter((p) => p.descriptionEn).length;
  const enDetailCount = products.filter((p) => p.detailContentEn).length;
  const enFeaturedCount = products.filter((p) => p.isFeaturedEn).length;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* 헤더 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">상품 관리</h1>
            <p className="text-gray-600">등록된 상품을 관리합니다</p>
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>상품 등록</span>
          </Link>
        </div>

        {/* 한국어 / 영어 탭 */}
        <div className="mb-8 flex items-center gap-1 border-b border-gray-200">
          <Link
            href="/admin/products"
            className={`px-6 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              !isEnTab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            한국어
          </Link>
          <Link
            href="/admin/products?tab=en"
            className={`flex items-center gap-1.5 px-6 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              isEnTab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Globe size={16} />
            영어 (English)
          </Link>
        </div>

        {/* 통계 카드 */}
        {isEnTab ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">전체 상품</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">영문명 입력</p>
              <p className="text-2xl font-bold text-green-600">{enNameCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">영문 설명 입력</p>
              <p className="text-2xl font-bold text-blue-600">{enDescCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">영문 상세 입력</p>
              <p className="text-2xl font-bold text-blue-600">
                {enDetailCount}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">영문 메인 노출</p>
              <p className="text-2xl font-bold text-purple-600">
                {enFeaturedCount}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">전체 상품</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">판매 중</p>
              <p className="text-2xl font-bold text-green-600">{activeCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">판매 중지</p>
              <p className="text-2xl font-bold text-gray-400">
                {inactiveCount}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">신상품</p>
              <p className="text-2xl font-bold text-blue-600">{newCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">재고 부족</p>
              <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
            </div>
          </div>
        )}

        {/* 상품 목록 테이블 — 영어 탭 (영문 콘텐츠 관리 뷰) */}
        {isEnTab ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상품 (영문명)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      영문 카테고리
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      MOQ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      영문 콘텐츠
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      영문 메인 노출
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <Package
                          size={48}
                          className="mx-auto text-gray-300 mb-4"
                        />
                        <p className="text-gray-500">등록된 상품이 없습니다</p>
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.nameEn ?? product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package
                                    size={24}
                                    className="text-gray-400"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              {product.nameEn ? (
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {product.nameEn}
                                </p>
                              ) : (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                  영문명 미입력
                                </span>
                              )}
                              <p className="text-sm text-gray-500 truncate">
                                {product.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {product.category.nameEn ?? product.category.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {product.moq ?? "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.descriptionEn
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            설명 {product.descriptionEn ? "완료" : "미입력"}
                          </span>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-1 ${
                              product.detailContentEn
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            상세 {product.detailContentEn ? "완료" : "미입력"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.isFeaturedEn ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                              Featured
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <ProductActions
                            productId={product.id}
                            productName={product.nameEn ?? product.name}
                            en
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상품
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      카테고리
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      가격
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      재고
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <Package
                          size={48}
                          className="mx-auto text-gray-300 mb-4"
                        />
                        <p className="text-gray-500">등록된 상품이 없습니다</p>
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package
                                    size={24}
                                    className="text-gray-400"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {product.name}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {product.brand}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {product.category.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">
                              {formatPrice(product.price)}
                            </p>
                            {product.discount > 0 && (
                              <p className="text-xs text-red-600">
                                {product.discount}% 할인
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-sm font-medium ${
                              product.stock === 0
                                ? "text-red-600"
                                : product.stock < 10
                                  ? "text-orange-600"
                                  : "text-gray-900"
                            }`}
                          >
                            {product.stock}개
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {product.isActive ? "판매중" : "판매중지"}
                          </span>
                          {product.isNew && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 ml-1">
                              신상품
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <ProductActions
                            productId={product.id}
                            productName={product.name}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 안내 메시지 */}
        {products.length > 0 && (
          <div className="mt-6 text-sm text-gray-500 text-center">
            총 {products.length}개의 상품이 등록되어 있습니다
          </div>
        )}
      </div>
    </div>
  );
}
