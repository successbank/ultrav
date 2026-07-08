import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const IMG = 'https://www.ultrav.co.kr/images/sub'

// 공통 이미지
const sharedImages = {
  welcome: `${IMG}/welcome-lifting-threads.jpg`,
  // 소재 비교
  comparison01: `${IMG}/threads-comparison01.jpg`,
  comparison02: `${IMG}/threads-comparison02.jpg`,
  comparison03: `${IMG}/threads-comparison03.jpg`,
  comparison04: `${IMG}/threads-comparison04.jpg`,
  // Skin Tightening 변형 (제품 사진)
  skinTightening01: `${IMG}/skin-tightening01.jpg`,
  skinTightening02: `${IMG}/skin-tightening02.jpg`,
  skinTightening03: `${IMG}/skin-tightening03.jpg`,
  skinTightening04: `${IMG}/skin-tightening04.jpg`,
  skinTightening05: `${IMG}/skin-tightening05.jpg`,
  // Skin Tightening 다이어그램
  threadTightening01: `${IMG}/thread-tightening01.jpg`,
  threadTightening02: `${IMG}/thread-tightening02.jpg`,
  threadTightening03: `${IMG}/thread-tightening03.jpg`,
  threadTightening04: `${IMG}/thread-tightening04.jpg`,
  // Mechanical Lifting 변형 (제품 사진)
  mechanicalLifting01: `${IMG}/mechanical-lifting01.jpg`,
  mechanicalLifting02: `${IMG}/mechanical-lifting02.jpg`,
  mechanicalLifting03: `${IMG}/mechanical-lifting03.jpg`,
  mechanicalLifting04: `${IMG}/mechanical-lifting04.jpg`,
  mechanicalLifting05: `${IMG}/mechanical-lifting05.jpg`,
  // Mechanical Lifting 다이어그램
  threadMechanical01: `${IMG}/thread-mechanical01.jpg`,
  threadMechanical02: `${IMG}/thread-mechanical02.jpg`,
  threadMechanical03: `${IMG}/thread-mechanical03.jpg`,
  threadMechanical04: `${IMG}/thread-mechanical04.jpg`,
  threadMechanical05: `${IMG}/thread-mechanical05.jpg`,
  // Special Area
  liftingSpecial01: `${IMG}/lifting-special01.jpg`,
  liftingSpecial02: `${IMG}/lifting-special02.jpg`,
  liftingSpecial03: `${IMG}/lifting-special03.jpg`,
  threadSpecial01: `${IMG}/thread-special01.jpg`,
  threadSpecial02: `${IMG}/thread-special02.jpg`,
  threadSpecial03: `${IMG}/thread-special03.jpg`,
  // Thread Type 구성
  typeL: `${IMG}/thread-type-l.jpg`,
  typeW: `${IMG}/thread-type-w.jpg`,
  typeA: `${IMG}/thread-type-a.jpg`,
}

