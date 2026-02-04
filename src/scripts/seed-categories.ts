import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 카테고리 초기 데이터 시드 시작...\n')

  // 기존 카테고리 확인
  const existingCategories = await prisma.category.findMany()
  const existingProducts = await prisma.product.findMany()

  if (existingCategories.length > 0) {
    console.log(`⚠️  기존 카테고리 ${existingCategories.length}개 발견`)
    console.log(`⚠️  기존 제품 ${existingProducts.length}개 발견`)
    console.log('\n⚠️  경고: 기존 카테고리가 있습니다.')
    console.log('계속 진행하려면 다음 단계를 수동으로 수행하세요:')
    console.log('1. 관리자 페이지에서 기존 카테고리를 먼저 삭제하세요.')
    console.log('2. 또는 이 스크립트를 수정하여 중복되지 않는 카테고리만 추가하세요.\n')
    return
  }

  const categories: any[] = []

  // 1. 울트라콜 (대분류)
  console.log('1. 울트라콜 카테고리 생성 중...')
  const ultraCall = await prisma.category.create({
    data: {
      name: '울트라콜',
      slug: 'ultra-call',
      description: '울트라콜 제품군',
      level: 1,
    }
  })
  categories.push(ultraCall)
  console.log('   ✅ 울트라콜 생성 완료')

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
  console.log('   ✅ 울트라콜100 생성 완료')

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
  console.log('   ✅ 울트라콜200 생성 완료\n')

  // 2. 장비 (대분류)
  console.log('2. 장비 카테고리 생성 중...')
  const equipment = await prisma.category.create({
    data: {
      name: '장비',
      slug: 'equipment',
      description: '의료 및 미용 장비',
      level: 1,
    }
  })
  categories.push(equipment)
  console.log('   ✅ 장비 생성 완료')

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
  console.log('   ✅ 트라이덤 생성 완료')

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
  console.log('   ✅ 에어샤인 생성 완료')

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
  console.log('   ✅ 하이푸플러스 생성 완료')

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
  console.log('   ✅ 콜라스티 생성 완료')

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
  console.log('   ✅ 크라이오 스템프 생성 완료\n')

  // 3. 실 제품군 (대분류)
  console.log('3. 실 제품군 카테고리 생성 중...')
  const threadProducts = await prisma.category.create({
    data: {
      name: '실 제품군',
      slug: 'thread-products',
      description: '실 제품군',
      level: 1,
    }
  })
  categories.push(threadProducts)
  console.log('   ✅ 실 제품군 생성 완료\n')

  console.log('🎉 카테고리 초기 데이터 시드 완료!')
  console.log(`총 ${categories.length}개의 카테고리가 생성되었습니다.\n`)

  console.log('📊 생성된 카테고리 계층 구조:\n')

  const allCategories = await prisma.category.findMany({
    include: {
      parent: true,
      _count: {
        select: {
          children: true
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
    console.log(`${indent}${arrow}${cat.name}${childInfo}`)
  })

  console.log('\n✨ 시드 작업이 완료되었습니다.')
  console.log('\n💡 다음 단계:')
  console.log('   1. 관리자 페이지에서 카테고리를 확인하세요.')
  console.log('   2. 제품을 추가할 때 적절한 카테고리를 선택하세요.')
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
