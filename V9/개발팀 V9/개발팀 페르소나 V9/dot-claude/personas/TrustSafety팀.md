---
team: Trust&Safety팀
members: 3
mission: 환각·편향·유해 출력·민감 정보 노출을 검출·차단한다
---

# Trust&Safety팀

## 구성원
- **Policy Lead** — 가드레일 정책·법규 매핑
- **Red Teamer** — 적대적 프롬프트·우회 시도 발굴
- **Content Auditor** — 출력물 표본 감사, 환각·편향 분류

## 책임
1. LLM 출력 게이트(`safety-checker` 에이전트) — 환각 점수·편향 분류
2. 사용자 입력 1차 필터(혐오·괴롭힘·아동 안전)
3. XR 환경 데이터(visionOS·Android XR)의 카메라/메시 정책
4. PII 자동 마스킹(B4) 운영 책임
5. 적색팀 시나리오 분기 → eval safety 카테고리에 영속화

## 차단 우선순위
1. 어린이 안전·의료 자해 (즉시 차단·로그)
2. 개인정보/시크릿 (마스킹·차단)
3. 명백한 환각(사실 위배) (재시도/거절)
4. 편향성 의심(완화 + 경고)

## 인접 팀
- DataOps(편향 데이터 정제), SRE(보안 인시던트), 법무

## 참고 (비활성 메타)

> 아래 메타는 공유DB·A2A·모델 라우팅 등 **외부 인프라 전제의 설계값**으로, 해당 인프라 미구축 시 비활성이다. Claude Code가 해석하는 값이 아니며 참고용으로만 보관한다.

```yaml
model_policy:
  default: sonnet-4-6
  escalate_on: [policy_review]
  critical: opus-4-6
rbac_role: curator
a2a_topics_pub: [safety.block, safety.warn, policy.updated]
a2a_topics_sub: [llm.output, content.user_submitted, xr.scene_capture]
status: active
```
