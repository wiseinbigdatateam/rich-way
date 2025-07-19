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

# Rich Way - 부자플랫폼

부자플랫폼 리치웨이는 개인 맞춤형 금융 진단과 교육을 제공하는 웹 애플리케이션입니다.

## 🚀 빠른 시작

### 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

개발 서버는 `http://localhost:8080`에서 실행됩니다.

## 📋 로컬 확인 워크플로우

운영서버 배포 전에 반드시 로컬에서 확인하세요!

### 1. 로컬 체크리스트 실행

```bash
# 모든 체크를 한번에 실행
npm run check
```

이 명령어는 다음을 확인합니다:
- ✅ 로컬 개발 서버 상태
- ✅ 프로덕션 빌드 테스트
- ✅ 프리뷰 서버 확인
- ✅ 코드 린트 검사 (선택사항)
- ✅ TypeScript 타입 검사

### 2. 수동 확인 방법

```bash
# 개발 서버 상태 확인
npm run dev:check

# 브라우저에서 개발 서버 열기
npm run dev:open

# 프로덕션 빌드 테스트
npm run build:check

# 프리뷰 서버로 배포 전 확인
npm run deploy:preview:open
```

### 3. 배포 전 권장 순서

1. **로컬 개발 서버에서 확인**
   ```bash
   npm run dev:open
   ```
   - 모든 기능이 정상 작동하는지 확인
   - 반응형 디자인 테스트 (모바일, 태블릿, 데스크톱)

2. **프로덕션 빌드 확인**
   ```bash
   npm run deploy:preview:open
   ```
   - 실제 배포될 버전을 로컬에서 미리 확인
   - 성능과 기능 테스트

3. **최종 체크리스트 실행**
   ```bash
   npm run check
   ```
   - 모든 항목이 통과하는지 확인

4. **운영서버 배포**
   ```bash
   npm run deploy:prod:build
   ```

## 🚀 배포

### 테스트 서버 배포

```bash
# 테스트 서버에 배포 (빌드 포함)
npm run deploy:dev:build

# 테스트 서버에 배포 (빌드 없이)
npm run deploy:dev
```

### 운영서버 배포

```bash
# 운영서버에 배포 (빌드 포함) - 권장
npm run deploy:prod:build

# 운영서버에 배포 (빌드 없이)
npm run deploy:prod
```

## 🛠️ 개발 도구

### 유용한 명령어들

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 린트 검사
npm run lint

# 린트 자동 수정
npm run lint:fix

# 타입 검사
npm run type-check

# 프리뷰 서버
npm run preview
```

### 브라우저 확인

- **개발 서버**: http://localhost:8080
- **프리뷰 서버**: http://localhost:4173
- **테스트 서버**: http://test.rich-way.co.kr
- **운영 서버**: http://rich-way.co.kr

## 📁 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── ui/             # UI 컴포넌트 (shadcn/ui)
│   ├── admin/          # 관리자 페이지 컴포넌트
│   └── mypage/         # 마이페이지 컴포넌트
├── pages/              # 페이지 컴포넌트
├── contexts/           # React Context
├── hooks/              # Custom Hooks
├── lib/                # 유틸리티 라이브러리
├── data/               # 정적 데이터
└── utils/              # 유틸리티 함수
```

## 🔧 기술 스택

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: TailwindCSS, shadcn/ui
- **Routing**: React Router
- **State Management**: React Context
- **Backend**: Supabase
- **Deployment**: AWS EC2, Nginx

## 📝 주의사항

### 배포 전 체크리스트

- [ ] 로컬 개발 서버에서 모든 기능 테스트
- [ ] 반응형 디자인 확인 (모바일, 태블릿, 데스크톱)
- [ ] 프로덕션 빌드 테스트
- [ ] 프리뷰 서버에서 최종 확인
- [ ] 린트 오류 확인 (선택사항)
- [ ] TypeScript 타입 검사 통과

### 권장 개발 워크플로우

1. **개발**: `npm run dev`로 로컬 개발
2. **테스트**: `npm run check`로 전체 체크
3. **프리뷰**: `npm run deploy:preview:open`으로 배포 전 확인
4. **배포**: `npm run deploy:prod:build`로 운영서버 배포

이 워크플로우를 따르면 배포 전에 문제를 미리 발견하고 해결할 수 있습니다!
