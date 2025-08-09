import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            뒤로가기
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              이용약관
            </CardTitle>
            <p className="text-sm text-gray-500 text-center">
              최종 수정일: 2025년 8월 5일
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4">제1조 (목적)</h2>
              <p className="mb-4">
                이 약관은 주식회사 와이즈인컴퍼니(이하 "회사")가 제공하는 재무진단 및 MBTI 진단 서비스(이하 "서비스")를 이용함에 있어 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>

              <h2 className="text-xl font-semibold mb-4">제2조 (정의)</h2>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>"서비스"는 회사가 제공하는 재무진단, MBTI 진단 및 관련 교육 서비스를 의미합니다.</li>
                <li>"회원"은 회사와 서비스 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.</li>
                <li>"회원가입"은 회사가 제공하는 서비스를 이용하기 위해 회사와 서비스 이용계약을 체결하는 행위를 말합니다.</li>
                <li>"진단결과"는 회원이 서비스를 이용하여 얻은 재무진단 및 MBTI 진단 결과를 의미합니다.</li>
              </ol>

              <h2 className="text-xl font-semibold mb-4">제3조 (약관의 효력 및 변경)</h2>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>이 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.</li>
                <li>회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이 약관을 변경할 수 있습니다.</li>
                <li>약관이 변경되는 경우 회사는 변경사항을 시행일자 7일 전부터 공지합니다.</li>
                <li>회원이 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.</li>
              </ol>

              <h2 className="text-xl font-semibold mb-4">제4조 (서비스의 제공)</h2>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>회사는 다음과 같은 서비스를 제공합니다:
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>재무진단 서비스</li>
                    <li>MBTI 진단 서비스</li>
                    <li>진단 결과 저장 및 관리</li>
                    <li>커뮤니티 서비스</li>
                    <li>교육 콘텐츠 제공</li>
                  </ul>
                </li>
                <li>서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.</li>
                <li>회사는 서비스의 제공에 필요한 경우 정기점검을 실시할 수 있으며, 정기점검시간은 서비스제공화면에 공지한 바에 따릅니다.</li>
              </ol>

              <h2 className="text-xl font-semibold mb-4">제5조 (서비스의 중단)</h2>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.</li>
                <li>회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 회원 또는 제3자가 입은 손해에 대하여 배상하지 아니합니다.</li>
              </ol>

              <h2 className="text-xl font-semibold mb-4">제6조 (회원가입)</h2>
              <ol className="list-decimal list-inside space-y-2 mb-4">
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

              <h2 className="text-xl font-semibold mb-4">제7조 (회원의 의무)</h2>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>회원은 다음 행위를 하여서는 안 됩니다:
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>신청 또는 변경 시 허위내용의 등록</li>
                    <li>타인의 정보 도용</li>
                    <li>회사가 게시한 정보의 변경</li>
                    <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                    <li>회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                    <li>회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                    <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
                  </ul>
                </li>
                <li>회원은 관계법령, 이 약관의 규정, 이용안내 및 서비스상에 공지한 주의사항, 회사가 통지하는 사항 등을 준수하여야 합니다.</li>
              </ol>

              <h2 className="text-xl font-semibold mb-4">제8조 (회사의 의무)</h2>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>회사는 관련법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 이 약관이 정하는 바에 따라 지속적이고, 안정적으로 서비스를 제공하기 위하여 노력합니다.</li>
                <li>회사는 회원이 안전하게 서비스를 이용할 수 있도록 개인정보(신용정보 포함) 보호를 위한 보안 시스템을 구축하고 개인정보처리방침을 공시하고 준수합니다.</li>
                <li>회사는 서비스 이용과 관련하여 회원으로부터 제기된 의견이나 불만이 정당하다고 객관적으로 인정될 경우에는 적절한 절차를 거쳐 즉시 처리하여야 합니다.</li>
              </ol>

              <h2 className="text-xl font-semibold mb-4">제9조 (개인정보보호)</h2>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>회사는 관련법령이 정하는 바에 따라 회원의 개인정보를 보호하며, 개인정보의 보호 및 사용에 대해서는 관련법령 및 회사가 정하는 개인정보처리방침이 정한 바에 따릅니다.</li>
                <li>회사는 서비스 제공을 위해 필요한 최소한의 개인정보만을 수집합니다.</li>
                <li>회원은 언제든지 개인정보 열람, 정정, 삭제, 처리정지를 요구할 수 있습니다.</li>
              </ol>

              <h2 className="text-xl font-semibold mb-4">제10조 (진단결과의 보관 및 관리)</h2>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>회사는 회원의 진단결과를 안전하게 보관하고 관리합니다.</li>
                <li>진단결과는 회원가입 해지 시까지 보관되며, 해지 후에는 즉시 삭제됩니다.</li>
                <li>회원은 언제든지 자신의 진단결과를 삭제할 수 있습니다.</li>
              </ol>

              <h2 className="text-xl font-semibold mb-4">제11조 (서비스 이용료)</h2>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>기본 서비스는 무료로 제공됩니다.</li>
                <li>추가 서비스나 프리미엄 기능의 경우 별도의 이용료가 발생할 수 있으며, 이는 서비스 내에서 별도로 안내됩니다.</li>
              </ol>

              <h2 className="text-xl font-semibold mb-4">제12조 (회원탈퇴 및 자격 상실)</h2>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>회원은 회사에 언제든지 탈퇴를 요청할 수 있으며 회사는 즉시 회원탈퇴를 처리합니다.</li>
                <li>회원이 다음 각호의 사유에 해당하는 경우, 회사는 회원자격을 제한 및 정지시킬 수 있습니다:
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>가입 신청 시에 허위 내용을 등록한 경우</li>
                    <li>다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우</li>
                    <li>서비스를 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</li>
                  </ul>
                </li>
              </ol>

              <h2 className="text-xl font-semibold mb-4">제13조 (면책조항)</h2>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</li>
                <li>회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.</li>
                <li>회사는 회원이 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며, 그 밖의 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.</li>
              </ol>

              <h2 className="text-xl font-semibold mb-4">제14조 (분쟁해결)</h2>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치·운영합니다.</li>
                <li>회사와 이용자 간에 발생한 전자상거래 분쟁에 관하여는 소비자분쟁조정위원회의 조정에 따를 수 있습니다.</li>
              </ol>

              <h2 className="text-xl font-semibold mb-4">제15조 (재판권 및 준거법)</h2>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>회사와 이용자 간에 발생한 분쟁에 관하여는 대한민국 법을 적용합니다.</li>
                <li>회사와 이용자 간에 제기된 소송에는 대한민국 법원을 관할법원으로 합니다.</li>
              </ol>

              <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>부칙</strong><br />
                  이 약관은 2025년 8월 5일부터 시행합니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsPage; 