-- 전문가 상품 테이블 생성
CREATE TABLE expert_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    expert_user_id VARCHAR(50) NOT NULL, -- 전문가 user_id (experts 테이블과 연동)
    product_name VARCHAR(100) NOT NULL, -- 상품명 (FREE, DELUXE, PREMIUM)
    product_price INTEGER NOT NULL, -- 상품 가격
    duration_minutes INTEGER NOT NULL, -- 소요시간 (분)
    description TEXT, -- 상품 설명
    is_active BOOLEAN DEFAULT true, -- 활성화 상태
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- 생성일
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- 수정일
);

-- 외래키 제약조건 추가 (experts 테이블과 연동)
ALTER TABLE expert_products 
ADD CONSTRAINT fk_expert_products_expert_user_id 
FOREIGN KEY (expert_user_id) 
REFERENCES experts(user_id) 
ON DELETE CASCADE;

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_expert_products_expert_user_id ON expert_products(expert_user_id);
CREATE INDEX idx_expert_products_product_name ON expert_products(product_name);
CREATE INDEX idx_expert_products_is_active ON expert_products(is_active);

-- RLS (Row Level Security) 활성화
ALTER TABLE expert_products ENABLE ROW LEVEL SECURITY;

-- RLS 정책 설정
-- 모든 사용자가 활성화된 상품 목록 조회 가능
CREATE POLICY "Enable read access for all users" ON expert_products
    FOR SELECT USING (is_active = true);

-- 전문가 본인만 자신의 상품 수정 가능
CREATE POLICY "Enable update for expert owner" ON expert_products
    FOR UPDATE USING (auth.uid()::text = expert_user_id);

-- 전문가 본인만 자신의 상품 삭제 가능
CREATE POLICY "Enable delete for expert owner" ON expert_products
    FOR DELETE USING (auth.uid()::text = expert_user_id);

-- 관리자만 상품 생성 가능
CREATE POLICY "Enable insert for admins" ON expert_products
    FOR INSERT WITH CHECK (auth.uid()::text IN (
        SELECT user_id FROM members WHERE role = 'admin'
    ));

-- 업데이트 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_expert_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 업데이트 트리거 생성
CREATE TRIGGER trigger_update_expert_products_updated_at
    BEFORE UPDATE ON expert_products
    FOR EACH ROW
    EXECUTE FUNCTION update_expert_products_updated_at(); 