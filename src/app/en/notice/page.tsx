import Link from "next/link";
import prisma from "@/lib/prisma";
import { Pin, ChevronLeft, ChevronRight } from "lucide-react";

type TabKey = "all" | "important" | "announcement" | "event";

const TAB_CATEGORIES: Record<Exclude<TabKey, "all">, string[]> = {
  important: ["IMPORTANT"],
  announcement: ["GENERAL", "UPDATE"],
  event: ["EVENT"],
};

const TAB_LABELS: Record<TabKey, string> = {
  all: "All",
  important: "Important",
  announcement: "Announcement",
  event: "Event",
};

const categoryBadgeStyle: Record<string, string> = {
  IMPORTANT: "bg-orange-100 text-orange-700",
  GENERAL: "bg-blue-100 text-blue-700",
  UPDATE: "bg-blue-100 text-blue-700",
  EVENT: "bg-green-100 text-green-700",
};

const categoryBadgeLabel: Record<string, string> = {
  IMPORTANT: "Important",
  GENERAL: "Announcement",
  UPDATE: "Announcement",
  EVENT: "Event",
};

const PER_PAGE = 10;

export default async function EnNoticePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string }>;
}) {
  const params = await searchParams;
  const tab: TabKey =
    params.tab && params.tab in TAB_LABELS ? (params.tab as TabKey) : "all";
  const page = Math.max(1, parseInt(params.page || "1"));

  const where: any = { isActive: true, locale: "EN" };
  if (tab !== "all") {
    where.category = { in: TAB_CATEGORIES[tab] };
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

  function buildUrl(overrides: { tab?: TabKey; page?: number }) {
    const qs = new URLSearchParams();
    const t = overrides.tab ?? tab;
    const p = overrides.page ?? page;
    if (t !== "all") qs.set("tab", t);
    if (p > 1) qs.set("page", String(p));
    const str = qs.toString();
    return str ? `/en/notice?${str}` : "/en/notice";
  }

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-2">Notice</h1>
          <p className="text-gray-300">
            Latest news and updates from ULTRAVMALL
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 탭 */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(Object.keys(TAB_LABELS) as TabKey[]).map((t) => (
            <Link
              key={t}
              href={buildUrl({ tab: t, page: 1 })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                tab === t
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border"
              }`}
            >
              {TAB_LABELS[t]}
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {notices.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No notices found.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notices.map((notice) => (
                <Link
                  key={notice.id}
                  href={`/en/notice/${notice.id}`}
                  className={`block px-6 py-4 hover:bg-gray-50 transition-colors ${
                    notice.isPinned ? "bg-blue-50 hover:bg-blue-50/80" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                        categoryBadgeStyle[notice.category]
                      }`}
                    >
                      {categoryBadgeLabel[notice.category]}
                    </span>

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
                          ? "bg-gray-900 text-white font-medium"
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
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
