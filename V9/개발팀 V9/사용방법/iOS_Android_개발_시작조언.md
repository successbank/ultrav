# iOS·Android 개발 시작 조언 (준비물·비용·트랙 선택)

> 결론: **V9으로 iOS·Android 둘 다 개발할 수 있습니다.** 기본은 React Native 한 코드베이스로 iOS+Android 동시 출하, 특정 화면만 네이티브(Android=Compose, iOS=SwiftUI[트랙 추가 시]). 이 문서는 "시작 전에 알아야 할 것"을 정리합니다.

## 0. 먼저 — 이 시스템의 위치(오해 방지)
- **V9 = AI 주도 개발을 위한 "설정·방법론" 묶음**(`.claude/` 드롭인). 그 자체는 앱이 아니다.
- 실제 앱은 **코드 골격(스타터)** 이 있어야 시작된다 → 다음 산출물 `RN앱_스타터/`.
- 이 샌드박스(Claude 작업 환경)에선 **코드·설정·CI 생성은 가능**하지만, **실제 컴파일·실기 실행·스토어 업로드는 본인 컴퓨터**에서 한다(특히 iOS는 애플이 macOS+Xcode를 강제).

## 1. 준비물 (계정)
| 항목 | 용도 | 비용 | 필수 시점 |
|---|---|---|---|
| **Apple Developer Program** | iOS 실기 배포·TestFlight·App Store | **연 $99** | 실기/스토어 단계(시뮬레이터 개발엔 불필요) |
| **Google Play Console** | Android 스토어 출시 | **1회 $25** | 출시 단계 |
| **Expo(EAS) 계정** | 클라우드 빌드(iOS·Android) | 무료 티어 有, 대량/동시 빌드 유료 | 빌드 단계 |
| (선택) Apple ID | 로컬 시뮬레이터·개발 | 무료 | 즉시 |

## 2. 준비물 (머신·툴)
| 구분 | 필요한 것 | 비고 |
|---|---|---|
| 공통 | Node LTS + **pnpm**, Git | 모노레포 도구 |
| **iOS 빌드** | **macOS + Xcode** | 애플 강제. Windows/Linux는 로컬 iOS 네이티브 빌드 불가 → **EAS 클라우드 빌드로 우회 가능** |
| **Android 빌드** | Android Studio + SDK + JDK | OS 무관(mac/win/linux 모두) |
| 실기 테스트 | iPhone / 안드로이드 기기 | 선택 — 시뮬레이터/에뮬레이터로 대부분 가능. 단 푸시·센서·성능은 실기 권장 |

> Windows·Linux 사용자도 **EAS Build(클라우드)** 로 iOS 앱을 빌드할 수 있다. 다만 App Store 제출용 인증서 관리 등 일부는 결국 Apple 생태계가 필요.

## 3. RN vs 네이티브 — 언제 무엇을 (V9 경계 기준)
| 화면/기능 성격 | 추천 트랙 | V9 담당 |
|---|---|---|
| 공유·일반 UI, 빠른 출하, iOS+Android 동시 | **React Native** (기본) | Mobile Platform팀 |
| 하드웨어 최적 접근(카메라/GPS/BLE/센서) | 네이티브 | Android: Compose / iOS: SwiftUI |
| 고프레임·복잡 애니메이션·저지연 | 네이티브 | 〃 |
| 플랫폼 표준 UI(Compose-first / SwiftUI) | 네이티브 | 〃 |
| 온디바이스 AI | 네이티브 | Android: Gemini Nano+AppFunctions / iOS: Foundation Models+App Intents |
| 도메인 로직(검증·DTO·규칙) | **공유 코어** | packages/core(TS), 필요 시 KMP |

원칙: **한 화면을 두 트랙으로 중복 구현하지 않는다.** 신규 기능은 위 기준으로 트랙을 먼저 정하고, 도메인 로직은 공유한다.

## 4. 현재 V9의 트랙 상태(중요)
- **iOS+Android 공통**: React Native 트랙(Mobile Platform팀) — **지금 바로 가능**.
- **Android 네이티브**: 전담 트랙 완비(Android Native팀 + 빌더/스킬/훅/eval/T17).
- **iOS 네이티브(SwiftUI)**: 기본 V9엔 전담 트랙이 **없었음** → 이번에 대칭으로 **추가**(iOS_Native팀 + ios-native-builder + 스킬/훅/eval/T18). 추가 후 iOS도 네이티브 1급.

## 5. 추천 시작 순서 (요약)
1. **환경 설치**: Node+pnpm / (iOS)Xcode / (Android)Android Studio / `eas login`
2. **앱 골격 받기**: 산출물 `RN앱_스타터/` → `pnpm install`
3. **V9 드롭인**: `사용방법/install-to-project.sh`로 `.claude/` 배치 → Claude Code에 "V9 시스템을 현재 개발에 맞게 최적화" 요청
4. **첫 기능**: `T2_FEATURE` 템플릿 작성 → Mobile Platform팀이 iOS+Android 동시 구현 → `eas build`로 빌드 → TestFlight/내부 테스트
5. **필요 화면만 네이티브**: Android `T17_ANDROID_NATIVE` / iOS `T18_IOS_NATIVE`

> 자세한 단계별 명령은 다음 산출물 `iOS_Android_시작가이드.md` 참조.
