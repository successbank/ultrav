# 사용자지침 V9 — 요청 템플릿 모음

18종 요청 템플릿(T1~T18, PRD~IOS_NATIVE). 각 파일은 그대로 복사·붙여서 사용.
모든 요청은 머리말 4필드(TYPE/SCOPE/PRIORITY/TARGET_DATE)로 시작.
규약 상세는 `머리말_규칙.md` 참조.
접수는 @PM팀 경유 → 소통관 분석 → 10팀 체계(PM/리서치/기획설계/디자인/개발1/개발2/개발3/QA/모니터링/시뮬레이션) 배정이 원칙.

## 템플릿 목록
| # | 파일 | 용도 |
|---|---|---|
| T1 | `T1_PRD.md` | 제품 요구사항 |
| T2 | `T2_FEATURE.md` | 기능 개발 |
| T3 | `T3_IDEA.md` | 아이디어 검토 |
| T4 | `T4_BUGFIX.md` | 버그 수정 |
| T5 | `T5_ENHANCE.md` | 개선 |
| T6 | `T6_DESIGN_NEW.md` | 신규 디자인 |
| T7 | `T7_DESIGN_FIX.md` | 디자인 수정 |
| T8 | `T8_REFACTOR.md` | 리팩터링 |
| T9 | `T9_PERF.md` | 성능 |
| T10 | `T10_SECURITY.md` | 보안 |
| T11 | `T11_MIGRATION.md` | 마이그레이션 |
| T12 | `T12_DOCS.md` | 문서 |
| T13 | `T13_TEST.md` | 테스트 |
| T14 | `T14_RESEARCH.md` | 리서치 |
| T15 | `T15_INCIDENT.md` | 인시던트 |
| **T16** | **`T16_LOOP.md`** | **루프 작업 (자율 반복, 6요소: TRIGGER/SCOPE/ACTION/BUDGET/STOP/REPORT)** |
| **T17** | **`T17_ANDROID_NATIVE.md`** | **안드로이드 네이티브 기능 (Compose·온디바이스 AI·릴리스)** |
| **T18** | **`T18_IOS_NATIVE.md`** | **iOS 네이티브 기능 (SwiftUI·Foundation Models·App Store)** |

> V9 신규: T16(LOOP)은 SCOPE에 변경 범위를, T17(ANDROID_NATIVE)은 `android-native`를, T18(IOS_NATIVE)은 `ios-native`를 SCOPE에 사용한다. 신규 TYPE(LOOP/ANDROID_NATIVE/IOS_NATIVE)도 머리말 규약을 그대로 따른다.

## 슬래시 커맨드 연동 (Claude Code)

자주 쓰는 템플릿은 Ultra 프로젝트의 슬래시 커맨드가 머리말 4필드와 본문 구조를 자동 생성한다. 템플릿 파일을 직접 복사하지 않아도 된다.

| 커맨드 | 대응 템플릿 | 처리 흐름 |
|---|---|---|
| `/pm` | 전체 (범용 접수) | 요청을 머리말 4필드로 정리 → 소통관 분석 → 10팀 배정 |
| `/feature` | T2_FEATURE | 요구사항 구조화 → 기획설계 → 디자인 → 개발1팀 → 일관성 검토 → QA |
| `/bugfix` | T4_BUGFIX | 재현 → 5-Why RCA → 최소 수정 → 회귀 확인 (개발2팀 주관) |
| `/design-fix` | T7_DESIGN_FIX | before→after diff → 영향 범위 (디자인팀 주관, 강현우/한소라 일관성 검토) |

그 외 TYPE(PRD, REFACTOR, SECURITY 등)은 해당 템플릿을 복사해 `/pm`으로 접수한다.

원본 통합 문서: `../V9_사용자지침_요청템플릿.md`
