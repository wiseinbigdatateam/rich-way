import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { isProduction, isDemoModeEnabled } from '@/utils/productionUtils';
import { 
  createAndStoreToken, 
  validateToken, 
  refreshToken, 
  getSessionInfo, 
  clearSession, 
  checkAutoLogin,
  getSessionStatus,
  type SessionInfo 
} from '@/utils/sessionManager';

interface User {
  id: string;
  user_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  signup_type?: string;
  created_at?: string;
  user_metadata?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User, userType?: 'member' | 'expert' | 'admin') => void;
  logout: () => void;
  isAuthenticated: boolean;
  sessionStatus: ReturnType<typeof getSessionStatus>;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// 운영 환경에서 콘솔로그 출력 함수
const log = (message: string, data?: any) => {
  if (!isProduction) {
    if (data) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const subscriptionRef = useRef<any>(null);
  const isMountedRef = useRef(true);

  // 사용자 상태 초기화
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 새로운 세션 관리 시스템으로 자동 로그인 확인
        const session = await checkAutoLogin();
        
        if (session && isMountedRef.current) {
          // 세션 정보를 User 형식으로 변환
          const userData: User = {
            id: session.user_id,
            user_id: session.user_id,
            email: session.email,
            name: session.name,
            user_metadata: session.metadata,
            created_at: new Date().toISOString()
          };
          setUser(userData);
          log('🟢 세션 관리 시스템으로 사용자 복원:', userData);
        } else if (!isSupabaseConfigured) {
          // 기존 Demo 모드 지원 (하위 호환성)
          const demoUser = localStorage.getItem('demo-user');
          if (demoUser && isMountedRef.current) {
            const parsedUser = JSON.parse(demoUser);
            setUser(parsedUser);
            log('🟡 Demo 모드 사용자 복원:', parsedUser);
          }
        } else {
          // 기존 Supabase Auth 지원 (하위 호환성)
          try {
            const { data: { user: authUser }, error } = await supabase.auth.getUser();
            if (error) {
              log('🟡 Supabase 사용자 확인 오류 (무시):', error.message);
            } else if (authUser && isMountedRef.current) {
              const userData: User = {
                id: authUser.id,
                email: authUser.email,
                name: authUser.user_metadata?.name || authUser.email?.split('@')[0],
                user_metadata: authUser.user_metadata,
                created_at: authUser.created_at
              };
              setUser(userData);
              log('🟢 실제 Supabase 사용자 복원:', userData);
            }
          } catch (supabaseError) {
            log('🟡 Supabase 연결 오류 (무시):', supabaseError);
          }
        }
      } catch (error) {
        if (!isProduction) {
          console.error('인증 초기화 오류:', error);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // 실제 Supabase가 설정된 경우 Auth 상태 변경 리스너 등록 (오류 처리 강화)
    if (isSupabaseConfigured) {
      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            try {
              if (!isMountedRef.current) return;
              
              log(`🔄 Auth 상태 변경: ${event} ${session?.user?.email || ''}`);
              
              if (event === 'SIGNED_IN' && session?.user) {
                const userData: User = {
                  id: session.user.id,
                  email: session.user.email,
                  name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
                  user_metadata: session.user.user_metadata,
                  created_at: session.user.created_at
                };
                setUser(userData);
              } else if (event === 'SIGNED_OUT') {
                setUser(null);
              }
              
              setLoading(false);
            } catch (listenerError) {
              log('🟡 Auth 리스너 오류 (무시):', listenerError);
              if (isMountedRef.current) {
                setLoading(false);
              }
            }
          }
        );

        subscriptionRef.current = subscription;

        return () => {
          try {
            if (subscriptionRef.current) {
              subscriptionRef.current.unsubscribe();
              subscriptionRef.current = null;
            }
          } catch (unsubscribeError) {
            log('🟡 Auth 리스너 해제 오류 (무시):', unsubscribeError);
          }
        };
      } catch (authError) {
        log('🟡 Auth 리스너 등록 오류 (무시):', authError);
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    }

    // 컴포넌트 언마운트 시 cleanup
    return () => {
      isMountedRef.current = false;
      try {
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
          subscriptionRef.current = null;
        }
      } catch (error) {
        log('🟡 Auth 리스너 해제 오류 (무시):', error);
      }
    };
  }, []);

  // 로그인 함수
  const login = (userData: User, userType: 'member' | 'expert' | 'admin' = 'member') => {
    if (!isMountedRef.current) return;
    
    setUser(userData);
    setLoading(false); // 로그인 완료 후 로딩 상태 해제
    
    // 새로운 세션 관리 시스템으로 토큰 생성 및 저장
    const sessionInfo: Partial<SessionInfo> = {
      name: userData.name,
      email: userData.email,
      avatar: userData.user_metadata?.avatar,
      metadata: userData.user_metadata
    };
    
    createAndStoreToken(userData.id || userData.user_id || '', userType, sessionInfo);
    
    // 기존 시스템과의 호환성을 위해 기존 저장소도 유지
    if (!isSupabaseConfigured) {
      localStorage.setItem('demo-user', JSON.stringify(userData));
      log('🟡 Demo 모드 로그인:', userData);
    }
    
    log('✅ 사용자 로그인 완료 (새 세션 관리 시스템):', userData);
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      // 새로운 세션 관리 시스템으로 세션 정리
      clearSession();
      
      // 기존 시스템과의 호환성을 위해 기존 로그아웃 처리도 수행
      if (!isSupabaseConfigured) {
        log('🟡 Demo 모드 로그아웃');
      } else {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) {
            log('🟡 Supabase 로그아웃 오류 (무시):', error.message);
          } else {
            log('🟢 실제 Supabase 로그아웃');
          }
        } catch (signOutError) {
          log('🟡 Supabase 로그아웃 요청 오류 (무시):', signOutError);
        }
      }
      
      if (isMountedRef.current) {
        setUser(null);
      }
      log('✅ 사용자 로그아웃 완료 (새 세션 관리 시스템)');
    } catch (error) {
      if (!isProduction) {
        console.error('로그아웃 오류:', error);
      }
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    sessionStatus: getSessionStatus(),
    refreshSession: refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 