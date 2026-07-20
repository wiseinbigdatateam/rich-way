-- 컬럼명 변경에 맞춰 더미 데이터 업데이트

-- 1. coaching_applications 테이블의 member_user_id를 member_user로 변경
UPDATE coaching_applications 
SET member_user = member_user_id 
WHERE member_user_id IS NOT NULL;

-- 2. mbti_diagnosis 테이블의 user_id를 user로 변경
UPDATE mbti_diagnosis 
SET "user" = user_id 
WHERE user_id IS NOT NULL;

-- 3. finance_diagnosis 테이블의 user_id를 user로 변경
UPDATE finance_diagnosis 
SET "user" = user_id 
WHERE user_id IS NOT NULL;

-- 4. 기존 컬럼 삭제 (선택사항 - 안전을 위해 주석 처리)
-- ALTER TABLE coaching_applications DROP COLUMN IF EXISTS member_user_id;
-- ALTER TABLE mbti_diagnosis DROP COLUMN IF EXISTS user_id;
-- ALTER TABLE finance_diagnosis DROP COLUMN IF EXISTS user_id; 