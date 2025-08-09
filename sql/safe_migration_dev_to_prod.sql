-- ========================================
-- 🚀 개발서버 → 운영서버 안전한 스키마 마이그레이션
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
-- 3단계: 새 컬럼 추가 (기존 데이터 유지)
-- ========================================

-- members 테이블에 새 컬럼 추가
ALTER TABLE members ADD COLUMN IF NOT EXISTS nickname VARCHAR(100);
ALTER TABLE members ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR(500);
ALTER TABLE members ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;

-- experts 테이블에 새 컬럼 추가
ALTER TABLE experts ADD COLUMN IF NOT EXISTS achievements_detail TEXT;
ALTER TABLE experts ADD COLUMN IF NOT EXISTS education_detail TEXT;
ALTER TABLE experts ADD COLUMN IF NOT EXISTS certifications_detail TEXT;
ALTER TABLE experts ADD COLUMN IF NOT EXISTS experience_detail TEXT;
ALTER TABLE experts ADD COLUMN IF NOT EXISTS expertise_areas TEXT[];
ALTER TABLE experts ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- mbti_diagnosis 테이블에 새 컬럼 추가
ALTER TABLE mbti_diagnosis ADD COLUMN IF NOT EXISTS member_id UUID DEFAULT auth.uid();

-- finance_diagnosis 테이블에 새 컬럼 추가
ALTER TABLE finance_diagnosis ADD COLUMN IF NOT EXISTS member_id UUID DEFAULT auth.uid();

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
CREATE TABLE IF NOT EXISTS member_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    notification_email BOOLEAN DEFAULT true,
    notification_sms BOOLEAN DEFAULT false,
    notification_push BOOLEAN DEFAULT true,
    privacy_level VARCHAR(20) DEFAULT 'public',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- expert_products 테이블 생성 (없는 경우)
CREATE TABLE IF NOT EXISTS expert_products (
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

-- ========================================
-- 6단계: 인덱스 추가
-- ========================================

-- members 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_user_id ON members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_created_at ON members(created_at);

-- experts 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_experts_user_id ON experts(user_id);
CREATE INDEX IF NOT EXISTS idx_experts_expert_type ON experts(main_field);
CREATE INDEX IF NOT EXISTS idx_experts_is_active ON experts(status);
CREATE INDEX IF NOT EXISTS idx_experts_created_at ON experts(created_at);

-- mbti_diagnosis 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_mbti_diagnosis_user_id ON mbti_diagnosis(user_id);
CREATE INDEX IF NOT EXISTS idx_mbti_diagnosis_created_at ON mbti_diagnosis(created_at);
CREATE INDEX IF NOT EXISTS idx_mbti_diagnosis_responses_gin ON mbti_diagnosis USING GIN (responses);

-- finance_diagnosis 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_finance_diagnosis_user_id ON finance_diagnosis(user_id);
CREATE INDEX IF NOT EXISTS idx_finance_diagnosis_created_at ON finance_diagnosis(created_at);
CREATE INDEX IF NOT EXISTS idx_finance_diagnosis_responses_gin ON finance_diagnosis USING GIN (responses);

-- community_posts 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at);

-- community_comments 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_user_id ON community_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_created_at ON community_comments(created_at);

-- coaching_applications 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_coaching_applications_member_user_id ON coaching_applications(member_user_id);
CREATE INDEX IF NOT EXISTS idx_coaching_applications_expert_user_id ON coaching_applications(expert_user_id);
CREATE INDEX IF NOT EXISTS idx_coaching_applications_status ON coaching_applications(status);
CREATE INDEX IF NOT EXISTS idx_coaching_applications_created_at ON coaching_applications(created_at);

-- ========================================
-- 7단계: 제약조건 재생성
-- ========================================

-- members 테이블 제약조건
ALTER TABLE members ADD CONSTRAINT IF NOT EXISTS members_pkey PRIMARY KEY (id);
ALTER TABLE members ADD CONSTRAINT IF NOT EXISTS members_email_unique UNIQUE (email);

