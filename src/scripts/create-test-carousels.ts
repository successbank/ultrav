import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("테스트 캐러셀 데이터 생성 시작...")

  const carousels = [
    {
      title: "2025 신상품 특별 할인",
      subtitle: "최대 50% 할인 혜택",
      description: "새해를 맞아 인기 상품을 특별 가격에 만나보세요. 기간 한정 특가!",
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=500&fit=crop",
      linkUrl: "/products",
      linkText: "쇼핑하기",
      order: 0,
      isActive: true,
    },
    {
      title: "프리미엄 브랜드 입점",
      subtitle: "세계적인 브랜드를 한 곳에서",
      description: "최고 품질의 브랜드 제품을 합리적인 가격으로 만나보세요",
      imageUrl: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=500&fit=crop",
      linkUrl: "/products",
      linkText: "브랜드 보기",
      order: 1,
      isActive: true,
    },
    {
      title: "무료 배송 이벤트",
      subtitle: "전 상품 무료 배송",
      description: "5만원 이상 구매시 전국 무료 배송! 지금 바로 쇼핑하세요",
      imageUrl: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1920&h=500&fit=crop",
      linkUrl: "/products",
      linkText: "구매하기",
      order: 2,
      isActive: true,
    },
  ]

  for (const carouselData of carousels) {
    const carousel = await prisma.carousel.create({
      data: carouselData,
    })
    console.log(`✅ 캐러셀 생성: ${carousel.title}`)
  }

  console.log("\n✨ 테스트 캐러셀 데이터 생성 완료!")
  console.log(`총 ${carousels.length}개의 캐러셀이 생성되었습니다.`)
}

main()
  .catch((e) => {
    console.error("❌ 에러 발생:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
