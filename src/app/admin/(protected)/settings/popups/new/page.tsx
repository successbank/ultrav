"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Save, ImageIcon, Code, LayoutTemplate } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import { popupTemplates } from "@/lib/popupTemplates";

export default function NewPopupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    contentType: "image" as "image" | "html",
    imageUrl: "",
    content: "",
    linkUrl: "",
    startDate: "",
    endDate: "",
    width: 480,
    height: 600,
    order: 0,
    isActive: true,
  });

  const handleSelectTemplate = (template: (typeof popupTemplates)[number]) => {
    if (formData.content && formData.content.trim().length > 0) {
      const confirmed = window.confirm(
        "작성 중인 내용을 템플릿으로 교체할까요?",
      );
      if (!confirmed) return;
    }
    setFormData({
      ...formData,
      contentType: "html",
      content: template.html,
      width: template.width,
      height: template.height,
      title: `[템플릿] ${template.name}`,
    });
    setShowPreview(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      alert("제목은 필수입니다");
      return;
    }

    if (formData.contentType === "image" && !formData.imageUrl) {
      alert("이미지는 필수입니다");
      return;
    }

    if (formData.contentType === "html" && !formData.content) {
      alert("HTML 콘텐츠는 필수입니다");
      return;
    }

    if (
      formData.startDate &&
      formData.endDate &&
      formData.startDate >= formData.endDate
    ) {
      alert("종료일은 시작일 이후여야 합니다");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/admin/popups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          startDate: formData.startDate || null,
          endDate: formData.endDate || null,
        }),
      });

      if (!response.ok) throw new Error("레이어 팝업 생성 실패");

      alert("레이어 팝업이 추가되었습니다");
      router.push("/admin/settings/popups");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Link href="/admin/settings/popups">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">새 팝업 추가</h2>
          <p className="text-gray-600 mt-1">
            홈페이지에 표시될 레이어 팝업을 추가합니다
          </p>
        </div>
      </div>

      {/* 템플릿 선택 */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">템플릿 선택</h3>
        </div>
        <p className="text-sm text-gray-500">
          상황에 맞는 템플릿을 선택하면 HTML 콘텐츠와 권장 크기가 자동으로
          채워집니다. 선택 후 아래 콘텐츠 영역에서 자유롭게 수정할 수 있습니다.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {popupTemplates.map((template) => {
            const previewScale = 200 / template.width;
            return (
              <button
                key={template.key}
                type="button"
                onClick={() => handleSelectTemplate(template)}
                className="text-left border border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 hover:shadow-md transition-all bg-white"
              >
                <div className="h-28 bg-gray-50 overflow-hidden relative">
                  <div
                    style={{
                      width: template.width,
                      height: template.height,
                      transform: `scale(${previewScale})`,
                      transformOrigin: "top left",
                      pointerEvents: "none",
                    }}
                    dangerouslySetInnerHTML={{ __html: template.html }}
                  />
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold text-gray-900">
                    {template.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {template.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          {/* 관리 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              관리 제목 <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="관리자 식별용 제목 (사용자에게는 노출되지 않음)"
              required
            />
          </div>

          {/* 콘텐츠 유형 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              콘텐츠 유형 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, contentType: "image" })
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  formData.contentType === "image"
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                이미지
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, contentType: "html" })
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  formData.contentType === "html"
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Code className="w-4 h-4" />
                HTML 콘텐츠
              </button>
            </div>
          </div>

          {/* 콘텐츠 영역 (유형에 따라 분기) */}
          {formData.contentType === "image" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지 <span className="text-red-500">*</span>
              </label>
              <ImageUploader
                images={formData.imageUrl ? [formData.imageUrl] : []}
                onChange={(images) =>
                  setFormData({ ...formData, imageUrl: images[0] || "" })
                }
                maxImages={1}
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  HTML 콘텐츠 <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {showPreview ? "에디터 보기" : "미리보기"}
                </button>
              </div>
              {showPreview ? (
                <div
                  className="border rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-auto bg-white"
                  dangerouslySetInnerHTML={{ __html: formData.content }}
                />
              ) : (
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="HTML 코드를 입력하세요"
                  className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              )}
              <p className="text-xs text-gray-500 mt-1">
                인라인 스타일을 포함한 HTML을 직접 입력합니다
              </p>
            </div>
          )}

          {/* 링크 URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              링크 URL
            </label>
            <Input
              value={formData.linkUrl}
              onChange={(e) =>
                setFormData({ ...formData, linkUrl: e.target.value })
              }
              placeholder="이미지 클릭 시 이동할 URL (예: /products/123)"
            />
          </div>

          {/* 노출 기간 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                노출 시작일
              </label>
              <Input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
              <p className="text-xs text-gray-500 mt-1">비워두면 즉시 노출</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                노출 종료일
              </label>
              <Input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
              <p className="text-xs text-gray-500 mt-1">비워두면 무기한</p>
            </div>
          </div>

          {/* 크기 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                너비 (px)
              </label>
              <Input
                type="number"
                value={formData.width}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    width: parseInt(e.target.value) || 480,
                  })
                }
                min={200}
                max={800}
              />
              <p className="text-xs text-gray-500 mt-1">200 ~ 800px</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                높이 (px)
              </label>
              <Input
                type="number"
                value={formData.height}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    height: parseInt(e.target.value) || 600,
                  })
                }
                min={200}
                max={900}
              />
              <p className="text-xs text-gray-500 mt-1">200 ~ 900px</p>
            </div>
          </div>

          {/* 순서 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              표시 순서
            </label>
            <Input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) })
              }
              min={0}
            />
            <p className="text-xs text-gray-500 mt-1">
              낮은 숫자가 먼저 표시됩니다
            </p>
          </div>

          {/* 활성화 */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700"
            >
              활성화 (체크시 홈페이지에 팝업 표시)
            </label>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {loading ? "저장 중..." : "저장"}
            </Button>
            <Link href="/admin/settings/popups" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                취소
              </Button>
            </Link>
          </div>
        </Card>
      </form>
    </div>
  );
}
