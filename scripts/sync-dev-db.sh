#!/bin/bash

# =====================================================
# 개발 DB 동기화 스크립트
# =====================================================
# 운영 DB → 개발 DB 스키마 동기화 가이드

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

# ===== 환경변수 확인 =====
check_environment() {
    log_info "🔍 환경변수 확인 중..."
    
    if [ -f ".env.development" ]; then
        log_success "개발환경 설정 파일 발견"
        
        # Supabase 개발환경 설정 확인
        if grep -q "VITE_SUPABASE_URL_DEV" ".env.development"; then
            DEV_URL=$(grep "VITE_SUPABASE_URL_DEV" ".env.development" | cut -d'=' -f2)
            log_success "개발 DB URL: $DEV_URL"
        else
            log_error "개발 DB URL이 설정되지 않았습니다"
            return 1
        fi
    else
        log_error "개발환경 설정 파일이 없습니다"
        log_info "다음 명령어로 생성하세요: npm run env:dev"
        return 1
    fi
}

# ===== 단계별 가이드 =====
show_step_guide() {
    local step=$1
    local title=$2
    local description=$3
    
    echo ""
    log_info "📋 단계 $step: $title"
    echo "   $description"
    echo ""
}

# ===== 메인 가이드 =====
main() {
    log_info "🔄 개발 DB 동기화 가이드 시작..."
    echo ""
    
    # 환경변수 확인
    if ! check_environment; then
        exit 1
    fi
    
    log_info "📋 수동 마이그레이션 단계:"
    
    show_step_guide "1" "운영 DB 스키마 추출" "운영 Supabase Dashboard에서 스키마 정보 추출"
    show_step_guide "2" "개발 DB 스키마 적용" "개발 Supabase Dashboard에 스키마 적용"
    show_step_guide "3" "샘플 데이터 삽입" "개발 DB에 테스트용 데이터 삽입"
    show_step_guide "4" "연결 테스트" "로컬/개발 서버에서 DB 연결 확인"
    
    echo ""
    log_info "🔧 상세 가이드:"
    echo ""
    
    # 1단계: 스키마 추출
    log_info "1️⃣ 운영 DB 스키마 추출:"
    echo "   a) 운영 Supabase Dashboard 접속"
    echo "   b) SQL Editor 열기"
    echo "   c) scripts/export-production-schema.sql 실행"
    echo "   d) 결과를 sql/prod_schema.sql로 저장"
    echo ""
    
    # 2단계: 스키마 적용
    log_info "2️⃣ 개발 DB 스키마 적용:"
    echo "   a) 개발 Supabase Dashboard 접속"
    echo "   b) SQL Editor 열기"
    echo "   c) sql/prod_schema.sql 실행"
    echo "   d) 또는 scripts/setup-dev-database-complete.sql 실행"
    echo ""
    
    # 3단계: 샘플 데이터
    log_info "3️⃣ 샘플 데이터 삽입:"
    echo "   a) sql/dev_sample_data.sql 실행"
    echo "   b) 또는 scripts/generate-sample-data.sh 실행"
    echo ""
    
    # 4단계: 테스트
    log_info "4️⃣ 연결 테스트:"
    echo "   a) 로컬 서버: npm run dev"
    echo "   b) 개발 서버: npm run deploy:dev"
    echo "   c) 브라우저에서 기능 테스트"
    echo ""
    
    log_success "가이드 완료! 위 단계들을 순서대로 진행하세요."
    echo ""
    log_info "💡 유용한 명령어:"
    echo "   환경변수 확인: npm run env:check"
    echo "   개발 DB 설정: npm run db:setup"
    echo "   스키마 추출: cat scripts/export-production-schema.sql"
    echo "   샘플 데이터: cat sql/dev_sample_data.sql"
}

# ===== 스크립트 실행 =====
main "$@" 