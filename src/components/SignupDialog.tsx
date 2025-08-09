import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";
import { Check, X, Loader2 } from "lucide-react";
import TermsAgreementDialog from "./TermsAgreementDialog";

export default function SignupDialog({ open, onOpenChange, onSignupSuccess }: { open?: boolean, onOpenChange?: (open: boolean) => void, onSignupSuccess?: (userData: any) => void } = {}) {
  const [currentStep, setCurrentStep] = useState<'terms' | 'signup'>('terms');
  const [agreements, setAgreements] = useState({
    termsOfService: false,
    privacyPolicy: false,
    marketing: false,
  });
  
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nicknameChecking, setNicknameChecking] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(null);
  const [nicknameChecked, setNicknameChecked] = useState(false); // 중복확인 완료 여부
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [emailChecked, setEmailChecked] = useState(false); // 이메일 중복확인 완료 여부
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // 약관 동의 완료 처리
  const handleAgreementComplete = (agreedTerms: typeof agreements) => {
    setAgreements(agreedTerms);
    setCurrentStep('signup');
  };

  // 회원가입 다이얼로그 닫기 시 초기화
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // 다이얼로그가 닫힐 때 상태 초기화
      setCurrentStep('terms');
      setAgreements({
        termsOfService: false,
        privacyPolicy: false,
        marketing: false,
      });
      setName("");
      setNickname("");
      setEmail("");
      setPassword("");
      setNicknameAvailable(null);
      setNicknameChecked(false);
      setEmailAvailable(null);
      setEmailChecked(false);
    }
    onOpenChange?.(newOpen);
  };

  // 닉네임 중복 확인 함수
  const checkNicknameAvailability = async (nicknameToCheck: string) => {
    if (!nicknameToCheck.trim()) {
      setNicknameAvailable(null);
      setNicknameChecked(false);
      return;
    }

    // 닉네임 유효성 검사 (한글만 허용, 2-10자)
    const nicknameRegex = /^[가-힣]{2,10}$/;
    if (!nicknameRegex.test(nicknameToCheck)) {
      setNicknameAvailable(false);
      setNicknameChecked(false);
      return;
    }

    setNicknameChecking(true);
    
          try {
        // 실제 DB에서 중복 확인
        const { data, error } = await supabase
          .from('members')
          .select('user_id')
          .eq('user_id', nicknameToCheck)
          .single();

        if (error && error.code === 'PGRST116') {
          // 데이터가 없음 = 사용 가능
          setNicknameAvailable(true);
          setNicknameChecked(true);
        } else if (data) {
          // 데이터가 있음 = 이미 사용 중
          setNicknameAvailable(false);
          setNicknameChecked(true);
        } else {
          console.error('닉네임 확인 오류:', error);
          setNicknameAvailable(false);
          setNicknameChecked(false);
        }
      } catch (error) {
        console.error('닉네임 확인 중 오류:', error);
        setNicknameAvailable(false);
        setNicknameChecked(false);
      } finally {
        setNicknameChecking(false);
      }
  };

  // 닉네임 입력 시 상태 초기화 (자동 확인 제거)
  const handleNicknameChange = (value: string) => {
    setNickname(value);
    setNicknameAvailable(null);
    setNicknameChecked(false); // 새로 입력하면 확인 상태 초기화
  };

  // 수동 중복 확인 버튼
  const handleCheckNickname = () => {
    if (nickname.trim()) {
      checkNicknameAvailability(nickname);
    }
  };

  // 이메일 중복 확인 함수
  const checkEmailAvailability = async (emailToCheck: string) => {
    if (!emailToCheck.trim()) {
      setEmailAvailable(null);
      setEmailChecked(false);
      return;
    }

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToCheck)) {
      setEmailAvailable(false);
      setEmailChecked(false);
      return;
    }

    setEmailChecking(true);
    
    try {
      // 실제 DB에서 중복 확인
      const { data, error } = await supabase
        .from('members')
        .select('email')
        .eq('email', emailToCheck)
        .single();

      if (error && error.code === 'PGRST116') {
        // 데이터가 없음 = 사용 가능
        setEmailAvailable(true);
        setEmailChecked(true);
      } else if (data) {
        // 데이터가 있음 = 이미 사용 중
        setEmailAvailable(false);
        setEmailChecked(true);
      } else {
        console.error('이메일 확인 오류:', error);
        setEmailAvailable(false);
        setEmailChecked(false);
      }
    } catch (error) {
      console.error('이메일 확인 중 오류:', error);
      setEmailAvailable(false);
      setEmailChecked(false);
    } finally {
      setEmailChecking(false);
    }
  };

  // 이메일 입력 시 상태 초기화
  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailAvailable(null);
    setEmailChecked(false); // 새로 입력하면 확인 상태 초기화
  };

  // 수동 이메일 중복 확인 버튼
  const handleCheckEmail = () => {
    if (email.trim()) {
      checkEmailAvailability(email);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 입력값 검증
      if (!name.trim() || !nickname.trim() || !email.trim() || !password.trim()) {
        toast({
          variant: "destructive",
          title: "회원가입 실패",
          description: "모든 필드를 입력해주세요.",
        });
        return;
      }

      if (password.length < 6) {
        toast({
          variant: "destructive",
          title: "회원가입 실패",
          description: "비밀번호는 6자 이상이어야 합니다.",
        });
        return;
      }

      if (!emailAvailable) {
        toast({
          variant: "destructive",
          title: "회원가입 실패",
          description: "이미 사용 중인 이메일입니다.",
        });
        return;
      }

      if (!nicknameAvailable) {
        toast({
          variant: "destructive",
          title: "회원가입 실패",
          description: "이미 사용 중인 닉네임입니다.",
        });
        return;
      }

      // 실제 Supabase members 테이블에 데이터 삽입
      const userData = {
        user_id: nickname.trim(),
        name: name.trim(),
        email: email.trim(),
        password: password,
        phone: '',
        signup_type: 'email',
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase.from('members').insert([userData]).select();

      if (error) {
        console.error('회원가입 오류:', error);
        
        // 구체적인 에러 메시지 제공
        if (error.code === '23505') {
          if (error.message.includes('user_id')) {
            toast({
              variant: "destructive",
              title: "회원가입 실패",
              description: "이미 사용 중인 닉네임입니다.",
            });
          } else if (error.message.includes('email')) {
            toast({
              variant: "destructive",
              title: "회원가입 실패",
              description: "이미 사용 중인 이메일입니다.",
            });
          } else {
            toast({
              variant: "destructive",
              title: "회원가입 실패",
              description: "이미 등록된 사용자입니다.",
            });
          }
        } else if (error.code === '409') {
          toast({
            variant: "destructive",
            title: "회원가입 실패",
            description: "데이터 충돌이 발생했습니다. 페이지를 새로고침하고 다시 시도해주세요.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "회원가입 실패",
            description: "회원가입에 실패했습니다. 다시 시도해주세요.",
          });
        }
        return;
      }

      console.log('✅ 회원가입 성공:', data);

      toast({
        title: "✅ 회원가입 성공!",
        description: `${name}님 (${nickname}) 환영합니다! 이제 로그인할 수 있습니다.`,
      });

      // 입력 필드 초기화
      setName("");
      setNickname("");
      setEmail("");
      setPassword("");
      setNicknameAvailable(null);
      setNicknameChecked(false);
      setEmailAvailable(null);
      setEmailChecked(false);

      if (onSignupSuccess) {
        onSignupSuccess(data[0]);
      }
      handleOpenChange(false);

    } catch (error) {
      console.error('회원가입 중 오류:', error);
      toast({
        variant: "destructive",
        title: "회원가입 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  // 약관 동의 단계
  if (currentStep === 'terms') {
    return (
      <TermsAgreementDialog
        open={open}
        onOpenChange={handleOpenChange}
        onAgreementComplete={handleAgreementComplete}
      />
    );
  }

  // 회원가입 정보 입력 단계
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="text-center mb-4">
            <div className="flex items-center justify-center mb-2">
              <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div className="w-8 h-1 bg-green-600 mx-2"></div>
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            </div>
            <DialogTitle className="text-xl font-bold">회원가입</DialogTitle>
            <p className="text-sm text-gray-500 mt-1">2단계: 회원 정보 입력</p>
          </div>
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentStep('terms')}
              className="text-gray-500 hover:text-gray-700"
            >
              ← 약관으로
            </Button>
          </div>
        </DialogHeader>
        <form onSubmit={handleSignup} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nickname">닉네임 (사용자 ID)</Label>
            <div className="flex gap-2">
              <Input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => handleNicknameChange(e.target.value)}
                placeholder="한글 닉네임을 입력하세요 (2-10자)"
                className={`flex-1 ${
                  nicknameAvailable === true ? 'border-green-500 focus:border-green-500' :
                  nicknameAvailable === false ? 'border-red-500 focus:border-red-500' :
                  ''
                }`}
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleCheckNickname}
                disabled={!nickname.trim() || nicknameChecking}
                className="px-4 whitespace-nowrap"
              >
                {nicknameChecking ? "확인 중..." : "중복확인"}
              </Button>
            </div>
            {nicknameAvailable === true && nicknameChecked && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                ✓ 사용 가능한 닉네임입니다
              </p>
            )}
            {nicknameAvailable === false && nicknameChecked && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                ✗ 이미 사용 중이거나 올바르지 않은 닉네임입니다
              </p>
            )}
            {nickname && !nicknameChecked && (
              <p className="text-sm text-gray-500">중복확인을 해주세요</p>
            )}
            <p className="text-xs text-gray-500">
              * 한글만 사용 가능 (2-10자)
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">이메일</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="이메일을 입력하세요"
                className={`flex-1 ${
                  emailAvailable === true ? 'border-green-500 focus:border-green-500' :
                  emailAvailable === false ? 'border-red-500 focus:border-red-500' :
                  ''
                }`}
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleCheckEmail}
                disabled={!email.trim() || emailChecking}
                className="px-4 whitespace-nowrap"
              >
                {emailChecking ? "확인 중..." : "중복확인"}
              </Button>
            </div>
            {emailAvailable === true && emailChecked && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                ✓ 사용 가능한 이메일입니다
              </p>
            )}
            {emailAvailable === false && emailChecked && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                ✗ 이미 사용 중이거나 올바르지 않은 이메일입니다
              </p>
            )}
            {email && !emailChecked && (
              <p className="text-sm text-gray-500">중복확인을 해주세요</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
          <Button 
            type="submit" 
            disabled={
              !nickname.trim() || !nicknameChecked || nicknameAvailable !== true ||
              !email.trim() || !emailChecked || emailAvailable !== true ||
              loading
            }
            className="w-full"
          >
            가입하기
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
