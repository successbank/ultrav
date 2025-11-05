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

  // 3. 카테고리 생성 (화장품 쇼핑몰)
  // 대분류 (Level 1) - 8개
  const topLevelCategories = [
    { name: '스킨케어', slug: 'skincare', level: 1, parentId: null, description: '기초 화장품 전문 카테고리' },
    { name: '메이크업', slug: 'makeup', level: 1, parentId: null, description: '색조 화장품 카테고리' },
    { name: '마스크/팩', slug: 'mask-pack', level: 1, parentId: null, description: '마스크 및 팩 제품' },
    { name: '선케어', slug: 'suncare', level: 1, parentId: null, description: '자외선 차단 제품' },
    { name: '바디케어', slug: 'bodycare', level: 1, parentId: null, description: '바디 케어 제품' },
    { name: '헤어케어', slug: 'haircare', level: 1, parentId: null, description: '헤어 케어 제품' },
    { name: '이너뷰티', slug: 'innerbeauty', level: 1, parentId: null, description: '건강기능식품 카테고리' },
    { name: '기획세트', slug: 'special-set', level: 1, parentId: null, description: '특별 기획 상품 세트' },
  ]

  const createdCategories: any[] = []

  for (const cat of topLevelCategories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    createdCategories.push(category)
    console.log(`✅ 대분류 카테고리 생성: ${category.name}`)
  }

  // 중분류 (Level 2) - 6개
  const skincareCategory = createdCategories.find((c) => c.slug === 'skincare')
  const makeupCategory = createdCategories.find((c) => c.slug === 'makeup')
  const suncareCategory = createdCategories.find((c) => c.slug === 'suncare')
  const innerbeautyCategory = createdCategories.find((c) => c.slug === 'innerbeauty')

  const subCategories = [
    { name: '앰플/에센스', slug: 'ampoule-essence', level: 2, parentId: skincareCategory.id, description: '고농축 기능성 에센스' },
    { name: '기초/크림', slug: 'basic-cream', level: 2, parentId: skincareCategory.id, description: '기초 크림 및 로션' },
    { name: 'UV 차단', slug: 'uv-protection', level: 2, parentId: suncareCategory.id, description: '자외선 차단제' },
    { name: '건강기능식품', slug: 'health-supplement', level: 2, parentId: innerbeautyCategory.id, description: '이너뷰티 건강식품' },
    { name: '립메이크업', slug: 'lip-makeup', level: 2, parentId: makeupCategory.id, description: '립스틱, 립글로스 등' },
    { name: '베이스메이크업', slug: 'base-makeup', level: 2, parentId: makeupCategory.id, description: '파운데이션, 쿠션 등' },
  ]

  for (const cat of subCategories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    createdCategories.push(category)
    console.log(`✅ 중분류 카테고리 생성: ${category.name}`)
  }

  // 4. 제품 생성 (총 31개)
  const ampouleCategory = createdCategories.find((c) => c.slug === 'ampoule-essence')
  const creamCategory = createdCategories.find((c) => c.slug === 'basic-cream')
  const maskCategory = createdCategories.find((c) => c.slug === 'mask-pack')
  const uvCategory = createdCategories.find((c) => c.slug === 'uv-protection')
  const specialSetCategory = createdCategories.find((c) => c.slug === 'special-set')
  const healthCategory = createdCategories.find((c) => c.slug === 'health-supplement')
  const lipMakeupCategory = createdCategories.find((c) => c.slug === 'lip-makeup')
  const baseMakeupCategory = createdCategories.find((c) => c.slug === 'base-makeup')
  const bodycareCategory = createdCategories.find((c) => c.slug === 'bodycare')
  const haircareCategory = createdCategories.find((c) => c.slug === 'haircare')

  const products = [
    // 앰플/에센스 (9개)
    {
      name: '비타민C 브라이트닝 세럼',
      brand: 'KLAIRS',
      description: '순수 비타민C 5% 함유로 피부 톤 개선과 브라이트닝 효과를 선사하는 고농축 세럼입니다.',
      price: 28000,
      discount: 15,
      categoryId: ampouleCategory.id,
      imageUrl: '/images/products/vitamin-c-serum.jpg',
      images: [],
      stock: 150,
      isActive: true,
    },
    {
      name: '히알루론산 수분 앰플',
      brand: 'COSRX',
      description: '3중 히알루론산으로 피부 깊숙이 수분을 공급하여 건조한 피부를 촉촉하게 가꿔줍니다.',
      price: 24000,
      discount: 10,
      categoryId: ampouleCategory.id,
      imageUrl: '/images/products/hyaluronic-ampoule.jpg',
      images: [],
      stock: 200,
      isActive: true,
    },
    {
      name: '나이아신아마이드 미백 에센스',
      brand: 'THE ORDINARY',
      description: '10% 나이아신아마이드와 1% 아연 함유로 피부 톤 개선과 모공 케어에 탁월합니다.',
      price: 18000,
      discount: 0,
      categoryId: ampouleCategory.id,
      imageUrl: '/images/products/niacinamide-essence.jpg',
      images: [],
      stock: 180,
      isActive: true,
    },
    {
      name: '레티놀 안티에이징 세럼',
      brand: 'SOME BY MI',
      description: '0.1% 레티놀 함유로 주름 개선과 탄력 증진에 효과적인 안티에이징 세럼입니다.',
      price: 32000,
      discount: 20,
      categoryId: ampouleCategory.id,
      imageUrl: '/images/products/retinol-serum.jpg',
      images: [],
      stock: 120,
      isActive: true,
    },
    {
      name: '센텔라 진정 앰플',
      brand: 'SKIN1004',
      description: '마다가스카르 센텔라 아시아티카 추출물로 민감한 피부를 빠르게 진정시켜줍니다.',
      price: 22000,
      discount: 5,
      categoryId: ampouleCategory.id,
      imageUrl: '/images/products/centella-ampoule.jpg',
      images: [],
      stock: 250,
      isActive: true,
    },
    {
      name: '펩타이드 리프팅 세럼',
      brand: 'DR.JART+',
      description: '5가지 펩타이드 복합체로 피부 탄력과 리프팅 효과를 동시에 케어합니다.',
      price: 45000,
      discount: 25,
      categoryId: ampouleCategory.id,
      imageUrl: '/images/products/peptide-serum.jpg',
      images: [],
      stock: 90,
      isActive: true,
    },
    {
      name: '갈락토마이시스 발효 에센스',
      brand: 'MISSHA',
      description: '95% 갈락토마이시스 발효 여과물로 피부 결과 광채를 개선하는 퍼스트 에센스입니다.',
      price: 26000,
      discount: 15,
      categoryId: ampouleCategory.id,
      imageUrl: '/images/products/galactomyces-essence.jpg',
      images: [],
      stock: 170,
      isActive: true,
    },
    {
      name: '콜라겐 탄력 부스팅 앰플',
      brand: 'MEDIHEAL',
      description: '저분자 콜라겐과 엘라스틴으로 피부 탄력을 집중적으로 케어하는 고농축 앰플입니다.',
      price: 35000,
      discount: 10,
      categoryId: ampouleCategory.id,
      imageUrl: '/images/products/collagen-ampoule.jpg',
      images: [],
      stock: 140,
      isActive: true,
    },
    {
      name: '프로폴리스 영양 세럼',
      brand: 'INNISFREE',
      description: '63% 프로폴리스 추출물로 피부에 깊은 영양과 보습을 선사하는 멀티 케어 세럼입니다.',
      price: 29000,
      discount: 12,
      categoryId: ampouleCategory.id,
      imageUrl: '/images/products/propolis-serum.jpg',
      images: [],
      stock: 160,
      isActive: true,
    },

    // 기초/크림 (5개)
    {
      name: '수분 크림 젤',
      brand: 'LANEIGE',
      description: '산뜻한 젤 텍스처로 피부에 빠르게 흡수되어 24시간 수분을 유지시켜주는 크림입니다.',
      price: 38000,
      discount: 18,
      categoryId: creamCategory.id,
      imageUrl: '/images/products/moisture-cream.jpg',
      images: [],
      stock: 130,
      isActive: true,
    },
    {
      name: '리페어 나이트 크림',
      brand: 'SULWHASOO',
      description: '밤사이 피부 재생을 도와주는 고영양 크림으로 아침에 더 탄력있는 피부로 가꿔줍니다.',
      price: 85000,
      discount: 20,
      categoryId: creamCategory.id,
      imageUrl: '/images/products/repair-night-cream.jpg',
      images: [],
      stock: 80,
      isActive: true,
    },
    {
      name: '시카 진정 크림',
      brand: 'LA ROCHE-POSAY',
      description: '센텔라와 판테놀이 민감하고 자극받은 피부를 빠르게 진정시키고 보호합니다.',
      price: 42000,
      discount: 10,
      categoryId: creamCategory.id,
      imageUrl: '/images/products/cica-cream.jpg',
      images: [],
      stock: 150,
      isActive: true,
    },
    {
      name: '비건 올데이 크림',
      brand: 'ISNTREE',
      description: '비건 인증을 받은 자연 유래 성분으로 피부에 자극 없이 24시간 보습을 유지합니다.',
      price: 31000,
      discount: 15,
      categoryId: creamCategory.id,
      imageUrl: '/images/products/vegan-allday-cream.jpg',
      images: [],
      stock: 200,
      isActive: true,
    },
    {
      name: '안티에이징 리치 크림',
      brand: 'AESTURA',
      description: '고농축 영양 성분과 펩타이드 복합체로 주름 개선과 탄력 증진에 효과적입니다.',
      price: 52000,
      discount: 22,
      categoryId: creamCategory.id,
      imageUrl: '/images/products/antiaging-rich-cream.jpg',
      images: [],
      stock: 110,
      isActive: true,
    },

    // 마스크/팩 (3개)
    {
      name: '시카 수딩 시트마스크 10매',
      brand: 'MEDIHEAL',
      description: '센텔라 아시아티카 추출물이 피부를 진정시키고 수분을 공급하는 데일리 시트마스크입니다.',
      price: 15000,
      discount: 30,
      categoryId: maskCategory.id,
      imageUrl: '/images/products/cica-sheet-mask.jpg',
      images: [],
      stock: 300,
      isActive: true,
    },
    {
      name: '클레이 딥 클렌징 마스크',
      brand: 'INNISFREE',
      description: '제주 화산송이가 모공 속 노폐물과 피지를 깨끗하게 제거하는 워시오프 팩입니다.',
      price: 18000,
      discount: 10,
      categoryId: maskCategory.id,
      imageUrl: '/images/products/clay-cleansing-mask.jpg',
      images: [],
      stock: 180,
      isActive: true,
    },
    {
      name: '히알루론산 슬리핑 마스크',
      brand: 'LANEIGE',
      description: '밤사이 피부에 깊은 수분을 공급하여 아침에 촉촉하고 탄력있는 피부로 가꿔주는 슬리핑 팩입니다.',
      price: 32000,
      discount: 15,
      categoryId: maskCategory.id,
      imageUrl: '/images/products/sleeping-mask.jpg',
      images: [],
      stock: 150,
      isActive: true,
    },

    // UV 차단 (2개)
    {
      name: '올데이 선크림 SPF50+ PA++++',
      brand: 'ROUND LAB',
      description: '끈적임 없는 산뜻한 텍스처로 자외선을 강력하게 차단하며 백탁 현상이 없습니다.',
      price: 23000,
      discount: 12,
      categoryId: uvCategory.id,
      imageUrl: '/images/products/allday-sunscreen.jpg',
      images: [],
      stock: 250,
      isActive: true,
    },
    {
      name: '톤업 선크림 SPF50+ PA++++',
      brand: 'BEAUTY OF JOSEON',
      description: '자외선 차단과 동시에 자연스러운 톤업 효과를 주어 화사한 피부 표현이 가능합니다.',
      price: 18000,
      discount: 8,
      categoryId: uvCategory.id,
      imageUrl: '/images/products/toneup-sunscreen.jpg',
      images: [],
      stock: 200,
      isActive: true,
    },

    // 기획세트 (1개)
    {
      name: '울트라 스킨케어 풀 세트',
      brand: 'ULTRA BEAUTY',
      description: '토너, 에센스, 크림이 포함된 풀 스킨케어 라인으로 피부 타입별 맞춤 구성이 가능합니다.',
      price: 95000,
      discount: 35,
      categoryId: specialSetCategory.id,
      imageUrl: '/images/products/skincare-full-set.jpg',
      images: [],
      stock: 60,
      isActive: true,
    },

    // 건강기능식품 (1개)
    {
      name: '이너뷰티 콜라겐 젤리',
      brand: 'VITAL BEAUTY',
      description: '저분자 콜라겐 펩타이드 5000mg 함유로 피부 탄력과 보습에 도움을 주는 이너뷰티 제품입니다.',
      price: 42000,
      discount: 10,
      categoryId: healthCategory.id,
      imageUrl: '/images/products/collagen-jelly.jpg',
      images: [],
      stock: 120,
      isActive: true,
    },

    // 립메이크업 (3개)
    {
      name: '벨벳 매트 립스틱',
      brand: 'ROMAND',
      description: '부드러운 벨벳 매트 텍스처로 입술에 밀착되어 오래도록 선명한 발색을 유지합니다.',
      price: 16000,
      discount: 5,
      categoryId: lipMakeupCategory.id,
      imageUrl: '/images/products/velvet-matte-lipstick.jpg',
      images: [],
      stock: 220,
      isActive: true,
    },
    {
      name: '글로시 립글로스',
      brand: 'PERIPERA',
      description: '촉촉한 글로시 텍스처로 입술에 윤기를 더하고 볼륨감 있는 입술을 연출합니다.',
      price: 12000,
      discount: 10,
      categoryId: lipMakeupCategory.id,
      imageUrl: '/images/products/glossy-lipgloss.jpg',
      images: [],
      stock: 200,
      isActive: true,
    },
    {
      name: '워터 틴트',
      brand: 'ETUDE',
      description: '물처럼 가벼운 텍스처로 자연스럽게 입술에 스며들어 오래 지속되는 생기 있는 입술을 완성합니다.',
      price: 9000,
      discount: 15,
      categoryId: lipMakeupCategory.id,
      imageUrl: '/images/products/water-tint.jpg',
      images: [],
      stock: 280,
      isActive: true,
    },

    // 베이스메이크업 (없음 - 스킨케어 기본으로 대체)

    // 바디케어 (3개)
    {
      name: '바디 로션 (그린티 향)',
      brand: 'THE BODY SHOP',
      description: '그린티 추출물과 시어버터가 피부를 촉촉하게 보습하고 은은한 향으로 기분까지 좋아집니다.',
      price: 28000,
      discount: 20,
      categoryId: bodycareCategory.id,
      imageUrl: '/images/products/body-lotion-greentea.jpg',
      images: [],
      stock: 150,
      isActive: true,
    },
    {
      name: '스크럽 바디 워시',
      brand: 'NEUTROGENA',
      description: '천연 스크럽 입자가 각질과 노폐물을 깨끗하게 제거하고 매끈한 피부로 가꿔줍니다.',
      price: 18000,
      discount: 8,
      categoryId: bodycareCategory.id,
      imageUrl: '/images/products/scrub-body-wash.jpg',
      images: [],
      stock: 180,
      isActive: true,
    },
    {
      name: '핸드크림 (시어버터)',
      brand: 'AESOP',
      description: '고농축 시어버터가 손에 깊은 보습을 제공하며 빠르게 흡수되어 끈적임이 없습니다.',
      price: 35000,
      discount: 12,
      categoryId: bodycareCategory.id,
      imageUrl: '/images/products/hand-cream-shea.jpg',
      images: [],
      stock: 140,
      isActive: true,
    },

    // 헤어케어 (2개)
    {
      name: '단백질 트리트먼트',
      brand: 'KERASTASE',
      description: '손상된 모발에 단백질을 공급하여 건강하고 윤기있는 머릿결로 가꿔주는 집중 케어 트리트먼트입니다.',
      price: 52000,
      discount: 15,
      categoryId: haircareCategory.id,
      imageUrl: '/images/products/protein-treatment.jpg',
      images: [],
      stock: 100,
      isActive: true,
    },
    {
      name: '두피 스케일링 샴푸',
      brand: 'MOROCCANOIL',
      description: '각질과 노폐물을 제거하여 깨끗한 두피 환경을 만들어주는 딥 클렌징 샴푸입니다.',
      price: 38000,
      discount: 10,
      categoryId: haircareCategory.id,
      imageUrl: '/images/products/scalp-scaling-shampoo.jpg',
      images: [],
      stock: 120,
      isActive: true,
    },

    // 스킨케어 기본 (2개)
    {
      name: '수분 토너',
      brand: 'HUXLEY',
      description: '선인장 씨드 오일이 피부에 즉각적인 수분을 공급하고 피부 결을 정돈해줍니다.',
      price: 32000,
      discount: 18,
      categoryId: skincareCategory.id,
      imageUrl: '/images/products/moisture-toner.jpg',
      images: [],
      stock: 180,
      isActive: true,
    },
    {
      name: '저자극 클렌징 폼',
      brand: 'CERAVE',
      description: '약산성 pH로 피부 장벽을 지키면서 노폐물을 깨끗하게 클렌징하는 순한 폼 클렌저입니다.',
      price: 22000,
      discount: 5,
      categoryId: skincareCategory.id,
      imageUrl: '/images/products/mild-cleansing-foam.jpg',
      images: [],
      stock: 220,
      isActive: true,
    },
  ]

  for (const prod of products) {
    const product = await prisma.product.create({
      data: prod,
    })
    console.log(`✅ 제품 생성: ${product.name} (${product.brand}) - ${product.price.toLocaleString()}원`)
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
