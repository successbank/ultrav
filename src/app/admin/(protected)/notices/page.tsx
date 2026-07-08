"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Edit, Trash2, Eye, EyeOff, Pin } from "lucide-react";

interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  locale: string;
  isPinned: boolean;
  isActive: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

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

const localeStyle: Record<string, string> = {
  KO: "bg-slate-100 text-slate-700",
  EN: "bg-indigo-100 text-indigo-700",
};

const localeLabel: Record<string, string> = {
  KO: "한국어",
  EN: "영문",
};

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [localeFilter, setLocaleFilter] = useState<string>("");

  useEffect(() => {
    fetchNotices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localeFilter]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (localeFilter) params.set("locale", localeFilter);
      const response = await fetch(`/api/admin/notices?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch notices");
      const data = await response.json();
      setNotices(data);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/notices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) throw new Error("활성화 상태 변경 실패");
      await fetchNotices();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleTogglePinned = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/notices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: !currentStatus }),
      });

      if (!response.ok) throw new Error("고정 상태 변경 실패");
      await fetchNotices();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/admin/notices/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("삭제 실패");
      await fetchNotices();
      alert("삭제되었습니다");
    } catch (error: any) {
      alert(error.message);
    }
  };

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  if (loading) {
    return <div className="text-center py-12">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">공지사항 관리</h2>
          <p className="text-gray-600 mt-1">공지사항을 등록하고 관리합니다</p>
        </div>
        <Link href="/admin/notices/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />새 공지사항 작성
          </Button>
        </Link>
      </div>

      {/* 언어 필터 탭 */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { value: "", label: "전체" },
          { value: "KO", label: "한국어" },
          { value: "EN", label: "영문" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setLocaleFilter(tab.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              localeFilter === tab.value
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 공지사항 목록 */}
      {notices.length === 0 ? (
        <Card className="p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            공지사항이 없습니다
          </h3>
          <p className="text-gray-600 mb-6">첫 번째 공지사항을 작성해보세요</p>
          <Link href="/admin/notices/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              공지사항 작성
            </Button>
          </Link>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-12">
                  고정
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-16">
                  언어
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20">
                  카테고리
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  제목
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-20">
                  조회수
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-20">
                  상태
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-24">
                  작성일
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-40">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {notices.map((notice) => (
                <tr
                  key={notice.id}
                  className={`hover:bg-gray-50 ${!notice.isActive ? "opacity-50" : ""} ${
                    notice.isPinned ? "bg-blue-50/50" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        handleTogglePinned(notice.id, notice.isPinned)
                      }
                      className={`p-1 rounded ${
                        notice.isPinned
                          ? "text-blue-600"
                          : "text-gray-300 hover:text-gray-500"
                      }`}
                      title={notice.isPinned ? "고정 해제" : "상단 고정"}
                    >
                      <Pin className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        localeStyle[notice.locale]
                      }`}
                    >
                      {localeLabel[notice.locale] || notice.locale}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        categoryStyle[notice.category]
                      }`}
                    >
                      {categoryLabel[notice.category]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900 line-clamp-1">
                      {notice.title}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-500">
                    {notice.viewCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() =>
                        handleToggleActive(notice.id, notice.isActive)
                      }
                      className={`px-2 py-1 text-xs rounded ${
                        notice.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {notice.isActive ? (
                        <>
                          <Eye className="w-3 h-3 inline mr-1" />
                          활성
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 inline mr-1" />
                          비활성
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-500">
                    {formatDate(notice.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Link href={`/admin/notices/${notice.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-3 h-3 mr-1" />
                          수정
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(notice.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        삭제
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
