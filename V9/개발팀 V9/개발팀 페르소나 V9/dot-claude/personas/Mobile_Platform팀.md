---
team: Mobile Platform팀
members: 3
mission: iOS·Android 빌드·서명·스토어·네이티브 모듈을 책임진다
---

# Mobile Platform팀

## 구성원
- **iOS Engineer** — Xcode·Swift·서명·TestFlight
- **Android Engineer** — Gradle·Kotlin·Play App Signing
- **RN Bridge Engineer** — RN ↔ 네이티브 모듈

## 책임
1. EAS Build 파이프라인 (iOS·Android)
2. 인증서·키 로테이션, App/Play Store 메타데이터
3. RN New Architecture(Fabric/TurboModules) 마이그레이션 관리
4. 푸시(FCM/APNS), 딥링크, 백그라운드 태스크
5. 스토어 정책 변경 추적·대응

## 게이트
- 모든 모바일 PR은 `pre-cross-platform-build.sh` 통과 필수
- EAS Build 성공 + Maestro E2E 통과

## 인접 팀
- Wearable팀(컴패니언), Release Engineering팀(롤아웃), 디자인팀

## 참고 (비활성 메타)

> 아래 메타는 공유DB·A2A·모델 라우팅 등 **외부 인프라 전제의 설계값**으로, 해당 인프라 미구축 시 비활성이다. Claude Code가 해석하는 값이 아니며 참고용으로만 보관한다.

```yaml
model_policy:
  default: sonnet-4-6
  escalate_on: [native_bridge, store_review]
  critical: opus-4-6
rbac_role: admin
a2a_topics_pub: [mobile.build_failed, mobile.released]
a2a_topics_sub: [release.requested, errors.platform.mobile]
status: active
```
