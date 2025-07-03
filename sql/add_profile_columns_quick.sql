-- members 테이블 프로필 컬럼 추가 (간단 실행용)

ALTER TABLE members ADD COLUMN birth_date DATE;
ALTER TABLE members ADD COLUMN phone VARCHAR(20);
ALTER TABLE members ADD COLUMN address TEXT;
ALTER TABLE members ADD COLUMN address_detail TEXT;
ALTER TABLE members ADD COLUMN postal_code VARCHAR(10);

-- 기존 Demo 사용자 데이터 업데이트
UPDATE members SET 
    birth_date = '1990-01-15',
    phone = '010-1234-5678',
    address = '서울특별시 강남구 테헤란로 123',
    address_detail = '456호',
    postal_code = '06142'
WHERE email = 'kerow@hanmail.net'; 