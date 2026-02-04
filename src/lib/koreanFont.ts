// 한글 폰트 지원을 위한 파일
// jsPDF v3.x에서 한글을 표시하기 위해 사용

import { jsPDF } from "jspdf"

// 나눔고딕 폰트를 jsPDF에 추가하는 함수
// 실제 프로덕션에서는 전체 폰트 파일이 필요합니다
// 현재는 플레이스홀더로 표시하며, 실제 구현 시 아래 방법 중 하나를 선택해야 합니다:
//
// 방법 1: 폰트 파일을 Base64로 변환하여 추가
// 방법 2: Google Fonts API 사용
// 방법 3: 서버 사이드에서 PDF 생성 (권장)
//
// 현재는 임시 해결책으로 한글을 로마자로 변환하는 함수를 제공합니다

export function setupKoreanFont(doc: jsPDF): jsPDF {
  // 현재 jsPDF는 한글을 기본적으로 지원하지 않습니다
  // 실제 프로덕션 환경에서는 다음 중 하나를 선택해야 합니다:
  //
  // 1. 서버 사이드에서 PDF 생성 (Node.js + Puppeteer)
  // 2. 한글 폰트 파일을 Base64로 인코딩하여 추가 (파일 크기 2-3MB)
  // 3. 영문 레이블만 사용하고 한글 데이터는 최소화

  return doc
}

// 한글을 로마자로 변환 (임시 해결책)
export function romanizeKorean(text: string): string {
  // 간단한 한글 -> 로마자 변환
  // 완벽하지 않지만 읽을 수 있는 형태로 변환
  const koreanToRoman: { [key: string]: string } = {
    '가': 'ga', '나': 'na', '다': 'da', '라': 'ra', '마': 'ma',
    '바': 'ba', '사': 'sa', '아': 'a', '자': 'ja', '차': 'cha',
    '카': 'ka', '타': 'ta', '파': 'pa', '하': 'ha',
    '고객': 'Customer', '이름': 'Name', '전화번호': 'Phone',
    '주소': 'Address', '영업매니저': 'Sales Manager',
    '제품': 'Product', '수량': 'Qty', '원가': 'Original Price',
    '견적가': 'Quoted Price', '합계': 'Total', '메모': 'Notes',
    '원가 총액': 'Original Amount', '할인 금액': 'Discount',
    '견적 총액': 'Total Amount', '유효기간': 'Valid Until'
  }

  let result = text
  for (const [korean, roman] of Object.entries(koreanToRoman)) {
    result = result.replace(new RegExp(korean, 'g'), roman)
  }

  return result
}
