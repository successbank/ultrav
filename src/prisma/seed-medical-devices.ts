import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const IMG = 'https://www.ultrav.co.kr/images/sub'

// ──────────────────────────────────────────
// 디바이스 데이터 인터페이스
// ──────────────────────────────────────────
interface DeviceInfo {
  name: string
  slug: string
  description: string
  thumbnailImg: string
  images: string[]
  accentColor: string
  accentBg: string
  bannerImg: string
  buildHTML: () => string
}

// ──────────────────────────────────────────
// 공통 스타일 헬퍼
// ──────────────────────────────────────────
function sectionTitle(text: string) {
  return `<h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 16px; color: #1e293b;">${text}</h2>`
}

function featureCard(title: string, desc: string, borderColor: string, titleColor: string) {
  return `
    <div style="padding: 20px; background: #fafafa; border-radius: 8px; border-left: 4px solid ${borderColor};">
      <h3 style="font-weight: 600; margin-bottom: 8px; color: ${titleColor};">${title}</h3>
      <p style="font-size: 0.95rem; color: #374151; line-height: 1.6;">${desc}</p>
    </div>`
}

function specRow(label: string, value: string, alt = false) {
  const bg = alt ? 'background: #f8fafc;' : ''
  return `
    <tr style="${bg}">
      <td style="padding: 14px 20px; font-weight: 600; border-bottom: 1px solid #e2e8f0; width: 35%; color: #475569;">${label}</td>
      <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">${value}</td>
    </tr>`
}

function applicationTag(text: string) {
  return `<span style="display: inline-block; padding: 8px 16px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 20px; font-size: 0.9rem; color: #0369a1; margin: 4px;">${text}</span>`
}

// ──────────────────────────────────────────
// 1. Triderm
// ──────────────────────────────────────────
function buildTridermHTML(): string {
  return `
<div style="max-width: 900px; margin: 0 auto; font-family: 'Pretendard', sans-serif; color: #1a1a1a;">
  <!-- 제품 헤더 -->
  <div style="text-align: center; padding: 40px 0; border-bottom: 2px solid #e5e7eb;">
    <h1 style="font-size: 2.5rem; font-weight: 800; color: #111; margin-bottom: 8px;">UltraV Triderm</h1>
    <p style="font-size: 1.1rem; color: #6b7280;">RF Cannula + RF Acne + RF Plasma | 3-in-1 Medical Device</p>
  </div>

  <!-- 배너 이미지 -->
  <div style="text-align: center; padding: 40px 0;">
    <img src="${IMG}/device-welcome-triderm.jpg" alt="UltraV Triderm" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" />
  </div>

  <!-- 제품 개요 -->
  <div style="padding: 30px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; margin-bottom: 30px;">
    ${sectionTitle('Product Overview')}
    <p style="line-height: 1.8; color: #374151;">Triderm은 RF Cannula, RF Acne, RF Plasma 3가지 기능을 하나로 통합한 혁신적 의료기기입니다. RF(Radio Frequency) 에너지를 피부 진피층에 전달하여 콜라겐 수축과 재생을 촉진하고, 여드름 피지선을 선택적으로 파괴하며, 플라즈마 에너지로 콜라겐과 엘라스틴 재생을 자극합니다. 하나의 장비로 눈밑 주름, 여드름, 상하안검 시술까지 가능한 비용 효율적 솔루션입니다.</p>
  </div>

  <!-- 3가지 기능 소개 -->
  <div style="margin-bottom: 40px;">
    ${sectionTitle('3-in-1 Functions')}
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
      <div style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; text-align: center;">
        <img src="${IMG}/triderm-handpiece01.png" alt="RF Cannula" style="width: 100%; aspect-ratio: 4/3; object-fit: cover;" />
        <div style="padding: 16px;">
          <h3 style="font-weight: 700; font-size: 1.05rem; margin-bottom: 6px; color: #b45309;">RF Cannula</h3>
          <p style="font-size: 0.85rem; color: #6b7280; line-height: 1.5;">진피층에 RF 에너지를 전달하여 표피 손상 없이 콜라겐 수축을 유도합니다. 다양한 게이지(18G/19G/21G/23G) 캐뉼라로 박리 및 필러 주입 시술에 활용됩니다.</p>
        </div>
      </div>
      <div style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; text-align: center;">
        <img src="${IMG}/triderm-handpiece02.png" alt="RF Acne" style="width: 100%; aspect-ratio: 4/3; object-fit: cover;" />
        <div style="padding: 16px;">
          <h3 style="font-weight: 700; font-size: 1.05rem; margin-bottom: 6px; color: #b45309;">RF Acne</h3>
          <p style="font-size: 0.85rem; color: #6b7280; line-height: 1.5;">31G 초미세 RF 니들로 피지선을 선택적으로 파괴합니다. 주변 조직 손상 없이 여드름의 근본 원인을 제거하는 종합 여드름 치료 솔루션입니다.</p>
        </div>
      </div>
      <div style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; text-align: center;">
        <img src="${IMG}/triderm-handpiece03.png" alt="RF Plasma" style="width: 100%; aspect-ratio: 4/3; object-fit: cover;" />
        <div style="padding: 16px;">
          <h3 style="font-weight: 700; font-size: 1.05rem; margin-bottom: 6px; color: #b45309;">RF Plasma</h3>
          <p style="font-size: 0.85rem; color: #6b7280; line-height: 1.5;">플라즈마 에너지로 콜라겐과 엘라스틴 재생을 자극합니다. 상안검/하안검 시술에 특화된 비수술적 눈가 리프팅 솔루션입니다.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- 스펙 테이블 -->
  <div style="margin-bottom: 30px;">
    ${sectionTitle('Specifications')}
    <table style="width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden;">
      <tbody>
        ${specRow('Device Type', '3-in-1 RF Medical Device', true)}
        ${specRow('RF Cannula Gauge', '18G / 19G / 21G / 23G')}
        ${specRow('RF Acne Needle', '31G Ultra-fine RF Needle', true)}
        ${specRow('RF Plasma', 'Plasma Energy Generator')}
        ${specRow('Functions', 'RF Cannula + RF Acne + RF Plasma', true)}
      </tbody>
    </table>
  </div>

  <!-- 특장점 -->
  <div style="margin-bottom: 40px;">
    ${sectionTitle('Key Advantages')}
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
      ${featureCard('Cost-Effective 3-in-1', 'RF Cannula, RF Acne, RF Plasma 3가지 기능을 하나의 장비에 통합하여 비용 효율 극대화', '#f59e0b', '#92400e')}
      ${featureCard('Minimal Downtime', '비침습/최소침습 시술로 회복 기간이 거의 필요 없어 빠른 일상 복귀 가능', '#22c55e', '#166534')}
      ${featureCard('Versatile Cannula Options', '18G~23G 다양한 사이즈의 캐뉼라로 박리, 필러 주입 등 광범위한 시술 대응', '#3b82f6', '#1e40af')}
      ${featureCard('User-Friendly Interface', '직관적 인터페이스 설계로 시술자 편의성 극대화 및 학습 곡선 최소화', '#a855f7', '#7e22ce')}
    </div>
  </div>

  <!-- 적용 분야 -->
  <div style="margin-bottom: 40px;">
    ${sectionTitle('Applications')}
    <div style="text-align: center;">
      ${applicationTag('Eye Bag Rejuvenation')}
      ${applicationTag('Under-eye Wrinkles')}
      ${applicationTag('Comprehensive Acne Treatment')}
      ${applicationTag('Upper Blepharoplasty')}
      ${applicationTag('Lower Blepharoplasty')}
      ${applicationTag('Collagen Remodeling')}
    </div>
  </div>

  <!-- BnA 이미지 -->
  <div style="text-align: center; margin-bottom: 30px;">
    <img src="${IMG}/triderm-bna01.jpg" alt="Triderm Before & After" style="max-width: 100%; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);" />
  </div>

  <!-- 안내 -->
  <div style="padding: 20px; background: #f1f5f9; border-radius: 8px; text-align: center; color: #64748b; font-size: 0.9rem;">
    <p>This product is a certified medical device that should be administered by qualified medical professionals at accredited facilities.</p>
    <p style="margin-top: 4px;">For pricing and purchase inquiries, please contact our sales team.</p>
  </div>
</div>`
}

