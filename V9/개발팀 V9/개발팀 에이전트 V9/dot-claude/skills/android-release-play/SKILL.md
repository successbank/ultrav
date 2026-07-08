---
name: android-release-play
description: Play 릴리스 실행. AAB·Play App Signing·트랙 승급·단계적 출시 rollout%·사전 등록.
---

# Android Release (Play)

## 흐름
1. AAB 빌드 (`./gradlew :app:bundleRelease`) + Play App Signing(업로드 키 서명)
2. Play 정책 점검 (타겟 SDK·권한 최소화·개인정보처리방침 링크) — `pre-android-release.sh`
3. 트랙 승급: internal → closed → open → production
4. 단계적 출시(staged rollout) rollout% 설정 (예: 1%→10%→50%→100%)
5. 필요 시 사전 등록(pre-registration) 캠페인 구성

## 산출물
- 업로드 가능한 AAB + 릴리스 노트
- 트랙·rollout% 계획, 중단/롤백 기준
- 크래시·ANR 임계치 모니터링 연계
