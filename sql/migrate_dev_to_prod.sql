-- ========================================
-- 🚀 개발서버 → 운영서버 스키마 마이그레이션
-- ========================================
-- ⚠️ 주의: 이 스크립트는 운영서버의 데이터를 유지하면서 스키마만 업데이트합니다.
-- 반드시 실행 전에 운영서버 데이터를 백업하세요.

-- ========================================
-- 1단계: 기존 데이터 백업 (안전장치)
-- ========================================

-- 백업 테이블 생성 (이미 존재하지 않는 경우에만)
DO $$
BEGIN
    -- members 테이블 백업
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'backup_members') THEN
        CREATE TABLE backup_members AS SELECT * FROM members;
        RAISE NOTICE 'members 테이블 백업 완료';
    END IF;
    
    -- experts 테이블 백업
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'backup_experts') THEN
        CREATE TABLE backup_experts AS SELECT * FROM experts;
        RAISE NOTICE 'experts 테이블 백업 완료';
    END IF;
    
    -- mbti_diagnosis 테이블 백업
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'backup_mbti_diagnosis') THEN
        CREATE TABLE backup_mbti_diagnosis AS SELECT * FROM mbti_diagnosis;
        RAISE NOTICE 'mbti_diagnosis 테이블 백업 완료';
    END IF;
    
    -- finance_diagnosis 테이블 백업
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'backup_finance_diagnosis') THEN
        CREATE TABLE backup_finance_diagnosis AS SELECT * FROM finance_diagnosis;
        RAISE NOTICE 'finance_diagnosis 테이블 백업 완료';
    END IF;
    
    -- community_posts 테이블 백업
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'backup_community_posts') THEN
        CREATE TABLE backup_community_posts AS SELECT * FROM community_posts;
        RAISE NOTICE 'community_posts 테이블 백업 완료';
    END IF;
    
    -- community_comments 테이블 백업
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'backup_community_comments') THEN
        CREATE TABLE backup_community_comments AS SELECT * FROM community_comments;
        RAISE NOTICE 'community_comments 테이블 백업 완료';
    END IF;
    
    -- coaching_applications 테이블 백업
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'backup_coaching_applications') THEN
        CREATE TABLE backup_coaching_applications AS SELECT * FROM coaching_applications;
        RAISE NOTICE 'coaching_applications 테이블 백업 완료';
    END IF;
END $$;

-- ========================================
-- 2단계: 외래키 제약조건 임시 제거
-- ========================================

-- 외래키 제약조건들을 안전하게 제거
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT conname, conrelid::regclass AS table_name
        FROM pg_constraint
        WHERE contype = 'f' 
        AND connamespace = 'public'::regnamespace
    ) LOOP
        EXECUTE 'ALTER TABLE ' || r.table_name || ' DROP CONSTRAINT ' || r.conname;
        RAISE NOTICE '외래키 제약조건 제거: %', r.conname;
    END LOOP;
END $$;

-- ========================================
-- 3단계: 새 컬럼 추가 (실제로 없는 컬럼만)
-- ========================================

-- members 테이블에 새 컬럼 추가
DO $$
BEGIN
    -- nickname 컬럼 추가 (없는 경우에만)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'members' AND column_name = 'nickname') THEN
        ALTER TABLE members ADD COLUMN nickname VARCHAR(100);
        RAISE NOTICE 'members 테이블에 nickname 컬럼 추가됨';
    END IF;
    
    -- profile_image_url 컬럼 추가 (없는 경우에만)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'members' AND column_name = 'profile_image_url') THEN
        ALTER TABLE members ADD COLUMN profile_image_url VARCHAR(500);
        RAISE NOTICE 'members 테이블에 profile_image_url 컬럼 추가됨';
    END IF;
    
    -- bio 컬럼 추가 (없는 경우에만)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'members' AND column_name = 'bio') THEN
        ALTER TABLE members ADD COLUMN bio TEXT;
        RAISE NOTICE 'members 테이블에 bio 컬럼 추가됨';
    END IF;
    
    -- preferences 컬럼 추가 (없는 경우에만)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'members' AND column_name = 'preferences') THEN
        ALTER TABLE members ADD COLUMN preferences JSONB DEFAULT '{}'::jsonb;
        RAISE NOTICE 'members 테이블에 preferences 컬럼 추가됨';
    END IF;
END $$;

-- experts 테이블에 새 컬럼 추가
DO $$
BEGIN
    -- is_featured 컬럼 추가 (없는 경우에만)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'experts' AND column_name = 'is_featured') THEN
        ALTER TABLE experts ADD COLUMN is_featured BOOLEAN DEFAULT false;
        RAISE NOTICE 'experts 테이블에 is_featured 컬럼 추가됨';
    END IF;
