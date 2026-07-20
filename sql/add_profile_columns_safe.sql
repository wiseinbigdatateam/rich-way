-- members 테이블 프로필 컬럼 안전 추가
-- 컬럼이 이미 존재하는 경우 오류 방지

-- 1. birth_date 컬럼 추가 (존재하지 않는 경우만)
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'members' AND column_name = 'birth_date'
    ) THEN
        ALTER TABLE members ADD COLUMN birth_date DATE;
        RAISE NOTICE 'birth_date 컬럼이 추가되었습니다.';
    ELSE
        RAISE NOTICE 'birth_date 컬럼이 이미 존재합니다.';
    END IF;
END $$;

-- 2. phone 컬럼 추가 (존재하지 않는 경우만)
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'members' AND column_name = 'phone'
    ) THEN
        ALTER TABLE members ADD COLUMN phone VARCHAR(20);
        RAISE NOTICE 'phone 컬럼이 추가되었습니다.';
    ELSE
        RAISE NOTICE 'phone 컬럼이 이미 존재합니다.';
    END IF;
END $$;

-- 3. address 컬럼 추가 (존재하지 않는 경우만)
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'members' AND column_name = 'address'
    ) THEN
        ALTER TABLE members ADD COLUMN address TEXT;
        RAISE NOTICE 'address 컬럼이 추가되었습니다.';
    ELSE
        RAISE NOTICE 'address 컬럼이 이미 존재합니다.';
    END IF;
END $$;

-- 4. address_detail 컬럼 추가 (존재하지 않는 경우만)
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'members' AND column_name = 'address_detail'
    ) THEN
        ALTER TABLE members ADD COLUMN address_detail TEXT;
        RAISE NOTICE 'address_detail 컬럼이 추가되었습니다.';
    ELSE
        RAISE NOTICE 'address_detail 컬럼이 이미 존재합니다.';
    END IF;
END $$;

-- 5. postal_code 컬럼 추가 (존재하지 않는 경우만)
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'members' AND column_name = 'postal_code'
    ) THEN
        ALTER TABLE members ADD COLUMN postal_code VARCHAR(10);
        RAISE NOTICE 'postal_code 컬럼이 추가되었습니다.';
    ELSE
        RAISE NOTICE 'postal_code 컬럼이 이미 존재합니다.';
    END IF;
END $$;

-- 기존 Demo 사용자 데이터 업데이트 (안전하게)
UPDATE members SET 
    birth_date = COALESCE(birth_date, '1990-01-15'),
    phone = COALESCE(phone, '010-1234-5678'),
    address = COALESCE(address, '서울특별시 강남구 테헤란로 123'),
    address_detail = COALESCE(address_detail, '456호'),
    postal_code = COALESCE(postal_code, '06142')
WHERE email = 'kerow@hanmail.net';

-- 최종 결과 확인
SELECT 
    user_id, 
    name, 
    email, 
    birth_date, 
    phone, 
    address, 
    address_detail,
    postal_code, 
    created_at, 
    updated_at
FROM members 
WHERE email = 'kerow@hanmail.net'; 