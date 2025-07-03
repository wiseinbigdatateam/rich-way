-- 회원 테이블 생성
CREATE TABLE members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL, -- 아이디
    password VARCHAR(255), -- 비밀번호 (소셜 로그인의 경우 NULL)
    name VARCHAR(100) NOT NULL, -- 이름
    phone VARCHAR(20), -- 연락처
    email VARCHAR(255) UNIQUE NOT NULL, -- 이메일
    signup_type VARCHAR(20) NOT NULL CHECK (signup_type IN ('email', 'kakao', 'naver', 'google')), -- 가입유형
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- 가입일
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- 수정일
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_signup_type ON members(signup_type);
CREATE INDEX idx_members_created_at ON members(created_at);

-- RLS (Row Level Security) 활성화
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- RLS 정책 설정
-- 사용자는 자신의 정보만 조회/수정 가능
CREATE POLICY "Users can view own profile" ON members
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON members
    FOR UPDATE USING (auth.uid()::text = id::text);

-- 관리자는 모든 사용자 정보 조회 가능
CREATE POLICY "Admins can view all profiles" ON members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM members 
            WHERE id = auth.uid()::uuid 
            AND signup_type = 'admin'
        )
    );

-- 자동으로 updated_at 업데이트하는 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 자동 업데이트 트리거
CREATE TRIGGER update_members_updated_at 
    BEFORE UPDATE ON members 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 댓글: 테이블 생성 완료 후 실행할 수 있는 샘플 데이터 삽입 쿼리
-- INSERT INTO members (user_id, password, name, phone, email, signup_type) 
-- VALUES 
--     ('testuser1', '$2a$10$encrypted_password_hash', '홍길동', '010-1234-5678', 'hong@example.com', 'email'),
--     ('testuser2', NULL, '김철수', '010-9876-5432', 'kim@example.com', 'kakao'); 