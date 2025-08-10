# 📧 이메일 서버 설정 문제 해결 가이드

## 🚨 현재 문제 상황
- **오류**: `535 5.7.1 Username and Password not accepted`
- **원인**: 이메일 비밀번호 인증 실패
- **상황**: Production 환경에서 실행 중이지만 올바른 환경변수를 읽지 못함

## 🔧 해결 단계

### 1단계: 환경변수 파일 생성
```bash
# EC2 서버에서 실행
cd ~/rich-way
cp env.production.example .env.production
```

### 2단계: 이메일 비밀번호 설정
`.env.production` 파일을 편집하여 실제 네이버웍스 이메일 비밀번호를 설정:

```bash
# .env.production 파일 편집
nano .env.production
```

다음 라인을 찾아 실제 비밀번호로 변경:
```env
VITE_EMAIL_PASSWORD_PROD=your-actual-email-password-here
```

**⚠️ 중요**: `your-actual-email-password-here` 부분을 실제 네이버웍스 이메일 비밀번호로 변경해야 합니다.

### 3단계: 설정 확인
```bash
# 설정 테스트 스크립트 실행
./scripts/test-email-config.sh
```

### 4단계: 이메일 서버 재시작
```bash
# 이메일 서버 중지 (Ctrl+C)
# 다시 시작
cd ~/rich-way/mail-server
NODE_ENV=production node email-api.js
```

## 🔍 문제 진단

### 환경변수 확인
```bash
# 현재 설정된 환경변수 확인
echo $NODE_ENV
echo $VITE_EMAIL_PASSWORD_PROD
```

### 이메일 서버 로그 확인
```bash
# 이메일 서버 실행 시 다음 정보들이 출력되어야 함:
# - 환경: production
# - 이메일 주소: rich-way@wiseinc.co.kr
# - 비밀번호 설정됨: ✅
# - 환경변수 파일: .env.production
```

## 🚀 네이버웍스 이메일 설정

### SMTP 설정 정보
- **서버**: `smtp.worksmobile.com`
- **포트**: `587`
- **보안**: `STARTTLS`
- **사용자**: `rich-way@wiseinc.co.kr`
- **비밀번호**: 네이버웍스 계정 비밀번호

### 네이버웍스 계정 확인
1. [네이버웍스 관리자 페이지](https://admin.worksmobile.com) 접속
2. 이메일 계정 설정 확인
3. SMTP 인증 설정 확인
4. 비밀번호 재설정 (필요시)

## 📋 체크리스트

- [ ] `.env.production` 파일 생성
- [ ] `VITE_EMAIL_PASSWORD_PROD` 설정
- [ ] 실제 네이버웍스 비밀번호 입력
- [ ] 이메일 서버 재시작
- [ ] 로그에서 "비밀번호 설정됨: ✅" 확인
- [ ] 이메일 발송 테스트

## 🆘 추가 문제 발생 시

### 로그 확인
```bash
# 이메일 서버 로그 확인
tail -f ~/rich-way/mail-server/email-server.log
```

### 네트워크 연결 확인
```bash
# SMTP 서버 연결 테스트
telnet smtp.worksmobile.com 587
```

### 방화벽 설정 확인
- EC2 보안 그룹에서 아웃바운드 트래픽 허용
- 포트 587 아웃바운드 허용

## 📞 지원 연락처

- **네이버웍스**: [고객센터](https://help.worksmobile.com)
- **AWS EC2**: AWS 콘솔에서 인스턴스 상태 확인