// ──────────────────────────────────────────
// 2. Air Shine
// ──────────────────────────────────────────
function buildAirShineHTML(): string {
  return `
<div style="max-width: 900px; margin: 0 auto; font-family: 'Pretendard', sans-serif; color: #1a1a1a;">
  <!-- 제품 헤더 -->
  <div style="text-align: center; padding: 40px 0; border-bottom: 2px solid #e5e7eb;">
    <h1 style="font-size: 2.5rem; font-weight: 800; color: #111; margin-bottom: 8px;">UltraV Air Shine</h1>
    <p style="font-size: 1.1rem; color: #6b7280;">Compressed Air Dissection | Premium Injection Device</p>
  </div>

  <!-- 배너 이미지 -->
  <div style="text-align: center; padding: 40px 0;">
    <img src="${IMG}/device-welcome-airshine.jpg" alt="UltraV Air Shine" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" />
  </div>

  <!-- 제품 개요 -->
  <div style="padding: 30px; background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 12px; margin-bottom: 30px;">
    ${sectionTitle('Product Overview')}
    <p style="line-height: 1.8; color: #374151;">Air Shine은 압축공기를 활용한 프리미엄 주입 의료기기입니다. 고압의 압축공기로 진피층을 일시적으로 박리하여 자연 콜라겐 형성을 촉진하고, 다양한 약물을 균일하게 분산 주입합니다. 솔루션 카운팅과 샷 카운트 트래킹이 가능한 7인치 터치스크린 인터페이스로 정밀하고 효율적인 시술을 지원합니다.</p>
  </div>

  <!-- 기술 원리 -->
  <div style="margin-bottom: 40px;">
    ${sectionTitle('Technology Principle')}
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center;">
      <div>
        <img src="${IMG}/airshine-welcome01.png" alt="Air Shine Technology" style="width: 100%; border-radius: 10px;" />
      </div>
      <div>
        <div style="padding: 20px; background: #f0f9ff; border-radius: 10px;">
          <h3 style="font-weight: 700; margin-bottom: 12px; color: #0369a1;">Compressed Air Dissection</h3>
          <p style="font-size: 0.95rem; color: #374151; line-height: 1.7; margin-bottom: 12px;">고압 압축공기를 순간적으로 진피층 사이에 주입하여 피부 레이어를 일시적으로 박리합니다.</p>
          <p style="font-size: 0.95rem; color: #374151; line-height: 1.7; margin-bottom: 12px;"><strong>Step 1:</strong> 압축공기 진피 박리 → 자가재생 콜라겐 형성 자극</p>
          <p style="font-size: 0.95rem; color: #374151; line-height: 1.7;"><strong>Step 2:</strong> 박리된 공간에 약물/솔루션/PDO 실 균일 주입</p>
        </div>
      </div>
    </div>
  </div>

  <!-- 스펙 테이블 -->
  <div style="margin-bottom: 30px;">
    ${sectionTitle('Specifications')}
    <table style="width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden;">
      <tbody>
        ${specRow('Rated Voltage', 'AC 110-240V / 50, 60Hz / 12V', true)}
        ${specRow('Main Body', '337mm (W) × 220mm (L) × 252mm (H) / 5.3kg')}
        ${specRow('Handpiece 1', '120mm (W) × 20mm (L) × 20mm (H) / 65g', true)}
        ${specRow('Handpiece 2', '345mm (W) × 224mm (L) × 134mm (H) / 520g')}
        ${specRow('Syringe Capacity', '1cc / 2cc / 3cc / 5cc / 10cc', true)}
        ${specRow('Display', '7" Touchscreen (800×480)')}
        ${specRow('Features', 'Real-time Solution Counting, Shot-count Tracking', true)}
      </tbody>
    </table>
  </div>

  <!-- 핸드피스 이미지 -->
  <div style="text-align: center; margin-bottom: 30px;">
    <img src="${IMG}/airshine-handpiece01.jpg" alt="Air Shine Handpiece" style="max-width: 100%; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);" />
  </div>

  <!-- 특장점 -->
  <div style="margin-bottom: 40px;">
    ${sectionTitle('Key Advantages')}
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
      ${featureCard('Self-Regeneration Collagen', '진피층 박리를 통해 자가재생 콜라겐 형성을 자극. 외부 이물질 없이 자연스러운 피부 개선', '#3b82f6', '#1e40af')}
      ${featureCard('Wide Medication Compatibility', '다양한 약물, 솔루션, PDO 실과 호환. 복합 시술로 시너지 효과 극대화', '#22c55e', '#166534')}
      ${featureCard('Precise Combination Treatment', '7인치 터치스크린으로 실시간 솔루션 카운팅. 정확한 양과 위치에 약물 전달', '#a855f7', '#7e22ce')}
      ${featureCard('Lossless Injection', '순간 고압 에어 분사로 최소 통증. 약물 손실 없이 목표 지점에 100% 전달', '#f59e0b', '#92400e')}
    </div>
  </div>

  <!-- 적용 분야 -->
  <div style="margin-bottom: 40px;">
    ${sectionTitle('Applications')}
    <div style="text-align: center;">
      ${applicationTag('Whitening')}
      ${applicationTag('Wrinkle Improvement')}
      ${applicationTag('Elasticity Enhancement')}
      ${applicationTag('Scar Improvement')}
      ${applicationTag('Collagen Regeneration')}
      ${applicationTag('PDO Thread Injection')}
    </div>
  </div>

  <!-- 기능 이미지 -->
  <div style="text-align: center; margin-bottom: 30px;">
    <img src="${IMG}/airshine-feature.jpg" alt="Air Shine Features" style="max-width: 100%; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);" />
  </div>

  <!-- 안내 -->
  <div style="padding: 20px; background: #f1f5f9; border-radius: 8px; text-align: center; color: #64748b; font-size: 0.9rem;">
    <p>This product is a certified medical device that should be administered by qualified medical professionals at accredited facilities.</p>
    <p style="margin-top: 4px;">For pricing and purchase inquiries, please contact our sales team.</p>
  </div>
</div>`
}

