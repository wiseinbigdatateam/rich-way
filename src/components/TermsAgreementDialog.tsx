import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { ExternalLink, Eye, X } from "lucide-react";

interface TermsAgreementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgreementComplete: (agreements: {
    termsOfService: boolean;
    privacyPolicy: boolean;
    marketing: boolean;
  }) => void;
}

const TermsAgreementDialog: React.FC<TermsAgreementDialogProps> = ({
  open,
  onOpenChange,
  onAgreementComplete,
}) => {
  const [agreements, setAgreements] = useState({
    termsOfService: false,
    privacyPolicy: false,
    marketing: false,
  });
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [currentTermsType, setCurrentTermsType] = useState<'terms' | 'privacy'>('terms');

  const handleAllAgreementChange = (checked: boolean) => {
    setAgreements({
      termsOfService: checked,
      privacyPolicy: checked,
      marketing: checked,
    });
  };

  const handleIndividualAgreementChange = (type: keyof typeof agreements, checked: boolean) => {
    setAgreements(prev => ({
      ...prev,
      [type]: checked,
    }));
  };

  const handleViewTerms = (type: 'terms' | 'privacy') => {
    setCurrentTermsType(type);
    if (type === 'terms') {
      setShowTermsModal(true);
    } else {
      setShowPrivacyModal(true);
    }
  };

  const handleConfirm = () => {
    if (!agreements.termsOfService || !agreements.privacyPolicy) {
      return;
    }
    onAgreementComplete(agreements);
  };

  const isAllChecked = agreements.termsOfService && agreements.privacyPolicy && agreements.marketing;
  const isRequiredChecked = agreements.termsOfService && agreements.privacyPolicy;

  // 약관 내용
  const termsContent = (
    <div className="space-y-4 text-sm">
      <h2 className="text-lg font-semibold">제1조 (목적)</h2>
      <p>
        이 약관은 주식회사 와이즈인컴퍼니(이하 "회사")가 제공하는 재무진단 및 MBTI 진단 서비스(이하 "서비스")를 이용함에 있어 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
      </p>

      <h2 className="text-lg font-semibold">제2조 (정의)</h2>
      <ol className="list-decimal list-inside space-y-2">
        <li>"서비스"는 회사가 제공하는 재무진단, MBTI 진단 및 관련 교육 서비스를 의미합니다.</li>
        <li>"회원"은 회사와 서비스 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.</li>
        <li>"회원가입"은 회사가 제공하는 서비스를 이용하기 위해 회사와 서비스 이용계약을 체결하는 행위를 말합니다.</li>
        <li>"진단결과"는 회원이 서비스를 이용하여 얻은 재무진단 및 MBTI 진단 결과를 의미합니다.</li>
      </ol>

      <h2 className="text-lg font-semibold">제3조 (약관의 효력 및 변경)</h2>
      <ol className="list-decimal list-inside space-y-2">
        <li>이 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.</li>
        <li>회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이 약관을 변경할 수 있습니다.</li>
        <li>약관이 변경되는 경우 회사는 변경사항을 시행일자 7일 전부터 공지합니다.</li>
        <li>회원이 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.</li>
      </ol>

      <h2 className="text-lg font-semibold">제6조 (회원가입)</h2>
      <ol className="list-decimal list-inside space-y-2">
        <li>회원가입은 회원이 약관의 내용에 대하여 동의를 한 다음 회원가입신청을 하고 회사가 이러한 신청에 대하여 승낙함으로써 완료됩니다.</li>
        <li>회사는 다음 각 호에 해당하는 신청에 대하여는 승낙하지 않을 수 있습니다:
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>기술상 서비스 제공이 불가능한 경우</li>
            <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
            <li>허위의 정보를 기재하거나 회사가 요구하는 내용을 기재하지 않은 경우</li>
            <li>사회의 안녕과 질서, 미풍양속을 저해할 목적으로 신청한 경우</li>
          </ul>
        </li>
      </ol>

      <div className="mt-6 p-3 bg-gray-100 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>부칙</strong><br />
          이 약관은 2025년 8월 5일부터 시행합니다.
        </p>
      </div>
    </div>
  );

  // 개인정보처리방침 내용
  const privacyContent = (
    <div className="space-y-4 text-sm">
      <h2 className="text-lg font-semibold">1. 수집하는 개인정보</h2>
      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-blue-800">
          <strong>필수항목:</strong> 닉네임, 이름, 이메일, 비밀번호<br />
          <strong>선택항목:</strong> 전화번호, 프로필 정보
        </p>
      </div>

      <h2 className="text-lg font-semibold">2. 개인정보의 수집 및 이용목적</h2>
      <ul className="list-disc list-inside space-y-2">
        <li><strong>서비스 제공:</strong> 재무진단, MBTI 진단 서비스 제공</li>
        <li><strong>회원 관리:</strong> 회원가입, 회원정보 관리, 서비스 이용</li>
        <li><strong>진단 결과 관리:</strong> 진단 결과 저장 및 이력 관리</li>
        <li><strong>커뮤니티 서비스:</strong> 게시글 작성 및 댓글 서비스</li>
        <li><strong>고객 지원:</strong> 문의사항 처리 및 고객 지원</li>
      </ul>

      <h2 className="text-lg font-semibold">3. 개인정보의 보관 및 이용기간</h2>
      <div className="bg-yellow-50 p-3 rounded-lg">
        <p className="text-yellow-800">
          <strong>회원가입 해지 시까지</strong><br />
          회원가입 해지 후에는 즉시 개인정보가 삭제됩니다.
        </p>
      </div>

      <h2 className="text-lg font-semibold">4. 개인정보의 제3자 제공</h2>
      <p>
        회사는 원칙적으로 회원의 개인정보를 제1조(수집 및 이용목적)에서 명시한 범위 내에서 처리하며, 회원의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
      </p>

      <h2 className="text-lg font-semibold">5. 개인정보의 처리위탁</h2>
      <p>회사는 서비스 향상을 위해서 아래와 같이 개인정보를 위탁하고 있습니다.</p>
      <ul className="list-disc list-inside space-y-2">
        <li><strong>Supabase:</strong> 데이터베이스 및 인증 서비스</li>
        <li><strong>AWS:</strong> 클라우드 인프라 및 파일 저장</li>
      </ul>

      <h2 className="text-lg font-semibold">6. 정보주체의 권리·의무 및 그 행사방법</h2>
      <p>이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.</p>
      <ol className="list-decimal list-inside space-y-2">
        <li><strong>개인정보 열람요구:</strong> 개인정보보호법 제35조에 따른 개인정보의 열람</li>
        <li><strong>오류 등이 있을 경우 정정·삭제요구:</strong> 개인정보보호법 제36조에 따른 개인정보의 정정·삭제</li>
        <li><strong>처리정지 요구:</strong> 개인정보보호법 제37조에 따른 개인정보의 처리정지</li>
        <li><strong>개인정보처리 위탁 중단 요구:</strong> 개인정보보호법 제39조의3에 따른 개인정보처리 위탁 중단</li>
      </ol>

      <div className="mt-6 p-3 bg-gray-100 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>부칙</strong><br />
          이 개인정보처리방침은 2025년 8월 5일부터 시행합니다.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div className="w-8 h-1 bg-green-600 mx-2"></div>
              <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
            </div>
            <DialogTitle className="text-xl font-bold">
              서비스 이용약관에 동의해주세요
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">1단계: 약관 동의</p>
          </div>
        </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* 전체 동의 */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="all-agreement"
                  checked={isAllChecked}
                  onCheckedChange={handleAllAgreementChange}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <label
                  htmlFor="all-agreement"
                  className="text-lg font-semibold text-blue-900 cursor-pointer"
                >
                  네, 모두 동의합니다.
                </label>
              </div>
            </div>

            {/* 개별 약관 동의 */}
            <div className="space-y-3">
              {/* 서비스 이용약관 */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="terms-of-service"
                    checked={agreements.termsOfService}
                    onCheckedChange={(checked) => 
                      handleIndividualAgreementChange('termsOfService', checked as boolean)
                    }
                    className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <label
                    htmlFor="terms-of-service"
                    className="text-sm font-medium cursor-pointer"
                  >
                    [필수] 서비스 이용약관에 동의합니다.
                  </label>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewTerms('terms')}
                  className="text-blue-600 hover:text-blue-800 p-2"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  보기
                </Button>
              </div>

              {/* 개인정보 수집 및 이용 */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="privacy-policy"
                    checked={agreements.privacyPolicy}
                    onCheckedChange={(checked) => 
                      handleIndividualAgreementChange('privacyPolicy', checked as boolean)
                    }
                    className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <label
                    htmlFor="privacy-policy"
                    className="text-sm font-medium cursor-pointer"
                  >
                    [필수] 개인정보 수집 및 이용에 동의합니다.
                  </label>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewTerms('privacy')}
                  className="text-blue-600 hover:text-blue-800 p-2"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  보기
                </Button>
              </div>

              {/* 마케팅 정보 수집 및 이용 */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="marketing"
                    checked={agreements.marketing}
                    onCheckedChange={(checked) => 
                      handleIndividualAgreementChange('marketing', checked as boolean)
                    }
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <label
                    htmlFor="marketing"
                    className="text-sm font-medium cursor-pointer"
                  >
                    [선택] 마케팅 정보 수집 및 이용에 동의합니다.
                  </label>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewTerms('privacy')}
                  className="text-blue-600 hover:text-blue-800 p-2"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  보기
                </Button>
              </div>
            </div>

            {/* 안내 문구 */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>• 필수 항목에 동의하지 않으시면 서비스 이용이 제한됩니다.</p>
              <p>• 선택 항목은 동의하지 않아도 서비스 이용이 가능합니다.</p>
              <p>• 약관 내용은 '보기' 버튼을 클릭하여 확인하실 수 있습니다.</p>
            </div>

            {/* 확인 버튼 */}
            <div className="pt-4">
              <Button
                onClick={handleConfirm}
                disabled={!isRequiredChecked}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isRequiredChecked ? "동의하고 계속하기" : "필수 항목에 동의해주세요"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 약관 내용 모달 */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto [&>button]:hidden">
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-xl font-bold">
              {currentTermsType === 'terms' ? '서비스 이용약관' : '개인정보처리방침'}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTermsModal(false)}
              className="p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="py-4">
            {currentTermsType === 'terms' ? termsContent : privacyContent}
          </div>
        </DialogContent>
      </Dialog>

      {/* 개인정보처리방침 모달 */}
      <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto [&>button]:hidden">
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="text-xl font-bold">
              개인정보처리방침
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPrivacyModal(false)}
              className="p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="py-4">
            {privacyContent}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TermsAgreementDialog; 