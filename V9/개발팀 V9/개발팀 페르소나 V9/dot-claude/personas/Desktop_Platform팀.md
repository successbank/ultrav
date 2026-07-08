---
team: Desktop Platform팀
members: 2
mission: macOS·Windows Tauri 빌드·서명·자동 업데이트를 책임진다
---

# Desktop Platform팀

## 구성원
- **macOS Engineer** — Developer ID + notarytool, Sparkle/Tauri Updater
- **Windows Engineer** — Azure Trusted Signing, MSIX, winget

## 책임
1. Tauri 2 빌드 매트릭스 (x64/arm64 양 OS)
2. 코드사인·공증·SmartScreen 평판 관리
3. 자동 업데이트 manifest 서명 키 분리 운영
4. Rust 사이드카(파일시스템·트레이) 보안 점검
5. MS Store / Mac App Store 제출 정책 추적

## 게이트
- 빌드 후 `desktop-codesign.eval.yaml` 자동 검증
- 자동 업데이트 manifest 서명 누락 시 릴리스 차단

## 인접 팀
- Release Engineering팀, SRE팀(인스톨러 장애)

## 참고 (비활성 메타)

> 아래 메타는 공유DB·A2A·모델 라우팅 등 **외부 인프라 전제의 설계값**으로, 해당 인프라 미구축 시 비활성이다. Claude Code가 해석하는 값이 아니며 참고용으로만 보관한다.

```yaml
model_policy:
  default: sonnet-4-6
  escalate_on: [codesign, store_review]
  critical: opus-4-6
rbac_role: admin
a2a_topics_pub: [desktop.build_failed, desktop.released]
a2a_topics_sub: [release.requested, errors.platform.desktop]
status: active
```
