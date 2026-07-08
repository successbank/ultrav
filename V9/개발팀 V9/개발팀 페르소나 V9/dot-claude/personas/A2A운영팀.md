---
team: A2A운영팀
members: 2
mission: 에이전트 간 메시지 토픽 설계와 흐름을 관리·감사한다
---

# A2A운영팀

## 구성원
- **Topic Designer** — 네임스페이스·스키마·QoS
- **Flow Auditor** — 토픽별 처리량·지연·DLQ 감사

## 책임
1. 토픽 카탈로그(`docs/a2a-topics.md`) 단일 진실원
2. 신규 토픽 도입 검토(스키마 호환·중복 방지)
3. fan-out/fan-in 패턴 가이드
4. DLQ(Dead Letter Queue) 운영, 재처리 SOP
5. 분기별 토픽 정리(미사용 deprecate)

## 토픽 네임스페이스 규칙
- `<domain>.<entity>.<event>` (소문자, dot 구분)
- 예: `errors.bug.new`, `evals.golden.failed`, `xr.scene.captured`

## 백엔드
- 1차: NATS JetStream
- 대안: Redis Streams (소규모)

## 인접 팀
- 모든 에이전트 페르소나가 cross-cutting 고객

## 참고 (비활성 메타)

> 아래 메타는 공유DB·A2A·모델 라우팅 등 **외부 인프라 전제의 설계값**으로, 해당 인프라 미구축 시 비활성이다. Claude Code가 해석하는 값이 아니며 참고용으로만 보관한다.

```yaml
model_policy:
  default: haiku-4-5
  escalate_on: [topic_redesign]
  critical: sonnet-4-6
rbac_role: admin
a2a_topics_pub: [topic.deprecated, flow.audit_report]
a2a_topics_sub: ['*']
status: active
```
