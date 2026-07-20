-- ========================================
-- 🗄️ 운영서버 백업 가이드
-- ========================================
-- 이 쿼리들을 운영서버에서 실행하여 현재 상태를 백업하세요.

-- 1. 현재 테이블 목록 백업
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- 2. 현재 데이터 개수 확인
SELECT 
    schemaname,
    tablename,
    (SELECT count(*) FROM information_schema.tables t2 
     WHERE t2.table_schema = t1.schemaname 
     AND t2.table_name = t1.tablename) as row_count
FROM pg_tables t1
WHERE schemaname = 'public' 
ORDER BY tablename;

-- 3. 현재 제약조건 백업
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
WHERE tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- 4. 현재 인덱스 백업
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename, indexname;

-- ========================================
-- ⚠️ 중요: 이 결과들을 파일로 저장하세요!
-- ======================================== 