# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소의 코드를 작업할 때 참고할 가이드를 제공합니다.

## 프로젝트 개요

**Ultra**는 Docker 기반 개발 아키텍처로 구축된 Next.js 14 웹 애플리케이션입니다. SuccessBank 모노레포 전반에서 사용되는 표준화된 패턴을 따르는 최소한의 템플릿 기반 프로젝트로, 빠른 개발과 배포를 위해 설계되었습니다.

## claude code 소통언어
- 한국어

### 기술 스택

- **프레임워크**: Next.js 14.2.5 (App Router)
- **UI 라이브러리**: React 18.3.1
- **JavaScript**: Node.js 18 (Alpine)
- **런타임 환경**: Docker (Node.js 18-Alpine)
- **데이터베이스**: PostgreSQL 15 (Alpine)
- **캐싱/세션**: Redis 7 (Alpine)
- **데이터베이스 관리 UI**: Adminer
- **패키지 매니저**: npm

## 프로젝트 구조

```
/data/successbank/projects/ultra/
├── src/                        # Next.js 애플리케이션 소스 코드
│   ├── app/                    # Next.js App Router 페이지 및 레이아웃
│   │   └── page.js            # 홈 페이지 컴포넌트
│   ├── package.json           # Node.js 의존성 및 스크립트
│   ├── node_modules/          # 설치된 의존성 (docker 볼륨)
│   └── .next/                 # Next.js 빌드 출력 (docker 볼륨)
├── docker/                     # Docker 구성
│   └── Dockerfile             # 개발/프로덕션용 멀티스테이지 빌드
├── docker-compose.yml         # 서비스 오케스트레이션 (4-컨테이너 설정)
├── .env                        # 환경 변수 설정
├── logs/                       # 애플리케이션 로그 디렉토리
├── backups/                    # 데이터베이스 백업 디렉토리
├── .claude/                    # Claude Code 설정
│   └── settings.local.json    # 로컬 권한 및 설정
└── CLAUDE.md                  # 이 파일
```

## 환경 설정

프로젝트는 `.env` 파일에 정의된 환경 변수를 사용합니다:

```
# 프로젝트 식별
PROJECT_NAME=ultra
COMPOSE_PROJECT_NAME=ultra

# 서비스 포트
WEB_PORT=5635           # Next.js 애플리케이션
DB_PORT=5636            # PostgreSQL
REDIS_PORT=5637         # Redis 캐시
ADMINER_PORT=5638       # 데이터베이스 UI

# 데이터베이스 설정
DB_TYPE=postgres
DB_HOST=database        # 컨테이너 네트워크 호스트명
DB_NAME=ultra_db
DB_USER=ultra_user
DB_PASSWORD=lLi9CeCEgryaV3M06t9Oh3sKh
DB_ROOT_PASSWORD=ZRPZgAzFmiazqqcFwwxTnff2q

# 캐시 설정
REDIS_PASSWORD=zWh4S1PkIo3WQlkV

# 애플리케이션 설정
NODE_ENV=development
APP_ENV=development
UID=1000
GID=1000
```

## Docker 아키텍처

프로젝트는 4개 컨테이너로 구성된 Docker Compose 설정을 사용합니다:

### 서비스

1. **app**: Next.js 개발 서버
   - 이미지: `node:18-alpine`
   - 노출 포트: `5635` (WEB_PORT)
   - 볼륨 마운트:
     - `./src:/app:cached` - 소스 코드 (핫 리로드)
     - `/app/node_modules` - 익명 볼륨
     - `/app/.next` - 익명 볼륨
   - 시작 명령: `npm install && npm run dev`

2. **database**: PostgreSQL 15
   - 이미지: `postgres:15-alpine`
   - 노출 포트: `5636` (DB_PORT)
   - 볼륨: `postgres_data` - 영구 데이터 저장소
   - 헬스 체크: 활성화 (10초 간격, 5초 타임아웃, 5회 재시도)

