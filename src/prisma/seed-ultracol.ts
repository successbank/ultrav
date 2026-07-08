import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧪 Ultracol 제품 등록 시작...')

  // 카테고리 조회
  const ultracol100Cat = await prisma.category.findUnique({
    where: { slug: 'ultracol-100' },
  })
  const ultracol200Cat = await prisma.category.findUnique({
    where: { slug: 'ultracol-200' },
  })

  if (!ultracol100Cat || !ultracol200Cat) {
    console.error('❌ Ultracol 100/200 카테고리를 찾을 수 없습니다. seed.ts를 먼저 실행해주세요.')
    process.exit(1)
  }

  // 이미지 URLs
  const IMG_BASE = 'https://www.ultrav.co.kr/images/sub'
  const images = {
    ultracol100: `${IMG_BASE}/ultracol-versus100.jpg`,
    ultracol200: `${IMG_BASE}/ultracol-versus200.jpg`,
    welcomeLarge: `${IMG_BASE}/ultracol-welcome-large.jpg`,
    welcomeSmall: `${IMG_BASE}/ultracol-welcome-small.jpg`,
  }

  // Ultracol 100 상세 HTML
  const ultracol100Detail = `
<div style="max-width: 900px; margin: 0 auto; font-family: 'Pretendard', sans-serif; color: #1a1a1a;">
  <!-- 제품 헤더 -->
  <div style="text-align: center; padding: 40px 0; border-bottom: 2px solid #e5e7eb;">
    <h1 style="font-size: 2.5rem; font-weight: 800; color: #111; margin-bottom: 8px;">ULTRACOL 100</h1>
    <p style="font-size: 1.1rem; color: #6b7280;">PDO Microsphere Collagen Skin Booster</p>
  </div>

  <!-- 제품 이미지 -->
  <div style="text-align: center; padding: 40px 0;">
    <img src="${images.ultracol100}" alt="ULTRACOL 100" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" />
  </div>

  <!-- 제품 개요 -->
  <div style="padding: 30px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; margin-bottom: 30px;">
    <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 16px; color: #0369a1;">제품 개요</h2>
    <p style="line-height: 1.8; color: #374151;">
      ULTRACOL 100은 <strong>PDO(Polydioxanone) 마이크로스피어</strong> 기반의 차세대 콜라겐 스킨 부스터입니다.
      100mg/vial의 PDO 마이크로스피어가 진피 내에서 콜라겐 합성을 촉진하여 피부 탄력과 광채를 회복시킵니다.
      미세한 입자 크기(20~50μm)로 균일한 주입이 가능하며, 자연스러운 피부 개선 효과를 제공합니다.
    </p>
  </div>

  <!-- 스펙 테이블 -->
  <div style="margin-bottom: 30px;">
    <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 16px;">제품 사양</h2>
    <table style="width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden;">
      <tbody>
        <tr style="background: #f8fafc;">
          <td style="padding: 14px 20px; font-weight: 600; border-bottom: 1px solid #e2e8f0; width: 35%; color: #475569;">제품명</td>
          <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">ULTRACOL 100</td>
        </tr>
        <tr>
          <td style="padding: 14px 20px; font-weight: 600; border-bottom: 1px solid #e2e8f0; color: #475569;">Packing Unit</td>
          <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">100mg / vial</td>
        </tr>
        <tr style="background: #f8fafc;">
          <td style="padding: 14px 20px; font-weight: 600; border-bottom: 1px solid #e2e8f0; color: #475569;">Particle Size</td>
          <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">20 ~ 50 μm</td>
        </tr>
        <tr>
          <td style="padding: 14px 20px; font-weight: 600; border-bottom: 1px solid #e2e8f0; color: #475569;">Cannula Size</td>
          <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">25G</td>
        </tr>
        <tr style="background: #f8fafc;">
          <td style="padding: 14px 20px; font-weight: 600; border-bottom: 1px solid #e2e8f0; color: #475569;">주요 성분</td>
          <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">PDO (Polydioxanone) Microsphere</td>
        </tr>
        <tr>
          <td style="padding: 14px 20px; font-weight: 600; color: #475569;">생분해 기간</td>
          <td style="padding: 14px 20px;">4 ~ 6개월</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PDO 마이크로스피어 기술 -->
  <div style="padding: 30px; background: #fefce8; border-radius: 12px; margin-bottom: 30px; border: 1px solid #fde68a;">
    <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 16px; color: #92400e;">PDO 마이크로스피어 기술</h2>
    <p style="line-height: 1.8; color: #374151; margin-bottom: 16px;">
      PDO(Polydioxanone)는 의료용 봉합사에 널리 사용되는 생체적합성 고분자로,
      체내에서 가수분해를 통해 안전하게 분해됩니다.
    </p>
    <p style="line-height: 1.8; color: #374151;">
      ULTRACOL의 PDO 마이크로스피어는 <strong>균일한 구형 입자</strong>로 제조되어
      주입 시 고른 분포를 형성하며, 진피층의 섬유아세포를 자극하여
      <strong>자연적인 콜라겐 신생(neocollagenesis)</strong>을 유도합니다.
      4~6개월에 걸쳐 서서히 분해되면서 지속적인 콜라겐 생성 효과를 나타냅니다.
    </p>
  </div>

  <!-- 특장점 -->
  <div style="margin-bottom: 30px;">
    <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 16px;">특장점 및 효과</h2>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
      <div style="padding: 20px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">
        <h3 style="font-weight: 600; margin-bottom: 8px; color: #166534;">콜라겐 부스팅</h3>
        <p style="font-size: 0.95rem; color: #374151;">PDO 마이크로스피어가 진피 내 콜라겐 합성을 촉진</p>
      </div>
      <div style="padding: 20px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
        <h3 style="font-weight: 600; margin-bottom: 8px; color: #1e40af;">피부 탄력 개선</h3>
        <p style="font-size: 0.95rem; color: #374151;">탄력 섬유 생성 자극으로 피부 탄력 및 긴장감 향상</p>
      </div>
      <div style="padding: 20px; background: #fdf4ff; border-radius: 8px; border-left: 4px solid #a855f7;">
        <h3 style="font-weight: 600; margin-bottom: 8px; color: #7e22ce;">미세 주입 가능</h3>
        <p style="font-size: 0.95rem; color: #374151;">20~50μm 초미세 입자로 25G 캐뉼라 사용, 균일한 분포</p>
      </div>
      <div style="padding: 20px; background: #fff7ed; border-radius: 8px; border-left: 4px solid #f97316;">
        <h3 style="font-weight: 600; margin-bottom: 8px; color: #c2410c;">안전한 생분해</h3>
        <p style="font-size: 0.95rem; color: #374151;">4~6개월에 걸쳐 체내에서 안전하게 분해, 이물 반응 최소화</p>
      </div>
    </div>
  </div>

  <!-- 안내 -->
  <div style="padding: 20px; background: #f1f5f9; border-radius: 8px; text-align: center; color: #64748b; font-size: 0.9rem;">
    <p>본 제품은 전문 의료기관에서 의료진에 의해 시술되어야 합니다.</p>
    <p style="margin-top: 4px;">가격 및 구매 관련 문의는 영업팀에 연락해주세요.</p>
  </div>
</div>`

  // Ultracol 200 상세 HTML
  const ultracol200Detail = `
<div style="max-width: 900px; margin: 0 auto; font-family: 'Pretendard', sans-serif; color: #1a1a1a;">
  <!-- 제품 헤더 -->
  <div style="text-align: center; padding: 40px 0; border-bottom: 2px solid #e5e7eb;">
    <h1 style="font-size: 2.5rem; font-weight: 800; color: #111; margin-bottom: 8px;">ULTRACOL 200</h1>
    <p style="font-size: 1.1rem; color: #6b7280;">PDO Microsphere Collagen Lifting</p>
  </div>

  <!-- 제품 이미지 -->
  <div style="text-align: center; padding: 40px 0;">
    <img src="${images.ultracol200}" alt="ULTRACOL 200" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" />
  </div>

  <!-- 제품 개요 -->
  <div style="padding: 30px; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); border-radius: 12px; margin-bottom: 30px;">
    <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 16px; color: #be185d;">제품 개요</h2>
    <p style="line-height: 1.8; color: #374151;">
      ULTRACOL 200은 <strong>PDO(Polydioxanone) 마이크로스피어</strong> 기반의 콜라겐 리프팅 제품입니다.
      200mg/vial의 고함량 PDO 마이크로스피어가 진피 깊숙이 작용하여 강력한 콜라겐 재생과 리프팅 효과를 제공합니다.
      50~110μm의 큰 입자 크기로 볼륨감과 리프팅에 최적화되었습니다.
    </p>
  </div>

  <!-- 스펙 테이블 -->
  <div style="margin-bottom: 30px;">
    <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 16px;">제품 사양</h2>
    <table style="width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden;">
      <tbody>
        <tr style="background: #f8fafc;">
          <td style="padding: 14px 20px; font-weight: 600; border-bottom: 1px solid #e2e8f0; width: 35%; color: #475569;">제품명</td>
          <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">ULTRACOL 200</td>
        </tr>
        <tr>
          <td style="padding: 14px 20px; font-weight: 600; border-bottom: 1px solid #e2e8f0; color: #475569;">Packing Unit</td>
          <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">200mg / vial</td>
        </tr>
        <tr style="background: #f8fafc;">
          <td style="padding: 14px 20px; font-weight: 600; border-bottom: 1px solid #e2e8f0; color: #475569;">Particle Size</td>
          <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">50 ~ 110 μm</td>
        </tr>
        <tr>
          <td style="padding: 14px 20px; font-weight: 600; border-bottom: 1px solid #e2e8f0; color: #475569;">Cannula Size</td>
          <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">23G</td>
        </tr>
        <tr style="background: #f8fafc;">
          <td style="padding: 14px 20px; font-weight: 600; border-bottom: 1px solid #e2e8f0; color: #475569;">주요 성분</td>
          <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">PDO (Polydioxanone) Microsphere</td>
        </tr>
        <tr>
          <td style="padding: 14px 20px; font-weight: 600; color: #475569;">생분해 기간</td>
          <td style="padding: 14px 20px;">4 ~ 6개월</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- PDO 마이크로스피어 기술 -->
  <div style="padding: 30px; background: #fefce8; border-radius: 12px; margin-bottom: 30px; border: 1px solid #fde68a;">
    <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 16px; color: #92400e;">PDO 마이크로스피어 기술</h2>
    <p style="line-height: 1.8; color: #374151; margin-bottom: 16px;">
      ULTRACOL 200의 PDO 마이크로스피어는 50~110μm의 큰 입자로 설계되어
      진피 깊은 층에서 <strong>강력한 볼륨 형성과 리프팅 효과</strong>를 제공합니다.
    </p>
    <p style="line-height: 1.8; color: #374151;">
      큰 입자가 진피 내에서 더 오래 머물며 섬유아세포를 지속적으로 자극하여
      <strong>고밀도 콜라겐 매트릭스</strong>를 형성합니다. 이를 통해
      피부 볼륨 회복과 자연스러운 리프팅 효과를 동시에 달성합니다.
    </p>
  </div>

  <!-- 임상 데이터 -->
  <div style="padding: 30px; background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; margin-bottom: 30px; border: 1px solid #a7f3d0;">
    <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 20px; color: #065f46;">임상 데이터</h2>
    <p style="line-height: 1.8; color: #374151; margin-bottom: 20px;">
      ULTRACOL 200의 임상 시험 결과, 시술 후 유의미한 피부 개선 효과가 확인되었습니다.
    </p>
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
      <div style="padding: 20px; background: white; border-radius: 8px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
        <p style="font-size: 0.85rem; color: #6b7280; margin-bottom: 8px;">진피 밀도</p>
        <p style="font-size: 1.1rem; color: #9ca3af; margin-bottom: 4px;">11.04%</p>
        <p style="font-size: 1.5rem; font-weight: 800; color: #059669;">→ 14.72%</p>
        <p style="font-size: 0.8rem; color: #10b981; margin-top: 4px;">+33.3% 개선</p>
      </div>
      <div style="padding: 20px; background: white; border-radius: 8px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
        <p style="font-size: 0.85rem; color: #6b7280; margin-bottom: 8px;">주름 지수</p>
        <p style="font-size: 1.1rem; color: #9ca3af; margin-bottom: 4px;">40.17</p>
        <p style="font-size: 1.5rem; font-weight: 800; color: #059669;">→ 33.99</p>
        <p style="font-size: 0.8rem; color: #10b981; margin-top: 4px;">-15.4% 감소</p>
      </div>
      <div style="padding: 20px; background: white; border-radius: 8px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
        <p style="font-size: 0.85rem; color: #6b7280; margin-bottom: 8px;">피부 광채</p>
        <p style="font-size: 1.1rem; color: #9ca3af; margin-bottom: 4px;">55.67</p>
        <p style="font-size: 1.5rem; font-weight: 800; color: #059669;">→ 60.80</p>
        <p style="font-size: 0.8rem; color: #10b981; margin-top: 4px;">+9.2% 향상</p>
      </div>
    </div>
  </div>

  <!-- 특장점 -->
  <div style="margin-bottom: 30px;">
    <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 16px;">특장점 및 효과</h2>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
      <div style="padding: 20px; background: #fdf2f8; border-radius: 8px; border-left: 4px solid #ec4899;">
        <h3 style="font-weight: 600; margin-bottom: 8px; color: #be185d;">강력한 리프팅</h3>
        <p style="font-size: 0.95rem; color: #374151;">200mg 고함량 PDO로 강력한 볼륨 형성 및 리프팅</p>
      </div>
      <div style="padding: 20px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
        <h3 style="font-weight: 600; margin-bottom: 8px; color: #1e40af;">고밀도 콜라겐</h3>
        <p style="font-size: 0.95rem; color: #374151;">진피 밀도 33.3% 개선, 고밀도 콜라겐 매트릭스 형성</p>
      </div>
      <div style="padding: 20px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">
        <h3 style="font-weight: 600; margin-bottom: 8px; color: #166534;">주름 개선</h3>
        <p style="font-size: 0.95rem; color: #374151;">주름 지수 15.4% 감소, 눈에 띄는 피부결 개선</p>
      </div>
      <div style="padding: 20px; background: #fff7ed; border-radius: 8px; border-left: 4px solid #f97316;">
        <h3 style="font-weight: 600; margin-bottom: 8px; color: #c2410c;">피부 광채 향상</h3>
        <p style="font-size: 0.95rem; color: #374151;">피부 광채 9.2% 향상, 생기있는 피부톤 회복</p>
      </div>
    </div>
  </div>

  <!-- 생분해 안내 -->
  <div style="padding: 24px; background: #f5f3ff; border-radius: 12px; margin-bottom: 30px; border: 1px solid #ddd6fe;">
    <h3 style="font-weight: 700; margin-bottom: 12px; color: #5b21b6;">생분해 안내</h3>
    <p style="line-height: 1.8; color: #374151;">
      ULTRACOL 200의 PDO 마이크로스피어는 시술 후 <strong>4~6개월</strong>에 걸쳐 체내에서 안전하게 분해됩니다.
      분해 과정에서 지속적으로 콜라겐 생성을 자극하며, 완전 분해 후에도 형성된 콜라겐 매트릭스가
      피부 지지 구조를 유지합니다. 시술 효과는 개인에 따라 6~12개월 이상 지속될 수 있습니다.
    </p>
  </div>

  <!-- 안내 -->
  <div style="padding: 20px; background: #f1f5f9; border-radius: 8px; text-align: center; color: #64748b; font-size: 0.9rem;">
    <p>본 제품은 전문 의료기관에서 의료진에 의해 시술되어야 합니다.</p>
    <p style="margin-top: 4px;">가격 및 구매 관련 문의는 영업팀에 연락해주세요.</p>
  </div>
</div>`

  // Ultracol 100 생성
  const ultracol100 = await prisma.product.create({
    data: {
      name: 'ULTRACOL 100',
      brand: 'UltraV',
      description: 'PDO 마이크로스피어 콜라겐 스킨 부스터 100mg/vial, 입자크기 20-50μm',
      detailContent: ultracol100Detail,
      price: 0,
      discount: 0,
      stock: 100,
      categoryId: ultracol100Cat.id,
      imageUrl: images.ultracol100,
      images: [images.welcomeLarge, images.welcomeSmall],
      isActive: true,
    },
  })
  console.log(`✅ ULTRACOL 100 등록 완료 (ID: ${ultracol100.id})`)

  // Ultracol 200 생성
  const ultracol200 = await prisma.product.create({
    data: {
      name: 'ULTRACOL 200',
      brand: 'UltraV',
      description: 'PDO 마이크로스피어 콜라겐 리프팅 200mg/vial, 입자크기 50-110μm',
      detailContent: ultracol200Detail,
      price: 0,
      discount: 0,
      stock: 100,
      categoryId: ultracol200Cat.id,
      imageUrl: images.ultracol200,
      images: [images.welcomeLarge, images.welcomeSmall],
      isActive: true,
    },
  })
  console.log(`✅ ULTRACOL 200 등록 완료 (ID: ${ultracol200.id})`)

  console.log('🎉 Ultracol 제품 등록 완료!')
}

main()
  .catch((e) => {
    console.error('❌ Ultracol 제품 등록 실패:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