// ──────────────────────────────────────────
// 공통 HTML 섹션 생성 함수
// ──────────────────────────────────────────
function buildVariantsSection() {
  return `
  <!-- Skin Tightening Variants -->
  <div style="margin-bottom: 40px;">
    <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 8px; color: #1e293b;">Skin Tightening</h2>
    <p style="color: #6b7280; margin-bottom: 20px;">피부 타이트닝 및 탄력 개선을 위한 실 라인업</p>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
      <div style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
        <img src="${sharedImages.skinTightening01}" alt="Mono" style="width: 100%; aspect-ratio: 4/3; object-fit: cover;" />
        <div style="padding: 16px;">
          <h3 style="font-weight: 700; font-size: 1.05rem; margin-bottom: 6px;">Mono</h3>
          <p style="font-size: 0.9rem; color: #6b7280;">Basic & Flat 디자인. 다양한 사이즈 사양으로 비용 효율적인 기본 시술</p>
        </div>
      </div>
      <div style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
        <img src="${sharedImages.skinTightening02}" alt="Tornado" style="width: 100%; aspect-ratio: 4/3; object-fit: cover;" />
        <div style="padding: 16px;">
          <h3 style="font-weight: 700; font-size: 1.05rem; margin-bottom: 6px;">Tornado</h3>
          <p style="font-size: 0.9rem; color: #6b7280;">Screw 패턴으로 넓은 표면적에 효과적. 콜라겐 생성 촉진</p>
        </div>
      </div>
      <div style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
        <img src="${sharedImages.skinTightening03}" alt="Double Twist" style="width: 100%; aspect-ratio: 4/3; object-fit: cover;" />
        <div style="padding: 16px;">
          <h3 style="font-weight: 700; font-size: 1.05rem; margin-bottom: 6px;">Double Twist</h3>
          <p style="font-size: 0.9rem; color: #6b7280;">2중 꼬임(Twisted 2 Lines) 구조로 넓은 면적 타이트닝에 최적화</p>
        </div>
      </div>
      <div style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
        <img src="${sharedImages.skinTightening04}" alt="Super Tornado" style="width: 100%; aspect-ratio: 4/3; object-fit: cover;" />
        <div style="padding: 16px;">
          <h3 style="font-weight: 700; font-size: 1.05rem; margin-bottom: 6px;">Super Tornado</h3>
          <p style="font-size: 0.9rem; color: #6b7280;">4중 스크류(Screw 4 Lines) 구조. 눈 밑 지방 돌출 및 처짐 개선에 효과적</p>
        </div>
      </div>
      <div style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; grid-column: 1 / -1;">
        <div style="display: flex;">
          <img src="${sharedImages.skinTightening05}" alt="Inch" style="width: 50%; aspect-ratio: 4/3; object-fit: cover;" />
          <div style="padding: 20px; display: flex; flex-direction: column; justify-content: center;">
            <h3 style="font-weight: 700; font-size: 1.05rem; margin-bottom: 6px;">Inch</h3>
            <p style="font-size: 0.9rem; color: #6b7280;">Short & Thin 설계. 눈가 주름 및 혈액순환 개선에 특화된 미세 실</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Mechanical Lifting Variants -->
  <div style="margin-bottom: 40px;">
    <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 8px; color: #1e293b;">Mechanical Lifting</h2>
    <p style="color: #6b7280; margin-bottom: 20px;">물리적 리프팅 및 윤곽 개선을 위한 코그 실 라인업</p>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
      <div style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
        <img src="${sharedImages.mechanicalLifting01}" alt="Cog" style="width: 100%; aspect-ratio: 4/3; object-fit: cover;" />
        <div style="padding: 16px;">
          <h3 style="font-weight: 700; font-size: 1.05rem; margin-bottom: 6px;">Cog</h3>
          <p style="font-size: 0.9rem; color: #6b7280;">Cutting Cog 방식. 하악 아치 및 이중턱의 기본 리프팅과 윤곽 성형</p>
        </div>
      </div>
      <div style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
        <img src="${sharedImages.mechanicalLifting02}" alt="Molding Cog" style="width: 100%; aspect-ratio: 4/3; object-fit: cover;" />
        <div style="padding: 16px;">
          <h3 style="font-weight: 700; font-size: 1.05rem; margin-bottom: 6px;">Molding Cog</h3>
          <p style="font-size: 0.9rem; color: #6b7280;">Rose Thorn 패턴. 전체적인 얼굴 리프팅 및 윤곽 성형에 탁월</p>
        </div>
      </div>
      <div style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
        <img src="${sharedImages.mechanicalLifting03}" alt="Emboss Mold" style="width: 100%; aspect-ratio: 4/3; object-fit: cover;" />
        <div style="padding: 16px;">
          <h3 style="font-weight: 700; font-size: 1.05rem; margin-bottom: 6px;">Emboss Mold</h3>
          <p style="font-size: 0.9rem; color: #6b7280;">Rectangle 형태의 비가열 프레스 몰드. 윤곽 리프팅에 특화</p>
        </div>
      </div>
      <div style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
        <img src="${sharedImages.mechanicalLifting04}" alt="Super Emboss Mold" style="width: 100%; aspect-ratio: 4/3; object-fit: cover;" />
        <div style="padding: 16px;">
          <h3 style="font-weight: 700; font-size: 1.05rem; margin-bottom: 6px;">Super Emboss Mold</h3>
          <p style="font-size: 0.9rem; color: #6b7280;">Anchor 타입 비가열 프레스 몰드. 높은 고정력으로 강력한 리프팅</p>
        </div>
      </div>
      <div style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; grid-column: 1 / -1;">
        <div style="display: flex;">
          <img src="${sharedImages.mechanicalLifting05}" alt="Double Mold" style="width: 50%; aspect-ratio: 4/3; object-fit: cover;" />
          <div style="padding: 20px; display: flex; flex-direction: column; justify-content: center;">
            <h3 style="font-weight: 700; font-size: 1.05rem; margin-bottom: 6px;">Double Mold</h3>
            <p style="font-size: 0.9rem; color: #6b7280;">Arrow Head + Rectangle 이중 구조. 최대 인장강도로 극대화된 리프팅 효과</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Special Area Variants -->
  <div style="margin-bottom: 40px;">
    <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 8px; color: #1e293b;">Special Area</h2>
    <p style="color: #6b7280; margin-bottom: 20px;">특수 부위 전용 실 라인업</p>
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
      <div style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
        <img src="${sharedImages.liftingSpecial01}" alt="Hiko" style="width: 100%; aspect-ratio: 1; object-fit: cover;" />
        <div style="padding: 14px;">
          <h3 style="font-weight: 700; margin-bottom: 4px;">Hiko</h3>
          <p style="font-size: 0.85rem; color: #6b7280;">Flat 디자인. 코 브릿지 및 코끝의 코 윤곽 성형 전용</p>
        </div>
      </div>
      <div style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
        <img src="${sharedImages.liftingSpecial02}" alt="Octo Twist" style="width: 100%; aspect-ratio: 1; object-fit: cover;" />
        <div style="padding: 14px;">
          <h3 style="font-weight: 700; margin-bottom: 4px;">Octo Twist</h3>
          <p style="font-size: 0.85rem; color: #6b7280;">8중 꼬임(Twisted 8 braids). 깊은 주름을 채우는 필러 실</p>
        </div>
      </div>
      <div style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
        <img src="${sharedImages.liftingSpecial03}" alt="Double Cog" style="width: 100%; aspect-ratio: 1; object-fit: cover;" />
        <div style="padding: 14px;">
          <h3 style="font-weight: 700; margin-bottom: 4px;">Double Cog</h3>
          <p style="font-size: 0.85rem; color: #6b7280;">Folded Cutting Cog. 폭시아이(Foxy Eye) 시술 전용 실</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Thread Configurations -->
  <div style="margin-bottom: 40px;">
    <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 8px; color: #1e293b;">Thread Configurations</h2>
    <p style="color: #6b7280; margin-bottom: 20px;">코그 실 배열 방식</p>
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
      <div style="text-align: center; padding: 16px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <img src="${sharedImages.typeL}" alt="L Type" style="width: 100%; border-radius: 6px; margin-bottom: 10px;" />
        <p style="font-weight: 600;">L Type</p>
      </div>
      <div style="text-align: center; padding: 16px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <img src="${sharedImages.typeW}" alt="W Type" style="width: 100%; border-radius: 6px; margin-bottom: 10px;" />
        <p style="font-weight: 600;">W Type</p>
      </div>
      <div style="text-align: center; padding: 16px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <img src="${sharedImages.typeA}" alt="A Type" style="width: 100%; border-radius: 6px; margin-bottom: 10px;" />
        <p style="font-weight: 600;">A Type</p>
      </div>
    </div>
  </div>`
}

