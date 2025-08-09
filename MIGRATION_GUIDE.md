# 🚀 개발서버 → 운영서버 DB 스키마 마이그레이션 가이드

## 📋 개요

이 가이드는 개발서버의 DB 스키마를 운영서버에 반영하면서 기존 데이터를 유지하는 안전한 마이그레이션 방법을 설명합니다.

## ⚠️ 중요 주의사항

1. **반드시 운영서버 데이터를 백업한 후 진행하세요**
2. **다운타임이 발생할 수 있으므로 서비스 중단 시간을 고려하세요**
3. **각 단계별로 검증을 진행하세요**
4. **운영서버에서 직접 실행하지 말고, 먼저 테스트 환경에서 검증하세요**

## 🎯 마이그레이션 목표

- ✅ 기존 운영 데이터 유지
- ✅ 개발서버의 최신 스키마 반영
- ✅ 안전한 백업 생성
- ✅ 데이터 정합성 검증

## 📁 생성된 파일들

마이그레이션 스크립트 실행 후 다음 파일들이 생성됩니다:

```
sql/
├── extract_dev_schema_for_prod.sql     # 개발서버 스키마 추출용
├── backup_prod_schema.sql              # 운영서버 백업용
├── migrate_dev_to_prod.sql             # 마이그레이션 실행용
└── validate_migration.sql              # 검증용
```

## 🔄 마이그레이션 단계

### 1단계: 개발서버 스키마 추출

1. **개발 Supabase Dashboard 접속**
   - https://supabase.com/dashboard
   - 개발 프로젝트 선택

2. **SQL Editor 열기**
   - 좌측 메뉴에서 'SQL Editor' 클릭
   - 'New query' 클릭

3. **스키마 추출 쿼리 실행**
   - `sql/extract_dev_schema_for_prod.sql` 내용 복사
   - SQL Editor에 붙여넣기
   - 'Run' 클릭

4. **결과 저장**
   - 각 쿼리 결과에서 CREATE TABLE 문 복사
   - `sql/dev_schema_extracted.sql` 파일로 저장

### 2단계: 운영서버 백업

1. **운영 Supabase Dashboard 접속**
   - https://supabase.com/dashboard
   - 운영 프로젝트 선택

2. **백업 스크립트 실행**
   - `sql/backup_prod_schema.sql` 내용 복사
   - SQL Editor에 붙여넣기
   - 'Run' 클릭

3. **백업 확인**
   - 백업 테이블들이 생성되었는지 확인
   - `backup_*` 테이블들이 정상 생성되었는지 확인

### 3단계: 스키마 마이그레이션

1. **마이그레이션 스크립트 실행**
   - `sql/migrate_dev_to_prod.sql` 내용 복사
   - SQL Editor에 붙여넣기
   - 'Run' 클릭

2. **단계별 확인**
   - 각 단계별로 오류가 없는지 확인
   - 백업 테이블들이 생성되었는지 확인

### 4단계: 검증

1. **검증 스크립트 실행**
   - `sql/validate_migration.sql` 내용 복사
   - SQL Editor에 붙여넣기
   - 'Run' 클릭

2. **결과 확인**
   - 모든 테이블과 데이터가 정상인지 확인
   - 새로 추가된 컬럼들이 정상 생성되었는지 확인
   - 인덱스와 제약조건이 정상인지 확인

## 🔍 검증 항목

### 데이터 정합성 검증

- [ ] 모든 테이블의 데이터 개수가 백업과 일치
- [ ] 새로 추가된 컬럼들이 정상 생성됨
- [ ] 인덱스가 정상 생성됨
- [ ] 제약조건이 정상 생성됨
- [ ] RLS 정책이 정상 적용됨

### 기능 테스트

- [ ] 회원가입/로그인 기능 정상 작동
- [ ] MBTI 진단 기능 정상 작동
- [ ] 재무 진단 기능 정상 작동
- [ ] 커뮤니티 기능 정상 작동
- [ ] 코칭 신청 기능 정상 작동

## 🚨 문제 발생 시 대처 방법

### 1. 마이그레이션 실패 시

```sql
-- 백업 테이블에서 데이터 복원
INSERT INTO members SELECT * FROM backup_members;
INSERT INTO experts SELECT * FROM backup_experts;
-- ... 기타 테이블들
```

### 2. 데이터 불일치 시

```sql
-- 데이터 개수 비교
SELECT 
    'members' as table_name,
    COUNT(*) as current_count,
    (SELECT COUNT(*) FROM backup_members) as backup_count
FROM members;
```

### 3. 스키마 문제 시

```sql
-- 테이블 구조 확인
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'members'
ORDER BY ordinal_position;
```

## 📞 지원

마이그레이션 중 문제가 발생하면:

1. **로그 확인**: Supabase Dashboard의 Logs 섹션에서 오류 로그 확인
2. **백업 활용**: 생성된 백업 테이블들을 활용하여 복원
3. **문서 참조**: 이 가이드의 문제 발생 시 대처 방법 참조

## ✅ 완료 체크리스트

- [ ] 개발서버 스키마 추출 완료
- [ ] 운영서버 백업 완료
- [ ] 마이그레이션 스크립트 실행 완료
- [ ] 검증 스크립트 실행 완료
- [ ] 데이터 정합성 확인 완료
- [ ] 기능 테스트 완료
- [ ] 백업 테이블 정리 (선택사항)

## 🎉 완료

모든 단계가 완료되면 개발서버의 최신 스키마가 운영서버에 성공적으로 반영되었습니다!

---

**마지막 업데이트**: 2024년 12월
**버전**: 1.0 