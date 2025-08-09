-- 데이터베이스 인덱스 최적화 스크립트

-- 1. 복합 인덱스 추가
-- coaching_applications 테이블
CREATE INDEX IF NOT EXISTS idx_coaching_applications_member_status 
ON coaching_applications(member_user_id, status);

CREATE INDEX IF NOT EXISTS idx_coaching_applications_expert_status 
ON coaching_applications(expert_user_id, status);

CREATE INDEX IF NOT EXISTS idx_coaching_applications_member_created 
ON coaching_applications(member_user_id, created_at);

-- mbti_diagnosis 테이블
CREATE INDEX IF NOT EXISTS idx_mbti_diagnosis_user_created 
ON mbti_diagnosis(user_id, created_at);

-- finance_diagnosis 테이블
CREATE INDEX IF NOT EXISTS idx_finance_diagnosis_user_created 
ON finance_diagnosis(user_id, created_at);

-- 2. 부분 인덱스 추가
-- 활성화된 전문가만 인덱싱
CREATE INDEX IF NOT EXISTS idx_experts_active_verified 
ON experts(expert_type, hourly_rate) 
WHERE is_active = true AND is_verified = true;

-- 대기 중인 코칭 신청만 인덱싱
CREATE INDEX IF NOT EXISTS idx_coaching_applications_pending 
ON coaching_applications(member_user_id, applied_at) 
WHERE status = 'pending';

-- 진행 중인 코칭만 인덱싱
CREATE INDEX IF NOT EXISTS idx_coaching_applications_in_progress 
ON coaching_applications(member_user_id, created_at) 
WHERE status = '진행중';

-- 3. JSONB 인덱스 최적화
-- MBTI 진단 응답 데이터 최적화
CREATE INDEX IF NOT EXISTS idx_mbti_diagnosis_responses_gin 
ON mbti_diagnosis USING GIN (responses);

-- 재무 진단 응답 데이터 최적화
CREATE INDEX IF NOT EXISTS idx_finance_diagnosis_responses_gin 
ON finance_diagnosis USING GIN (responses);

-- 4. 커버링 인덱스 (자주 조회되는 컬럼들)
-- members 테이블의 기본 정보
CREATE INDEX IF NOT EXISTS idx_members_basic_info 
ON members(user_id, name, email, signup_type);

-- experts 테이블의 기본 정보
CREATE INDEX IF NOT EXISTS idx_experts_basic_info 
ON experts(user_id, expert_name, expert_type, is_active);

-- 5. 통계 업데이트
ANALYZE members;
ANALYZE experts;
ANALYZE coaching_applications;
ANALYZE mbti_diagnosis;
ANALYZE finance_diagnosis;

-- 6. 인덱스 사용 현황 확인 쿼리 (참고용)
-- SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
-- FROM pg_stat_user_indexes
-- ORDER BY idx_scan DESC; 