// ──────────────────────────────────────────
// 소재별 상세 HTML 생성
// ──────────────────────────────────────────

interface MaterialInfo {
  name: string
  fullName: string
  slug: string
  biodegradation: string
  flexibility: string
  discomfort: string
  hydrolyticResolution: string
  safety: string
  accentColor: string
  accentBg: string
  accentBorder: string
  thumbnailImg: string
  description: string
  overview: string
  features: { title: string; desc: string; color: string; borderColor: string }[]
}

const materials: MaterialInfo[] = [
  {
    name: 'PDO',
    fullName: 'Polydioxanone',
    slug: 'thread-pdo',
    biodegradation: '6 ~ 8개월',
    flexibility: 'Middle (중간)',
    discomfort: 'Slight (미약)',
    hydrolyticResolution: 'Middle (중간)',
    safety: 'High (높음)',
    accentColor: '#0369a1',
    accentBg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    accentBorder: '#7dd3fc',
    thumbnailImg: `${IMG}/threads-comparison01.jpg`,
    description: 'PDO(Polydioxanone) 흡수성 리프팅 실 – 6~8개월 생분해, KFDA 인증 최고 안전등급',
    overview: 'PDO(Polydioxanone)는 의료용 봉합사에 가장 널리 사용되는 생체적합성 고분자입니다. 체내에서 가수분해를 통해 6~8개월에 걸쳐 안전하게 분해되며, 분해 과정에서 섬유아세포를 자극하여 자연적인 콜라겐 합성을 촉진합니다. UltraV의 PDO 리프팅 실은 KFDA 최고 안전등급 인증을 받은 제품으로, 스킨 타이트닝부터 메커니컬 리프팅까지 다양한 시술에 활용됩니다.',
    features: [
      { title: '검증된 안전성', desc: 'KFDA 최고 안전등급 인증. 수십 년간 의료용 봉합사로 사용된 검증된 소재', color: '#166534', borderColor: '#22c55e' },
      { title: '자연스러운 결과', desc: '6~8개월 생분해 기간 동안 점진적 콜라겐 생성으로 자연스러운 개선', color: '#1e40af', borderColor: '#3b82f6' },
      { title: '비용 효율적', desc: '가장 기본적이고 널리 사용되는 소재로 합리적인 가격대', color: '#7e22ce', borderColor: '#a855f7' },
      { title: '다양한 라인업', desc: 'Mono, Cog, Molding Cog 등 13종의 실 형태로 모든 시술 영역 커버', color: '#c2410c', borderColor: '#f97316' },
    ],
  },
  {
    name: 'PCL',
    fullName: 'Polycaprolactone',
    slug: 'thread-pcl',
    biodegradation: '16 ~ 24개월',
    flexibility: 'High (높음)',
    discomfort: 'Minimal (최소)',
    hydrolyticResolution: 'High (높음)',
    safety: 'High (높음)',
    accentColor: '#059669',
    accentBg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
    accentBorder: '#6ee7b7',
    thumbnailImg: `${IMG}/threads-comparison04.jpg`,
    description: 'PCL(Polycaprolactone) 흡수성 리프팅 실 – 16~24개월 장기 지속, 최고 유연성',
    overview: 'PCL(Polycaprolactone)은 4가지 리프팅 실 소재 중 가장 긴 생분해 기간(16~24개월)과 가장 높은 유연성을 자랑하는 프리미엄 소재입니다. 높은 가수분해 해상도로 체내에서 균일하게 분해되며, 시술 시 불편감이 최소화됩니다. 장기간 콜라겐 자극 효과로 오래 지속되는 리프팅과 볼륨 개선을 원하는 환자에게 최적입니다.',
    features: [
      { title: '최장 지속 효과', desc: '16~24개월의 가장 긴 생분해 기간으로 오래 지속되는 리프팅 효과', color: '#166534', borderColor: '#22c55e' },
      { title: '최고 유연성', desc: '4가지 소재 중 가장 높은 유연성으로 자연스러운 표정 유지', color: '#1e40af', borderColor: '#3b82f6' },
      { title: '최소 불편감', desc: '시술 시 불편감이 가장 적어 환자 만족도 극대화', color: '#7e22ce', borderColor: '#a855f7' },
      { title: '프리미엄 결과', desc: '장기간 콜라겐 자극으로 점진적이고 자연스러운 피부 개선', color: '#c2410c', borderColor: '#f97316' },
    ],
  },
  {
    name: 'PLLA',
    fullName: 'Poly-L-Lactic Acid',
    slug: 'thread-plla',
    biodegradation: '14 ~ 18개월',
    flexibility: 'Low (낮음)',
    discomfort: 'A lot (다소 있음)',
    hydrolyticResolution: 'Middle (중간)',
    safety: 'High (높음)',
    accentColor: '#be185d',
    accentBg: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
    accentBorder: '#f9a8d4',
    thumbnailImg: `${IMG}/threads-comparison02.jpg`,
    description: 'PLLA(Poly-L-Lactic Acid) 흡수성 리프팅 실 – 14~18개월 지속, 강력한 콜라겐 자극',
    overview: 'PLLA(Poly-L-Lactic Acid)는 강력한 콜라겐 생성 촉진 효과로 주목받는 소재입니다. 14~18개월의 긴 생분해 기간 동안 진피층의 섬유아세포를 강하게 자극하여 고밀도 콜라겐 매트릭스를 형성합니다. 유연성은 낮지만 그만큼 강한 물리적 지지력을 제공하여, 탄력이 크게 저하된 피부의 리프팅에 효과적입니다.',
    features: [
      { title: '강력한 콜라겐 자극', desc: '강한 조직 반응으로 고밀도 콜라겐 매트릭스 형성 촉진', color: '#166534', borderColor: '#22c55e' },
      { title: '높은 지지력', desc: '낮은 유연성이 오히려 강한 물리적 지지력으로 작용하여 확실한 리프팅', color: '#1e40af', borderColor: '#3b82f6' },
      { title: '장기 지속', desc: '14~18개월 생분해 기간으로 PDO 대비 약 2배 긴 효과 유지', color: '#7e22ce', borderColor: '#a855f7' },
      { title: '탄력 회복', desc: '심한 피부 처짐 및 탄력 저하 환자에게 탁월한 개선 효과', color: '#c2410c', borderColor: '#f97316' },
    ],
  },
  {
    name: 'PLCL',
    fullName: 'Poly L-Lactide-Co-Caprolactone (Hybrid)',
    slug: 'thread-plcl',
    biodegradation: '12 ~ 18개월',
    flexibility: 'Middle (중간)',
    discomfort: 'Slight (미약)',
    hydrolyticResolution: 'High (높음)',
    safety: 'High (높음)',
    accentColor: '#7c3aed',
    accentBg: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
    accentBorder: '#c4b5fd',
    thumbnailImg: `${IMG}/threads-comparison03.jpg`,
    description: 'PLCL(Hybrid) 흡수성 리프팅 실 – PLA+PCL 하이브리드, 12~18개월 지속, 균형잡힌 성능',
    overview: 'PLCL은 PLA(Polylactic Acid)와 PCL(Polycaprolactone)을 결합한 하이브리드 소재입니다. 두 소재의 장점을 모두 갖추어 중간 수준의 유연성과 미약한 불편감, 높은 가수분해 해상도를 제공합니다. 12~18개월의 생분해 기간으로 PLLA에 가까운 지속력과 PCL에 가까운 편안함을 동시에 제공하는 밸런스형 소재입니다.',
    features: [
      { title: '하이브리드 장점', desc: 'PLA의 강한 콜라겐 자극 + PCL의 높은 유연성을 결합한 최적 밸런스', color: '#166534', borderColor: '#22c55e' },
      { title: '균형잡힌 편안함', desc: '시술 시 불편감이 미약하면서도 효과적인 리프팅 성능 제공', color: '#1e40af', borderColor: '#3b82f6' },
      { title: '높은 가수분해 해상도', desc: '체내에서 균일하고 안전하게 분해되는 우수한 생체적합성', color: '#7e22ce', borderColor: '#a855f7' },
      { title: '다목적 활용', desc: '유연성과 지지력의 균형으로 다양한 시술 부위에 범용 적용 가능', color: '#c2410c', borderColor: '#f97316' },
    ],
  },
]

