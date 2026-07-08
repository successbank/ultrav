---
name: android-gradle-module
description: 신규 Gradle 모듈을 안전하게 추가. 버전 카탈로그·convention plugin·의존성 그래프 보호.
---

# Android Gradle Module

## 흐름
1. 모듈 유형 결정 (feature / core / data) 및 네이밍 규칙 적용
2. `settings.gradle.kts`에 모듈 등록 (include)
3. 버전 카탈로그(libs.versions.toml)로 의존성 선언 — 하드코딩 금지
4. convention plugin 적용 (android-library·kotlin·compose 공통 설정 재사용)
5. 의존성 방향 검증 — feature→core 단방향, 순환 의존 차단

## 산출물
- 새 모듈 build.gradle.kts (convention plugin + libs.* 참조)
- 의존성 그래프 영향 요약
- `./gradlew :모듈:assembleDebug` 빌드 확인
