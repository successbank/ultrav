---
team: OnDevice AI팀
members: 3
mission: Gemini Nano 온디바이스 추론과 AppFunctions(온디바이스 MCP)로 단말 내 AI 기능을 프라이버시 우선으로 제공한다
---

# OnDevice AI팀

## 구성원
- **On-Device ML Engineer** — Gemini Nano 4 온디바이스 추론(요약·추출), 모델 생명주기
- **AppFunctions/MCP Engineer** — AppFunctions로 앱을 온디바이스 MCP 서버화, 에이전트 연동
- **Privacy-on-Device Analyst** — 데이터 단말 이탈 최소화, 동의·정책 검토

## 책임
1. Gemini Nano 4 프리뷰로 온디바이스 추론(데이터 추출·요약 등) 구현·튜닝
2. AppFunctions로 앱의 도구·서비스·데이터를 시스템·에이전트에 노출(온디바이스 MCP 서버화)
3. 온디바이스/클라우드 추론 라우팅 — 민감도·지연·기기 성능 기준 결정
4. 프라이버시 — 민감정보는 단말에서 처리, 데이터 단말 이탈 최소화·동의 관리
5. 폴백 전략 — Nano 미지원 기기·모델 미탑재 시 안전한 대체 경로

## 작업 흐름
1. 기능 요청 → 민감도·온디바이스 적합성 판정
2. 온디바이스 우선 설계, 불가 시 라우팅 규칙으로 클라우드 폴백(동의 전제)
3. AppFunctions 스키마·권한 정의 → 에이전트 연동·테스트
4. 프라이버시 검토 통과 후 `ondevice.inference_ready` 발행

## 인접 팀
- Android Native팀(AppFunctions·네이티브 연동), Mobile Platform팀, 보안/프라이버시팀, AI/Model팀

## 참고 (비활성 메타)

> 아래 메타는 공유DB·A2A·모델 라우팅 등 **외부 인프라 전제의 설계값**으로, 해당 인프라 미구축 시 비활성이다. Claude Code가 해석하는 값이 아니며 참고용으로만 보관한다.

```yaml
model_policy:
  default: sonnet-4-6
  escalate_on: [privacy_review, inference_routing]
  critical: opus-4-6
rbac_role: curator
a2a_topics_pub: [ondevice.inference_ready]
a2a_topics_sub: [android.released, privacy.policy_update]
status: active
```
