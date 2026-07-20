-- member_settings 테이블 생성 (알림 설정 저장용)
CREATE TABLE IF NOT EXISTS member_settings (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    email_notifications BOOLEAN DEFAULT true,
    community_notifications BOOLEAN DEFAULT true,
    marketing_notifications BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 외래키 제약조건 (members 테이블과 연결)
    CONSTRAINT fk_member_settings_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES members(user_id) 
        ON DELETE CASCADE,
    
    -- 사용자당 하나의 설정만 허용
    CONSTRAINT unique_user_settings UNIQUE (user_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_member_settings_user_id ON member_settings(user_id);

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_member_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 트리거 생성
DROP TRIGGER IF EXISTS trigger_update_member_settings_updated_at ON member_settings;
CREATE TRIGGER trigger_update_member_settings_updated_at
    BEFORE UPDATE ON member_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_member_settings_updated_at();

-- RLS (Row Level Security) 활성화
ALTER TABLE member_settings ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 사용자는 자신의 설정만 조회/수정 가능
CREATE POLICY "Users can view their own settings" ON member_settings
    FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert their own settings" ON member_settings
    FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own settings" ON member_settings
    FOR UPDATE USING (user_id = auth.uid()::text);

CREATE POLICY "Users can delete their own settings" ON member_settings
    FOR DELETE USING (user_id = auth.uid()::text);

-- 기본 설정 데이터 삽입 (샘플)
INSERT INTO member_settings (user_id, email_notifications, community_notifications, marketing_notifications)
VALUES 
    ('demo-user', true, true, false),
    ('kimjinsung', true, true, true)
ON CONFLICT (user_id) DO NOTHING;

-- 테이블 생성 확인
SELECT 
    'member_settings 테이블이 성공적으로 생성되었습니다.' as message,
    COUNT(*) as total_settings
FROM member_settings;

-- 샘플 데이터 확인
SELECT 
    user_id,
    email_notifications,
    community_notifications,
    marketing_notifications,
    created_at
FROM member_settings
ORDER BY created_at DESC; 