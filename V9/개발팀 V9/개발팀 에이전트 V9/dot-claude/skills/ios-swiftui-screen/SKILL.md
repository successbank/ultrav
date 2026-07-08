---
name: ios-swiftui-screen
description: 디자인/요구 스펙을 SwiftUI 화면(Swift)으로 변환. 단방향 상태·Preview·UI 테스트 포함.
---

# iOS SwiftUI Screen

## 입력
- 화면 스펙 (와이어프레임/Figma 또는 요구 텍스트)
- 상태 매트릭스 (loading/empty/error/content/dark·Dynamic Type)

## 산출물
- View(상태 비의존) + `@Observable` ViewModel/Store 분리 (단방향 데이터 흐름)
- UiState(enum)로 default/loading/empty/error/content 표현
- `#Preview` (라이트/다크/Dynamic Type/상태별)
- UI 테스트 (XCUITest 또는 ViewInspector) + 접근성(accessibilityLabel)·터치타깃 44pt 준수
