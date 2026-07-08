import Link from "next/link";
import prisma from "@/lib/prisma";
import { Pin, Eye, ChevronLeft, ChevronRight } from "lucide-react";

const categoryStyle: Record<string, string> = {
  GENERAL: "bg-gray-100 text-gray-700",
  EVENT: "bg-green-100 text-green-700",
  UPDATE: "bg-blue-100 text-blue-700",
  IMPORTANT: "bg-red-100 text-red-700",
};

const categoryLabel: Record<string, string> = {
  GENERAL: "일반",
  EVENT: "이벤트",
  UPDATE: "업데이트",
  IMPORTANT: "중요",
};

const PER_PAGE = 15;

export default async function NoticesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    category?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const categoryFilter = params.category;

  const where: any = { isActive: true, locale: "KO" };
  if (categoryFilter && categoryFilter in categoryLabel) {
    where.category = categoryFilter;
  }

  const [notices, totalCount] = await Promise.all([
    prisma.notice.findMany({
      where,
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.notice.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));

  function buildUrl(overrides: { page?: number; category?: string | null }) {
    const qs = new URLSearchParams();
    const cat =
      overrides.category !== undefined ? overrides.category : categoryFilter;
    const p = overrides.page !== undefined ? overrides.page : page;
    if (cat) qs.set("category", cat);
    if (p && p > 1) qs.set("page", String(p));
    const str = qs.toString();
    return str ? `/notices?${str}` : "/notices";
  }

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  const categories = ["GENERAL", "EVENT", "UPDATE", "IMPORTANT"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero 섹션 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-2">공지사항</h1>
          <p className="text-blue-100">
            울트라 메디컬의 새로운 소식과 안내사항을 확인하세요
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 카테고리 필터 탭 */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Link
            href={buildUrl({ category: null, page: 1 })}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !categoryFilter
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border"
            }`}
          >
            전체
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={buildUrl({ category: cat, page: 1 })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                categoryFilter === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border"
              }`}
            >
              {categoryLabel[cat]}
            </Link>
          ))}
        </div>

        {/* 공지사항 목록 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {notices.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">
                등록된 공지사항이 없습니다
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notices.map((notice) => (
                <Link
                  key={notice.id}
                  href={`/notices/${notice.id}`}
                  className={`block px-6 py-4 hover:bg-gray-50 transition-colors ${
                    notice.isPinned ? "bg-blue-50 hover:bg-blue-50/80" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* 카테고리 뱃지 */}
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                        categoryStyle[notice.category]
                      }`}
                    >
                      {categoryLabel[notice.category]}
                    </span>

                    {/* 제목 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {notice.isPinned && (
                          <Pin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        )}
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {notice.title}
                        </h3>
                      </div>
                    </div>

                    {/* 조회수 */}
                    <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{notice.viewCount.toLocaleString()}</span>
                    </div>

                    {/* 작성일 */}
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {formatDate(notice.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {page > 1 && (
              <Link
                href={buildUrl({ page: page - 1 })}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
                이전
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2,
              )
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && p - prev > 1;
                return (
                  <span key={p} className="flex items-center gap-2">
                    {showEllipsis && <span className="text-gray-400">...</span>}
                    <Link
                      href={buildUrl({ page: p })}
                      className={`w-10 h-10 flex items-center justify-center text-sm rounded-lg transition-colors ${
                        p === page
                          ? "bg-blue-600 text-white font-medium"
                          : "bg-white text-gray-700 border hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </Link>
                  </span>
                );
              })}

            {page < totalPages && (
              <Link
                href={buildUrl({ page: page + 1 })}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
              >
                다음
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}

        {/* 총 건수 */}
        <p className="text-center text-sm text-gray-500 mt-4">
          총 {totalCount}건의 공지사항
        </p>
      </div>
    </div>
  );
}
