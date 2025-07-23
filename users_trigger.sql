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

-- 6. 기존 사용자들을 위한 마이그레이션 (이미 가입했지만 users 테이블에 없는 경우)
INSERT INTO users (id, email, name, nickname, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email),
  COALESCE(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1)),
  au.created_at,
  au.updated_at
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM users u WHERE u.id = au.id
);

-- 7. posts 테이블의 외래 키 제약 조건이 users 테이블을 참조하도록 설정
-- (이미 설정되어 있다면 무시됨)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'posts_author_id_fkey' 
    AND table_name = 'posts'
  ) THEN
    ALTER TABLE posts 
    ADD CONSTRAINT posts_author_id_fkey 
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$; 