-- =====================================================
-- 개발환경 데이터베이스 완전 설정 스크립트
-- =====================================================

-- 1. members 테이블 생성
CREATE TABLE IF NOT EXISTS public.members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  password character varying NOT NULL,
  name character varying,
  phone character varying,
  email character varying NOT NULL UNIQUE,
  signup_type character varying DEFAULT 'email'::character varying CHECK (signup_type::text = ANY (ARRAY['email'::character varying, 'kakao'::character varying, 'naver'::character varying, 'google'::character varying]::text[])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  user_id character varying,
  birth_date date,
  address text,
  postal_code character varying,
  address_detail text,
  auth_user_id uuid,
  status text DEFAULT 'pending'::text,
  CONSTRAINT members_pkey PRIMARY KEY (id)
);

-- 2. mbti_diagnosis 테이블 생성
CREATE TABLE IF NOT EXISTS public.mbti_diagnosis (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id character varying NOT NULL,
  responses jsonb NOT NULL,
  result_type character varying NOT NULL,
  report_content text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  member_id uuid DEFAULT auth.uid(),
  CONSTRAINT mbti_diagnosis_pkey PRIMARY KEY (id)
);

-- 3. finance_diagnosis 테이블 생성
CREATE TABLE IF NOT EXISTS public.finance_diagnosis (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id character varying NOT NULL,
  responses jsonb NOT NULL,
  report_content text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT finance_diagnosis_pkey PRIMARY KEY (id)
);

-- 4. experts 테이블 생성
CREATE TABLE IF NOT EXISTS public.experts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id character varying NOT NULL UNIQUE,
  password character varying NOT NULL,
  profile_image_url character varying,
  expert_name character varying NOT NULL,
  company_name character varying,
  email character varying NOT NULL,
  main_field character varying NOT NULL CHECK (main_field::text = ANY (ARRAY['부동산'::character varying, '세무절세'::character varying, '금융레버리지'::character varying, '사업'::character varying, '은퇴설계'::character varying, '보험'::character varying, '기타'::character varying]::text[])),
  company_phone character varying,
  personal_phone character varying,
  tags text[],
  core_intro text,
  youtube_channel_url character varying,
  intro_video_url character varying,
  press_url character varying,
  education_and_certifications text,
  career text,
  achievements text,
  expertise_detail text,
  experience_years integer,
  status character varying NOT NULL CHECK (status::text = ANY (ARRAY['활성'::character varying, '대기'::character varying, '비활성'::character varying]::text[])),
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

-- 5. expert_products 테이블 생성
CREATE TABLE IF NOT EXISTS public.expert_products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id character varying NOT NULL,
  product_name character varying NOT NULL,
  regular_price integer NOT NULL,
  price integer NOT NULL,
  duration integer NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT expert_products_pkey PRIMARY KEY (id),
  CONSTRAINT fk_expert_products_user_id FOREIGN KEY (user_id) REFERENCES public.experts(user_id)
);

-- 6. coaching_applications 테이블 생성
CREATE TABLE IF NOT EXISTS public.coaching_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  expert_user_id character varying NOT NULL,
  member_user_id character varying NOT NULL,
  title character varying NOT NULL,
  content text NOT NULL,
  method character varying NOT NULL CHECK (method::text = ANY (ARRAY['전화'::character varying, '화상'::character varying, '메시지'::character varying, '방문'::character varying]::text[])),
  name character varying NOT NULL,
  contact character varying NOT NULL,
  email character varying NOT NULL,
  attachment_url character varying,
  product_name character varying NOT NULL,
  product_price integer NOT NULL,
  applied_at timestamp with time zone DEFAULT now(),
  paid_at timestamp with time zone,
  status character varying NOT NULL CHECK (status::text = ANY (ARRAY['접수'::character varying, '진행중'::character varying, '진행완료'::character varying]::text[])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT coaching_applications_pkey PRIMARY KEY (id),
  CONSTRAINT fk_coaching_applications_expert_user_id FOREIGN KEY (expert_user_id) REFERENCES public.experts(user_id)
);

-- 7. community_posts 테이블 생성
CREATE TABLE IF NOT EXISTS public.community_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  category character varying NOT NULL,
  title character varying NOT NULL,
  content text NOT NULL,
  views integer DEFAULT 0,
  likes integer DEFAULT 0,
  answers_count integer DEFAULT 0,
  parent_id uuid,
  member_user_id character varying NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  ishot boolean NOT NULL DEFAULT false,
  CONSTRAINT community_posts_pkey PRIMARY KEY (id),
  CONSTRAINT fk_community_posts_parent_id FOREIGN KEY (parent_id) REFERENCES public.community_posts(id)
);

-- 8. community_comments 테이블 생성
CREATE TABLE IF NOT EXISTS public.community_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL,
  parent_comment_id uuid,
  member_user_id character varying NOT NULL,
  content text NOT NULL CHECK (length(TRIM(BOTH FROM content)) > 0),
  likes integer DEFAULT 0 CHECK (likes >= 0),
  is_deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT community_comments_pkey PRIMARY KEY (id),
  CONSTRAINT fk_community_comments_post_id FOREIGN KEY (post_id) REFERENCES public.community_posts(id),
  CONSTRAINT fk_community_comments_parent_id FOREIGN KEY (parent_comment_id) REFERENCES public.community_comments(id)
);

