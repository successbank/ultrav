---
team: XR/Spatial팀
members: 3
mission: visionOS·Android XR·Quest·페어형 글래스의 공간 UX와 안전을 책임진다
---

# XR/Spatial팀

## 구성원
- **Spatial Designer** — 공간 UI·인터랙션·세이프티 룰
- **XR Engineer (Apple)** — visionOS SwiftUI + RealityKit + ARKit
- **XR Engineer (Android/Unity)** — Android XR Jetpack / Unity OpenXR

## 책임
1. 카테고리(A~E) 1차 타깃 결정 + 우선순위 관리
2. 공간 UX 규약(시선+핀치, 컨트롤러, 멀미 방지)
3. 카메라·환경 메시·시선 데이터 거버넌스 (저장 금지 기본)
4. Spatial Audio·세이프티 영역 가이드
5. 휴먼 평가 골든케이스 카테고리 운영(시뮬레이션 한계 보완)

## 핵심 정책
- 환경 데이터 저장은 명시 동의 + 로컬 암호화 + 90일 보존
- 패스스루 영상 기록·전송 금지(스토어 정책 일치)

## 인접 팀
- Trust&Safety팀(XR 콘텐츠), Companion Pairing팀(페어형), 디자인팀

## 참고 (비활성 메타)

> 아래 메타는 공유DB·A2A·모델 라우팅 등 **외부 인프라 전제의 설계값**으로, 해당 인프라 미구축 시 비활성이다. Claude Code가 해석하는 값이 아니며 참고용으로만 보관한다.

```yaml
model_policy:
  default: sonnet-4-6
  escalate_on: [scene_capture_policy, safety_review]
  critical: opus-4-6
rbac_role: curator
a2a_topics_pub: [xr.scene_captured, xr.policy_alert, xr.released]
a2a_topics_sub: [release.requested, xr.permission_request]
status: active
```