function buildDetailHTML(mat: MaterialInfo): string {
  const variantsSection = buildVariantsSection()

  return `
<div style="max-width: 900px; margin: 0 auto; font-family: 'Pretendard', sans-serif; color: #1a1a1a;">
  <!-- 제품 헤더 -->
  <div style="text-align: center; padding: 40px 0; border-bottom: 2px solid #e5e7eb;">
    <h1 style="font-size: 2.5rem; font-weight: 800; color: #111; margin-bottom: 8px;">UltraV ${mat.name} Lifting Thread</h1>
    <p style="font-size: 1.1rem; color: #6b7280;">${mat.fullName} | Absorbable Surgical Suture</p>
  </div>

  <!-- 제품 배너 이미지 -->
  <div style="text-align: center; padding: 40px 0;">
    <img src="${sharedImages.welcome}" alt="UltraV Lifting Threads" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" />
  </div>

  <!-- 제품 개요 -->
  <div style="padding: 30px; background: ${mat.accentBg}; border-radius: 12px; margin-bottom: 30px;">
    <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 16px; color: ${mat.accentColor};">제품 개요</h2>
    <p style="line-height: 1.8; color: #374151;">${mat.overview}</p>
  </div>

  <!-- 소재 특성 테이블 -->
  <div style="margin-bottom: 30px;">
    <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 16px;">소재 특성</h2>
    <table style="width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden;">
      <tbody>
        <tr style="background: #f8fafc;">
          <td style="padding: 14px 20px; font-weight: 600; border-bottom: 1px solid #e2e8f0; width: 35%; color: #475569;">소재명</td>
          <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0;"><strong>${mat.name}</strong> (${mat.fullName})</td>
        </tr>
        <tr>
          <td style="padding: 14px 20px; font-weight: 600; border-bottom: 1px solid #e2e8f0; color: #475569;">생분해 기간</td>
          <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: ${mat.accentColor};">${mat.biodegradation}</td>
        </tr>
        <tr style="background: #f8fafc;">
          <td style="padding: 14px 20px; font-weight: 600; border-bottom: 1px solid #e2e8f0; color: #475569;">유연성 (Flexibility)</td>
          <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">${mat.flexibility}</td>
        </tr>
        <tr>
          <td style="padding: 14px 20px; font-weight: 600; border-bottom: 1px solid #e2e8f0; color: #475569;">시술 불편감</td>
          <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">${mat.discomfort}</td>
        </tr>
        <tr style="background: #f8fafc;">
          <td style="padding: 14px 20px; font-weight: 600; border-bottom: 1px solid #e2e8f0; color: #475569;">가수분해 해상도</td>
          <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">${mat.hydrolyticResolution}</td>
        </tr>
        <tr>
          <td style="padding: 14px 20px; font-weight: 600; color: #475569;">안전성</td>
          <td style="padding: 14px 20px; font-weight: 600; color: #059669;">${mat.safety} — KFDA 인증</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 소재 비교 이미지 -->
  <div style="text-align: center; margin-bottom: 30px;">
    <img src="${mat.thumbnailImg}" alt="${mat.name} Thread" style="max-width: 100%; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);" />
  </div>

  <!-- 특장점 -->
  <div style="margin-bottom: 40px;">
    <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 16px;">특장점</h2>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
      ${mat.features.map(f => `
      <div style="padding: 20px; background: #fafafa; border-radius: 8px; border-left: 4px solid ${f.borderColor};">
        <h3 style="font-weight: 600; margin-bottom: 8px; color: ${f.color};">${f.title}</h3>
        <p style="font-size: 0.95rem; color: #374151;">${f.desc}</p>
      </div>`).join('')}
    </div>
  </div>

  <!-- 4소재 비교 -->
  <div style="margin-bottom: 40px; padding: 24px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
    <h2 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 16px; color: #334155;">소재 비교</h2>
    <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
      <thead>
        <tr style="border-bottom: 2px solid #cbd5e1;">
          <th style="padding: 10px 8px; text-align: left; color: #64748b;">소재</th>
          <th style="padding: 10px 8px; text-align: center; color: #64748b;">생분해</th>
          <th style="padding: 10px 8px; text-align: center; color: #64748b;">유연성</th>
          <th style="padding: 10px 8px; text-align: center; color: #64748b;">불편감</th>
        </tr>
      </thead>
      <tbody>
        <tr style="${mat.name === 'PDO' ? 'background: #dbeafe; font-weight: 600;' : ''} border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 8px;">PDO</td>
          <td style="padding: 10px 8px; text-align: center;">6-8개월</td>
          <td style="padding: 10px 8px; text-align: center;">중간</td>
          <td style="padding: 10px 8px; text-align: center;">미약</td>
        </tr>
        <tr style="${mat.name === 'PLLA' ? 'background: #fce7f3; font-weight: 600;' : ''} border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 8px;">PLLA</td>
          <td style="padding: 10px 8px; text-align: center;">14-18개월</td>
          <td style="padding: 10px 8px; text-align: center;">낮음</td>
          <td style="padding: 10px 8px; text-align: center;">다소 있음</td>
        </tr>
        <tr style="${mat.name === 'PLCL' ? 'background: #ede9fe; font-weight: 600;' : ''} border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 8px;">PLCL</td>
          <td style="padding: 10px 8px; text-align: center;">12-18개월</td>
          <td style="padding: 10px 8px; text-align: center;">중간</td>
          <td style="padding: 10px 8px; text-align: center;">미약</td>
        </tr>
        <tr style="${mat.name === 'PCL' ? 'background: #d1fae5; font-weight: 600;' : ''}">
          <td style="padding: 10px 8px;">PCL</td>
          <td style="padding: 10px 8px; text-align: center;">16-24개월</td>
          <td style="padding: 10px 8px; text-align: center;">높음</td>
          <td style="padding: 10px 8px; text-align: center;">최소</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 실 라인업 -->
  ${variantsSection}

  <!-- 안내 -->
  <div style="padding: 20px; background: #f1f5f9; border-radius: 8px; text-align: center; color: #64748b; font-size: 0.9rem;">
    <p>본 제품은 KFDA 인증 의료기기로, 전문 의료기관에서 의료진에 의해 시술되어야 합니다.</p>
    <p style="margin-top: 4px;">가격 및 구매 관련 문의는 영업팀에 연락해주세요.</p>
  </div>
</div>`
}

