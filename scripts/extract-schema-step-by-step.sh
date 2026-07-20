#!/bin/bash

# =====================================================
# 개발서버 DB 스키마 단계별 추출 스크립트
# =====================================================

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

# ===== 메인 함수 =====
main() {
    log_info "🗄️ 개발서버 DB 스키마 추출 가이드 시작..."
    echo ""
    
    log_info "📋 단계별 추출 방법:"
    echo ""
    echo "1️⃣ 개발 Supabase Dashboard 접속"
    echo "   - https://supabase.com/dashboard"
    echo "   - 개발 프로젝트 선택"
    echo "   - SQL Editor 열기"
    echo ""
    
    echo "2️⃣ 테이블 목록 확인"
    echo "   - 다음 쿼리를 실행하세요:"
    echo ""
    echo "   SELECT schemaname, tablename, tableowner"
    echo "   FROM pg_tables"
    echo "   WHERE schemaname = 'public'"
    echo "   ORDER BY tablename;"
    echo ""
    echo "   결과를 복사하여 sql/dev_schema_extracted.sql 파일의 '1. 테이블 목록' 섹션에 붙여넣으세요."
    echo ""
    
    echo "3️⃣ 각 테이블의 CREATE 문 추출"
    echo "   - sql/extract_dev_schema.sql 파일의 각 테이블 쿼리를 개별적으로 실행"
    echo "   - 각 결과를 sql/dev_schema_extracted.sql 파일의 해당 섹션에 붙여넣기"
    echo ""
    
    echo "4️⃣ 인덱스 정보 추출"
    echo "   - 다음 쿼리를 실행하세요:"
    echo ""
    echo "   SELECT indexname, tablename, indexdef"
    echo "   FROM pg_indexes"
    echo "   WHERE schemaname = 'public'"
    echo "   ORDER BY tablename, indexname;"
    echo ""
    
    echo "5️⃣ 제약조건 정보 추출"
    echo "   - 다음 쿼리를 실행하세요:"
    echo ""
    echo "   SELECT tc.table_name, tc.constraint_name, tc.constraint_type,"
    echo "          kcu.column_name, ccu.table_name AS foreign_table_name,"
    echo "          ccu.column_name AS foreign_column_name"
    echo "   FROM information_schema.table_constraints tc"
    echo "   LEFT JOIN information_schema.key_column_usage kcu"
    echo "       ON tc.constraint_name = kcu.constraint_name"
    echo "       AND tc.table_schema = kcu.table_schema"
    echo "   LEFT JOIN information_schema.constraint_column_usage ccu"
    echo "       ON ccu.constraint_name = tc.constraint_name"
    echo "       AND ccu.table_schema = tc.table_schema"
    echo "   WHERE tc.table_schema = 'public'"
    echo "   ORDER BY tc.table_name, tc.constraint_name;"
    echo ""
    
    log_success "📁 결과 파일: sql/dev_schema_extracted.sql"
    log_info "💡 각 단계 완료 후 파일을 저장하고 다음 단계로 진행하세요."
    echo ""
    
    log_warning "⚠️  주의사항:"
    echo "   - 각 쿼리 결과를 정확히 복사하세요"
    echo "   - CREATE TABLE 문에서 불필요한 부분은 제거하세요"
    echo "   - 파일 저장 후 백업을 만들어두세요"
    echo ""
    
    log_info "🔄 다음 단계: 운영서버에 스키마 적용"
    echo "   - MIGRATION_GUIDE.md 파일을 참고하세요"
}

# ===== 스크립트 실행 =====
main "$@" 