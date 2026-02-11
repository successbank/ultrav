# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 개발팀 페르소나
- /home/successbank/projects/ultra/.claude/CLAUDE.md

## 소통 언어
- 한국어

## 프로젝트 개요

**Ultra**는 B2B/B2C 하이브리드 온라인 쇼핑몰(의료기기/용품)로, Docker 기반 개발 환경에서 구동됩니다. 일반 사용자 쇼핑, 병원 고객 견적 시스템, 영업매니저 대시보드, 관리자 패널을 포함합니다.

- **프레임워크**: Next.js 14.2.5 (App Router, TypeScript)
- **ORM**: Prisma 5 + PostgreSQL 15
- **인증**: NextAuth v5 (beta.25) with JWT strategy, Credentials provider
- **상태관리**: Zustand (클라이언트), Redis 7 (서버 캐시/세션)
- **스타일링**: Tailwind CSS 3 + Radix UI + shadcn/ui 패턴 (CVA + clsx + tailwind-merge)
- **아이콘**: Lucide React
- **이미지**: sharp (서버), Swiper (캐러셀), yet-another-react-lightbox (갤러리)
- **PDF**: jspdf + jspdf-autotable (견적서 PDF 생성, 한글 폰트 내장)

## 개발 명령어

```bash
# 서비스 시작/중지
docker-compose up -d
docker-compose down
docker-compose logs -f app

# 컨테이너 내부에서 실행 (docker exec -it ultra_app sh)
npx prisma generate        # Prisma 클라이언트 생성
npx prisma db push         # 스키마를 DB에 반영
npx prisma studio          # DB GUI (브라우저)
npm run db:seed             # 시드 데이터 (tsx prisma/seed.ts)
npm run lint                # ESLint

# 서비스 포트
# 웹: localhost:5635 | DB: localhost:5636 | Redis: localhost:5637 | Adminer: localhost:5638
```

docker-compose 시작 시 자동으로 `npm install --legacy-peer-deps && prisma generate && prisma db push && npm run dev`가 실행됩니다. 호스트에서 직접 `npm run dev` 실행 금지.

## 아키텍처

### 4개 사용자 역할과 라우트 그룹

| 역할 | enum | 라우트 | 레이아웃 접근제어 |
|------|------|--------|-----------------|
| 일반 사용자 | `USER` | `/`, `/products`, `/mypage/*`, `/cart` | 로그인 필요 (middleware) |
| 병원 고객 | `HOSPITAL` | `/mypage/quotes/*` | USER와 동일 + 견적서 확인 |
| 영업매니저 | `SALES_MANAGER` | `/sales-manager/*` | 역할 검증 (layout) |
| 관리자 | `ADMIN` | `/admin/*` | 역할 검증 (middleware + layout) |

### 인증 아키텍처 (NextAuth v5 split config)

- `src/lib/auth.config.ts`: Edge-compatible 설정 (JWT 콜백, 세션 콜백). **middleware에서 사용** — Node.js API (Prisma, bcrypt)를 import하면 안 됨
- `src/lib/auth.ts`: 전체 설정 (PrismaAdapter, CredentialsProvider, 로그인 기록). **서버 컴포넌트/API에서 사용**
- `src/middleware.ts`: auth.config 기반 미들웨어. 로그인 페이지 리다이렉트, 관리자 접근제어 담당
- 세션에 `user.id`와 `user.role`이 JWT를 통해 포함됨 (auth.config.ts의 type augmentation 참조)

### App Router 구조

```
src/app/
├── (공개)     page, about, contact, faq, products, products/[id], login
├── admin/
│   ├── (auth)/login/          # 관리자 로그인 (별도 레이아웃, Header/Footer 없음)
│   └── (protected)/           # 관리자 전용 (AdminSidebar + AdminHeader 레이아웃)
│       ├── dashboard, products, orders, users, reviews, categories, quotes
│       └── settings/carousels/  # 캐러셀 CRUD
├── mypage/                    # 마이페이지 (사이드바 레이아웃)
│   ├── orders, wishlist, settings, login-history, quotes
├── sales-manager/             # 영업매니저 (전용 헤더/네비 레이아웃)
│   ├── customers, customers/[id]/quote, quotes
├── cart/
└── api/                       # API 라우트 (아래 참조)
```

### API 라우트 패턴

- `/api/auth/[...nextauth]` — NextAuth 핸들러
- `/api/auth/register` — 회원가입
- `/api/cart`, `/api/wishlist`, `/api/contact` — 사용자 기능
- `/api/products/[id]/reviews` — 상품 리뷰 CRUD
- `/api/admin/*` — 관리자 전용 (products, categories, reviews, quotes, carousels)
- `/api/sales-manager/*` — 영업매니저 전용 (customers, quotes)
- `/api/quotes/*` — 고객 견적서 조회/응답
- `/api/upload/review-images` — 리뷰 이미지 업로드

### 핵심 데이터 모델 (Prisma)

스키마: `src/prisma/schema.prisma`

주요 모델: User, Product, Category(3레벨 계층), Cart/CartItem, Order/OrderItem, Review(승인제), Quote/QuoteItem(견적서), Carousel, Contact, LoginHistory, Wishlist

- Category는 자기참조 관계 (parentId)로 대/중/소 3단계 분류
- Product 가격은 `Int` (원화, 원 단위), 할인은 `%`
- Review는 PENDING → APPROVED/REJECTED 승인 워크플로우
- Quote는 PENDING → SENT → APPROVED/REJECTED → ORDERED 워크플로우

### 주요 라이브러리 사용

- `src/lib/prisma.ts` — Prisma 싱글턴 (globalThis 패턴으로 핫리로드 시 연결 관리)
- `src/lib/redis.ts` — Redis 클라이언트 + 장바구니 캐시 헬퍼 (7일 TTL)
- `src/lib/pdfGenerator.ts` — 견적서 PDF 생성 (한글 폰트 Base64 내장)
- `src/lib/loginHistory.ts` — 로그인 기록 저장 (IP, UA, GeoIP)
- `src/components/ui/*` — shadcn/ui 스타일 컴포넌트 (Button, Input, Card, etc.)
- `src/components/providers/SessionProvider.tsx` — NextAuth SessionProvider 래퍼

## 중요 규칙

1. **Docker 전용 개발** — `./src:/app:cached` 볼륨 마운트로 핫리로드. node_modules와 .next는 도커 볼륨
2. **컨테이너 내 DB 호스트** — `database:5432` 사용 (localhost 금지)
3. **node:18-slim** 이미지 사용 (Prisma Debian binary 호환을 위해 alpine이 아닌 slim)
4. **Prisma 바이너리** — `debian-openssl-3.0.x` 타겟 필요 (docker-compose.yml의 PRISMA_CLI_BINARY_TARGETS)
5. **npm install --legacy-peer-deps** — peer dependency 충돌 방지를 위해 필수
6. **이미지 도메인** — next.config.js에 Unsplash, AWS S3, Cloudinary 허용됨