// ──────────────────────────────────────────
// 메인 실행
// ──────────────────────────────────────────
async function main() {
  console.log('🧵 UltraV Lifting Threads 제품 등록 시작...')

  for (const mat of materials) {
    // 카테고리 조회
    const category = await prisma.category.findUnique({
      where: { slug: mat.slug },
    })

    if (!category) {
      console.error(`❌ 카테고리를 찾을 수 없습니다: ${mat.slug}. seed.ts를 먼저 실행해주세요.`)
      process.exit(1)
    }

    // 중복 체크
    const existing = await prisma.product.findFirst({
      where: { name: `UltraV ${mat.name} Lifting Thread`, categoryId: category.id },
    })

    if (existing) {
      console.log(`⏭️  ${mat.name} 제품이 이미 존재합니다 (ID: ${existing.id}). 스킵합니다.`)
      continue
    }

    const product = await prisma.product.create({
      data: {
        name: `UltraV ${mat.name} Lifting Thread`,
        brand: 'UltraV',
        description: mat.description,
        detailContent: buildDetailHTML(mat),
        price: 0,
        discount: 0,
        stock: 100,
        categoryId: category.id,
        imageUrl: mat.thumbnailImg,
        images: [
          sharedImages.welcome,
          sharedImages.comparison01,
          sharedImages.comparison02,
          sharedImages.comparison03,
          sharedImages.comparison04,
        ],
        isActive: true,
      },
    })

    console.log(`✅ ${mat.name} Lifting Thread 등록 완료 (ID: ${product.id})`)
  }

  console.log('🎉 UltraV Lifting Threads 전체 등록 완료!')
}

main()
  .catch((e) => {
    console.error('❌ Lifting Threads 등록 실패:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
