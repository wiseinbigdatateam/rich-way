-- members 테이블의 signup_type 제약조건 수정
-- 기존 제약조건 삭제
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_signup_type_check;

-- 새로운 제약조건 추가 (expert, admin 포함)
ALTER TABLE members ADD CONSTRAINT members_signup_type_check 
CHECK (signup_type IN ('email', 'kakao', 'naver', 'google', 'expert', 'admin'));

-- 변경사항 확인
SELECT 
    constraint_name,
    check_clause
FROM information_schema.check_constraints 
WHERE constraint_name = 'members_signup_type_check'; 