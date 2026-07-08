---
description: 신규 기능 개발 — T2 FEATURE 템플릿으로 요구사항 구조화 후 PM팀 절차(기획설계→디자인→개발1팀→일관성 검토→QA)로 개발
argument-hint: <기능 설명 (예: 상품 상세에 관련 상품 추천 섹션 추가)>
---

# /feature — 신규 기능 개발 (T2 FEATURE)

사용자 요청: $ARGUMENTS

너는 Ultra 프로젝트의 신규 기능 개발 절차를 수행한다. 팀 정본은 `.claude/personas/`. **각 단계마다 담당 페르소나를 노출하며 진행하라.**

## 1단계: [PM팀·서민지] 접수 및 T2 문서 작성

$ARGUMENTS 를 아래 T2 FEATURE 구조로 정리해 출력하라. 요청문에서 채울 수 없는 섹션은 합리적으로 제안하되 `(제안)` 표시를 붙이고, 구현 방향이 갈리는 핵심 공백(예: 데이터 모델 변화 여부, 권한 범위)만 사용자에게 1~3개 질문한다.

```
TYPE: FEATURE
SCOPE: web
PRIORITY: <P0|P1|P2|P3 — 기본 P1>
TARGET_DATE: <YYYY-MM-DD | ASAP | unscheduled>

## 1. 기능 한 줄
## 2. 시작·끝 (트리거/종료 상태)
## 3. UX 흐름 (실패 분기 포함)
## 4. 데이터 모델 변화 (마이그레이션 필요?)
## 5. API/인터페이스 변화 (권한·rate limit)
## 6. 테스트 케이스 (정상/엣지/실패 ≥5)
## 7. 의존성·영향 파일
## 8. 골든 케이스 후보
## 9. 완료 정의 (DoD)
```

머리말은 위 4필드만 사용한다 (TOOL_PREF 필드 금지).

## 2단계: [기획설계팀] 요구사항·설계 확정

T2 문서 기반으로:
- 관련 기존 코드 탐색 (`src/app/`, `src/lib/`, `src/prisma/schema.prisma`, 관련 API 라우트)
- 섹션 4(데이터 모델)·5(API)를 실제 코드 기준으로 구체화 — Prisma 모델명/필드, API 경로/메서드/권한(USER/HOSPITAL/SALES_MANAGER/ADMIN)
- 섹션 7(영향 파일)을 실제 파일 절대경로로 확정

## 3단계: [디자인팀] UI/UX 설계 (화면 변경이 있는 경우만)

- 기존 컴포넌트(`src/components/ui/*`, shadcn/ui 패턴) 재사용 우선
- Tailwind 토큰·기존 레이아웃 패턴과의 일관성 확인
- UX 흐름(섹션 3)의 실패 분기(로딩/에러/빈 상태) 처리 방안 명시

## 4단계: [개발1팀] 구현

- 신규 기능이므로 개발1팀 주관 (관리자 페이지 관련이면 개발2팀으로 전환)
- Ultra 규칙: Docker 전용(`docker exec ultra_app ...`), 호스트 `npm run dev` 금지, DB 호스트는 `database:5432`
- Prisma 스키마 변경 시: 컨테이너 내 `npx prisma generate && npx prisma db push`
- NextAuth: 서버 컴포넌트/API는 `src/lib/auth.ts`, middleware는 `src/lib/auth.config.ts`만 사용 (Edge에 Prisma/bcrypt import 금지)

## 5단계: [PM팀] 일관성 검토 (생략 금지)

변경 영역별로 해당 검토를 수행하고 통과/지적사항을 명시:
- **정대훈 (코드)**: 네이밍(camelCase/PascalCase), 패턴 일관성, ESLint·TypeScript 에러 0건 (`docker exec ultra_app npm run lint`, `docker exec ultra_app npx tsc --noEmit`)
- **한소라 (디자인 시스템)**: 색상/타이포/간격(4px 기반) 토큰 준수, 컴포넌트 Props 일관성 — UI 변경 시
- **강현우 (UI/UX)**: 반응형, 호버/포커스 상태, 접근성 — UI 변경 시
- **윤성호 (DB 스키마)** + **배지영 (쿼리)**: 스키마 네이밍, 인덱스, N+1 방지 — DB 변경 시

## 6단계: [QA팀] 테스트

- T2 섹션 6의 테스트 케이스(정상/엣지/실패 ≥5)를 하나씩 확인
- 가능한 항목은 실제 실행으로 검증 (컨테이너 로그, API 호출 등), 불가 항목은 수동 확인 절차 제시
- DoD(섹션 9) 충족 여부 최종 판정

## 완료 보고

- 변경 파일 목록(절대경로), 테스트 결과, DoD 충족 여부
- 참여 페르소나/빈도 표 표시
- 커밋은 사용자 요청 시에만, 컨벤션 `[feat] 설명` 준수 (김현태 Git PM)
