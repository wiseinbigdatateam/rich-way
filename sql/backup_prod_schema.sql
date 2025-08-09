-- ========================================
-- 운영서버 스키마 백업
-- ========================================
-- ⚠️ 주의: 이 스크립트는 운영서버에서 실행해야 합니다.

-- 1. 현재 테이블 목록 백업
CREATE TABLE IF NOT EXISTS backup_table_list AS
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public';

-- 2. 각 테이블의 데이터 백업 (중요한 테이블만)
-- members 테이블 백업
CREATE TABLE IF NOT EXISTS backup_members AS SELECT * FROM members;

-- experts 테이블 백업
CREATE TABLE IF NOT EXISTS backup_experts AS SELECT * FROM experts;

-- mbti_diagnosis 테이블 백업
CREATE TABLE IF NOT EXISTS backup_mbti_diagnosis AS SELECT * FROM mbti_diagnosis;

-- finance_diagnosis 테이블 백업
CREATE TABLE IF NOT EXISTS backup_finance_diagnosis AS SELECT * FROM finance_diagnosis;

-- community_posts 테이블 백업
CREATE TABLE IF NOT EXISTS backup_community_posts AS SELECT * FROM community_posts;

-- community_comments 테이블 백업
CREATE TABLE IF NOT EXISTS backup_community_comments AS SELECT * FROM community_comments;

-- coaching_applications 테이블 백업
CREATE TABLE IF NOT EXISTS backup_coaching_applications AS SELECT * FROM coaching_applications;

-- 3. 현재 스키마 정보 백업
CREATE TABLE IF NOT EXISTS backup_schema_info AS
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public';

-- 4. 인덱스 정보 백업
CREATE TABLE IF NOT EXISTS backup_indexes AS
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public';

-- 5. 제약조건 정보 백업
CREATE TABLE IF NOT EXISTS backup_constraints AS
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.table_schema = 'public';

-- 6. 백업 완료 메시지
DO $$
BEGIN
    RAISE NOTICE '✅ 운영서버 백업 완료!';
    RAISE NOTICE '📊 백업된 테이블들:';
    RAISE NOTICE '   - backup_members';
    RAISE NOTICE '   - backup_experts';
    RAISE NOTICE '   - backup_mbti_diagnosis';
    RAISE NOTICE '   - backup_finance_diagnosis';
    RAISE NOTICE '   - backup_community_posts';
    RAISE NOTICE '   - backup_community_comments';
    RAISE NOTICE '   - backup_coaching_applications';
    RAISE NOTICE '   - backup_table_list';
    RAISE NOTICE '   - backup_schema_info';
    RAISE NOTICE '   - backup_indexes';
    RAISE NOTICE '   - backup_constraints';
END $$;
