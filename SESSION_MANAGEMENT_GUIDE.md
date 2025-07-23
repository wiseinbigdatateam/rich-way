# 세션 관리 시스템 가이드

## 개요

RichWay 웹사이트의 새로운 세션 관리 시스템은 사용자 로그인 상태를 안전하고 효율적으로 관리합니다. 이 시스템은 토큰 기반 인증, 자동 로그인, 세션 만료 처리 등의 기능을 제공합니다.

## 주요 기능

### 1. 토큰 기반 인증
- **접근 토큰 (Access Token)**: 사용자 인증을 위한 임시 토큰
- **갱신 토큰 (Refresh Token)**: 토큰 갱신을 위한 토큰
- **만료 시간 관리**: 24시간 자동 만료

### 2. 자동 로그인
- 브라우저 새로고침 시에도 로그인 상태 유지
- 토큰 유효성 자동 검증
- 만료 임박 시 자동 갱신

### 3. 세션 만료 처리
- 30분 전 경고 알림
- 자동 토큰 갱신
- 만료 시 자동 로그아웃

### 4. 사용자 타입별 관리
- **member**: 일반 회원
- **expert**: 전문가
- **admin**: 관리자

## 사용법

### 1. 로그인 처리

```typescript
import { useAuth } from '@/contexts/AuthContext';

const LoginComponent = () => {
  const { login } = useAuth();
  
  const handleLogin = (userData) => {
    // 사용자 타입 지정 (기본값: 'member')
    login(userData, 'expert'); // 전문가 로그인
  };
};
```

### 2. 로그아웃 처리

```typescript
import { useAuth } from '@/contexts/AuthContext';

const LogoutComponent = () => {
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout(); // 모든 세션 정보 정리
  };
};
```

### 3. 세션 상태 확인

```typescript
import { getSessionStatus } from '@/utils/sessionManager';

const SessionInfo = () => {
  const status = getSessionStatus();
  
  console.log('인증 상태:', status.isAuthenticated);
  console.log('사용자 타입:', status.userType);
  console.log('남은 시간:', status.timeUntilExpiry);
  console.log('갱신 필요:', status.needsRefresh);
};
```

### 4. 세션 갱신

```typescript
import { useAuth } from '@/contexts/AuthContext';

const RefreshComponent = () => {
  const { refreshSession } = useAuth();
  
  const handleRefresh = async () => {
    const success = await refreshSession();
    if (success) {
      console.log('세션 갱신 성공');
    } else {
      console.log('세션 갱신 실패');
    }
  };
};
```

## 컴포넌트

### SessionExpiryAlert

세션이 곧 만료될 때 사용자에게 알림을 표시하는 컴포넌트입니다.

```typescript
import SessionExpiryAlert from '@/components/SessionExpiryAlert';

// 기본 사용법 (30분 전 경고)
<SessionExpiryAlert />

// 사용자 정의 경고 시간 (15분 전)
<SessionExpiryAlert warningMinutes={15} />
```

## 유틸리티 함수

### createAndStoreToken
토큰을 생성하고 저장합니다.

```typescript
import { createAndStoreToken } from '@/utils/sessionManager';

const token = createAndStoreToken(
  'user123',
  'expert',
  {
    name: '홍길동',
    email: 'hong@example.com',
    avatar: 'https://example.com/avatar.jpg'
  }
);
```

### validateToken
토큰의 유효성을 검증합니다.

```typescript
import { validateToken } from '@/utils/sessionManager';

const isValid = validateToken();
if (isValid) {
  console.log('토큰이 유효합니다');
} else {
  console.log('토큰이 만료되었습니다');
}
```

### checkAutoLogin
자동 로그인 가능 여부를 확인합니다.

```typescript
import { checkAutoLogin } from '@/utils/sessionManager';

const session = await checkAutoLogin();
if (session) {
  console.log('자동 로그인 가능:', session);
} else {
  console.log('자동 로그인 불가능');
}
```

### clearSession
모든 세션 정보를 정리합니다.

```typescript
import { clearSession } from '@/utils/sessionManager';

clearSession(); // 모든 인증 정보 삭제
```

## 보안 고려사항

### 1. 토큰 보안
- 토큰은 localStorage에 저장되지만 실제 프로덕션에서는 httpOnly 쿠키 사용 권장
- 토큰 만료 시간을 적절히 설정하여 보안 강화

### 2. 세션 관리
- 정기적인 토큰 갱신으로 세션 보안 유지
- 로그아웃 시 모든 토큰 정보 완전 삭제

### 3. 에러 처리
- 네트워크 오류 시 적절한 폴백 처리
- 토큰 갱신 실패 시 자동 로그아웃

## 마이그레이션 가이드

### 기존 시스템과의 호환성

새로운 세션 관리 시스템은 기존 시스템과 완전히 호환됩니다:

1. **기존 로그인 방식 유지**: 기존 localStorage 기반 인증도 계속 작동
2. **점진적 마이그레이션**: 새로운 시스템을 선택적으로 적용 가능
3. **하위 호환성**: 기존 코드 수정 없이 새로운 기능 사용 가능

### 마이그레이션 단계

1. **1단계**: 새로운 세션 관리 시스템 설치
2. **2단계**: 로그인/로그아웃 함수에 새로운 시스템 통합
3. **3단계**: 세션 상태 확인 로직 업데이트
4. **4단계**: 기존 localStorage 기반 코드 제거 (선택사항)

## 문제 해결

### 일반적인 문제

1. **토큰 만료 오류**
   - `refreshToken()` 함수로 토큰 갱신 시도
   - 갱신 실패 시 재로그인 안내

2. **자동 로그인 실패**
   - `checkAutoLogin()` 함수로 세션 상태 확인
   - 세션 정보 손상 시 `clearSession()` 후 재로그인

3. **세션 상태 불일치**
   - `getSessionStatus()` 함수로 현재 상태 확인
   - 필요 시 `clearSession()` 후 재로그인

### 디버깅

```typescript
import { getSessionStatus, getTimeUntilExpiry } from '@/utils/sessionManager';

// 세션 상태 디버깅
const debugSession = () => {
  const status = getSessionStatus();
  const timeLeft = getTimeUntilExpiry();
  
  console.log('세션 상태:', status);
  console.log('남은 시간:', timeLeft, '분');
};
```

## 향후 개선 계획

1. **JWT 토큰 구현**: 더 안전한 토큰 기반 인증
2. **서버 사이드 세션 관리**: Redis 등을 활용한 세션 저장
3. **다중 디바이스 지원**: 동시 로그인 관리
4. **세션 활동 모니터링**: 사용자 활동 추적 및 보안 강화 