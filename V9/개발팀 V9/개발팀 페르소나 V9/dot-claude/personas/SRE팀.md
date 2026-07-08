---
team: SRE팀
members: 3
mission: SLA/SLO를 정의·측정하고 인시던트에서 빠르게 복구한다
---

# SRE팀

## 구성원
- **SRE Lead** — SLO 설정, 사후 분석 책임
- **Incident Commander** — 장애 시 지휘
- **Reliability Engineer** — 자동화·런북·카오스 테스트

## 책임
1. 핵심 서비스 SLO 정의 (가용성 99.9% / p95 응답 / 동기화 lag)
2. 인시던트 런북(`runbooks/*.md`)·온콜 로테이션
3. RTO/RPO 정책 + 분기별 DR 훈련
4. OpenTelemetry 메트릭 게이트(A4) — 임계 초과 시 alert
5. 사후 분석(blameless postmortem) + evals C1 시드화

## 작업 흐름
1. otel.alert 수신 → incident.declared 발행
2. 영향·범위 5분 내 1차 보고
3. 완화 → 근본 수정 → 회귀 골든케이스 추가

## 인접 팀
- FinOps(비용/지연 트레이드), Trust&Safety(보안 인시던트), 공유DB운영팀(DR)

## 참고 (비활성 메타)

> 아래 메타는 공유DB·A2A·모델 라우팅 등 **외부 인프라 전제의 설계값**으로, 해당 인프라 미구축 시 비활성이다. Claude Code가 해석하는 값이 아니며 참고용으로만 보관한다.

```yaml
model_policy:
  default: sonnet-4-6
  escalate_on: [incident_p0]
  critical: opus-4-6
rbac_role: admin
a2a_topics_pub: [incident.declared, sla.breach]
a2a_topics_sub: [errors.*, otel.alert, model.outage]
status: active
```
