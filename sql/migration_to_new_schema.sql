-- =====================================================
-- 기존 스키마에서 새로운 스키마로 마이그레이션
-- =====================================================

-- 1단계: 기존 데이터 백업 (실제 운영에서는 반드시 백업 후 실행)
-- =====================================================

-- 기존 테이블들의 데이터를 임시 테이블에 백업
CREATE TABLE temp_members AS SELECT * FROM members;
CREATE TABLE temp_experts AS SELECT * FROM experts;
CREATE TABLE temp_coaching_applications AS SELECT * FROM coaching_applications;
CREATE TABLE temp_mbti_diagnosis AS SELECT * FROM mbti_diagnosis;
CREATE TABLE temp_finance_diagnosis AS SELECT * FROM finance_diagnosis;
CREATE TABLE temp_community_posts AS SELECT * FROM community_posts;
CREATE TABLE temp_community_comments AS SELECT * FROM community_comments;
CREATE TABLE temp_post_likes AS SELECT * FROM post_likes;

-- 2단계: 기존 테이블 삭제 (외래키 제약조건 제거 후)
-- =====================================================

-- 외래키 제약조건 제거
ALTER TABLE coaching_applications DROP CONSTRAINT IF EXISTS fk_coaching_applications_member_user;
ALTER TABLE mbti_diagnosis DROP CONSTRAINT IF EXISTS mbti_diagnosis_user_fkey;
ALTER TABLE finance_diagnosis DROP CONSTRAINT IF EXISTS finance_diagnosis_user_fkey;
ALTER TABLE community_comments DROP CONSTRAINT IF EXISTS community_comments_post_id_fkey;
ALTER TABLE community_comments DROP CONSTRAINT IF EXISTS community_comments_user_id_fkey;
ALTER TABLE post_likes DROP CONSTRAINT IF EXISTS post_likes_post_id_fkey;
ALTER TABLE post_likes DROP CONSTRAINT IF EXISTS post_likes_user_id_fkey;

-- 기존 테이블 삭제
DROP TABLE IF EXISTS post_likes CASCADE;
DROP TABLE IF EXISTS community_comments CASCADE;
DROP TABLE IF EXISTS community_posts CASCADE;
DROP TABLE IF EXISTS finance_diagnosis CASCADE;
DROP TABLE IF EXISTS mbti_diagnosis CASCADE;
DROP TABLE IF EXISTS coaching_applications CASCADE;
DROP TABLE IF EXISTS experts CASCADE;
DROP TABLE IF EXISTS members CASCADE;

-- 3단계: 새로운 스키마 생성
-- =====================================================

-- 새로운 스키마 파일 실행 (new_database_schema.sql의 내용)
-- 여기서는 주요 테이블들만 생성

-- 사용자 기본 정보
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    profile_image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용자 인증 정보
CREATE TABLE user_auth_providers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    access_token VARCHAR(500),
    refresh_token VARCHAR(500),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(provider, provider_user_id)
);

-- 사용자 역할
CREATE TABLE user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    granted_by UUID REFERENCES users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- 전문가 정보
CREATE TABLE experts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expert_name VARCHAR(100) NOT NULL,
    expert_type VARCHAR(50) NOT NULL,
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

-- 코칭 신청
CREATE TABLE coaching_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expert_id UUID NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
    product_id UUID, -- 나중에 products 테이블 참조
    status VARCHAR(50) DEFAULT 'pending',
    application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    preferred_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 진단 카테고리
CREATE TABLE diagnosis_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 진단 결과
CREATE TABLE diagnosis_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES diagnosis_categories(id),
    result_data JSONB NOT NULL,
    score INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
    parent_id UUID REFERENCES community_comments(id),
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
    target_type VARCHAR(50) NOT NULL,
    target_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, target_type, target_id)
);

-- 4단계: 기존 데이터 마이그레이션
-- =====================================================

-- 사용자 데이터 마이그레이션
INSERT INTO users (id, email, password_hash, name, phone, is_active, is_verified, created_at, updated_at)
SELECT 
    id,
    email,
    password,
    name,
    phone,
    true,
    true,
    created_at,
    updated_at
FROM temp_members;

-- 사용자 인증 정보 마이그레이션
INSERT INTO user_auth_providers (user_id, provider, provider_user_id, created_at)
SELECT 
    id,
    signup_type,
    user_id,
    created_at
FROM temp_members;

-- 사용자 역할 마이그레이션
INSERT INTO user_roles (user_id, role, granted_at, is_active)
SELECT 
    id,
    CASE 
        WHEN signup_type = 'admin' THEN 'admin'
        ELSE 'member'
    END,
    created_at,
    true
FROM temp_members;

-- 전문가 데이터 마이그레이션
INSERT INTO experts (id, user_id, expert_name, expert_type, license_number, experience_years, education, certifications, introduction, hourly_rate, is_verified, is_active, created_at, updated_at)
SELECT 
    e.id,
    e.user_id,
    e.expert_name,
    e.expert_type,
    e.license_number,
    e.experience_years,
    e.education,
    e.certifications,
    e.introduction,
    e.hourly_rate,
    e.is_verified,
    e.is_active,
    e.created_at,
    e.updated_at
