-- 전문가 테이블 생성
CREATE TABLE experts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL, -- 회원 아이디 (members 테이블과 연동)
    expert_name VARCHAR(100) NOT NULL, -- 전문가 이름
    expert_type VARCHAR(50) NOT NULL, -- 전문 분야 (예: 재무설계, 투자상담, 세무상담, 부동산, 보험 등)
    license_number VARCHAR(100), -- 자격증 번호
    experience_years INTEGER, -- 경력 연수
    education VARCHAR(200), -- 학력
    certifications TEXT[], -- 보유 자격증 배열
    introduction TEXT, -- 전문가 소개
    profile_image_url VARCHAR(500), -- 프로필 이미지 URL
    contact_email VARCHAR(255), -- 연락처 이메일
    contact_phone VARCHAR(20), -- 연락처 전화번호
    hourly_rate INTEGER, -- 시간당 상담료
    is_active BOOLEAN DEFAULT true, -- 활성화 상태
    is_verified BOOLEAN DEFAULT false, -- 검증 상태
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- 등록일
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- 수정일
    created_by VARCHAR(50), -- 등록한 관리자 ID
    approved_at TIMESTAMP WITH TIME ZONE, -- 승인일
    approved_by VARCHAR(50) -- 승인한 관리자 ID
);

-- 외래키 제약조건 추가 (members 테이블과 연동)
ALTER TABLE experts 
ADD CONSTRAINT fk_experts_user_id 
FOREIGN KEY (user_id) 
REFERENCES members(user_id) 
ON DELETE CASCADE;

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_experts_user_id ON experts(user_id);
CREATE INDEX idx_experts_expert_type ON experts(expert_type);
CREATE INDEX idx_experts_is_active ON experts(is_active);
CREATE INDEX idx_experts_is_verified ON experts(is_verified);
CREATE INDEX idx_experts_created_at ON experts(created_at);

-- RLS (Row Level Security) 활성화
ALTER TABLE experts ENABLE ROW LEVEL SECURITY;

-- RLS 정책 설정
-- 모든 사용자가 활성화된 전문가 목록 조회 가능
CREATE POLICY "Anyone can view active experts" ON experts
    FOR SELECT USING (is_active = true AND is_verified = true);

-- 사용자는 자신의 전문가 프로필만 조회/수정 가능
CREATE POLICY "Users can view own expert profile" ON experts
    FOR SELECT USING (
        user_id IN (
            SELECT user_id FROM members 
            WHERE id = auth.uid()::uuid
        )
    );

CREATE POLICY "Users can update own expert profile" ON experts
    FOR UPDATE USING (
        user_id IN (
            SELECT user_id FROM members 
            WHERE id = auth.uid()::uuid
        )
    );

-- 관리자는 모든 전문가 정보 조회/수정 가능
CREATE POLICY "Admins can view all experts" ON experts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM members 
            WHERE id = auth.uid()::uuid 
            AND signup_type = 'admin'
        )
    );

CREATE POLICY "Admins can insert experts" ON experts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM members 
            WHERE id = auth.uid()::uuid 
            AND signup_type = 'admin'
        )
    );

CREATE POLICY "Admins can update experts" ON experts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM members 
            WHERE id = auth.uid()::uuid 
            AND signup_type = 'admin'
        )
    );

CREATE POLICY "Admins can delete experts" ON experts
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM members 
            WHERE id = auth.uid()::uuid 
            AND signup_type = 'admin'
        )
    );

-- 자동으로 updated_at 업데이트하는 트리거
CREATE TRIGGER update_experts_updated_at 
    BEFORE UPDATE ON experts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 댓글: 테이블 생성 완료 후 실행할 수 있는 샘플 데이터 삽입 쿼리
-- INSERT INTO experts (
--     user_id, expert_name, expert_type, license_number, experience_years, 
--     education, certifications, introduction, contact_email, contact_phone, 
--     hourly_rate, created_by
-- ) VALUES 
--     ('testuser1', 
--      '김재무', 
--      '재무설계', 
--      'FP-2024-001', 
--      10, 
--      '서울대학교 경영학과 졸업', 
--      ARRAY['AFP', 'CFP', '투자상담사'], 
--      '10년간 다양한 고객의 재무설계를 도와왔습니다. 개인과 가족의 재무 목표 달성을 위한 맞춤형 솔루션을 제공합니다.', 
--      'kim@expert.com', 
--      '010-1234-5678', 
--      50000, 
--      'admin1'
--     ),
--     ('testuser2', 
--      '이투자', 
--      '투자상담', 
--      'INV-2024-002', 
--      8, 
--      '연세대학교 경제학과 졸업', 
--      ARRAY['투자상담사', '증권분석사'], 
--      '8년간 주식, 채권, 부동산 등 다양한 투자 분야에서 상담 경험을 쌓았습니다. 리스크 관리와 수익 극대화를 동시에 달성하는 전략을 제시합니다.', 
--      'lee@expert.com', 
--      '010-9876-5432', 
--      60000, 
--      'admin1'
--     ); 