-- 🚨 기존 posts 테이블의 컬럼명을 수정하는 SQL

-- 1. 기존 컬럼명이 'author'인 경우 'author_id'로 변경
ALTER TABLE posts RENAME COLUMN author TO author_id;

-- 2. 또는 기존 테이블을 완전히 삭제하고 새로 생성 (데이터 손실 주의!)
-- DROP TABLE IF EXISTS posts CASCADE;

-- 3. 새로운 테이블 생성 (posts_table.sql 내용과 동일)
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

-- 정책들 (기존 정책이 있다면 먼저 삭제)
DROP POLICY IF EXISTS "Anyone can read posts" ON posts;
DROP POLICY IF EXISTS "Users can create posts" ON posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;

-- 새로운 정책 생성
CREATE POLICY "Anyone can read posts" ON posts
    FOR SELECT USING (true);

CREATE POLICY "Users can create posts" ON posts
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts" ON posts
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts" ON posts
    FOR DELETE USING (auth.uid() = author_id); 