# iOS 네이티브 트랙 가이드 (V9)

> 기존 RN(Mobile Platform팀) 트랙은 그대로 두고, **Swift/SwiftUI 네이티브 전담 트랙을 병행 추가**한다. Android 네이티브 트랙(`안드로이드_네이티브_가이드.md`)과 대칭 구성.

## 1. 왜 네이티브 트랙을 추가했나 (RN 병행 이유)
RN은 다수 화면을 iOS·Android 공유 코드로 빠르게 출하하기에 여전히 유효하다. 그러나 다음 영역에서 네이티브가 명확히 우월하다.

| 동인 | 네이티브가 필요한 이유 |
|---|---|
| 플랫폼 표준 | 신규 Apple UI/프레임워크는 **SwiftUI-first**. 최신 컴포넌트·시스템 통합은 SwiftUI + Swift가 기본선 |
| 하드웨어 | Camera·CoreLocation·CoreBluetooth·CoreMotion 등 **하드웨어 최적 접근**, 지연·전력·생명주기 제어 |
| 온디바이스 AI | **Foundation Models**(Apple Intelligence 온디바이스 LLM)와 **App Intents**(시스템·Siri·에이전트 노출)는 네이티브 진입점 |
| 시스템 통합 | 위젯(WidgetKit)·Live Activity·Shortcuts·Handoff·잠금화면은 네이티브 전용 |

→ 결론: 공유·범용 UI는 RN, **하드웨어·온디바이스 AI·고성능·플랫폼 표준 UI·시스템 통합은 네이티브**. 두 트랙을 자산(페르소나·에이전트·스킬·훅·eval)까지 분리해 병행한다.

## 2. 스택 결정
| 분야 | 선택 | 근거 |
|---|---|---|
| 언어 | **Swift 6** | Apple 1순위, 동시성 안전성(strict concurrency) |
| UI | **SwiftUI (SwiftUI-first)** | Apple 표준, 선언형, Preview·테스트 용이 |
| 상태 | `@Observable`(Observation) + `@State` | 단방향 데이터 흐름, 보일러플레이트 감소 |
| 비동기 | async/await + Structured Concurrency | 구조적 동시성, actor 격리 |
| 공유 로직 | Protobuf 미러 또는 KMP `:shared` *선택적* | 도메인/데이터 계층을 RN·Android와 재사용 검토 |
| 로컬 DB | SwiftData (또는 GRDB.swift) | 선언형 모델·마이그레이션 |
| 모듈/빌드 | **Swift Package Manager(SPM)** (+ 필요 시 Tuist) | 로컬 패키지로 모듈화, `.xcconfig` 단일 출처 |
| DI | 프로토콜 기반 init 주입(경량) | 테스트 대체 용이, 무거운 DI 프레임워크 회피 |

### 공유 코어 채택 기준
- **공유**: 순수 비즈니스 규칙·검증·DTO·네트워크/저장 계약처럼 UI 비의존 로직 → Protobuf 미러 또는 KMP `:shared`.
- **네이티브 전용**: UI 밀착 로직, 플랫폼 SDK 직접 의존(시스템 통합·하드웨어).

## 3. 프로젝트 구조 (SPM 모듈)
```
ios/
  App/                      # 진입점(@main), DI 조립, 네비게이션 루트
  Packages/
    Feature-Home/           # 화면 단위 (SwiftUI View + @Observable Store + UiState)
    Feature-Profile/
    Core-UI/                # 디자인 시스템, 공통 View, 테마/토큰
    Core-Data/              # Repository, SwiftData, 네트워크
    Core-Domain/            # UseCase, 도메인 모델 (UI 비의존)
    Core-Common/            # 유틸, 결과 타입
  Config/                   # .xcconfig (빌드 설정 단일 출처)
  App.xcodeproj             # (또는 Tuist 생성)
```
- 의존 방향: `Feature → Core-Domain → Core-Data` 단방향, **순환 의존 금지**.
- 공유 시 `Core-Domain`/`Core-Common`을 Protobuf/KMP `:shared`로 RN·Android와 공유.