// ──────────────────────────────────────────
// 3. Hifu Plus
// ──────────────────────────────────────────
function buildHifuPlusHTML(): string {
  return `
<div style="max-width: 900px; margin: 0 auto; font-family: 'Pretendard', sans-serif; color: #1a1a1a;">
  <!-- 제품 헤더 -->
  <div style="text-align: center; padding: 40px 0; border-bottom: 2px solid #e5e7eb;">
    <h1 style="font-size: 2.5rem; font-weight: 800; color: #111; margin-bottom: 8px;">UltraV Hifu Plus</h1>
    <p style="font-size: 1.1rem; color: #6b7280;">High-Intensity Focused Ultrasound | TDT™ Technology</p>
  </div>

  <!-- 배너 이미지 -->
  <div style="text-align: center; padding: 40px 0;">
    <img src="${IMG}/device-welcome-hifu.jpg" alt="UltraV Hifu Plus" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" />
  </div>

  <!-- 제품 개요 -->
  <div style="padding: 30px; background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%); border-radius: 12px; margin-bottom: 30px;">
    ${sectionTitle('Product Overview')}
    <p style="line-height: 1.8; color: #374151;">Hifu Plus는 고강도 집속 초음파(HIFU) 기술을 활용한 최첨단 안티에이징 의료기기입니다. 피부 표피 손상 없이 하부 진피층과 SMAS(근근막) 레이어에 초음파 에너지를 정밀 전달하여 콜라겐 리모델링을 촉진합니다. UltraV 독자 개발 TDT™(Thermal Diffusion Treatment) 기술로 통증을 최소화하고, 10Hz 연속 초음파 발사로 빠른 시술을 실현합니다.</p>
  </div>

  <!-- HIFU 기술 -->
  <div style="margin-bottom: 40px;">
    ${sectionTitle('HIFU Technology')}
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center;">
      <div>
        <img src="${IMG}/hifu-welcome01.png" alt="HIFU Technology" style="width: 100%; border-radius: 10px;" />
      </div>
      <div>
        <div style="padding: 20px; background: #fdf2f8; border-radius: 10px;">
          <h3 style="font-weight: 700; margin-bottom: 12px; color: #be185d;">Focused Ultrasound Energy</h3>
          <p style="font-size: 0.95rem; color: #374151; line-height: 1.7; margin-bottom: 12px;">HIFU는 초음파 에너지를 한 점에 집속시켜 하부 진피 및 SMAS 레이어에 열 에너지를 생성합니다.</p>
          <p style="font-size: 0.95rem; color: #374151; line-height: 1.7; margin-bottom: 12px;">이 열 에너지가 기존 콜라겐을 수축시키고 새로운 콜라겐 합성을 촉진하여 자연스러운 리프팅 효과를 만들어냅니다.</p>
          <p style="font-size: 0.95rem; color: #374151; line-height: 1.7;">표피와 주변 조직은 손상 없이 보존됩니다.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- TDT 기술 -->
  <div style="margin-bottom: 40px;">
    ${sectionTitle('TDT™ — Thermal Diffusion Treatment')}
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center;">
      <div style="padding: 20px; background: #fff7ed; border-radius: 10px;">
        <h3 style="font-weight: 700; margin-bottom: 12px; color: #c2410c;">Proprietary Pain Reduction</h3>
        <p style="font-size: 0.95rem; color: #374151; line-height: 1.7; margin-bottom: 12px;">TDT™는 UltraV가 독자 개발한 열확산 치료 기술입니다.</p>
        <p style="font-size: 0.95rem; color: #374151; line-height: 1.7; margin-bottom: 12px;">초음파 에너지가 피부 내 한 점에 과도하게 집중되는 것을 방지하여, 열 분포를 최적화합니다.</p>
        <p style="font-size: 0.95rem; color: #374151; line-height: 1.7;">결과적으로 시술 시 통증을 획기적으로 줄이면서도 동일한 리프팅 효과를 유지합니다.</p>
      </div>
      <div>
        <img src="${IMG}/hifu-tdt01.jpg" alt="TDT Technology" style="width: 100%; border-radius: 10px;" />
      </div>
    </div>
  </div>

  <!-- 스펙 테이블 -->
  <div style="margin-bottom: 30px;">
    ${sectionTitle('Specifications')}
    <table style="width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden;">
      <tbody>
        ${specRow('Technology', 'High-Intensity Focused Ultrasound (HIFU)', true)}
        ${specRow('Delivery Rate', 'Continuous 10Hz Ultrasound')}
        ${specRow('Target Layers', 'Lower Dermis + SMAS Layer', true)}
        ${specRow('Proprietary Tech', 'TDT™ (Thermal Diffusion Treatment)')}
        ${specRow('Applicator', 'Ergonomic Design for Curved Facial Areas', true)}
      </tbody>
    </table>
  </div>

  <!-- 특장점 -->
  <div style="margin-bottom: 40px;">
    ${sectionTitle('Key Advantages')}
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
      ${featureCard('Minimized Pain (TDT™)', '독자 개발 TDT™ 기술로 열확산을 최적화하여 기존 HIFU 대비 통증을 획기적으로 감소', '#ec4899', '#be185d')}
      ${featureCard('Rapid Treatment (10Hz)', '10Hz 연속 초음파 발사로 시술 시간 단축. 환자와 시술자 모두에게 효율적', '#3b82f6', '#1e40af')}
      ${featureCard('Non-Invasive Anti-Aging', '표피 손상 없이 SMAS 레이어까지 에너지 전달. 다운타임 최소화', '#22c55e', '#166534')}
      ${featureCard('Ergonomic Applicator', '얼굴 곡면에 최적화된 인체공학적 어플리케이터로 정밀한 시술 가능', '#a855f7', '#7e22ce')}
    </div>
  </div>

  <!-- 적용 분야 -->
  <div style="margin-bottom: 40px;">
    ${sectionTitle('Applications')}
    <div style="text-align: center;">
      ${applicationTag('Facial Lifting & Tightening')}
      ${applicationTag('Elasticity Enhancement')}
      ${applicationTag('Skin Tone Improvement')}
      ${applicationTag('Wrinkle Reduction')}
      ${applicationTag('Collagen Remodeling')}
      ${applicationTag('SMAS Layer Treatment')}
    </div>
  </div>

  <!-- 기능 이미지 -->
  <div style="text-align: center; margin-bottom: 30px;">
    <img src="${IMG}/hifu-feature.jpg" alt="Hifu Plus Features" style="max-width: 100%; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);" />
  </div>

  <!-- 안내 -->
  <div style="padding: 20px; background: #f1f5f9; border-radius: 8px; text-align: center; color: #64748b; font-size: 0.9rem;">
    <p>This product is a certified medical device that should be administered by qualified medical professionals at accredited facilities.</p>
    <p style="margin-top: 4px;">For pricing and purchase inquiries, please contact our sales team.</p>
  </div>
</div>`
}

