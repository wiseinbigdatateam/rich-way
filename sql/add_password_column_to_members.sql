-- members 테이블에 password 컬럼 추가
-- 이미 존재하는 경우 무시됨

-- password 컬럼 추가 (VARCHAR 타입, 암호화된 비밀번호 저장용)
ALTER TABLE members 
ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- 기존 사용자들에게 기본 비밀번호 설정 (Demo 모드용)
UPDATE members 
SET password = '1q2w3e$R' 
WHERE password IS NULL OR password = '';

-- password 컬럼에 인덱스 추가 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_members_password ON members(password);

-- 업데이트 확인
SELECT 
    'password 컬럼이 성공적으로 추가되었습니다.' as message,
    COUNT(*) as total_members,
    COUNT(CASE WHEN password IS NOT NULL AND password != '' THEN 1 END) as members_with_password
FROM members;

-- 테이블 구조 확인
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'members' 
ORDER BY ordinal_position; 