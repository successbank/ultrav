import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 카테고리 리셋 및 재생성 시작...\n')

  // 1. 기존 데이터 확인
  const existingCategories = await prisma.category.findMany()
  const existingProducts = await prisma.product.findMany()

  console.log(`📊 현재 상태:`)
  console.log(`   - 카테고리: ${existingCategories.length}개`)
  console.log(`   - 제품: ${existingProducts.length}개\n`)

  if (existingProducts.length > 0) {
    console.log('⚠️  경고: 제품이 존재합니다.')
    console.log('   제품의 카테고리 참조를 임시 제거해야 합니다.\n')

    // 임시 카테고리 생성 (제품 이동용)
    console.log('1️⃣  임시 카테고리 생성 중...')
    const tempCategory = await prisma.category.create({
      data: {
        name: '임시 카테고리',
        slug: 'temp-category',
        description: '제품 이동용 임시 카테고리',
        level: 1
      }
    })
    console.log('   ✅ 임시 카테고리 생성 완료\n')

    // 모든 제품을 임시 카테고리로 이동
    console.log('2️⃣  모든 제품을 임시 카테고리로 이동 중...')
    await prisma.product.updateMany({
      data: {
        categoryId: tempCategory.id
      }
    })
    console.log(`   ✅ ${existingProducts.length}개 제품 이동 완료\n`)

    // 기존 카테고리 삭제 (임시 제외)
    console.log('3️⃣  기존 카테고리 삭제 중...')
    await prisma.category.deleteMany({
      where: {
        id: {
          not: tempCategory.id
        }
      }
    })
    console.log('   ✅ 기존 카테고리 삭제 완료\n')
  } else if (existingCategories.length > 0) {
    console.log('기존 카테고리 삭제 중...')
    await prisma.category.deleteMany({})
    console.log('✅ 기존 카테고리 삭제 완료\n')
  }

  console.log('4️⃣  새 카테고리 구조 생성 중...\n')

  const categories: any[] = []

  // 1. 울트라콜 (대분류)
  console.log('   1. 울트라콜')
  const ultraCall = await prisma.category.create({
    data: {
      name: '울트라콜',
      slug: 'ultra-call',
      description: '울트라콜 제품군',
      level: 1,
    }
  })
  categories.push(ultraCall)

  // 1-1. 울트라콜100 (중분류)
  const ultraCall100 = await prisma.category.create({
    data: {
      name: '울트라콜100',
      slug: 'ultra-call-100',
      description: '울트라콜100 제품',
      level: 2,
      parentId: ultraCall.id
    }
  })
  categories.push(ultraCall100)
  console.log('      └─ 울트라콜100')

  // 1-2. 울트라콜200 (중분류)
  const ultraCall200 = await prisma.category.create({
    data: {
      name: '울트라콜200',
      slug: 'ultra-call-200',
      description: '울트라콜200 제품',
      level: 2,
      parentId: ultraCall.id
    }
  })
  categories.push(ultraCall200)
  console.log('      └─ 울트라콜200\n')

  // 2. 장비 (대분류)
  console.log('   2. 장비')
  const equipment = await prisma.category.create({
    data: {
      name: '장비',
      slug: 'equipment',
      description: '의료 및 미용 장비',
      level: 1,
    }
  })
  categories.push(equipment)

  // 2-1. 트라이덤 (중분류)
  const tridum = await prisma.category.create({
    data: {
      name: '트라이덤',
      slug: 'tridum',
      description: '트라이덤 장비',
      level: 2,
      parentId: equipment.id
    }
  })
  categories.push(tridum)
  console.log('      └─ 트라이덤')

  // 2-2. 에어샤인 (중분류)
  const airshine = await prisma.category.create({
    data: {
      name: '에어샤인',
      slug: 'airshine',
      description: '에어샤인 장비',
      level: 2,
      parentId: equipment.id
    }
  })
  categories.push(airshine)
  console.log('      └─ 에어샤인')

  // 2-3. 하이푸플러스 (중분류)
  const hifuPlus = await prisma.category.create({
    data: {
      name: '하이푸플러스',
      slug: 'hifu-plus',
      description: '하이푸플러스 장비',
      level: 2,
      parentId: equipment.id
    }
  })
  categories.push(hifuPlus)
  console.log('      └─ 하이푸플러스')

  // 2-4. 콜라스티 (중분류)
  const collasty = await prisma.category.create({
    data: {
      name: '콜라스티',
      slug: 'collasty',
      description: '콜라스티 장비',
      level: 2,
      parentId: equipment.id
    }
  })
  categories.push(collasty)
  console.log('      └─ 콜라스티')

  // 2-5. 크라이오 스템프 (중분류)
  const cryoStamp = await prisma.category.create({
    data: {
      name: '크라이오 스템프',
      slug: 'cryo-stamp',
      description: '크라이오 스템프 장비',
      level: 2,
      parentId: equipment.id
    }
  })
  categories.push(cryoStamp)
  console.log('      └─ 크라이오 스템프\n')

  // 3. 실 제품군 (대분류)
  console.log('   3. 실 제품군\n')
  const threadProducts = await prisma.category.create({
    data: {
      name: '실 제품군',
      slug: 'thread-products',
      description: '실 제품군',
      level: 1,
    }
  })
  categories.push(threadProducts)

  console.log('   ✅ 새 카테고리 구조 생성 완료\n')

  // 임시 카테고리가 있다면 삭제
  if (existingProducts.length > 0) {
    console.log('5️⃣  임시 카테고리 삭제 중...')
    const tempCat = await prisma.category.findFirst({
      where: { slug: 'temp-category' }
    })

    if (tempCat) {
      // 임시 카테고리의 제품을 울트라콜 카테고리로 이동
      await prisma.product.updateMany({
        where: { categoryId: tempCat.id },
        data: { categoryId: ultraCall.id }
      })

      await prisma.category.delete({
        where: { id: tempCat.id }
      })
      console.log('   ✅ 임시 카테고리 삭제 완료')
      console.log(`   ⚠️  기존 제품 ${existingProducts.length}개가 "울트라콜" 카테고리로 이동되었습니다.`)
      console.log('   💡 관리자 페이지에서 각 제품의 카테고리를 적절하게 재설정하세요.\n')
    }
  }

  console.log('🎉 카테고리 리셋 및 재생성 완료!')
  console.log(`   총 ${categories.length}개의 카테고리가 생성되었습니다.\n`)

  console.log('📊 최종 카테고리 계층 구조:\n')

  const allCategories = await prisma.category.findMany({
    include: {
      parent: true,
      _count: {
        select: {
          children: true,
          products: true
        }
      }
    },
    orderBy: [
      { level: 'asc' },
      { name: 'asc' }
    ]
  })

  allCategories.forEach(cat => {
    const indent = '  '.repeat(cat.level - 1)
    const arrow = cat.level > 1 ? '└─ ' : ''
    const childInfo = cat._count.children > 0 ? ` [하위 ${cat._count.children}개]` : ''
    const productInfo = cat._count.products > 0 ? ` (제품 ${cat._count.products}개)` : ''
    console.log(`${indent}${arrow}${cat.name}${childInfo}${productInfo}`)
  })

  console.log('\n✨ 작업이 완료되었습니다.')
  console.log('\n💡 다음 단계:')
  console.log('   1. http://localhost:5635/admin/categories 에서 카테고리 확인')
  console.log('   2. http://localhost:5635/admin/products 에서 제품의 카테고리 재설정')
}

main()
  .catch((e) => {
    console.error('\n❌ 에러 발생:', e.message)
    console.error('상세:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
