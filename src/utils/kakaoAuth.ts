// 카카오 로그인 유틸리티
declare global {
  interface Window {
    Kakao: any;
  }
}

// 카카오 SDK 초기화
export const initKakao = () => {
  if (typeof window !== 'undefined' && window.Kakao) {
    if (!window.Kakao.isInitialized()) {
      // 카카오 JavaScript 키로 초기화
      window.Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
    }
  }
};

// 카카오 로그인
export const loginWithKakao = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.Kakao) {
      reject(new Error('카카오 SDK가 로드되지 않았습니다.'));
      return;
    }

    window.Kakao.Auth.login({
      success: (authObj: any) => {
        console.log('카카오 로그인 성공:', authObj);
        resolve(authObj);
      },
      fail: (err: any) => {
        console.error('카카오 로그인 실패:', err);
        reject(err);
      },
    });
  });
};

// 카카오 사용자 정보 가져오기
export const getKakaoUserInfo = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.Kakao) {
      reject(new Error('카카오 SDK가 로드되지 않았습니다.'));
      return;
    }

    window.Kakao.API.request({
      url: '/v2/user/me',
      success: (res: any) => {
        console.log('카카오 사용자 정보:', res);
        resolve(res);
      },
      fail: (err: any) => {
        console.error('카카오 사용자 정보 조회 실패:', err);
        reject(err);
      },
    });
  });
};

// 카카오 로그아웃
export const logoutFromKakao = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.Kakao) {
      reject(new Error('카카오 SDK가 로드되지 않았습니다.'));
      return;
    }

    window.Kakao.Auth.logout(() => {
      console.log('카카오 로그아웃 완료');
      resolve();
    });
  });
};

// 카카오 로그인 상태 확인
export const isKakaoLoggedIn = (): boolean => {
  if (typeof window === 'undefined' || !window.Kakao) {
    return false;
  }
  return window.Kakao.Auth.getAccessToken() !== null;
};

// 카카오 액세스 토큰 가져오기
export const getKakaoAccessToken = (): string | null => {
  if (typeof window === 'undefined' || !window.Kakao) {
    return null;
  }
  return window.Kakao.Auth.getAccessToken();
}; 