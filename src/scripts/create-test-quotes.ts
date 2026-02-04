import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🚀 테스트 견적서 생성 시작...")

  // 1. 영업매니저 조회
  const salesManager = await prisma.user.findUnique({
    where: { email: "sales@ultra.com" },
  })

  if (!salesManager) {
    throw new Error("영업매니저를 찾을 수 없습니다")
  }

  console.log(`✅ 영업매니저: ${salesManager.name} (${salesManager.email})`)

  // 2. 장바구니가 있는 고객들 조회
  const customers = await prisma.user.findMany({
    where: {
      role: { in: ["USER", "HOSPITAL"] },
      cart: { isNot: null },
    },
    include: {
      cart: {
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      },
    },
  })

  console.log(`\n📋 장바구니가 있는 고객: ${customers.length}명`)

  // 3. 각 고객별로 견적서 생성
  for (const customer of customers) {
    if (!customer.cart || customer.cart.items.length === 0) continue

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`고객: ${customer.name} (${customer.email})`)
    console.log(`장바구니 아이템: ${customer.cart.items.length}개`)

    // 견적 아이템 계산
    let originalAmount = 0
    let quotedAmount = 0

    const quoteItems = customer.cart.items.map((cartItem, index) => {
      const product = cartItem.product
      // 제품의 할인가를 원가로 사용
      const originalPrice = Math.round(product.price * (1 - product.discount / 100))

      // 다양한 할인 패턴 적용
      let discountRate = 0
      if (customer.role === "HOSPITAL") {
        // 병원은 더 높은 할인율
        if (index === 0) discountRate = 0.20 // 20% 할인
        else if (index === 1) discountRate = 0.15 // 15% 할인
        else if (index === 2) discountRate = 0.10 // 10% 할인
        else discountRate = 0.05 // 5% 할인
      } else {
        // 일반 사용자는 낮은 할인율
        if (index === 0) discountRate = 0.10 // 10% 할인
        else if (index === 1) discountRate = 0.05 // 5% 할인
        else discountRate = 0 // 할인 없음
      }

      const quotedPrice = Math.round(originalPrice * (1 - discountRate))

      originalAmount += originalPrice * cartItem.quantity
      quotedAmount += quotedPrice * cartItem.quantity

      return {
        productId: product.id,
        quantity: cartItem.quantity,
        originalPrice,
        quotedPrice,
      }
    })

    const discountAmount = originalAmount - quotedAmount

    console.log(`원가 총액: ${originalAmount.toLocaleString("ko-KR")}원`)
    console.log(`견적 총액: ${quotedAmount.toLocaleString("ko-KR")}원`)
    console.log(
      `할인 금액: ${discountAmount.toLocaleString("ko-KR")}원 (${((discountAmount / originalAmount) * 100).toFixed(1)}%)`
    )

    // 견적서 번호 생성
    const today = new Date()
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "")
    const count = await prisma.quote.count({
      where: { quoteNumber: { startsWith: `QT-${dateStr}-` } },
    })
    const quoteNumber = `QT-${dateStr}-${String(count + 1).padStart(4, "0")}`

    // 유효기간 설정 (7일)
    const validUntil = new Date()
    validUntil.setDate(validUntil.getDate() + 7)

    // 견적서 생성
    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        customerId: customer.id,
        salesManagerId: salesManager.id,
        status: "SENT",
        originalAmount,
        totalAmount: quotedAmount,
        discountAmount,
        validUntil,
        notes: `${customer.name}님께 제공하는 특별 견적입니다. ${quoteItems.length}개 제품에 대해 최대 할인을 적용하였습니다. 유효기간 내에 승인 부탁드립니다.`,
        items: {
          create: quoteItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    console.log(`✅ 견적서 생성: ${quote.quoteNumber}`)
    console.log(`   - 상태: ${quote.status}`)
    console.log(`   - 유효기간: ${quote.validUntil.toLocaleDateString("ko-KR")}`)
  }

  // 4. 통계 출력
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`📊 견적서 생성 완료!`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

  const stats = {
    total: await prisma.quote.count(),
    sent: await prisma.quote.count({ where: { status: "SENT" } }),
    approved: await prisma.quote.count({ where: { status: "APPROVED" } }),
    rejected: await prisma.quote.count({ where: { status: "REJECTED" } }),
  }

  console.log(`총 견적서: ${stats.total}개`)
  console.log(`전송됨: ${stats.sent}개`)
  console.log(`승인됨: ${stats.approved}개`)
  console.log(`거부됨: ${stats.rejected}개`)

  const totalAmount = await prisma.quote.aggregate({
    _sum: {
      totalAmount: true,
      discountAmount: true,
    },
  })

  console.log(
    `총 견적 금액: ${(totalAmount._sum.totalAmount || 0).toLocaleString("ko-KR")}원`
  )
  console.log(
    `총 할인 금액: ${(totalAmount._sum.discountAmount || 0).toLocaleString("ko-KR")}원`
  )
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
}

main()
  .catch((e) => {
    console.error("❌ 에러 발생:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