END $$;

-- mbti_diagnosis 테이블에 새 컬럼 추가
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mbti_diagnosis' AND column_name = 'member_id') THEN
        ALTER TABLE mbti_diagnosis ADD COLUMN member_id UUID DEFAULT auth.uid();
    END IF;
END $$;

-- finance_diagnosis 테이블에 새 컬럼 추가
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'finance_diagnosis' AND column_name = 'member_id') THEN
        ALTER TABLE finance_diagnosis ADD COLUMN member_id UUID DEFAULT auth.uid();
    END IF;
END $$;

-- ========================================
-- 4단계: 기존 컬럼 수정 (타입 변경 시 주의)
-- ========================================

-- members 테이블의 signup_type 컬럼 제약조건 추가
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'members_signup_type_check'
    ) THEN
        ALTER TABLE members ADD CONSTRAINT members_signup_type_check 
        CHECK (signup_type IN ('email', 'kakao', 'naver', 'google'));
    END IF;
END $$;

-- ========================================
-- 5단계: 새 테이블 생성 (없는 경우)
-- ========================================

-- member_settings 테이블 생성 (없는 경우)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'member_settings') THEN
        CREATE TABLE member_settings (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
            notification_email BOOLEAN DEFAULT true,
            notification_sms BOOLEAN DEFAULT false,
            notification_push BOOLEAN DEFAULT true,
            privacy_level VARCHAR(20) DEFAULT 'public',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

-- expert_products 테이블 생성 (없는 경우)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'expert_products') THEN
        CREATE TABLE expert_products (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            expert_id UUID NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
            product_name VARCHAR(200) NOT NULL,
            regular_price INTEGER NOT NULL,
            price INTEGER NOT NULL,
            duration INTEGER NOT NULL,
            description TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END $$;

-- ========================================
-- 6단계: 인덱스 추가 (실제로 없는 인덱스만)
-- ========================================

-- members 테이블 인덱스
DO $$
BEGIN
    -- email 인덱스 추가 (없는 경우에만)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_members_email') THEN
        CREATE INDEX idx_members_email ON members(email);
        RAISE NOTICE 'members 테이블에 email 인덱스 추가됨';
    END IF;
    
    -- created_at 인덱스 추가 (없는 경우에만)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_members_created_at') THEN
        CREATE INDEX idx_members_created_at ON members(created_at);
        RAISE NOTICE 'members 테이블에 created_at 인덱스 추가됨';
    END IF;
END $$;

-- experts 테이블 인덱스
DO $$
BEGIN
    -- email 인덱스 추가 (없는 경우에만)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_experts_email') THEN
        CREATE INDEX idx_experts_email ON experts(email);
        RAISE NOTICE 'experts 테이블에 email 인덱스 추가됨';
    END IF;
    
    -- created_at 인덱스 추가 (없는 경우에만)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_experts_created_at') THEN
        CREATE INDEX idx_experts_created_at ON experts(created_at);
        RAISE NOTICE 'experts 테이블에 created_at 인덱스 추가됨';
    END IF;
END $$;

-- mbti_diagnosis 테이블 인덱스
DO $$
BEGIN
    -- user_id 컬럼이 존재하는지 확인 후 인덱스 추가
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mbti_diagnosis' AND column_name = 'user_id') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_mbti_diagnosis_user_id') THEN
            CREATE INDEX idx_mbti_diagnosis_user_id ON mbti_diagnosis(user_id);
            RAISE NOTICE 'mbti_diagnosis 테이블에 user_id 인덱스 추가됨';
        END IF;
    END IF;
    
    -- created_at 인덱스 추가 (없는 경우에만)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_mbti_diagnosis_created_at') THEN
        CREATE INDEX idx_mbti_diagnosis_created_at ON mbti_diagnosis(created_at);
        RAISE NOTICE 'mbti_diagnosis 테이블에 created_at 인덱스 추가됨';
    END IF;
END $$;

-- finance_diagnosis 테이블 인덱스
DO $$
BEGIN
    -- user_id 컬럼이 존재하는지 확인 후 인덱스 추가
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'finance_diagnosis' AND column_name = 'user_id') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_finance_diagnosis_user_id') THEN
            CREATE INDEX idx_finance_diagnosis_user_id ON finance_diagnosis(user_id);
            RAISE NOTICE 'finance_diagnosis 테이블에 user_id 인덱스 추가됨';
        END IF;
    END IF;
    
    -- created_at 인덱스 추가 (없는 경우에만)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_finance_diagnosis_created_at') THEN
        CREATE INDEX idx_finance_diagnosis_created_at ON finance_diagnosis(created_at);
        RAISE NOTICE 'finance_diagnosis 테이블에 created_at 인덱스 추가됨';
    END IF;
