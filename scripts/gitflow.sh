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
    echo "  feature-start [name]     - 새로운 feature 브랜치 시작"
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
    echo "  $0 release-start 1.2.0"
    echo "  $0 hotfix-start 1.2.1"
}

# 메인 로직
case "$1" in
    "feature-start")
        start_feature "$2"
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