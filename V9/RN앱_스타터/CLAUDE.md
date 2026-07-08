# CLAUDE.md

## 1. 프로젝트
크로스플랫폼 앱 스타터 — 공유 TS 코어 + React Native(iOS·Android). V9 시스템으로 AI 주도 개발.

## 2. 공식 명령
- dev: `pnpm dev` (모바일: `pnpm --filter @app/mobile dev`)
- typecheck: `pnpm typecheck`
- test: `pnpm test`
- iOS 실행: `pnpm --filter @app/mobile ios` (macOS+Xcode)
- Android 실행: `pnpm --filter @app/mobile android` (Android Studio/SDK)
- 빌드(클라우드): `eas build -p ios|android --profile preview`

## 3. 모노레포 지도
- `apps/mobile` — Expo + React Native (iOS·Android 공통 UI)
- `packages/core` — 공유 도메인 로직 + Zod 스키마 (UI 비의존, 모든 앱이 사용)
- (확장) `apps/web`, `apps/desktop`, `packages/{db-schema,sync-engine,ui-kit}` 추가 가능

## 4. 테스트 정책
- 단위(70%): `packages/core`는 Vitest로 도메인 로직 검증
- E2E(5%): Maestro(iOS·Android 공통 플로우) — 화면 추가 시 도입

## 5. 커밋·PR 규칙
- Conventional Commits / PR 본문: 무엇·왜·테스트·위험·롤백

## 6. 금지
- 토큰을 AsyncStorage/localStorage에 저장 금지 (Keychain/Keystore 사용)
- 시크릿 커밋 금지 (EAS Secrets 사용)
- 도메인 로직을 화면에 중복 — `packages/core`로 추출

## 7. 위임 (V9 드롭인 후)
- 새 기능은 `T2_FEATURE` 템플릿 → Mobile Platform팀이 iOS+Android 동시 구현
- Android 네이티브 화면은 `T17_ANDROID_NATIVE` → android-native-builder
- iOS 네이티브 화면은 `T18_IOS_NATIVE` → ios-native-builder

## 8. 게이트
- typecheck + test 통과, EAS Build 성공
- 자율 루프는 BUDGET/STOP 결정적 hook 안에서만

## 9. 컨텍스트
- 공유 코어: `@app/core` (import 해서 사용)
- V9 드롭인: `V9/개발팀 V9/사용방법/install-to-project.sh`로 `.claude/`(agents·skills·hooks·evals) 추가 후 "V9 시스템을 현재 개발에 맞게 최적화" 실행
