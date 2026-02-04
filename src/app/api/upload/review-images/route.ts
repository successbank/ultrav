/**
 * 리뷰 이미지 업로드 API
 * POST /api/upload/review-images
 *
 * - 최대 5개 이미지
 * - 각 파일 최대 5MB
 * - 허용 타입: image/jpeg, image/png, image/webp
 */

import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { auth } from '@/lib/auth'

const MAX_FILES = 5
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('images') as File[]

    // 파일 개수 검증
    if (files.length === 0) {
      return NextResponse.json(
        { error: '이미지를 선택해주세요' },
        { status: 400 }
      )
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `최대 ${MAX_FILES}개의 이미지만 업로드 가능합니다` },
        { status: 400 }
      )
    }

    // 업로드 디렉토리 생성
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'reviews')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const uploadedUrls: string[] = []

    // 각 파일 처리
    for (const file of files) {
      // 파일 타입 검증
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `지원하지 않는 파일 형식입니다: ${file.type}. JPG, PNG, WEBP만 허용됩니다.` },
          { status: 400 }
        )
      }

      // 파일 크기 검증
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `파일 크기가 너무 큽니다. 최대 ${MAX_FILE_SIZE / 1024 / 1024}MB까지 허용됩니다.` },
          { status: 400 }
        )
      }

      // 고유한 파일명 생성
      const timestamp = Date.now()
      const random = Math.floor(Math.random() * 1000)
      const ext = file.name.split('.').pop() || 'jpg'
      const filename = `review_${session.user.id}_${timestamp}_${random}.${ext}`

      // 파일 저장
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filepath = path.join(uploadDir, filename)

      await writeFile(filepath, buffer)

      // URL 생성 (public 기준 상대 경로)
      const url = `/uploads/reviews/${filename}`
      uploadedUrls.push(url)
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedUrls.length}개의 이미지가 업로드되었습니다`,
      data: {
        urls: uploadedUrls
      }
    })
  } catch (error: any) {
    console.error('이미지 업로드 실패:', error)
    return NextResponse.json(
      { error: '이미지 업로드 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
