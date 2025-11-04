import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 시드 데이터 생성 시작...')

  // 1. 관리자 계정 생성
  const hashedPassword = await bcrypt.hash('admin123!@#', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@ultra.com' },
    update: {},
    create: {
      email: 'admin@ultra.com',
      name: '관리자',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '010-1234-5678',
      address: '서울특별시 강남구 테헤란로 123',
    },
  })

  console.log('✅ 관리자 계정 생성:', admin.email)

  // 2. 테스트 사용자 생성
  const testUserPassword = await bcrypt.hash('test123!@#', 10)

  const testUser = await prisma.user.upsert({
    where: { email: 'test@ultra.com' },
    update: {},
    create: {
      email: 'test@ultra.com',
      name: '테스트 사용자',
      password: testUserPassword,
      role: 'USER',
      phone: '010-9876-5432',
      address: '서울특별시 서초구 강남대로 456',
    },
  })

  console.log('✅ 테스트 사용자 생성:', testUser.email)

  // 3. 카테고리 생성 (의류 쇼핑몰)
  const categories = [
    // 대분류
    { name: '상의', slug: 'tops', level: 1, parentId: null },
    { name: '하의', slug: 'bottoms', level: 1, parentId: null },
    { name: '아우터', slug: 'outer', level: 1, parentId: null },
    { name: '신발', slug: 'shoes', level: 1, parentId: null },
    { name: '악세서리', slug: 'accessories', level: 1, parentId: null },
  ]

  const createdCategories: any[] = []

  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    createdCategories.push(category)
    console.log(`✅ 카테고리 생성: ${category.name}`)
  }

  // 중분류 추가
  const topsCategory = createdCategories.find((c) => c.slug === 'tops')
  const subCategories = [
    { name: '티셔츠', slug: 'tshirts', level: 2, parentId: topsCategory.id },
    { name: '셔츠', slug: 'shirts', level: 2, parentId: topsCategory.id },
    { name: '니트', slug: 'knit', level: 2, parentId: topsCategory.id },
  ]

  for (const cat of subCategories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    createdCategories.push(category)
    console.log(`✅ 서브 카테고리 생성: ${category.name}`)
  }

  // 4. 상품 생성
  const tshirtsCategory = createdCategories.find((c) => c.slug === 'tshirts')
  const shirtsCategory = createdCategories.find((c) => c.slug === 'shirts')

  const products = [
    {
      name: '베이직 화이트 티셔츠',
      brand: 'Ultra Basic',
      description: '깔끔한 디자인의 베이직 화이트 티셔츠입니다. 면 100% 소재로 편안한 착용감을 제공합니다.',
      price: 29000,
      discount: 10,
      categoryId: tshirtsCategory.id,
      imageUrl: '/images/products/white-tshirt.jpg',
      images: [],
      stock: 100,
      isActive: true,
    },
    {
      name: '블랙 오버핏 티셔츠',
      brand: 'Ultra Street',
      description: '트렌디한 오버핏 실루엣의 블랙 티셔츠. 스트릿 스타일에 완벽한 아이템입니다.',
      price: 35000,
      discount: 15,
      categoryId: tshirtsCategory.id,
      imageUrl: '/images/products/black-tshirt.jpg',
      images: [],
      stock: 80,
      isActive: true,
    },
    {
      name: '프리미엄 린넨 셔츠',
      brand: 'Ultra Premium',
      description: '시원한 린넨 소재의 프리미엄 셔츠. 여름철 필수 아이템입니다.',
      price: 89000,
      discount: 20,
      categoryId: shirtsCategory.id,
      imageUrl: '/images/products/linen-shirt.jpg',
      images: [],
      stock: 50,
      isActive: true,
    },
    {
      name: '옥스포드 화이트 셔츠',
      brand: 'Ultra Classic',
      description: '클래식한 옥스포드 화이트 셔츠. 비즈니스 캐주얼에 적합합니다.',
      price: 79000,
      discount: 0,
      categoryId: shirtsCategory.id,
      imageUrl: '/images/products/oxford-shirt.jpg',
      images: [],
      stock: 60,
      isActive: true,
    },
    {
      name: '스트라이프 캐주얼 셔츠',
      brand: 'Ultra Casual',
      description: '세련된 스트라이프 패턴의 캐주얼 셔츠. 다양한 스타일링이 가능합니다.',
      price: 69000,
      discount: 25,
      categoryId: shirtsCategory.id,
      imageUrl: '/images/products/stripe-shirt.jpg',
      images: [],
      stock: 70,
      isActive: true,
    },
  ]

  for (const prod of products) {
    const product = await prisma.product.create({
      data: prod,
    })
    console.log(`✅ 상품 생성: ${product.name} (${product.price}원)`)
  }

  console.log('🎉 시드 데이터 생성 완료!')
}

main()
  .catch((e) => {
    console.error('❌ 시드 데이터 생성 실패:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
