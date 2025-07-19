#!/bin/bash

# 🚀 운영 환경 빌드 스크립트
# 사용법: ./scripts/build-production.sh

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

# 환경 변수 설정
export NODE_ENV=production
export VITE_MODE=production

log_info "운영 환경 빌드 시작..."

# 1. 의존성 설치
log_info "의존성 설치 중..."
npm ci --production=false

# 2. 이전 빌드 정리
log_info "이전 빌드 정리 중..."
rm -rf dist

# 3. 운영 환경 빌드
log_info "운영 환경 빌드 중..."
npm run build

# 4. 빌드 결과 확인
if [ ! -d "dist" ]; then
    log_error "빌드 실패: dist 디렉토리가 생성되지 않았습니다."
    exit 1
fi

# 5. 빌드 크기 확인
BUILD_SIZE=$(du -sh dist | cut -f1)
log_info "빌드 크기: $BUILD_SIZE"

# 6. 운영 환경 최적화 확인
log_info "운영 환경 최적화 확인 중..."

# console.log 제거 확인
if grep -r "console.log" dist/ > /dev/null 2>&1; then
    log_warning "console.log가 빌드에 포함되어 있습니다."
else
    log_success "console.log가 성공적으로 제거되었습니다."
fi

# 소스맵 확인
if find dist/ -name "*.map" | grep -q .; then
    log_warning "소스맵이 생성되었습니다. 운영 환경에서는 제거하는 것을 권장합니다."
else
    log_success "소스맵이 생성되지 않았습니다."
fi

# 7. 빌드 완료
log_success "운영 환경 빌드 완료! 🎉"
log_info "배포할 파일: dist/ 디렉토리"
log_info "다음 명령어로 배포할 수 있습니다:"
echo "  ./scripts/deploy-aws.sh s3 <bucket-name>"
echo "  또는"
echo "  ./scripts/deploy-aws.sh ec2 <host> <username> <key-file>" 