FROM temp_experts e
JOIN users u ON e.user_id = u.email; -- 임시로 email로 매칭

-- 코칭 신청 데이터 마이그레이션
INSERT INTO coaching_applications (id, user_id, expert_id, status, application_date, preferred_date, notes, created_at, updated_at)
SELECT 
    ca.id,
    u.id,
    e.id,
    ca.status,
    ca.application_date,
    ca.preferred_date,
    ca.notes,
    ca.created_at,
    ca.updated_at
FROM temp_coaching_applications ca
JOIN users u ON ca.member_user = u.email -- 임시로 email로 매칭
JOIN experts e ON ca.expert_id = e.id;

-- 진단 카테고리 생성
INSERT INTO diagnosis_categories (name, description, type) VALUES
('MBTI 성격유형', 'MBTI 16가지 성격유형 진단', 'mbti'),
('재무건강도', '개인 재무 상태 진단', 'finance');

-- MBTI 진단 결과 마이그레이션
INSERT INTO diagnosis_results (user_id, category_id, result_data, score, completed_at, created_at)
SELECT 
    u.id,
    dc.id,
    jsonb_build_object(
        'mbti_type', md.mbti_type,
        'answers', md.answers,
        'description', md.description
    ),
    NULL,
    md.created_at,
    md.created_at
FROM temp_mbti_diagnosis md
JOIN users u ON md."user" = u.email
JOIN diagnosis_categories dc ON dc.type = 'mbti';

-- 재무 진단 결과 마이그레이션
INSERT INTO diagnosis_results (user_id, category_id, result_data, score, completed_at, created_at)
SELECT 
    u.id,
    dc.id,
    jsonb_build_object(
        'diagnosis_result', fd.diagnosis_result,
        'answers', fd.answers,
        'recommendations', fd.recommendations
    ),
    fd.score,
    fd.created_at,
    fd.created_at
FROM temp_finance_diagnosis fd
JOIN users u ON fd."user" = u.email
JOIN diagnosis_categories dc ON dc.type = 'finance';

-- 커뮤니티 카테고리 생성
INSERT INTO community_categories (name, description, sort_order) VALUES
('자유게시판', '자유로운 이야기를 나누는 공간', 1),
('투자상담', '투자 관련 질문과 답변', 2),
('재무설계', '재무설계 관련 토론', 3);

-- 커뮤니티 게시글 마이그레이션
INSERT INTO community_posts (id, user_id, category_id, title, content, view_count, like_count, is_active, created_at, updated_at)
SELECT 
    cp.id,
    u.id,
    cc.id,
    cp.title,
    cp.content,
    cp.view_count,
    cp.like_count,
    cp.is_active,
    cp.created_at,
    cp.updated_at
FROM temp_community_posts cp
JOIN users u ON cp.user_id = u.email
LEFT JOIN community_categories cc ON cc.name = '자유게시판'; -- 기본 카테고리로 설정

-- 커뮤니티 댓글 마이그레이션
INSERT INTO community_comments (id, post_id, user_id, content, like_count, is_active, created_at, updated_at)
SELECT 
    cc.id,
    cc.post_id,
    u.id,
    cc.content,
    cc.like_count,
    cc.is_active,
    cc.created_at,
    cc.updated_at
FROM temp_community_comments cc
JOIN users u ON cc.user_id = u.email;

-- 좋아요 데이터 마이그레이션
INSERT INTO likes (user_id, target_type, target_id, created_at)
SELECT 
    u.id,
    'post',
    pl.post_id,
    pl.created_at
FROM temp_post_likes pl
JOIN users u ON pl.user_id = u.email;

-- 5단계: 인덱스 생성
-- =====================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_user_auth_providers_user_id ON user_auth_providers(user_id);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_experts_user_id ON experts(user_id);
CREATE INDEX idx_experts_expert_type ON experts(expert_type);
CREATE INDEX idx_coaching_applications_user_id ON coaching_applications(user_id);
CREATE INDEX idx_coaching_applications_expert_id ON coaching_applications(expert_id);
CREATE INDEX idx_diagnosis_results_user_id ON diagnosis_results(user_id);
CREATE INDEX idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_target ON likes(target_type, target_id);

-- 6단계: 트리거 생성
-- =====================================================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experts_updated_at BEFORE UPDATE ON experts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coaching_applications_updated_at BEFORE UPDATE ON coaching_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON community_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_comments_updated_at BEFORE UPDATE ON community_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7단계: RLS 설정
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

-- 8단계: 임시 테이블 정리
-- =====================================================

-- 마이그레이션 완료 후 임시 테이블 삭제
-- DROP TABLE temp_members;
-- DROP TABLE temp_experts;
-- DROP TABLE temp_coaching_applications;
-- DROP TABLE temp_mbti_diagnosis;
-- DROP TABLE temp_finance_diagnosis;
-- DROP TABLE temp_community_posts;
-- DROP TABLE temp_community_comments;
-- DROP TABLE temp_post_likes;

-- 주의: 실제 운영에서는 마이그레이션이 성공적으로 완료된 후에만 임시 테이블을 삭제하세요. 