-- ========================================
-- 🗄️ 개발서버 DB 스키마 추출 스크립트
-- ========================================
-- 이 스크립트를 개발환경 Supabase SQL Editor에서 실행하여 스키마를 추출합니다.

-- 1. 테이블 목록 조회
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- 2. 각 테이블의 CREATE TABLE 문 생성
-- (아래 쿼리들을 각각 실행하여 결과를 복사)

-- members 테이블 스키마
SELECT 
    'CREATE TABLE ' || table_name || ' (' ||
    string_agg(
        column_name || ' ' || data_type || 
        CASE 
            WHEN character_maximum_length IS NOT NULL 
            THEN '(' || character_maximum_length || ')'
            ELSE ''
        END ||
        CASE 
            WHEN is_nullable = 'NO' THEN ' NOT NULL'
            ELSE ''
        END ||
        CASE 
            WHEN column_default IS NOT NULL 
            THEN ' DEFAULT ' || column_default
            ELSE ''
        END,
        ', '
        ORDER BY ordinal_position
    ) || ');' as create_statement
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'members'
GROUP BY table_name;

-- mbti_diagnosis 테이블 스키마
SELECT 
    'CREATE TABLE ' || table_name || ' (' ||
    string_agg(
        column_name || ' ' || data_type || 
        CASE 
            WHEN character_maximum_length IS NOT NULL 
            THEN '(' || character_maximum_length || ')'
            ELSE ''
        END ||
        CASE 
            WHEN is_nullable = 'NO' THEN ' NOT NULL'
            ELSE ''
        END ||
        CASE 
            WHEN column_default IS NOT NULL 
            THEN ' DEFAULT ' || column_default
            ELSE ''
        END,
        ', '
        ORDER BY ordinal_position
    ) || ');' as create_statement
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'mbti_diagnosis'
GROUP BY table_name;

-- finance_diagnosis 테이블 스키마
SELECT 
    'CREATE TABLE ' || table_name || ' (' ||
    string_agg(
        column_name || ' ' || data_type || 
        CASE 
            WHEN character_maximum_length IS NOT NULL 
            THEN '(' || character_maximum_length || ')'
            ELSE ''
        END ||
        CASE 
            WHEN is_nullable = 'NO' THEN ' NOT NULL'
            ELSE ''
        END ||
        CASE 
            WHEN column_default IS NOT NULL 
            THEN ' DEFAULT ' || column_default
            ELSE ''
        END,
        ', '
        ORDER BY ordinal_position
    ) || ');' as create_statement
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'finance_diagnosis'
GROUP BY table_name;

-- experts 테이블 스키마
SELECT 
    'CREATE TABLE ' || table_name || ' (' ||
    string_agg(
        column_name || ' ' || data_type || 
        CASE 
            WHEN character_maximum_length IS NOT NULL 
            THEN '(' || character_maximum_length || ')'
            ELSE ''
        END ||
        CASE 
            WHEN is_nullable = 'NO' THEN ' NOT NULL'
            ELSE ''
        END ||
        CASE 
            WHEN column_default IS NOT NULL 
            THEN ' DEFAULT ' || column_default
            ELSE ''
        END,
        ', '
        ORDER BY ordinal_position
    ) || ');' as create_statement
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'experts'
GROUP BY table_name;

-- expert_products 테이블 스키마
SELECT 
    'CREATE TABLE ' || table_name || ' (' ||
    string_agg(
        column_name || ' ' || data_type || 
        CASE 
            WHEN character_maximum_length IS NOT NULL 
            THEN '(' || character_maximum_length || ')'
            ELSE ''
        END ||
        CASE 
            WHEN is_nullable = 'NO' THEN ' NOT NULL'
            ELSE ''
        END ||
        CASE 
            WHEN column_default IS NOT NULL 
            THEN ' DEFAULT ' || column_default
            ELSE ''
        END,
        ', '
        ORDER BY ordinal_position
    ) || ');' as create_statement
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'expert_products'
GROUP BY table_name;

-- coaching_applications 테이블 스키마
SELECT 
    'CREATE TABLE ' || table_name || ' (' ||
    string_agg(
        column_name || ' ' || data_type || 
        CASE 
            WHEN character_maximum_length IS NOT NULL 
            THEN '(' || character_maximum_length || ')'
            ELSE ''
        END ||
        CASE 
            WHEN is_nullable = 'NO' THEN ' NOT NULL'
            ELSE ''
        END ||
        CASE 
            WHEN column_default IS NOT NULL 
            THEN ' DEFAULT ' || column_default
            ELSE ''
        END,
        ', '
        ORDER BY ordinal_position
    ) || ');' as create_statement
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'coaching_applications'
GROUP BY table_name;

-- community_posts 테이블 스키마
SELECT 
    'CREATE TABLE ' || table_name || ' (' ||
    string_agg(
        column_name || ' ' || data_type || 
        CASE 
            WHEN character_maximum_length IS NOT NULL 
            THEN '(' || character_maximum_length || ')'
            ELSE ''
        END ||
        CASE 
            WHEN is_nullable = 'NO' THEN ' NOT NULL'
            ELSE ''
        END ||
        CASE 
            WHEN column_default IS NOT NULL 
            THEN ' DEFAULT ' || column_default
            ELSE ''
        END,
        ', '
        ORDER BY ordinal_position
    ) || ');' as create_statement
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'community_posts'
GROUP BY table_name;

-- community_comments 테이블 스키마
SELECT 
    'CREATE TABLE ' || table_name || ' (' ||
    string_agg(
        column_name || ' ' || data_type || 
        CASE 
            WHEN character_maximum_length IS NOT NULL 
            THEN '(' || character_maximum_length || ')'
            ELSE ''
        END ||
        CASE 
            WHEN is_nullable = 'NO' THEN ' NOT NULL'
            ELSE ''
        END ||
        CASE 
            WHEN column_default IS NOT NULL 
            THEN ' DEFAULT ' || column_default
            ELSE ''
        END,
        ', '
        ORDER BY ordinal_position
    ) || ');' as create_statement
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'community_comments'
GROUP BY table_name;

-- post_likes 테이블 스키마
SELECT 
    'CREATE TABLE ' || table_name || ' (' ||
    string_agg(
        column_name || ' ' || data_type || 
        CASE 
            WHEN character_maximum_length IS NOT NULL 
            THEN '(' || character_maximum_length || ')'
            ELSE ''
        END ||
        CASE 
            WHEN is_nullable = 'NO' THEN ' NOT NULL'
            ELSE ''
        END ||
        CASE 
            WHEN column_default IS NOT NULL 
            THEN ' DEFAULT ' || column_default
            ELSE ''
        END,
        ', '
        ORDER BY ordinal_position
    ) || ');' as create_statement
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'post_likes'
GROUP BY table_name;

-- member_settings 테이블 스키마
SELECT 
    'CREATE TABLE ' || table_name || ' (' ||
    string_agg(
        column_name || ' ' || data_type || 
        CASE 
            WHEN character_maximum_length IS NOT NULL 
            THEN '(' || character_maximum_length || ')'
            ELSE ''
        END ||
        CASE 
            WHEN is_nullable = 'NO' THEN ' NOT NULL'
            ELSE ''
        END ||
        CASE 
            WHEN column_default IS NOT NULL 
            THEN ' DEFAULT ' || column_default
            ELSE ''
        END,
        ', '
        ORDER BY ordinal_position
    ) || ');' as create_statement
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'member_settings'
GROUP BY table_name;

-- 3. 인덱스 정보 조회
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename, indexname;

-- 4. 제약조건 정보 조회
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