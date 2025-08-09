#!/bin/bash

# =====================================================
# 개발서버 → 운영서버 DB 스키마 마이그레이션 스크립트
# =====================================================
# ⚠️ 주의: 이 스크립트는 운영서버의 데이터를 유지하면서 스키마만 업데이트합니다.

# ===== 색상 설정 =====
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ===== 로그 함수 =====
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# ===== 확인 함수 =====
confirm_action() {
    local message="$1"
    echo ""
    log_warning "$message"
    read -p "계속하시겠습니까? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "작업이 취소되었습니다."
        exit 0
    fi
}

# ===== 개발서버 스키마 추출 =====
extract_dev_schema() {
    log_info "🗄️ 개발서버 스키마 추출 중..."
    
    # 개발서버 스키마 추출 SQL 파일 생성
    cat > sql/extract_dev_schema_for_prod.sql << 'EOF'
-- ========================================
-- 개발서버 DB 스키마 추출 (운영서버 적용용)
-- ========================================

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

-- 5. RLS 정책 정보
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
EOF

    log_success "개발서버 스키마 추출 SQL 파일 생성 완료: sql/extract_dev_schema_for_prod.sql"
    log_info "다음 단계: 개발 Supabase Dashboard에서 이 파일을 실행하여 스키마를 추출하세요."
}

# ===== 운영서버 백업 =====
backup_prod_schema() {
    log_info "💾 운영서버 스키마 백업 중..."
    
    # 운영서버 백업 SQL 파일 생성
    cat > sql/backup_prod_schema.sql << 'EOF'
-- ========================================
-- 운영서버 스키마 백업
-- ========================================

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
EOF

    log_success "운영서버 백업 SQL 파일 생성 완료: sql/backup_prod_schema.sql"
    log_info "다음 단계: 운영 Supabase Dashboard에서 이 파일을 실행하여 백업을 생성하세요."
}

# ===== 스키마 마이그레이션 SQL 생성 =====
generate_migration_sql() {
    log_info "🔄 스키마 마이그레이션 SQL 생성 중..."
    
    # 안전한 마이그레이션 SQL 파일 생성
    cat > sql/migrate_dev_to_prod.sql << 'EOF'
-- ========================================
-- 개발서버 → 운영서버 스키마 마이그레이션
-- ========================================
-- ⚠️ 주의: 이 스크립트는 데이터를 유지하면서 스키마만 업데이트합니다.

-- 1단계: 기존 제약조건 임시 제거 (데이터 보존)
-- ========================================

-- 외래키 제약조건 임시 제거
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT conname, conrelid::regclass AS table_name
        FROM pg_constraint
        WHERE contype = 'f' 
        AND connamespace = 'public'::regnamespace
    ) LOOP
        EXECUTE 'ALTER TABLE ' || r.table_name || ' DROP CONSTRAINT ' || r.conname;
    END LOOP;
END $$;

-- 2단계: 새 컬럼 추가 (기존 데이터 유지)
-- ========================================

-- members 테이블에 새 컬럼 추가 (예시)
-- ALTER TABLE members ADD COLUMN IF NOT EXISTS new_column_name VARCHAR(255);

-- 3단계: 기존 컬럼 수정 (타입 변경 시 주의)
-- ========================================

-- 예시: 컬럼 타입 변경 (데이터 손실 가능성 있음)
-- ALTER TABLE members ALTER COLUMN existing_column TYPE new_type USING existing_column::new_type;

-- 4단계: 새 테이블 생성
-- ========================================

-- 새 테이블이 필요한 경우 여기에 추가
-- CREATE TABLE IF NOT EXISTS new_table_name (
--     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--     ...
-- );

-- 5단계: 인덱스 추가
-- ========================================

-- 새 인덱스가 필요한 경우 여기에 추가
-- CREATE INDEX IF NOT EXISTS idx_table_name_column_name ON table_name(column_name);

-- 6단계: 제약조건 재생성
-- ========================================

-- 외래키 제약조건 재생성
-- ALTER TABLE child_table ADD CONSTRAINT fk_child_parent 
--     FOREIGN KEY (parent_id) REFERENCES parent_table(id);

-- 7단계: RLS 정책 업데이트
-- ========================================

