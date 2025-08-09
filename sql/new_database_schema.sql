-- =====================================================
-- RichWay 플랫폼 새로운 데이터베이스 스키마
-- 설계 원칙: 확장성, 일관성, 성능 최적화
-- =====================================================

-- 1. 사용자 관리 테이블
-- =====================================================

-- 사용자 기본 정보
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- 소셜 로그인의 경우 NULL
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    profile_image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용자 인증 정보 (소셜 로그인 등)
CREATE TABLE user_auth_providers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- 'kakao', 'naver', 'google', 'email'
    provider_user_id VARCHAR(255) NOT NULL,
    access_token VARCHAR(500),
    refresh_token VARCHAR(500),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(provider, provider_user_id)
);

-- 사용자 역할 및 권한
CREATE TABLE user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- 'admin', 'expert', 'member'
    granted_by UUID REFERENCES users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- 2. 전문가 관리 테이블
-- =====================================================

-- 전문가 기본 정보
CREATE TABLE experts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expert_name VARCHAR(100) NOT NULL,
    expert_type VARCHAR(50) NOT NULL, -- 'financial_planning', 'investment', 'tax', 'real_estate', 'insurance'
    license_number VARCHAR(100),
    experience_years INTEGER,
    education VARCHAR(200),
    certifications TEXT[],
    introduction TEXT,
    hourly_rate INTEGER,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 전문가 상세 정보 (확장 가능)
CREATE TABLE expert_details (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    expert_id UUID NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL, -- 'specialization', 'awards', 'publications' 등
    field_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 상품 및 서비스 관리
-- =====================================================

-- 상품 카테고리
CREATE TABLE product_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES product_categories(id),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 상품 정보
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    expert_id UUID NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
    category_id UUID REFERENCES product_categories(id),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    duration_minutes INTEGER, -- 상담 시간
    max_participants INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 코칭 및 상담 관리
-- =====================================================

-- 코칭 신청
CREATE TABLE coaching_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expert_id UUID NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'completed', 'cancelled'
    application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    preferred_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 코칭 세션
CREATE TABLE coaching_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id UUID NOT NULL REFERENCES coaching_applications(id) ON DELETE CASCADE,
    session_date TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'cancelled'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 진단 시스템
-- =====================================================

-- 진단 카테고리
CREATE TABLE diagnosis_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- 'mbti', 'finance', 'investment_style' 등
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 진단 결과
CREATE TABLE diagnosis_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES diagnosis_categories(id),
    result_data JSONB NOT NULL, -- 유연한 결과 저장
    score INTEGER, -- 점수 (있는 경우)
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 커뮤니티 시스템
-- =====================================================

-- 커뮤니티 카테고리
CREATE TABLE community_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 커뮤니티 게시글
CREATE TABLE community_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES community_categories(id),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 커뮤니티 댓글
CREATE TABLE community_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES community_comments(id), -- 대댓글 지원
    content TEXT NOT NULL,
    like_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 좋아요 시스템
CREATE TABLE likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(50) NOT NULL, -- 'post', 'comment'
    target_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, target_type, target_id)
);

-- 7. 교육 시스템
-- =====================================================

-- 교육 카테고리
CREATE TABLE education_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES education_categories(id),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 교육 콘텐츠
CREATE TABLE education_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES education_categories(id),
    title VARCHAR(200) NOT NULL,
    content TEXT,
    video_url VARCHAR(500),
    duration_minutes INTEGER,
    difficulty_level VARCHAR(20), -- 'beginner', 'intermediate', 'advanced'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 학습 진행도
CREATE TABLE user_learning_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES education_content(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, content_id)
);

-- 8. 알림 시스템
-- =====================================================

-- 알림 템플릿
CREATE TABLE notification_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    title_template TEXT NOT NULL,
    body_template TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'email', 'push', 'sms'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용자 알림
CREATE TABLE user_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES notification_templates(id),
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- 9. 시스템 설정
-- =====================================================

-- 사용자 설정
CREATE TABLE user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, setting_key)
);

-- 시스템 설정
CREATE TABLE system_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 인덱스 생성 (성능 최적화)
-- =====================================================

-- 사용자 관련 인덱스
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_user_auth_providers_user_id ON user_auth_providers(user_id);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);

