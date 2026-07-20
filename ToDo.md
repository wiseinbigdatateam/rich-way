# RichWayNew 개발 내역 정리 (ToDo)
# RichWayNew Development Summary (ToDo)

## 1. 프로젝트 구조 및 환경
- Vite + React + TypeScript + Supabase 기반 웹 프로젝트
- TailwindCSS, Shadcn, Radix 등 최신 UI/UX 프레임워크 적용

## 1. Project Structure & Environment
- Web project based on Vite + React + TypeScript + Supabase
- Modern UI/UX frameworks such as TailwindCSS, Shadcn, Radix applied

---

## 2. 관리자(Admin) 페이지
- **회원관리**
  - members 테이블 연동, 하드코딩 제거
  - 이름, 닉네임, 이메일, 전화번호, 가입일, 상태, 수정/삭제 기능
  - 상태 Badge 색상 정책 적용
  - 페이지네이션(10/50/100개, 중앙/오른쪽 정렬)

- **전문가관리**
  - experts 테이블 연동, 하드코딩 제거
  - 전문가명, 소속, 전문분야, 경력, 평점, 상태, 수정/삭제 기능
  - 수정 시 DB 최신 데이터 fetch, 모달 자동 반영
  - 추가/수정 분기, 비밀번호 미입력 시 기존 유지
  - 비밀번호 보기/숨기기, 안내문, 입력란 위치/정렬 개선
  - 페이지네이션(10/50/100개, 중앙/오른쪽 정렬)

- **코칭관리**
  - coaching_applications, experts, members 테이블 조인/매핑
  - 전문가명, 신청인, 신청날짜, 신청횟수(신규/2회 이상), 가격구분, 분야, 신청내용(모달), 첨부파일 등
  - 신청횟수 Badge(신규/2회 이상), 가격구분 Badge(무료/디럭스/프리미엄) 색상 구분
  - 진행상황 변경 시 DB 동기화
  - 페이지네이션(10/50/100개, 중앙/오른쪽 정렬)

## 2. Admin Page
- **Member Management**
  - Linked to members table, removed hardcoded data
  - Display name, nickname, email, phone, join date, status, edit/delete functions
  - Status badge color policy applied
  - Pagination (10/50/100 per page, center/right alignment)

- **Expert Management**
  - Linked to experts table, removed hardcoded data
  - Display expert name, company, field, career, rating, status, edit/delete functions
  - On edit, fetch latest DB data and auto-fill modal
  - Insert/update branch, keep password if not entered
  - Password show/hide toggle, guide text, input alignment improved
  - Pagination (10/50/100 per page, center/right alignment)

- **Coaching Management**
  - Join/mapping of coaching_applications, experts, members tables
  - Display expert name, applicant, date, application count (new/2+), price type, field, content (modal), attachments, etc.
  - Application count badge (new/2+), price type badge (free/deluxe/premium) color distinction
  - DB sync on status change
  - Pagination (10/50/100 per page, center/right alignment)

---

## 3. 공통 UI/UX
- 테이블/폼 입력란, 라벨, 안내문, 버튼 등 위치/정렬/간격 반복 개선
- 페이지네이션 컨트롤 중앙(번호/이전/다음), 오른쪽(개수 선택) 통일
- Badge 색상 정책(상태, 등급, 첨부파일 등) 일관 적용
- 모든 하드코딩 데이터 제거, DB 연동 실시간 동기화
- 입력값 한글 제한, 필수값 검증, array 컬럼 처리 등 실무적 문제 해결

## 3. Common UI/UX
- Repeatedly improved position/alignment/spacing of table/form inputs, labels, guides, buttons, etc.
- Unified pagination controls: center (page/prev/next), right (page size select)
- Consistent badge color policy (status, grade, attachment, etc.)
- Removed all hardcoded data, real-time DB sync
- Practical issues solved: Korean input restriction, required validation, array column handling, etc.

---

## 4. 기타
- Supabase 체이닝 타입 문제(as any로 우회) 해결
- 파일 업로드, 첨부파일 다운로드, 안내문 위치/문구, 컬럼명 변경 등 상세 요구 즉시 반영
- 헤더에 RichWay 로고 이미지 적용 및 크기 조정

