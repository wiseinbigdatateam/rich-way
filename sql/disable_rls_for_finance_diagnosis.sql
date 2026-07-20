-- finance_diagnosis 테이블의 RLS 비활성화
-- 현재 시스템이 Supabase Auth를 사용하지 않으므로 RLS를 비활성화

-- 기존 RLS 정책 삭제
DROP POLICY IF EXISTS "Users can view own finance diagnosis" ON finance_diagnosis;
DROP POLICY IF EXISTS "Users can insert own finance diagnosis" ON finance_diagnosis;
DROP POLICY IF EXISTS "Users can update own finance diagnosis" ON finance_diagnosis;
DROP POLICY IF EXISTS "Admins can view all finance diagnosis" ON finance_diagnosis;

-- RLS 비활성화
ALTER TABLE finance_diagnosis DISABLE ROW LEVEL SECURITY;

-- 확인 메시지
SELECT 'finance_diagnosis 테이블의 RLS가 비활성화되었습니다.' as message; 