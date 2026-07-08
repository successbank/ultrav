"use client";

import { useEffect, useRef } from "react";

// 레이아웃 보존형 시각 편집기 (팝업 템플릿용 "간편 편집")
// - contentEditable로 HTML 구조·인라인 스타일을 그대로 유지한 채 텍스트만 수정
// - Quill(RichTextEditor)은 div/table 레이아웃을 재해석해 깨뜨리므로 템플릿 편집에는 이 컴포넌트를 사용
// - 초기 HTML은 마운트 시 1회만 주입 (커서 유지를 위해 이후 re-render로 innerHTML을 덮지 않음)
//   → 외부에서 내용을 교체하려면 key를 바꿔 리마운트할 것
interface InlineHtmlEditorProps {
  initialHtml: string;
  onChange: (html: string) => void;
  /** 팝업 실제 너비(px) — 편집 영역을 팝업 크기로 맞춰 실제 노출과 동일하게 보이게 함 */
  width?: number;
  minHeight?: number;
}

export default function InlineHtmlEditor({
  initialHtml,
  onChange,
  width,
  minHeight = 240,
}: InlineHtmlEditorProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = initialHtml;
    }
    // 마운트 시 1회만 주입 (key 리마운트로 갱신)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="border border-gray-300 rounded-lg bg-gray-100 p-4 overflow-auto">
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => {
          if (ref.current) onChange(ref.current.innerHTML);
        }}
        className="bg-white mx-auto shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        style={{
          width: width ? `${width}px` : "100%",
          maxWidth: "100%",
          minHeight: `${minHeight}px`,
        }}
      />
      <p className="text-xs text-gray-500 mt-2 text-center">
        수정할 문구를 클릭해 바로 편집하세요 — 디자인 구조는 그대로 유지됩니다
      </p>
    </div>
  );
}
