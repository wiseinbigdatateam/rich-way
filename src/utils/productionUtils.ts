/**
 * 운영 환경 유틸리티
 * 프로덕션 빌드에서 콘솔로그와 더미 데이터를 제거하는 도구들
 */

// 운영 환경 확인
export const isProduction = import.meta.env.PROD;
export const isDevelopment = import.meta.env.DEV;

// 운영 환경에서 콘솔로그 비활성화
export const setupProductionConsole = () => {
  if (isProduction) {
    // 모든 console 메서드 오버라이드
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    console.info = () => {};
    console.debug = () => {};
    
    // 전역 오류 핸들러도 조용히 처리
    window.onerror = () => true;
    window.addEventListener('error', () => {});
    window.addEventListener('unhandledrejection', () => {});
  }
};

// 더미 데이터 비활성화
export const isDemoModeEnabled = () => {
  return isDevelopment && !isProduction;
};

// 운영 환경에서 더미 데이터 대신 실제 데이터 사용
export const getDataMode = () => {
  if (isProduction) {
    return 'production';
  }
  return isDemoModeEnabled() ? 'demo' : 'development';
};

// 운영 환경에서 불필요한 기능 비활성화
export const shouldEnableFeature = (feature: string) => {
  const disabledFeatures = [
    'demoMode',
    'debugMode',
    'developmentTools',
    'mockData'
  ];
  
  if (isProduction && disabledFeatures.includes(feature)) {
    return false;
  }
  
  return true;
};

// 운영 환경에서 메모리 모니터링 비활성화
export const shouldEnableMemoryMonitoring = () => {
  return isDevelopment && !isProduction;
};

// 운영 환경에서 로깅 레벨 설정
export const getLogLevel = () => {
  if (isProduction) {
    return 'error'; // 에러만 로깅
  }
  return 'debug'; // 개발 환경에서는 모든 로그
};

// 운영 환경에서 성능 최적화 설정
export const getPerformanceConfig = () => {
  return {
    enableMemoryMonitoring: shouldEnableMemoryMonitoring(),
    enableDebugLogs: !isProduction,
    enableDemoMode: isDemoModeEnabled(),
    enableDevelopmentTools: !isProduction,
  };
}; 