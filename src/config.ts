// 환경별 Supabase 설정
const getSupabaseConfig = () => {
  const currentUrl = window.location.hostname;
  const isDevelopment = currentUrl === 'localhost' || currentUrl === 'dev.rich-way.co.kr';
  const isProduction = currentUrl === 'rich-way.co.kr';
  
  if (isDevelopment) {
    return {
      url: import.meta.env.VITE_SUPABASE_URL_DEV,
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY_DEV
    };
  }
  
  if (isProduction) {
    return {
      url: import.meta.env.VITE_SUPABASE_URL_PROD,
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY_PROD
    };
  }
  
  // 기본값 (운영 환경)
  return {
    url: import.meta.env.VITE_SUPABASE_URL_PROD,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY_PROD
  };
};

export const config = {
  supabase: getSupabaseConfig(),
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY
  }
};

// 환경변수가 없을 경우 경고
if (!config.supabase.url || !config.supabase.anonKey) {
  console.warn('Supabase 환경변수가 설정되지 않았습니다. 환경별 설정을 확인해주세요.');
}

if (!config.openai.apiKey) {
  console.warn('OpenAI API 키가 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
} 