import { supabase } from '@/lib/supabase';

// 토큰 타입 정의
export interface AuthToken {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user_id: string;
  user_type: 'member' | 'expert' | 'admin';
}

// 세션 정보 타입 정의
export interface SessionInfo {
  user_id: string;
  user_type: 'member' | 'expert' | 'admin';
  name?: string;
  email?: string;
  avatar?: string;
  metadata?: any;
}

// 토큰 저장소 키
const TOKEN_KEY = 'richway_auth_token';
const SESSION_KEY = 'richway_session_info';

// 토큰 만료 시간 (24시간)
const TOKEN_EXPIRY_HOURS = 24;

/**
 * 토큰 생성 및 저장
 */
export const createAndStoreToken = (
  user_id: string,
  user_type: 'member' | 'expert' | 'admin',
  sessionInfo?: Partial<SessionInfo>
): AuthToken => {
  const now = Date.now();
  const expires_at = now + (TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);
  
  const token: AuthToken = {
    access_token: generateAccessToken(user_id, user_type),
    refresh_token: generateRefreshToken(user_id),
    expires_at,
    user_id,
    user_type
  };

  // 토큰 저장
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
  
  // 세션 정보 저장
  if (sessionInfo) {
    const sessionData: SessionInfo = {
      user_id,
      user_type,
      ...sessionInfo
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  }

  return token;
};

/**
 * 토큰 검증
 */
export const validateToken = (): boolean => {
  try {
    const tokenData = localStorage.getItem(TOKEN_KEY);
    if (!tokenData) return false;

    const token: AuthToken = JSON.parse(tokenData);
    const now = Date.now();

    // 토큰 만료 확인
    if (now >= token.expires_at) {
      clearSession();
      return false;
    }

    return true;
  } catch (error) {
    console.error('토큰 검증 오류:', error);
    clearSession();
    return false;
  }
};

/**
 * 토큰 갱신
 */
export const refreshToken = async (): Promise<boolean> => {
  try {
    const tokenData = localStorage.getItem(TOKEN_KEY);
    if (!tokenData) return false;

    const token: AuthToken = JSON.parse(tokenData);
    
    // 모든 사용자 타입에 대해 새로운 토큰 생성
    const newToken = createAndStoreToken(token.user_id, token.user_type);
    return !!newToken;
  } catch (error) {
    console.error('토큰 갱신 중 오류:', error);
    return false;
  }
};

/**
 * 세션 정보 가져오기
 */
export const getSessionInfo = (): SessionInfo | null => {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) return null;

    return JSON.parse(sessionData);
  } catch (error) {
    console.error('세션 정보 가져오기 오류:', error);
    return null;
  }
};

/**
 * 토큰 정보 가져오기
 */
export const getTokenInfo = (): AuthToken | null => {
  try {
    const tokenData = localStorage.getItem(TOKEN_KEY);
    if (!tokenData) return null;

    return JSON.parse(tokenData);
  } catch (error) {
    console.error('토큰 정보 가져오기 오류:', error);
    return null;
  }
};

/**
 * 세션 정리
 */
export const clearSession = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
  
  // 기존 인증 정보도 정리
  localStorage.removeItem('expertAuth');
  localStorage.removeItem('expertInfo');
  localStorage.removeItem('demo-user');
  localStorage.removeItem('adminLoggedIn');
};

/**
 * 자동 로그인 확인
 */
export const checkAutoLogin = async (): Promise<SessionInfo | null> => {
  try {
    // 토큰 유효성 확인
    if (!validateToken()) {
      return null;
    }

    const token = getTokenInfo();
    const session = getSessionInfo();
    
    if (!token || !session) {
      return null;
    }

    // 토큰이 곧 만료될 예정이면 갱신 시도
    const now = Date.now();
    const timeUntilExpiry = token.expires_at - now;
    const refreshThreshold = 30 * 60 * 1000; // 30분 전에 갱신

    if (timeUntilExpiry < refreshThreshold) {
      const refreshed = await refreshToken();
      if (!refreshed) {
        clearSession();
        return null;
      }
    }

    return session;
  } catch (error) {
    console.error('자동 로그인 확인 오류:', error);
    clearSession();
    return null;
  }
};

/**
 * 접근 토큰 생성 (간단한 구현)
 */
const generateAccessToken = (user_id: string, user_type: string): string => {
  const payload = {
    user_id,
    user_type,
    timestamp: Date.now()
  };
  
  // 실제 프로덕션에서는 JWT 라이브러리 사용 권장
  return btoa(JSON.stringify(payload));
};

/**
 * 갱신 토큰 생성
 */
const generateRefreshToken = (user_id: string): string => {
  const payload = {
    user_id,
    timestamp: Date.now(),
    type: 'refresh'
  };
  
  return btoa(JSON.stringify(payload));
};

/**
 * 세션 만료 시간 확인
 */
export const getSessionExpiryTime = (): Date | null => {
  const token = getTokenInfo();
  if (!token) return null;
  
  return new Date(token.expires_at);
};

/**
 * 세션 만료까지 남은 시간 (분)
 */
export const getTimeUntilExpiry = (): number => {
  const token = getTokenInfo();
  if (!token) return 0;
  
  const now = Date.now();
  const timeLeft = token.expires_at - now;
  
  return Math.max(0, Math.floor(timeLeft / (60 * 1000)));
};

/**
 * 세션 상태 확인
 */
export const getSessionStatus = () => {
  const token = getTokenInfo();
  const session = getSessionInfo();
  const isValid = validateToken();
  const timeUntilExpiry = getTimeUntilExpiry();
  
  return {
    isAuthenticated: isValid && !!session,
    userType: session?.user_type || null,
    userId: session?.user_id || null,
    timeUntilExpiry,
    needsRefresh: timeUntilExpiry < 30, // 30분 이하면 갱신 필요
    sessionInfo: session
  };
}; 