## 4. 온디바이스 AI (Foundation Models + App Intents)
- **Foundation Models**: 데이터 추출·요약 등 **온디바이스 추론**. 민감정보는 단말에서 처리해 데이터 단말 이탈 최소화.
- **App Intents**: 앱의 도구·데이터를 **시스템·Siri·Shortcuts·에이전트**에 노출 (Android AppFunctions에 대응).
- **추론 라우팅**: 민감도·지연·기기 성능 기준으로 온디바이스 우선, 미지원 시 안전 대체 또는 동의 전제 **Private Cloud Compute**.
- 담당: **OnDevice AI팀**(Apple 측 Foundation Models·App Intents) + iOS_Native팀. 스킬 `ios-appintents-foundation`.

## 5. AI 주도 개발 워크플로우
1. **생성**: 화면/모듈 스펙 → `ios-swiftui-screen`·`ios-spm-module` 스킬로 SwiftUI/SPM 골격 생성.
2. **빌드·실행**: `xcodebuild`/`xcrun simctl` CLI로 에이전트가 시뮬레이터 빌드·테스트를 직접 수행.
3. **자율 반복**: `ios-native-builder` 에이전트가 영향 모듈 산정 → 변경 → `xcodebuild -scheme App build test` → Maestro 스모크 → 실패 시 **루프엔지니어링 loop**(loop-run)과 연계해 **빌드-그린까지 자율 반복**.
4. **게이트**: 모든 PR은 `pre-ios-build.sh`(swiftformat/swiftlint·xcodebuild build) 통과.
> 주의: **서명·실기기 실행·아카이브는 로컬(macOS) 전용**. Codex 원격 미러는 시뮬레이터 빌드·단위 테스트까지만. Windows/Linux에선 EAS/클라우드 CI로 빌드.

## 6. 테스트
| 계층 | 도구 | 비고 |
|---|---|---|
| 단위 | **Swift Testing** / XCTest | 도메인·Store |
| UI | XCUITest (또는 ViewInspector) | 상태·접근성 assertion |
| E2E | **Maestro** | 핵심 플로우 |
| 성능 | **Instruments** + XCTest Metrics | 콜드 스타트·스크롤·메모리 |
| 접근성 | VoiceOver·Dynamic Type·터치타깃 44pt·대비 | 출시 게이트 |

## 7. 릴리스
- **아카이브(.ipa)** + 서명(자동 관리 또는 수동 프로비저닝).
- 채널: **TestFlight 내부 → 외부 → App Store**.
- **단계적 출시(phased release)**: 7일 자동 단계, 크래시 임계 초과 시 개발자 릴리스 일시중지.
- App Privacy(영양 라벨)·entitlements·ATT 정확 선언. 게이트: `pre-ios-release.sh`(서명 env·Info.plist 용도 문자열·개인정보처리방침).
- 담당: **iOS_Native팀**. 스킬 `ios-release-appstore`.

## 8. 보안 / 프라이버시
- 토큰은 **Keychain**, 디스크 OS 암호화 전제 (플랫폼별 보안 매트릭스 참조).
- **권한 최소화**: Info.plist 용도 문자열 필수, ATT는 실제 추적 시에만. 미사용 권한·entitlement 제거.
- **온디바이스 우선**: 민감정보 요약·추출은 Foundation Models로 단말 처리, 클라우드 전송은 동의 전제.
- App Store Connect의 **App Privacy** 항목을 실제 데이터 수집과 일치시킨다(불일치 시 거절).

