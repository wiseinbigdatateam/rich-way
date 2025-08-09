# 🔄 데이터베이스 마이그레이션 가이드

## 📋 목차

1. [개요](#개요)
2. [환경별 데이터베이스 구조](#환경별-데이터베이스-구조)
3. [운영 DB → 개발 DB 동기화](#운영-db--개발-db-동기화)
4. [스키마 마이그레이션](#스키마-마이그레이션)
5. [샘플 데이터 관리](#샘플-데이터-관리)
6. [문제 해결](#문제-해결)

## 🎯 개요

이 가이드는 운영 데이터베이스의 스키마를 개발 데이터베이스로 동기화하는 방법을 설명합니다.

### **환경 분리 원칙**
- **운영 DB**: 실제 서비스 데이터 (손상 방지)
- **개발 DB**: 개발 및 테스트용 데이터
- **로컬 DB**: 개발자별 로컬 테스트 (개발 DB와 동일)

### **동기화 방식**
- **수동 동기화**: 운영 DB 변경 시 수동으로 개발 DB에 반영
- **스키마 추출**: 운영 DB에서 CREATE TABLE 문 추출
- **스키마 적용**: 개발 DB에 추출된 스키마 적용

## 🏗️ 환경별 데이터베이스 구조

### **데이터베이스 프로젝트**

| 환경 | Supabase 프로젝트 | 용도 | URL |
|------|-------------------|------|-----|
| 운영 | `rich-way-prod` | 실제 서비스 | `rich-way.co.kr` |
| 개발 | `rich-way-dev` | 개발/테스트 | `dev.rich-way.co.kr` |
| 로컬 | `rich-way-dev` | 로컬 개발 | `localhost:8080` |

### **주요 테이블**

```sql
-- 사용자 관리
members                    # 회원 정보
member_settings            # 회원 설정

-- 진단 시스템
mbti_diagnosis            # MBTI 진단 결과
finance_diagnosis         # 재무 진단 결과

-- 전문가 시스템
experts                   # 전문가 정보
expert_products           # 전문가 상품
coaching_applications     # 코칭 신청

-- 커뮤니티
community_posts           # 커뮤니티 게시글
community_comments        # 커뮤니티 댓글
community_post_likes      # 게시글 좋아요
community_comment_likes   # 댓글 좋아요

-- 기타
user_sessions             # 사용자 세션
```

## 🔄 운영 DB → 개발 DB 동기화

### **1단계: 전체 가이드 확인**

```bash
# 전체 동기화 가이드 실행
npm run db:sync
```

### **2단계: 단계별 가이드**

```bash
# 인터랙티브 마이그레이션 가이드
npm run db:migrate
```

### **3단계: 수동 동기화 과정**

#### **3-1. 운영 DB 스키마 추출**
```bash
# 스키마 추출 가이드
npm run db:extract
```

**수동 실행:**
1. 운영 Supabase Dashboard 접속
2. SQL Editor 열기
3. `scripts/export-production-schema.sql` 실행
4. 결과를 `sql/prod_schema.sql`로 저장

#### **3-2. 개발 DB 스키마 적용**
```bash
# 스키마 적용 가이드
npm run db:apply
```

**수동 실행:**
1. 개발 Supabase Dashboard 접속
2. SQL Editor 열기
3. `sql/prod_schema.sql` 실행
4. 또는 `scripts/setup-dev-database-complete.sql` 실행

#### **3-3. 샘플 데이터 삽입**
```bash
# 샘플 데이터 생성
./scripts/generate-sample-data.sh

# 수동 실행
# 개발 Supabase Dashboard > SQL Editor에서 실행:
# sql/dev_sample_data.sql
```

## 📋 스키마 마이그레이션

### **스키마 추출 스크립트**

`scripts/export-production-schema.sql` 파일은 다음 정보를 추출합니다:

1. **테이블 스키마**
   - CREATE TABLE 문
   - 컬럼 정의
   - 제약 조건

2. **인덱스 정보**
   - PRIMARY KEY
   - FOREIGN KEY
   - UNIQUE 제약

3. **RLS 정책**
   - Row Level Security 정책
   - 권한 설정

### **스키마 적용 스크립트**

`scripts/setup-dev-database-complete.sql` 파일은 다음을 수행합니다:

1. **테이블 생성**
   - 모든 필수 테이블 생성
   - 제약 조건 설정

2. **RLS 정책 설정**
   - 개발용 간단한 정책
   - 모든 사용자 허용

3. **샘플 데이터 삽입**
   - 테스트용 사용자
   - 진단 결과 샘플
   - 커뮤니티 게시글 샘플

### **마이그레이션 실행 예시**

```bash
# 1. 운영 DB에서 스키마 추출
# 운영 Supabase Dashboard > SQL Editor
# scripts/export-production-schema.sql 실행

# 2. 개발 DB에 스키마 적용
# 개발 Supabase Dashboard > SQL Editor
# scripts/setup-dev-database-complete.sql 실행

# 3. 샘플 데이터 생성
./scripts/generate-sample-data.sh

# 4. 연결 테스트
npm run dev
# 브라우저에서 http://localhost:8080 접속
```

## 📊 샘플 데이터 관리

### **샘플 데이터 생성**

```bash
# 자동 생성
./scripts/generate-sample-data.sh
```

### **생성되는 테스트 계정**

| 계정 | 이메일 | 비밀번호 | 역할 |
|------|--------|----------|------|
| 테스트사용자1 | `test1@example.com` | `password123` | 일반 사용자 |
| 테스트사용자2 | `test2@example.com` | `password123` | 일반 사용자 |
| 테스트사용자3 | `test3@example.com` | `password123` | 일반 사용자 |
| 전문가1 | `expert1@example.com` | `password123` | 전문가 |
| 전문가2 | `expert2@example.com` | `password123` | 전문가 |
| 관리자 | `admin@example.com` | `password123` | 관리자 |

### **샘플 데이터 내용**

- **진단 결과**: MBTI 진단 3개, 재무 진단 3개
- **커뮤니티**: 게시글 4개, 댓글 4개
- **전문가 상품**: 2개 상품
- **코칭 신청**: 3개 신청

### **샘플 데이터 수정**

`sql/dev_sample_data.sql` 파일을 편집하여 샘플 데이터를 수정할 수 있습니다.

## 🔧 문제 해결

### **일반적인 문제들**

#### **문제 1: 스키마 추출 실패**
```bash
# 해결 방법
# 1. 운영 DB 접근 권한 확인
# 2. SQL Editor 권한 확인
# 3. 스크립트 구문 오류 확인
```

#### **문제 2: 스키마 적용 실패**
```bash
# 해결 방법
# 1. 개발 DB 접근 권한 확인
# 2. 기존 테이블 충돌 확인
# 3. SQL 구문 오류 확인
```

#### **문제 3: 샘플 데이터 삽입 실패**
```bash
# 해결 방법
# 1. 테이블 존재 여부 확인
# 2. 외래키 제약 조건 확인
# 3. 데이터 형식 확인
```

#### **문제 4: 연결 테스트 실패**
```bash
# 해결 방법
# 1. 환경변수 설정 확인
npm run env:check

# 2. Supabase 프로젝트 상태 확인
# 3. 브라우저 콘솔 오류 확인
```

### **디버깅 명령어**

```bash
# 환경변수 확인
npm run env:check

# 데이터베이스 연결 확인
npm run db:sync

# 스키마 상태 확인
# Supabase Dashboard > Table Editor에서 테이블 목록 확인
```

### **로그 확인**

```bash
# 브라우저 개발자 도구 콘솔에서 확인:
# - Supabase 연결 상태
# - 환경변수 설정 상태
# - 데이터베이스 오류 메시지
```

## 📚 추가 자료

- [개발 가이드](./DEVELOPMENT_GUIDE.md)
- [Supabase 공식 문서](https://supabase.com/docs)
- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)

## 🤝 지원

마이그레이션 중 문제가 발생하면:

1. **로그 확인**: 브라우저 콘솔, Supabase Dashboard 로그
2. **문서 참조**: 위의 추가 자료들
3. **단계별 확인**: 각 단계별로 개별 테스트
4. **백업 활용**: 개발 DB 백업 후 재시도 

# 🗄️ 개발서버 → 운영서버 DB 스키마 마이그레이션 가이드

## 📋 개요
이 가이드는 개발서버의 최신 DB 스키마를 운영서버에 적용하는 방법을 설명합니다.

## ⚠️ 주의사항
- **백업 필수**: 운영서버 데이터를 반드시 백업 후 진행
- **다운타임 고려**: 스키마 변경 시 서비스 중단 가능성
- **데이터 손실 위험**: 기존 데이터와 호환성 확인 필요

## 🔄 단계별 진행

### 1단계: 개발서버 스키마 추출

#### 1-1. 개발 Supabase Dashboard 접속
1. https://supabase.com/dashboard 접속
2. 개발 프로젝트 선택
3. 좌측 메뉴에서 'SQL Editor' 클릭

#### 1-2. 테이블 목록 확인
SQL Editor에서 다음 쿼리 실행:
```sql
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

#### 1-3. 스키마 추출
`sql/extract_dev_schema.sql` 파일의 내용을 SQL Editor에 복사하여 실행:
- 각 테이블별 CREATE TABLE 문 생성
- 인덱스 정보 조회
- 제약조건 정보 조회

#### 1-4. 결과 저장
각 쿼리 결과를 복사하여 `sql/dev_schema_extracted.sql` 파일로 저장

### 2단계: 운영서버 백업

#### 2-1. 운영 Supabase Dashboard 접속
1. https://supabase.com/dashboard 접속
2. 운영 프로젝트 선택

#### 2-2. 현재 스키마 백업
SQL Editor에서 다음 쿼리 실행:
```sql
-- 현재 테이블 목록 백업
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

#### 2-3. 데이터 백업 (필요시)
중요한 데이터가 있다면 Export 기능을 사용하여 백업

### 3단계: 운영서버 스키마 적용

#### 3-1. 기존 테이블 삭제 (주의!)
```sql
-- 기존 테이블들을 순서대로 삭제
DROP TABLE IF EXISTS post_likes CASCADE;
DROP TABLE IF EXISTS community_comments CASCADE;
DROP TABLE IF EXISTS community_posts CASCADE;
DROP TABLE IF EXISTS coaching_applications CASCADE;
DROP TABLE IF EXISTS expert_products CASCADE;
DROP TABLE IF EXISTS experts CASCADE;
DROP TABLE IF EXISTS finance_diagnosis CASCADE;
DROP TABLE IF EXISTS mbti_diagnosis CASCADE;
DROP TABLE IF EXISTS member_settings CASCADE;
DROP TABLE IF EXISTS members CASCADE;
```

#### 3-2. 새 스키마 적용
1단계에서 추출한 CREATE TABLE 문들을 SQL Editor에 복사하여 실행

#### 3-3. 인덱스 및 제약조건 적용
1단계에서 추출한 인덱스와 제약조건 정보를 적용

### 4단계: 검증

#### 4-1. 테이블 생성 확인
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

#### 4-2. 컬럼 구조 확인
```sql
SELECT table_name, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
ORDER BY table_name, ordinal_position;
```

#### 4-3. 제약조건 확인
```sql
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type
FROM information_schema.table_constraints tc
WHERE tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;
```

### 5단계: 애플리케이션 테스트

#### 5-1. 로컬 테스트
```bash
npm run dev
# http://localhost:8080 접속하여 기능 테스트
```

#### 5-2. 개발 서버 테스트
```bash
./scripts/deploy-dev.sh
# http://dev.rich-way.co.kr 접속하여 기능 테스트
```

#### 5-3. 운영 서버 테스트
```bash
./scripts/deploy-prod.sh
# http://rich-way.co.kr 접속하여 기능 테스트
```

## 🚨 문제 해결

### 문제 1: 외래키 제약조건 오류
- 테이블 생성 순서 확인
- CASCADE 옵션 사용 고려

### 문제 2: 데이터 타입 불일치
- 기존 데이터와 새 스키마 호환성 확인
- 데이터 마이그레이션 스크립트 작성

### 문제 3: 인덱스 충돌
- 기존 인덱스 삭제 후 새 인덱스 생성

## 📞 지원
문제 발생 시 다음 정보를 준비하여 문의:
- 오류 메시지
- 실행한 SQL 쿼리
- 현재 스키마 상태
- 예상 결과와 실제 결과

## ✅ 체크리스트

- [ ] 개발서버 스키마 추출 완료
- [ ] 운영서버 백업 완료
- [ ] 기존 테이블 삭제 완료
- [ ] 새 스키마 적용 완료
- [ ] 인덱스 및 제약조건 적용 완료
- [ ] 스키마 검증 완료
- [ ] 로컬 테스트 완료
- [ ] 개발 서버 테스트 완료
- [ ] 운영 서버 테스트 완료 