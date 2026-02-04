/**
 * 리뷰 테스트 데이터 생성 스크립트
 *
 * 실행 방법:
 * cd /data/successbank/projects/ultra/src
 * DATABASE_URL="postgresql://ultra_user:lLi9CeCEgryaV3M06t9Oh3sKh@localhost:5636/ultra_db" npx tsx scripts/generate-review-test-data.ts
 */

import { PrismaClient, ReviewStatus } from '@prisma/client'

const prisma = new PrismaClient()

// 다양한 리뷰 템플릿 (한국어)
const reviewTemplates = {
  positive5: [
    '정말 최고의 제품이에요! 피부가 확실히 좋아졌어요. 강력 추천합니다!',
    '이 제품 쓰고 나서 피부 톤이 밝아졌어요. 계속 리피트할 예정입니다.',
    '가격 대비 효과가 정말 좋아요. 민감한 피부인데도 자극 없이 사용하고 있습니다.',
    '촉촉하고 흡수도 빠르고 정말 만족스러워요. 벌써 두 번째 구매했습니다.',
    '친구 추천으로 샀는데 정말 대박이에요! 모공도 줄어들고 피부결이 부드러워졌어요.',
    '이 가격에 이 퀄리티라니 믿기지 않아요. 가성비 최고입니다!',
    '민감성 피부라 걱정했는데 전혀 문제없어요. 피부가 진정되는 느낌이에요.',
    '사용한 지 일주일만에 효과를 봤어요. 주변에도 추천하고 다녀요.',
    '텍스처도 좋고 향도 은은해서 매일 사용하기 좋아요. 재구매 의사 100%!',
    '배송도 빠르고 제품도 훌륭해요. 이 브랜드 다른 제품도 구매할 예정입니다.',
  ],
  positive4: [
    '전반적으로 만족스러워요. 다만 향이 좀 강한 편이에요.',
    '효과는 좋은데 가격이 조금 부담스러워요. 그래도 재구매 의향 있습니다.',
    '사용감은 좋은데 흡수 속도가 조금 느린 것 같아요.',
    '기대했던 것보다는 약간 덜하지만 나쁘지 않아요.',
    '가격 대비 괜찮은 제품이에요. 큰 효과는 없지만 유지용으로 좋아요.',
    '배송은 빨랐는데 제품 용량이 생각보다 작아요. 그래도 품질은 좋습니다.',
    '효과가 즉각적이진 않지만 꾸준히 사용하면 좋을 것 같아요.',
    '무난한 제품이에요. 특별히 나쁜 점은 없지만 놀라운 효과도 없어요.',
  ],
  neutral3: [
    '그저 그래요. 특별히 좋지도 나쁘지도 않아요.',
    '기대에는 못 미치지만 사용할 만해요.',
    '가격을 생각하면 적당한 것 같아요.',
    '효과를 보려면 시간이 좀 더 필요할 것 같아요.',
    '평범한 제품이에요. 다른 제품과 큰 차이를 모르겠어요.',
    '나쁘지는 않은데 재구매까지는 고민이 돼요.',
  ],
  negative2: [
    '기대했던 것보다 별로예요. 효과를 못 느끼겠어요.',
    '제 피부에는 안 맞는 것 같아요. 트러블이 생겼어요.',
    '너무 끈적거려서 사용감이 좋지 않아요.',
    '가격에 비해 효과가 미미해요. 실망스러워요.',
    '향이 너무 강해서 사용하기 힘들어요.',
  ],
  negative1: [
    '최악이에요. 피부에 트러블만 생겼어요. 환불 받고 싶네요.',
    '전혀 효과 없고 오히려 피부가 나빠졌어요. 비추천합니다.',
    '이 돈 주고 이런 제품을 샀다니 후회돼요. 돈 아까워요.',
    '피부가 따갑고 붉어졌어요. 제게는 맞지 않는 제품이네요.',
  ]
}

// 랜덤 선택 헬퍼 함수
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

// 랜덤 날짜 생성 (최근 90일 이내)
function getRandomDate(): Date {
  const now = new Date()
  const daysAgo = Math.floor(Math.random() * 90) // 0-90일 전
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
  return date
}

// 별점에 따른 리뷰 텍스트 선택
function getReviewByRating(rating: number): string {
  switch (rating) {
    case 5:
      return getRandomElement(reviewTemplates.positive5)
    case 4:
      return getRandomElement(reviewTemplates.positive4)
    case 3:
      return getRandomElement(reviewTemplates.neutral3)
    case 2:
      return getRandomElement(reviewTemplates.negative2)
    case 1:
      return getRandomElement(reviewTemplates.negative1)
    default:
      return getRandomElement(reviewTemplates.positive5)
  }
}

