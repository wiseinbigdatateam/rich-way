-- ========================================
-- 마이그레이션 검증 스크립트
-- ========================================
-- 이 스크립트는 마이그레이션 후 데이터 정합성을 확인합니다.

-- 1. 테이블 목록 확인
SELECT '=== 테이블 목록 ===' as section;
SELECT tablename, tableowner 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- 2. 각 테이블의 컬럼 정보 확인
SELECT '=== members 테이블 컬럼 ===' as section;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'members'
ORDER BY ordinal_position;

SELECT '=== experts 테이블 컬럼 ===' as section;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'experts'
ORDER BY ordinal_position;

SELECT '=== mbti_diagnosis 테이블 컬럼 ===' as section;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'mbti_diagnosis'
ORDER BY ordinal_position;

SELECT '=== finance_diagnosis 테이블 컬럼 ===' as section;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'finance_diagnosis'
ORDER BY ordinal_position;

-- 3. 데이터 개수 확인
SELECT '=== 데이터 개수 확인 ===' as section;
SELECT 
    'members' as table_name, COUNT(*) as row_count FROM members
UNION ALL
SELECT 
    'experts' as table_name, COUNT(*) as row_count FROM experts
UNION ALL
SELECT 
    'mbti_diagnosis' as table_name, COUNT(*) as row_count FROM mbti_diagnosis
UNION ALL
SELECT 
    'finance_diagnosis' as table_name, COUNT(*) as row_count FROM finance_diagnosis
UNION ALL
SELECT 
    'community_posts' as table_name, COUNT(*) as row_count FROM community_posts
UNION ALL
SELECT 
    'community_comments' as table_name, COUNT(*) as row_count FROM community_comments
UNION ALL
SELECT 
    'coaching_applications' as table_name, COUNT(*) as row_count FROM coaching_applications
UNION ALL
SELECT 
    'member_settings' as table_name, COUNT(*) as row_count FROM member_settings
UNION ALL
SELECT 
    'expert_products' as table_name, COUNT(*) as row_count FROM expert_products;

-- 4. 인덱스 확인
SELECT '=== 인덱스 목록 ===' as section;
SELECT indexname, tablename, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 5. 제약조건 확인
SELECT '=== 제약조건 목록 ===' as section;
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- 6. RLS 정책 확인
SELECT '=== RLS 정책 목록 ===' as section;
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 7. 백업 테이블 확인
SELECT '=== 백업 테이블 확인 ===' as section;
SELECT 
    'backup_members' as backup_table, COUNT(*) as row_count FROM backup_members
UNION ALL
SELECT 
    'backup_experts' as backup_table, COUNT(*) as row_count FROM backup_experts
UNION ALL
SELECT 
    'backup_mbti_diagnosis' as backup_table, COUNT(*) as row_count FROM backup_mbti_diagnosis
UNION ALL
SELECT 
    'backup_finance_diagnosis' as backup_table, COUNT(*) as row_count FROM backup_finance_diagnosis
UNION ALL
SELECT 
    'backup_community_posts' as backup_table, COUNT(*) as row_count FROM backup_community_posts
UNION ALL
SELECT 
    'backup_community_comments' as backup_table, COUNT(*) as row_count FROM backup_community_comments
UNION ALL
SELECT 
    'backup_coaching_applications' as backup_table, COUNT(*) as row_count FROM backup_coaching_applications;

-- 8. 데이터 정합성 검증
SELECT '=== 데이터 정합성 검증 ===' as section;

-- members 테이블 데이터 정합성
SELECT 
    'members' as table_name,
    COUNT(*) as current_count,
    (SELECT COUNT(*) FROM backup_members) as backup_count,
    CASE 
        WHEN COUNT(*) = (SELECT COUNT(*) FROM backup_members) THEN '✅ 일치'
        ELSE '❌ 불일치'
    END as status
FROM members;

-- experts 테이블 데이터 정합성
SELECT 
    'experts' as table_name,
    COUNT(*) as current_count,
    (SELECT COUNT(*) FROM backup_experts) as backup_count,
    CASE 
        WHEN COUNT(*) = (SELECT COUNT(*) FROM backup_experts) THEN '✅ 일치'
        ELSE '❌ 불일치'
    END as status
FROM experts;

-- 9. 새로 추가된 컬럼 확인
SELECT '=== 새로 추가된 컬럼 확인 ===' as section;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'members' 
    AND column_name IN ('nickname', 'profile_image_url', 'bio', 'preferences')
ORDER BY column_name;

-- 10. 완료 메시지
DO $$
BEGIN
    RAISE NOTICE '🔍 마이그레이션 검증 완료!';
    RAISE NOTICE '📊 위의 결과를 확인하여 모든 데이터가 정상적으로 마이그레이션되었는지 확인하세요.';
    RAISE NOTICE '✅ 백업 테이블들이 정상적으로 생성되었는지 확인하세요.';
END $$;
