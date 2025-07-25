-- 🔥 회원가입 시 자동으로 users 테이블에 레코드 생성하는 트리거

-- 1. users 테이블이 없다면 생성 (이미 있다면 무시됨)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  nickname VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. users 테이블에 RLS 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;


-- 4. 새 사용자가 가입할 때 자동으로 users 테이블에 레코드 생성하는 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- 에러 처리를 위한 예외 처리 추가
  BEGIN
    INSERT INTO public.users (id, email, name, nickname, created_at, updated_at)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
      NOW(),
      NOW()
    );
  EXCEPTION WHEN others THEN
    -- 에러가 발생해도 회원가입이 실패하지 않도록 에러를 로그만 남기고 계속 진행
    RAISE WARNING 'Failed to create user profile for %: %', NEW.email, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. auth.users 테이블에 새 사용자가 생성될 때 트리거 실행
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. 함수 실행 권한 부여 (필요한 경우)
-- GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
-- GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;
