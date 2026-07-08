# FinOps 가이드 (V7)

## 측정
- usage_tracking + usage_daily 뷰
- 페르소나·프로젝트·모델별 비용

## 정책
- 페르소나 default_model 명시
- escalate_on / critical 조건만 상위 모델
- 일/월 한도 70/85/100% 임계 알람

## 권고
- 자동 다운그레이드: 일 한도 90% 초과 시 critical 외 호출 강제 Haiku