// 별점 분포 (5점이 가장 많고, 1점이 가장 적음)
function getRandomRating(): number {
  const rand = Math.random()
  if (rand < 0.5) return 5  // 50% - 5점
  if (rand < 0.75) return 4 // 25% - 4점
  if (rand < 0.90) return 3 // 15% - 3점
  if (rand < 0.97) return 2 // 7% - 2점
  return 1                   // 3% - 1점
}

// 리뷰 상태 분포 (대부분 승인, 일부 대기/거부)
function getRandomStatus(): ReviewStatus {
  const rand = Math.random()
  if (rand < 0.75) return 'APPROVED' // 75% 승인
  if (rand < 0.90) return 'PENDING'  // 15% 대기
  return 'REJECTED'                   // 10% 거부
}

async function main() {
  console.log('🚀 리뷰 테스트 데이터 생성 시작...\n')

  // 기존 리뷰 삭제 (선택사항)
  const deleteExisting = process.argv.includes('--clean')
  if (deleteExisting) {
    console.log('🗑️  기존 리뷰 데이터 삭제 중...')
    await prisma.review.deleteMany({})
    console.log('✅ 기존 리뷰 데이터 삭제 완료\n')
  }

  // 사용자와 제품 조회
  const users = await prisma.user.findMany({
    select: { id: true, name: true }
  })

  const products = await prisma.product.findMany({
    select: { id: true, name: true }
  })

  if (users.length === 0) {
    console.error('❌ 사용자가 없습니다. 먼저 사용자를 생성하세요.')
    return
  }

  if (products.length === 0) {
    console.error('❌ 제품이 없습니다. 먼저 제품을 생성하세요.')
    return
  }

  console.log(`📊 사용자: ${users.length}명, 제품: ${products.length}개\n`)

  let totalReviews = 0
  const reviewsPerProduct: { [key: string]: number } = {}

  // 각 제품별로 10-25개의 리뷰 생성
  for (const product of products) {
    const reviewCount = Math.floor(Math.random() * 16) + 10 // 10~25개
    reviewsPerProduct[product.id] = reviewCount

    console.log(`📝 "${product.name}" - ${reviewCount}개 리뷰 생성 중...`)

    for (let i = 0; i < reviewCount; i++) {
      const user = getRandomElement(users)
      const rating = getRandomRating()
      const comment = getReviewByRating(rating)
      const status = getRandomStatus()
      const createdAt = getRandomDate()

      try {
        await prisma.review.create({
          data: {
            userId: user.id,
            productId: product.id,
            rating,
            comment,
            images: [], // 이미지는 Phase 2에서 구현
            status,
            createdAt,
            updatedAt: createdAt,
          }
        })
        totalReviews++
      } catch (error: any) {
        // 중복 리뷰 방지 (동일 사용자가 동일 제품에 여러 리뷰 작성 시도)
        if (error.code !== 'P2002') {
          console.error(`오류 발생: ${error.message}`)
        }
      }
    }

    console.log(`   ✅ 완료 (${reviewCount}개)`)
  }

  // 통계 출력
  console.log('\n\n✨ 리뷰 테스트 데이터 생성 완료!\n')
  console.log('📊 생성 통계:')
  console.log(`   총 리뷰 수: ${totalReviews}개`)
  console.log(`   제품 수: ${products.length}개`)
  console.log(`   사용자 수: ${users.length}명`)
  console.log(`   제품당 평균 리뷰 수: ${(totalReviews / products.length).toFixed(1)}개\n`)

  // 상태별 통계
  const statusCounts = await prisma.review.groupBy({
    by: ['status'],
    _count: { status: true }
  })

  console.log('📈 상태별 분포:')
  statusCounts.forEach(({ status, _count }) => {
    const percentage = ((_count.status / totalReviews) * 100).toFixed(1)
    console.log(`   ${status}: ${_count.status}개 (${percentage}%)`)
  })

  // 별점별 통계
  const ratingCounts = await prisma.review.groupBy({
    by: ['rating'],
    _count: { rating: true }
  })

  console.log('\n⭐ 별점별 분포:')
  ratingCounts
    .sort((a, b) => b.rating - a.rating)
    .forEach(({ rating, _count }) => {
      const percentage = ((_count.rating / totalReviews) * 100).toFixed(1)
      const stars = '⭐'.repeat(rating)
      console.log(`   ${stars} (${rating}점): ${_count.rating}개 (${percentage}%)`)
    })

  console.log('\n\n🎉 모든 작업이 완료되었습니다!')
}

main()
  .catch((e) => {
    console.error('❌ 오류 발생:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
