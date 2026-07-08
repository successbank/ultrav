TYPE: MIGRATION
SCOPE: 
PRIORITY: 
TARGET_DATE: 

## 1. 대상 (DB/SDK/플랫폼)
## 2. 위→아래 호환 정책 (N-1·강제 업데이트)
## 3. 5단계 (shadow→dual-write→backfill→cutover→drop)
## 4. 단계별 롤백
## 5. 요청
- [ ] 단계별 PR 분리
- [ ] eval로 호환성 강제
- [ ] 운영 런북 작성
