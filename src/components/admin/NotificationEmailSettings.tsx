"use client";

import { useEffect, useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type NotificationEmail = {
  id: string;
  email: string;
  createdAt: string;
};

const MAX_NOTIFICATION_EMAILS = 3;

export default function NotificationEmailSettings() {
  const [emails, setEmails] = useState<NotificationEmail[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = async () => {
    try {
      const response = await fetch("/api/admin/settings/notification-emails");
      if (response.ok) {
        const data = await response.json();
        setEmails(data);
      }
    } catch (err) {
      console.error("알림 이메일 목록 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleAdd = async () => {
    setError(null);

    if (!newEmail.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/settings/notification-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "등록에 실패했습니다.");
      }

      setNewEmail("");
      await fetchEmails();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(
        `/api/admin/settings/notification-emails/${id}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "삭제에 실패했습니다.");
      }

      await fetchEmails();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const isFull = emails.length >= MAX_NOTIFICATION_EMAILS;

  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        한국어/영문 문의 접수 시 아래 이메일로 알림이 발송됩니다 (최대 3개)
      </p>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          불러오는 중...
        </div>
      ) : (
        <ul className="space-y-2">
          {emails.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between px-4 py-2 border border-gray-200 rounded-lg"
            >
              <span className="text-gray-800">{item.email}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(item.id)}
                disabled={deletingId === item.id}
              >
                {deletingId === item.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 text-red-600" />
                )}
              </Button>
            </li>
          ))}
          {emails.length === 0 && (
            <li className="text-sm text-gray-400">
              등록된 알림 이메일이 없습니다.
            </li>
          )}
        </ul>
      )}

      <div className="flex items-start gap-2">
        <div className="flex-1">
          <Input
            type="email"
            placeholder="notify@example.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            disabled={isFull || submitting}
          />
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          {isFull && (
            <p className="text-sm text-gray-500 mt-1">
              최대 3개까지 등록 가능합니다.
            </p>
          )}
        </div>
        <Button onClick={handleAdd} disabled={isFull || submitting}>
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "추가"}
        </Button>
      </div>
    </div>
  );
}
