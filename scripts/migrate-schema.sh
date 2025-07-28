#!/bin/bash

# =====================================================
# 스키마 마이그레이션 스크립트
# =====================================================
# 운영 DB 스키마를 개발 DB로 마이그레이션

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

# ===== 파일 존재 확인 =====
check_files() {
    log_info "📁 필요한 파일들 확인 중..."
    
    local missing_files=()
    
    # 필수 파일들 확인
    if [ ! -f "scripts/export-production-schema.sql" ]; then
        missing_files+=("scripts/export-production-schema.sql")
    fi
    
    if [ ! -f "scripts/setup-dev-database-complete.sql" ]; then
        missing_files+=("scripts/setup-dev-database-complete.sql")
    fi
    
    if [ ! -f "sql/dev_sample_data.sql" ]; then
        missing_files+=("sql/dev_sample_data.sql")
    fi
    
    if [ ${#missing_files[@]} -eq 0 ]; then
        log_success "모든 필요한 파일이 존재합니다"
        return 0
    else
        log_error "다음 파일들이 누락되었습니다:"
        for file in "${missing_files[@]}"; do
            echo "   - $file"
        done
        return 1
    fi
}

# ===== 스키마 추출 가이드 =====
extract_schema_guide() {
    log_info "📋 운영 DB 스키마 추출 가이드:"
    echo ""
    echo "1️⃣ 운영 Supabase Dashboard 접속"
    echo "   - https://supabase.com/dashboard"
    echo "   - 운영 프로젝트 선택"
    echo ""
    echo "2️⃣ SQL Editor 열기"
    echo "   - 좌측 메뉴에서 'SQL Editor' 클릭"
    echo "   - 'New query' 클릭"
    echo ""
    echo "3️⃣ 스키마 추출 쿼리 실행"
    echo "   - scripts/export-production-schema.sql 내용 복사"
    echo "   - SQL Editor에 붙여넣기"
    echo "   - 'Run' 클릭"
    echo ""
    echo "4️⃣ 결과 저장"
    echo "   - 각 쿼리 결과에서 CREATE TABLE 문 복사"
    echo "   - sql/prod_schema.sql 파일로 저장"
    echo ""
}

# ===== 스키마 적용 가이드 =====
apply_schema_guide() {
    log_info "📋 개발 DB 스키마 적용 가이드:"
    echo ""
    echo "1️⃣ 개발 Supabase Dashboard 접속"
    echo "   - https://supabase.com/dashboard"
    echo "   - 개발 프로젝트 선택"
    echo ""
    echo "2️⃣ SQL Editor 열기"
    echo "   - 좌측 메뉴에서 'SQL Editor' 클릭"
    echo "   - 'New query' 클릭"
    echo ""
    echo "3️⃣ 스키마 적용 (선택 1)"
    echo "   - sql/prod_schema.sql 내용 복사 (운영 DB에서 추출한 것)"
    echo "   - SQL Editor에 붙여넣기"
    echo "   - 'Run' 클릭"
    echo ""
    echo "4️⃣ 또는 완전한 설정 (선택 2)"
    echo "   - scripts/setup-dev-database-complete.sql 내용 복사"
    echo "   - SQL Editor에 붙여넣기"
    echo "   - 'Run' 클릭 (테이블 + 샘플 데이터 포함)"
    echo ""
}

# ===== 샘플 데이터 가이드 =====
sample_data_guide() {
    log_info "📋 샘플 데이터 삽입 가이드:"
    echo ""
    echo "1️⃣ SQL Editor에서 새 쿼리 생성"
    echo ""
    echo "2️⃣ 샘플 데이터 실행"
    echo "   - sql/dev_sample_data.sql 내용 복사"
    echo "   - SQL Editor에 붙여넣기"
    echo "   - 'Run' 클릭"
    echo ""
    echo "3️⃣ 또는 자동 생성"
    echo "   - 터미널에서: ./scripts/generate-sample-data.sh"
    echo "   - 생성된 sql/dev_sample_data.sql 실행"
    echo ""
}

# ===== 테스트 가이드 =====
test_guide() {
    log_info "📋 연결 테스트 가이드:"
    echo ""
    echo "1️⃣ 로컬 테스트"
    echo "   - npm run dev"
    echo "   - http://localhost:8080 접속"
    echo "   - 브라우저 콘솔에서 Supabase 연결 확인"
    echo ""
    echo "2️⃣ 개발 서버 테스트"
    echo "   - npm run deploy:dev"
    echo "   - http://dev.rich-way.co.kr 접속"
    echo "   - 기능 테스트 (로그인, 진단 등)"
    echo ""
    echo "3️⃣ 데이터 확인"
    echo "   - 마이페이지 진단 이력 확인"
    echo "   - 커뮤니티 게시글 확인"
    echo "   - 전문가 상품 확인"
    echo ""
}

# ===== 메인 함수 =====
main() {
    log_info "🔄 스키마 마이그레이션 가이드 시작..."
    echo ""
    
    # 파일 확인
    if ! check_files; then
        log_error "필요한 파일이 누락되어 가이드를 표시할 수 없습니다"
        exit 1
    fi
    
    # 메뉴 표시
    echo "📋 마이그레이션 단계 선택:"
    echo ""
    echo "1️⃣ 운영 DB 스키마 추출"
    echo "2️⃣ 개발 DB 스키마 적용"
    echo "3️⃣ 샘플 데이터 삽입"
    echo "4️⃣ 연결 테스트"
    echo "5️⃣ 전체 가이드 보기"
    echo ""
    
    read -p "선택하세요 (1-5): " choice
    
    case $choice in
        1)
            extract_schema_guide
            ;;
        2)
            apply_schema_guide
            ;;
        3)
            sample_data_guide
            ;;
        4)
            test_guide
            ;;
        5)
            echo ""
            extract_schema_guide
            apply_schema_guide
            sample_data_guide
            test_guide
            ;;
        *)
            log_error "잘못된 선택입니다"
            exit 1
            ;;
    esac
    
    echo ""
    log_success "가이드 완료!"
    log_info "💡 추가 도움: npm run db:sync"
}

# ===== 스크립트 실행 =====
main "$@" 