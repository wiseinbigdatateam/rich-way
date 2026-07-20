-- ========================================
-- 개발서버 DB 스키마 추출 (운영서버 적용용)
-- ========================================
-- 이 스크립트는 개발서버에서 실행하여 현재 스키마 정보를 추출합니다.
-- 추출된 정보는 운영서버 마이그레이션에 사용됩니다.

-- 1. 테이블 목록 조회
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- 2. 각 테이블의 상세 스키마 정보
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' 
ORDER BY table_name, ordinal_position;

-- 3. 인덱스 정보
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 4. 제약조건 정보
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

-- 5. 시퀀스 정보
SELECT 
    sequence_name,
    data_type,
    start_value,
    minimum_value,
    maximum_value,
    increment
FROM information_schema.sequences
WHERE sequence_schema = 'public'
ORDER BY sequence_name;

-- 6. 뷰 정보
SELECT 
    table_name,
    view_definition
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;

-- 7. 함수 정보
SELECT 
    routine_name,
    routine_type,
    data_type,
    routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- 8. 트리거 정보
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement,
    action_timing
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- 9. 테이블별 레코드 수 (참고용)
SELECT 
    schemaname,
    tablename,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    n_live_tup as live_tuples,
    n_dead_tup as dead_tuples
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 10. 테이블 크기 정보 (참고용)
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as index_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
