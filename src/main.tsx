import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { startMemoryMonitoring } from './utils/memoryLeakPrevention.ts'
import { setupProductionConsole, shouldEnableMemoryMonitoring } from './utils/productionUtils.ts'

// 운영 환경에서 콘솔로그 비활성화
setupProductionConsole();

// 개발 환경에서만 메모리 모니터링 시작
if (shouldEnableMemoryMonitoring()) {
  const stopMonitoring = startMemoryMonitoring(60000); // 1분마다 체크
  
  // 페이지 언로드 시 모니터링 중지
  window.addEventListener('beforeunload', () => {
    stopMonitoring();
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
