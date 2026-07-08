"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  Download,
  Mail,
  Phone,
  MapPin,
  Check,
  X,
} from "lucide-react";
import { generateQuotePDF } from "@/lib/pdfGenerator";

interface QuoteDetail {
  id: string;
  quoteNumber: string;
  status: string;
  totalAmount: number;
  originalAmount: number;
  discountAmount: number;
  validUntil: string;
  notes: string | null;
  createdAt: string;
  customer: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    phone: string | null;
    address: string | null;
  };
  salesManager: {
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
  };
  items: Array<{
    id: string;
    quantity: number;
    originalPrice: number;
    quotedPrice: number;
    product: {
      id: string;
      name: string;
      brand: string;
      imageUrl: string | null;
      category: {
        name: string;
      };
    };
  }>;
}

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const quoteId = params.quoteId as string;

  const [quote, setQuote] = useState<QuoteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuote();
  }, [quoteId]);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/quotes/${quoteId}`);
      if (!response.ok) throw new Error("견적서를 불러오는데 실패했습니다");
      const data = await response.json();
      setQuote(data);
    } catch (err: any) {
      alert(err.message);
      router.push("/mypage/quotes");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm("이 견적서를 승인하시겠습니까?")) return;

    try {
      setSubmitting(true);
      const response = await fetch(`/api/quotes/${quoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "승인에 실패했습니다");
      }

      alert("견적서가 승인되었습니다!");
      fetchQuote(); // 새로고침
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!confirm("이 견적서를 거부하시겠습니까?")) return;

    try {
      setSubmitting(true);
      const response = await fetch(`/api/quotes/${quoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject" }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "거부에 실패했습니다");
      }

      alert("견적서가 거부되었습니다.");
      fetchQuote(); // 새로고침
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const handleDownloadPDF = () => {
    if (!quote) return;
    generateQuotePDF(quote);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "SENT":
        return { label: "전송됨", color: "bg-blue-100 text-blue-800" };
      case "APPROVED":
        return { label: "승인됨", color: "bg-green-100 text-green-800" };
      case "REJECTED":
        return { label: "거부됨", color: "bg-red-100 text-red-800" };
      case "EXPIRED":
        return { label: "만료됨", color: "bg-orange-100 text-orange-800" };
      case "ORDERED":
        return { label: "주문완료", color: "bg-purple-100 text-purple-800" };
      default:
        return { label: status, color: "bg-gray-100 text-gray-800" };
    }
  };

  if (loading || !quote) {
    return <div className="text-center py-12">로딩 중...</div>;
  }

  const statusInfo = getStatusInfo(quote.status);
  const validDate = new Date(quote.validUntil);
  const isExpired = validDate < new Date();
  const canApprove = quote.status === "SENT" && !isExpired;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/mypage/quotes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {quote.quoteNumber}
            </h2>
            <p className="text-gray-600 mt-1">
              {new Date(quote.createdAt).toLocaleDateString("ko-KR")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <Download className="w-4 h-4 mr-2" />
            PDF 다운로드
          </Button>
          <span
            className={`px-4 py-2 text-sm font-medium rounded-full ${statusInfo.color}`}
          >
            {statusInfo.label}
          </span>
          {isExpired && quote.status === "SENT" && (
            <span className="px-4 py-2 text-sm font-medium rounded-full bg-orange-100 text-orange-800">
              만료됨
            </span>
          )}
        </div>
      </div>

      {/* 영업매니저 정보 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">담당 영업매니저</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-sm">
              <strong>{quote.salesManager.name || "이름 없음"}</strong> (
              {quote.salesManager.email})
            </span>
          </div>
          {quote.salesManager.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{quote.salesManager.phone}</span>
            </div>
          )}
        </div>
      </Card>

      {/* 견적 항목 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">견적 항목</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">
                  제품
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-900">
                  수량
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-900">
                  원가
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-900">
                  견적가
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-900">
                  합계
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {quote.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.product.brand} · {item.product.category.name}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-sm">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-500 line-through">
                    {formatPrice(item.originalPrice)}원
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium">
                    {formatPrice(item.quotedPrice)}원
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-green-600">
                    {formatPrice(item.quotedPrice * item.quantity)}원
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 메모 */}
      {quote.notes && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">메모</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{quote.notes}</p>
        </Card>
      )}

      {/* 총액 */}
      <Card className="p-6 bg-gray-50">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">원가 총액</span>
            <span className="font-medium">
              {formatPrice(quote.originalAmount)}원
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">할인 금액</span>
            <span className="text-red-600 font-medium">
              -{formatPrice(quote.discountAmount)}원
            </span>
          </div>
          <div className="border-t pt-3 flex justify-between">
            <span className="text-lg font-semibold">견적 총액</span>
            <span className="text-2xl font-bold text-green-600">
              {formatPrice(quote.totalAmount)}원
            </span>
          </div>
          <div className="text-sm text-gray-600 text-right">
            유효기간: {new Date(quote.validUntil).toLocaleDateString("ko-KR")}
            {isExpired && " (만료됨)"}
          </div>
        </div>
      </Card>

      {/* 액션 버튼 */}
      {canApprove && (
        <div className="flex gap-4">
          <Button
            onClick={handleReject}
            disabled={submitting}
            variant="outline"
            className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
          >
            <X className="w-4 h-4 mr-2" />
            {submitting ? "처리 중..." : "거부"}
          </Button>
          <Button
            onClick={handleApprove}
            disabled={submitting}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Check className="w-4 h-4 mr-2" />
            {submitting ? "처리 중..." : "승인"}
          </Button>
        </div>
      )}

      {quote.status === "APPROVED" && (
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-green-900 mb-1">
                견적서가 승인되었습니다
              </h4>
              <p className="text-sm text-green-700">
                결제를 진행하시려면 아래 결제 버튼을 클릭하세요.
              </p>
              <Button className="mt-4 bg-green-600 hover:bg-green-700">
                결제하기
              </Button>
            </div>
          </div>
        </Card>
      )}

      {quote.status === "REJECTED" && (
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <X className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900 mb-1">
                견적서가 거부되었습니다
              </h4>
              <p className="text-sm text-red-700">
                다른 조건으로 견적을 다시 요청하시려면 영업매니저에게
                문의하세요.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
