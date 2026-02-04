import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🚀 테스트 데이터 생성 시작...")

  // 1. 추가 병원 계정 생성
  console.log("\n1️⃣ 추가 병원 계정 생성...")
  const hospitalPassword = await bcrypt.hash("ultra123", 10)

  const hospital2 = await prisma.user.upsert({
    where: { email: "hospital2@ultra.com" },
    update: {},
    create: {
      email: "hospital2@ultra.com",
      name: "연세대병원",
      password: hospitalPassword,
      role: "HOSPITAL",
      phone: "02-2345-6789",
      address: "서울특별시 서대문구 연세로 50",
    },
  })

  const hospital3 = await prisma.user.upsert({
    where: { email: "hospital3@ultra.com" },
    update: {},
    create: {
      email: "hospital3@ultra.com",
      name: "삼성서울병원",
      password: hospitalPassword,
      role: "HOSPITAL",
      phone: "02-3456-7890",
      address: "서울특별시 강남구 일원로 81",
    },
  })

  console.log(`✅ 병원 계정 생성 완료: ${hospital2.name}, ${hospital3.name}`)

  // 2. 추가 일반 사용자 생성
  console.log("\n2️⃣ 추가 일반 사용자 생성...")
  const userPassword = await bcrypt.hash("ultra123", 10)

  const user2 = await prisma.user.upsert({
    where: { email: "user2@ultra.com" },
    update: {},
    create: {
      email: "user2@ultra.com",
      name: "박민수",
      password: userPassword,
      role: "USER",
      phone: "010-2222-3333",
      address: "서울특별시 송파구 올림픽로 300",
    },
  })

  const user3 = await prisma.user.upsert({
    where: { email: "user3@ultra.com" },
    update: {},
    create: {
      email: "user3@ultra.com",
      name: "최영희",
      password: userPassword,
      role: "USER",
      phone: "010-3333-4444",
      address: "서울특별시 마포구 월드컵로 240",
    },
  })

  console.log(`✅ 일반 사용자 생성 완료: ${user2.name}, ${user3.name}`)

  // 3. 제품 데이터 조회
  console.log("\n3️⃣ 제품 데이터 조회...")
  const products = await prisma.product.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  })

  console.log(`✅ 제품 ${products.length}개 조회 완료`)

  // 4. 병원 장바구니 생성 (hospital@ultra.com)
  console.log("\n4️⃣ 서울대병원 장바구니 생성...")
  const hospital1 = await prisma.user.findUnique({
    where: { email: "hospital@ultra.com" },
  })

  if (hospital1) {
    // 기존 장바구니 확인
    let cart1 = await prisma.cart.findUnique({
      where: { userId: hospital1.id },
    })

    if (!cart1) {
      cart1 = await prisma.cart.create({
        data: { userId: hospital1.id },
      })
    }

    // 장바구니 아이템 추가 (7개 제품, 대량)
    const cartItems1 = [
      { productId: products[0].id, quantity: 10 },
      { productId: products[1].id, quantity: 8 },
      { productId: products[2].id, quantity: 15 },
      { productId: products[3].id, quantity: 5 },
      { productId: products[4].id, quantity: 12 },
      { productId: products[5].id, quantity: 7 },
      { productId: products[6].id, quantity: 20 },
    ]

    for (const item of cartItems1) {
      await prisma.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: cart1.id,
            productId: item.productId,
          },
        },
        update: { quantity: item.quantity },
        create: {
          cartId: cart1.id,
          productId: item.productId,
          quantity: item.quantity,
        },
      })
    }

    console.log(`✅ 서울대병원 장바구니: ${cartItems1.length}개 제품 추가`)
  }

  // 5. 연세대병원 장바구니 생성
  console.log("\n5️⃣ 연세대병원 장바구니 생성...")
  let cart2 = await prisma.cart.findUnique({
    where: { userId: hospital2.id },
  })

  if (!cart2) {
    cart2 = await prisma.cart.create({
      data: { userId: hospital2.id },
    })
  }

  const cartItems2 = [
    { productId: products[7].id, quantity: 6 },
    { productId: products[8].id, quantity: 9 },
    { productId: products[9].id, quantity: 4 },
    { productId: products[10].id, quantity: 11 },
    { productId: products[11].id, quantity: 8 },
  ]

  for (const item of cartItems2) {
    await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart2.id,
          productId: item.productId,
        },
      },
      update: { quantity: item.quantity },
      create: {
        cartId: cart2.id,
        productId: item.productId,
        quantity: item.quantity,
      },
    })
  }

  console.log(`✅ 연세대병원 장바구니: ${cartItems2.length}개 제품 추가`)

  // 6. 삼성서울병원 장바구니 생성
  console.log("\n6️⃣ 삼성서울병원 장바구니 생성...")
  let cart3 = await prisma.cart.findUnique({
    where: { userId: hospital3.id },
  })

  if (!cart3) {
    cart3 = await prisma.cart.create({
      data: { userId: hospital3.id },
    })
  }

  const cartItems3 = [
    { productId: products[12].id, quantity: 3 },
    { productId: products[13].id, quantity: 7 },
    { productId: products[14].id, quantity: 5 },
    { productId: products[15].id, quantity: 10 },
    { productId: products[16].id, quantity: 4 },
    { productId: products[17].id, quantity: 6 },
  ]

  for (const item of cartItems3) {
    await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart3.id,
          productId: item.productId,
        },
      },
      update: { quantity: item.quantity },
      create: {
        cartId: cart3.id,
        productId: item.productId,
        quantity: item.quantity,
      },
    })
  }

  console.log(`✅ 삼성서울병원 장바구니: ${cartItems3.length}개 제품 추가`)

  // 7. 일반 사용자 장바구니 생성
  console.log("\n7️⃣ 일반 사용자 장바구니 생성...")
  let cartUser2 = await prisma.cart.findUnique({
    where: { userId: user2.id },
  })

  if (!cartUser2) {
    cartUser2 = await prisma.cart.create({
      data: { userId: user2.id },
    })
  }

  const cartItemsUser2 = [
    { productId: products[0].id, quantity: 2 },
    { productId: products[3].id, quantity: 1 },
    { productId: products[6].id, quantity: 3 },
  ]

  for (const item of cartItemsUser2) {
    await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cartUser2.id,
          productId: item.productId,
        },
      },
      update: { quantity: item.quantity },
      create: {
        cartId: cartUser2.id,
        productId: item.productId,
        quantity: item.quantity,
      },
    })
  }

  console.log(`✅ ${user2.name} 장바구니: ${cartItemsUser2.length}개 제품 추가`)

  // 8. 통계 출력
  console.log("\n📊 테스트 데이터 생성 완료!")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

  const stats = {
    hospitals: await prisma.user.count({ where: { role: "HOSPITAL" } }),
    users: await prisma.user.count({ where: { role: "USER" } }),
    salesManagers: await prisma.user.count({ where: { role: "SALES_MANAGER" } }),
    carts: await prisma.cart.count(),
    cartItems: await prisma.cartItem.count(),
  }

  console.log(`병원 계정: ${stats.hospitals}개`)
  console.log(`일반 사용자: ${stats.users}개`)
  console.log(`영업매니저: ${stats.salesManagers}개`)
  console.log(`장바구니: ${stats.carts}개`)
  console.log(`장바구니 아이템: ${stats.cartItems}개`)
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
}

main()
  .catch((e) => {
    console.error("❌ 에러 발생:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
