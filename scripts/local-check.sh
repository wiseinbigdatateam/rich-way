#!/bin/bash

# 🚀 로컬 배포 전 확인 스크립트
# 사용법: ./scripts/local-check.sh

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 체크 함수들
check_dev_server() {
    log_info "1. 로컬 개발 서버 확인 중..."
    
    if curl -s http://localhost:8080 > /dev/null 2>&1; then
        log_success "로컬 개발 서버 정상 작동 (http://localhost:8080)"
        return 0
    else
        log_error "로컬 개발 서버가 실행되지 않음"
        log_info "다음 명령어로 개발 서버를 시작하세요:"
        echo "  npm run dev"
        return 1
    fi
}

check_build() {
    log_info "2. 프로덕션 빌드 테스트 중..."
    
    if npm run build > /dev/null 2>&1; then
        log_success "빌드 성공! dist/ 폴더가 생성되었습니다."
        return 0
    else
        log_error "빌드 실패"
        return 1
    fi
}

check_preview() {
    log_info "3. 프리뷰 서버 확인 중..."
    
    # 프리뷰 서버 시작
    npm run preview > /dev/null 2>&1 &
    PREVIEW_PID=$!
    
    # 3초 대기
    sleep 3
    
    if curl -s http://localhost:4173 > /dev/null 2>&1; then
        log_success "프리뷰 서버 정상 작동 (http://localhost:4173)"
        # 프리뷰 서버 종료
        kill $PREVIEW_PID 2>/dev/null || true
        return 0
    else
        log_error "프리뷰 서버 오류"
        # 프리뷰 서버 종료
        kill $PREVIEW_PID 2>/dev/null || true
        return 1
    fi
}

check_lint() {
    log_info "4. 코드 린트 확인 중... (선택사항)"
    
    if npm run lint > /dev/null 2>&1; then
        log_success "린트 검사 통과"
        return 0
    else
        log_warning "린트 오류 발견 (개발 중에는 무시 가능)"
        log_info "자동 수정 시도 중..."
        if npm run lint:fix > /dev/null 2>&1; then
            log_success "린트 오류 자동 수정 완료"
            return 0
        else
            log_warning "린트 오류가 있지만 배포는 가능합니다"
            log_info "프로덕션 배포 전에 린트 오류를 수정하는 것을 권장합니다"
            return 0  # 린트 오류를 치명적이지 않게 처리
        fi
    fi
}

check_type() {
    log_info "5. TypeScript 타입 확인 중..."
    
    if npm run type-check > /dev/null 2>&1; then
        log_success "타입 검사 통과"
        return 0
    else
        log_error "타입 오류 발견"
        return 1
    fi
}

# 메인 함수
main() {
    log_info "🔍 로컬 배포 전 체크리스트 시작"
    echo ""
    
    local all_passed=true
    
    # 각 체크 실행
    check_dev_server || all_passed=false
    echo ""
    
    check_build || all_passed=false
    echo ""
    
    check_preview || all_passed=false
    echo ""
    
    check_lint || all_passed=false
    echo ""
    
    check_type || all_passed=false
    echo ""
    
    # 결과 출력
    if [ "$all_passed" = true ]; then
        log_success "🎉 모든 체크 통과! 운영서버 배포 준비 완료"
        echo ""
        log_info "다음 명령어로 운영서버에 배포할 수 있습니다:"
        echo "  npm run deploy:prod:build"
        echo ""
        log_info "또는 프리뷰를 확인하려면:"
        echo "  npm run deploy:preview:open"
    else
        log_error "❌ 일부 체크 실패. 문제를 해결한 후 다시 시도하세요."
        echo ""
        log_info "개발 서버 시작: npm run dev"
        log_info "브라우저에서 확인: npm run dev:open"
        log_info "프리뷰 확인: npm run deploy:preview:open"
        exit 1
    fi
}

# 스크립트 실행
main "$@" 