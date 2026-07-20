# GitFlow 워크플로우 가이드

## 개요

이 프로젝트는 GitFlow 워크플로우를 사용하여 안정적인 개발과 배포를 관리합니다.

## 브랜치 구조

```
main (production)
├── develop (integration)
├── feature/* (개발)
├── release/* (릴리스 준비)
└── hotfix/* (긴급 수정)
```

### 브랜치 설명

- **main**: 프로덕션 환경에 배포되는 안정적인 코드
- **develop**: 다음 릴리스를 위한 통합 브랜치
- **feature/***: 새로운 기능 개발
- **release/***: 릴리스 준비 (버그 수정, 문서 업데이트 등)
- **hotfix/***: 프로덕션 긴급 수정

## 워크플로우

### 1. 기능 개발 (Feature Development)

```bash
# 1. 새로운 기능 브랜치 시작
./scripts/gitflow.sh feature-start [feature-name]

# 2. 개발 작업
# ... 코드 작성 ...

# 3. 커밋
git add .
git commit -m "feat: [기능 설명]"

# 4. 원격에 푸시 (선택사항)
git push origin feature/[feature-name]

# 5. 기능 완료
./scripts/gitflow.sh feature-finish
```

### 2. 릴리스 준비 (Release Preparation)

```bash
# 1. 릴리스 브랜치 시작
./scripts/gitflow.sh release-start [version]
# 예: ./scripts/gitflow.sh release-start 1.2.0

# 2. 릴리스 준비 작업
# - 버전 번호 업데이트
# - CHANGELOG 업데이트
# - 최종 테스트
# - 문서 업데이트

# 3. 커밋
git add .
git commit -m "release: v[version] 릴리스 준비"

# 4. 릴리스 완료
./scripts/gitflow.sh release-finish
```

### 3. 긴급 수정 (Hotfix)

```bash
# 1. 핫픽스 브랜치 시작
./scripts/gitflow.sh hotfix-start [version]
# 예: ./scripts/gitflow.sh hotfix-start 1.2.1

# 2. 긴급 수정 작업
# ... 버그 수정 ...

# 3. 커밋
git add .
git commit -m "hotfix: [수정 내용]"

# 4. 핫픽스 완료
./scripts/gitflow.sh hotfix-finish
```

## GitFlow 스크립트 사용법

### 기본 명령어

```bash
# 도움말
./scripts/gitflow.sh help

# 브랜치 상태 확인
./scripts/gitflow.sh status

# Feature 브랜치
./scripts/gitflow.sh feature-start [name]
./scripts/gitflow.sh feature-finish

# Release 브랜치
./scripts/gitflow.sh release-start [version]
./scripts/gitflow.sh release-finish

# Hotfix 브랜치
./scripts/gitflow.sh hotfix-start [version]
./scripts/gitflow.sh hotfix-finish
```

### 예시

```bash
# 사용자 인증 기능 개발
./scripts/gitflow.sh feature-start user-authentication
# ... 개발 작업 ...
./scripts/gitflow.sh feature-finish

# v1.2.0 릴리스 준비
./scripts/gitflow.sh release-start 1.2.0
# ... 릴리스 준비 ...
./scripts/gitflow.sh release-finish

# v1.2.1 긴급 수정
./scripts/gitflow.sh hotfix-start 1.2.1
# ... 긴급 수정 ...
./scripts/gitflow.sh hotfix-finish
```

## 커밋 메시지 규칙

### 형식
```
[type]: [description]

[optional body]

[optional footer]
```

### 타입
- **feat**: 새로운 기능
- **fix**: 버그 수정
- **docs**: 문서 변경
- **style**: 코드 포맷팅 (기능 변경 없음)
- **refactor**: 코드 리팩토링
- **test**: 테스트 추가/수정
- **chore**: 빌드 프로세스 또는 보조 도구 변경

### 예시
```bash
git commit -m "feat: 사용자 로그인 기능 추가"
git commit -m "fix: 로그인 폼 유효성 검사 오류 수정"
git commit -m "docs: API 문서 업데이트"
git commit -m "style: 코드 포맷팅 수정"
```

## 배포 워크플로우

### 개발 환경 배포
- `develop` 브랜치 → 개발 서버

### 프로덕션 환경 배포
- `main` 브랜치 → 프로덕션 서버
- 태그가 있는 커밋만 배포

### 배포 명령어
```bash
# 로컬 검증
npm run check

# 개발 환경 배포
npm run deploy:dev

# 프로덕션 환경 배포
npm run deploy:prod
```

## 브랜치 보호 규칙

### main 브랜치
- 직접 푸시 금지
- Pull Request 필수
- 코드 리뷰 필수
- CI/CD 통과 필수

### develop 브랜치
- 직접 푸시 금지
- Pull Request 권장
- 코드 리뷰 권장

## 태그 관리

### 태그 생성
- 릴리스 완료 시 자동 생성
- 형식: `v[version]` (예: v1.2.0)

### 태그 조회
```bash
# 모든 태그 조회
git tag

# 태그 상세 정보
git show v1.2.0
```

## 문제 해결

### 충돌 해결
1. 충돌 발생 시 브랜치에서 해결
2. 충돌 해결 후 커밋
3. GitFlow 스크립트 재실행

### 브랜치 삭제
```bash
# 로컬 브랜치 삭제
git branch -d [branch-name]

# 원격 브랜치 삭제
git push origin --delete [branch-name]
```

### 브랜치 복구
```bash
# 삭제된 브랜치 복구
git reflog
git checkout -b [branch-name] [commit-hash]
```

## 모범 사례

1. **작은 단위로 커밋**: 한 번에 하나의 변경사항만 커밋
2. **명확한 커밋 메시지**: 무엇을, 왜 변경했는지 명확히 작성
3. **정기적인 푸시**: 작업 중인 브랜치를 정기적으로 원격에 푸시
4. **코드 리뷰**: 모든 변경사항에 대해 코드 리뷰 진행
5. **테스트**: 배포 전 충분한 테스트 수행

## 팀 협업

### 브랜치 네이밍
- feature: `feature/[작업자명]-[기능명]`
- release: `release/v[version]`
- hotfix: `hotfix/v[version]`

### Pull Request
- 모든 변경사항은 Pull Request를 통해 병합
- 리뷰어 지정 필수
- CI/CD 통과 확인

### 코드 리뷰 체크리스트
- [ ] 코드가 요구사항을 만족하는가?
- [ ] 테스트가 충분한가?
- [ ] 문서가 업데이트되었는가?
- [ ] 성능에 영향을 주지 않는가?
- [ ] 보안 문제가 없는가? 