import { createClient } from '@supabase/supabase-js';

// 환경변수 확인
const hasValidEnv = import.meta.env.VITE_SUPABASE_URL && 
                   import.meta.env.VITE_SUPABASE_ANON_KEY &&
                   import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
                   import.meta.env.VITE_SUPABASE_ANON_KEY !== 'placeholder-key';

// 환경변수 체크 및 디버깅 정보
console.log('🔧 Supabase 환경변수 체크:');
console.log('   VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL || '❌ 설정되지 않음');
console.log('   VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ 설정됨' : '❌ 설정되지 않음');
console.log('   모드:', hasValidEnv ? '🟢 실제 Supabase' : '🟡 Demo 모드');

if (!hasValidEnv) {
  console.warn('⚠️ Supabase 환경변수가 설정되지 않았습니다.');
  console.warn('📋 .env 파일을 생성하고 다음 변수를 설정하세요:');
  console.warn('   VITE_SUPABASE_URL=your-supabase-url');
  console.warn('   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key');
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
export const supabase = hasValidEnv 
  ? createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : createMockSupabase();

// 환경변수 상태 export
export const isSupabaseConfigured = hasValidEnv; 