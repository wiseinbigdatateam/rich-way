# RichWay 플랫폼 새로운 데이터베이스 설계

## 📋 개요

기존 데이터베이스 구조의 문제점을 해결하고 확장 가능한 새로운 스키마를 설계했습니다. 이 설계는 현대적인 데이터베이스 설계 원칙을 따르며, 성능, 확장성, 유지보수성을 모두 고려했습니다.

## 🎯 주요 개선사항

### 1. 일관된 ID 체계
- **기존**: UUID와 VARCHAR 혼재 사용
- **개선**: 모든 테이블에서 UUID 통일 사용
- **장점**: 보안성 향상, 확장성 개선

### 2. 정규화된 사용자 관리
- **기존**: 단일 members 테이블에 모든 정보
- **개선**: 
  - `users`: 기본 사용자 정보
  - `user_auth_providers`: 소셜 로그인 정보
  - `user_roles`: 역할 및 권한 관리
- **장점**: 유연한 인증 시스템, 세밀한 권한 관리

### 3. 확장 가능한 진단 시스템
- **기존**: 각 진단별로 별도 테이블 (mbti_diagnosis, finance_diagnosis)
- **개선**:
  - `diagnosis_categories`: 진단 카테고리 관리
  - `diagnosis_results`: 통합된 진단 결과 저장 (JSONB 활용)
- **장점**: 새로운 진단 유형 쉽게 추가 가능

### 4. 통합된 좋아요 시스템
- **기존**: post_likes 테이블만 존재
- **개선**: `likes` 테이블로 게시글, 댓글 등 모든 대상에 적용
- **장점**: 확장성과 일관성 향상

### 5. 교육 시스템 추가
- `education_categories`: 교육 카테고리
- `education_content`: 교육 콘텐츠
- `user_learning_progress`: 학습 진행도 추적
- **장점**: 체계적인 교육 콘텐츠 관리

### 6. 알림 시스템
- `notification_templates`: 알림 템플릿 관리
- `user_notifications`: 사용자별 알림
- **장점**: 다양한 알림 유형 지원

## 🏗️ 테이블 구조

### 핵심 테이블

#### 1. 사용자 관리
```sql
users                    -- 기본 사용자 정보
├── user_auth_providers  -- 소셜 로그인 정보
└── user_roles          -- 역할 및 권한
```

#### 2. 전문가 시스템
```sql
experts                 -- 전문가 기본 정보
└── expert_details      -- 확장 가능한 상세 정보
```

#### 3. 상품 및 서비스
```sql
product_categories      -- 상품 카테고리
└── products           -- 상품 정보
```

#### 4. 코칭 시스템
```sql
coaching_applications   -- 코칭 신청
└── coaching_sessions   -- 코칭 세션
```

#### 5. 진단 시스템
```sql
diagnosis_categories    -- 진단 카테고리
└── diagnosis_results   -- 진단 결과 (JSONB)
```

#### 6. 커뮤니티
```sql
community_categories    -- 커뮤니티 카테고리
├── community_posts     -- 게시글
├── community_comments  -- 댓글 (대댓글 지원)
└── likes              -- 좋아요 (통합)
```

#### 7. 교육 시스템
```sql
education_categories    -- 교육 카테고리
├── education_content   -- 교육 콘텐츠
└── user_learning_progress -- 학습 진행도
```

#### 8. 알림 시스템
```sql
notification_templates  -- 알림 템플릿
└── user_notifications  -- 사용자 알림
```

## 🚀 성능 최적화

### 인덱스 전략
- **조회 성능**: 자주 조회되는 컬럼에 인덱스 생성
- **복합 인덱스**: 여러 조건을 동시에 사용하는 쿼리 최적화
- **부분 인덱스**: 활성 상태인 데이터만 인덱싱

### JSONB 활용
- **진단 결과**: 유연한 데이터 구조 저장
- **검색 성능**: GIN 인덱스로 빠른 검색
- **확장성**: 새로운 필드 추가 용이

## 🔒 보안 및 권한 관리

### Row Level Security (RLS)
- **사용자별 접근 제어**: 자신의 데이터만 접근 가능
- **역할별 권한**: admin, expert, member 구분
- **공개 데이터**: 커뮤니티 게시글 등은 모든 사용자 접근 가능

