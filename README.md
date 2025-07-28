# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/e3bb5916-6d3e-4630-8636-bdddba2b8382

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/e3bb5916-6d3e-4630-8636-bdddba2b8382) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Create environment variables file (선택사항)
# Supabase를 사용하려면 .env.local 파일을 생성하고 다음 변수를 설정하세요:
# VITE_SUPABASE_URL=your-supabase-project-url
# VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Environment Variables (환경변수 설정)

이 프로젝트는 Supabase를 백엔드로 사용합니다. 완전한 기능을 사용하려면 다음 환경변수가 필요합니다:

1. 프로젝트 루트에 `.env.local` 파일을 생성하세요
2. 다음 변수들을 추가하세요:

```env
# Supabase 설정
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI API (선택사항)
VITE_OPENAI_API_KEY=your-openai-api-key
```

### Supabase 설정 방법:

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. Settings → API에서 Project URL과 anon public key 복사
3. `.env.local` 파일에 해당 값들을 입력

⚠️ **주의**: 환경변수가 설정되지 않으면 Demo 모드로 실행됩니다.

### Demo 계정 (환경변수 없이 테스트)
- **이메일**: `kerow@hanmail.net`
- **비밀번호**: `1q2w3e$R`

### 환경변수 상태 확인
개발자 도구 콘솔에서 환경변수 설정 상태를 확인할 수 있습니다:
- ✅ 설정됨: 실제 Supabase 연동
- ❌ 설정되지 않음: Demo 모드 사용

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Backend)
- React Router
- React Query

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/e3bb5916-6d3e-4630-8636-bdddba2b8382) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

# Rich Way - 금융 교육 플랫폼

## 🚀 빠른 시작

### 로컬 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 브라우저에서 확인
open http://localhost:8080

### 📋 **포트 설정**
- **개발 서버**: `http://localhost:8080` (고정)
- **프리뷰 서버**: `http://localhost:4173` (빌드 후 확인용)

### 🔧 **유용한 스크립트**
```bash
npm run dev:check    # 서버 상태 확인
npm run dev:open     # 브라우저에서 자동 열기
npm run dev:start    # 개발 서버 시작
```
```

### 배포 전 로컬 검증

```bash
# 로컬 사전 배포 검증 (권장)
npm run check

# 개발 서버 검증 후 시작
npm run dev:check

