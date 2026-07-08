"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Save, ImageIcon, Code } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";
import InlineHtmlEditor from "@/components/admin/InlineHtmlEditor";

// 템플릿 등 div·표 기반 레이아웃 HTML 여부 (웹에디터 변환 시 깨질 수 있는 콘텐츠)
const isComplexHtml = (html: string) => /<(div|table|section)[\s>]/i.test(html);

interface PopupData {
  title: string;
  contentType: "image" | "html";
  imageUrl: string;
  content: string;
  linkUrl: string;
  startDate: string;
  endDate: string;
  width: number;
  height: number;
  order: number;
  isActive: boolean;
}

function toDatetimeLocal(isoString: string | null): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export default function EditPopupPage() {
  const params = useParams();
  const router = useRouter();
  const popupId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  // 콘텐츠 편집 모드: 간편 편집(레이아웃 보존) / 웹에디터 / HTML 소스
  // 기존 콘텐츠가 레이아웃 HTML(템플릿 등)이면 간편 편집 모드로 시작
  const [editorMode, setEditorMode] = useState<"visual" | "editor" | "html">(
    "editor",
  );
  const [visualKey, setVisualKey] = useState(0);
  const [formData, setFormData] = useState<PopupData>({
    title: "",
    contentType: "image",
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

  useEffect(() => {
    fetchPopup();
  }, [popupId]);

  const fetchPopup = async () => {
    try {
      setFetching(true);
      const response = await fetch(`/api/admin/popups/${popupId}`);
      if (!response.ok) throw new Error("레이어 팝업 조회 실패");
      const data = await response.json();
      setFormData({
        title: data.title || "",
        contentType: data.contentType || "image",
        imageUrl: data.imageUrl || "",
        content: data.content || "",
        linkUrl: data.linkUrl || "",
        startDate: toDatetimeLocal(data.startDate),
        endDate: toDatetimeLocal(data.endDate),
        width: data.width || 480,
        height: data.height || 600,
        order: data.order || 0,
        isActive: data.isActive,
      });
      // 템플릿형 레이아웃 콘텐츠는 웹에디터 변환 시 깨지므로 간편 편집(레이아웃 보존) 모드로 시작
      setEditorMode(isComplexHtml(data.content || "") ? "visual" : "editor");
      setVisualKey((k) => k + 1);
    } catch (error: any) {
      alert(error.message);
      router.push("/admin/settings/popups");
    } finally {
      setFetching(false);
    }
  };

  const handleEditorModeChange = (mode: "visual" | "editor" | "html") => {
    if (mode === editorMode) return;
    // 웹에디터(Quill) 전환 시 복잡한 레이아웃(템플릿 등)은 단순화될 수 있음을 경고
    if (mode === "editor" && isComplexHtml(formData.content)) {
      const confirmed = window.confirm(
        "웹에디터로 전환하면 템플릿 등 복잡한 레이아웃(표·영역 구조)이 단순화될 수 있습니다.\n템플릿 문구 수정은 '간편 편집'을 이용하세요.\n그래도 전환할까요?",
      );
      if (!confirmed) return;
    }
    if (mode === "visual") {
      setVisualKey((k) => k + 1); // 최신 content로 리마운트
    }
    setEditorMode(mode);
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
      const response = await fetch(`/api/admin/popups/${popupId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          startDate: formData.startDate || null,
          endDate: formData.endDate || null,
        }),
      });

      if (!response.ok) throw new Error("레이어 팝업 수정 실패");

      alert("레이어 팝업이 수정되었습니다");
      router.push("/admin/settings/popups");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center py-12">로딩 중...</div>;
  }

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
          <h2 className="text-2xl font-bold text-gray-900">팝업 수정</h2>
          <p className="text-gray-600 mt-1">레이어 팝업 정보를 수정합니다</p>
        </div>
      </div>

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
              placeholder="관리자 식별용 제목"
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
                  콘텐츠 <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex rounded-lg border border-gray-300 overflow-hidden text-sm">
                    <button
                      type="button"
                      onClick={() => handleEditorModeChange("visual")}
                      className={`px-3 py-1.5 transition-colors ${
                        editorMode === "visual"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      간편 편집
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditorModeChange("editor")}
                      className={`px-3 py-1.5 border-l border-gray-300 transition-colors ${
                        editorMode === "editor"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      웹에디터
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditorModeChange("html")}
                      className={`px-3 py-1.5 border-l border-gray-300 transition-colors ${
                        editorMode === "html"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      HTML 소스
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showPreview ? "에디터 보기" : "미리보기"}
                  </button>
                </div>
              </div>
              {showPreview ? (
                <div
                  className="border rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-auto bg-white"
                  dangerouslySetInnerHTML={{ __html: formData.content }}
                />
              ) : editorMode === "visual" ? (
                <InlineHtmlEditor
                  key={visualKey}
                  initialHtml={formData.content}
                  width={formData.width}
                  onChange={(html) =>
                    setFormData((prev) => ({ ...prev, content: html }))
                  }
                />
              ) : editorMode === "editor" ? (
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) =>
                    setFormData({ ...formData, content: value })
                  }
                  placeholder="팝업 내용을 입력하세요..."
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
                {editorMode === "visual"
                  ? "템플릿 디자인을 그대로 유지하며 문구만 수정합니다 (템플릿 권장)"
                  : editorMode === "editor"
                    ? "웹에디터로 자유롭게 작성합니다. 템플릿 문구 수정은 '간편 편집'을 이용하세요"
                    : "인라인 스타일을 포함한 HTML을 직접 입력합니다"}
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
