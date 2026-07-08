TYPE: IOS_NATIVE
SCOPE: ios-native
PRIORITY: 
TARGET_DATE: 

## 1. 화면/기능
<무엇을 만들지 — 화면 이름·진입 경로·핵심 동작. 예: "홈 피드 화면: 목록 + 당겨서 새로고침 + 상세 진입">

## 2. SwiftUI 요구
- 선언형 UI(SwiftUI-first), 단방향 데이터 흐름
- UiState(enum)로 default/loading/empty/error/content 표현
- `#Preview`(라이트/다크/Dynamic Type)·접근성(accessibilityLabel) 포함, 디자인 시스템(Core-UI) 토큰 사용

## 3. 상태/데이터
- `@Observable` ViewModel/Store + 상태 스트림, Repository(Core-Data)
- 로컬: SwiftData/GRDB <엔티티> · 네트워크 <엔드포인트/계약>
- 도메인 로직은 Core(UI 비의존), 가능하면 Protobuf 미러/KMP `:shared` 공유 후보 여부 표기

## 4. 온디바이스 AI 사용 여부
- [ ] 미사용
- [ ] Foundation Models (Apple Intelligence 온디바이스 추론 — 요약·추출, 민감정보 단말 처리)
- [ ] App Intents (앱 기능을 시스템·Siri·에이전트에 노출)
- 추론 라우팅: 온디바이스 우선, 미지원 시 <안전 대체|동의 전제 Private Cloud Compute>

## 5. 권한·프라이버시
- 요청 권한: <목록> · Info.plist 용도 문자열 필수, ATT 사용 시 NSUserTrackingUsageDescription
- 토큰은 Keychain, App Privacy(영양 라벨) 정확히 선언, 개인정보처리방침 링크 노출

## 6. 테스트
- 단위: Swift Testing/XCTest (도메인·ViewModel)
- UI: XCUITest 또는 ViewInspector (상태·접근성 assertion)
- E2E: **Maestro** <핵심 플로우>
- 성능(해당 시): Instruments(콜드 스타트·스크롤), 접근성: VoiceOver·Dynamic Type·터치타깃 44pt

## 7. 릴리스 트랙
- 빌드: 아카이브(.ipa) + 자동/수동 서명(프로비저닝)
- 채널: <TestFlight 내부 | 외부 | App Store>
- 단계적 출시: phased release(7일), 크래시 임계 초과 시 개발자 릴리스 일시중지
- 게이트: `pre-ios-build.sh`(swiftformat/swiftlint·xcodebuild build), 릴리스 시 `pre-ios-release.sh`(서명 env·Info.plist 용도 문자열·App Privacy)

## 8. 요청
- [ ] `ios-native-builder`가 영향 모듈 산정 → 변경 → `xcodebuild -scheme App build test` → Maestro 스모크
- [ ] 빌드 실패 시 `loop-run`(루프엔지니어링)과 연계해 **빌드-그린까지 자율 반복** (BUDGET·STOP·사람 승인 게이트 적용)
- [ ] 관찰성: 실패 시 `ios.build_failed` 발행, 완료 시 `ios.released`/`errors.platform.ios` 연계

## 9. 수용기준
- [ ] `xcodebuild build test`(또는 `swift test`) 통과 + UI/접근성 assertion 통과
- [ ] 권한 최소화·온디바이스 우선 원칙 준수, App Privacy·개인정보처리방침 노출
- [ ] 한 화면을 RN과 중복 구현하지 않음(트랙 경계 준수), 도메인 로직 공유 검토 기록

> 참고: 스택·모듈·온디바이스 AI·릴리스 상세는 `크로스플랫폼 V9/iOS_네이티브_가이드.md`.
> 서명·실기기 실행·아카이브는 로컬(macOS) 전용.
> 담당: @PM팀 경유 접수 → 소통관 분석 후 10팀 체계(PM/리서치/기획설계/디자인/개발1/개발2/개발3/QA/모니터링/시뮬레이션) 기준 배정 — 신규 화면·기능이므로 통상 개발1팀 주관, QA팀 검증.
