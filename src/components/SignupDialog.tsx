import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";

export default function SignupDialog({ open, onOpenChange }: { open?: boolean, onOpenChange?: (open: boolean) => void } = {}) {
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
  const { toast } = useToast();

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
        if (!isSupabaseConfigured) {
          // Demo 모드: 기본적으로 사용 가능하다고 가정
          setNicknameAvailable(true);
          setNicknameChecked(true);
        } else {
          // 실제 DB에서 중복 확인
          const { data, error } = await (supabase as any)
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
      if (!isSupabaseConfigured) {
        // Demo 모드: 기본적으로 사용 가능하다고 가정
        setEmailAvailable(true);
        setEmailChecked(true);
      } else {
        // 실제 DB에서 중복 확인
        const { data, error } = await (supabase as any)
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
    
    // 닉네임 유효성 검사
    if (!nickname.trim()) {
      toast({
        variant: "destructive",
        title: "닉네임 오류",
        description: "닉네임을 입력해주세요.",
      });
      return;
    }

    if (!nicknameChecked) {
      toast({
        variant: "destructive",
        title: "닉네임 확인 필요",
        description: "닉네임 중복확인을 먼저 해주세요.",
      });
      return;
    }

    if (nicknameAvailable !== true) {
      toast({
        variant: "destructive",
        title: "닉네임 오류",
        description: "사용 가능한 닉네임을 입력해주세요.",
      });
      return;
    }

    // 이메일 유효성 검사
    if (!email.trim()) {
      toast({
        variant: "destructive",
        title: "이메일 오류",
        description: "이메일을 입력해주세요.",
      });
      return;
    }

    if (!emailChecked) {
      toast({
        variant: "destructive",
        title: "이메일 확인 필요",
        description: "이메일 중복확인을 먼저 해주세요.",
      });
      return;
    }

    if (emailAvailable !== true) {
      toast({
        variant: "destructive",
        title: "이메일 오류",
        description: "사용 가능한 이메일을 입력해주세요.",
      });
      return;
    }
    
    // Demo 모드 처리 (환경변수가 설정되지 않은 경우)
    if (!isSupabaseConfigured) {
      console.log('🟡 Demo 모드 회원가입');
      
      toast({
        title: "✅ Demo 회원가입 성공!",
        description: `${name}님 (${nickname}) 환영합니다! (Demo 모드) 이제 로그인할 수 있습니다.`,
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
      onOpenChange?.(false);
      return;
    }

    try {
      // members 테이블에 직접 저장 (닉네임을 user_id로 사용)
      const { error: insertError } = await (supabase as any)
        .from('members')
        .insert([
          {
            user_id: nickname,       // 닉네임을 user_id로 사용
            name: name,              // 이름 → name 컬럼
            email: email,            // 이메일 → email 컬럼
            password: password,      // 비밀번호 → password 컬럼
            phone: '',
            signup_type: 'email',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ]);

      if (insertError) throw insertError;

      toast({
        title: "회원가입 성공!",
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
      
      onOpenChange?.(false);
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        variant: "destructive",
        title: "회원가입 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>회원가입</DialogTitle>
          <DialogDescription>
            새 계정을 만들기 위해 필요한 정보를 입력하세요.
          </DialogDescription>
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
              !email.trim() || !emailChecked || emailAvailable !== true
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
