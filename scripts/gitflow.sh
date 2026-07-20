#!/bin/bash

# GitFlow 워크플로우 스크립트
# 사용법: ./scripts/gitflow.sh [명령어] [옵션]

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

# 현재 브랜치 확인
get_current_branch() {
    git branch --show-current
}

# 브랜치 존재 확인
branch_exists() {
    git branch --list "$1" | grep -q "$1"
}

# 원격 브랜치 존재 확인
remote_branch_exists() {
    git ls-remote --heads origin "$1" | grep -q "$1"
}

# 변경사항 확인
check_changes() {
    if [[ -n $(git status --porcelain) ]]; then
        log_error "커밋되지 않은 변경사항이 있습니다. 먼저 커밋하거나 스태시하세요."
        exit 1
    fi
}

# 원격 최신 상태 확인
check_remote_status() {
    log_info "원격 저장소에서 최신 상태를 가져오는 중..."
    git fetch origin
}

# feature 브랜치 시작
start_feature() {
    if [[ -z "$1" ]]; then
        log_error "feature 이름을 지정해주세요. 사용법: $0 feature-start [feature-name]"
        exit 1
    fi
    
    local feature_name="$1"
    local feature_branch="feature/$feature_name"
    
    log_info "feature 브랜치 시작: $feature_branch"
    
    check_changes
    check_remote_status
    
    # develop 브랜치로 이동
    git checkout develop
    git pull origin develop
    
    # feature 브랜치 생성
    git checkout -b "$feature_branch"
    
    log_success "feature 브랜치 '$feature_branch'가 생성되었습니다."
    log_info "개발을 시작하세요!"
}

# feature 브랜치 완료
finish_feature() {
    local current_branch=$(get_current_branch)
    
    if [[ ! "$current_branch" =~ ^feature/ ]]; then
        log_error "현재 feature 브랜치에 있지 않습니다. (현재: $current_branch)"
        exit 1
    fi
    
    log_info "feature 브랜치 완료: $current_branch"
    
    check_changes
    check_remote_status
    
    # develop 브랜치로 이동
    git checkout develop
    git pull origin develop
    
    # feature 브랜치 병합
    git merge --no-ff "$current_branch" -m "feat: $current_branch 완료"
    
    # feature 브랜치 삭제
    git branch -d "$current_branch"
    
    # 원격 feature 브랜치 삭제 (존재하는 경우)
    if remote_branch_exists "$current_branch"; then
        git push origin --delete "$current_branch"
    fi
    
    log_success "feature 브랜치 '$current_branch'가 완료되었습니다."
}

# release 브랜치 시작
start_release() {
    if [[ -z "$1" ]]; then
        log_error "릴리스 버전을 지정해주세요. 사용법: $0 release-start [version]"
        exit 1
    fi
    
    local version="$1"
    local release_branch="release/v$version"
    
    log_info "release 브랜치 시작: $release_branch"
    
    check_changes
    check_remote_status
    
    # develop 브랜치로 이동
    git checkout develop
    git pull origin develop
    
    # release 브랜치 생성
    git checkout -b "$release_branch"
    
    log_success "release 브랜치 '$release_branch'가 생성되었습니다."
    log_info "릴리스 준비를 시작하세요!"
}

# release 브랜치 완료
finish_release() {
    local current_branch=$(get_current_branch)
    
    if [[ ! "$current_branch" =~ ^release/ ]]; then
        log_error "현재 release 브랜치에 있지 않습니다. (현재: $current_branch)"
        exit 1
    fi
    
    log_info "release 브랜치 완료: $current_branch"
    
    check_changes
    check_remote_status
    
    # 버전 추출
    local version=$(echo "$current_branch" | sed 's/release\/v//')
    
    # main 브랜치로 이동
    git checkout main
    git pull origin main
    
    # release 브랜치 병합
    git merge --no-ff "$current_branch" -m "release: v$version 릴리스"
    
    # 태그 생성
    git tag -a "v$version" -m "Release version $version"
    
    # develop 브랜치로 이동
    git checkout develop
    git pull origin develop
    
    # main의 변경사항을 develop에 병합
    git merge --no-ff main -m "merge: main의 v$version 릴리스 변경사항"
    
    # release 브랜치 삭제
    git branch -d "$current_branch"
    
    # 원격에 푸시
    git push origin main
    git push origin develop
    git push origin "v$version"
    
    # 원격 release 브랜치 삭제 (존재하는 경우)
    if remote_branch_exists "$current_branch"; then
        git push origin --delete "$current_branch"
    fi
    
    log_success "릴리스 v$version이 완료되었습니다!"
}

