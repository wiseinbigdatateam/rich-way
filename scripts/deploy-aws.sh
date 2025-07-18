#!/bin/bash

# 🚀 AWS 배포 스크립트
# 사용법: ./scripts/deploy-aws.sh [s3|cloudfront|ec2]

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

# 환경 변수 확인
check_env_vars() {
    log_info "환경 변수 확인 중..."
    
    if [ -z "$AWS_ACCESS_KEY_ID" ]; then
        log_error "AWS_ACCESS_KEY_ID가 설정되지 않았습니다."
        exit 1
    fi
    
    if [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
        log_error "AWS_SECRET_ACCESS_KEY가 설정되지 않았습니다."
        exit 1
    fi
    
    if [ -z "$AWS_REGION" ]; then
        export AWS_REGION="ap-northeast-2"
        log_warning "AWS_REGION이 설정되지 않아 기본값(ap-northeast-2)을 사용합니다."
    fi
    
    log_success "환경 변수 확인 완료"
}

# 프로젝트 빌드
build_project() {
    log_info "프로젝트 빌드 중..."
    
    if [ ! -f "package.json" ]; then
        log_error "package.json 파일을 찾을 수 없습니다. 프로젝트 루트 디렉토리에서 실행해주세요."
        exit 1
    fi
    
    npm ci
    npm run build
    
    if [ ! -d "dist" ]; then
        log_error "빌드 실패: dist 디렉토리가 생성되지 않았습니다."
        exit 1
    fi
    
    log_success "프로젝트 빌드 완료"
}

# S3 배포
deploy_to_s3() {
    local bucket_name=$1
    
    if [ -z "$bucket_name" ]; then
        log_error "S3 버킷 이름을 지정해주세요."
        echo "사용법: ./scripts/deploy-aws.sh s3 <bucket-name>"
        exit 1
    fi
    
    log_info "S3 버킷 '$bucket_name'에 배포 중..."
    
    aws s3 sync dist/ s3://$bucket_name --delete --cache-control "max-age=31536000,public"
    
    log_success "S3 배포 완료"
    log_info "웹사이트 URL: http://$bucket_name.s3-website.$AWS_REGION.amazonaws.com"
}

# CloudFront 캐시 무효화
invalidate_cloudfront() {
    local distribution_id=$1
    
    if [ -z "$distribution_id" ]; then
        log_error "CloudFront 배포 ID를 지정해주세요."
        echo "사용법: ./scripts/deploy-aws.sh cloudfront <distribution-id>"
        exit 1
    fi
    
    log_info "CloudFront 캐시 무효화 중..."
    
    aws cloudfront create-invalidation --distribution-id $distribution_id --paths "/*"
    
    log_success "CloudFront 캐시 무효화 완료"
}

# EC2 배포
deploy_to_ec2() {
    local host=$1
    local username=$2
    local key_file=$3
    
    if [ -z "$host" ] || [ -z "$username" ] || [ -z "$key_file" ]; then
        log_error "EC2 배포 정보가 부족합니다."
        echo "사용법: ./scripts/deploy-aws.sh ec2 <host> <username> <key-file>"
        exit 1
    fi
    
    log_info "EC2 서버 '$host'에 배포 중..."
    
    # SSH를 통한 배포
    ssh -i $key_file $username@$host << 'EOF'
        cd /var/www/rich-way
        git pull origin main
        npm ci
        npm run build
        sudo systemctl restart nginx
EOF
    
    log_success "EC2 배포 완료"
}

# 메인 함수
main() {
    local deployment_type=$1
    
    log_info "AWS 배포 스크립트 시작"
    
    # 환경 변수 확인
    check_env_vars
    
    # 프로젝트 빌드
    build_project
    
    case $deployment_type in
        "s3")
            deploy_to_s3 $2
            ;;
        "cloudfront")
            invalidate_cloudfront $2
            ;;
        "ec2")
            deploy_to_ec2 $2 $3 $4
            ;;
        "full")
            deploy_to_s3 $2
            if [ ! -z "$3" ]; then
                invalidate_cloudfront $3
            fi
            ;;
        *)
            log_error "알 수 없는 배포 타입: $deployment_type"
            echo "사용법:"
            echo "  ./scripts/deploy-aws.sh s3 <bucket-name>"
            echo "  ./scripts/deploy-aws.sh cloudfront <distribution-id>"
            echo "  ./scripts/deploy-aws.sh ec2 <host> <username> <key-file>"
            echo "  ./scripts/deploy-aws.sh full <bucket-name> [distribution-id]"
            exit 1
            ;;
    esac
    
    log_success "배포 완료! 🎉"
}

# 스크립트 실행
main "$@" 