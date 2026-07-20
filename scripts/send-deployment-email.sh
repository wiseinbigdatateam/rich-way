#!/bin/bash

# ===== 설정 변수 =====
EMAIL_HOST="smtp.worksmobile.com"
EMAIL_PORT="587"
EMAIL_USER="rich-way@wiseinc.co.kr"
EMAIL_PASSWORD_DEV=""  # 개발환경 이메일 비밀번호
EMAIL_PASSWORD_PROD="" # 운영환경 이메일 비밀번호

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

# ===== 환경변수에서 이메일 비밀번호 가져오기 =====
get_email_password() {
    local environment=$1
    
    if [ "$environment" = "dev" ]; then
        # 개발환경 이메일 비밀번호
        if [ -f ".env.development" ]; then
            EMAIL_PASSWORD_DEV=$(grep "VITE_EMAIL_PASSWORD_DEV" .env.development | cut -d'=' -f2)
        fi
        echo "$EMAIL_PASSWORD_DEV"
    elif [ "$environment" = "prod" ]; then
        # 운영환경 이메일 비밀번호
        if [ -f ".env.production" ]; then
            EMAIL_PASSWORD_PROD=$(grep "VITE_EMAIL_PASSWORD_PROD" .env.production | cut -d'=' -f2)
        fi
        echo "$EMAIL_PASSWORD_PROD"
    else
        echo ""
    fi
}

# ===== 메일 발송 함수 =====
send_deployment_email() {
    local environment=$1
    local domain=$2
    local deployment_time=$3
    local status=$4
    local error_message=$5
    
    # 환경별 설정
    if [ "$environment" = "dev" ]; then
        local env_name="개발"
        local email_password=$(get_email_password "dev")
        local recipients="admin@rich-way.co.kr,dev@rich-way.co.kr"
    elif [ "$environment" = "prod" ]; then
        local env_name="운영"
        local email_password=$(get_email_password "prod")
        local recipients="admin@rich-way.co.kr,ops@rich-way.co.kr"
    else
        log_error "알 수 없는 환경: $environment"
        return 1
    fi
    
    # 이메일 비밀번호 확인
    if [ -z "$email_password" ]; then
        log_warning "이메일 비밀번호가 설정되지 않았습니다. 메일 발송을 건너뜁니다."
        return 0
    fi
    
    # 메일 제목 설정
    if [ "$status" = "success" ]; then
        local subject="[Rich-Way] ${env_name} 서버 배포 완료 - $domain"
    else
        local subject="[Rich-Way] ${env_name} 서버 배포 실패 - $domain"
    fi
    
    # 메일 내용 생성
    local email_content=$(cat <<EOF
From: $EMAIL_USER
To: $recipients
Subject: $subject
MIME-Version: 1.0
Content-Type: text/html; charset=utf-8

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rich-Way 배포 알림</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #ffffff; padding: 30px; border: 1px solid #e9ecef; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #6c757d; }
        .success { background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 4px; margin: 20px 0; }
        .error { background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 4px; margin: 20px 0; }
        .info { background-color: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; padding: 15px; border-radius: 4px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Rich-Way 배포 알림</h1>
            <p>${env_name} 서버 배포 상태</p>
        </div>
        <div class="content">
            <h2>배포 정보</h2>
            <div class="info">
                <p><strong>환경:</strong> ${env_name} 서버</p>
                <p><strong>도메인:</strong> $domain</p>
                <p><strong>배포 시간:</strong> $deployment_time</p>
                <p><strong>상태:</strong> $(if [ "$status" = "success" ]; then echo "✅ 성공"; else echo "❌ 실패"; fi)</p>
            </div>
            
            $(if [ "$status" = "success" ]; then
                echo '<div class="success">
                    <h3>✅ 배포가 성공적으로 완료되었습니다!</h3>
                    <p>새로운 버전이 ${env_name} 서버에 배포되었습니다.</p>
                    <ul>
                        <li>웹사이트: <a href="http://'$domain'">http://'$domain'</a></li>
                        <li>배포 시간: '$deployment_time'</li>
                    </ul>
                </div>'
            else
                echo '<div class="error">
                    <h3>❌ 배포 중 오류가 발생했습니다!</h3>
                    <p>배포 프로세스 중 문제가 발생했습니다.</p>
                    <p><strong>오류 내용:</strong> '$error_message'</p>
                </div>'
            fi)
            
            <h3>배포 후 확인사항</h3>
            <ul>
                <li>웹사이트 접속 확인</li>
                <li>주요 기능 동작 확인</li>
                <li>데이터베이스 연결 확인</li>
                <li>로그 파일 확인</li>
            </ul>
        </div>
        <div class="footer">
            <p>이 메일은 Rich-Way 배포 시스템에서 자동으로 발송되었습니다.</p>
            <p>© 2024 Rich-Way. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
EOF
)
    
    # 메일 발송 (curl을 사용하여 SMTP 서버로 직접 발송)
    log_info "📧 배포 완료 메일 발송 중..."
    
    # 임시 파일 생성
    local temp_file=$(mktemp)
    echo "$email_content" > "$temp_file"
    
    # curl을 사용하여 메일 발송
    local curl_result=$(curl -s --mail-from "$EMAIL_USER" \
        --mail-rcpt "$recipients" \
        --upload-file "$temp_file" \
        --user "$EMAIL_USER:$email_password" \
        --ssl-reqd \
        --url "smtp://$EMAIL_HOST:$EMAIL_PORT" 2>&1)
    
    # 임시 파일 삭제
    rm -f "$temp_file"
    
    if [ $? -eq 0 ]; then
        log_success "배포 완료 메일 발송 성공"
        return 0
    else
        log_error "메일 발송 실패: $curl_result"
        return 1
    fi
}

# ===== 메인 함수 =====
main() {
    local environment=$1
    local domain=$2
    local status=$3
    local error_message=$4
    
    # 필수 파라미터 확인
    if [ -z "$environment" ] || [ -z "$domain" ] || [ -z "$status" ]; then
        log_error "사용법: $0 <environment> <domain> <status> [error_message]"
        log_info "예시: $0 dev dev.rich-way.co.kr success"
        log_info "예시: $0 prod rich-way.co.kr failure '배포 중 오류 발생'"
        exit 1
    fi
    
    # 배포 시간
    local deployment_time=$(date '+%Y-%m-%d %H:%M:%S')
    
    # 메일 발송
    if send_deployment_email "$environment" "$domain" "$deployment_time" "$status" "$error_message"; then
        log_success "배포 알림 메일 발송 완료"
    else
        log_warning "배포 알림 메일 발송 실패 (배포는 계속 진행됨)"
    fi
}

# ===== 스크립트 실행 =====
main "$@"
