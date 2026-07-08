import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 카테고리 구조 변경 시작...')

  await prisma.$transaction(async (tx) => {
    // 1. Product 참조 테이블 삭제 (외래키 순서)
    const deletedQuoteItems = await tx.quoteItem.deleteMany({})
    console.log(`  🗑️ QuoteItem ${deletedQuoteItems.count}건 삭제`)

    const deletedReviews = await tx.review.deleteMany({})
    console.log(`  🗑️ Review ${deletedReviews.count}건 삭제`)

    const deletedWishlist = await tx.wishlist.deleteMany({})
    console.log(`  🗑️ Wishlist ${deletedWishlist.count}건 삭제`)

    const deletedOrderItems = await tx.orderItem.deleteMany({})
    console.log(`  🗑️ OrderItem ${deletedOrderItems.count}건 삭제`)

    const deletedCartItems = await tx.cartItem.deleteMany({})
    console.log(`  🗑️ CartItem ${deletedCartItems.count}건 삭제`)

    // 2. Product 전체 삭제
    const deletedProducts = await tx.product.deleteMany({})
    console.log(`  🗑️ Product ${deletedProducts.count}건 삭제`)

    // 3. Category 삭제 (Level 2 → Level 1 순)
    const deletedSubCategories = await tx.category.deleteMany({ where: { level: 2 } })
    console.log(`  🗑️ Category(Level 2) ${deletedSubCategories.count}건 삭제`)

    const deletedTopCategories = await tx.category.deleteMany({ where: { level: 1 } })
    console.log(`  🗑️ Category(Level 1) ${deletedTopCategories.count}건 삭제`)

    // 4. 새 카테고리 생성 — Level 1 (대분류 3개)
    const ultracol = await tx.category.create({
      data: { name: 'ULTRACOL', slug: 'ultracol', level: 1, description: 'Ultracol 필러 라인업' },
    })

    const liftingThreads = await tx.category.create({
      data: { name: 'LIFTING THREADS', slug: 'lifting-threads', level: 1, description: '리프팅 실 (PDO/PCL/PLLA/PLCL)' },
    })

    const medicalDevices = await tx.category.create({
      data: { name: 'MEDICAL DEVICES', slug: 'medical-devices', level: 1, description: '의료기기 제품' },
    })

    console.log('  ✅ 대분류 3개 생성: ULTRACOL, LIFTING THREADS, MEDICAL DEVICES')

    // 5. 새 카테고리 생성 — Level 2 (중분류 11개)
    const subCategories = [
      // ULTRACOL 하위
      { name: 'Ultracol 100', slug: 'ultracol-100', level: 2, parentId: ultracol.id, description: 'Ultracol 100 시리즈' },
      { name: 'Ultracol 200', slug: 'ultracol-200', level: 2, parentId: ultracol.id, description: 'Ultracol 200 시리즈' },
      // LIFTING THREADS 하위
      { name: 'PDO', slug: 'thread-pdo', level: 2, parentId: liftingThreads.id, description: 'PDO (Polydioxanone) 리프팅 실' },
      { name: 'PCL', slug: 'thread-pcl', level: 2, parentId: liftingThreads.id, description: 'PCL (Polycaprolactone) 리프팅 실' },
      { name: 'PLLA', slug: 'thread-plla', level: 2, parentId: liftingThreads.id, description: 'PLLA (Poly-L-Lactic Acid) 리프팅 실' },
      { name: 'PLCL', slug: 'thread-plcl', level: 2, parentId: liftingThreads.id, description: 'PLCL (Poly L-Lactide-Co-Caprolactone) 리프팅 실' },
      // MEDICAL DEVICES 하위
      { name: 'Triderm', slug: 'device-triderm', level: 2, parentId: medicalDevices.id, description: 'Triderm 스킨케어 디바이스' },
      { name: 'Air Shine', slug: 'device-air-shine', level: 2, parentId: medicalDevices.id, description: 'Air Shine 미용 디바이스' },
      { name: 'Hifu Plus', slug: 'device-hifu-plus', level: 2, parentId: medicalDevices.id, description: 'Hifu Plus 초음파 디바이스' },
      { name: 'Colasty', slug: 'device-colasty', level: 2, parentId: medicalDevices.id, description: 'Colasty 의료기기' },
      { name: 'Cryo Stamp', slug: 'device-cryo-stamp', level: 2, parentId: medicalDevices.id, description: 'Cryo Stamp 냉동 스탬프 디바이스' },
    ]

    for (const cat of subCategories) {
      await tx.category.create({ data: cat })
    }

    console.log('  ✅ 중분류 11개 생성 완료')
  })

  console.log('🎉 카테고리 구조 변경 완료! (3 대분류 + 11 중분류 = 14개 카테고리)')
}

main()
  .catch((e) => {
    console.error('❌ 카테고리 리셋 실패:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
