# 🚀 게시글 작성 기능 설정 체크리스트

## 1. 환경 변수 설정 ✅

`.env.local` 파일에 다음 내용이 설정되어 있는지 확인하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Supabase에서 확인하는 방법:**

1. Supabase 대시보드 → 프로젝트 선택
2. Settings → API
3. Project URL과 anon/public key 복사

## 2. Supabase 데이터베이스 테이블 생성 📋

Supabase SQL 에디터에서 `posts_table.sql` 파일의 내용을 실행하세요:

```sql
-- posts 테이블 생성
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 정책 활성화
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 정책들
CREATE POLICY "Anyone can read posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own posts" ON posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own posts" ON posts FOR DELETE USING (auth.uid() = author_id);
```

## 3. Supabase 인증 설정 🔐

**확인사항:**

- Supabase → Authentication → Settings
- "Enable email confirmations" 설정 확인
- Redirect URLs 설정 (로컬: `http://localhost:3000`)

## 4. 테스트 절차 🧪

### 4.1 회원가입/로그인 테스트

1. `http://localhost:3000/signup`에서 회원가입
2. `http://localhost:3000/login`에서 로그인

### 4.2 게시글 작성 테스트

1. 로그인 후 `http://localhost:3000/posts`로 이동
2. "새 글 작성" 버튼 클릭
3. 제목과 내용 입력 후 "게시글 작성" 클릭
4. 브라우저 개발자 도구(F12) → Console 탭에서 에러 확인

## 5. 문제 해결 🔧

### 5.1 환경 변수 문제

**증상:** "Supabase URL: 설정되지 않음" 또는 "Supabase Key: 설정되지 않음"
**해결:** `.env.local` 파일 확인 및 재시작

```bash
npm run dev
```

### 5.2 테이블 없음 에러

**증상:** `relation "posts" does not exist`
**해결:** Supabase SQL 에디터에서 `posts_table.sql` 재실행

### 5.3 권한 에러

**증상:** `permission denied for table posts`
**해결:** RLS 정책 재확인 및 재생성

### 5.4 인증 에러

**증상:** `user is null` 또는 로그인 상태 인식 안됨
**해결:**

1. 브라우저 캐시 삭제
2. 로그아웃 후 재로그인
3. Supabase 인증 설정 확인

## 6. 디버깅 도구 🛠️

개발 모드에서 페이지 하단에 디버깅 정보가 표시됩니다:

- **게시글 작성 페이지:** 사용자 ID, Supabase 연결 상태
- **게시글 목록 페이지:** 게시글 수, 로그인 상태, Supabase 연결
- **브라우저 콘솔:** 상세 로그 및 에러 메시지

## 7. 성공 확인 ✨

다음이 모두 작동하면 성공입니다:

- ✅ 회원가입/로그인 가능
- ✅ 게시글 작성 페이지 접근 가능
- ✅ 게시글 작성 후 목록에 표시
- ✅ 게시글 상세 보기 가능
- ✅ 작성자만 수정/삭제 버튼 표시

## 8. 추가 확인사항

### Supabase 대시보드에서 확인:

1. **Table Editor** → posts 테이블에 데이터 입력 확인
2. **Authentication** → Users 탭에서 가입된 사용자 확인
3. **API Logs** 탭에서 요청/응답 로그 확인

---

**🚨 여전히 작동하지 않는다면:**

1. 브라우저 개발자 도구 Console 탭 스크린샷
2. Supabase 프로젝트 URL과 설정 확인
3. 환경 변수 파일 경로 및 내용 확인
