'use client'

import dynamic from 'next/dynamic'
import { useMemo, useRef, useState, useEffect } from 'react'
import 'react-quill/dist/quill.snow.css'

// SSR 방지 및 forwardRef 패턴으로 dynamic import
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill')
    // forwardedRef prop을 사용하여 ref 경고 해결
    return ({ forwardedRef, ...props }: any) => <RQ ref={forwardedRef} {...props} />
  },
  { ssr: false }
)

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = '상세 내용을 입력하세요...',
}: RichTextEditorProps) {
  const quillRef = useRef<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 이미지 업로드 핸들러 (Base64 인코딩)
  const imageHandler = () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return

      // 파일 크기 체크 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 크기는 5MB 이하여야 합니다')
        return
      }

      // Base64로 변환
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result as string
        const quill = quillRef.current?.getEditor()
        if (quill) {
          const range = quill.getSelection(true)
          quill.insertEmbed(range.index, 'image', base64)
          quill.setSelection(range.index + 1)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Quill 모듈 설정
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  )

  // Quill 포맷 설정
  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'list',
    'bullet',
    'align',
    'link',
    'image',
  ]

  // 마운트되기 전에는 로딩 표시
  if (!mounted) {
    return (
      <div className="border border-gray-300 rounded-lg p-4 min-h-[300px] bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">에디터 로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="rich-text-editor">
      <ReactQuill
        forwardedRef={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ minHeight: '300px' }}
      />
    </div>
  )
}
