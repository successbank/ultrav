---
name: migration-write
description: Prisma 스키마 변경, DB 마이그레이션 작성, 컬럼/테이블 변경·삭제·이름변경이 필요할 때 사용. 위→아래 호환 5단계(expand → dual-write → backfill → cutover → contract)로 안전한 마이그레이션을 설계한다.
---

# Migration Write

파괴적 DB 변경을 무중단·롤백 가능하게 수행하기 위한 스킬. Ultra의 Prisma + PostgreSQL 환경 기준.

## Ultra 실환경

- 스키마 위치: `src/prisma/schema.prisma` (컨테이너 내부에서는 `/app/prisma/schema.prisma`)
- 모든 Prisma 명령은 컨테이너 안에서 실행:
  ```bash
  docker exec -it ultra_app npx prisma migrate dev --name <설명적_이름>
  docker exec -it ultra_app npx prisma generate
  ```
- 주의: docker-compose 시작 시 자동으로 `prisma db push`가 실행됨. **migrate 기반 변경과 db push를 섞으면 드리프트가 발생**하므로, 마이그레이션 작업 시작 전 `docker exec -it ultra_app npx prisma migrate status`로 현재 상태를 확인하고 사용자에게 보고할 것
- DB 접속 확인: `docker exec -it ultra_db psql -U <DB_USER> -d <DB_NAME>` (호스트명은 컨테이너 내에서 `database:5432`)

## 5단계 호환 마이그레이션

단순 추가(nullable 컬럼, 새 테이블)는 1단계로 충분. **삭제·이름변경·타입변경**은 반드시 아래 5단계로 분리한다:

1. **expand** — 새 컬럼/테이블을 기존과 병행 추가 (nullable 또는 default 필수). 기존 코드는 영향 없음
2. **dual-write** — 애플리케이션 코드가 구/신 양쪽에 쓰도록 변경 (읽기는 아직 구)
3. **backfill** — 기존 데이터를 신규 구조로 이관하는 스크립트 작성·실행. 건수 검증 쿼리 포함
4. **cutover** — 읽기를 신규 구조로 전환. 문제 시 읽기만 되돌리면 롤백 완료
5. **contract** — 충분한 관찰 기간 후 구 컬럼/테이블 제거

## 규칙

- 각 단계는 **별도 커밋/PR**로 분리 — 단계별 독립 롤백 가능해야 함
- 각 단계마다 롤백 방법을 명시 (Prisma migrate는 down을 자동 생성하지 않으므로 되돌리기 SQL 또는 역방향 마이그레이션을 함께 작성)
- backfill 전 데이터 백업 권장: `docker exec ultra_db pg_dump -U <DB_USER> <DB_NAME> > backups/<날짜>.sql`
- 시드 데이터(`src/prisma/seed.ts`)가 변경된 스키마와 호환되는지 확인
- 스키마 변경은 DB 일관성 검토(윤성호/배지영) 대상 — 산출물에 검토 요청을 명시
