"use client";

import { Fragment, useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  MessageSquare,
  User,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  Save,
  Trash2,
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  type: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const typeLabel: Record<string, string> = {
  PRODUCT: "상품 문의",
  SHIPPING: "배송 문의",
  RETURN: "반품/교환",
  OTHER: "기타",
};

const typeStyle: Record<string, string> = {
  PRODUCT: "bg-blue-100 text-blue-700",
  SHIPPING: "bg-orange-100 text-orange-700",
  RETURN: "bg-purple-100 text-purple-700",
  OTHER: "bg-gray-100 text-gray-700",
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

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, typeFilter, page]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (typeFilter) params.set("type", typeFilter);
      params.set("page", String(page));

      const response = await fetch(`/api/admin/contacts?${params.toString()}`);
      if (!response.ok) throw new Error("문의 목록을 불러오는데 실패했습니다");
      const data = await response.json();
      setContacts(data.contacts);
      setTotalPages(data.totalPages);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (contact: Contact) => {
    if (expandedId === contact.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(contact.id);
    setEditStatus(contact.status);
  };

  const handleSave = async (id: string) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: editStatus }),
      });

      if (!response.ok) throw new Error("문의 수정에 실패했습니다");

      alert("저장되었습니다");
      await fetchContacts();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("이 문의를 삭제하시겠습니까?")) return;
    try {
      setDeleting(true);
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("문의 삭제에 실패했습니다");

      setExpandedId(null);
      await fetchContacts();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setDeleting(false);
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

  if (loading && contacts.length === 0) {
    return <div className="text-center py-12">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          문의 관리
        </h2>
        <p className="text-gray-600 mt-1">
          한국어 사이트를 통해 접수된 고객 문의를 관리합니다
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
      {contacts.length === 0 ? (
        <Card className="p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            문의가 없습니다
          </h3>
          <p className="text-gray-600">조건에 해당하는 문의가 없습니다</p>
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
                  유형
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  이름
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  이메일
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">
                  연락처
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  제목
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-24">
                  상태
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {contacts.map((contact) => (
                <Fragment key={contact.id}>
                  <tr
                    onClick={() => toggleExpand(contact)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(contact.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${typeStyle[contact.type]}`}
                      >
                        {typeLabel[contact.type] || contact.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {contact.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {contact.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {contact.phone || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                      {contact.subject}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[contact.status]}`}
                      >
                        {statusLabel[contact.status] || contact.status}
                      </span>
                    </td>
                  </tr>
                  {expandedId === contact.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="px-6 py-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <User className="w-4 h-4 text-gray-400" />
                            이름: {contact.name}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Mail className="w-4 h-4 text-gray-400" />
                            이메일: {contact.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Phone className="w-4 h-4 text-gray-400" />
                            연락처: {contact.phone || "-"}
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-xs font-medium text-gray-500 mb-2">
                            제목
                          </p>
                          <p className="text-sm text-gray-800 bg-white border border-gray-200 rounded-lg p-3">
                            {contact.subject}
                          </p>
                        </div>

                        <div className="mb-4">
                          <p className="text-xs font-medium text-gray-500 mb-2">
                            문의 내용
                          </p>
                          <p className="text-sm text-gray-800 whitespace-pre-wrap bg-white border border-gray-200 rounded-lg p-3">
                            {contact.message}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              상태 변경
                            </label>
                            <select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="PENDING">대기중</option>
                              <option value="IN_PROGRESS">처리중</option>
                              <option value="RESOLVED">해결됨</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(contact.id)}
                            disabled={deleting}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {deleting ? "삭제 중..." : "삭제"}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSave(contact.id)}
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