// ──────────────────────────────────────────
// 4. Colasty
// ──────────────────────────────────────────
function buildColastyHTML(): string {
  return `
<div style="max-width: 900px; margin: 0 auto; font-family: 'Pretendard', sans-serif; color: #1a1a1a;">
  <!-- 제품 헤더 -->
  <div style="text-align: center; padding: 40px 0; border-bottom: 2px solid #e5e7eb;">
    <h1 style="font-size: 2.5rem; font-weight: 800; color: #111; margin-bottom: 8px;">UltraV Colasty</h1>
    <p style="font-size: 1.1rem; color: #6b7280;">Self-Collagen Lifting | No Foreign Materials Required</p>
  </div>

  <!-- 배너 이미지 -->
  <div style="text-align: center; padding: 40px 0;">
    <img src="${IMG}/device-welcome-colasty.jpg" alt="UltraV Colasty" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" />
  </div>

  <!-- 제품 개요 -->
  <div style="padding: 30px; background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); border-radius: 12px; margin-bottom: 30px;">
    ${sectionTitle('Product Overview')}
    <p style="line-height: 1.8; color: #374151;">Colasty는 이물질을 전혀 사용하지 않고 자가 콜라겐 생성을 촉진하는 혁신적 리프팅 의료기기입니다. Vibrance Energy와 Foresi Energy 2가지 에너지를 마이크로니들 팁을 통해 진피층 또는 피하조직에 직접 전달합니다. 손상된 섬유 조직을 재정렬하고 새로운 콜라겐 합성을 촉진하여, 외부 물질 주입 없이도 즉각적이고 자연스러운 리프팅 효과를 실현합니다.</p>
  </div>

  <!-- 핵심 기술 -->
  <div style="margin-bottom: 40px;">
    ${sectionTitle('Core Technology')}
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <div style="padding: 24px; background: #f0fdf4; border-radius: 10px; border: 1px solid #bbf7d0;">
        <h3 style="font-weight: 700; margin-bottom: 12px; color: #166534; font-size: 1.1rem;">Vibrance Energy</h3>
        <p style="font-size: 0.95rem; color: #374151; line-height: 1.7;">마이크로니들 팁을 통해 진동 에너지를 피부 깊숙이 전달합니다. 섬유아세포를 자극하여 콜라겐과 엘라스틴의 자연 생산을 촉진합니다.</p>
      </div>
      <div style="padding: 24px; background: #faf5ff; border-radius: 10px; border: 1px solid #e9d5ff;">
        <h3 style="font-weight: 700; margin-bottom: 12px; color: #7e22ce; font-size: 1.1rem;">Foresi Energy</h3>
        <p style="font-size: 0.95rem; color: #374151; line-height: 1.7;">피부 조직에 정밀한 에너지를 전달하여 손상된 콜라겐 섬유를 재정렬합니다. 즉각적인 타이트닝 효과와 장기적인 리프팅을 동시에 제공합니다.</p>
      </div>
    </div>
  </div>

  <!-- 시술 원리 이미지 -->
  <div style="margin-bottom: 40px;">
    ${sectionTitle('Treatment Mechanism')}
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center;">
      <div>
        <img src="${IMG}/colasty-function.jpg" alt="Colasty Function" style="width: 100%; border-radius: 10px;" />
      </div>
      <div style="padding: 20px; background: #f8fafc; border-radius: 10px;">
        <ol style="padding-left: 20px; color: #374151; line-height: 2;">
          <li>마이크로니들이 피부에 미세 채널 생성</li>
          <li>니들 팁을 통해 Vibrance + Foresi 에너지 전달</li>
          <li>진피층의 섬유아세포 활성화</li>
          <li>손상된 콜라겐 섬유 재정렬</li>
          <li>새로운 콜라겐 합성 촉진</li>
          <li>즉각적 리프팅 + 장기적 피부 개선</li>
        </ol>
      </div>
    </div>
  </div>

  <!-- 특장점 -->
  <div style="margin-bottom: 40px;">
    ${sectionTitle('Key Advantages')}
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
      ${featureCard('No Foreign Materials', '필러, 실, 보형물 등 외부 이물질 없이 순수하게 자가 콜라겐만으로 리프팅. 부작용 위험 최소화', '#22c55e', '#166534')}
      ${featureCard('Non-Invasive Procedure', '마이크로니들링 기반의 비침습 시술로 절개 없음. 시술 후 흉터가 남지 않음', '#3b82f6', '#1e40af')}
      ${featureCard('Immediate Visible Effect', '시술 직후부터 타이트닝 효과가 나타남. 시간이 지남에 따라 콜라겐 증가로 효과 극대화', '#a855f7', '#7e22ce')}
      ${featureCard('Instant Recovery', '다운타임이 거의 없어 시술 직후 일상 복귀 가능. 자연스러운 표정 유지', '#f59e0b', '#92400e')}
    </div>
  </div>

  <!-- 적용 분야 -->
  <div style="margin-bottom: 40px;">
    ${sectionTitle('Applications')}
    <div style="text-align: center;">
      ${applicationTag('Sagging & Fine Lines')}
      ${applicationTag('Deep Wrinkles (Nasolabial)')}
      ${applicationTag('Marionette Lines')}
      ${applicationTag('Facial Contouring')}
      ${applicationTag('Skin Elasticity')}
      ${applicationTag('Natural Expression Preservation')}
    </div>
  </div>

  <!-- 기능 이미지 -->
  <div style="text-align: center; margin-bottom: 30px;">
    <img src="${IMG}/colasty-feature.jpg" alt="Colasty Features" style="max-width: 100%; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);" />
  </div>

  <!-- 안내 -->
  <div style="padding: 20px; background: #f1f5f9; border-radius: 8px; text-align: center; color: #64748b; font-size: 0.9rem;">
    <p>This product is a certified medical device that should be administered by qualified medical professionals at accredited facilities.</p>
    <p style="margin-top: 4px;">For pricing and purchase inquiries, please contact our sales team.</p>
  </div>
</div>`
}