-- RLS 정책이 변경된 경우 여기에 추가
-- DROP POLICY IF EXISTS policy_name ON table_name;
-- CREATE POLICY policy_name ON table_name FOR ALL USING (condition);

-- 8단계: 검증
-- ========================================

-- 테이블 목록 확인
SELECT 'Tables after migration:' as info;
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- 컬럼 정보 확인
SELECT 'Columns in members table:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'members'
ORDER BY ordinal_position;
EOF

    log_success "마이그레이션 SQL 파일 생성 완료: sql/migrate_dev_to_prod.sql"
    log_info "이 파일을 운영 Supabase Dashboard에서 실행하여 스키마를 업데이트하세요."
}

# ===== 검증 스크립트 생성 =====
generate_validation_sql() {
    log_info "🔍 검증 스크립트 생성 중..."
    
    # 검증 SQL 파일 생성
    cat > sql/validate_migration.sql << 'EOF'
-- ========================================
-- 마이그레이션 검증 스크립트
-- ========================================

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
    'community_comments' as table_name, COUNT(*) as row_count FROM community_comments;

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
EOF

    log_success "검증 스크립트 생성 완료: sql/validate_migration.sql"
}

# ===== 메인 함수 =====
main() {
    log_info "🔄 개발서버 → 운영서버 DB 스키마 마이그레이션 시작..."
    echo ""
    
    log_warning "⚠️  중요 주의사항:"
    echo "   1. 반드시 운영서버 데이터를 백업한 후 진행하세요"
    echo "   2. 다운타임이 발생할 수 있으므로 서비스 중단 시간을 고려하세요"
    echo "   3. 각 단계별로 검증을 진행하세요"
    echo ""
    
    confirm_action "이 작업은 운영서버의 데이터베이스 스키마를 변경합니다."
    
    # 단계별 실행
    echo "📋 마이그레이션 단계:"
    echo ""
    echo "1️⃣ 개발서버 스키마 추출"
    echo "2️⃣ 운영서버 백업 생성"
    echo "3️⃣ 마이그레이션 SQL 생성"
    echo "4️⃣ 검증 스크립트 생성"
    echo "5️⃣ 전체 가이드 보기"
    echo ""
    
    read -p "선택하세요 (1-5): " choice
    
    case $choice in
        1)
            extract_dev_schema
            ;;
        2)
            backup_prod_schema
            ;;
        3)
            generate_migration_sql
            ;;
        4)
            generate_validation_sql
            ;;
        5)
            echo ""
            log_info "📋 전체 마이그레이션 가이드:"
            echo ""
            echo "1️⃣ 개발서버 스키마 추출:"
            echo "   - 개발 Supabase Dashboard 접속"
            echo "   - SQL Editor에서 sql/extract_dev_schema_for_prod.sql 실행"
            echo "   - 결과를 sql/dev_schema_extracted.sql에 저장"
            echo ""
            echo "2️⃣ 운영서버 백업:"
            echo "   - 운영 Supabase Dashboard 접속"
            echo "   - SQL Editor에서 sql/backup_prod_schema.sql 실행"
            echo "   - 백업 테이블들이 생성되었는지 확인"
            echo ""
            echo "3️⃣ 스키마 마이그레이션:"
            echo "   - 운영 Supabase Dashboard에서 sql/migrate_dev_to_prod.sql 실행"
            echo "   - 각 단계별로 오류가 없는지 확인"
            echo ""
            echo "4️⃣ 검증:"
            echo "   - 운영 Supabase Dashboard에서 sql/validate_migration.sql 실행"
            echo "   - 모든 테이블과 데이터가 정상인지 확인"
            echo ""
            echo "5️⃣ 테스트:"
            echo "   - 운영 서비스에서 주요 기능 테스트"
            echo "   - 데이터 정합성 확인"
            echo ""
            ;;
        *)
            log_error "잘못된 선택입니다"
            exit 1
            ;;
    esac
    
    echo ""
    log_success "마이그레이션 준비 완료!"
    log_info "💡 다음 단계: Supabase Dashboard에서 생성된 SQL 파일들을 실행하세요."
}

# ===== 스크립트 실행 =====
main "$@"