# hotfix 브랜치 시작
start_hotfix() {
    if [[ -z "$1" ]]; then
        log_error "핫픽스 버전을 지정해주세요. 사용법: $0 hotfix-start [version]"
        exit 1
    fi
    
    local version="$1"
    local hotfix_branch="hotfix/v$version"
    
    log_info "hotfix 브랜치 시작: $hotfix_branch"
    
    check_changes
    check_remote_status
    
    # main 브랜치로 이동
    git checkout main
    git pull origin main
    
    # hotfix 브랜치 생성
    git checkout -b "$hotfix_branch"
    
    log_success "hotfix 브랜치 '$hotfix_branch'가 생성되었습니다."
    log_info "핫픽스 개발을 시작하세요!"
}

# hotfix 브랜치 완료
finish_hotfix() {
    local current_branch=$(get_current_branch)
    
    if [[ ! "$current_branch" =~ ^hotfix/ ]]; then
        log_error "현재 hotfix 브랜치에 있지 않습니다. (현재: $current_branch)"
        exit 1
    fi
    
    log_info "hotfix 브랜치 완료: $current_branch"
    
    check_changes
    check_remote_status
    
    # 버전 추출
    local version=$(echo "$current_branch" | sed 's/hotfix\/v//')
    
    # main 브랜치로 이동
    git checkout main
    git pull origin main
    
    # hotfix 브랜치 병합
    git merge --no-ff "$current_branch" -m "hotfix: v$version 핫픽스"
    
    # 태그 생성
    git tag -a "v$version" -m "Hotfix version $version"
    
    # develop 브랜치로 이동
    git pull origin develop
    
    # main의 변경사항을 develop에 병합
    git merge --no-ff main -m "merge: main의 v$version 핫픽스 변경사항"
    
    # hotfix 브랜치 삭제
    git branch -d "$current_branch"
    
    # 원격에 푸시
    git push origin main
    git push origin develop
    git push origin "v$version"
    
    # 원격 hotfix 브랜치 삭제 (존재하는 경우)
    if remote_branch_exists "$current_branch"; then
        git push origin --delete "$current_branch"
    fi
    
    log_success "핫픽스 v$version이 완료되었습니다!"
}

# 브랜치 상태 확인
status() {
    log_info "현재 브랜치: $(get_current_branch)"
    log_info "브랜치 목록:"
    git branch -a
}

# 도움말
show_help() {
    echo "GitFlow 워크플로우 스크립트"
    echo ""
    echo "사용법: $0 [명령어] [옵션]"
    echo ""
    echo "명령어:"
    echo "  feature-start [name]     - 새로운 feature 브랜치 시작 (영어)"
    echo "  feature-korean [name]    - 새로운 feature 브랜치 시작 (한글 → 영어 자동변환)"
    echo "  feature-finish           - 현재 feature 브랜치 완료"
    echo "  release-start [version]  - 새로운 release 브랜치 시작"
    echo "  release-finish           - 현재 release 브랜치 완료"
    echo "  hotfix-start [version]   - 새로운 hotfix 브랜치 시작"
    echo "  hotfix-finish            - 현재 hotfix 브랜치 완료"
    echo "  status                   - 브랜치 상태 확인"
    echo "  help                     - 이 도움말 표시"
    echo ""
    echo "예시:"
    echo "  $0 feature-start user-authentication"
    echo "  $0 feature-korean 코칭신청관리"
    echo "  $0 feature-korean 전문가관리"
    echo "  $0 release-start 1.2.0"
    echo "  $0 hotfix-start 1.2.1"
    echo ""
    echo "한글 기능명 매핑 예시:"
    echo "  코칭신청관리 → coaching-application-management"
    echo "  전문가관리 → expert-management"
    echo "  회원관리 → member-management"
    echo "  보험 → insurance-management"
    echo "  부동산 → real-estate-management"
    echo "  세무절세 → tax-management"
    echo "  금융레버리지 → finance-management"
    echo "  사업 → business-management"
    echo "  은퇴설계 → retirement-management"
}

