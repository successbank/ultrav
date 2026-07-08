---
name: release-checklist
description: 배포 전 점검, 릴리스 준비, "배포해도 되는지 확인해줘" 요청 시 사용. Ultra 웹 단일 배포를 위한 lint→타입체크→빌드→시크릿→DB 상태→컨테이너 재기동 점검표를 실행한다.
---

# Release Checklist

Ultra(Next.js 웹 단일 서비스) 배포 전 점검표. 각 항목을 실제 명령으로 실행하고 결과(통과/실패)를 표로 보고한다. 하나라도 실패하면 배포 보류를 권고한다.

## 1. 코드 품질

```bash
docker exec ultra_app npm run lint
docker exec ultra_app npx tsc --noEmit
docker exec ultra_app npm run build
```

- [ ] ESLint 오류 0건
- [ ] TypeScript 타입 오류 0건
- [ ] 프로덕션 빌드 성공 (빌드 로그의 경고도 확인·보고)

## 2. 시크릿·환경변수

- [ ] `.env`, `.env.*` 파일이 커밋에 포함되지 않음: `git status`와 `git diff --cached --name-only`로 확인
- [ ] 코드에 하드코딩된 시크릿 없음: `git diff <base>...HEAD`에서 password/secret/key 패턴 점검
- [ ] `NEXTAUTH_SECRET`, `DATABASE_URL` 등 필수 환경변수가 배포 대상 `.env`에 정의되어 있는지 확인 (값은 출력하지 말 것)

## 3. DB 상태

```bash
docker exec ultra_app npx prisma migrate status
```

- [ ] 스키마와 DB 간 드리프트 없음 (`prisma db push` 자동 실행 환경이므로 schema.prisma 변경분이 반영됐는지 확인)
- [ ] 스키마 변경이 있었다면 시드(`npm run db:seed`) 호환 여부 확인
- [ ] 파괴적 변경이 포함됐다면 배포 전 백업: `docker exec ultra_db pg_dump -U <DB_USER> <DB_NAME> > backups/<날짜>.sql`

## 4. 컨테이너 재기동 확인

```bash
docker-compose down && docker-compose up -d
docker-compose logs -f app   # 기동 로그에 에러 없는지
```

- [ ] 4개 컨테이너(app/database/redis/adminer) 모두 healthy: `docker-compose ps`
- [ ] `http://localhost:5635` 홈 응답 200
- [ ] 핵심 플로우 스모크: 로그인, 상품 목록(`/products`), 관리자 로그인(`/admin`)

## 5. 롤백 계획

- [ ] 직전 정상 커밋 해시 기록 (`git log -1 --format=%H HEAD~1` 또는 마지막 배포 태그)
- [ ] 롤백 절차 확인: 해당 커밋으로 checkout 후 `docker-compose restart app`. 스키마 변경 포함 시 DB 롤백 절차 별도 명시

## 보고 형식

점검 완료 후 항목별 통과/실패 표와 최종 판정(배포 가능 / 보류 + 사유)을 제시하고, 배포는 Git PM(김현태) 승인 절차를 따른다.
