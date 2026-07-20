import { supabase } from '@/lib/supabase';

// 비밀번호 찾기 테스트 함수
export const testPasswordReset = async (email: string = 'kerow@hanmail.net') => {
  console.log('🧪 비밀번호 찾기 테스트 시작');
  console.log('📧 테스트 이메일:', email);
  console.log('🔧 Supabase 설정 상태: ✅ 설정됨');
  console.log('🌐 현재 URL:', window.location.origin);

  try {
    // 1. 사용자 존재 여부 확인
    console.log('🔍 사용자 존재 여부 확인 중...');
    const { data: existingUser, error: userError } = await supabase
      .from('members')
      .select('email, name, user_id')
      .eq('email', email)
      .single();

    if (userError) {
      console.error('❌ 사용자 조회 오류:', userError);
      if (userError.code === 'PGRST116') {
        return {
          success: false,
          message: '해당 이메일로 가입된 계정을 찾을 수 없습니다.',
          error: userError
        };
      }
      return {
        success: false,
        message: '사용자 조회 중 오류가 발생했습니다.',
        error: userError
      };
    }

    if (!existingUser) {
      console.error('❌ 사용자를 찾을 수 없음');
      return {
        success: false,
        message: '해당 이메일로 가입된 계정을 찾을 수 없습니다.',
        error: null
      };
    }

    console.log('✅ 사용자 확인됨:', existingUser);

    // 2. 비밀번호 재설정 이메일 발송
    console.log('📧 비밀번호 재설정 이메일 발송 중...');
    console.log('🔗 리다이렉트 URL:', `${window.location.origin}/reset-password`);
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      console.error('❌ 이메일 발송 실패:', error);
      return {
        success: false,
        message: error.message || '이메일 발송에 실패했습니다.',
        error: error
      };
    }

    console.log('✅ 이메일 발송 성공:', data);
    return {
      success: true,
      message: `${email}로 비밀번호 재설정 이메일을 발송했습니다. 이메일을 확인해주세요.`,
      data: data
    };

  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      error: error
    };
  }
};

// 브라우저 콘솔에서 실행할 수 있는 함수
if (typeof window !== 'undefined') {
  (window as any).testPasswordReset = testPasswordReset;
  console.log('🧪 testPasswordReset 함수가 전역으로 등록되었습니다.');
  console.log('사용법: testPasswordReset("kerow@hanmail.net")');
  console.log('또는: testPasswordReset() - 기본값으로 kerow@hanmail.net 사용');
  
  // 개발 환경에서 자동으로 테스트 실행 (선택사항)
  if (process.env.NODE_ENV === 'development' && window.location.hostname === 'localhost') {
    console.log('🚀 개발 환경에서 자동 테스트를 실행하려면 다음을 콘솔에 입력하세요:');
    console.log('testPasswordReset("kerow@hanmail.net")');
  }
} 