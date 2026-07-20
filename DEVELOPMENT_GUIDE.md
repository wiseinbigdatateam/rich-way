# 🛠️ RichWay 개발 가이드

## 📋 목차

1. [환경 설정](#환경-설정)
2. [데이터베이스 관리](#데이터베이스-관리)
3. [개발 워크플로우](#개발-워크플로우)
4. [배포 가이드](#배포-가이드)
5. [문제 해결](#문제-해결)

## 🚀 환경 설정

### 1. 프로젝트 클론 및 의존성 설치

```bash
# 프로젝트 클론
git clone <repository-url>
cd rich-way

# 의존성 설치
npm install
```

### 2. 환경별 설정

#### **로컬 개발환경**
```bash
# 로컬 환경변수 설정
npm run env:local

# .env.local 파일 편집
# 실제 Supabase 개발 프로젝트 정보 입력
```

#### **개발 서버용**
```bash
# 개발 환경변수 설정
npm run env:dev

# .env.development 파일 편집
# 실제 Supabase 개발 프로젝트 정보 입력
```

#### **운영 서버용**
```bash
# 운영 환경변수 설정
npm run env:prod

# .env.production 파일 편집
# 실제 Supabase 운영 프로젝트 정보 입력
```

### 3. 환경변수 확인

```bash
# 환경변수 파일 상태 확인
npm run env:check
```

## 🗄️ 데이터베이스 관리

### 1. 개발용 Supabase 프로젝트 생성

1. **Supabase 프로젝트 생성**
   - https://supabase.com 접속
   - "New Project" 클릭
   - 프로젝트명: `rich-way-dev`
   - 데이터베이스 비밀번호 설정
   - 지역 선택 (ap-northeast-1 권장)

2. **API 키 복사**
   - Settings > API 메뉴
   - Project URL 복사
   - anon public key 복사

3. **환경변수 설정**
   ```bash
   # .env.development 파일에 입력
   VITE_SUPABASE_URL_DEV=https://your-dev-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY_DEV=your-dev-anon-key
   ```

### 2. 데이터베이스 스키마 설정

#### **방법 1: 완전한 설정 (권장)**
```bash
# 개발 Supabase Dashboard > SQL Editor에서 실행:
# scripts/setup-dev-database-complete.sql
```

#### **방법 2: 단계별 설정**
```bash
# 1. 기본 테이블 생성
# sql/supabase_members_table.sql
# sql/supabase_mbti_diagnosis_table.sql
# sql/supabase_finance_diagnosis_table.sql
# sql/supabase_experts_table.sql
# sql/supabase_expert_products_table.sql
# sql/supabase_coaching_applications_table.sql
# sql/supabase_post_likes_table.sql
# sql/supabase_community_comments_table.sql

# 2. 샘플 데이터 삽입
# sql/dev_sample_data.sql
```

### 3. 샘플 데이터 생성

```bash
# 자동 생성
./scripts/generate-sample-data.sh

# 수동 실행
# 개발 Supabase Dashboard > SQL Editor에서 실행:
# sql/dev_sample_data.sql
```

### 4. 데이터베이스 동기화

#### **운영 DB → 개발 DB 동기화**
```bash
# 전체 가이드
npm run db:sync

# 단계별 가이드
npm run db:migrate
```

#### **스키마 추출**
```bash
# 운영 DB에서 스키마 추출 가이드
npm run db:extract
```

#### **스키마 적용**
```bash
# 개발 DB에 스키마 적용 가이드
npm run db:apply
```

## 🔄 개발 워크플로우

### 1. 기능 개발

```bash
# 1. 기능 브랜치 생성
npm run gitflow:feature [feature-name]

# 2. 개발 작업
npm run dev

# 3. 로컬 테스트
npm run dev:check

# 4. 기능 완료
npm run gitflow:feature-finish
```

### 2. 릴리스 준비

```bash
# 1. 릴리스 브랜치 생성
npm run gitflow:release [version]

# 2. 릴리스 준비 (버그 수정, 문서 업데이트)

# 3. 릴리스 완료
npm run gitflow:release-finish
```

### 3. 긴급 수정

```bash
# 1. 핫픽스 브랜치 생성
npm run gitflow:hotfix [version]

# 2. 긴급 수정

# 3. 핫픽스 완료
npm run gitflow:hotfix-finish
```

## 🚀 배포 가이드

### 1. 로컬 검증

```bash
# 로컬 사전 배포 검증
npm run check

# 수동 검증
npm run dev:check
npm run build
npm run preview:check
```

### 2. 개발 서버 배포

```bash
# 개발 서버 배포
npm run deploy:dev

# 빌드 후 배포
npm run deploy:dev:build
```

### 3. 운영 서버 배포

```bash
# 운영 서버 배포
npm run deploy:prod

# 빌드 후 배포
npm run deploy:prod:build
```

## 🔧 문제 해결

### 1. 환경변수 문제

#### **문제: Supabase 연결 실패**
```bash
# 해결 방법
npm run env:check
# 환경변수 파일이 올바르게 설정되었는지 확인
```

#### **문제: Demo 모드로 실행됨**
```bash
# 해결 방법
# .env.local 또는 .env.development 파일에 올바른 Supabase 정보 입력
```

### 2. 데이터베이스 문제

#### **문제: 테이블이 존재하지 않음**
```bash
# 해결 방법
npm run db:setup
# 또는 scripts/setup-dev-database-complete.sql 실행
```

#### **문제: 샘플 데이터가 없음**
```bash
# 해결 방법
./scripts/generate-sample-data.sh
# 또는 sql/dev_sample_data.sql 실행
```

### 3. 배포 문제

#### **문제: 개발 서버 배포 실패**
```bash
# 해결 방법
# 1. SSH 키 파일 경로 확인
# 2. EC2 인스턴스 상태 확인
# 3. 환경변수 설정 확인
```

#### **문제: 빌드 실패**
```bash
# 해결 방법
npm run type-check
npm run lint
# TypeScript 오류와 린트 오류 수정
```

## 📚 추가 자료

- [GitFlow 워크플로우 가이드](./GITFLOW_GUIDE.md)
- [메모리 누수 방지 가이드](./MEMORY_LEAK_PREVENTION.md)
- [프로덕션 배포 가이드](./PRODUCTION_DEPLOYMENT.md)
- [Supabase 공식 문서](https://supabase.com/docs)

## 🤝 지원

개발 중 문제가 발생하면:

1. **로그 확인**: 브라우저 개발자 도구 콘솔
2. **환경변수 확인**: `npm run env:check`
3. **데이터베이스 확인**: Supabase Dashboard
4. **문서 참조**: 위의 추가 자료들 