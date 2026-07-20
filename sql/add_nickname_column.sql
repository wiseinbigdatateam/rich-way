-- members 테이블에 nickname 컬럼 추가
ALTER TABLE members ADD COLUMN IF NOT EXISTS nickname TEXT;

-- 기존 사용자들의 nickname을 name 값으로 초기화 (nickname이 null인 경우만)
UPDATE members 
SET nickname = name 
WHERE nickname IS NULL;

-- 확인용 쿼리
SELECT user_id, name, nickname, email 
FROM members 
ORDER BY created_at DESC 
LIMIT 10; 