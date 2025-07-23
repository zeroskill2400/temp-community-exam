# Next.js 커뮤니티 프로젝트

Next.js와 Supabase를 활용한 실시간 커뮤니티 웹 애플리케이션 개발 실습

## 프로젝트 목표

현대적인 웹 개발 기술을 활용하여 완전한 커뮤니티 플랫폼을 구축하고, 실무에서 사용되는 핵심 기능들을 단계적으로 학습합니다.

## 기술 스택

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, 인증, 실시간 구독)
- **상태 관리**: Zustand
- **배포**: Vercel

## 주요 기능

### ✅ 구현 완료된 기능

- 🔐 **인증 시스템**: 회원가입, 로그인, 로그아웃
- 🛡️ **Protected Routes**: 인증된 사용자만 접근 가능한 페이지
- 💬 **게시판**: 게시글 작성, 읽기, 삭제, 댓글 시스템
- 🛍️ **상품 관리**: 상품 목록 조회, 장바구니 기능
- 👤 **프로필 관리**: 사용자 프로필 수정
- 🎨 **반응형 UI**: 모바일 친화적 디자인

### 🚧 향후 확장 가능한 기능

- OAuth 소셜 로그인 (Google, GitHub)
- 실시간 알림 시스템
- 파일 업로드 기능
- 관리자 대시보드
- 결제 시스템 연동

## 개발 환경 설정

### 필수 도구

- Node.js 18 이상
- npm 또는 yarn
- Supabase 계정
- Git

### 1. 프로젝트 설치

```bash
# 프로젝트 클론
git clone <repository-url>
cd fast-next-community

# 의존성 설치
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase Configuration
# Supabase 프로젝트에서 설정 > API에서 찾을 수 있습니다
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase 데이터베이스 설정

Supabase 대시보드에서 SQL 에디터를 열고 다음 파일들을 순서대로 실행하세요:

1. `posts_table.sql` - 게시글 및 댓글 테이블 생성
2. `products_table.sql` - 상품 및 주문 테이블 생성

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하세요.

## 프로젝트 구조

```
fast-next-community/
├── src/
│   ├── app/                 # Next.js 앱 라우터
│   │   ├── login/          # 로그인 페이지
│   │   ├── signup/         # 회원가입 페이지
│   │   ├── posts/          # 게시판
│   │   ├── products/       # 상품 목록
│   │   ├── cart/           # 장바구니
│   │   ├── profile/        # 프로필
│   │   ├── layout.tsx      # 공통 레이아웃
│   │   └── page.tsx        # 홈페이지
│   ├── components/         # 재사용 가능한 컴포넌트
│   │   ├── Header.tsx      # 헤더
│   │   ├── Navigation.tsx  # 네비게이션
│   │   ├── LoginForm.tsx   # 로그인 폼
│   │   ├── SignUpForm.tsx  # 회원가입 폼
│   │   └── PrivateRoute.tsx # 보호된 라우트
│   └── lib/                # 유틸리티 함수 및 설정
│       ├── supabaseClient.ts # Supabase 클라이언트
│       ├── userStore.ts    # 사용자 상태 관리
│       ├── cartStore.ts    # 장바구니 상태 관리
│       └── useUserData.ts  # 사용자 데이터 훅
├── posts_table.sql         # 게시글 테이블 생성 SQL
├── products_table.sql      # 상품 테이블 생성 SQL
└── README.md              # 프로젝트 문서
```

## 학습 가이드

### 1단계: 기본 설정 이해하기

- Next.js 15 App Router 구조
- Tailwind CSS 스타일링
- TypeScript 설정

### 2단계: 인증 시스템

- Supabase Auth 이해
- 회원가입/로그인 구현
- 보호된 라우트 설정

### 3단계: 상태 관리

- Zustand를 사용한 전역 상태 관리
- 사용자 상태 관리
- 장바구니 상태 관리

### 4단계: 데이터베이스 연동

- Supabase 데이터베이스 이해
- RLS (Row Level Security) 정책
- CRUD 기능 구현

### 5단계: UI/UX 개선

- 반응형 디자인
- 로딩 상태 처리
- 에러 처리

## 주요 학습 포인트

### 🔧 기술적 학습

- **Next.js 15**: App Router, Server/Client Components
- **Supabase**: 실시간 데이터베이스, 인증, RLS
- **Zustand**: 가벼운 상태 관리 라이브러리
- **TypeScript**: 타입 안전성과 개발 경험 개선
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크

### 🎯 실무적 학습

- 사용자 인증 및 권한 관리
- 데이터베이스 설계 및 관계 설정
- 실시간 기능 구현
- 반응형 웹 디자인
- 컴포넌트 기반 개발

## Supabase 클라이언트 사용법

### 기본 설정

```typescript
// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### 데이터 조회 예시

```typescript
// 게시글 목록 조회
const { data, error } = await supabase
  .from("posts")
  .select(
    `
    *,
    profiles:user_id (
      full_name,
      email
    )
  `
  )
  .order("created_at", { ascending: false });
```

### 인증 예시

```typescript
// 로그인
const { data, error } = await supabase.auth.signInWithPassword({
  email: email,
  password: password,
});

// 로그아웃
await supabase.auth.signOut();
```

## 문제 해결

### 일반적인 문제들

**1. Supabase 연결 오류**

- 환경 변수가 올바르게 설정되었는지 확인
- Supabase URL과 ANON KEY가 정확한지 확인

**2. 데이터베이스 테이블이 없음**

- SQL 파일들을 Supabase에서 실행했는지 확인
- RLS 정책이 활성화되었는지 확인

**3. 로그인 후 리디렉션 안됨**

- 브라우저 콘솔에서 에러 메시지 확인
- 네트워크 탭에서 API 요청 상태 확인

**4. 빌드 오류**

- 타입스크립트 오류 확인
- 의존성이 올바르게 설치되었는지 확인

## 배포

### Vercel 배포

```bash
npm run build
# Vercel에 프로젝트 연결 후
vercel --prod
```

### 환경 변수 설정

Vercel 대시보드에서 환경 변수를 설정하세요:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 기여 방법

1. 이슈 확인 및 생성
2. 기능 브랜치 생성
3. 코드 작성 및 테스트
4. Pull Request 생성

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

---

**💡 팁**: 각 기능을 구현할 때마다 commit을 나누어서 진행하면 학습에 도움이 됩니다.
