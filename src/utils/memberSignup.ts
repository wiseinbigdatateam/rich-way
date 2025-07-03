import { supabase } from '@/lib/supabase';

// 김진성님 회원가입 함수
export const signupKimJinsung = async () => {
  try {
    // 1. Supabase Auth로 사용자 생성
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'kerow@hanmail.net',
      password: '1q2w3e$R'
    });

    if (authError) {
      console.error('Auth 가입 오류:', authError);
      throw authError;
    }

    if (authData.user) {
      // 2. members 테이블에 추가 정보 저장
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .insert([
          {
            user_id: 'kerow_hanmail',
            name: '김진성',
            email: 'kerow@hanmail.net',
            password: '1q2w3e$R', // 실서비스에서는 저장하지 않음
            phone: '',
            signup_type: 'email',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ])
        .select();

      if (memberError) {
        console.error('Member 저장 오류:', memberError);
        throw memberError;
      }

      console.log('✅ 김진성님 회원가입 성공!', memberData);
      return {
        success: true,
        user: authData.user,
        member: memberData
      };
    }
  } catch (error) {
    console.error('❌ 회원가입 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    };
  }
};

// 김진성님 로그인 함수
export const loginKimJinsung = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'kerow@hanmail.net',
      password: '1q2w3e$R'
    });

    if (error) {
      console.error('로그인 오류:', error);
      throw error;
    }

    console.log('✅ 김진성님 로그인 성공!', data);
    return {
      success: true,
      user: data.user
    };
  } catch (error) {
    console.error('❌ 로그인 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '로그인 실패'
    };
  }
};

// 사용 예시:
/*
// 컴포넌트에서 사용하는 방법
import { signupKimJinsung, loginKimJinsung } from '@/utils/memberSignup';

const handleSignup = async () => {
  const result = await signupKimJinsung();
  if (result.success) {
    console.log('회원가입 성공!');
  } else {
    console.error('회원가입 실패:', result.error);
  }
};

const handleLogin = async () => {
  const result = await loginKimJinsung();
  if (result.success) {
    console.log('로그인 성공!');
  } else {
    console.error('로그인 실패:', result.error);
  }
};
*/ 