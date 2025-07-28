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
  
  // 기존 설정은 더 이상 사용하지 않음 (환경별 분리 완료)
  
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
  console.warn('⚠️ Supabase 환경변수가 설정되지 않았습니다.');
  console.warn('📋 환경별 설정 방법:');
  console.warn('   개발: VITE_SUPABASE_URL_DEV, VITE_SUPABASE_ANON_KEY_DEV');
  console.warn('   운영: VITE_SUPABASE_URL_PROD, VITE_SUPABASE_ANON_KEY_PROD');
  console.warn('');
  console.warn('💡 현재 Demo 모드로 작동합니다:');
  console.warn('   이메일: kerow@hanmail.net');
  console.warn('   비밀번호: 1q2w3e$R');
}

// Mock Supabase 클라이언트 (Demo 모드용)
const createMockSupabase = () => ({
  auth: {
    signUp: async () => ({ data: null, error: new Error('Demo 모드 - 실제 요청 차단') }),
    signInWithPassword: async () => ({ data: null, error: new Error('Demo 모드 - 실제 요청 차단') }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: null, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    insert: async () => ({ data: null, error: new Error('Demo 모드 - 실제 요청 차단') }),
    select: async () => ({ data: null, error: new Error('Demo 모드 - 실제 요청 차단') }),
    update: async () => ({ data: null, error: new Error('Demo 모드 - 실제 요청 차단') }),
    delete: async () => ({ data: null, error: new Error('Demo 모드 - 실제 요청 차단') })
  }),
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: new Error('Demo 모드 - 실제 요청 차단') }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
});

// 환경변수에 따라 실제 클라이언트 또는 Mock 클라이언트 생성
export const supabase = config 
  ? createClient(config.url, config.key, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : createMockSupabase();

// 환경변수 상태 export
export const isSupabaseConfigured = !!config;
export const currentEnvironment = config?.environment || 'demo'; 