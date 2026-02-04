/**
 * 기존 리뷰 데이터에 이미지 추가 스크립트
 *
 * 실행 방법:
 * cd /data/successbank/projects/ultra/src
 * DATABASE_URL="postgresql://ultra_user:lLi9CeCEgryaV3M06t9Oh3sKh@localhost:5636/ultra_db" npx tsx scripts/add-review-images.ts
 */

import { PrismaClient } from '@prisma/client'
import https from 'https'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// 이미지 다운로드 함수 (리다이렉트 지원)
function downloadImage(url: string, filepath: string, maxRedirects = 5): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)

    const handleResponse = (response: any) => {
      // 리다이렉트 처리
      if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307) {
        if (maxRedirects <= 0) {
          fs.unlink(filepath, () => {})
          reject(new Error('Too many redirects'))
          return
        }

        const redirectUrl = response.headers.location
        if (!redirectUrl) {
          fs.unlink(filepath, () => {})
          reject(new Error('Redirect without location'))
          return
        }

        // 리다이렉트 URL로 재시도
        file.close()
        fs.unlink(filepath, () => {})
        downloadImage(redirectUrl, filepath, maxRedirects - 1)
          .then(resolve)
          .catch(reject)
        return
      }

      if (response.statusCode === 200) {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          resolve()
        })
      } else {
        fs.unlink(filepath, () => {})
        reject(new Error(`Failed to download: ${response.statusCode}`))
      }
    }

    https.get(url, handleResponse).on('error', (err) => {
      fs.unlink(filepath, () => {})
      reject(err)
    })
  })
}

// 랜덤 Picsum Photos 이미지 URL 생성 (Unsplash 대체)
function getRandomImageUrl(): string {
  const size = 800
  const randomId = Math.floor(Math.random() * 1000) + 1
  // Picsum Photos API - 안정적이고 빠름
  return `https://picsum.photos/id/${randomId}/${size}/${size}`
}

// 랜덤 이미지 개수 (1-3개)
function getRandomImageCount(): number {
  const rand = Math.random()
  if (rand < 0.5) return 1  // 50% - 1개
  if (rand < 0.85) return 2 // 35% - 2개
  return 3                   // 15% - 3개
}

async function main() {
  console.log('🎨 리뷰에 이미지 추가 시작...\n')

  // 업로드 디렉토리 확인/생성
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'reviews')
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
    console.log(`📁 디렉토리 생성: ${uploadDir}\n`)
  }

  // 모든 리뷰 조회
  const reviews = await prisma.review.findMany({
    select: { id: true }
  })

  console.log(`📊 총 리뷰 수: ${reviews.length}개\n`)

  // 30-40%의 리뷰에만 이미지 추가 (랜덤)
  const imageAddProbability = 0.35 // 35%
  let updatedCount = 0
  let totalImagesDownloaded = 0

  for (const review of reviews) {
    // 35% 확률로 이미지 추가
    if (Math.random() > imageAddProbability) {
      continue
    }

    const imageCount = getRandomImageCount()
    const imageUrls: string[] = []

    console.log(`📸 리뷰 ${review.id}: ${imageCount}개 이미지 다운로드 중...`)

    for (let i = 0; i < imageCount; i++) {
      try {
        const imageUrl = getRandomImageUrl()
        const timestamp = Date.now()
        const random = Math.floor(Math.random() * 1000)
        const filename = `review_${review.id}_${timestamp}_${random}_${i}.jpg`
        const filepath = path.join(uploadDir, filename)

        // 이미지 다운로드
        await downloadImage(imageUrl, filepath)

        // URL 저장 (/public 기준 상대 경로)
        const savedUrl = `/uploads/reviews/${filename}`
        imageUrls.push(savedUrl)

        console.log(`   ✓ 이미지 ${i + 1} 다운로드 완료`)

        // API rate limit 방지 (0.5초 대기)
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error: any) {
        console.error(`   ✗ 이미지 ${i + 1} 다운로드 실패:`, error.message)
      }
    }

    // DB 업데이트
    if (imageUrls.length > 0) {
      await prisma.review.update({
        where: { id: review.id },
        data: { images: imageUrls }
      })

      updatedCount++
      totalImagesDownloaded += imageUrls.length
      console.log(`   ✅ 리뷰 업데이트 완료 (${imageUrls.length}개 이미지)\n`)
    }
  }

  // 최종 통계
  console.log('\n✨ 이미지 추가 완료!\n')
  console.log('📊 최종 통계:')
  console.log(`   총 리뷰 수: ${reviews.length}개`)
  console.log(`   이미지 추가된 리뷰: ${updatedCount}개 (${((updatedCount / reviews.length) * 100).toFixed(1)}%)`)
  console.log(`   다운로드된 이미지: ${totalImagesDownloaded}개`)
  console.log(`   리뷰당 평균 이미지: ${(totalImagesDownloaded / updatedCount).toFixed(1)}개\n`)

  // 이미지 있는 리뷰 통계
  const reviewsWithImages = await prisma.review.count({
    where: {
      images: {
        isEmpty: false
      }
    }
  })

  console.log(`🖼️  이미지가 있는 리뷰: ${reviewsWithImages}개`)
  console.log(`📝 이미지가 없는 리뷰: ${reviews.length - reviewsWithImages}개\n`)

  console.log('🎉 모든 작업이 완료되었습니다!')
}

main()
  .catch((e) => {
    console.error('❌ 오류 발생:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