# 한글 기능명을 영어로 변환하는 함수
translate_feature_name() {
    local korean_name="$1"
    
    # 한글 기능명을 영어로 매핑
    case "$korean_name" in
        "코칭신청관리"|"코칭관리")
            echo "coaching-application-management"
            ;;
        "전문가코칭신청관리"|"전문가코칭관리")
            echo "expert-coaching-application-management"
            ;;
        "전문가관리"|"전문가")
            echo "expert-management"
            ;;
        "회원관리"|"회원")
            echo "member-management"
            ;;
        "진단관리"|"진단")
            echo "diagnosis-management"
            ;;
        "교육관리"|"교육")
            echo "education-management"
            ;;
        "상품관리"|"상품")
            echo "product-management"
            ;;
        "커뮤니티관리"|"커뮤니티")
            echo "community-management"
            ;;
        "보험"|"보험관리")
            echo "insurance-management"
            ;;
        "부동산"|"부동산관리")
            echo "real-estate-management"
            ;;
        "세무절세"|"세무관리")
            echo "tax-management"
            ;;
        "금융레버리지"|"금융관리")
            echo "finance-management"
            ;;
        "사업"|"사업관리")
            echo "business-management"
            ;;
        "은퇴설계"|"은퇴관리")
            echo "retirement-management"
            ;;
        "로그인"|"인증")
            echo "authentication"
            ;;
        "회원가입"|"가입")
            echo "registration"
            ;;
        "마이페이지"|"마이페이지관리")
            echo "mypage-management"
            ;;
        "결제"|"결제관리")
            echo "payment-management"
            ;;
        "알림"|"알림관리")
            echo "notification-management"
            ;;
        "검색"|"검색기능")
            echo "search-feature"
            ;;
        "필터"|"필터링")
            echo "filtering-feature"
            ;;
        "정렬"|"정렬기능")
            echo "sorting-feature"
            ;;
        "페이지네이션"|"페이징")
            echo "pagination"
            ;;
        "모달"|"다이얼로그")
            echo "modal-dialog"
            ;;
        "폼"|"입력폼")
            echo "form-input"
            ;;
        "유효성검사"|"검증")
            echo "validation"
            ;;
        "에러처리"|"오류처리")
            echo "error-handling"
            ;;
        "로딩"|"로딩화면")
            echo "loading-screen"
            ;;
        "반응형"|"반응형디자인")
            echo "responsive-design"
            ;;
        "다크모드"|"다크테마")
            echo "dark-mode"
            ;;
        "다국어"|"국제화")
            echo "internationalization"
            ;;
        "접근성"|"a11y")
            echo "accessibility"
            ;;
        "성능최적화"|"최적화")
            echo "performance-optimization"
            ;;
        "테스트"|"단위테스트")
            echo "unit-testing"
            ;;
        "배포"|"배포자동화")
            echo "deployment-automation"
            ;;
        "문서화"|"문서")
            echo "documentation"
            ;;
        "리팩토링"|"코드정리")
            echo "refactoring"
            ;;
        "버그수정"|"버그픽스")
            echo "bug-fix"
            ;;
        "UI개선"|"디자인개선")
            echo "ui-improvement"
            ;;
        "UX개선"|"사용자경험")
            echo "ux-improvement"
            ;;
        "API"|"API개발")
            echo "api-development"
            ;;
        "데이터베이스"|"DB")
            echo "database"
            ;;
        "보안"|"보안강화")
            echo "security-enhancement"
            ;;
        "백업"|"백업시스템")
            echo "backup-system"
            ;;
        "모니터링"|"로그")
            echo "monitoring-logging"
            ;;
        *)
            # 매핑되지 않은 경우 소문자로 변환하고 공백을 하이픈으로 변경
            echo "$korean_name" | tr '[:upper:]' '[:lower:]' | sed 's/[[:space:]]/-/g' | sed 's/[^a-z0-9-]//g'
            ;;
    esac
}

# 한글 기능명으로 feature 브랜치 시작
start_feature_korean() {
    if [[ -z "$1" ]]; then
        log_error "한글 기능명을 지정해주세요. 사용법: $0 feature-korean [한글기능명]"
        exit 1
    fi
    
    local korean_name="$1"
    local english_name=$(translate_feature_name "$korean_name")
    
    log_info "한글 기능명: $korean_name"
    log_info "영어 브랜치명: $english_name"
    
    start_feature "$english_name"
}

# 메인 로직
case "$1" in
    "feature-start")
        start_feature "$2"
        ;;
    "feature-korean")
        start_feature_korean "$2"
        ;;
    "feature-finish")
        finish_feature
        ;;
    "release-start")
        start_release "$2"
        ;;
    "release-finish")
        finish_release
        ;;
    "hotfix-start")
        start_hotfix "$2"
        ;;
    "hotfix-finish")
        finish_hotfix
        ;;
    "status")
        status
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        log_error "알 수 없는 명령어: $1"
        echo ""
        show_help
        exit 1
        ;;
esac 