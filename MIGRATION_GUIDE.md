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