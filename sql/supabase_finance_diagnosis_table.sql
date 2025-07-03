-- 재무설계진단 테이블 생성
CREATE TABLE finance_diagnosis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL, -- 회원 아이디 (members 테이블과 연동)
    responses JSONB NOT NULL, -- 응답값 (JSON 형태로 저장)
    report_content TEXT, -- 보고서내용
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- 진단일
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- 수정일
);

-- 외래키 제약조건 추가 (members 테이블과 연동)
ALTER TABLE finance_diagnosis 
ADD CONSTRAINT fk_finance_diagnosis_user_id 
FOREIGN KEY (user_id) 
REFERENCES members(user_id) 
ON DELETE CASCADE;

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_finance_diagnosis_user_id ON finance_diagnosis(user_id);
CREATE INDEX idx_finance_diagnosis_created_at ON finance_diagnosis(created_at);
CREATE INDEX idx_finance_diagnosis_responses ON finance_diagnosis USING GIN (responses);

-- RLS (Row Level Security) 활성화
ALTER TABLE finance_diagnosis ENABLE ROW LEVEL SECURITY;

-- RLS 정책 설정
-- 사용자는 자신의 진단 결과만 조회/수정 가능
CREATE POLICY "Users can view own finance diagnosis" ON finance_diagnosis
    FOR SELECT USING (
        user_id IN (
            SELECT user_id FROM members 
            WHERE id = auth.uid()::uuid
        )
    );

CREATE POLICY "Users can insert own finance diagnosis" ON finance_diagnosis
    FOR INSERT WITH CHECK (
        user_id IN (
            SELECT user_id FROM members 
            WHERE id = auth.uid()::uuid
        )
    );

CREATE POLICY "Users can update own finance diagnosis" ON finance_diagnosis
    FOR UPDATE USING (
        user_id IN (
            SELECT user_id FROM members 
            WHERE id = auth.uid()::uuid
        )
    );

-- 관리자는 모든 진단 결과 조회 가능
CREATE POLICY "Admins can view all finance diagnosis" ON finance_diagnosis
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM members 
            WHERE id = auth.uid()::uuid 
            AND signup_type = 'admin'
        )
    );

-- 자동으로 updated_at 업데이트하는 트리거
CREATE TRIGGER update_finance_diagnosis_updated_at 
    BEFORE UPDATE ON finance_diagnosis 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 댓글: 테이블 생성 완료 후 실행할 수 있는 샘플 데이터 삽입 쿼리
-- INSERT INTO finance_diagnosis (user_id, responses, report_content) 
-- VALUES 
--     ('testuser1', 
--      '{"q1": "A", "q2": "B", "q3": "A", "q4": "B", "q5": "A", "q6": "B"}', 
--      '당신의 재무 상태는 안정적입니다. 현재 월 수입 대비 지출 비율이 60%로 적절한 수준입니다. 
--       향후 투자 계획을 세우기 전에 비상금을 6개월치 생활비로 확보하는 것을 권장합니다...'
--     ),
--     ('testuser2', 
--      '{"q1": "B", "q2": "A", "q3": "B", "q4": "A", "q5": "B", "q6": "A"}', 
--      '당신의 재무 상태는 개선이 필요합니다. 현재 부채 비율이 높아 위험한 상황입니다. 
--       우선순위로 고금리 부채부터 상환하고, 지출을 줄여 저축률을 높이는 것이 중요합니다...'
--     ); 