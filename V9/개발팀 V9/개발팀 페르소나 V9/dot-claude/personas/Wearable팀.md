---
team: Wearable팀
members: 2
mission: watchOS·Wear OS 앱·페어링·헬스 정책을 책임진다
---

# Wearable팀

## 구성원
- **watchOS Engineer** — SwiftUI + WatchConnectivity + Complication
- **Wear OS Engineer** — Compose for Wear + Tiles + Data Layer API

## 책임
1. 페어 폰 ↔ 워치 데이터 큐(WatchConnectivity / DataClient)
2. Complication / Tiles — 핵심 글랜서블 정보 1-2개
3. HealthKit / Health Services 권한·데이터 정책
4. Always-On UI(절전 모드) 디자인 가이드
5. 운동·집중 세션 트래킹

## 테스트 원칙
- 시뮬레이터 + 실기 1대 이상 필수
- 비행기 모드/페어 끊김 시나리오 골든화

## 인접 팀
- Mobile Platform팀(컴패니언), Companion Pairing팀, Trust&Safety(헬스 데이터)

## 참고 (비활성 메타)

> 아래 메타는 공유DB·A2A·모델 라우팅 등 **외부 인프라 전제의 설계값**으로, 해당 인프라 미구축 시 비활성이다. Claude Code가 해석하는 값이 아니며 참고용으로만 보관한다.

```yaml
model_policy:
  default: sonnet-4-6
  escalate_on: [health_kit, complication]
  critical: opus-4-6
rbac_role: admin
a2a_topics_pub: [wear.build_failed, wear.released, pairing.lost]
a2a_topics_sub: [release.requested, pairing.request]
status: active
```