// ──────────────────────────────────────────
// 5. Cryo Stamp
// ──────────────────────────────────────────
function buildCryoStampHTML(): string {
  return `
<div style="max-width: 900px; margin: 0 auto; font-family: 'Pretendard', sans-serif; color: #1a1a1a;">
  <!-- 제품 헤더 -->
  <div style="text-align: center; padding: 40px 0; border-bottom: 2px solid #e5e7eb;">
    <h1 style="font-size: 2.5rem; font-weight: 800; color: #111; margin-bottom: 8px;">UltraV Cryo Stamp</h1>
    <p style="font-size: 1.1rem; color: #6b7280;">Ionzyme + Hot & Cold Therapy | Post-Treatment Soothing</p>
  </div>

  <!-- 배너 이미지 -->
  <div style="text-align: center; padding: 40px 0;">
    <img src="${IMG}/device-welcome-cryo.jpg" alt="UltraV Cryo Stamp" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" />
  </div>

  <!-- 제품 개요 -->
  <div style="padding: 30px; background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%); border-radius: 12px; margin-bottom: 30px;">
    ${sectionTitle('Product Overview')}
    <p style="line-height: 1.8; color: #374151;">Cryo Stamp는 Ionzyme 기술과 Hot & Cold 테라피를 결합한 복합 피부 진정 의료기기입니다. 인텐시브 시술 후 피부 진정과 고기능 활성성분의 흡수를 극대화합니다. -15°C~+45°C의 정밀한 온도 제어와 10KHz Ionzyme 에너지로 활성성분의 80~90%를 표피·진피층까지 균일하게 전달합니다.</p>
  </div>

  <!-- Ionzyme 기술 -->
  <div style="margin-bottom: 40px;">
    ${sectionTitle('Ionzyme Technology')}
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center;">
      <div>
        <img src="${IMG}/cryo-zigzag01.jpg" alt="Ionzyme Technology" style="width: 100%; border-radius: 10px;" />
      </div>
      <div style="padding: 20px; background: #f0fdfa; border-radius: 10px;">
        <h3 style="font-weight: 700; margin-bottom: 12px; color: #0f766e;">Ion-zyme Energy Delivery</h3>
        <p style="font-size: 0.95rem; color: #374151; line-height: 1.7; margin-bottom: 12px;">Ionzyme 에너지는 저주파 전기 신호를 활용하여 피부 장벽의 투과성을 일시적으로 증가시킵니다.</p>
        <p style="font-size: 0.95rem; color: #374151; line-height: 1.7; margin-bottom: 12px;">이를 통해 고기능 활성성분의 <strong>80~90%</strong>가 표피와 진피층까지 균일하게 침투합니다.</p>
        <p style="font-size: 0.95rem; color: #374151; line-height: 1.7;">국소 과집중 없이 넓은 면적에 균등하게 분산되어 치료 효과를 극대화합니다.</p>
      </div>
    </div>
  </div>

  <!-- 3가지 테라피 -->
  <div style="margin-bottom: 40px;">
    ${sectionTitle('Triple Therapy Modes')}
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
      <div style="padding: 20px; background: #fff1f2; border-radius: 10px; text-align: center; border: 1px solid #fecdd3;">
        <div style="font-size: 2rem; margin-bottom: 8px;">🔥</div>
        <h3 style="font-weight: 700; color: #e11d48; margin-bottom: 8px;">Hot Therapy</h3>
        <p style="font-size: 0.85rem; color: #6b7280; line-height: 1.5;">최대 +45°C 열에너지로 혈관 확장 및 혈액순환 촉진. 근육 이완과 통증 완화에 효과적</p>
      </div>
      <div style="padding: 20px; background: #f0f9ff; border-radius: 10px; text-align: center; border: 1px solid #bae6fd;">
        <div style="font-size: 2rem; margin-bottom: 8px;">❄️</div>
        <h3 style="font-weight: 700; color: #0369a1; margin-bottom: 8px;">Cold Therapy</h3>
        <p style="font-size: 0.85rem; color: #6b7280; line-height: 1.5;">최저 -15°C 냉각으로 염증 감소 및 부종 완화. 시술 후 즉각적인 피부 진정 효과</p>
      </div>
      <div style="padding: 20px; background: #f5f3ff; border-radius: 10px; text-align: center; border: 1px solid #ddd6fe;">
        <div style="font-size: 2rem; margin-bottom: 8px;">🔄</div>
        <h3 style="font-weight: 700; color: #7c3aed; margin-bottom: 8px;">Contrastive Therapy</h3>
        <p style="font-size: 0.85rem; color: #6b7280; line-height: 1.5;">Hot/Cold 교차 적용으로 혈관 펌핑 효과. 림프 배출 촉진과 종합적 피부 회복</p>
      </div>
    </div>
  </div>

  <!-- 스펙 테이블 -->
  <div style="margin-bottom: 30px;">
    ${sectionTitle('Specifications')}
    <table style="width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden;">
      <tbody>
        ${specRow('Rated Voltage', 'AC 110-240V / 50, 60Hz / 12V', true)}
        ${specRow('Power Consumption', '100W')}
        ${specRow('Output Frequency', '10KHz ±10% (Sine Wave / DC)', true)}
        ${specRow('Temperature Range', '-15°C ~ +45°C')}
        ${specRow('Timer', '1-60 minutes (Manual / Random)', true)}
        ${specRow('Safety System', 'Zero Start Protection')}
        ${specRow('Wave Pattern', 'Low Frequency', true)}
      </tbody>
    </table>
  </div>

  <!-- 특장점 -->
  <div style="margin-bottom: 40px;">
    ${sectionTitle('Key Advantages')}
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
      ${featureCard('80-90% Active Ingredient Delivery', 'Ionzyme 에너지로 활성성분의 80~90%를 표피·진피층까지 균일하게 전달. 최대 치료 효과 실현', '#0891b2', '#0f766e')}
      ${featureCard('Precision Temperature Control', '-15°C~+45°C 광범위 온도 제어. Hot/Cold/Contrastive 3가지 모드로 맞춤형 진정 시술', '#e11d48', '#be123c')}
      ${featureCard('Post-Treatment Soothing', '인텐시브 시술 직후 사용하여 멍, 부종, 통증을 빠르게 완화. 환자 만족도 극대화', '#22c55e', '#166534')}
      ${featureCard('Universal Compatibility', '모든 종류의 사후 관리 시술에 적용 가능. HIFU, RF, 레이저 등 다양한 시술과 병행', '#a855f7', '#7e22ce')}
    </div>
  </div>

  <!-- 적용 분야 -->
  <div style="margin-bottom: 40px;">
    ${sectionTitle('Applications')}
    <div style="text-align: center;">
      ${applicationTag('Pain Relief')}
      ${applicationTag('Muscle Relaxation')}
      ${applicationTag('Blood Circulation')}
      ${applicationTag('Medication Permeation')}
      ${applicationTag('Post-Procedure Soothing')}
      ${applicationTag('Bruise & Swelling Reduction')}
    </div>
  </div>

  <!-- 효과 이미지 -->
  <div style="text-align: center; margin-bottom: 30px;">
    <img src="${IMG}/cryo-effect.jpg" alt="Cryo Stamp Effects" style="max-width: 100%; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);" />
  </div>

  <!-- 안내 -->
  <div style="padding: 20px; background: #f1f5f9; border-radius: 8px; text-align: center; color: #64748b; font-size: 0.9rem;">
    <p>This product is a certified medical device that should be administered by qualified medical professionals at accredited facilities.</p>
    <p style="margin-top: 4px;">For pricing and purchase inquiries, please contact our sales team.</p>
  </div>
</div>`
}

