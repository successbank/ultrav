import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// UltraV Cosmetic 제품 데이터
const ultravProducts = [
  {
    goodsNo: "1000000345",
    name: "더블X항산화케어 울트라브이 이데베논 프레스티지 앰플(4개입)+닥터권 울트라글루타치온(28일분) 1박스",
    originalPrice: 222000,
    salePrice: 88000,
    imageUrl: "https://godomall.speedycdn.net/33ef2db6c51a4fd2c9bc14687aa804a6/goods/1000000345/image/main/1000000345_main_090.jpg",
    category: "앰플/에센스",
    brand: "UltraV"
  },
  {
    goodsNo: "1000000387",
    name: "울트라브이 글루타세라 쉴드 선앰플(40ml)",
    originalPrice: null,
    salePrice: 33000,
    imageUrl: "https://godomall.speedycdn.net/33ef2db6c51a4fd2c9bc14687aa804a6/goods/1000000387/image/main/1000000387_main_095.jpg",
    category: "UV 차단",
    brand: "UltraV"
  },
  {
    goodsNo: "1000000386",
    name: "울트라브이 이데베논 프레스티지 앰플 (1개입)",
    originalPrice: 37500,
    salePrice: 13900,
    imageUrl: "https://godomall.speedycdn.net/33ef2db6c51a4fd2c9bc14687aa804a6/goods/1000000386/image/main/1000000386_main_0100.jpg",
    category: "앰플/에센스",
    brand: "UltraV"
  },
  {
    goodsNo: "1000000377",
    name: "[미니쿨증정] 울트라브이 이데베논 프레스티지 앰플 (앰플4개입/1Box) x 4박스+미니쿨뷰티디바이스(무료증정)",
    originalPrice: 450000,
    salePrice: 183600,
    imageUrl: "https://godomall.speedycdn.net/33ef2db6c51a4fd2c9bc14687aa804a6/goods/1000000377/image/main/1000000377_main_076.jpg",
    category: "앰플/에센스",
    brand: "UltraV"
  },
  {
    goodsNo: "1000000375",
    name: "울트라브이 딥 모이스춰 프라그란트 핸드크림(50ml)",
    originalPrice: 18900,
    salePrice: 14800,
    imageUrl: "https://godomall.speedycdn.net/33ef2db6c51a4fd2c9bc14687aa804a6/goods/1000000375/image/main/1000000375_main_023.jpg",
    category: "기초/크림",
    brand: "UltraV"
  },
  {
    goodsNo: "1000000371",
    name: "울트라브이 이데베논 시그니쳐 3종 기획세트 (에센스, 크림, 아이크림)",
    originalPrice: null,
    salePrice: 247000,
    imageUrl: "https://godomall.speedycdn.net/33ef2db6c51a4fd2c9bc14687aa804a6/goods/1000000371/image/main/1000000371_main_070.jpg",
    category: "기획세트",
    brand: "UltraV"
  },
  {
    goodsNo: "1000000367",
    name: "울트라브이 샤인 에센스(100ml)",
    originalPrice: 33000,
    salePrice: 25900,
    imageUrl: "https://godomall.speedycdn.net/33ef2db6c51a4fd2c9bc14687aa804a6/goods/1000000367/image/main/1000000367_main_023.jpg",
    category: "앰플/에센스",
    brand: "UltraV"
  },
  {
    goodsNo: "1000000363",
    name: "이데베논 시그니쳐 앰플 (앰플12개입/1BOX)",
    originalPrice: 405000,
    salePrice: 99000,
    imageUrl: "https://godomall.speedycdn.net/33ef2db6c51a4fd2c9bc14687aa804a6/goods/1000000363/image/main/1000000363_main_094.jpg",
    category: "앰플/에센스",
    brand: "UltraV"
  },
  {
    goodsNo: "1000000351",
    name: "울트라브이 이데베논 엑소 골드 마스크 (5장/1BOX)",
    originalPrice: 39600,
    salePrice: 35900,
    imageUrl: "https://godomall.speedycdn.net/33ef2db6c51a4fd2c9bc14687aa804a6/goods/1000000351/image/main/1000000351_main_079.jpg",
    category: "마스크/팩",
    brand: "UltraV"
  },
  {
    goodsNo: "1000000324",
    name: "이데베논 프레스티지 앰플 (앰플4개입/1Box)",
    originalPrice: 150000,
    salePrice: 45900,
    imageUrl: "https://godomall.speedycdn.net/33ef2db6c51a4fd2c9bc14687aa804a6/goods/1000000324/image/main/1000000324_main_068.jpg",
    category: "앰플/에센스",
    brand: "UltraV"
  },
  {
    goodsNo: "1000000323",
    name: "울트라브이 이데베논 시그니쳐 앰플 (앰플4개입/1BOX)",
    originalPrice: 135000,
    salePrice: 26900,
    imageUrl: "https://godomall.speedycdn.net/33ef2db6c51a4fd2c9bc14687aa804a6/goods/1000000323/image/main/1000000323_main_070.jpg",
    category: "앰플/에센스",
    brand: "UltraV"
  },
  {
    goodsNo: "1000000321",
    name: "울트라브이 Dr.Kwon 울트라 글루타치온 플러스 28일분/1BOX",
    originalPrice: null,
    salePrice: 69300,
    imageUrl: "https://godomall.speedycdn.net/33ef2db6c51a4fd2c9bc14687aa804a6/goods/1000000321/image/main/1000000321_main_033.jpg",
    category: "건강기능식품",
    brand: "UltraV"
  },
  {
    goodsNo: "1000000281",
    name: "울트라브이 울트라콜 앰플",
    originalPrice: null,
    salePrice: 135000,
    imageUrl: "https://godomall.speedycdn.net/33ef2db6c51a4fd2c9bc14687aa804a6/goods/1000000281/image/main/1000000281_main_058.jpg",
    category: "앰플/에센스",
    brand: "UltraV"
  },
  {
    goodsNo: "1000000268",
    name: "울트라브이 이데베논 선블럭",
    originalPrice: 35000,
    salePrice: 16900,
    imageUrl: "https://godomall.speedycdn.net/33ef2db6c51a4fd2c9bc14687aa804a6/goods/1000000268/image/main/1000000268_main_011.jpg",
    category: "UV 차단",
    brand: "UltraV"
  },
  {
    goodsNo: "1000000220",
    name: "울트라브이 이데베논 시그니쳐 마스크 팩(10장/1BOX)",
    originalPrice: 28000,
    salePrice: 18900,
    imageUrl: "https://godomall.speedycdn.net/33ef2db6c51a4fd2c9bc14687aa804a6/goods/1000000220/image/main/1000000220_main_025.jpg",
    category: "마스크/팩",
    brand: "UltraV"
  },
  {
    goodsNo: "1000000219",
    name: "울트라브이 NEW 아쿠아샤인 수분 마스크 팩(10장/1BOX)",
    originalPrice: 28000,
    salePrice: 18900,
    imageUrl: "https://godomall.speedycdn.net/33ef2db6c51a4fd2c9bc14687aa804a6/goods/1000000219/image/main/1000000219_main_084.jpg",
    category: "마스크/팩",
    brand: "UltraV"
  },
  {
    goodsNo: "1000000074",
    name: "울트라브이 이데베논 크림(50ml)",
    originalPrice: 88000,
    salePrice: 29900,
    imageUrl: "https://godomall.speedycdn.net/33ef2db6c51a4fd2c9bc14687aa804a6/goods/1000000074/image/main/1000000074_main_095.jpg",
    category: "기초/크림",
    brand: "UltraV"
  },
  {
    goodsNo: "1000000072",
    name: "울트라브이 이데베논 에이지 리터닝 아이크림 (30ml)",
    originalPrice: null,
    salePrice: 85000,
    imageUrl: "https://godomall.speedycdn.net/33ef2db6c51a4fd2c9bc14687aa804a6/goods/1000000072/image/main/1000000072_main_0100.jpg",
    category: "기초/크림",
    brand: "UltraV"
  },
  {
    goodsNo: "1000000043",
    name: "울트라브이 리뉴덤 플러스 50ml",
    originalPrice: null,
    salePrice: 44000,
    imageUrl: "https://godomall.speedycdn.net/33ef2db6c51a4fd2c9bc14687aa804a6/goods/1000000043/image/main/1000000043_main_085.jpg",
    category: "기초/크림",
    brand: "UltraV"
  },
  {
    goodsNo: "1000000039",
    name: "울트라브이 리뉴덤 플러스 20ml",
    originalPrice: null,
    salePrice: 19800,
    imageUrl: "https://godomall.speedycdn.net/33ef2db6c51a4fd2c9bc14687aa804a6/goods/1000000039/image/main/1000000039_main_047.jpg",
    category: "기초/크림",
    brand: "UltraV"
  },
  {
    goodsNo: "1000000026",
    name: "울트라브이 이데베논 트리트먼트 에센스 L",
    originalPrice: null,
    salePrice: 77000,
    imageUrl: "https://godomall.speedycdn.net/33ef2db6c51a4fd2c9bc14687aa804a6/goods/1000000026/image/main/1000000026_main_09.jpg",
    category: "앰플/에센스",
    brand: "UltraV"
  }
]