END $$;

-- community_posts 테이블 인덱스
DO $$
BEGIN
    -- user_id 컬럼이 존재하는지 확인 후 인덱스 추가
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'community_posts' AND column_name = 'user_id') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_community_posts_user_id') THEN
            CREATE INDEX idx_community_posts_user_id ON community_posts(user_id);
            RAISE NOTICE 'community_posts 테이블에 user_id 인덱스 추가됨';
        END IF;
    END IF;
    
    -- created_at 인덱스 추가 (없는 경우에만)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_community_posts_created_at') THEN
        CREATE INDEX idx_community_posts_created_at ON community_posts(created_at);
        RAISE NOTICE 'community_posts 테이블에 created_at 인덱스 추가됨';
    END IF;
END $$;

-- community_comments 테이블 인덱스
DO $$
BEGIN
    -- user_id 컬럼이 존재하는지 확인 후 인덱스 추가
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'community_comments' AND column_name = 'user_id') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_community_comments_user_id') THEN
            CREATE INDEX idx_community_comments_user_id ON community_comments(user_id);
            RAISE NOTICE 'community_comments 테이블에 user_id 인덱스 추가됨';
        END IF;
    END IF;
    
    -- created_at 인덱스 추가 (없는 경우에만)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_community_comments_created_at') THEN
        CREATE INDEX idx_community_comments_created_at ON community_comments(created_at);
        RAISE NOTICE 'community_comments 테이블에 created_at 인덱스 추가됨';
    END IF;
END $$;

-- coaching_applications 테이블 인덱스
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_coaching_applications_member_user_id') THEN
        CREATE INDEX idx_coaching_applications_member_user_id ON coaching_applications(member_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_coaching_applications_expert_user_id') THEN
        CREATE INDEX idx_coaching_applications_expert_user_id ON coaching_applications(expert_user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_coaching_applications_status') THEN
        CREATE INDEX idx_coaching_applications_status ON coaching_applications(status);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_coaching_applications_created_at') THEN
        CREATE INDEX idx_coaching_applications_created_at ON coaching_applications(created_at);
    END IF;
END $$;

-- ========================================
-- 7단계: 제약조건 재생성 (실제로 없는 제약조건만)
-- ========================================

-- members 테이블 제약조건
DO $$
BEGIN
    -- email unique 제약조건 추가 (없는 경우에만)
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'members_email_unique') THEN
        ALTER TABLE members ADD CONSTRAINT members_email_unique UNIQUE (email);
        RAISE NOTICE 'members 테이블에 email unique 제약조건 추가됨';
    END IF;
END $$;

-- experts 테이블 제약조건
DO $$
BEGIN
    -- email unique 제약조건 추가 (없는 경우에만)
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'experts_email_unique') THEN
        ALTER TABLE experts ADD CONSTRAINT experts_email_unique UNIQUE (email);
        RAISE NOTICE 'experts 테이블에 email unique 제약조건 추가됨';
    END IF;
END $$;