-- 9. RLS 정책 설정 (간단한 버전)
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mbti_diagnosis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_diagnosis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

-- 기본 RLS 정책 (모든 사용자 허용 - 개발용)
CREATE POLICY "Allow all operations on members" ON public.members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on mbti_diagnosis" ON public.mbti_diagnosis FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on finance_diagnosis" ON public.finance_diagnosis FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on experts" ON public.experts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on expert_products" ON public.expert_products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on coaching_applications" ON public.coaching_applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on community_posts" ON public.community_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on community_comments" ON public.community_comments FOR ALL USING (true) WITH CHECK (true);

-- 10. 샘플 데이터 삽입
INSERT INTO public.members (id, password, name, email, signup_type, user_id, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'password123', '테스트사용자1', 'test1@example.com', 'email', 'test1', 'active'),
('550e8400-e29b-41d4-a716-446655440002', 'password123', '테스트사용자2', 'test2@example.com', 'email', 'test2', 'active'),
('550e8400-e29b-41d4-a716-446655440003', 'password123', '테스트사용자3', 'test3@example.com', 'email', 'test3', 'active'),
('550e8400-e29b-41d4-a716-446655440004', 'password123', '전문가1', 'expert1@example.com', 'email', 'expert1', 'active'),
('550e8400-e29b-41d4-a716-446655440005', 'password123', '전문가2', 'expert2@example.com', 'email', 'expert2', 'active'),
('550e8400-e29b-41d4-a716-446655440006', 'password123', '관리자', 'admin@example.com', 'email', 'admin', 'active')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.experts (user_id, password, expert_name, email, main_field, status) VALUES
('expert1', 'password123', '김부동산', 'expert1@example.com', '부동산', '활성'),
('expert2', 'password123', '이세무', 'expert2@example.com', '세무절세', '활성')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.expert_products (user_id, product_name, regular_price, price, duration, description) VALUES
('expert1', '부동산 투자 상담', 100000, 80000, 60, '부동산 투자 전략 상담'),
('expert2', '세무 절세 상담', 150000, 120000, 90, '세무 절세 전략 상담')
ON CONFLICT DO NOTHING;

INSERT INTO public.mbti_diagnosis (user_id, responses, result_type, report_content) VALUES
('test1', '{"q1": "A", "q2": "B"}', 'INTJ', '당신은 전략적 사고를 가진 분석가입니다.'),
('test2', '{"q1": "B", "q2": "A"}', 'ENFP', '당신은 창의적이고 열정적인 혁신가입니다.'),
('test3', '{"q1": "A", "q2": "A"}', 'ISTJ', '당신은 신뢰할 수 있는 실용주의자입니다.')
ON CONFLICT DO NOTHING;

INSERT INTO public.finance_diagnosis (user_id, responses, report_content) VALUES
('test1', '{"income": 5000000, "expense": 3000000}', '안정적인 재무 상태를 유지하고 있습니다.'),
('test2', '{"income": 4000000, "expense": 3500000}', '지출을 줄여 저축을 늘리는 것이 좋겠습니다.'),
('test3', '{"income": 6000000, "expense": 2500000}', '훌륭한 재무 관리 능력을 보여주고 있습니다.')
ON CONFLICT DO NOTHING;

INSERT INTO public.coaching_applications (expert_user_id, member_user_id, title, content, method, name, contact, email, product_name, product_price, status) VALUES
('expert1', 'test1', '부동산 투자 상담 신청', '부동산 투자에 대해 상담받고 싶습니다.', '화상', '테스트사용자1', '010-1234-5678', 'test1@example.com', '부동산 투자 상담', 80000, '접수'),
('expert2', 'test2', '세무 절세 상담 신청', '세무 절세에 대해 상담받고 싶습니다.', '전화', '테스트사용자2', '010-2345-6789', 'test2@example.com', '세무 절세 상담', 120000, '진행중'),
('expert1', 'test3', '부동산 상담 신청', '부동산에 대해 상담받고 싶습니다.', '메시지', '테스트사용자3', '010-3456-7890', 'test3@example.com', '부동산 투자 상담', 80000, '진행완료')
ON CONFLICT DO NOTHING;

INSERT INTO public.community_posts (category, title, content, member_user_id, ishot) VALUES
('일반', '재테크에 대한 질문입니다', '재테크를 시작하려고 하는데 조언 부탁드립니다.', 'test1', false),
('투자', '부동산 투자 경험 공유', '부동산 투자 경험을 공유합니다.', 'test2', true),
('절세', '세무 절세 팁', '세무 절세에 대한 팁을 공유합니다.', 'test3', false),
('일반', '금융 상품 추천', '좋은 금융 상품을 추천해주세요.', 'test1', false)
ON CONFLICT DO NOTHING;

-- 완료 메시지
SELECT '개발환경 데이터베이스 설정이 완료되었습니다!' as message; 