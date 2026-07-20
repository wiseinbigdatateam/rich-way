-- ========================================
-- 🗄️ 개발서버 DB 스키마 추출 결과
-- ========================================
-- 이 파일에 개발서버에서 추출한 스키마 정보를 저장하세요.
-- 생성일: 2025년 8월 5일

-- ========================================
-- 1. 테이블 목록
-- ========================================
-- 개발서버 테이블 목록:
-- schemaname | tablename | tableowner
-- public | coaching_applications | postgres
-- public | community_comments | postgres
-- public | community_posts | postgres
-- public | expert_products | postgres
-- public | experts | postgres
-- public | finance_diagnosis | postgres
-- public | member_settings | postgres
-- public | members | postgres
-- public | mbti_diagnosis | postgres
-- public | post_likes | postgres

-- ========================================
-- 2. CREATE TABLE 문들
-- ========================================

-- members 테이블
CREATE TABLE members (id uuid NOT NULL DEFAULT gen_random_uuid(), password character varying(255) NOT NULL, name character varying(100), phone character varying(20), email character varying(255) NOT NULL, signup_type character varying(20) DEFAULT '''email''::character varying'::character varying, created_at timestamp with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now(), user_id character varying, birth_date date, address text, postal_code character varying(10), address_detail text, auth_user_id uuid, status text DEFAULT 'pending'::text);

-- mbti_diagnosis 테이블
CREATE TABLE mbti_diagnosis (id uuid NOT NULL DEFAULT gen_random_uuid(), user_id uuid NOT NULL, result_type character varying(10) NOT NULL, created_at timestamp with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now(), report_content jsonb, responses jsonb);

-- finance_diagnosis 테이블
CREATE TABLE finance_diagnosis (id uuid NOT NULL DEFAULT gen_random_uuid(), user_id uuid NOT NULL, created_at timestamp with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now(), report_content jsonb, responses jsonb);

-- experts 테이블
CREATE TABLE experts (id uuid NOT NULL DEFAULT gen_random_uuid(), user_id character varying(50) NOT NULL, password character varying(255) NOT NULL, profile_image_url character varying(500), expert_name character varying(100) NOT NULL, company_name character varying(100), email character varying(255) NOT NULL, main_field character varying(20) NOT NULL, company_phone character varying(20), personal_phone character varying(20), tags ARRAY, core_intro text, youtube_channel_url character varying(500), intro_video_url character varying(500), press_url character varying(500), education_and_certifications text, career text, achievements text, expertise_detail text, experience_years integer, status character varying(10) NOT NULL, created_at timestamp with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now(), achievements_detail text, education_detail text, certifications_detail text, experience_detail text, expertise_areas ARRAY, is_featured boolean DEFAULT false);

-- expert_products 테이블
CREATE TABLE expert_products (id uuid NOT NULL DEFAULT gen_random_uuid(), expert_id uuid NOT NULL, product_name character varying(200) NOT NULL, regular_price integer NOT NULL, price integer NOT NULL, duration integer NOT NULL, description text, created_at timestamp with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now());

-- coaching_applications 테이블
CREATE TABLE coaching_applications (id uuid NOT NULL DEFAULT gen_random_uuid(), user_id uuid NOT NULL, expert_id uuid NOT NULL, title character varying(200) NOT NULL, content text NOT NULL, method character varying(50) NOT NULL, contact character varying(100) NOT NULL, email character varying(255) NOT NULL, attachment_url character varying(500), product_name character varying(200) NOT NULL, product_price integer NOT NULL, status character varying(20) DEFAULT '접수'::character varying, start_date date, end_date date, total_sessions integer DEFAULT 8, completed_sessions integer DEFAULT 0, hourly_rate numeric, total_amount numeric, applied_at timestamp with time zone DEFAULT now(), paid_at timestamp with time zone, created_at timestamp with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now());

-- community_posts 테이블
CREATE TABLE community_posts (id uuid NOT NULL DEFAULT gen_random_uuid(), user_id uuid NOT NULL, category character varying(50) NOT NULL, title character varying(200) NOT NULL, content text NOT NULL, views integer DEFAULT 0, likes_count integer DEFAULT 0, comments_count integer DEFAULT 0, is_hot boolean DEFAULT false, parent_id uuid, created_at timestamp with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now());

-- community_comments 테이블
CREATE TABLE community_comments (id uuid NOT NULL DEFAULT gen_random_uuid(), post_id uuid NOT NULL, user_id uuid NOT NULL, content text NOT NULL, parent_id uuid, created_at timestamp with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now());

-- post_likes 테이블
CREATE TABLE post_likes (id uuid NOT NULL DEFAULT gen_random_uuid(), post_id uuid NOT NULL, user_id uuid NOT NULL, created_at timestamp with time zone DEFAULT now());

-- member_settings 테이블
CREATE TABLE member_settings (id uuid NOT NULL DEFAULT gen_random_uuid(), user_id uuid NOT NULL, notification_email boolean DEFAULT true, notification_sms boolean DEFAULT false, marketing_consent boolean DEFAULT false, created_at timestamp with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now());

-- ========================================
-- 3. 인덱스 정보
-- ========================================
-- 주요 인덱스들:
-- members_email_key (UNIQUE)
-- experts_user_id_key (UNIQUE)
-- experts_email_key (UNIQUE)
-- community_posts_pkey (PRIMARY KEY)
-- community_comments_pkey (PRIMARY KEY)
-- post_likes_pkey (PRIMARY KEY)
-- member_settings_pkey (PRIMARY KEY)

-- ========================================
-- 4. 제약조건 정보
-- ========================================
-- 주요 제약조건들:
-- members_pkey (PRIMARY KEY)
-- mbti_diagnosis_pkey (PRIMARY KEY)
-- finance_diagnosis_pkey (PRIMARY KEY)
-- experts_pkey (PRIMARY KEY)
-- expert_products_pkey (PRIMARY KEY)
-- coaching_applications_pkey (PRIMARY KEY)
-- community_posts_pkey (PRIMARY KEY)
-- community_comments_pkey (PRIMARY KEY)
-- post_likes_pkey (PRIMARY KEY)
-- member_settings_pkey (PRIMARY KEY)

-- 외래키 제약조건:
-- expert_products_expert_id_fkey (expert_products.expert_id -> experts.id)
-- coaching_applications_user_id_fkey (coaching_applications.user_id -> members.id)
-- coaching_applications_expert_id_fkey (coaching_applications.expert_id -> experts.id)
-- community_posts_user_id_fkey (community_posts.user_id -> members.id)
-- community_comments_post_id_fkey (community_comments.post_id -> community_posts.id)
-- community_comments_user_id_fkey (community_comments.user_id -> members.id)
-- post_likes_post_id_fkey (post_likes.post_id -> community_posts.id)
-- post_likes_user_id_fkey (post_likes.user_id -> members.id)
-- member_settings_user_id_fkey (member_settings.user_id -> members.id)

-- ========================================
-- 저장 완료 후 이 파일을 운영서버에 적용하세요.
-- ======================================== 