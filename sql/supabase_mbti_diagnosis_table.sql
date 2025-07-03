-- 부자 MBTI 진단 테이블 생성
CREATE TABLE mbti_diagnosis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL, -- 회원 아이디 (members 테이블과 연동)
    responses JSONB NOT NULL, -- 응답값 (JSON 형태로 저장)
    result_type VARCHAR(10) NOT NULL, -- 결과유형 (예: ENTP, ISFJ 등)
    report_content TEXT, -- 보고서내용
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- 진단일
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- 수정일
);

-- 외래키 제약조건 추가 (members 테이블과 연동)
ALTER TABLE mbti_diagnosis 
ADD CONSTRAINT fk_mbti_diagnosis_user_id 
FOREIGN KEY (user_id) 
REFERENCES members(user_id) 
ON DELETE CASCADE;

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_mbti_diagnosis_user_id ON mbti_diagnosis(user_id);
CREATE INDEX idx_mbti_diagnosis_result_type ON mbti_diagnosis(result_type);
CREATE INDEX idx_mbti_diagnosis_created_at ON mbti_diagnosis(created_at);
CREATE INDEX idx_mbti_diagnosis_responses ON mbti_diagnosis USING GIN (responses);

-- RLS (Row Level Security) 활성화
ALTER TABLE mbti_diagnosis ENABLE ROW LEVEL SECURITY;

-- RLS 정책 설정
-- 사용자는 자신의 진단 결과만 조회/수정 가능
CREATE POLICY "Users can view own diagnosis" ON mbti_diagnosis
    FOR SELECT USING (
        user_id IN (
            SELECT user_id FROM members 
            WHERE id = auth.uid()::uuid
        )
    );

CREATE POLICY "Users can insert own diagnosis" ON mbti_diagnosis
    FOR INSERT WITH CHECK (
        user_id IN (
            SELECT user_id FROM members 
            WHERE id = auth.uid()::uuid
        )
    );

CREATE POLICY "Users can update own diagnosis" ON mbti_diagnosis
    FOR UPDATE USING (
        user_id IN (
            SELECT user_id FROM members 
            WHERE id = auth.uid()::uuid
        )
    );

-- 관리자는 모든 진단 결과 조회 가능
CREATE POLICY "Admins can view all diagnosis" ON mbti_diagnosis
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM members 
            WHERE id = auth.uid()::uuid 
            AND signup_type = 'admin'
        )
    );

-- 자동으로 updated_at 업데이트하는 트리거
CREATE TRIGGER update_mbti_diagnosis_updated_at 
    BEFORE UPDATE ON mbti_diagnosis 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 댓글: 테이블 생성 완료 후 실행할 수 있는 샘플 데이터 삽입 쿼리
-- INSERT INTO mbti_diagnosis (user_id, responses, result_type, report_content) 
-- VALUES 
--     ('testuser1', 
--      '{"q1": "A", "q2": "B", "q3": "A", "q4": "B", "q5": "A"}', 
--      'ENTP', 
--      '당신은 혁신적이고 창의적인 부자 MBTI입니다. 새로운 아이디어를 추구하며...'
--     ),
--     ('testuser2', 
--      '{"q1": "B", "q2": "A", "q3": "B", "q4": "A", "q5": "B"}', 
--      'ISFJ', 
--      '당신은 안정적이고 신중한 부자 MBTI입니다. 체계적인 재무 관리에 능숙하며...'
--     ); 