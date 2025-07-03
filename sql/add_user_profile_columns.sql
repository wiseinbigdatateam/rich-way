-- members 테이블에 사용자 프로필 컬럼 추가
-- 생년월일, 전화번호, 주소, 우편번호 컬럼 추가

-- 1. 생년월일 컬럼 추가 (DATE 타입)
ALTER TABLE members 
ADD COLUMN birth_date DATE;

-- 2. 전화번호 컬럼 추가 (VARCHAR 타입, 하이픈 포함 가능)
ALTER TABLE members 
ADD COLUMN phone VARCHAR(20);

-- 3. 주소 컬럼 추가 (TEXT 타입, 긴 주소 지원)
ALTER TABLE members 
ADD COLUMN address TEXT;

-- 4. 상세주소 컬럼 추가 (TEXT 타입)
ALTER TABLE members 
ADD COLUMN address_detail TEXT;

-- 5. 우편번호 컬럼 추가 (VARCHAR 타입)
ALTER TABLE members 
ADD COLUMN postal_code VARCHAR(10);

-- 컬럼 추가 후 확인
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'members' 
ORDER BY ordinal_position;

-- 샘플 데이터 업데이트 (기존 김진성 사용자)
UPDATE members 
SET 
    birth_date = '1990-01-15',
    phone = '010-1234-5678',
    address = '서울특별시 강남구 테헤란로 123',
    address_detail = '456호',
    postal_code = '06142'
WHERE email = 'kerow@hanmail.net';

-- 업데이트 결과 확인
SELECT user_id, name, email, birth_date, phone, address, address_detail, postal_code, created_at
FROM members 
WHERE email = 'kerow@hanmail.net';

-- 전체 테이블 구조 확인
\d members; 