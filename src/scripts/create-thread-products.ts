import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface ProductMapping {
  filename: string
  productName: string
  market: 'domestic' | 'overseas'
  imageNumber: number
}

async function main() {
  console.log('🛍️  실 제품군 제품 등록 시작...\n')

  // 실 제품군 카테고리 찾기
  const threadCategory = await prisma.category.findFirst({
    where: { slug: 'thread-products' }
  })

  if (!threadCategory) {
    console.error('❌ "실 제품군" 카테고리를 찾을 수 없습니다.')
    return
  }

  console.log(`✅ 카테고리 찾음: ${threadCategory.name} (ID: ${threadCategory.id})\n`)

  // 이미지 디렉토리에서 파일 목록 가져오기
  const imagesDir = path.join(__dirname, '..', 'public', 'products', 'detail-images')
  const files = fs.readdirSync(imagesDir)
    .filter(f => f.endsWith('.jpg'))
    .sort()

  console.log(`📁 총 ${files.length}개의 이미지 파일 발견\n`)

  // 제품 매핑 생성
  const products: ProductMapping[] = []
  let domesticCount = 0
  let overseasCount = 0

  for (const filename of files) {
    const isDomestic = filename.includes('(국내)')
    const market: 'domestic' | 'overseas' = isDomestic ? 'domestic' : 'overseas'

    if (isDomestic) {
      domesticCount++
      products.push({
        filename,
        productName: `제품${domesticCount}`,
        market,
        imageNumber: domesticCount
      })
    } else {
      overseasCount++
      products.push({
        filename,
        productName: `제품${11 + overseasCount}`,
        market,
        imageNumber: overseasCount
      })
    }
  }

  console.log(`📊 생성할 제품:`)
  console.log(`   - 국내: ${domesticCount}개`)
  console.log(`   - 해외: ${overseasCount}개`)
  console.log(`   - 총: ${products.length}개\n`)

  // 기존 제품 삭제 (실 제품군 카테고리의 제품만)
  const existingProducts = await prisma.product.findMany({
    where: { categoryId: threadCategory.id }
  })

  if (existingProducts.length > 0) {
    console.log(`⚠️  기존 제품 ${existingProducts.length}개 삭제 중...`)
    await prisma.product.deleteMany({
      where: { categoryId: threadCategory.id }
    })
    console.log('✅ 기존 제품 삭제 완료\n')
  }

  // 제품 생성
  console.log('📝 제품 등록 시작...\n')

  for (let i = 0; i < products.length; i++) {
    const { filename, productName, market } = products[i]

    const detailImagePath = `/products/detail-images/${filename}`

    const product = await prisma.product.create({
      data: {
        name: productName,
        brand: 'Ultra',
        description: `${productName} - ${market === 'domestic' ? '국내용' : '해외용'}`,
        detailContent: `<img src="${detailImagePath}" alt="${productName}" style="max-width: 100%; height: auto;" />`,
        price: 100000 + (i * 10000), // 기본 가격 (100,000원부터 시작)
        discount: 0,
        categoryId: threadCategory.id,
        imageUrl: null, // 썸네일 없음 (이미지 준비중)
        images: [detailImagePath], // 상세 이미지
        stock: 100,
        isActive: true
      }
    })

    console.log(`[${i + 1}/${products.length}] ✅ ${productName} (${market === 'domestic' ? '국내' : '해외'}) - ${filename}`)
  }

  console.log('\n🎉 제품 등록 완료!')
  console.log(`\n📊 등록된 제품 요약:`)

  const createdProducts = await prisma.product.findMany({
    where: { categoryId: threadCategory.id },
    orderBy: { name: 'asc' }
  })

  createdProducts.forEach((p, idx) => {
    console.log(`   ${idx + 1}. ${p.name} - ${p.price.toLocaleString()}원`)
  })

  console.log(`\n💡 다음 단계:`)
  console.log(`   1. 관리자 페이지에서 제품 확인: http://211.248.112.67:5635/admin/products`)
  console.log(`   2. 각 제품의 이름, 가격, 설명 등을 수정하세요.`)
  console.log(`   3. 썸네일 이미지를 추가하세요.`)
}

main()
  .catch((e) => {
    console.error('\n❌ 에러 발생:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