async function main() {
  console.log('🌱 UltraV 화장품 데이터 시딩 시작...')

  // 1. 카테고리 생성
  const categories = [
    { name: '앰플/에센스', slug: 'ampoule-essence', level: 1, description: '고농축 스킨케어 앰플과 에센스' },
    { name: '기초/크림', slug: 'basic-cream', level: 1, description: '기초 화장품과 크림' },
    { name: '마스크/팩', slug: 'mask-pack', level: 1, description: '시트 마스크와 팩' },
    { name: 'UV 차단', slug: 'uv-protection', level: 1, description: '자외선 차단 제품' },
    { name: '건강기능식품', slug: 'health-supplement', level: 1, description: '이너뷰티 건강기능식품' },
    { name: '기획세트', slug: 'special-set', level: 1, description: '특별 기획 세트 상품' },
  ]

  const categoryMap = new Map()

  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    })
    categoryMap.set(cat.name, category.id)
    console.log(`✅ 카테고리 생성: ${category.name}`)
  }

  // 2. 제품 생성
  let productCount = 0
  for (const prod of ultravProducts) {
    const categoryId = categoryMap.get(prod.category)
    if (!categoryId) {
      console.warn(`⚠️  카테고리를 찾을 수 없음: ${prod.category}`)
      continue
    }

    const discount = prod.originalPrice
      ? Math.round(((prod.originalPrice - prod.salePrice) / prod.originalPrice) * 100)
      : 0

    const price = prod.originalPrice || prod.salePrice

    // 상세 이미지 URL 패턴 생성
    const detailImages = [
      prod.imageUrl.replace('_main_', '_detail_'),
      prod.imageUrl.replace('/main/', '/detail/').replace('_main_', '_detail_')
    ]

    const product = await prisma.product.create({
      data: {
        name: prod.name,
        brand: prod.brand,
        description: `${prod.name}\n\n프리미엄 화장품 브랜드 UltraV의 제품입니다. 피부과 전문의가 개발한 전문 스킨케어 제품으로 높은 품질을 자랑합니다.`,
        price: price,
        discount: discount,
        categoryId: categoryId,
        imageUrl: prod.imageUrl,
        images: detailImages,
        stock: 100,
        isActive: true,
      },
    })

    productCount++
    console.log(`✅ 상품 생성 (${productCount}/${ultravProducts.length}): ${product.name}`)
    console.log(`   가격: ${price.toLocaleString()}원 (할인: ${discount}%)`)
  }

  console.log(`\n🎉 UltraV 화장품 데이터 시딩 완료!`)
  console.log(`   - 카테고리: ${categories.length}개`)
  console.log(`   - 상품: ${productCount}개`)
}

main()
  .catch((e) => {
    console.error('❌ 시드 데이터 생성 실패:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
