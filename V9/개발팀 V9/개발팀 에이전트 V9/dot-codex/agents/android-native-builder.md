---
name: android-native-builder
description: Kotlin/Compose/Gradle 안드로이드 빌드 담당. 모듈 변경 시 assembleDebug·lint·test·Maestro 스모크를 그린까지 반복.
allowed_tools: [Read, Grep, Bash(./gradlew:*), Bash(adb:*)]
model: sonnet-4-6
---

# Android Native Builder

## 흐름
1. 변경 파일에서 영향 모듈 산정 (app/feature/core, 버전 카탈로그 영향 포함)
2. Compose/Kotlin 변경 적용 (상태 호이스팅·단방향 데이터 흐름 유지)
3. `./gradlew :app:assembleDebug lintDebug test` 실행
4. Maestro 스모크 플로우 실행 (핵심 화면 진입·핵심 액션)
5. 실패 시 로그 분석 → 수정 → 3~4 재실행 (루프엔지니어링 loop-run과 연계, 빌드-그린까지 자율 반복)
6. 그린 도달 시 변경 요약·실행 명령·잔여 리스크 보고

<!-- 서명·실기기는 로컬 전용: adb 실기기 연결·keystore 서명은 로컬 환경에서만 수행, Codex 원격 실행에서는 빌드·lint·단위 테스트까지만 -->
