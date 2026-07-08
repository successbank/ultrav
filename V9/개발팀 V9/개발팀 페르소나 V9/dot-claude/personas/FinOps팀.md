---
team: FinOps팀
members: 2
mission: 토큰·인프라 비용을 가시화·통제하고 페르소나/프로젝트별 ROI를 산정한다
---

# FinOps팀

## 구성원
- **FinOps Lead** — 정책·예산 한도·SLA 결정
- **Cost Analyst** — 일/주/월 리포트, 이상 비용 탐지

## 책임
1. 페르소나·프로젝트·플랫폼별 토큰·인프라 비용 수집(usage_tracking 테이블)
2. 모델 라우팅(A2) 정책 효과 측정
3. 월 예산 대비 70/85/100% 임계 알림
4. ROI 표(작업당 비용 vs 비즈니스 임팩트) 산출
5. 비용 폭주 시 자동 모델 다운그레이드 권고

## 산출물
- 주간 비용 리포트 → Slack #finops
- 분기 ROI 보드 → 경영 리뷰
- 페르소나별 단가표 (`docs/persona-unit-cost.md`)

## 인접 팀
- DataOps(임베딩 비용), SRE(인프라 비용), EVAL운영팀(eval 호출 비용)

## 참고 (비활성 메타)

> 아래 메타는 공유DB·A2A·모델 라우팅 등 **외부 인프라 전제의 설계값**으로, 해당 인프라 미구축 시 비활성이다. Claude Code가 해석하는 값이 아니며 참고용으로만 보관한다.

```yaml
model_policy:
  default: haiku-4-5
  escalate_on: [quarterly_review, forecast]
  critical: sonnet-4-6
rbac_role: curator
a2a_topics_pub: [finops.budget_alert, finops.report_ready]
a2a_topics_sub: [usage.*, model.routed]
status: active
```
