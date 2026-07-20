-- members 테이블에 누락된 컬럼 추가
-- 실행 전에 기존 데이터 백업을 권장합니다.

-- 1. 현재 members 테이블 구조 확인
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'members' 
ORDER BY ordinal_position;

-- 2. user_id 컬럼이 없다면 추가
ALTER TABLE members ADD COLUMN IF NOT EXISTS user_id VARCHAR(50);

-- 3. user_id 컬럼을 UNIQUE로 설정
ALTER TABLE members ADD CONSTRAINT unique_members_user_id UNIQUE (user_id);

-- 4. 기존 데이터가 있다면 user_id 값 설정 (email 기반으로)
UPDATE members 
SET user_id = COALESCE(user_id, split_part(email, '@', 1))
WHERE user_id IS NULL;

-- 5. user_id를 NOT NULL로 설정
ALTER TABLE members ALTER COLUMN user_id SET NOT NULL;

-- 6. 누락된 다른 컬럼들도 추가
ALTER TABLE members ADD COLUMN IF NOT EXISTS password VARCHAR(255);
ALTER TABLE members ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE members ADD COLUMN IF NOT EXISTS signup_type VARCHAR(20) DEFAULT 'email';

-- 7. signup_type 제약조건 추가
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_signup_type_check;
ALTER TABLE members ADD CONSTRAINT members_signup_type_check 
CHECK (signup_type IN ('email', 'kakao', 'naver', 'google', 'admin'));

-- 8. 기존 데이터의 signup_type 설정
UPDATE members 
SET signup_type = COALESCE(signup_type, 'email')
WHERE signup_type IS NULL;

-- 9. signup_type을 NOT NULL로 설정
ALTER TABLE members ALTER COLUMN signup_type SET NOT NULL;

-- 10. 누락된 컬럼들 추가
ALTER TABLE members ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE members ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 11. 기존 데이터의 timestamp 설정
UPDATE members 
SET created_at = COALESCE(created_at, NOW()),
    updated_at = COALESCE(updated_at, NOW())
WHERE created_at IS NULL OR updated_at IS NULL;

-- 12. 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_members_user_id ON members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_signup_type ON members(signup_type);
CREATE INDEX IF NOT EXISTS idx_members_created_at ON members(created_at);

-- 13. updated_at 자동 업데이트 함수 및 트리거
CREATE OR REPLACE FUNCTION update_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_members_updated_at ON members;
CREATE TRIGGER update_members_updated_at 
    BEFORE UPDATE ON members 
    FOR EACH ROW 
    EXECUTE FUNCTION update_members_updated_at();

-- 14. 최종 테이블 구조 확인
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'members' 
ORDER BY ordinal_position;

-- 완료 메시지
SELECT 'Members table structure has been updated successfully!' AS status; 