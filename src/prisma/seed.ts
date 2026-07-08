import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 시드 데이터 생성 시작...')

  // 1. 관리자 계정 생성
  const hashedPassword = await bcrypt.hash('1234!@#$', 10)

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

  // 2-1. 병원 계정 생성
  const hospitalPassword = await bcrypt.hash('hospital123!@#', 10)

  const hospital = await prisma.user.upsert({
    where: { email: 'hospital@ultra.com' },
    update: {},
    create: {
      email: 'hospital@ultra.com',
      name: '서울대병원',
      password: hospitalPassword,
      role: 'HOSPITAL',
      phone: '02-1234-5678',
      address: '서울특별시 종로구 대학로 101',
    },
  })

  console.log('✅ 병원 계정 생성:', hospital.email)

  // 2-2. 영업매니저 계정 생성
  const salesManagerPassword = await bcrypt.hash('sales123!@#', 10)

  const salesManager = await prisma.user.upsert({
    where: { email: 'sales@ultra.com' },
    update: {},
    create: {
      email: 'sales@ultra.com',
      name: '김영업',
      password: salesManagerPassword,
      role: 'SALES_MANAGER',
      phone: '010-5555-6666',
      address: '서울특별시 강남구 테헤란로 789',
    },
  })

  console.log('✅ 영업매니저 계정 생성:', salesManager.email)

  // 3. 카테고리 생성 (의료기기/용품 쇼핑몰)
  // 대분류 (Level 1) - 3개
  const ultracol = await prisma.category.upsert({
    where: { slug: 'ultracol' },
    update: {},
    create: { name: 'ULTRACOL', slug: 'ultracol', level: 1, description: 'Ultracol 필러 라인업' },
  })
  console.log(`✅ 대분류 카테고리 생성: ${ultracol.name}`)

  const liftingThreads = await prisma.category.upsert({
    where: { slug: 'lifting-threads' },
    update: {},
    create: { name: 'LIFTING THREADS', slug: 'lifting-threads', level: 1, description: '리프팅 실 (PDO/PCL/PLLA/PLCL)' },
  })
  console.log(`✅ 대분류 카테고리 생성: ${liftingThreads.name}`)

  const medicalDevices = await prisma.category.upsert({
    where: { slug: 'medical-devices' },
    update: {},
    create: { name: 'MEDICAL DEVICES', slug: 'medical-devices', level: 1, description: '의료기기 제품' },
  })
  console.log(`✅ 대분류 카테고리 생성: ${medicalDevices.name}`)

  // 중분류 (Level 2) - 11개
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
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    console.log(`✅ 중분류 카테고리 생성: ${category.name}`)
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
