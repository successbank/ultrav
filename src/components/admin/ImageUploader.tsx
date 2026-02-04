'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 5,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    )

    handleFiles(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      handleFiles(Array.from(files))
    }
  }

  const handleFiles = async (files: File[]) => {
    const remainingSlots = maxImages - images.length
    const filesToProcess = files.slice(0, remainingSlots)

    if (filesToProcess.length === 0) {
      alert(`최대 ${maxImages}장까지만 업로드할 수 있습니다`)
      return
    }

    const newImages: string[] = []

    for (const file of filesToProcess) {
      // 파일 크기 체크 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name}은(는) 5MB를 초과합니다`)
        continue
      }

      // Base64로 변환
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        newImages.push(base64String)

        if (newImages.length === filesToProcess.length) {
          onChange([...images, ...newImages])
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {/* 업로드 영역 */}
      {images.length < maxImages && (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <Upload
            size={48}
            className={`mx-auto mb-4 ${
              isDragging ? 'text-blue-500' : 'text-gray-400'
            }`}
          />

          <p className="text-gray-700 font-medium mb-2">
            이미지를 드래그하거나 클릭하여 업로드
          </p>
          <p className="text-sm text-gray-500">
            최대 {maxImages}장, 각 파일 5MB 이하 (
            {images.length}/{maxImages})
          </p>
        </div>
      )}

      {/* 이미지 미리보기 */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
            >
              <img
                src={image}
                alt={`업로드 이미지 ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* 삭제 버튼 */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="이미지 삭제"
              >
                <X size={16} />
              </button>

              {/* 순서 표시 */}
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                {index + 1}번
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 안내 메시지 */}
      {images.length === 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ImageIcon size={16} />
          <span>아직 업로드된 이미지가 없습니다</span>
        </div>
      )}
    </div>
  )
}
