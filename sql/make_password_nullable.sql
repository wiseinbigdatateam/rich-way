-- members 테이블의 password 컬럼을 nullable로 변경
ALTER TABLE members ALTER COLUMN password DROP NOT NULL;

-- 확인용 쿼리
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'members' AND column_name = 'password'; 