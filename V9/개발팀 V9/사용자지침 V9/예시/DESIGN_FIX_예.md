TYPE: DESIGN_FIX
SCOPE: web
PRIORITY: P2
TARGET_DATE: 2026-06-10

## 1. 대상
Figma > "Dashboard / KPI Card"

## 2. 변경
- 패딩 16→20
- 보조 텍스트 토큰 text/muted → text/secondary
- 호버 시 elevation +1

## 3. 사유
디자인 시스템 v2 정합성 감사(21건 불일치).

## 4. 영향
- 같은 컴포넌트 8개 화면
- 토큰 변경 영향 17개 화면

## 5. 비고정
그림자 색상 디자이너 재량.

## 6. 요청
- [x] diff 시안
- [x] 영향 화면 PR 분기
- [x] Chromatic 갱신
