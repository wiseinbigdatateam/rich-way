import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

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
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 사용자 상태 초기화
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (!isSupabaseConfigured) {
          // Demo 모드: localStorage에서 사용자 정보 확인
          const demoUser = localStorage.getItem('demo-user');
          if (demoUser) {
            const parsedUser = JSON.parse(demoUser);
            setUser(parsedUser);
            console.log('🟡 Demo 모드 사용자 복원:', parsedUser);
          }
        } else {
          // 실제 Supabase: 현재 세션 확인 (오류 처리 강화)
          try {
            const { data: { user: authUser }, error } = await supabase.auth.getUser();
            if (error) {
              console.log('🟡 Supabase 사용자 확인 오류 (무시):', error.message);
            } else if (authUser) {
              // Supabase Auth 사용자를 우리 User 형식으로 변환
              const userData: User = {
                id: authUser.id,
                email: authUser.email,
                name: authUser.user_metadata?.name || authUser.email?.split('@')[0],
                user_metadata: authUser.user_metadata,
                created_at: authUser.created_at
              };
              setUser(userData);
              console.log('🟢 실제 Supabase 사용자 복원:', userData);
            }
          } catch (supabaseError) {
            console.log('🟡 Supabase 연결 오류 (무시):', supabaseError);
          }
        }
      } catch (error) {
        console.error('인증 초기화 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 실제 Supabase가 설정된 경우 Auth 상태 변경 리스너 등록 (오류 처리 강화)
    if (isSupabaseConfigured) {
      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            try {
              console.log('🔄 Auth 상태 변경:', event, session?.user?.email);
              
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
              console.log('🟡 Auth 리스너 오류 (무시):', listenerError);
              setLoading(false);
            }
          }
        );

        return () => {
          try {
            subscription.unsubscribe();
          } catch (unsubscribeError) {
            console.log('🟡 Auth 리스너 해제 오류 (무시):', unsubscribeError);
          }
        };
      } catch (authError) {
        console.log('🟡 Auth 리스너 등록 오류 (무시):', authError);
        setLoading(false);
      }
    }
  }, []);

  // 로그인 함수
  const login = (userData: User) => {
    setUser(userData);
    setLoading(false); // 로그인 완료 후 로딩 상태 해제
    
    if (!isSupabaseConfigured) {
      // Demo 모드: localStorage에 저장
      localStorage.setItem('demo-user', JSON.stringify(userData));
      console.log('🟡 Demo 모드 로그인:', userData);
    }
    
    console.log('✅ 사용자 로그인 완료:', userData);
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      if (!isSupabaseConfigured) {
        // Demo 모드: localStorage에서 제거
        localStorage.removeItem('demo-user');
        console.log('🟡 Demo 모드 로그아웃');
      } else {
        // 실제 Supabase: 로그아웃 처리 (오류 처리 강화)
        try {
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.log('🟡 Supabase 로그아웃 오류 (무시):', error.message);
          } else {
            console.log('🟢 실제 Supabase 로그아웃');
          }
        } catch (signOutError) {
          console.log('🟡 Supabase 로그아웃 요청 오류 (무시):', signOutError);
        }
      }
      
      setUser(null);
      console.log('✅ 사용자 로그아웃 완료');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 