-- 🔥 회원가입 시 자동으로 users 테이블에 레코드 생성하는 트리거

-- 1. users 테이블이 없다면 생성 (이미 있다면 무시됨)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  nickname VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. users 테이블에 RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 3. users 테이블 정책들
-- 모든 사용자가 다른 사용자 정보를 읽을 수 있음
CREATE POLICY "Anyone can read users" ON users
  FOR SELECT USING (true);

-- 사용자는 자신의 정보만 수정할 수 있음
CREATE POLICY "Users can update their own info" ON users
  FOR UPDATE USING (auth.uid() = id);

-- 4. 새 사용자가 가입할 때 자동으로 users 테이블에 레코드 생성하는 함수
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, name, nickname, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. auth.users 테이블에 새 사용자가 생성될 때 트리거 실행
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