## 9. RN(크로스플랫폼)과의 경계·선택 기준
| 기준 | RN (Mobile Platform팀) | 네이티브 (iOS Native팀) |
|---|---|---|
| 주 용도 | iOS·Android 공유 범용 UI, 빠른 출하 | iOS 표준 UI, 하드웨어·온디바이스 AI·시스템 통합 |
| 하드웨어 | 브리지/모듈로 접근(제약 가능) | Camera/CoreLocation/CoreBluetooth 등 **최적 접근** |
| 온디바이스 AI | 제한적 | **Foundation Models + App Intents** 네이티브 |
| 성능 | 일반 화면 충분 | 고프레임·복잡 애니메이션·저지연 우월 |
| UI 표준 | RN 컴포넌트 | **SwiftUI-first** Apple 표준 |
| 시스템 통합 | 제한적 | 위젯·Live Activity·Shortcuts·Handoff |
| 코드 공유 | TS 생태 공유 | Protobuf/KMP로 도메인 계층 선택 공유 |
| 선택 규칙 | 화면이 단순·공유가치 큼 → RN | 하드웨어/온디바이스AI/고성능/시스템통합 → 네이티브 |

경계 원칙: 한 화면을 두 트랙으로 중복 구현하지 않는다. 신규 기능은 위 기준으로 트랙을 먼저 확정하고, 도메인 로직은 가능하면 공유한다.

## 10. 관찰성 / A2A 연계
- 빌드 실패 시 `ios-native-builder`가 원인 요약과 함께 `ios.build_failed` 토픽 발행 → 루프엔지니어링 loop가 수신해 재시도/에스컬레이션.
- 릴리스 완료 시 `ios.released` 발행 → OnDevice AI팀이 온디바이스 기능 갱신 판단에 활용.
- 런타임 에러는 `errors.platform.ios`로 수집 → iOS Native팀 구독. 크래시 임계 초과 시 phased release 자동 중단 권고.
- 모델 호출은 `model_policy`(default sonnet-4-6, native_api/swift_concurrency/appstore_policy 시 escalate)로 라우팅, 비용은 usage_tracking에 적재.

## 11. AI 주도 개발 — 시작 프롬프트 예시
```
Swift 6 + SwiftUI로 iOS 앱 모듈을 생성하라.
- 모듈(SPM): App / Feature-Home / Core-UI / Core-Domain / Core-Data
- 상태: @Observable Store + UiState(enum: loading/empty/error/content)
- 로컬: SwiftData, 비동기: async/await
- 홈 화면: 목록 + 로딩/에러/빈 상태, 단방향 데이터 흐름
- 빌드 검증: xcodebuild -scheme App -destination 'platform=iOS Simulator,name=iPhone 16' build test 통과까지 반복
- .xcconfig로 빌드 설정 단일화
```
생성 후 `xcodebuild`/`xcrun simctl`로 에이전트가 시뮬레이터 빌드·실행을 수행하고, `ios-native-builder`가 그린까지 자율 반복한다.

## 12. 코드 공유·공존 운영
- **공유 후보**: 도메인 규칙·검증·DTO·동기화 계약. Protobuf 미러 또는 KMP `:shared`로 RN·Android와 재사용.
- **공존 규칙**: RN 앱과 네이티브 앱이 같은 백엔드·동기화 엔진(공유DB 인프라)을 사용하되, 화면 소유권은 트랙별 단일.
- **점진 도입**: 기존 RN 화면을 네이티브로 옮길 때는 기능 플래그로 신·구 경로를 병행 후 단계적 전환(빅뱅 금지).
- **자산 관리**: 네이티브 전담 자산(페르소나·에이전트·스킬·훅·eval)은 본 트랙에만 추가.

## 13. watchOS와의 관계
- **Wearable팀**이 watchOS(SwiftUI + WatchConnectivity + Complication)를 담당하며, iOS_Native팀과 SwiftUI·도메인 코어를 공유한다.
- iOS 앱 + watchOS extension은 보통 동일 번들로 App Store Connect 단일 제출.

---

### 출처 (각주)
- Apple Developer — SwiftUI / Swift 6 동시성 (developer.apple.com/documentation)
- Apple — Foundation Models framework (WWDC25, 온디바이스 추론)
- Apple — App Intents (시스템·Siri·Shortcuts 노출)
- Apple — App Store Connect: phased release / App Privacy