## 4. Others
- Solved Supabase chaining type issue (workaround with as any)
- File upload, attachment download, guide text/position, column name change, etc. handled immediately
- RichWay logo image applied to header and size adjusted

---

**향후 추가/요구사항 발생 시 즉시 반영 가능한 구조로 유지 중**
**The structure is maintained for immediate reflection of future requests/requirements**

---

## 5. 진단 기능 개발 (최근 추가)
- **재무진단 페이지**
  - 개인정보, 자산정보, 지출정보, 수입정보 입력 폼 구현
  - 단계별 진행 표시 및 유효성 검증
  - 진단 결과 페이지로 자동 이동

- **재무진단 결과 페이지**
  - 진단 결과 시각화 (차원별 그래프, 요인별 그래프)
  - 재무 분석 로직 구현 (자산, 부채, 수입, 지출 분석)
  - Supabase `finance_diagnosis` 테이블에 결과 저장
  - 로그인 상태 확인 및 로그인 모달 연동
  - 저장 완료 후 마이페이지로 이동

- **MBTI 진단 결과 페이지**
  - MBTI 진단 결과 표시 및 분석
  - 성격 유형별 맞춤 정보 제공
  - Supabase `mbti_diagnosis` 테이블에 결과 저장

- **데이터베이스 설정**
  - `finance_diagnosis` 테이블 RLS(Row Level Security) 비활성화
  - `member_settings` 테이블 생성 (알림 설정용)
  - 기존 사용자들을 위한 기본 알림 설정 데이터 삽입

- **UI 컴포넌트**
  - 차원별 그래프 컴포넌트 (`dimension-graph.tsx`)
  - 요인별 그래프 컴포넌트 (`factors-graph.tsx`)
  - 재무 분석 로직 (`financeAnalysis.ts`)

- **데이터 파일**
  - 재무 분석 관련 데이터 (저축, 펜션, 보험, 자산성장전략 등)
  - MBTI 리포트 데이터 (`mbtiReports.ts`)

## 5. Diagnosis Feature Development (Recently Added)
- **Finance Diagnosis Page**
  - Personal info, asset info, expense info, income info input forms
  - Step-by-step progress display and validation
  - Automatic navigation to diagnosis result page

- **Finance Diagnosis Result Page**
  - Diagnosis result visualization (dimension graph, factors graph)
  - Financial analysis logic implementation (asset, debt, income, expense analysis)
  - Save results to Supabase `finance_diagnosis` table
  - Login status check and login modal integration
  - Navigate to mypage after saving

- **MBTI Diagnosis Result Page**
  - MBTI diagnosis result display and analysis
  - Personality type-specific customized information
  - Save results to Supabase `mbti_diagnosis` table

- **Database Configuration**
  - Disabled RLS(Row Level Security) for `finance_diagnosis` table
  - Created `member_settings` table (for notification settings)
  - Inserted default notification settings for existing users

- **UI Components**
  - Dimension graph component (`dimension-graph.tsx`)
  - Factors graph component (`factors-graph.tsx`)
  - Financial analysis logic (`financeAnalysis.ts`)

- **Data Files**
  - Financial analysis related data (savings, pension, insurance, asset growth strategies, etc.)
  - MBTI report data (`mbtiReports.ts`)

---

## 6. 배포 준비 (최근 추가)
- **GitHub Actions 워크플로우**
  - AWS S3 자동 배포 설정 (`deploy.yml`)
  - 빌드, 테스트, 배포 자동화

- **배포 스크립트**
  - EC2 배포용 스크립트 (`deploy-ec2.sh`)
  - Nginx 설정 및 PM2 프로세스 관리

- **수동 배포 가이드**
  - AWS S3 정적 웹사이트 호스팅 설정
  - CloudFront CDN 설정 (선택사항)
  - 도메인 연결 가이드

## 6. Deployment Preparation (Recently Added)
- **GitHub Actions Workflow**
  - AWS S3 automatic deployment configuration (`deploy.yml`)
  - Build, test, deployment automation

- **Deployment Scripts**
  - EC2 deployment script (`deploy-ec2.sh`)
  - Nginx configuration and PM2 process management

- **Manual Deployment Guide**
  - AWS S3 static website hosting setup
  - CloudFront CDN configuration (optional)
  - Domain connection guide 