3. **redis**: Redis 7 캐시
   - 이미지: `redis:7-alpine`
   - 노출 포트: `5637` (REDIS_PORT)
   - 볼륨: `redis_data` - 영구 데이터 저장소
   - 인증: 비밀번호 필수

4. **adminer**: 데이터베이스 관리 UI
   - 이미지: `adminer`
   - 노출 포트: `5638` (ADMINER_PORT)
   - 용도: 웹 기반 PostgreSQL 관리

### 네트워크

모든 컨테이너는 프로젝트 전용 브리지 네트워크를 통해 통신합니다: `app-network`

### 로깅

모든 서비스는 순환 방식의 JSON 파일 로깅을 사용합니다:
- 최대 파일 크기: 10MB
- 최대 파일 수: 3개 (최근 30MB의 로그 유지)

## Package.json 및 스크립트

위치: `/data/successbank/projects/ultra/src/package.json`

### 사용 가능한 NPM 스크립트

```bash
npm run dev       # Next.js 개발 서버 시작 (컨테이너 내부에서 실행)
npm run build     # 최적화된 프로덕션 빌드 생성
npm start         # 프로덕션 서버 시작
npm install       # 의존성 설치 (컨테이너 시작 시 자동 실행)
```

### 의존성

- `next`: 14.2.5
- `react`: 18.3.1
- `react-dom`: 18.3.1

## Dockerfile 구성

위치: `/data/successbank/projects/ultra/docker/Dockerfile`

3단계로 구성된 멀티스테이지 빌드:

### 1. 베이스 스테이지
- `node:18-alpine`을 기반으로 사용
- Next.js 텔레메트리 비활성화
- 호환성을 위한 libc6-compat 설치

### 2. 개발 스테이지 (`dev`)
- 작업 디렉토리: `/app`
- 환경: `NODE_ENV=development`
- 의존성 설치
- 포트 3000 노출
- 명령: `npm run dev`
- 참고: 소스 코드는 복사되지 않고 볼륨 마운트됨

### 3. 프로덕션 빌드 스테이지 (`builder`)
- npm ci로 의존성 설치
- 최적화를 위한 `npm run build` 실행
- 출력: `.next/standalone` 및 `.next/static`

### 4. 프로덕션 런타임 스테이지 (`production`)
- 필요한 파일만 포함된 최소 이미지
- 비루트 사용자: `nextjs` (UID 1001)
- 실행: `node server.js`

## 개발 워크플로우

### 프로젝트 시작하기

```bash
# 프로젝트 디렉토리로 이동
cd /data/successbank/projects/ultra

# 모든 서비스 시작
docker-compose up -d

# 로그 보기
docker-compose logs -f app

# 서비스 중지
docker-compose down
```

### 서비스 접속

- **Next.js 앱**: http://localhost:5635
- **Adminer (DB UI)**: http://localhost:5638
- **PostgreSQL**: `localhost:5636` (호스트에서) 또는 `database:5432` (컨테이너 내부)
- **Redis**: `localhost:5637` (호스트에서) 또는 `redis:6379` (컨테이너 내부)

### 컨테이너 작업

```bash
# app 컨테이너 접속
docker exec -it ultra_app sh

# PostgreSQL CLI 접속
docker exec -it ultra_db psql -U ultra_user -d ultra_db

# 컨테이너 상태 확인
docker-compose ps

# 코드 변경 후 재시작
docker-compose restart app
```

### 데이터베이스 자격증명

컨테이너 내부에서 사용:
- 호스트: `database` (컨테이너 네트워크 호스트명)
- 포트: `5432`
- 사용자: `ultra_user`
- 비밀번호: `lLi9CeCEgryaV3M06t9Oh3sKh`
- 데이터베이스: `ultra_db`

호스트 머신에서 사용:
- 호스트: `localhost`
- 포트: `5636` (컨테이너에서 매핑됨)

## 중요한 개발 패턴

1. **호스트에서 직접 `npm run dev` 실행하지 않기** - 팀원 간 일관성을 유지하고 포트 충돌을 피하기 위해 항상 Docker Compose를 사용하세요.

