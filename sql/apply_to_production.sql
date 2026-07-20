-- ========================================
-- 🚀 운영서버 스키마 적용 스크립트
-- ========================================
-- ⚠️ 주의: 이 스크립트는 운영서버의 기존 데이터를 삭제합니다!
-- 반드시 백업 후 실행하세요.

-- ========================================
-- 1단계: 기존 테이블 삭제 (외래키 의존성 고려)
-- ========================================

-- 외래키가 있는 테이블들을 먼저 삭제
DROP TABLE IF EXISTS post_likes CASCADE;
DROP TABLE IF EXISTS community_comments CASCADE;
DROP TABLE IF EXISTS community_posts CASCADE;
DROP TABLE IF EXISTS coaching_applications CASCADE;
DROP TABLE IF EXISTS expert_products CASCADE;
DROP TABLE IF EXISTS mbti_diagnosis CASCADE;
DROP TABLE IF EXISTS finance_diagnosis CASCADE;
DROP TABLE IF EXISTS member_settings CASCADE;
DROP TABLE IF EXISTS experts CASCADE;
DROP TABLE IF EXISTS members CASCADE;

-- ========================================
-- 2단계: 새 테이블 생성
-- ========================================

-- members 테이블 생성
CREATE TABLE members (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    password character varying(255) NOT NULL,
    name character varying(100),
    phone character varying(20),
    email character varying(255) NOT NULL,
    signup_type character varying(20) DEFAULT 'email'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    user_id character varying,
    birth_date date,
    address text,
    postal_code character varying(10),
    address_detail text,
    auth_user_id uuid,
    status text DEFAULT 'pending'::text,
    CONSTRAINT members_pkey PRIMARY KEY (id)
);

-- mbti_diagnosis 테이블 생성
CREATE TABLE mbti_diagnosis (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    result_type character varying(10) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    report_content jsonb,
    responses jsonb,
    CONSTRAINT mbti_diagnosis_pkey PRIMARY KEY (id)
);

-- finance_diagnosis 테이블 생성
CREATE TABLE finance_diagnosis (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    report_content jsonb,
    responses jsonb,
    CONSTRAINT finance_diagnosis_pkey PRIMARY KEY (id)
);

-- experts 테이블 생성
CREATE TABLE experts (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    profile_image_url character varying(500),
    expert_name character varying(100) NOT NULL,
    company_name character varying(100),
    email character varying(255) NOT NULL,
    main_field character varying(20) NOT NULL,
    company_phone character varying(20),
    personal_phone character varying(20),
    tags text[],
    core_intro text,
    youtube_channel_url character varying(500),
    intro_video_url character varying(500),
    press_url character varying(500),
    education_and_certifications text,
    career text,
    achievements text,
    expertise_detail text,
    experience_years integer,
    status character varying(10) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    achievements_detail text,
    education_detail text,
    certifications_detail text,
    experience_detail text,
    expertise_areas text[],
    is_featured boolean DEFAULT false,
    CONSTRAINT experts_pkey PRIMARY KEY (id)
);

-- expert_products 테이블 생성
CREATE TABLE expert_products (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    expert_id uuid NOT NULL,
    product_name character varying(200) NOT NULL,
    regular_price integer NOT NULL,
    price integer NOT NULL,
    duration integer NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT expert_products_pkey PRIMARY KEY (id)
);

-- coaching_applications 테이블 생성
CREATE TABLE coaching_applications (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    expert_id uuid NOT NULL,
    title character varying(200) NOT NULL,
    content text NOT NULL,
    method character varying(50) NOT NULL,
    contact character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    attachment_url character varying(500),
    product_name character varying(200) NOT NULL,
    product_price integer NOT NULL,
    status character varying(20) DEFAULT '접수'::character varying,
    start_date date,
    end_date date,
    total_sessions integer DEFAULT 8,
    completed_sessions integer DEFAULT 0,
    hourly_rate numeric,
    total_amount numeric,
    applied_at timestamp with time zone DEFAULT now(),
    paid_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT coaching_applications_pkey PRIMARY KEY (id)
);

-- community_posts 테이블 생성
CREATE TABLE community_posts (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    category character varying(50) NOT NULL,
    title character varying(200) NOT NULL,
    content text NOT NULL,
    views integer DEFAULT 0,
    likes_count integer DEFAULT 0,
    comments_count integer DEFAULT 0,
    is_hot boolean DEFAULT false,
    parent_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT community_posts_pkey PRIMARY KEY (id)
);

-- community_comments 테이블 생성
CREATE TABLE community_comments (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    post_id uuid NOT NULL,
    user_id uuid NOT NULL,
    content text NOT NULL,
    parent_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT community_comments_pkey PRIMARY KEY (id)
);

-- post_likes 테이블 생성
CREATE TABLE post_likes (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    post_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT post_likes_pkey PRIMARY KEY (id)
);

-- member_settings 테이블 생성
CREATE TABLE member_settings (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    notification_email boolean DEFAULT true,
    notification_sms boolean DEFAULT false,
    marketing_consent boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT member_settings_pkey PRIMARY KEY (id)
);

-- ========================================
-- 3단계: 인덱스 생성
-- ========================================

-- UNIQUE 인덱스들
CREATE UNIQUE INDEX IF NOT EXISTS members_email_key ON members(email);
CREATE UNIQUE INDEX IF NOT EXISTS experts_user_id_key ON experts(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS experts_email_key ON experts(email);

-- ========================================
-- 4단계: 외래키 제약조건 생성
-- ========================================

-- expert_products 외래키
ALTER TABLE expert_products 
ADD CONSTRAINT expert_products_expert_id_fkey 
FOREIGN KEY (expert_id) REFERENCES experts(id);

-- coaching_applications 외래키
ALTER TABLE coaching_applications 
ADD CONSTRAINT coaching_applications_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES members(id);

ALTER TABLE coaching_applications 
ADD CONSTRAINT coaching_applications_expert_id_fkey 
FOREIGN KEY (expert_id) REFERENCES experts(id);

-- community_posts 외래키
ALTER TABLE community_posts 
ADD CONSTRAINT community_posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES members(id);

-- community_comments 외래키
ALTER TABLE community_comments 
ADD CONSTRAINT community_comments_post_id_fkey 
FOREIGN KEY (post_id) REFERENCES community_posts(id);

ALTER TABLE community_comments 
ADD CONSTRAINT community_comments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES members(id);

-- post_likes 외래키
ALTER TABLE post_likes 
ADD CONSTRAINT post_likes_post_id_fkey 
FOREIGN KEY (post_id) REFERENCES community_posts(id);

ALTER TABLE post_likes 
ADD CONSTRAINT post_likes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES members(id);

-- member_settings 외래키
ALTER TABLE member_settings 
ADD CONSTRAINT member_settings_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES members(id);

-- ========================================
-- 5단계: 검증 쿼리
-- ========================================

-- 테이블 생성 확인
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 제약조건 확인
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type
FROM information_schema.table_constraints tc
WHERE tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- ========================================
-- ✅ 스키마 적용 완료!
-- ======================================== 