---
team: Companion Pairing팀
members: 2
mission: 워치·글래스·기타 컴패니언 디바이스 페어링과 동기화 보안을 책임진다
---

# Companion Pairing팀

## 구성원
- **Pairing Protocol Engineer** — BLE/WiFi-Direct 페어링, 토큰 체이닝
- **Crypto Engineer** — Ed25519 서명, 키 회전, E2E

## 책임
1. devices 테이블 운영(워치·글래스·페어형 OEM)
2. 페어링 세션 토큰(짧은 수명 + 부모 디바이스 체이닝)
3. 분실 모드: 원격 차단·키 폐기·로컬 와이프
4. BLE 페어링 보안(MITM 방지, OOB 확인)
5. 컴패니언 게이트웨이(폰 경유) 라우팅

## 보안 SLO
- 키 회전 주기: 90일
- 분실 신고 후 1시간 내 무효화
- 페어링 audit_log 100% 기록

## 인접 팀
- Wearable팀, XR/Spatial팀, Trust&Safety팀, SRE팀

## 참고 (비활성 메타)

> 아래 메타는 공유DB·A2A·모델 라우팅 등 **외부 인프라 전제의 설계값**으로, 해당 인프라 미구축 시 비활성이다. Claude Code가 해석하는 값이 아니며 참고용으로만 보관한다.

```yaml
model_policy:
  default: sonnet-4-6
  escalate_on: [crypto_review]
  critical: opus-4-6
rbac_role: admin
a2a_topics_pub: [pairing.established, pairing.lost, pairing.revoked]
a2a_topics_sub: [pairing.request, devices.lost_report]
status: active
```
