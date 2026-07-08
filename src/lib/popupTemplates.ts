// 관리자 팝업 등록 화면 - 상황별 HTML 템플릿 10종
// 규칙: 완전 인라인 스타일(외부 CSS 클래스 의존 금지), 폰트는 상속 사용
// 플레이스홀더는 [ ] 대괄호로 표시하여 관리자가 직접 교체하도록 안내

export interface PopupTemplate {
  key: string;
  name: string;
  description: string;
  width: number;
  height: number;
  html: string;
}

export const popupTemplates: PopupTemplate[] = [
  {
    key: "general-notice",
    name: "일반 공지",
    description: "심플한 텍스트 중심 공지 템플릿입니다.",
    width: 480,
    height: 420,
    html: `<div style="width:100%;height:100%;box-sizing:border-box;background:#ffffff;padding:32px 28px;display:flex;flex-direction:column;">
  <div style="font-size:12px;font-weight:700;color:#2563eb;letter-spacing:0.05em;margin-bottom:12px;">NOTICE</div>
  <h2 style="margin:0 0 16px 0;font-size:20px;font-weight:700;color:#111827;line-height:1.4;">[제목을 입력하세요]</h2>
  <p style="margin:0;font-size:14px;line-height:1.7;color:#4b5563;flex:1;">[내용을 입력하세요. 공지 사항의 상세 내용을 이 영역에 작성합니다.]</p>
  <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;">
    공지일 [YYYY.MM.DD]
  </div>
</div>`,
  },
  {
    key: "urgent-notice",
    name: "긴급 공지",
    description: "상단 붉은 헤더로 경고 톤을 강조하는 긴급 공지 템플릿입니다.",
    width: 480,
    height: 420,
    html: `<div style="width:100%;height:100%;box-sizing:border-box;background:#ffffff;display:flex;flex-direction:column;overflow:hidden;">
  <div style="background:#dc2626;padding:18px 24px;display:flex;align-items:center;gap:8px;">
    <span style="font-size:16px;">⚠️</span>
    <span style="font-size:14px;font-weight:700;color:#ffffff;letter-spacing:0.03em;">긴급 공지</span>
  </div>
  <div style="padding:28px 24px;display:flex;flex-direction:column;flex:1;">
    <h2 style="margin:0 0 14px 0;font-size:19px;font-weight:700;color:#111827;line-height:1.4;">[제목을 입력하세요]</h2>
    <p style="margin:0;font-size:14px;line-height:1.7;color:#4b5563;flex:1;">[내용을 입력하세요. 서비스 장애, 긴급 안내 등 즉시 확인이 필요한 내용을 작성합니다.]</p>
    <div style="margin-top:16px;padding:12px 14px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;font-size:13px;color:#b91c1c;">
      적용 기간: [YYYY.MM.DD] ~ [YYYY.MM.DD]
    </div>
  </div>
</div>`,
  },
  {
    key: "event",
    name: "이벤트 안내",
    description:
      "밝은 그라데이션 헤더와 CTA 버튼이 있는 이벤트 안내 템플릿입니다. CTA 버튼의 이동 경로는 등록 후 링크 URL(또는 href)을 원하는 주소로 수정하세요.",
    width: 500,
    height: 620,
    html: `<div style="width:100%;height:100%;box-sizing:border-box;background:#ffffff;display:flex;flex-direction:column;overflow:hidden;">
  <div style="background:linear-gradient(135deg,#2563eb 0%,#60a5fa 100%);padding:36px 28px;text-align:center;">
    <div style="font-size:12px;font-weight:700;color:#dbeafe;letter-spacing:0.08em;margin-bottom:8px;">EVENT</div>
    <h2 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;line-height:1.4;">[이벤트 제목을 입력하세요]</h2>
  </div>
  <div style="padding:28px;display:flex;flex-direction:column;flex:1;text-align:center;">
    <p style="margin:0 0 24px 0;font-size:14px;line-height:1.7;color:#4b5563;">[내용을 입력하세요. 이벤트 참여 방법과 혜택을 안내합니다.]</p>
    <div style="margin:0 0 24px 0;font-size:13px;color:#6b7280;">
      이벤트 기간 [YYYY.MM.DD] ~ [YYYY.MM.DD]
    </div>
    <a href="#" style="margin-top:auto;display:inline-block;background:#2563eb;color:#ffffff;font-size:14px;font-weight:700;padding:14px 0;border-radius:10px;text-decoration:none;">자세히 보기</a>
  </div>
</div>`,
  },
  {
    key: "discount",
    name: "할인/세일",
    description: "대형 퍼센트 강조 타이포로 세일 소식을 알리는 템플릿입니다.",
    width: 480,
    height: 500,
    html: `<div style="width:100%;height:100%;box-sizing:border-box;background:#ffffff;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 24px;text-align:center;">
  <div style="font-size:13px;font-weight:700;color:#2563eb;letter-spacing:0.08em;margin-bottom:10px;">SPECIAL SALE</div>
  <div style="font-size:64px;font-weight:800;color:#111827;line-height:1;margin-bottom:6px;">
    <span style="color:#2563eb;">[00%]</span> OFF
  </div>
  <h2 style="margin:12px 0 10px 0;font-size:18px;font-weight:700;color:#111827;">[제목을 입력하세요]</h2>
  <p style="margin:0 0 24px 0;font-size:13px;line-height:1.6;color:#6b7280;">[할인 대상 및 상세 내용을 입력하세요]</p>
  <div style="font-size:12px;color:#9ca3af;margin-bottom:20px;">할인 기간 [YYYY.MM.DD] ~ [YYYY.MM.DD]</div>
  <a href="#" style="display:inline-block;width:100%;box-sizing:border-box;background:#2563eb;color:#ffffff;font-size:14px;font-weight:700;padding:14px 0;border-radius:10px;text-decoration:none;">할인 상품 보러가기</a>
</div>`,
  },
  {
    key: "new-product",
    name: "신제품 출시",
    description:
      "제품 이미지 자리와 제품명을 강조하는 신제품 출시 안내 템플릿입니다.",
    width: 480,
    height: 600,
    html: `<div style="width:100%;height:100%;box-sizing:border-box;background:#ffffff;display:flex;flex-direction:column;overflow:hidden;">
  <div style="height:260px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;color:#9ca3af;font-size:13px;">
    [제품 이미지 영역 - 480x260 권장]
  </div>
  <div style="padding:28px;display:flex;flex-direction:column;flex:1;">
    <div style="font-size:12px;font-weight:700;color:#2563eb;letter-spacing:0.08em;margin-bottom:10px;">NEW ARRIVAL</div>
    <h2 style="margin:0 0 12px 0;font-size:21px;font-weight:800;color:#111827;">[제품명을 입력하세요]</h2>
    <p style="margin:0;font-size:14px;line-height:1.7;color:#4b5563;flex:1;">[제품 특징 및 소개 내용을 입력하세요]</p>
    <a href="#" style="margin-top:16px;display:inline-block;text-align:center;background:#111827;color:#ffffff;font-size:14px;font-weight:700;padding:14px 0;border-radius:10px;text-decoration:none;">제품 보러가기</a>
  </div>
</div>`,
  },
  {
    key: "maintenance",
    name: "시스템 점검 안내",
    description: "점검 일시와 영향 범위를 표 형식으로 안내하는 템플릿입니다.",
    width: 480,
    height: 480,
    html: `<div style="width:100%;height:100%;box-sizing:border-box;background:#ffffff;padding:32px 28px;display:flex;flex-direction:column;">
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
    <span style="font-size:16px;">🛠️</span>
    <h2 style="margin:0;font-size:19px;font-weight:700;color:#111827;">시스템 점검 안내</h2>
  </div>
  <p style="margin:0 0 18px 0;font-size:13px;line-height:1.6;color:#4b5563;">더 나은 서비스 제공을 위해 아래와 같이 점검을 진행합니다.</p>
  <table style="width:100%;border-collapse:collapse;font-size:13px;color:#374151;margin-bottom:18px;">
    <tr>
      <td style="padding:10px 12px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:700;width:88px;">점검 일시</td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">[YYYY.MM.DD] 00:00 ~ 06:00</td>
    </tr>
    <tr>
      <td style="padding:10px 12px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:700;">영향 범위</td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">[영향받는 서비스/기능을 입력하세요]</td>
    </tr>
    <tr>
      <td style="padding:10px 12px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:700;">문의</td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">[고객센터 연락처]</td>
    </tr>
  </table>
  <p style="margin:0;font-size:12px;color:#9ca3af;">점검 시간 동안 서비스 이용이 제한될 수 있습니다. 이용에 불편을 드려 죄송합니다.</p>
</div>`,
  },
  {
    key: "shipping",
    name: "배송 안내",
    description: "연휴/휴무 기간 배송 일정을 표로 안내하는 템플릿입니다.",
    width: 480,
    height: 520,
    html: `<div style="width:100%;height:100%;box-sizing:border-box;background:#ffffff;padding:32px 28px;display:flex;flex-direction:column;">
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
    <span style="font-size:16px;">🚚</span>
    <h2 style="margin:0;font-size:19px;font-weight:700;color:#111827;">배송 일정 안내</h2>
  </div>
  <p style="margin:0 0 18px 0;font-size:13px;line-height:1.6;color:#4b5563;">[연휴/휴무명]을 맞아 배송 일정이 아래와 같이 변경됩니다.</p>
  <table style="width:100%;border-collapse:collapse;font-size:13px;color:#374151;margin-bottom:18px;">
    <tr>
      <td style="padding:10px 12px;background:#eff6ff;border:1px solid #dbeafe;font-weight:700;width:110px;">주문 마감</td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">[YYYY.MM.DD] 14:00까지</td>
    </tr>
    <tr>
      <td style="padding:10px 12px;background:#eff6ff;border:1px solid #dbeafe;font-weight:700;">배송 휴무</td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">[YYYY.MM.DD] ~ [YYYY.MM.DD]</td>
    </tr>
    <tr>
      <td style="padding:10px 12px;background:#eff6ff;border:1px solid #dbeafe;font-weight:700;">배송 재개</td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">[YYYY.MM.DD]부터 순차 발송</td>
    </tr>
  </table>
  <p style="margin:0;font-size:12px;color:#9ca3af;">휴무 기간 중 접수된 주문은 순차적으로 처리됩니다. 양해 부탁드립니다.</p>
</div>`,
  },
  {
    key: "coupon",
    name: "회원 혜택/쿠폰",
    description: "점선 테두리 쿠폰 박스 스타일의 회원 혜택 안내 템플릿입니다.",
    width: 420,
    height: 480,
    html: `<div style="width:100%;height:100%;box-sizing:border-box;background:#ffffff;padding:32px 24px;display:flex;flex-direction:column;align-items:center;text-align:center;">
  <div style="font-size:12px;font-weight:700;color:#2563eb;letter-spacing:0.08em;margin-bottom:10px;">MEMBER BENEFIT</div>
  <h2 style="margin:0 0 20px 0;font-size:18px;font-weight:700;color:#111827;">[제목을 입력하세요]</h2>
  <div style="width:100%;border:2px dashed #93c5fd;border-radius:12px;padding:22px 16px;background:#eff6ff;margin-bottom:20px;">
    <div style="font-size:12px;color:#2563eb;font-weight:700;margin-bottom:6px;">쿠폰 코드</div>
    <div style="font-size:24px;font-weight:800;color:#111827;letter-spacing:0.05em;">[COUPON-CODE]</div>
    <div style="font-size:12px;color:#6b7280;margin-top:8px;">[할인 내용을 입력하세요 (예: 10% 할인)]</div>
  </div>
  <p style="margin:0 0 20px 0;font-size:12px;color:#9ca3af;">사용 기간 [YYYY.MM.DD] ~ [YYYY.MM.DD]</p>
  <a href="#" style="display:inline-block;width:100%;box-sizing:border-box;background:#2563eb;color:#ffffff;font-size:14px;font-weight:700;padding:14px 0;border-radius:10px;text-decoration:none;">쿠폰 사용하러 가기</a>
</div>`,
  },
  {
    key: "survey",
    name: "설문/피드백 요청",
    description:
      "부드러운 톤과 참여 버튼으로 설문 참여를 유도하는 템플릿입니다.",
    width: 420,
    height: 420,
    html: `<div style="width:100%;height:100%;box-sizing:border-box;background:#f9fafb;padding:32px 26px;display:flex;flex-direction:column;align-items:center;text-align:center;border-radius:16px;">
  <div style="font-size:28px;margin-bottom:12px;">💬</div>
  <h2 style="margin:0 0 12px 0;font-size:18px;font-weight:700;color:#111827;">[제목을 입력하세요]</h2>
  <p style="margin:0 0 24px 0;font-size:13px;line-height:1.7;color:#6b7280;flex:1;">[내용을 입력하세요. 소중한 의견을 들려주시면 서비스 개선에 반영하겠습니다.]</p>
  <a href="#" style="display:inline-block;width:100%;box-sizing:border-box;background:#2563eb;color:#ffffff;font-size:14px;font-weight:700;padding:14px 0;border-radius:10px;text-decoration:none;margin-bottom:10px;">설문 참여하기</a>
  <div style="font-size:11px;color:#9ca3af;">참여 기간 [YYYY.MM.DD] ~ [YYYY.MM.DD]</div>
</div>`,
  },
  {
    key: "season-greeting",
    name: "시즌 인사",
    description: "설/추석/연말 등 시즌 인사말을 위한 차분한 톤의 템플릿입니다.",
    width: 480,
    height: 560,
    html: `<div style="width:100%;height:100%;box-sizing:border-box;background:#fafaf9;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 32px;text-align:center;border:1px solid #f0ede8;">
  <div style="font-size:12px;font-weight:700;color:#2563eb;letter-spacing:0.1em;margin-bottom:16px;">[시즌 명을 입력하세요 (예: 설 연휴)]</div>
  <h2 style="margin:0 0 18px 0;font-size:22px;font-weight:800;color:#111827;line-height:1.5;">[인사말 제목을 입력하세요]</h2>
  <p style="margin:0 0 28px 0;font-size:14px;line-height:1.8;color:#57534e;">[내용을 입력하세요. 고객에게 전하는 따뜻한 인사말을 작성합니다.]</p>
  <div style="width:40px;height:2px;background:#2563eb;margin-bottom:20px;"></div>
  <div style="font-size:12px;color:#a8a29e;">[회사명/팀명] 드림</div>
</div>`,
  },
];
