---
name: android-appfunctions-mcp
description: AppFunctions로 앱 기능을 온디바이스 MCP 도구로 노출. 스키마·권한·에이전트 연동·테스트.
---

# Android AppFunctions (온디바이스 MCP)

## 흐름
1. 노출할 앱 기능 선정 (도구·서비스·데이터) — 에이전트/시스템 사용 시나리오 정의
2. AppFunction 스키마 정의 (입력·출력 타입, 설명, 안전 제약)
3. 권한·동의 설정 — 데이터 접근 범위 최소화, 민감 작업 사용자 확인
4. 온디바이스 처리 우선 (Gemini Nano 연계 가능), 데이터 단말 이탈 최소화
5. 에이전트 연동 — 시스템이 앱을 온디바이스 MCP 서버로 호출하도록 등록

## 산출물
- AppFunction 정의 + 스키마(매개변수·반환)
- 권한 선언·동의 흐름
- 에이전트 호출 예시 + 계약 테스트(instrumented)
