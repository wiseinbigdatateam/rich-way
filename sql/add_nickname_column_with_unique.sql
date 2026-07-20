-- members 테이블에 nickname 컬럼 추가 (UNIQUE 제약조건 포함)
ALTER TABLE members ADD COLUMN IF NOT EXISTS nickname TEXT UNIQUE;

-- 기존 사용자들의 nickname을 user_id 값으로 초기화 (nickname이 null인 경우만)
UPDATE members 
SET nickname = user_id 
WHERE nickname IS NULL;

-- nickname 컬럼을 NOT NULL로 변경
ALTER TABLE members ALTER COLUMN nickname SET NOT NULL;

-- 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_members_nickname ON members(nickname);

-- 확인용 쿼리
SELECT user_id, name, nickname, email 
FROM members 
ORDER BY created_at DESC 
LIMIT 10; 