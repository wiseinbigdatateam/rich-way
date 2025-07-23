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
 * 쿠키 도메인 설정 함수
 */
const getCookieDomain = (): string | undefined => {
  const hostname = window.location.hostname;
  
  // 로컬 개발 환경
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return undefined; // localhost에서는 도메인 설정하지 않음
  }
  
  // rich-way.co.kr 도메인 계열
  if (hostname.includes('rich-way.co.kr')) {
    return '.rich-way.co.kr'; // 서브도메인 간 공유
  }
  
  // IP 주소인 경우
  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return undefined; // IP 주소에서는 도메인 설정하지 않음
  }
  
  return undefined;
};

// 쿠키 설정
const COOKIE_OPTIONS = {
  path: '/',
  secure: window.location.protocol === 'https:', // HTTPS에서만 secure 쿠키
  sameSite: 'lax' as const,
  maxAge: 24 * 60 * 60 * 1000, // 24시간
  domain: getCookieDomain() // 서브도메인 간 공유를 위한 도메인 설정
};

/**
 * 쿠키 설정 함수
 */
const setCookie = (name: string, value: string, options: any = {}) => {
  const opts = { ...COOKIE_OPTIONS, ...options };
  let cookieString = `${name}=${encodeURIComponent(value)}`;
  
  if (opts.path) cookieString += `; path=${opts.path}`;
  if (opts.domain) cookieString += `; domain=${opts.domain}`;
  if (opts.secure) cookieString += '; secure';
  if (opts.sameSite) cookieString += `; samesite=${opts.sameSite}`;
  if (opts.maxAge) {
    const expires = new Date(Date.now() + opts.maxAge);
    cookieString += `; expires=${expires.toUTCString()}`;
  }
  
  document.cookie = cookieString;
  
  // 디버깅 로그
  if (!import.meta.env.PROD) {
    console.log(`🍪 쿠키 설정: ${name}`, {
      domain: opts.domain,
      secure: opts.secure,
      sameSite: opts.sameSite,
      hostname: window.location.hostname
    });
  }
};

/**
 * 쿠키 가져오기 함수
 */
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()!.split(';').shift()!);
  }
  return null;
};

/**
 * 쿠키 삭제 함수
 */
const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

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

  // 쿠키에 토큰 저장 (도메인 간 공유 가능)
  setCookie(TOKEN_KEY, JSON.stringify(token), { maxAge: TOKEN_EXPIRY_HOURS * 60 * 60 * 1000 });
  
  // 세션 정보 저장 (쿠키 + localStorage 백업)
  if (sessionInfo) {
    const sessionData: SessionInfo = {
      user_id,
      user_type,
      ...sessionInfo
    };
    setCookie(SESSION_KEY, JSON.stringify(sessionData), { maxAge: TOKEN_EXPIRY_HOURS * 60 * 60 * 1000 });
    
    // localStorage에도 백업 저장 (로컬 개발 환경 지원)
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    } catch (error) {
      console.warn('localStorage 백업 저장 실패:', error);
    }
  }

  return token;
};

/**
 * 토큰 검증
 */
export const validateToken = (): boolean => {
  try {
    // 먼저 쿠키에서 확인
    let tokenData = getCookie(TOKEN_KEY);
    
    // 쿠키에 없으면 localStorage에서 확인 (하위 호환성)
    if (!tokenData) {
      tokenData = localStorage.getItem(TOKEN_KEY);
    }
    
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
    // 먼저 쿠키에서 확인
    let tokenData = getCookie(TOKEN_KEY);
    
    // 쿠키에 없으면 localStorage에서 확인 (하위 호환성)
    if (!tokenData) {
      tokenData = localStorage.getItem(TOKEN_KEY);
    }
    
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
    // 먼저 쿠키에서 확인
    let sessionData = getCookie(SESSION_KEY);
    
    // 쿠키에 없으면 localStorage에서 확인 (하위 호환성)
    if (!sessionData) {
      sessionData = localStorage.getItem(SESSION_KEY);
    }
    
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
    // 먼저 쿠키에서 확인
    let tokenData = getCookie(TOKEN_KEY);
    
    // 쿠키에 없으면 localStorage에서 확인 (하위 호환성)
    if (!tokenData) {
      tokenData = localStorage.getItem(TOKEN_KEY);
    }
    
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
  // 쿠키 삭제
  deleteCookie(TOKEN_KEY);
  deleteCookie(SESSION_KEY);
  
  // localStorage도 정리 (하위 호환성)
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
  
  // 디버깅 정보
  if (!import.meta.env.PROD) {
    const cookieToken = getCookie(TOKEN_KEY);
    const localStorageToken = localStorage.getItem(TOKEN_KEY);
    const cookieSession = getCookie(SESSION_KEY);
    const localStorageSession = localStorage.getItem(SESSION_KEY);
    
    console.log('🔍 세션 상태 디버깅:', {
      hostname: window.location.hostname,
      cookieToken: !!cookieToken,
      localStorageToken: !!localStorageToken,
      cookieSession: !!cookieSession,
      localStorageSession: !!localStorageSession,
      isValid,
      timeUntilExpiry,
      userType: session?.user_type
    });
  }
  
  return {
    isAuthenticated: isValid && !!session,
    userType: session?.user_type || null,
    userId: session?.user_id || null,
    timeUntilExpiry,
    needsRefresh: timeUntilExpiry < 30, // 30분 이하면 갱신 필요
    sessionInfo: session
  };
}; 