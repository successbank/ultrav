---
name: ios-spm-module
description: 신규 Swift Package 모듈을 안전하게 추가. 의존성 그래프·빌드 설정 단일 출처 보호.
---

# iOS SPM Module

## 흐름
1. 모듈 유형 결정 (Feature / Core / Data) 및 네이밍 규칙 적용
2. `Package.swift`에 타깃·프로덕트 등록, 로컬 패키지 의존 추가
3. 버전·빌드 설정은 `.xcconfig`·Package 단일 출처 — 하드코딩 금지
4. 공통 설정 재사용 (build settings·SwiftLint 규칙 공유)
5. 의존성 방향 검증 — Feature→Core 단방향, 순환 의존 차단

## 산출물
- 새 SPM 타깃 Package.swift 항목 + 의존 그래프 영향 요약
- `swift build` / `xcodebuild -scheme 모듈` 빌드 확인
