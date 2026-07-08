"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileText, Eye, Calendar, DollarSign } from "lucide-react";

// 영문 견적서 목록 — 기존 /api/quotes를 수정 없이 재사용한다. (KO src/app/mypage/quotes/page.tsx 참고)
interface Quote {
  id: string;
  quoteNumber: string;
  status: string;
  totalAmount: number;
  originalAmount: number;
  discountAmount: number;
  validUntil: string;
  createdAt: string;
  salesManager: {
    id: string;
    email: string;
    name: string | null;
  };
  _count: {
    items: number;
  };
}

export default function EnMyQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/quotes");
      if (!response.ok) throw new Error("Failed to load quotes.");
      const data = await response.json();
      setQuotes(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PENDING":
        return { label: "Pending", color: "bg-gray-100 text-gray-800" };
      case "SENT":
        return { label: "Sent", color: "bg-blue-100 text-blue-800" };
      case "APPROVED":
        return { label: "Approved", color: "bg-green-100 text-green-800" };
      case "REJECTED":
        return { label: "Rejected", color: "bg-red-100 text-red-800" };
      case "EXPIRED":
        return { label: "Expired", color: "bg-orange-100 text-orange-800" };
      case "ORDERED":
        return { label: "Ordered", color: "bg-purple-100 text-purple-800" };
      default:
        return { label: status, color: "bg-gray-100 text-gray-800" };
    }
  };

  const filteredQuotes = quotes.filter(
    (q) => statusFilter === "all" || q.status === statusFilter,
  );

  if (loading) {
    return <div className="text-center py-12">Loading…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Quotes</h2>
          <p className="text-gray-600 mt-1">
            Review and approve the quotes you have received
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-green-600">{quotes.length}</p>
          <p className="text-sm text-gray-600">Total Quotes</p>
        </div>
      </div>

      {/* 필터 */}
      <div className="flex gap-2">
        <Button
          variant={statusFilter === "all" ? "primary" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("all")}
        >
          All
        </Button>
        <Button
          variant={statusFilter === "SENT" ? "primary" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("SENT")}
        >
          Pending
        </Button>
        <Button
          variant={statusFilter === "APPROVED" ? "primary" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("APPROVED")}
        >
          Approved
        </Button>
        <Button
          variant={statusFilter === "REJECTED" ? "primary" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("REJECTED")}
        >
          Rejected
        </Button>
      </div>

      {filteredQuotes.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No quotes found
          </h3>
          <p className="text-gray-600">
            Quotes issued by your sales manager will appear here.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredQuotes.map((quote) => {
            const statusInfo = getStatusInfo(quote.status);
            const validDate = new Date(quote.validUntil);
            const isExpired = validDate < new Date();
            const canApprove = quote.status === "SENT" && !isExpired;

            return (
              <Card
                key={quote.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {quote.quoteNumber}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                      {isExpired && quote.status === "SENT" && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                          Expired
                        </span>
                      )}
                      {canApprove && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 animate-pulse">
                          Awaiting Approval
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        Sales Manager:{" "}
                        {quote.salesManager.name || quote.salesManager.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {quote._count.items} item(s)
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(quote.createdAt).toLocaleDateString("en-US")}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Original:</span>{" "}
                        <span className="font-medium text-gray-400 line-through">
                          {formatPrice(quote.originalAmount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Discount:</span>{" "}
                        <span className="font-medium text-red-600">
                          -{formatPrice(quote.discountAmount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Quoted Price:</span>{" "}
                        <span className="text-xl font-bold text-green-600">
                          {formatPrice(quote.totalAmount)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-gray-600">
                      Valid until:{" "}
                      {new Date(quote.validUntil).toLocaleDateString("en-US")}
                      {isExpired && " (Expired)"}
                    </div>
                  </div>

                  <Link href={`/en/mypage/quotes/${quote.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
