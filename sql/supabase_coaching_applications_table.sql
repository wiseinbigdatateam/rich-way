-- 부자코칭 신청 테이블 생성
CREATE TABLE coaching_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    expert_user_id VARCHAR(50) NOT NULL, -- 전문가 user_id (experts 테이블과 연동)
    member_user_id VARCHAR(50) NOT NULL, -- 신청자 user_id (members 테이블과 연동)
    title VARCHAR(255) NOT NULL, -- 코칭 제목
    content TEXT NOT NULL, -- 코칭 내용/요청사항
    method VARCHAR(100), -- 코칭 방법 (화상, 전화, 대면 등)
    name VARCHAR(100) NOT NULL, -- 신청자 이름
    contact VARCHAR(100) NOT NULL, -- 연락처
    email VARCHAR(255) NOT NULL, -- 이메일
    attachment_url VARCHAR(500), -- 첨부파일 URL
    product_name VARCHAR(255) NOT NULL, -- 상품명
    product_price INTEGER NOT NULL, -- 상품 가격
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- 신청일
    paid_at TIMESTAMP WITH TIME ZONE, -- 결제일
    status VARCHAR(50) DEFAULT 'pending' NOT NULL, -- 상태 (pending, approved, rejected, completed, cancelled)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- 생성일
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- 수정일
);

-- 외래키 제약조건 추가
ALTER TABLE coaching_applications 
ADD CONSTRAINT fk_coaching_applications_expert_user_id 
FOREIGN KEY (expert_user_id) 
REFERENCES members(user_id) 
ON DELETE CASCADE;

ALTER TABLE coaching_applications 
ADD CONSTRAINT fk_coaching_applications_member_user_id 
FOREIGN KEY (member_user_id) 
REFERENCES members(user_id) 
ON DELETE CASCADE;

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_coaching_applications_expert_user_id ON coaching_applications(expert_user_id);
CREATE INDEX idx_coaching_applications_member_user_id ON coaching_applications(member_user_id);
CREATE INDEX idx_coaching_applications_status ON coaching_applications(status);
CREATE INDEX idx_coaching_applications_applied_at ON coaching_applications(applied_at);
CREATE INDEX idx_coaching_applications_created_at ON coaching_applications(created_at);

-- RLS (Row Level Security) 활성화
ALTER TABLE coaching_applications ENABLE ROW LEVEL SECURITY;

-- RLS 정책 설정
-- 사용자는 자신이 신청한 코칭만 조회 가능
CREATE POLICY "Users can view own coaching applications" ON coaching_applications
    FOR SELECT USING (
        member_user_id IN (
            SELECT user_id FROM members 
            WHERE id = auth.uid()::uuid
        )
    );

-- 전문가는 자신에게 신청된 코칭만 조회 가능
CREATE POLICY "Experts can view applications to them" ON coaching_applications
    FOR SELECT USING (
        expert_user_id IN (
            SELECT user_id FROM members 
            WHERE id = auth.uid()::uuid
        )
    );

-- 인증된 사용자는 코칭 신청 가능
CREATE POLICY "Authenticated users can insert coaching applications" ON coaching_applications
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND
        member_user_id IN (
            SELECT user_id FROM members 
            WHERE id = auth.uid()::uuid
        )
    );

-- 사용자는 자신이 신청한 코칭 수정 가능 (상태가 pending일 때만)
CREATE POLICY "Users can update own coaching applications" ON coaching_applications
    FOR UPDATE USING (
        member_user_id IN (
            SELECT user_id FROM members 
            WHERE id = auth.uid()::uuid
        ) AND status = 'pending'
    );

-- 전문가는 자신에게 신청된 코칭의 상태 수정 가능
CREATE POLICY "Experts can update coaching status" ON coaching_applications
    FOR UPDATE USING (
        expert_user_id IN (
            SELECT user_id FROM members 
            WHERE id = auth.uid()::uuid
        )
    );

-- 관리자는 모든 코칭 신청 조회/수정/삭제 가능
CREATE POLICY "Admins can manage all coaching applications" ON coaching_applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM members 
            WHERE id = auth.uid()::uuid 
            AND signup_type = 'admin'
        )
    );

-- 자동으로 updated_at 업데이트하는 트리거
CREATE TRIGGER update_coaching_applications_updated_at 
    BEFORE UPDATE ON coaching_applications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 샘플 데이터 삽입 예시
-- INSERT INTO coaching_applications (
--     expert_user_id, member_user_id, title, content, method, name, contact, email,
--     product_name, product_price, status
-- ) VALUES 
-- ('expert1', 'member1', '부동산 투자 상담', '강남권 아파트 투자에 대해 상담받고 싶습니다.', '화상통화', '김고객', '010-1234-5678', 'customer@email.com', '부동산 투자 기초 코칭', 100000, 'pending'),
-- ('expert2', 'member2', '세무 절세 상담', '개인사업자 절세 방법에 대해 문의드립니다.', '전화상담', '이신청', '010-9876-5432', 'client@email.com', '세무 절세 전문 코칭', 80000, 'approved'); 