// ──────────────────────────────────────────
// 디바이스 데이터 배열
// ──────────────────────────────────────────
const devices: DeviceInfo[] = [
  {
    name: 'UltraV Triderm',
    slug: 'device-triderm',
    description: 'RF Cannula + RF Acne + RF Plasma 3-in-1 medical device. Selectively destroys sebaceous glands with RF energy, induces collagen contraction, and promotes skin regeneration.',
    thumbnailImg: `${IMG}/welcome-device-triderm.jpg`,
    images: [
      `${IMG}/device-welcome-triderm.jpg`,
      `${IMG}/triderm-top-box01.png`,
      `${IMG}/triderm-handpiece01.png`,
      `${IMG}/triderm-bna01.jpg`,
    ],
    accentColor: '#b45309',
    accentBg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    bannerImg: `${IMG}/device-welcome-triderm.jpg`,
    buildHTML: buildTridermHTML,
  },
  {
    name: 'UltraV Air Shine',
    slug: 'device-air-shine',
    description: 'Compressed air-based premium injection medical device. Promotes natural regeneration through dermal dissection and enables uniform drug dispersion.',
    thumbnailImg: `${IMG}/welcome-device-airshine.jpg`,
    images: [
      `${IMG}/device-welcome-airshine.jpg`,
      `${IMG}/airshine-welcome01.png`,
      `${IMG}/airshine-feature.jpg`,
      `${IMG}/airshine-handpiece01.jpg`,
    ],
    accentColor: '#0369a1',
    accentBg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    bannerImg: `${IMG}/device-welcome-airshine.jpg`,
    buildHTML: buildAirShineHTML,
  },
  {
    name: 'UltraV Hifu Plus',
    slug: 'device-hifu-plus',
    description: 'High-Intensity Focused Ultrasound (HIFU) anti-aging medical device. Minimized pain with proprietary TDT™ technology, continuous 10Hz ultrasound delivery.',
    thumbnailImg: `${IMG}/welcome-device-hifu.jpg`,
    images: [
      `${IMG}/device-welcome-hifu.jpg`,
      `${IMG}/hifu-welcome01.png`,
      `${IMG}/hifu-feature.jpg`,
      `${IMG}/hifu-tdt01.jpg`,
    ],
    accentColor: '#be185d',
    accentBg: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
    bannerImg: `${IMG}/device-welcome-hifu.jpg`,
    buildHTML: buildHifuPlusHTML,
  },
  {
    name: 'UltraV Colasty',
    slug: 'device-colasty',
    description: 'Self-collagen lifting medical device requiring no foreign materials. Vibrance + Foresi energy stimulates natural collagen production through microneedling.',
    thumbnailImg: `${IMG}/welcome-device-colasty.jpg`,
    images: [
      `${IMG}/device-welcome-colasty.jpg`,
      `${IMG}/colasty-welcome01.png`,
      `${IMG}/colasty-function.jpg`,
      `${IMG}/colasty-feature.jpg`,
    ],
    accentColor: '#7c3aed',
    accentBg: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
    bannerImg: `${IMG}/device-welcome-colasty.jpg`,
    buildHTML: buildColastyHTML,
  },
  {
    name: 'UltraV Cryo Stamp',
    slug: 'device-cryo-stamp',
    description: 'Ionzyme + Hot & Cold combined skin soothing medical device. Maximizes post-treatment calming and high-performance ingredient absorption.',
    thumbnailImg: `${IMG}/welcome-device-cryo.jpg`,
    images: [
      `${IMG}/device-welcome-cryo.jpg`,
      `${IMG}/cryo-zigzag01.jpg`,
      `${IMG}/cryo-feature.jpg`,
      `${IMG}/cryo-effect.jpg`,
    ],
    accentColor: '#0f766e',
    accentBg: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
    bannerImg: `${IMG}/device-welcome-cryo.jpg`,
    buildHTML: buildCryoStampHTML,
  },
]

