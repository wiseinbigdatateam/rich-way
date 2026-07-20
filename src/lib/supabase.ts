import { createClient } from '@supabase/supabase-js';

// 환경별 Supabase 설정
const getSupabaseConfig = () => {
  // 환경 감지: URL 기반으로 환경 판단
  const currentUrl = window.location.hostname;
  const isDevelopment = currentUrl === 'localhost' || currentUrl === 'dev.rich-way.co.kr';
  const isProduction = currentUrl === 'rich-way.co.kr';
  
  console.log('🌐 현재 URL:', currentUrl);
  console.log('🔧 환경 감지:', isDevelopment ? '개발' : isProduction ? '운영' : '기타');
  
  if (isDevelopment) {
    // 개발 환경 (localhost 또는 dev.rich-way.co.kr)
    const devUrl = import.meta.env.VITE_SUPABASE_URL_DEV;
    const devKey = import.meta.env.VITE_SUPABASE_ANON_KEY_DEV;
    
    if (devUrl && devKey && devUrl !== 'https://your-dev-project-id.supabase.co') {
      return {
        url: devUrl,
        key: devKey,
        environment: 'development'
      };
    }
  }
  
  if (isProduction) {
    // 운영 환경 (rich-way.co.kr)
    const prodUrl = import.meta.env.VITE_SUPABASE_URL_PROD;
    const prodKey = import.meta.env.VITE_SUPABASE_ANON_KEY_PROD;
    
    if (prodUrl && prodKey) {
      return {
        url: prodUrl,
        key: prodKey,
        environment: 'production'
      };
    }
  }
  
  // 기본값 (운영 환경)
  const prodUrl = import.meta.env.VITE_SUPABASE_URL_PROD;
  const prodKey = import.meta.env.VITE_SUPABASE_ANON_KEY_PROD;
  
  if (prodUrl && prodKey) {
    return {
      url: prodUrl,
      key: prodKey,
      environment: 'production'
    };
  }
  
  return null;
};

const config = getSupabaseConfig();

// 환경변수 체크 및 디버깅 정보
console.log('🔧 Supabase 환경 설정:');
console.log('   현재 URL:', window.location.hostname);
console.log('   감지된 환경:', config ? `✅ ${config.environment}` : '❌ 설정되지 않음');

if (config) {
  console.log('   연결 URL:', config.url);
  console.log('   API Key:', config.key ? '✅ 설정됨' : '❌ 설정되지 않음');
  
  // 환경별 구분
  if (config.environment === 'development') {
    console.log('   🟡 개발 환경: 개발 DB에 연결됨');
  } else if (config.environment === 'production') {
    console.log('   🟢 운영 환경: 운영 DB에 연결됨');
  }
} else {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다.');
  console.error('📋 환경별 설정 방법:');
  console.error('   개발: VITE_SUPABASE_URL_DEV, VITE_SUPABASE_ANON_KEY_DEV');
  console.error('   운영: VITE_SUPABASE_URL_PROD, VITE_SUPABASE_ANON_KEY_PROD');
  throw new Error('Supabase 환경변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
}

// Supabase 클라이언트 생성
export const supabase = createClient(config!.url, config!.key, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// 환경변수 상태 export
export const isSupabaseConfigured = true;
export const currentEnvironment = config!.environment; 