2. **소스 코드 볼륨 마운트** - `./src:/app:cached` 볼륨 마운트는 핫 리로드를 가능하게 합니다. `src/` 내 파일 변경 사항은 컨테이너 재시작 없이 즉시 반영됩니다.

3. **Node Modules 및 빌드 캐시** - `node_modules`와 `.next` 디렉토리는 익명 볼륨에 보관되어 호스트와 Alpine 컨테이너 간 OS별 충돌을 방지합니다.

4. **데이터베이스 연결 문자열** - 컨테이너 내부에서는 항상 컨테이너 네트워크 호스트명 `database`를 사용하세요 (`localhost` 사용 금지). 호스트에서는 `localhost:5636`을 사용하세요.

5. **환경 변수** - `DATABASE_URL`과 `REDIS_URL`은 `.env` 변수로부터 자동으로 구성되어 app 컨테이너에 주입됩니다.

6. **핫 리로드 설정** - `WATCHPACK_POLLING=true`는 표준 파일 시스템 이벤트가 안정적으로 작동하지 않는 Docker 환경에서 파일 감시를 활성화합니다.

7. **Next.js 텔레메트리** - `NEXT_TELEMETRY_DISABLED=1`을 통해 비활성화되어 개발 중 외부 네트워크 호출을 방지합니다.

## Next.js App Router 구조

프로젝트는 Next.js App Router(파일 기반 라우팅)를 사용합니다:

```
src/app/
├── page.js          # 경로: /
└── [other routes]   # 필요에 따라 추가
```

- `page.js` 또는 `page.tsx`로 명명된 파일이 라우트를 정의합니다
- `layout.js` 파일은 공유 레이아웃을 정의합니다
- 동적 라우트는 `[param]` 문법을 사용합니다
- 각 디렉토리 레벨이 URL 세그먼트가 됩니다

## 데이터 영속성

### PostgreSQL 데이터
- 볼륨: `postgres_data`
- 컨테이너 내 위치: `/var/lib/postgresql/data`
- 컨테이너 재시작 및 down/up 사이클에서 유지됨

### Redis 데이터
- 볼륨: `redis_data`
- 컨테이너 내 위치: `/data`
- 컨테이너 재시작에서 유지됨

### 백업
- 수동 데이터베이스 백업은 `/backups` 디렉토리에 저장할 수 있습니다
- 백업/복원 작업은 컨테이너 로그를 참조하세요

## 로그

애플리케이션 및 컨테이너 로그는 자동 순환 방식으로 `/logs` 디렉토리에 저장됩니다:
- 파일당 최대 크기: 10MB
- 보존 기간: 3개 파일 (약 30MB 총량)
- 형식: 타임스탬프, 소스, 스트림 정보가 포함된 JSON

## 추가 참고사항

### 프로젝트 템플릿 상태
이 프로젝트는 템플릿 또는 최소 스타터 애플리케이션으로 보입니다:
- 최소한의 의존성만 포함 (Next.js, React, React-DOM만)
- 플레이스홀더 콘텐츠가 있는 단일 페이지 (`page.js`)
- 기능 개발 준비 완료

### 개발을 위한 다음 단계
1. `src/app/`에 추가 페이지로 App Router 확장
2. `src/package.json`에 필요한 의존성 추가
3. 필요한 경우 데이터베이스 스키마 및 ORM 구성 (Prisma 권장)
4. `src/app/api/`에 API 라우트 구현
5. 스타일링 솔루션 추가 (Tailwind CSS, styled-components 등)

### 성능 고려사항
- 멀티스테이지 Docker 빌드로 프로덕션 이미지 크기 최적화
- Alpine 이미지로 기본 크기 및 공격 표면 최소화
- node_modules의 볼륨 마운팅으로 소스 변경 시 npm 재설치 방지
- `.next`용 익명 볼륨으로 빌드 캐시 일관성 보장

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md
