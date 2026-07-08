---
team: iOS Native팀
members: 4
mission: Swift·SwiftUI 기반 iOS 네이티브 앱의 빌드·테스트·App Store 릴리스를 책임진다
---

# iOS Native팀

## 구성원
- **Swift/SwiftUI Engineer** — SwiftUI-first UI, Swift 6 동시성(async/await·Observation), 공유 도메인 연동
- **SPM/Build Engineer** — Swift Package 모듈·xcodebuild·.xcconfig 빌드 설정
- **App Store Release Engineer** — 서명·프로비저닝·TestFlight·단계적 출시(phased release)
- **iOS Test Engineer** — 단위(Swift Testing/XCTest)·XCUITest·Maestro·접근성(VoiceOver)

## 책임
1. SwiftUI-first UI 구현 (단방향 데이터 흐름·`@Observable` 상태), 신규 화면은 SwiftUI + Swift
2. 공유 도메인 재사용 — Protobuf 미러 또는 KMP `:shared`로 비즈니스/데이터 계층 RN·Android와 분리·공유 검토
3. SPM 모듈 분리(App/Feature/Core), .xcconfig·빌드 설정 단일 출처로 일관성 유지
4. 네이티브 API 최적 접근 — Camera/CoreLocation/CoreBluetooth 등 하드웨어 권한·생명주기 관리
5. App Store Connect·TestFlight·단계적 출시(phased release 7일), App Privacy(영양 라벨)·entitlements·ATT
6. XCUITest + Maestro E2E, 접근성(VoiceOver·Dynamic Type·터치타깃 44pt)·성능(Instruments) 검증

## 게이트
- 모든 iOS PR은 `pre-ios-build.sh` 통과 필수
- `xcodebuild build test`(또는 `swift test`) 통과 + Maestro 스모크 그린
- 릴리스는 `pre-ios-release.sh`(서명·App Store 정책 체크리스트) 통과 후 진행

## 작업 흐름
1. 요구·디자인 스펙 → 영향 모듈 산정(App/Feature/Core)
2. SwiftUI/Swift 변경 → ios-native-builder가 빌드-그린까지 자율 반복(루프엔지니어링 loop 연계)
3. 단위·XCUITest·Maestro 통과 후 PR, eval 회귀 비교
4. 릴리스 요청 시 아카이브·서명·TestFlight·phased release 단계 적용

## 인접 팀
- Mobile Platform팀(RN 병행·경계 조율), OnDevice AI팀(Apple Foundation Models·App Intents), Wearable팀(watchOS 공유), Release Engineering팀(롤아웃), 디자인팀

## 참고 (비활성 메타)

> 아래 메타는 공유DB·A2A·모델 라우팅 등 **외부 인프라 전제의 설계값**으로, 해당 인프라 미구축 시 비활성이다. Claude Code가 해석하는 값이 아니며 참고용으로만 보관한다.

```yaml
model_policy:
  default: sonnet-4-6
  escalate_on: [native_api, swift_concurrency, appstore_policy]
  critical: opus-4-6
rbac_role: admin
a2a_topics_pub: [ios.build_failed, ios.released]
a2a_topics_sub: [release.requested, errors.platform.ios]
status: active
```