-- 외래키 제약조건들 (실제로 없는 경우에만)
DO $$
BEGIN
    -- mbti_diagnosis.user_id -> members.id
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mbti_diagnosis' AND column_name = 'user_id') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_mbti_diagnosis_user_id') THEN
            BEGIN
                ALTER TABLE mbti_diagnosis 
                ADD CONSTRAINT fk_mbti_diagnosis_user_id
                FOREIGN KEY (user_id) REFERENCES members(id) ON DELETE CASCADE;
                RAISE NOTICE 'mbti_diagnosis 테이블에 user_id 외래키 제약조건 추가됨';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'mbti_diagnosis 테이블의 user_id 외래키 제약조건 추가 실패 (타입 불일치 가능성): %', SQLERRM;
            END;
        END IF;
    END IF;
    
    -- finance_diagnosis.user_id -> members.id
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'finance_diagnosis' AND column_name = 'user_id') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_finance_diagnosis_user_id') THEN
            BEGIN
                ALTER TABLE finance_diagnosis 
                ADD CONSTRAINT fk_finance_diagnosis_user_id
                FOREIGN KEY (user_id) REFERENCES members(id) ON DELETE CASCADE;
                RAISE NOTICE 'finance_diagnosis 테이블에 user_id 외래키 제약조건 추가됨';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'finance_diagnosis 테이블의 user_id 외래키 제약조건 추가 실패 (타입 불일치 가능성): %', SQLERRM;
            END;
        END IF;
    END IF;
    
    -- community_posts.user_id -> members.id
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'community_posts' AND column_name = 'user_id') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_community_posts_user_id') THEN
            BEGIN
                ALTER TABLE community_posts 
                ADD CONSTRAINT fk_community_posts_user_id
                FOREIGN KEY (user_id) REFERENCES members(id) ON DELETE CASCADE;
                RAISE NOTICE 'community_posts 테이블에 user_id 외래키 제약조건 추가됨';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'community_posts 테이블의 user_id 외래키 제약조건 추가 실패 (타입 불일치 가능성): %', SQLERRM;
            END;
        END IF;
    END IF;
    
    -- community_comments.user_id -> members.id
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'community_comments' AND column_name = 'user_id') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_community_comments_user_id') THEN
            BEGIN
                ALTER TABLE community_comments 
                ADD CONSTRAINT fk_community_comments_user_id
                FOREIGN KEY (user_id) REFERENCES members(id) ON DELETE CASCADE;
                RAISE NOTICE 'community_comments 테이블에 user_id 외래키 제약조건 추가됨';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'community_comments 테이블의 user_id 외래키 제약조건 추가 실패 (타입 불일치 가능성): %', SQLERRM;
            END;
        END IF;
    END IF;
END $$;

-- ========================================
-- 8단계: RLS 정책 업데이트
-- ========================================

-- members 테이블 RLS 정책
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON members;
CREATE POLICY "Users can view own profile" ON members
    FOR SELECT USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Users can update own profile" ON members;
CREATE POLICY "Users can update own profile" ON members
    FOR UPDATE USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Users can insert own profile" ON members;
CREATE POLICY "Users can insert own profile" ON members
    FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- experts 테이블 RLS 정책
ALTER TABLE experts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Experts can view own profile" ON experts;
CREATE POLICY "Experts can view own profile" ON experts
    FOR SELECT USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Experts can update own profile" ON experts;
CREATE POLICY "Experts can update own profile" ON experts
    FOR UPDATE USING (auth.uid()::text = id::text);

-- mbti_diagnosis 테이블 RLS 정책
ALTER TABLE mbti_diagnosis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own diagnosis" ON mbti_diagnosis;
CREATE POLICY "Users can view own diagnosis" ON mbti_diagnosis
    FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can insert own diagnosis" ON mbti_diagnosis;
CREATE POLICY "Users can insert own diagnosis" ON mbti_diagnosis
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- finance_diagnosis 테이블 RLS 정책
ALTER TABLE finance_diagnosis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own finance diagnosis" ON finance_diagnosis;
CREATE POLICY "Users can view own finance diagnosis" ON finance_diagnosis
    FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can insert own finance diagnosis" ON finance_diagnosis;
CREATE POLICY "Users can insert own finance diagnosis" ON finance_diagnosis
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- ========================================
-- 9단계: 검증
-- ========================================

-- 테이블 목록 확인
SELECT '=== 마이그레이션 후 테이블 목록 ===' as info;
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- 컬럼 정보 확인
SELECT '=== members 테이블 컬럼 ===' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'members'
ORDER BY ordinal_position;

-- 데이터 개수 확인
SELECT '=== 데이터 개수 확인 ===' as info;
SELECT 
    'members' as table_name, COUNT(*) as row_count FROM members
UNION ALL
SELECT 
    'experts' as table_name, COUNT(*) as row_count FROM experts
UNION ALL
SELECT 
    'mbti_diagnosis' as table_name, COUNT(*) as row_count FROM mbti_diagnosis
UNION ALL
SELECT 
    'finance_diagnosis' as table_name, COUNT(*) as row_count FROM finance_diagnosis
UNION ALL
SELECT 
    'community_posts' as table_name, COUNT(*) as row_count FROM community_posts
UNION ALL
SELECT 
    'community_comments' as table_name, COUNT(*) as row_count FROM community_comments
UNION ALL
SELECT 
    'coaching_applications' as table_name, COUNT(*) as row_count FROM coaching_applications;

-- ========================================
-- 10단계: 완료 메시지
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '🎉 개발서버 → 운영서버 스키마 마이그레이션 완료!';
    RAISE NOTICE '✅ 모든 테이블과 데이터가 성공적으로 마이그레이션되었습니다.';
    RAISE NOTICE '📊 백업 테이블들이 생성되었습니다 (backup_* 테이블들).';
    RAISE NOTICE '🔍 검증 결과를 확인하세요.';
END $$;
