---
name: migration-write
description: DB/SDK/플랫폼 마이그레이션을 위→아래 호환 5단계(shadow→dual-write→backfill→cutover→drop)로 자동 생성.
---

# Migration Write

## 단계 강제
- 각 단계 PR을 별도로 생성
- 마이그레이션 down 스크립트 필수
- 영향 모니터링 SLO 정의

## 안전 가드
- prod 적용 전 staging에서 24h 관찰
- 실패 시 자동 롤백 트리거
