import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface MembersLoginDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onLoginSuccess?: (user: any) => void;
}

export default function MembersLoginDialog({ open, onOpenChange, onLoginSuccess }: MembersLoginDialogProps) {
  const [loginId, setLoginId] = useState(""); // 닉네임 또는 이메일
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Demo 모드 처리
      if (!isSupabaseConfigured) {
        console.log('🟡 Demo 모드 로그인 시도');
        
        // Demo 계정 확인 (닉네임 또는 이메일로)
        if ((loginId === 'kerow@hanmail.net' || loginId === 'kerow_hanmail') && password === '1q2w3e$R') {
          const demoUser = {
            id: 'demo-user-id',
            user_id: 'kerow_hanmail',
            name: '김진성',
            email: 'kerow@hanmail.net',
            phone: '010-1234-5678',
            signup_type: 'email',
            created_at: new Date().toISOString()
          };
          
          toast({
            title: "✅ Demo 로그인 성공!",
            description: "김진성님 환영합니다! (Demo 모드)",
          });
          
          if (onLoginSuccess) {
            onLoginSuccess(demoUser);
          }
          
          setLoginId("");
          setPassword("");
          setLoading(false);
          return;
        } else {
          toast({
            variant: "destructive",
            title: "Demo 로그인 실패",
            description: "Demo 계정: kerow@hanmail.net 또는 kerow_hanmail / 1q2w3e$R",
          });
          setLoading(false);
          return;
        }
      }

      // 실제 Supabase members 테이블에서 사용자 확인
      console.log('🔍 DB에서 사용자 확인 중...');
      console.log('🆔 로그인 시도 ID:', loginId);
      console.log('🔑 로그인 시도 비밀번호:', password);
      
      let users = null;
      let error = null;

      try {
        // 닉네임(user_id) 또는 이메일로 로그인 시도
        const isEmail = loginId.includes('@');
        const response = await (supabase as any)
          .from('members')
          .select('*')
          .eq(isEmail ? 'email' : 'user_id', loginId)
          .eq('password', password) // 실제 환경에서는 해시 비교 필요
          .limit(1);
        
        users = response.data;
        error = response.error;
        
        console.log('📋 DB 조회 결과:', users);
        console.log('❌ DB 조회 오류:', error);
      } catch (queryError) {
        console.error('🚨 DB 쿼리 예외:', queryError);
        error = queryError;
      }

      if (error) {
        console.error('로그인 쿼리 오류:', error);
        throw new Error('서버 오류가 발생했습니다.');
      }

      if (!users || users.length === 0) {
        console.log('❌ 로그인 실패 - 사용자를 찾을 수 없음');
        toast({
          variant: "destructive",
          title: "로그인 실패",
          description: "이메일 또는 비밀번호가 올바르지 않습니다. (또는 탈퇴한 계정)",
        });
        setLoading(false);
        return;
      }

      const user = users[0];

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
      console.error('로그인 오류:', error);
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

          {/* Demo 모드 안내 */}
          {!isSupabaseConfigured && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm text-yellow-800">
                <strong>Demo 모드</strong><br />
                테스트 계정: kerow@hanmail.net / 1q2w3e$R
              </p>
            </div>
          )}

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

        {/* 추가 옵션 */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            계정이 없으신가요?{" "}
            <span className="text-blue-600 hover:underline cursor-pointer">
              회원가입
            </span>
          </p>
          <p className="text-xs text-gray-500">
            비밀번호를 잊으셨나요?{" "}
            <span className="text-blue-500 hover:underline cursor-pointer">
              비밀번호 찾기
            </span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 