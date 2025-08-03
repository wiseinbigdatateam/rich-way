import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Star, PiggyBank } from "lucide-react";
import MembersLoginDialog from "./MembersLoginDialog";
import SignupDialog from "./SignupDialog";

interface SaveResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (userData: any) => void;
  onSkip?: () => void;
}

const SaveResultModal = ({ isOpen, onClose, onLoginSuccess, onSkip }: SaveResultModalProps) => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showSignupDialog, setShowSignupDialog] = useState(false);

  const handleLoginClick = () => {
    setShowLoginDialog(true);
  };

  const handleSignupClick = () => {
    setShowSignupDialog(true);
  };

  const handleLoginSuccess = (userData: any) => {
    setShowLoginDialog(false);
    if (onLoginSuccess) {
      onLoginSuccess(userData);
    }
    // 메인 모달도 닫기
    onClose();
  };

  const handleSignupSuccess = (userData: any) => {
    setShowSignupDialog(false);
    if (onLoginSuccess) {
      onLoginSuccess(userData);
    }
    // 메인 모달도 닫기
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-red-600">
              <AlertTriangle className="w-5 h-5" />
              결과 저장 안내
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium mb-2">
                지금 페이지를 나가면 결과가 저장되지 않습니다
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-blue-800 font-medium">5초 회원가입하시고 결과를 저장하세요</span>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-600" />
                <span className="text-yellow-800 font-medium">부자되는 상품 추천해드립니다</span>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleLoginClick}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                로그인
              </Button>
              <Button 
                onClick={handleSignupClick}
                variant="outline"
                className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                회원가입
              </Button>
            </div>
            
            <div className="text-center">
              <Button 
                variant="ghost" 
                onClick={() => {
                  onClose();
                  if (onSkip) {
                    onSkip();
                  }
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                나중에 하기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 로그인 다이얼로그 */}
      <MembersLoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 회원가입 다이얼로그 */}
      <SignupDialog
        open={showSignupDialog}
        onOpenChange={setShowSignupDialog}
        onSignupSuccess={handleSignupSuccess}
      />
    </>
  );
};

export default SaveResultModal; 