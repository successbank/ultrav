---
name: bugfix-rca
description: 버그 보고 → 5-Why RCA → 최소 수정 + 회귀 테스트 + 골든 케이스 승격 제안.
---

# Bugfix RCA

## 산출물
1. RCA 5단계 (why1~why5)
2. 최소 변경 patch (diff)
3. 회귀 테스트 추가
4. 유사 패턴 grep 결과 → 동일 클래스 후속 PR 후보
5. evals 후보 1건 (eval-golden-from-issue 호출)
