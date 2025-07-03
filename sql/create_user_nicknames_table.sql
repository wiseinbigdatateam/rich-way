-- user_nicknames 테이블 생성
CREATE TABLE IF NOT EXISTS user_nicknames (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  nickname TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_user_nicknames_user_id ON user_nicknames(user_id);

-- RLS (Row Level Security) 설정
ALTER TABLE user_nicknames ENABLE ROW LEVEL SECURITY;

-- 사용자가 자신의 닉네임만 조회/수정할 수 있도록 정책 생성
CREATE POLICY "Users can view their own nickname" ON user_nicknames
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own nickname" ON user_nicknames
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own nickname" ON user_nicknames
    FOR UPDATE USING (true);

-- 확인용 쿼리
SELECT * FROM user_nicknames LIMIT 5; 