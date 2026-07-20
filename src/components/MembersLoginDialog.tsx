import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import SignupDialog from "./SignupDialog";
import { sendPasswordResetEmail } from "@/lib/emailService";
import { verifyPassword } from "@/utils/passwordUtils";
// import KakaoLoginButton from "./KakaoLoginButton";

interface MembersLoginDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onLoginSuccess?: (user: any) => void;
}

// 안전한 콘솔 로깅 함수
const safeLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    try {
      if (data) {
        console.log(message, data);
      } else {
        console.log(message);
      }
    } catch (error) {
      // Chrome 확장 프로그램 오류 등으로 인한 콘솔 로그 실패를 무시
    }
  }
};

const safeError = (message: string, error?: any) => {
  if (process.env.NODE_ENV === 'development') {
    try {
      if (error) {
        console.error(message, error);
      } else {
        console.error(message);
      }
    } catch (err) {
      // Chrome 확장 프로그램 오류 등으로 인한 콘솔 에러 실패를 무시
    }
  }
};

export default function MembersLoginDialog({ open, onOpenChange, onLoginSuccess }: MembersLoginDialogProps) {
  const [loginId, setLoginId] = useState(""); // 닉네임 또는 이메일
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSignupDialog, setShowSignupDialog] = useState(false);
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const { toast } = useToast();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordLoading(true);

    try {
      // 실제 Supabase Auth를 사용한 비밀번호 재설정 이메일 발송
      safeLog('📧 비밀번호 재설정 이메일 발송 시도:', forgotPasswordEmail);
      
      // 먼저 사용자가 존재하는지 확인
      const { data: existingUser, error: userError } = await (supabase as any)
        .from('members')
        .select('email')
        .eq('email', forgotPasswordEmail)
        .single();

      if (userError || !existingUser) {
        safeError('❌ 사용자를 찾을 수 없음:', userError);
        toast({
          variant: "destructive",
          title: "비밀번호 찾기 실패",
          description: "해당 이메일로 가입된 계정을 찾을 수 없습니다.",
        });
        return;
      }

      // 커스텀 이메일 서비스를 사용하여 비밀번호 재설정 이메일 발송
      const token = Date.now();
      const resetLink = `${window.location.origin}/reset-password?token=${token}&email=${encodeURIComponent(forgotPasswordEmail)}`;
      const result = await sendPasswordResetEmail(forgotPasswordEmail, resetLink);

      if (!result.success) {
        safeError('❌ 비밀번호 재설정 이메일 발송 실패:', result.error);
        toast({
          variant: "destructive",
          title: "비밀번호 찾기 실패",
          description: result.message || "이메일 발송에 실패했습니다. 다시 시도해주세요.",
        });
        return;
      }

      safeLog('✅ 비밀번호 재설정 이메일 발송 성공:', result);
      
      // 성공 메시지 - 더 상세한 안내 포함
      toast({
        title: "✅ 비밀번호 재설정 이메일 발송 완료",
        description: (
          <div className="space-y-2">
            <p className="font-medium">{forgotPasswordEmail}로 비밀번호 재설정 이메일을 발송했습니다.</p>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• 이메일을 확인하여 비밀번호 재설정 링크를 클릭해주세요</p>
              <p>• 스팸 메일함도 확인해보세요</p>
              <p>• 링크는 24시간 동안 유효합니다</p>
            </div>
          </div>
        ),
        duration: 5000, // 5초간 표시
      });
      
      setForgotPasswordSuccess(true);
      // 다이얼로그는 잠시 후 닫기 (사용자가 확인 메시지를 볼 수 있도록)
      setTimeout(() => {
        setShowForgotPasswordDialog(false);
        setForgotPasswordSuccess(false);
        setForgotPasswordEmail("");
      }, 3000);
    } catch (error: any) {
      safeError('비밀번호 찾기 오류:', error);
      toast({
        variant: "destructive",
        title: "비밀번호 찾기 실패",
        description: error.message || "알 수 없는 오류가 발생했습니다.",
      });
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 입력값 검증
      if (!loginId.trim() || !password.trim()) {
        toast({
          variant: "destructive",
          title: "로그인 실패",
          description: "닉네임/이메일과 비밀번호를 모두 입력해주세요.",
        });
        return;
      }

      // 실제 Supabase members 테이블에서 사용자 확인
      if (process.env.NODE_ENV === 'development') {
        safeLog('🔍 DB에서 사용자 확인 중...');
        safeLog('🆔 로그인 시도 ID:', loginId);
      }
      
      let users = null;
      let error = null;

      try {
        // 닉네임(user_id) 또는 이메일로 사용자 찾기
        const isEmail = loginId.includes('@');
        const response = await (supabase as any)
          .from('members')
          .select('*')
          .eq(isEmail ? 'email' : 'user_id', loginId.trim())
          .limit(1);
        
        users = response.data;
        error = response.error;
        
        if (process.env.NODE_ENV === 'development') {
          safeLog('📋 DB 조회 결과:', users ? `${users.length}명의 사용자 발견` : '사용자 없음');
          if (error) {
            safeError('❌ DB 조회 오류:', error);
          }
        }
      } catch (queryError) {
        if (process.env.NODE_ENV === 'development') {
          safeError('🚨 DB 쿼리 예외:', queryError);
        }
        error = queryError;
      }

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          safeError('로그인 쿼리 오류:', error);
        }
        toast({
          variant: "destructive",
          title: "로그인 실패",
          description: "서버 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
        });
        return;
      }

      if (!users || users.length === 0) {
        if (process.env.NODE_ENV === 'development') {
          safeLog('❌ 로그인 실패 - 사용자를 찾을 수 없음');
        }
        toast({
          variant: "destructive",
          title: "로그인 실패",
          description: "이메일 또는 비밀번호가 올바르지 않습니다. (또는 탈퇴한 계정)",
        });
        return;
      }

      const user = users[0];

      // 비밀번호 검증
      if (process.env.NODE_ENV === 'development') {
        safeLog('🔐 비밀번호 검증 중...');
      }

      let isPasswordValid = false;
      
      try {
        // 암호화된 비밀번호가 있는지 확인
        if (user.password && user.password.startsWith('$2')) {
          // bcrypt로 암호화된 비밀번호인 경우
          isPasswordValid = await verifyPassword(password, user.password);
        } else {
          // 기존 평문 비밀번호인 경우 (하위 호환성)
          isPasswordValid = user.password === password;
        }
      } catch (passwordError) {
        if (process.env.NODE_ENV === 'development') {
          safeError('❌ 비밀번호 검증 오류:', passwordError);
        }
        isPasswordValid = false;
      }

      if (!isPasswordValid) {
        if (process.env.NODE_ENV === 'development') {
          safeLog('❌ 로그인 실패 - 비밀번호 불일치');
        }
        toast({
          variant: "destructive",
          title: "로그인 실패",
          description: "이메일 또는 비밀번호가 올바르지 않습니다.",
        });
        return;
      }

      // 로그인 성공 처리
      if (process.env.NODE_ENV === 'development') {
        safeLog('✅ 로그인 성공:', user.name);
      }
      
      toast({
        title: "✅ 로그인 성공!",
        description: `${user.name}님 환영합니다!`,
      });

      // 로그인 성공 콜백 호출
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }

      // 폼 초기화
      setLoginId("");
      setPassword("");

    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        safeError('로그인 오류:', error);
      }
      toast({
        variant: "destructive",
        title: "로그인 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>로그인</DialogTitle>
          <DialogDescription>
            회원 계정으로 로그인하여 서비스를 이용하세요.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleLogin} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="loginId">닉네임 또는 이메일</Label>
            <Input
              id="loginId"
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="한글 닉네임 또는 이메일을 입력하세요"
              required
              disabled={loading}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
                disabled={loading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                로그인 중...
              </>
            ) : (
              "로그인"
            )}
          </Button>
        </form>

        {/* 소셜 로그인 구분선 */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          {/*
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">또는</span>
          </div>
          */}
        </div>

        {/* 카카오 로그인 버튼 */}
        {/*
        <KakaoLoginButton
          onLoginSuccess={onLoginSuccess}
          className="w-full"
        />
        */}

        {/* 추가 옵션 */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            계정이 없으신가요?{" "}
            <span 
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={() => setShowSignupDialog(true)}
            >
              회원가입
            </span>
          </p>
          <p className="text-xs text-gray-500">
            비밀번호를 잊으셨나요?{" "}
            <span 
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => setShowForgotPasswordDialog(true)}
            >
              비밀번호 찾기
            </span>
          </p>
        </div>
      </DialogContent>
    </Dialog>

    {/* 회원가입 다이얼로그 */}
    <SignupDialog
      open={showSignupDialog}
      onOpenChange={setShowSignupDialog}
      onSignupSuccess={onLoginSuccess}
    />

    {/* 비밀번호 찾기 다이얼로그 */}
    <Dialog 
      open={showForgotPasswordDialog} 
      onOpenChange={(open) => {
        setShowForgotPasswordDialog(open);
        if (!open) {
          setForgotPasswordSuccess(false);
          setForgotPasswordEmail("");
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>비밀번호 찾기</DialogTitle>
          <DialogDescription>
            {forgotPasswordSuccess 
              ? "비밀번호 재설정 이메일이 발송되었습니다."
              : "가입한 이메일 주소를 입력하시면 비밀번호 재설정 이메일을 발송해드립니다."
            }
          </DialogDescription>
        </DialogHeader>
        
        {forgotPasswordSuccess ? (
          <div className="grid gap-4 py-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-green-800">
                    이메일 발송 완료
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p className="font-medium">{forgotPasswordEmail}로 비밀번호 재설정 이메일을 발송했습니다.</p>
                    <div className="mt-2 space-y-1">
                      <p>• 이메일을 확인하여 비밀번호 재설정 링크를 클릭해주세요</p>
                      <p>• 스팸 메일함도 확인해보세요</p>
                      <p>• 링크는 24시간 동안 유효합니다</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">
                이 다이얼로그는 잠시 후 자동으로 닫힙니다.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="forgot-email">이메일 주소</Label>
              <Input
                id="forgot-email"
                type="email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                placeholder="가입한 이메일을 입력하세요"
                required
                disabled={forgotPasswordLoading}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={forgotPasswordLoading} className="flex-1">
                {forgotPasswordLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    이메일 발송 중...
                  </>
                ) : (
                  "비밀번호 재설정 이메일 발송"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  </>
  );
} 