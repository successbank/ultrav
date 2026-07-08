# iOS·Android 시작 가이드 (제로 → 실행 → 스토어)

> 대상: `RN앱_스타터/`(Phase 0 골격)로 iOS·Android 앱을 실제로 굴리는 단계별 절차.
> 준비물·비용·트랙 선택은 `iOS_Android_개발_시작조언.md` 먼저 참고.

## 0. 한눈에 흐름
```
환경 설치 → 골격 설치(pnpm) → 시뮬레이터 실행 → V9 드롭인 → 첫 기능(T2) → EAS 빌드 → 스토어 제출
                                                       └ 필요 화면만 네이티브(T17/T18)
```

## 1. 환경 설치
### 공통
```bash
# Node 20 + pnpm (corepack 권장)
corepack enable && corepack prepare pnpm@9 --activate
node -v   # v20.x 확인
# EAS CLI (클라우드 빌드/제출)
npm i -g eas-cli && eas login
```
### iOS (macOS 필수)
- App Store에서 **Xcode** 설치 → 최초 1회 실행해 컴포넌트 동의
- `xcode-select --install` (CLI 도구)
- iOS 시뮬레이터는 Xcode에 포함(무료). 실기/스토어는 Apple Developer($99/년)
> Windows·Linux면 로컬 iOS 실행은 불가하지만 **EAS 클라우드 빌드로 iOS 빌드 가능**(아래 5번).
### Android (OS 무관)
- **Android Studio** 설치 → SDK Manager에서 "Android SDK Platform" + "Build-Tools" + 에뮬레이터 이미지
- 환경변수 `ANDROID_HOME` 설정, `adb` PATH 등록

## 2. 골격 설치
```bash
cd "claude_cowork/V9/RN앱_스타터"
pnpm install          # 워크스페이스 전체 의존성
pnpm typecheck        # 타입 OK 확인
pnpm test             # 공유 코어(@app/core) 단위 테스트 통과 확인
```

## 3. 실행
```bash
# 개발 서버 (QR → Expo Go 앱, 또는 dev client)
pnpm --filter @app/mobile dev

# 시뮬레이터/에뮬레이터로 직접
pnpm --filter @app/mobile ios       # macOS + Xcode
pnpm --filter @app/mobile android   # 에뮬레이터 실행 중이어야 함
```
처음엔 `expo run:ios/android`가 네이티브 프로젝트(ios/·android/)를 생성한다(prebuild). 홈 화면에 "할 일" 목록이 뜨면 성공 — 이 화면은 `@app/core`의 공유 로직을 그대로 쓴다(iOS·Android 동일).

## 4. V9 시스템 연결 + 첫 기능
```bash
# 이 리포에 V9의 .claude(agents·skills·hooks·evals) 추가
bash "../개발팀 V9/사용방법/install-to-project.sh" .
```
이후 Claude Code에서:
1. **"V9 시스템을 현재 개발에 맞게 최적화"** — 스택 감지·무관 페르소나 정리·hook 연결.
2. 기능 요청은 템플릿으로. 예) `T2_FEATURE`:
   ```
   TYPE: FEATURE
   목표: 할 일에 마감일 추가 + 마감 임박 정렬
   범위: packages/core(도메인) + apps/mobile(화면)
   수용기준: core 단위테스트 통과, iOS·Android 동일 동작
   ```
   → Mobile Platform팀이 iOS·Android 공통으로 구현.

## 5. 빌드 (EAS 클라우드)
```bash
cd apps/mobile
eas build:configure                       # 최초 1회 (프로젝트 등록)
eas build -p android --profile preview    # APK/AAB (내부 배포)
eas build -p ios --profile preview        # iOS (시뮬레이터 빌드: eas.json preview)
# 실기/스토어용:
eas build -p ios --profile production      # Apple Developer 계정 필요(인증서 자동관리)
eas build -p android --profile production
```
> iOS production 빌드는 EAS가 인증서·프로비저닝을 자동 관리(또는 직접 업로드). macOS 없이도 클라우드에서 빌드된다.

## 6. 스토어 제출
```bash
eas submit -p ios --latest        # App Store Connect (TestFlight → 심사)
eas submit -p android --latest    # Play Console (내부 → 비공개 → 프로덕션)
```
- iOS: App Store Connect에서 앱 생성 + 메타데이터/스크린샷 + 개인정보 항목.
- Android: Play Console에서 앱 생성 + 데이터 보안 양식 + 단계적 출시(rollout %).

## 7. 네이티브가 필요할 때
공유 RN으로 부족한 화면(하드웨어·고성능·온디바이스 AI·플랫폼 표준 UI)만 네이티브로:
- **Android**: `T17_ANDROID_NATIVE` 템플릿 → `android-native-builder`가 `./gradlew` 빌드-그린까지 루프.
- **iOS**: `T18_IOS_NATIVE` 템플릿 → `ios-native-builder`가 `xcodebuild` 빌드-그린까지 루프.
- 원칙: 한 화면을 RN+네이티브로 중복 구현 금지, 도메인 로직은 `packages/core` 공유.

## 8. 자주 막히는 곳
| 증상 | 해결 |
|---|---|
| iOS 빌드가 Windows에서 안 됨 | 정상 — `eas build -p ios`(클라우드) 사용 |
| 모노레포에서 모듈 못 찾음 | `apps/mobile/metro.config.js`의 watchFolders/nodeModulesPaths 확인(이미 설정됨) |
| `@app/core` 변경이 앱에 반영 안 됨 | Metro 캐시: `expo start -c` |
| 에뮬레이터 안 뜸 | Android Studio에서 AVD 먼저 실행, `adb devices`로 확인 |
| 서명/인증서 오류 | iOS는 Apple Developer 가입 후 `eas credentials`, Android는 Play App Signing |

> 다음: 특정 플랫폼 네이티브 심화가 필요하면 `크로스플랫폼 V9/안드로이드_네이티브_가이드.md`·`iOS_네이티브_가이드.md` 참고.
