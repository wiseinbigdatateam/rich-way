// =============================================
// 임시 Demo 모드 재활성화 방법
// =============================================

// src/lib/supabase.ts 파일에서 다음 줄을 수정:

// 현재 (실제 Supabase 연결):
// export const isSupabaseConfigured = hasValidEnv;

// 임시 Demo 모드로 변경:
// export const isSupabaseConfigured = false;

// 이렇게 하면 RLS 오류 없이 로컬에서만 작동합니다. 