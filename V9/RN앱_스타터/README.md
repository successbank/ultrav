# RN 앱 스타터 (iOS · Android · 공유 TS 코어)

V9 시스템으로 **iOS·Android를 한 코드베이스로** 개발하기 위한 최소 모노레포 골격(Phase 0).

## 구조
```
RN앱_스타터/
├─ apps/mobile/        # Expo + React Native (iOS·Android UI)
├─ packages/core/      # 공유 도메인 로직 + Zod (UI 비의존)
├─ .github/workflows/  # CI (typecheck·lint·test)
├─ CLAUDE.md           # Claude Code 진입점
├─ package.json        # pnpm workspaces + turbo
└─ pnpm-workspace.yaml
```

## 0. 사전 준비 (한 번)
- Node 20 + corepack: `corepack enable && corepack prepare pnpm@9 --activate`
- iOS 빌드: macOS + Xcode (시뮬레이터 개발은 무료, 실기/스토어는 Apple Developer $99/년)
- Android 빌드: Android Studio + SDK
- (클라우드 빌드) Expo 계정: `npm i -g eas-cli && eas login`

## 1. 설치
```bash
cd RN앱_스타터
pnpm install
```

## 2. 실행
```bash
# 개발 서버(QR → Expo Go 또는 dev client)
pnpm --filter @app/mobile dev

# 시뮬레이터/에뮬레이터 직접 실행
pnpm --filter @app/mobile ios       # macOS + Xcode 필요
pnpm --filter @app/mobile android   # Android Studio/SDK 필요
```

## 3. 검증
```bash
pnpm typecheck    # 전체 타입체크
pnpm test         # packages/core 단위 테스트(Vitest)
```

## 4. 빌드(클라우드, 스토어용)
```bash
eas build -p ios --profile preview        # iOS (시뮬레이터/내부배포)
eas build -p android --profile preview    # Android (APK/AAB)
# 프로덕션: --profile production, 이후 eas submit
```

## 5. V9 시스템 연결 (AI 주도 개발)
```bash
# V9의 드롭인 스크립트로 .claude/(agents·skills·hooks·evals)를 이 리포에 추가
bash "../개발팀 V9/사용방법/install-to-project.sh" .
# 이후 Claude Code에서:
#   "V9 시스템을 현재 개발에 맞게 최적화"
#   "T2_FEATURE: 할 일 목록에 추가/삭제 기능" 등 템플릿으로 요청
```

## 확장 포인트
- `apps/web`(React+Vite), `apps/desktop`(Tauri) 추가 → 같은 `packages/core` 공유
- `packages/{db-schema, sync-engine, ui-kit, auth}` 분리
- 특정 화면 네이티브로: Android=`T17_ANDROID_NATIVE`, iOS=`T18_IOS_NATIVE`

> 참고: 준비물·비용·트랙 선택은 `../개발팀 V9/사용방법/iOS_Android_개발_시작조언.md`, 단계별 절차는 `iOS_Android_시작가이드.md`.
