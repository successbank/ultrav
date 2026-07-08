"use client";

import { Fragment, useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Globe,
  Building2,
  Mail,
  Phone,
  MapPin,
  Package,
  ChevronDown,
  ChevronUp,
  Save,
} from "lucide-react";

interface Inquiry {
  id: string;
  type: string;
  companyName: string;
  country: string;
  website: string | null;
  contactPerson: string | null;
  email: string;
  phone: string | null;
  orderQuantity: string | null;
  orderTimeline: string | null;
  targetMarket: string | null;
  interestedProducts: string[];
  message: string;
  status: string;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

const typeLabel: Record<string, string> = {
  PRODUCT_QUOTATION: "제품 견적",
  OEM_ODM: "OEM/ODM",
  DISTRIBUTOR: "총판/파트너십",
  TECHNICAL: "기술 지원",
  GENERAL: "일반 문의",
};

const typeStyle: Record<string, string> = {
  PRODUCT_QUOTATION: "bg-blue-100 text-blue-700",
  OEM_ODM: "bg-purple-100 text-purple-700",
  DISTRIBUTOR: "bg-orange-100 text-orange-700",
  TECHNICAL: "bg-teal-100 text-teal-700",
  GENERAL: "bg-gray-100 text-gray-700",
};

const statusLabel: Record<string, string> = {
  PENDING: "대기중",
  IN_PROGRESS: "처리중",
  RESOLVED: "해결됨",
};

const statusStyle: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  RESOLVED: "bg-green-100 text-green-800",
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editState, setEditState] = useState<{
    status: string;
    adminNotes: string;
  }>({
    status: "",
    adminNotes: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, typeFilter, page]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (typeFilter) params.set("type", typeFilter);
      params.set("page", String(page));

      const response = await fetch(`/api/admin/inquiries?${params.toString()}`);
      if (!response.ok) throw new Error("문의 목록을 불러오는데 실패했습니다");
      const data = await response.json();
      setInquiries(data.inquiries);
      setTotalPages(data.totalPages);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (inquiry: Inquiry) => {
    if (expandedId === inquiry.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(inquiry.id);
    setEditState({
      status: inquiry.status,
      adminNotes: inquiry.adminNotes || "",
    });
  };

  const handleSave = async (id: string) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editState),
      });

      if (!response.ok) throw new Error("문의 수정에 실패했습니다");

      alert("저장되었습니다");
      await fetchInquiries();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading && inquiries.length === 0) {
    return <div className="text-center py-12">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Globe className="w-6 h-6 text-blue-600" />
          영문 문의 관리
        </h2>
        <p className="text-gray-600 mt-1">
          영문 사이트를 통해 접수된 해외 바이어 문의를 관리합니다
        </p>
      </div>

      {/* 필터 */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              상태
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">전체</option>
              <option value="PENDING">대기중</option>
              <option value="IN_PROGRESS">처리중</option>
              <option value="RESOLVED">해결됨</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              문의유형
            </label>
            <select
              value={typeFilter}
              onChange={(e) => {
                setPage(1);
                setTypeFilter(e.target.value);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">전체</option>
              {Object.entries(typeLabel).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* 목록 */}
      {inquiries.length === 0 ? (
        <Card className="p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            문의가 없습니다
          </h3>
          <p className="text-gray-600">조건에 해당하는 영문 문의가 없습니다</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-24">
                  접수일
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-28">
                  문의유형
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  회사명
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-24">
                  국가
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  이메일
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">
                  예상수량
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-24">
                  상태
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {inquiries.map((inquiry) => (
                <Fragment key={inquiry.id}>
                  <tr
                    onClick={() => toggleExpand(inquiry)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(inquiry.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${typeStyle[inquiry.type]}`}
                      >
                        {typeLabel[inquiry.type] || inquiry.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {inquiry.companyName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {inquiry.country}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {inquiry.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {inquiry.orderQuantity || "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[inquiry.status]}`}
                      >
                        {statusLabel[inquiry.status] || inquiry.status}
                      </span>
                    </td>
                  </tr>
                  {expandedId === inquiry.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="px-6 py-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            담당자: {inquiry.contactPerson || "-"}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Mail className="w-4 h-4 text-gray-400" />
                            이메일: {inquiry.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Phone className="w-4 h-4 text-gray-400" />
                            전화: {inquiry.phone || "-"}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            목표 시장: {inquiry.targetMarket || "-"}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            웹사이트:{" "}
                            {inquiry.website ? (
                              <a
                                href={inquiry.website}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {inquiry.website}
                              </a>
                            ) : (
                              "-"
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            예상 주문 시기: {inquiry.orderTimeline || "-"}
                          </div>
                        </div>

                        {inquiry.interestedProducts.length > 0 && (
                          <div className="mb-4">
                            <p className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">
                              <Package className="w-4 h-4" />
                              관심 제품
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {inquiry.interestedProducts.map((p, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-700"
                                >
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mb-4">
                          <p className="text-xs font-medium text-gray-500 mb-2">
                            문의 내용
                          </p>
                          <p className="text-sm text-gray-800 whitespace-pre-wrap bg-white border border-gray-200 rounded-lg p-3">
                            {inquiry.message}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              상태 변경
                            </label>
                            <select
                              value={editState.status}
                              onChange={(e) =>
                                setEditState((prev) => ({
                                  ...prev,
                                  status: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="PENDING">대기중</option>
                              <option value="IN_PROGRESS">처리중</option>
                              <option value="RESOLVED">해결됨</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              관리자 메모
                            </label>
                            <textarea
                              value={editState.adminNotes}
                              onChange={(e) =>
                                setEditState((prev) => ({
                                  ...prev,
                                  adminNotes: e.target.value,
                                }))
                              }
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="내부 검토 메모를 입력하세요"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end mt-4">
                          <Button
                            size="sm"
                            onClick={() => handleSave(inquiry.id)}
                            disabled={saving}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? "저장 중..." : "저장"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronUp className="w-4 h-4 rotate-[-90deg]" />
            이전
          </Button>
          <span className="text-sm text-gray-600">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            다음
            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
          </Button>
        </div>
      )}
    </div>
  );
}
