# 네이버웍스 이메일 서비스 설정 가이드

## 📧 네이버웍스 SMTP 설정

### 1. 네이버웍스 관리자 설정

#### 1.1 네이버웍스 관리자 페이지 접속
- 네이버웍스 관리자 페이지: https://admin.worksmobile.com
- 관리자 계정으로 로그인

#### 1.2 이메일 설정 확인
1. **관리 → 이메일 설정**
2. **SMTP 설정 확인:**
   - SMTP 서버: `smtp.worksmobile.com`
   - SMTP 포트: `587`
   - 보안 연결: `STARTTLS`
   - 인증 방식: `사용자명/비밀번호`

#### 1.3 이메일 계정 생성/확인
1. **사용자 관리 → 이메일 계정**
2. **이메일 주소**: `rich-way@wiseinc.co.kr`
3. **비밀번호 설정**: 안전한 비밀번호 설정

### 2. 환경변수 설정

#### 2.1 개발 환경 (.env.development)
```bash
# 네이버웍스 이메일 설정
VITE_EMAIL_PASSWORD_DEV=your-naverworks-dev-password
NODE_ENV=development
```

#### 2.2 운영 환경 (.env.production)
```bash
# 네이버웍스 이메일 설정
VITE_EMAIL_PASSWORD_PROD=your-naverworks-prod-password
NODE_ENV=production
```

### 3. SMTP 설정 상세 정보

```javascript
// 네이버웍스 SMTP 설정
{
  host: 'smtp.worksmobile.com',     // 네이버웍스 SMTP 서버
  port: 587,                        // SMTP 포트
  secure: false,                    // STARTTLS 사용
  auth: {
    user: 'rich-way@wiseinc.co.kr', // 네이버웍스 이메일 주소
    pass: 'your-password'           // 네이버웍스 이메일 비밀번호
  },
  tls: {
    rejectUnauthorized: false       // SSL 인증서 검증 비활성화 (필요시)
  }
}
```

### 4. 테스트 방법

#### 4.1 서버 실행
```bash
cd server
npm install
npm run dev
```

#### 4.2 API 테스트
```bash
curl -X POST http://localhost:3001/api/send-password-reset-email \
  -H 'Content-Type: application/json' \
  -d '{
    "to": "kerow@hanmail.net",
    "resetLink": "http://localhost:8080/reset-password?token=test"
  }'
```

#### 4.3 브라우저에서 테스트
```javascript
// 브라우저 콘솔에서 실행
fetch('http://localhost:3001/api/send-password-reset-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'kerow@hanmail.net',
    resetLink: 'http://localhost:8080/reset-password?token=test'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### 5. 네이버웍스 이메일 서비스 장점

#### 5.1 보안성
- 한국 기업용 이메일 서비스
- 높은 보안 수준
- 스팸 필터링 우수

#### 5.2 안정성
- 99.9% 가용성 보장
- 24/7 기술 지원
- 한국 서버 운영

#### 5.3 관리 편의성
- 직관적인 관리자 인터페이스
- 상세한 로그 제공
- 사용량 모니터링

### 6. 문제 해결

#### 6.1 인증 실패
- 이메일 주소와 비밀번호 확인
- 네이버웍스 관리자에서 계정 상태 확인
- 2단계 인증 설정 확인

#### 6.2 연결 실패
- 방화벽 설정 확인
- 네트워크 연결 상태 확인
- SMTP 포트(587) 접근 가능 여부 확인

#### 6.3 이메일 발송 실패
- 받는 사람 이메일 주소 확인
- 스팸 메일함 확인
- 네이버웍스 발송 제한 확인

### 7. 모니터링 및 로그

#### 7.1 네이버웍스 관리자 로그
- 관리자 페이지 → 로그 → 이메일 로그
- 발송 성공/실패 기록
- 상세한 오류 정보

#### 7.2 애플리케이션 로그
```javascript
// 서버 로그에서 확인
console.log('✅ 이메일 발송 성공:', info.messageId);
console.log('❌ 이메일 발송 실패:', error.message);
```

### 8. 보안 고려사항

#### 8.1 환경변수 관리
- 비밀번호를 코드에 하드코딩하지 않음
- 환경별로 다른 비밀번호 사용
- 정기적인 비밀번호 변경

#### 8.2 접근 제어
- API 엔드포인트에 인증 추가
- 요청 제한(Rate Limiting) 설정
- CORS 설정 확인

### 9. 운영 환경 배포

#### 9.1 환경변수 설정
```bash
# 운영 서버에서 설정
export VITE_EMAIL_PASSWORD_PROD=your-production-password
export NODE_ENV=production
```

#### 9.2 서버 실행
```bash
npm start
```

#### 9.3 모니터링
- 서버 상태 모니터링
- 이메일 발송 성공률 모니터링
- 오류 로그 모니터링