// ──────────────────────────────────────────
// 메인 실행
// ──────────────────────────────────────────
async function main() {
  console.log('🏥 UltraV Medical Devices 제품 등록 시작...')

  for (const device of devices) {
    // 카테고리 조회
    const category = await prisma.category.findUnique({
      where: { slug: device.slug },
    })

    if (!category) {
      console.error(`❌ 카테고리를 찾을 수 없습니다: ${device.slug}. seed.ts를 먼저 실행해주세요.`)
      process.exit(1)
    }

    // 중복 체크
    const existing = await prisma.product.findFirst({
      where: { name: device.name, categoryId: category.id },
    })

    if (existing) {
      console.log(`⏭️  ${device.name} 제품이 이미 존재합니다 (ID: ${existing.id}). 스킵합니다.`)
      continue
    }

    const product = await prisma.product.create({
      data: {
        name: device.name,
        brand: 'UltraV',
        description: device.description,
        detailContent: device.buildHTML(),
        price: 0,
        discount: 0,
        stock: 100,
        categoryId: category.id,
        imageUrl: device.thumbnailImg,
        images: device.images,
        isActive: true,
      },
    })

    console.log(`✅ ${device.name} 등록 완료 (ID: ${product.id})`)
  }

  console.log('🎉 UltraV Medical Devices 전체 등록 완료!')
}

main()
  .catch((e) => {
    console.error('❌ Medical Devices 등록 실패:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
