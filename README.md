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
