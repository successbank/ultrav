import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 이미지가 있는 리뷰 중 하나 찾기
  const reviewsWithImages = await prisma.review.findMany({
    where: {
      images: {
        isEmpty: false
      }
    },
    include: {
      product: {
        select: {
          id: true,
          name: true
        }
      }
    },
    take: 5
  })

  console.log(`\n이미지가 있는 리뷰 ${reviewsWithImages.length}개 발견\n`)

  reviewsWithImages.forEach((review, index) => {
    console.log(`${index + 1}. 제품: ${review.product.name}`)
    console.log(`   제품 ID: ${review.product.id}`)
    console.log(`   리뷰 ID: ${review.id}`)
    console.log(`   이미지 수: ${review.images.length}`)
    console.log(`   이미지: ${review.images.slice(0, 2).join(', ')}${review.images.length > 2 ? '...' : ''}`)
    console.log(`   URL: http://localhost:5635/products/${review.product.id}\n`)
  })
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })
