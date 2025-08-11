#!/bin/bash

# ===== 설정 변수 =====
EC2_IP="3.34.15.65"                              # EC2 퍼블릭 IP
DOMAIN="rich-way.co.kr"                        # 운영 도메인
KEY_FILE="/Users/jinseongkim/awsKey/richway.pem"            # SSH 키 파일 경로
REMOTE_USER="ec2-user"                             # EC2 사용자명
REMOTE_PATH="~/rich-way/current"              # 원격 서버 경로

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

# ===== SSH 키 파일 확인 =====
check_ssh_key() {
    log_info "SSH 키 파일 확인 중..."
    
    # 설정된 키 파일 경로 확인
    if [ -f "$KEY_FILE" ]; then
        log_success "SSH 키 파일 발견: $KEY_FILE"
        return 0
    fi
    
    # 일반적인 SSH 키 경로들 확인
    local possible_paths=(
        "~/.ssh/richway.pem"
        "~/awsKey/richway.pem"
        "/Users/jinseongkim/awsKey/richway.pem"
        "~/.ssh/id_rsa"
    )
    
    for path in "${possible_paths[@]}"; do
        expanded_path=$(eval echo $path)
        if [ -f "$expanded_path" ]; then
            KEY_FILE="$expanded_path"
            log_success "SSH 키 파일 발견: $expanded_path"
            return 0
        fi
    done
    
    log_error "SSH 키 파일을 찾을 수 없습니다!"
    log_info "다음 경로들을 확인해주세요:"
    for path in "${possible_paths[@]}"; do
        echo "  - $path"
    done
    log_info "또는 스크립트 상단의 KEY_FILE 변수를 수정해주세요."
    return 1
}

# ===== SSH 연결 테스트 =====
test_ssh_connection() {
    log_info "SSH 연결 테스트 중..."
    
    if ssh -i $KEY_FILE -o ConnectTimeout=10 -o BatchMode=yes $REMOTE_USER@$EC2_IP "echo 'SSH 연결 성공'" 2>/dev/null; then
        log_success "SSH 연결 성공"
        return 0
    else
        log_error "SSH 연결 실패"
        log_info "다음을 확인해주세요:"
        log_info "1. EC2 인스턴스가 실행 중인지 확인"
        log_info "2. 보안 그룹에서 SSH(22) 포트가 열려있는지 확인"
        log_info "3. 키 파일 경로와 권한이 올바른지 확인"
        return 1
    fi
}

# ===== 메일 서버 설정 및 시작 =====
setup_mail_server() {
    log_info "📧 메일 서버 설정 및 시작 중..."
    
    # 1. 메일 서버 디렉토리 생성
    log_info "  1단계: 메일 서버 디렉토리 생성..."
    ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP "mkdir -p ~/rich-way/mail-server"
    
    # 2. 메일 서버 파일 업로드
    log_info "  2단계: 메일 서버 파일 업로드..."
    rsync -avz --delete -e "ssh -i $KEY_FILE" server/ $REMOTE_USER@$EC2_IP:~/rich-way/mail-server/
    
    # 3. 메일 서버 의존성 설치
    log_info "  3단계: 메일 서버 의존성 설치..."
    ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP "cd ~/rich-way/mail-server && npm install"
    
    # 4. 환경 변수 파일 생성 (운영 환경용)
    log_info "  4단계: 환경 변수 설정..."
    
    # 로컬 .env 파일에서 이메일 비밀번호 읽기
    local email_password=""
    if [ -f ".env.production" ]; then
        email_password=$(grep "VITE_EMAIL_PASSWORD_PROD" .env.production | cut -d'=' -f2)
    elif [ -f ".env" ]; then
        email_password=$(grep "VITE_EMAIL_PASSWORD_PROD" .env | cut -d'=' -f2)
    fi
    
    # 비밀번호가 없으면 기본값 사용 (보안상 경고 표시)
    if [ -z "$email_password" ]; then
        log_warning "이메일 비밀번호를 .env 파일에서 찾을 수 없습니다. 기본값을 사용합니다."
        email_password="4xFETu3AbovX"
    else
        log_success "이메일 비밀번호를 .env 파일에서 로드했습니다."
    fi
    
    ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP "cat > ~/rich-way/mail-server/.env << EOF
NODE_ENV=production
VITE_EMAIL_HOST_PROD=smtp.naverworks.com
VITE_EMAIL_PORT_PROD=587
VITE_EMAIL_USER_PROD=rich-way@wiseinc.co.kr
VITE_EMAIL_PASSWORD_PROD=$email_password
VITE_EMAIL_FROM_PROD=rich-way@wiseinc.co.kr
EOF"
    
    # 5. 메일 서버 프로세스 종료 (이미 실행 중인 경우)
    log_info "  5단계: 기존 메일 서버 프로세스 정리..."
    ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP "pkill -f 'email-api.js' || true"
    
    # 6. 메일 서버 시작 (개선된 버전)
    log_info "  6단계: 메일 서버 시작..."
    
    # 메일 서버 시작을 위한 안정적인 스크립트 생성
    ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP "cat > ~/rich-way/mail-server/start-server.sh << 'EOF'
#!/bin/bash
cd ~/rich-way/mail-server
# 기존 프로세스 완전 종료
pkill -f 'email-api.js' 2>/dev/null || true
sleep 2
# 새 프로세스 시작
nohup node email-api.js > email-server.log 2>&1 &
echo \$! > server.pid
sleep 1
echo 'Mail server startup initiated'
EOF"
    
    # 스크립트 실행 권한 부여 및 실행
    ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP "chmod +x ~/rich-way/mail-server/start-server.sh"
    ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP "~/rich-way/mail-server/start-server.sh"
    
    # 7. 메일 서버 상태 확인 (개선된 버전)
    log_info "  7단계: 메일 서버 상태 확인..."
    
    # 짧은 대기 후 상태 확인 (최대 3회 시도)
    local max_attempts=3
    local attempt=1
    local server_ready=false
    
    while [ $attempt -le $max_attempts ]; do
        sleep 2
        log_info "  상태 확인 시도 $attempt/$max_attempts..."
        
        if ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP "curl -s --connect-timeout 3 --max-time 5 http://localhost:3001/api/health" 2>/dev/null | grep -q "OK"; then
            log_success "메일 서버 정상 작동 확인됨"
            server_ready=true
            break
        fi
        
        attempt=$((attempt + 1))
    done
    
    if [ "$server_ready" = false ]; then
        log_warning "메일 서버 상태 확인 실패 (하지만 배포 계속 진행)"
        log_info "메일 서버 로그 확인:"
        ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP "tail -5 ~/rich-way/mail-server/email-server.log 2>/dev/null || echo '로그 파일 없음'"
    fi
}

# ===== 권한 설정 (개선된 버전) =====
setup_permissions() {
    log_info "🔧 권한 설정 중..."
    
    # 1단계: 디렉토리 소유권 변경
    log_info "  1단계: 디렉토리 소유권 변경..."
    if ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP "sudo chown -R $REMOTE_USER:$REMOTE_USER ~/rich-way/" 2>/dev/null; then
        log_success "  디렉토리 소유권 변경 완료"
    else
        log_warning "  디렉토리 소유권 변경 실패 (계속 진행)"
    fi
    
    # 2단계: 기본 권한 설정
    log_info "  2단계: 기본 권한 설정..."
    if ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP "chmod -R 755 ~/rich-way/current/" 2>/dev/null; then
        log_success "  기본 권한 설정 완료"
    else
        log_warning "  기본 권한 설정 실패 (계속 진행)"
    fi
    
    # 3단계: Nginx 사용자 권한 설정 (선택적)
    log_info "  3단계: Nginx 사용자 권한 설정..."
    if ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP "sudo chown -R nginx:nginx ~/rich-way/current/" 2>/dev/null; then
        log_success "  Nginx 사용자 권한 설정 완료"
    else
        log_warning "  Nginx 사용자 권한 설정 실패 (계속 진행)"
    fi
    
    # 4단계: 읽기 권한 확인
    log_info "  4단계: 읽기 권한 확인..."
    if ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP "test -r ~/rich-way/current/index.html" 2>/dev/null; then
        log_success "  읽기 권한 확인 완료"
    else
        log_warning "  읽기 권한 확인 실패 (Nginx 재시작 후 확인 필요)"
    fi
    
    log_success "권한 설정 프로세스 완료"
}

