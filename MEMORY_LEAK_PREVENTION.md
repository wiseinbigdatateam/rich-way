# 메모리 누수 방지 가이드

## 🔍 Heap 분석 결과 요약

**Heap-20250719T105200.heapsnapshot** 분석 결과:
- **총 메모리 사용량**: 45.96 GB
- **이벤트 리스너 누수**: addEventListener 14개, removeEventListener 4개
- **타이머 누수**: 설정된 타이머 6개, 정리된 타이머 3개
- **브라우저 확장 프로그램 메모리**: 17개 노드

## ✅ 구현된 메모리 누수 방지 기능

### 1. 메모리 누수 방지 유틸리티 (`src/utils/memoryLeakPrevention.ts`)

#### EventListenerManager 클래스
- 이벤트 리스너 자동 추적 및 정리
- 안전한 이벤트 리스너 제거
- 타입별 이벤트 리스너 관리

#### TimerManager 클래스
- 타이머 자동 추적 및 정리
- 안전한 타이머 제거
- 타입별 타이머 관리

#### 안전한 함수들
- `safeAddEventListener`: 안전한 이벤트 리스너 추가
- `safeSetTimeout`: 안전한 setTimeout 설정
- `safeSetInterval`: 안전한 setInterval 설정
- `monitorMemoryUsage`: 메모리 사용량 모니터링

### 2. 개선된 컴포넌트들

#### useScrollAnimation 훅
```typescript
// 이전: 단순한 observer 정리
// 개선: ref를 통한 안전한 observer 관리
const observerRef = useRef<IntersectionObserver | null>(null);
```

#### YouTubePlayer 컴포넌트
```typescript
// 이전: 단순한 message 이벤트 리스너
// 개선: ref를 통한 안전한 리스너 관리
const messageListenerRef = useRef<((event: MessageEvent) => void) | null>(null);
```

#### AuthContext
```typescript
// 이전: 단순한 subscription 관리
// 개선: ref와 mounted 상태를 통한 안전한 관리
const subscriptionRef = useRef<any>(null);
const isMountedRef = useRef(true);
```

#### use-mobile 훅
```typescript
// 이전: 단순한 media query 리스너
// 개선: 안전한 이벤트 리스너 추가
const removeListener = safeAddEventListener(mql, "change", onChange);
```

#### use-toast 훅
```typescript
// 추가: 페이지 언로드 시 모든 타이머 정리
export const clearAllToastTimeouts = () => {
  toastTimeouts.forEach((timeout) => {
    clearTimeout(timeout);
  });
  toastTimeouts.clear();
};
```

### 3. 전역 메모리 모니터링

#### main.tsx
```typescript
// 개발 환경에서 메모리 모니터링 시작
if (import.meta.env.DEV) {
  const stopMonitoring = startMemoryMonitoring(60000); // 1분마다 체크
  
  // 페이지 언로드 시 모니터링 중지
  window.addEventListener('beforeunload', () => {
    stopMonitoring();
  });
}
```

## 🛠️ 메모리 누수 방지 패턴

### 1. useEffect Cleanup 패턴
```typescript
useEffect(() => {
  // 리소스 설정
  const cleanup = () => {
    // 리소스 정리
  };
  
  return cleanup;
}, []);
```

### 2. Ref를 통한 안전한 관리
```typescript
const resourceRef = useRef<ResourceType | null>(null);

useEffect(() => {
  // 리소스 생성
  resourceRef.current = new Resource();
  
  return () => {
    // 안전한 정리
    if (resourceRef.current) {
      resourceRef.current.cleanup();
      resourceRef.current = null;
    }
  };
}, []);
```

### 3. Mounted 상태 확인
```typescript
const isMountedRef = useRef(true);

useEffect(() => {
  return () => {
    isMountedRef.current = false;
  };
}, []);

// 상태 업데이트 시 확인
if (isMountedRef.current) {
  setState(newValue);
}
```

## 📋 메모리 누수 방지 체크리스트

### 개발 시 주의사항
- [ ] 모든 useEffect에 cleanup 함수 추가
- [ ] 이벤트 리스너는 `safeAddEventListener` 사용
- [ ] 타이머는 `safeSetTimeout`/`safeSetInterval` 사용
- [ ] 외부 리소스는 ref로 관리
- [ ] 컴포넌트 언마운트 시 모든 리소스 정리

### 코드 리뷰 시 확인사항
- [ ] 이벤트 리스너 정리 로직 확인
- [ ] 타이머 정리 로직 확인
- [ ] 외부 API 호출 정리 로직 확인
- [ ] 메모리 누수 방지 유틸리티 사용 여부 확인

### 테스트 시 확인사항
- [ ] 컴포넌트 마운트/언마운트 반복 시 메모리 증가 확인
- [ ] 페이지 이동 시 메모리 정리 확인
- [ ] 개발자 도구 Memory 탭에서 메모리 누수 확인

## 🚀 추가 개선 방안

### 1. 브라우저 확장 프로그램 관리
- 개발 중 불필요한 확장 프로그램 비활성화
- React DevTools 프로덕션 환경에서 비활성화

### 2. 메모리 모니터링 강화
- 프로덕션 환경에서 메모리 사용량 추적
- 메모리 임계값 초과 시 알림 시스템

### 3. 자동화된 메모리 누수 감지
- CI/CD 파이프라인에 메모리 누수 테스트 추가
- 정기적인 메모리 사용량 분석

## 📊 성능 모니터링

### 메모리 사용량 확인 방법
```javascript
// 브라우저 콘솔에서 실행
if ('memory' in performance) {
  const memory = performance.memory;
  console.log('메모리 사용량:', {
    used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
    total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
    limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
  });
}
```

### Chrome DevTools 사용법
1. **Memory 탭**에서 Heap 스냅샷 생성
2. **Performance 탭**에서 메모리 사용량 추적
3. **Coverage 탭**에서 사용하지 않는 코드 확인

## 🎯 결론

이 가이드를 통해 구현된 메모리 누수 방지 시스템은:
- **이벤트 리스너 누수** 해결
- **타이머 누수** 해결
- **외부 리소스 누수** 해결
- **개발 환경 모니터링** 제공

지속적인 모니터링과 코드 리뷰를 통해 메모리 누수를 사전에 방지할 수 있습니다. 