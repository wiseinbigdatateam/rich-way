-- 🚀 Supabase 대시보드에서 바로 실행 가능한 SQL문
-- SQL Editor에서 이 코드를 복사해서 실행하세요

-- 김진성님 회원 정보 삽입
INSERT INTO members (
    user_id,
    password, 
    name,
    email,
    signup_type
) VALUES (
    'kerow_hanmail',
    '1q2w3e$R',
    '김진성',
    'kerow@hanmail.net',
    'email'
);

-- 결과 확인
SELECT * FROM members WHERE email = 'kerow@hanmail.net'; 