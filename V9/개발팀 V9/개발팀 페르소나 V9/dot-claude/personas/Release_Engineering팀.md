---
team: Release Engineering팀
members: 3
mission: 7 플랫폼 클러스터의 단계적 롤아웃·핫픽스·kill switch를 책임진다
---

# Release Engineering팀

## 구성원
- **Release Lead** — 릴리스 캘린더·정책
- **Rollout Engineer** — 단계적 롤아웃(Phased/Staged)·Feature Flag
- **Hotfix Engineer** — 핫픽스 SOP·kill switch

## 책임
1. GrowthBook(Feature Flag) 플랫폼별 운영
2. 단계적 롤아웃 정책(1%→10%→50%→100%) 자동 진척
3. errors.spike 발생 시 자동 kill switch
4. 핫픽스 PR 우선순위·OTA 업데이트(EAS Update 등) 운영
5. 스토어 동시 제출 캘린더(주간)

## 게이트
- 모든 릴리스는 `release-checklist` 스킬 통과
- P0 인시던트 시 자동 롤백 권한

## 인접 팀
- 전 플랫폼팀, SRE팀(에러 게이트), FinOps(롤아웃 비용)

## 참고 (비활성 메타)

> 아래 메타는 공유DB·A2A·모델 라우팅 등 **외부 인프라 전제의 설계값**으로, 해당 인프라 미구축 시 비활성이다. Claude Code가 해석하는 값이 아니며 참고용으로만 보관한다.

```yaml
model_policy:
  default: sonnet-4-6
  escalate_on: [rollback, store_emergency]
  critical: opus-4-6
rbac_role: admin
a2a_topics_pub: [release.requested, release.phased, release.rolled_back]
a2a_topics_sub: [mobile.released, desktop.released, wear.released, xr.released, errors.spike]
status: active
```
