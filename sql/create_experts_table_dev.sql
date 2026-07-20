-- 개발서버에 전문가 테이블 생성
-- 운영서버와 동일한 구조로 생성

CREATE TABLE IF NOT EXISTS experts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    profile_image_url TEXT,
    expert_name TEXT NOT NULL,
    company_name TEXT,
    email TEXT,
    main_field TEXT,
    company_phone TEXT,
    personal_phone TEXT,
    tags TEXT[],
    core_intro TEXT,
    youtube_channel_url TEXT,
    intro_video_url TEXT,
    press_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_experts_user_id ON experts(user_id);
CREATE INDEX IF NOT EXISTS idx_experts_expert_name ON experts(expert_name);
CREATE INDEX IF NOT EXISTS idx_experts_main_field ON experts(main_field);

-- RLS 정책 설정 (필요한 경우)
-- ALTER TABLE experts ENABLE ROW LEVEL SECURITY;

-- 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_experts_updated_at 
    BEFORE UPDATE ON experts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
