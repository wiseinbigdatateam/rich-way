# 🚀 운영 환경 배포 가이드

## 📋 배포 전 체크리스트

### 1. 환경 설정 확인
- [ ] Supabase 환경 변수 설정
- [ ] 운영 환경 API 키 설정
- [ ] 도메인 및 SSL 인증서 준비

### 2. 코드 최적화 확인
- [ ] 콘솔로그 제거 확인
- [ ] 더미 데이터 비활성화 확인
- [ ] 메모리 누수 방지 로직 적용 확인

## 🛠️ 운영 환경 빌드 방법

### 방법 1: 스크립트 사용 (권장)
```bash
# 운영 환경 빌드 스크립트 실행
npm run deploy:build
```

### 방법 2: 직접 빌드
```bash
# 운영 환경 빌드
npm run build:prod

# 또는 깨끗한 빌드
npm run build:clean
```

### 방법 3: 환경 변수와 함께 빌드
```bash
# 환경 변수 설정
export NODE_ENV=production
export VITE_MODE=production

# 빌드 실행
npm run build
```

## 🔧 빌드 최적화 설정

### Vite 설정 최적화
```typescript
// vite.config.ts
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProduction,        // console.log 제거
          drop_debugger: isProduction,       // debugger 제거
          pure_funcs: isProduction ? ['console.log', 'console.info', 'console.debug'] : [],
        },
      },
      sourcemap: !isProduction,              // 소스맵 비활성화
    },
  };
});
```

### 운영 환경 유틸리티
```typescript
// src/utils/productionUtils.ts
export const setupProductionConsole = () => {
  if (isProduction) {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
  }
};
```

## 📦 배포 방법

### 1. AWS S3 + CloudFront 배포
```bash
# S3에 배포
./scripts/deploy-aws.sh s3 your-bucket-name

# CloudFront 캐시 무효화 (선택사항)
./scripts/deploy-aws.sh cloudfront your-distribution-id
```

### 2. AWS EC2 배포
```bash
# EC2 서버에 배포
./scripts/deploy-aws.sh ec2 your-server-host your-username your-key-file
```

### 3. 전체 배포 (S3 + CloudFront)
```bash
# 전체 배포
./scripts/deploy-aws.sh full your-bucket-name your-distribution-id
```

## 🔍 배포 후 확인사항

### 1. 콘솔로그 확인
```bash
# 빌드된 파일에서 console.log 확인
grep -r "console.log" dist/
```

### 2. 소스맵 확인
```bash
# 소스맵 파일 확인
find dist/ -name "*.map"
```

### 3. 빌드 크기 확인
```bash
# 빌드 크기 확인
du -sh dist/
```

### 4. 성능 확인
- [ ] 페이지 로딩 속도 확인
- [ ] 메모리 사용량 확인
- [ ] 네트워크 요청 최적화 확인

## 🚨 주의사항

### 1. 환경 변수 관리
- 운영 환경에서는 민감한 정보를 환경 변수로 관리
- `.env.production` 파일 사용 (git에 커밋하지 않음)

### 2. 더미 데이터 비활성화
- 운영 환경에서는 실제 데이터베이스 연결 확인
- Demo 모드 비활성화 확인

### 3. 에러 처리
- 운영 환경에서는 사용자 친화적인 에러 메시지 표시
- 민감한 정보가 콘솔에 노출되지 않도록 주의

### 4. 성능 최적화
- 이미지 최적화
- 코드 스플리팅 적용
- 캐싱 전략 수립

## 📊 모니터링

### 1. 성능 모니터링
```javascript
// 운영 환경에서 성능 측정
if (isProduction) {
  // Core Web Vitals 측정
  // 사용자 행동 분석
  // 에러 추적
}
```

### 2. 로그 모니터링
- 운영 환경에서는 에러 로그만 수집
- 사용자 개인정보는 로그에 포함하지 않음

### 3. 리소스 모니터링
- 메모리 사용량 모니터링
- CPU 사용량 모니터링
- 네트워크 요청 모니터링

## 🔄 롤백 방법

### 1. 이전 버전으로 롤백
```bash
# 이전 빌드 파일로 복원
aws s3 sync s3://your-bucket-name/backup/previous-version/ dist/

# CloudFront 캐시 무효화
./scripts/deploy-aws.sh cloudfront your-distribution-id
```

### 2. 긴급 롤백
```bash
# 최신 안정 버전으로 즉시 롤백
git checkout stable-version
npm run deploy:build
./scripts/deploy-aws.sh full your-bucket-name your-distribution-id
```

## 📞 문제 해결

### 빌드 실패 시
1. `node_modules` 삭제 후 재설치
2. 캐시 정리: `npm run build:clean`
3. 환경 변수 확인

### 배포 실패 시
1. AWS 자격 증명 확인
2. 네트워크 연결 확인
3. 권한 설정 확인

### 성능 문제 시
1. 빌드 크기 확인
2. 네트워크 요청 최적화
3. 캐싱 전략 재검토

## 🎯 결론

이 가이드를 따라하면:
- ✅ 콘솔로그가 제거된 깔끔한 운영 환경 빌드
- ✅ 더미 데이터가 비활성화된 실제 데이터 연동
- ✅ 최적화된 성능과 보안
- ✅ 안정적인 배포 프로세스

지속적인 모니터링과 개선을 통해 안정적인 운영 환경을 구축할 수 있습니다. 