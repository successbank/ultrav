---
name: android-compose-screen
description: 디자인/요구 스펙을 Compose 화면(Kotlin)으로 변환. 상태 호이스팅·Preview·UI 테스트 포함.
---

# Android Compose Screen

## 입력
- 화면 스펙 (와이어프레임/Figma 또는 요구 텍스트)
- 상태 매트릭스 (loading/empty/error/content/dark)

## 산출물
- Stateful/Stateless 분리 Composable (상태 호이스팅, 단방향 데이터 흐름)
- ViewModel + UiState(sealed) + 이벤트 핸들러
- `@Preview` (라이트/다크/상태별)
- Compose UI 테스트 (createComposeRule, semantics 기반 assertion)
- 접근성 라벨(contentDescription)·터치타깃 48dp 준수
