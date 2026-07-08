TYPE: ANDROID_NATIVE
SCOPE: android-native
PRIORITY: 
TARGET_DATE: 

## 1. 화면/기능
<무엇을 만들지 — 화면 이름·진입 경로·핵심 동작. 예: "홈 피드 화면: 목록 + 새로고침 + 상세 진입">

## 2. Compose 요구
- 선언형 UI(Jetpack Compose, Compose-first), 상태 호이스팅
- UiState(sealed)로 default/loading/empty/error/success 표현
- Preview·접근성 semantics 포함, 디자인 시스템(core-ui) 토큰 사용

## 3. 상태/데이터
- ViewModel + UiState 스트림(Flow), Repository(core-data)
- 로컬: Room <테이블/엔티티> · 네트워크 <엔드포인트/계약>
- DI: Hilt. 도메인 로직은 core-domain(UI 비의존), 가능하면 KMP `:shared` 후보 여부 표기

## 4. 온디바이스 AI 사용 여부
- [ ] 미사용
- [ ] Gemini Nano 4 (온디바이스 추론 — 요약·추출, 민감정보 단말 처리)
- [ ] AppFunctions (앱=온디바이스 MCP 서버로 도구/데이터 노출)
- 추론 라우팅: 온디바이스 우선, 미탑재/불가 시 <동의 전제 클라우드 폴백|안전 대체 경로>

## 5. 권한
- 요청 권한: <목록> · 위험 권한(SMS·전체 패키지 조회·외부 저장소 전체)은 정당성·선언 양식 필수
- 미사용 권한 제거, 토큰은 Keystore, 개인정보처리방침 링크 노출

## 6. 테스트
- 단위: JUnit + Coroutines Test + Turbine(Flow)
- Compose UI: createComposeRule + semantics (상태·접근성 assertion)
- E2E: **Maestro** <핵심 플로우> · 시스템 상호작용은 **UiAutomator**
- 성능(해당 시): Baseline Profiles + Macrobenchmark, 접근성: TalkBack·터치타깃 48dp·대비

## 7. 릴리스 트랙
- 빌드: AAB + Play App Signing
- 트랙: <internal | closed | open | production>
- 단계적 출시 rollout%: <1→10→50→100>, 크래시·ANR 임계 초과 시 중단/롤백
- 게이트: `pre-android-build.sh`(wrapper·ktlint/detekt·lintDebug), 릴리스 시 `pre-android-release.sh`(서명 env·targetSDK·권한 최소화·개인정보처리방침)

## 8. 요청
- [ ] `android-native-builder`가 영향 모듈 산정 → 변경 → `./gradlew :app:assembleDebug lintDebug test` → Maestro 스모크
- [ ] 빌드 실패 시 `loop-run`(루프엔지니어링)과 연계해 **빌드-그린까지 자율 반복** (BUDGET·STOP·사람 승인 게이트 적용)
- [ ] 관찰성: 실패 시 `android.build_failed` 발행, 완료 시 `android.released`/`errors.platform.android` 연계

## 9. 수용기준
- [ ] `./gradlew test lintDebug` 통과 + Compose UI/접근성 assertion 통과
- [ ] 권한 최소화·온디바이스 우선 원칙 준수, 개인정보처리방침 노출
- [ ] 한 화면을 RN과 중복 구현하지 않음(트랙 경계 준수), 도메인 로직 KMP 공유 검토 기록

> 참고: 스택·모듈·온디바이스 AI·릴리스 상세는 `크로스플랫폼 V9/안드로이드_네이티브_가이드.md`.
> 서명·실기기 실행은 로컬 전용.
> 담당: @PM팀 경유 접수 → 소통관 분석 후 10팀 체계(PM/리서치/기획설계/디자인/개발1/개발2/개발3/QA/모니터링/시뮬레이션) 기준 배정 — 신규 화면·기능이므로 통상 개발1팀 주관, QA팀 검증.