# ===== 메일 발송 함수 =====
send_deployment_notification() {
    local status=$1
    local error_message=$2
    
    log_info "📧 배포 완료 알림 메일 발송 중..."
    
    if [ -f "scripts/send-deployment-email.sh" ]; then
        if [ "$status" = "success" ]; then
            ./scripts/send-deployment-email.sh "prod" "$DOMAIN" "success"
        else
            ./scripts/send-deployment-email.sh "prod" "$DOMAIN" "failure" "$error_message"
        fi
    else
        log_warning "메일 발송 스크립트를 찾을 수 없습니다: scripts/send-deployment-email.sh"
    fi
}

# ===== 메인 배포 프로세스 =====
main() {
    log_info "Rich-Way 운영 서버 배포 시작..."
    log_info "대상 서버: $EC2_IP"
    log_info "도메인: $DOMAIN"
    
    # SSH 키 파일 확인
    if ! check_ssh_key; then
        send_deployment_notification "failure" "SSH 키 파일을 찾을 수 없습니다"
        exit 1
    fi
    
    # SSH 연결 테스트
    if ! test_ssh_connection; then
        send_deployment_notification "failure" "SSH 연결에 실패했습니다"
        exit 1
    fi
    
    # 1. 현재 배포 백업
    log_info "📦 현재 배포 백업 중..."
    BACKUP_NAME=$(date +%Y%m%d_%H%M%S)
    if ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP "mkdir -p ~/rich-way/backup && cp -r ~/rich-way/current ~/rich-way/backup/$BACKUP_NAME" 2>/dev/null; then
        log_success "백업 완료: $BACKUP_NAME"
    else
        log_warning "백업 실패 (첫 배포일 수 있음)"
    fi
    
    # 2. 새 파일 업로드
    log_info "📤 파일 업로드 중..."
    if rsync -avz --delete -e "ssh -i $KEY_FILE" dist/ $REMOTE_USER@$EC2_IP:$REMOTE_PATH/; then
        log_success "파일 업로드 완료"
    else
        log_error "파일 업로드 실패"
        send_deployment_notification "failure" "파일 업로드 중 오류가 발생했습니다"
        exit 1
    fi
    
    # 3. 메일 서버 설정 및 시작
    setup_mail_server
    
    # 4. 권한 설정 (개선된 버전)
    setup_permissions
    
    # 5. Nginx 재시작
    log_info "🔄 Nginx 재시작 중..."
    if ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP "sudo systemctl restart nginx"; then
        log_success "Nginx 재시작 완료"
    else
        log_error "Nginx 재시작 실패"
        send_deployment_notification "failure" "Nginx 재시작 중 오류가 발생했습니다"
        exit 1
    fi
    
    # 6. 배포 완료 메시지
    log_success "🚀 운영 서버 배포 완료!"
    echo ""
    log_info "📋 접속 정보:"
    echo "   웹사이트: http://$DOMAIN"
    echo "   IP 접속: http://$EC2_IP"
    echo ""
    log_info "📧 메일 서버 정보:"
    echo "   상태: http://$EC2_IP:3001/api/health"
    echo "   로그: ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP 'tail -f ~/rich-way/mail-server/email-server.log'"
    echo ""
    log_info "🔧 유용한 명령어:"
    echo "   로그 확인: ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP 'tail -f ~/rich-way/logs/access.log'"
    echo "   서버 상태: ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP 'sudo systemctl status nginx'"
    echo "   백업 목록: ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP 'ls -la ~/rich-way/backup/'"
    echo "   권한 확인: ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP 'ls -la ~/rich-way/current/'"
    echo "   메일 서버 재시작: ssh -i $KEY_FILE $REMOTE_USER@$EC2_IP 'cd ~/rich-way/mail-server && pkill -f email-api.js && nohup node email-api.js > email-server.log 2>&1 &'"
    
    # 7. 배포 완료 메일 발송
    send_deployment_notification "success"
}

# ===== 스크립트 실행 =====
main "$@"