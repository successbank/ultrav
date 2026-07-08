---
name: ios-appintents-foundation
description: App Intents로 앱 기능을 시스템·Siri·에이전트에 노출하고, Foundation Models로 온디바이스 추론. 스키마·권한·테스트.
---

# iOS App Intents + Foundation Models (온디바이스 AI)

> Android의 AppFunctions(앱=온디바이스 MCP)·Gemini Nano에 대응하는 Apple 측 진입점.

## 흐름
1. 노출할 앱 기능 선정 (도구·데이터) → AppIntent 정의 (시스템·Siri·Shortcuts·에이전트 사용)
2. AppIntent 스키마 — 파라미터·결과 타입, 설명, 안전 제약 + App Shortcuts 등록
3. 권한·동의 — 데이터 접근 최소화, 민감 작업 사용자 확인
4. 온디바이스 추론 — **Foundation Models**(Apple Intelligence 온디바이스 LLM)로 요약·추출, 데이터 단말 이탈 최소화
5. 추론 라우팅 — 온디바이스 우선, 미지원 기기/모델 시 안전 대체(또는 동의 전제 Private Cloud Compute)

## 산출물
- AppIntent 정의 + 스키마(파라미터·반환) + App Shortcuts
- 권한 선언·동의 흐름
- 호출 예시 + 계약 테스트