# 개발 서버 검증 후 브라우저 자동 열기
npm run dev:open
```

## 🔄 GitFlow 워크플로우

이 프로젝트는 GitFlow 워크플로우를 사용하여 안정적인 개발과 배포를 관리합니다.

### 브랜치 구조

```
main (production)
├── develop (integration)
├── feature/* (개발)
├── release/* (릴리스 준비)
└── hotfix/* (긴급 수정)
```

### GitFlow 명령어

```bash
# 기능 개발
npm run gitflow:feature [feature-name]
npm run gitflow:feature-finish

# 릴리스 준비
npm run gitflow:release [version]
npm run gitflow:release-finish

# 긴급 수정
npm run gitflow:hotfix [version]
npm run gitflow:hotfix-finish

# 상태 확인
npm run gitflow:status
npm run gitflow:help
```

### 예시

```bash
# 사용자 인증 기능 개발
npm run gitflow:feature user-authentication
# ... 개발 작업 ...
npm run gitflow:feature-finish

# v1.2.0 릴리스 준비
npm run gitflow:release 1.2.0
# ... 릴리스 준비 ...
npm run gitflow:release-finish
```

자세한 내용은 [GitFlow 가이드](./GITFLOW_GUIDE.md)를 참조하세요.

## 📋 로컬 검증 워크플로우

운영 서버에 배포하기 전에 반드시 로컬에서 검증을 수행하세요.

### 1. 로컬 사전 배포 검증

```bash
npm run check
```

이 명령어는 다음을 수행합니다:
- ✅ 로컬 개발 서버 상태 확인
- ✅ 프로덕션 빌드 성공 여부 확인
- ✅ 프리뷰 서버 정상 작동 확인
- ✅ 린트 검사 (오류는 경고로 처리)
- ✅ TypeScript 타입 검사

### 2. 수동 검증 명령어

```bash
# 개발 서버 상태 확인
curl -I http://localhost:8080

# 프로덕션 빌드
npm run build

# 프리뷰 서버 시작 및 확인
npm run preview:check

# 린트 검사
npm run lint

# 타입 검사
npm run type-check
```

### 3. 권장 배포 워크플로우

1. **로컬 검증**: `npm run check`
2. **수동 확인**: 브라우저에서 http://localhost:8080 접속하여 기능 확인
3. **Git 커밋**: 변경사항 커밋
4. **운영 배포**: `npm run deploy:aws`

## 🚀 배포

### 운영 서버 배포

```bash
# 로컬 검증 후 배포 (권장)
npm run check && npm run deploy:aws

# 직접 배포
npm run deploy:aws
```

### 개발 서버 배포

```bash
npm run deploy:dev
```

## 🛠️ 개발 도구

### 스크립트

- `npm run dev` - 개발 서버 시작 (포트 8080)
- `npm run build` - 프로덕션 빌드
- `npm run preview` - 빌드 결과 미리보기
- `npm run lint` - 코드 린트 검사
- `npm run lint:fix` - 린트 오류 자동 수정
- `npm run type-check` - TypeScript 타입 검사

### 유틸리티

- `scripts/local-check.sh` - 로컬 사전 배포 검증
- `scripts/gitflow.sh` - GitFlow 워크플로우 관리
- `scripts/deploy-aws.sh` - AWS EC2 배포

## 📁 프로젝트 구조

```
rich-way/
├── src/
│   ├── components/     # React 컴포넌트
│   ├── pages/         # 페이지 컴포넌트
│   ├── hooks/         # 커스텀 훅
│   ├── lib/           # 유틸리티 라이브러리
│   └── utils/         # 유틸리티 함수
├── scripts/           # 배포 및 유틸리티 스크립트
├── public/            # 정적 파일
└── docs/              # 문서
```

## 🔧 기술 스택

- **Frontend**: React 18, TypeScript, Vite
- **UI**: TailwindCSS, Shadcn/ui
- **배포**: AWS EC2, Nginx
- **데이터베이스**: Supabase
- **인증**: Supabase Auth

## 📚 문서

- [개발 가이드](./DEVELOPMENT_GUIDE.md) - 상세한 개발 환경 설정 및 워크플로우
- [데이터베이스 마이그레이션 가이드](./MIGRATION_GUIDE.md) - DB 동기화 및 스키마 관리
- [GitFlow 워크플로우 가이드](./GITFLOW_GUIDE.md)
- [메모리 누수 방지 가이드](./MEMORY_LEAK_PREVENTION.md)
- [프로덕션 배포 가이드](./PRODUCTION_DEPLOYMENT.md)

## 🤝 기여하기

1. GitFlow 워크플로우를 따라 개발
2. 로컬 검증 후 Pull Request 생성
3. 코드 리뷰 후 병합

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

# RichWay - 부자되기 프로젝트

부자가 되기 위한 맞춤형 진단 및 교육 플랫폼

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경별 설정

#### **로컬 개발환경**
```bash
# 로컬 환경변수 설정
npm run env:local
# .env.local 파일을 편집하여 실제 Supabase 정보 입력
```

#### **개발 서버용**
```bash
# 개발 환경변수 설정
npm run env:dev
# .env.development 파일을 편집하여 실제 Supabase 정보 입력
```

#### **운영 서버용**
```bash
# 운영 환경변수 설정
npm run env:prod
# .env.production 파일을 편집하여 실제 Supabase 정보 입력
```

### 3. 개발 서버 실행
```bash
npm run dev
```

## 🗄️ 데이터베이스 설정

### 환경별 데이터베이스 분리

프로젝트는 로컬, 개발, 운영 환경별로 데이터베이스를 분리하여 관리합니다.

#### **환경별 설정**

| 환경 | 설정 파일 | Supabase 프로젝트 | URL | 용도 |
|------|-----------|-------------------|-----|------|
| 로컬 | `.env.local` | `rich-way-dev` | `localhost:8080` | 로컬 개발 |
| 개발 | `.env.development` | `rich-way-dev` | `dev.rich-way.co.kr` | 개발 서버 |
| 운영 | `.env.production` | `rich-way-prod` | `rich-way.co.kr` | 실제 서비스 |

#### **환경변수 구조**
```bash
# 로컬/개발 환경
VITE_SUPABASE_URL_DEV=https://your-dev-project-id.supabase.co
VITE_SUPABASE_ANON_KEY_DEV=your-dev-anon-key

# 운영 환경
VITE_SUPABASE_URL_PROD=https://your-prod-project-id.supabase.co
VITE_SUPABASE_ANON_KEY_PROD=your-prod-anon-key
```

### 데이터베이스 설정 가이드

#### **1. 개발용 Supabase 프로젝트 생성**
```bash
# 1. https://supabase.com 에서 새 프로젝트 생성
# 2. 프로젝트명: rich-way-dev
# 3. Settings > API에서 URL과 anon key 복사
```

#### **2. 환경변수 설정**
```bash
# 개발 환경변수 설정
npm run env:dev
# .env.development 파일에 실제 Supabase 정보 입력

# 로컬 환경변수 설정 (선택사항)
npm run env:local
# .env.local 파일에 실제 Supabase 정보 입력
```

#### **3. 데이터베이스 스키마 설정**
```bash
# 방법 1: 완전한 설정 (권장)
# 개발 Supabase Dashboard > SQL Editor에서 실행:
# scripts/setup-dev-database-complete.sql

# 방법 2: 단계별 설정
npm run db:setup
```

#### **4. 샘플 데이터 삽입**
```bash
# 자동 생성
./scripts/generate-sample-data.sh

# 수동 실행
# 개발 Supabase Dashboard > SQL Editor에서 실행:
# sql/dev_sample_data.sql
```

### 데이터베이스 스키마

주요 테이블:
- `members` - 회원 정보
- `mbti_diagnosis` - MBTI 진단 결과
- `finance_diagnosis` - 재무 진단 결과
- `expert_products` - 전문가 상품
- `coaching_applications` - 코칭 신청
- `community_posts` - 커뮤니티 게시글
- `community_comments` - 커뮤니티 댓글

## 🛠️ 개발 가이드

### 기술 스택
- **Frontend**: React + TypeScript + Vite
- **UI**: TailwindCSS + Shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: AWS S3

### 프로젝트 구조
```
src/
├── components/     # UI 컴포넌트
├── pages/         # 페이지 컴포넌트
├── hooks/         # 커스텀 훅
├── lib/           # 유틸리티 라이브러리
├── contexts/      # React Context
└── data/          # 정적 데이터
```

### 주요 기능
- **진단 시스템**: MBTI 진단, 재무 진단
- **마이페이지**: 진단 이력, 재무 요약
- **커뮤니티**: 게시글, 댓글 시스템
- **전문가 시스템**: 상품 등록, 코칭 신청
- **관리자 기능**: 사용자, 진단, 상품 관리

### 유용한 명령어

#### **환경변수 관리**
```bash
npm run env:dev      # 개발환경 설정 파일 생성
npm run env:local    # 로컬환경 설정 파일 생성
npm run env:prod     # 운영환경 설정 파일 생성
npm run env:check    # 환경변수 파일 확인
```

#### **데이터베이스 관리**
```bash
npm run db:sync      # 개발 DB 동기화 가이드
npm run db:migrate   # 스키마 마이그레이션 가이드
npm run db:extract   # 운영 DB 스키마 추출 가이드
npm run db:apply     # 개발 DB 스키마 적용 가이드
```

#### **개발 서버 관리**
```bash
npm run dev          # 로컬 개발 서버 (localhost:8080)
npm run dev:check    # 서버 상태 확인
npm run dev:open     # 브라우저 자동 열기
```

#### **배포**
```bash
npm run deploy:dev   # 개발 서버 배포 (dev.rich-way.co.kr)
npm run deploy:prod  # 운영 서버 배포 (rich-way.co.kr)
```

## 📦 배포

### 개발 환경
```bash
npm run dev
```

### 운영 환경
```bash
npm run build
npm run preview
```

## 🔧 유틸리티

### Git Flow
```bash
./scripts/gitflow.sh
```

### 데이터베이스 설정
```bash
./scripts/setup-dev-database.sh
```

## �� 라이선스

MIT License