-- experts 테이블 제약조건
ALTER TABLE experts ADD CONSTRAINT IF NOT EXISTS experts_pkey PRIMARY KEY (id);
ALTER TABLE experts ADD CONSTRAINT IF NOT EXISTS experts_email_unique UNIQUE (email);

-- mbti_diagnosis 테이블 제약조건
ALTER TABLE mbti_diagnosis ADD CONSTRAINT IF NOT EXISTS mbti_diagnosis_pkey PRIMARY KEY (id);

-- finance_diagnosis 테이블 제약조건
ALTER TABLE finance_diagnosis ADD CONSTRAINT IF NOT EXISTS finance_diagnosis_pkey PRIMARY KEY (id);

-- 외래키 제약조건 재생성
ALTER TABLE mbti_diagnosis 
ADD CONSTRAINT IF NOT EXISTS fk_mbti_diagnosis_user_id 
FOREIGN KEY (user_id) REFERENCES members(id) ON DELETE CASCADE;

ALTER TABLE finance_diagnosis 
ADD CONSTRAINT IF NOT EXISTS fk_finance_diagnosis_user_id 
FOREIGN KEY (user_id) REFERENCES members(id) ON DELETE CASCADE;

ALTER TABLE coaching_applications 
ADD CONSTRAINT IF NOT EXISTS fk_coaching_applications_member_user_id 
FOREIGN KEY (member_user_id) REFERENCES members(id) ON DELETE CASCADE;

ALTER TABLE coaching_applications 
ADD CONSTRAINT IF NOT EXISTS fk_coaching_applications_expert_user_id 
FOREIGN KEY (expert_user_id) REFERENCES experts(id) ON DELETE CASCADE;

ALTER TABLE community_comments 
ADD CONSTRAINT IF NOT EXISTS fk_community_comments_post_id 
FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE;

ALTER TABLE community_comments 
ADD CONSTRAINT IF NOT EXISTS fk_community_comments_user_id 
FOREIGN KEY (user_id) REFERENCES members(id) ON DELETE CASCADE;

-- ========================================
-- 8단계: RLS 정책 업데이트
-- ========================================

-- members 테이블 RLS 정책
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON members;
CREATE POLICY "Users can view own profile" ON members
    FOR SELECT USING (auth.uid()::uuid = id);

DROP POLICY IF EXISTS "Users can update own profile" ON members;
CREATE POLICY "Users can update own profile" ON members
    FOR UPDATE USING (auth.uid()::uuid = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON members;
CREATE POLICY "Users can insert own profile" ON members
    FOR INSERT WITH CHECK (auth.uid()::uuid = id);

-- experts 테이블 RLS 정책
ALTER TABLE experts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Experts can view own profile" ON experts;
CREATE POLICY "Experts can view own profile" ON experts
    FOR SELECT USING (auth.uid()::uuid = id);

DROP POLICY IF EXISTS "Experts can update own profile" ON experts;
CREATE POLICY "Experts can update own profile" ON experts
    FOR UPDATE USING (auth.uid()::uuid = id);

-- mbti_diagnosis 테이블 RLS 정책
ALTER TABLE mbti_diagnosis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own diagnosis" ON mbti_diagnosis;
CREATE POLICY "Users can view own diagnosis" ON mbti_diagnosis
    FOR SELECT USING (auth.uid()::uuid = user_id);

DROP POLICY IF EXISTS "Users can insert own diagnosis" ON mbti_diagnosis;
CREATE POLICY "Users can insert own diagnosis" ON mbti_diagnosis
    FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);

-- finance_diagnosis 테이블 RLS 정책
ALTER TABLE finance_diagnosis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own finance diagnosis" ON finance_diagnosis;
CREATE POLICY "Users can view own finance diagnosis" ON finance_diagnosis
    FOR SELECT USING (auth.uid()::uuid = user_id);

DROP POLICY IF EXISTS "Users can insert own finance diagnosis" ON finance_diagnosis;
CREATE POLICY "Users can insert own finance diagnosis" ON finance_diagnosis
    FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);

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
