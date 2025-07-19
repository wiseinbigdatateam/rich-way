import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { loginWithKakao, getKakaoUserInfo, initKakao } from "@/utils/kakaoAuth";

interface KakaoLoginButtonProps {
  onLoginSuccess?: (userData: any) => void;
  className?: string;
  children?: React.ReactNode;
}

const KakaoLoginButton = ({ onLoginSuccess, className, children }: KakaoLoginButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleKakaoLogin = async () => {
    try {
      setIsLoading(true);
      
      // 카카오 SDK 초기화
      initKakao();
      
      // 카카오 로그인 실행
      const authObj = await loginWithKakao();
      
      // 사용자 정보 가져오기
      const userInfo = await getKakaoUserInfo();
      
      // 로그인 성공 처리
      const userData = {
        id: userInfo.id,
        email: userInfo.kakao_account?.email,
        nickname: userInfo.properties?.nickname,
        profileImage: userInfo.properties?.profile_image,
        accessToken: authObj.access_token,
        loginType: 'kakao'
      };
      
      toast({
        title: "✅ 카카오 로그인 성공!",
        description: `${userData.nickname || '사용자'}님 환영합니다!`,
      });
      
      // 부모 컴포넌트에 로그인 성공 알림
      if (onLoginSuccess) {
        onLoginSuccess(userData);
      }
      
    } catch (error) {
      console.error('카카오 로그인 오류:', error);
      toast({
        title: "❌ 카카오 로그인 실패",
        description: "카카오 로그인 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleKakaoLogin}
      disabled={isLoading}
      className={`bg-yellow-400 hover:bg-yellow-500 text-black font-medium ${className || ''}`}
      variant="outline"
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          로그인 중...
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-black"
          >
            <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3zm5.907 7.184c-.372 0-.679.295-.679.659 0 .364.307.659.679.659.372 0 .679-.295.679-.659 0-.364-.307-.659-.679-.659zm-11.814 0c-.372 0-.679.295-.679.659 0 .364.307.659.679.659.372 0 .679-.295.679-.659 0-.364-.307-.659-.679-.659z"/>
          </svg>
          {children || "카카오로 로그인"}
        </div>
      )}
    </Button>
  );
};

export default KakaoLoginButton; 