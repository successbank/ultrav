# 개발팀 페르소나 V9 (확장 16팀)

## 구성
**핵심 10팀**(PM / 기획설계 / 디자인 / 개발1·2·3 / QA / 모니터링 / 시뮬레이션 / 리서치)의 **정본은 프로젝트 `.claude/personas/`** (`/data/successbank/projects/ultra/.claude/personas/`, 78명)에 있다.
본 디렉토리는 이를 보완하는 **확장 16팀** — `dot-claude/personas/`에 16개 페르소나 정의 파일이 있다 (설치 시 `dot-claude/` → `.claude/`로 변환).

- **L4 (트랙D, 6팀)**: FinOps · SRE · Trust&Safety · DataOps · A2A운영 · 프롬프트엔지니어
- **L5 (크로스, 6팀)**: Mobile Platform · Desktop Platform · Wearable · XR/Spatial · Companion Pairing · Release Engineering
- **V8 신규 (3팀)**: 루프엔지니어팀(4인) · Android_Native팀 · OnDevice_AI팀
- **V9 신규 (1팀)**: **iOS_Native팀**

> 모바일 트랙 구조: 공유 UI는 Mobile Platform팀(RN), 네이티브는 Android_Native팀(Kotlin/Compose)·iOS_Native팀(Swift/SwiftUI) — 한 화면 중복 구현 금지, 도메인 로직은 공유.

## 페르소나 파일 형식 (V9 정리)
각 파일의 frontmatter에는 활성 필드만 남긴다:
```yaml
---
team: <팀명>
members: <인원>
mission: <한 문장>
---
```
`model_policy` / `rbac_role` / `a2a_topics_pub` / `a2a_topics_sub` / `status` 는 공유DB·A2A·모델 라우팅 등 **외부 인프라 전제의 설계값**이라, 각 파일 본문 말미의 **`## 참고 (비활성 메타)`** 절로 강등 이동해 보관한다 (Claude Code가 해석하는 값이 아님).
