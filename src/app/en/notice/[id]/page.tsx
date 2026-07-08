import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ArrowLeft, Eye, Calendar } from "lucide-react";

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

export default async function EnNoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const notice = await prisma.notice.findUnique({
    where: { id },
  });

  if (!notice || !notice.isActive || notice.locale !== "EN") {
    notFound();
  }

  await prisma.notice.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href="/en/notice"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                categoryBadgeStyle[notice.category]
              }`}
            >
              {categoryBadgeLabel[notice.category]}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {notice.title}
          </h2>

          <div className="flex items-center gap-4 text-sm text-gray-500 pb-6 border-b">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(notice.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{(notice.viewCount + 1).toLocaleString()} views</span>
            </div>
          </div>

          <div className="pt-6 text-gray-700 leading-relaxed whitespace-pre-wrap">
            {notice.content}
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/en/notice"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors"
          >
            Back to List
          </Link>
        </div>
      </div>
    </div>
  );
}