### 권한 체계
```sql
-- 사용자 역할
admin    -- 전체 관리 권한
expert   -- 전문가 기능 사용
member   -- 일반 회원 기능
```

## 📊 데이터 마이그레이션

### 마이그레이션 단계
1. **백업**: 기존 데이터 임시 테이블에 백업
2. **스키마 생성**: 새로운 테이블 구조 생성
3. **데이터 변환**: 기존 데이터를 새 구조로 변환
4. **검증**: 데이터 무결성 확인
5. **정리**: 임시 테이블 삭제

### 주의사항
- **백업 필수**: 마이그레이션 전 반드시 데이터 백업
- **단계별 실행**: 각 단계별로 검증 후 다음 단계 진행
- **롤백 계획**: 문제 발생 시 복구 방안 준비

## 🔧 개발 가이드

### 새로운 사용자 생성
```sql
-- 1. 사용자 기본 정보 생성
INSERT INTO users (email, name, phone) 
VALUES ('user@example.com', '홍길동', '010-1234-5678');

-- 2. 소셜 로그인 정보 추가
INSERT INTO user_auth_providers (user_id, provider, provider_user_id)
VALUES (user_id, 'kakao', 'kakao_user_id');

-- 3. 역할 부여
INSERT INTO user_roles (user_id, role)
VALUES (user_id, 'member');
```

### 진단 결과 저장
```sql
-- 진단 결과 저장 (JSONB 활용)
INSERT INTO diagnosis_results (user_id, category_id, result_data, score)
VALUES (
    user_id,
    category_id,
    '{"mbti_type": "INTJ", "answers": {...}, "description": "..."}'::jsonb,
    85
);
```

### 좋아요 처리
```sql
-- 게시글 좋아요
INSERT INTO likes (user_id, target_type, target_id)
VALUES (user_id, 'post', post_id);

-- 댓글 좋아요
INSERT INTO likes (user_id, target_type, target_id)
VALUES (user_id, 'comment', comment_id);
```

## 📈 확장성 고려사항

### 수평 확장
- **파티셔닝**: 대용량 테이블 분할 가능
- **샤딩**: 사용자별 데이터 분산 저장
- **읽기 전용 복제**: 조회 성능 향상

### 기능 확장
- **새로운 진단 유형**: diagnosis_categories에 추가
- **다양한 상품 유형**: product_categories 확장
- **알림 채널**: notification_templates 확장

## 🛠️ 유지보수

### 정기 작업
- **인덱스 재구성**: 데이터 증가에 따른 인덱스 최적화
- **통계 업데이트**: 쿼리 플래너 최적화
- **백업**: 정기적인 데이터 백업

### 모니터링
- **성능 모니터링**: 느린 쿼리 감지
- **용량 관리**: 테이블 크기 및 인덱스 크기 추적
- **보안 감사**: 접근 로그 분석

## 📝 마이그레이션 체크리스트

### 사전 준비
- [ ] 데이터베이스 백업
- [ ] 애플리케이션 중단 계획
- [ ] 롤백 계획 수립
- [ ] 테스트 환경에서 검증

### 마이그레이션 실행
- [ ] 임시 테이블 생성 및 데이터 백업
- [ ] 새로운 스키마 생성
- [ ] 데이터 변환 및 마이그레이션
- [ ] 인덱스 및 트리거 생성
- [ ] RLS 정책 설정

### 사후 검증
- [ ] 데이터 무결성 확인
- [ ] 애플리케이션 기능 테스트
- [ ] 성능 테스트
- [ ] 임시 테이블 정리

## 🎉 결론

새로운 데이터베이스 설계는 다음과 같은 이점을 제공합니다:

1. **확장성**: 새로운 기능 추가가 용이
2. **성능**: 최적화된 인덱스와 쿼리 구조
3. **보안**: 세밀한 권한 관리와 RLS
4. **유지보수성**: 명확한 구조와 일관된 네이밍
5. **유연성**: JSONB를 활용한 유연한 데이터 저장

이 설계를 통해 RichWay 플랫폼의 안정성과 확장성을 크게 향상시킬 수 있습니다. 