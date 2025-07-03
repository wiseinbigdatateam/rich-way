export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
  },
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY
  }
};

// 환경변수가 없을 경우 경고
if (!config.supabase.url || !config.supabase.anonKey) {
  console.warn('Supabase 환경변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
}

if (!config.openai.apiKey) {
  console.warn('OpenAI API 키가 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
} 