-- 전문가 관련 인덱스
CREATE INDEX idx_experts_user_id ON experts(user_id);
CREATE INDEX idx_experts_expert_type ON experts(expert_type);
CREATE INDEX idx_experts_is_verified ON experts(is_verified);

-- 상품 관련 인덱스
CREATE INDEX idx_products_expert_id ON products(expert_id);
CREATE INDEX idx_products_category_id ON products(category_id);

-- 코칭 관련 인덱스
CREATE INDEX idx_coaching_applications_user_id ON coaching_applications(user_id);
CREATE INDEX idx_coaching_applications_expert_id ON coaching_applications(expert_id);
CREATE INDEX idx_coaching_applications_status ON coaching_applications(status);

-- 진단 관련 인덱스
CREATE INDEX idx_diagnosis_results_user_id ON diagnosis_results(user_id);
CREATE INDEX idx_diagnosis_results_category_id ON diagnosis_results(category_id);

-- 커뮤니티 관련 인덱스
CREATE INDEX idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX idx_community_posts_category_id ON community_posts(category_id);
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at);
CREATE INDEX idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX idx_community_comments_user_id ON community_comments(user_id);

-- 좋아요 인덱스
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_target ON likes(target_type, target_id);

-- 교육 관련 인덱스
CREATE INDEX idx_education_content_category_id ON education_content(category_id);
CREATE INDEX idx_user_learning_progress_user_id ON user_learning_progress(user_id);

-- 알림 관련 인덱스
CREATE INDEX idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX idx_user_notifications_is_read ON user_notifications(is_read);

-- =====================================================
-- 트리거 함수 및 트리거
-- =====================================================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거 생성
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experts_updated_at BEFORE UPDATE ON experts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coaching_applications_updated_at BEFORE UPDATE ON coaching_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coaching_sessions_updated_at BEFORE UPDATE ON coaching_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON community_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_comments_updated_at BEFORE UPDATE ON community_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_education_content_updated_at BEFORE UPDATE ON education_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_learning_progress_updated_at BEFORE UPDATE ON user_learning_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- RLS (Row Level Security) 설정
-- =====================================================

-- 사용자 테이블 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- 전문가 테이블 RLS
ALTER TABLE experts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active experts" ON experts FOR SELECT USING (is_active = true AND is_verified = true);
CREATE POLICY "Users can view own expert profile" ON experts FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own expert profile" ON experts FOR UPDATE USING (user_id = auth.uid());

-- 코칭 신청 RLS
ALTER TABLE coaching_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own applications" ON coaching_applications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create applications" ON coaching_applications FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own applications" ON coaching_applications FOR UPDATE USING (user_id = auth.uid());

-- 커뮤니티 RLS
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active posts" ON community_posts FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create posts" ON community_posts FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own posts" ON community_posts FOR UPDATE USING (user_id = auth.uid());

ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active comments" ON community_comments FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create comments" ON community_comments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own comments" ON community_comments FOR UPDATE USING (user_id = auth.uid());

-- =====================================================
-- 샘플 데이터 삽입
-- =====================================================

-- 진단 카테고리 샘플 데이터
INSERT INTO diagnosis_categories (name, description, type) VALUES
('MBTI 성격유형', 'MBTI 16가지 성격유형 진단', 'mbti'),
('재무건강도', '개인 재무 상태 진단', 'finance'),
('투자성향', '투자 성향 및 리스크 선호도 진단', 'investment_style');

-- 커뮤니티 카테고리 샘플 데이터
INSERT INTO community_categories (name, description, sort_order) VALUES
('자유게시판', '자유로운 이야기를 나누는 공간', 1),
('투자상담', '투자 관련 질문과 답변', 2),
('재무설계', '재무설계 관련 토론', 3),
('부동산', '부동산 투자 및 상담', 4);

-- 알림 템플릿 샘플 데이터
INSERT INTO notification_templates (name, title_template, body_template, type) VALUES
('코칭 신청 승인', '코칭 신청이 승인되었습니다', '안녕하세요, {user_name}님. {expert_name} 전문가와의 코칭이 승인되었습니다.', 'email'),
('새 댓글 알림', '새로운 댓글이 달렸습니다', '{commenter_name}님이 회원님의 게시글에 댓글을 남겼습니다.', 'push'); 