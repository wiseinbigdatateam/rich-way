import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicyPage: React.FC = () => {
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
              개인정보처리방침
            </CardTitle>
            <p className="text-sm text-gray-500 text-center">
              최종 수정일: 2025년 8월 5일
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4">1. 수집하는 개인정보</h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-800">
                  <strong>필수항목:</strong> 닉네임, 이름, 이메일, 비밀번호<br />
                  <strong>선택항목:</strong> 전화번호, 프로필 정보
                </p>
              </div>

              <h2 className="text-xl font-semibold mb-4">2. 개인정보의 수집 및 이용목적</h2>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li><strong>서비스 제공:</strong> 재무진단, MBTI 진단 서비스 제공</li>
                <li><strong>회원 관리:</strong> 회원가입, 회원정보 관리, 서비스 이용</li>
                <li><strong>진단 결과 관리:</strong> 진단 결과 저장 및 이력 관리</li>
                <li><strong>커뮤니티 서비스:</strong> 게시글 작성 및 댓글 서비스</li>
                <li><strong>고객 지원:</strong> 문의사항 처리 및 고객 지원</li>
              </ul>

              <h2 className="text-xl font-semibold mb-4">3. 개인정보의 보관 및 이용기간</h2>
              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>회원가입 해지 시까지</strong><br />
                  회원가입 해지 후에는 즉시 개인정보가 삭제됩니다.
                </p>
              </div>
              <p className="mb-4">
                단, 회원가입 해지 시에도 다음의 경우에는 법정 보관기간 동안 개인정보가 보관됩니다:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>상법: 상업장부 및 영업에 관한 중요서류 (10년)</li>
                <li>전자상거래법: 계약 또는 청약철회 등에 관한 기록 (5년)</li>
                <li>전자상거래법: 대금결제 및 재화 등의 공급에 관한 기록 (5년)</li>
                <li>전자상거래법: 소비자의 불만 또는 분쟁처리에 관한 기록 (3년)</li>
                <li>전자상거래법: 표시·광고에 관한 기록 (6개월)</li>
              </ul>

              <h2 className="text-xl font-semibold mb-4">4. 개인정보의 제3자 제공</h2>
              <p className="mb-4">
                회사는 원칙적으로 회원의 개인정보를 제1조(수집 및 이용목적)에서 명시한 범위 내에서 처리하며, 회원의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
              </p>

              <h2 className="text-xl font-semibold mb-4">5. 개인정보의 처리위탁</h2>
              <p className="mb-4">
                회사는 서비스 향상을 위해서 아래와 같이 개인정보를 위탁하고 있으며, 관계 법령에 따라 위탁계약 시 개인정보가 안전하게 관리될 수 있도록 필요한 사항을 규정하고 있습니다.
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li><strong>Supabase:</strong> 데이터베이스 및 인증 서비스</li>
                <li><strong>AWS:</strong> 클라우드 인프라 및 파일 저장</li>
              </ul>

              <h2 className="text-xl font-semibold mb-4">6. 정보주체의 권리·의무 및 그 행사방법</h2>
              <p className="mb-4">이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.</p>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li><strong>개인정보 열람요구:</strong> 개인정보보호법 제35조에 따른 개인정보의 열람</li>
                <li><strong>오류 등이 있을 경우 정정·삭제요구:</strong> 개인정보보호법 제36조에 따른 개인정보의 정정·삭제</li>
                <li><strong>처리정지 요구:</strong> 개인정보보호법 제37조에 따른 개인정보의 처리정지</li>
                <li><strong>개인정보처리 위탁 중단 요구:</strong> 개인정보보호법 제39조의3에 따른 개인정보처리 위탁 중단</li>
              </ol>

              <h2 className="text-xl font-semibold mb-4">7. 개인정보의 파기</h2>
              <p className="mb-4">회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li><strong>전자적 파일 형태:</strong> 복구 및 재생이 불가능한 방법으로 영구 삭제</li>
                <li><strong>종이에 출력된 개인정보:</strong> 분쇄기로 분쇄하거나 소각을 통한 파기</li>
              </ul>

              <h2 className="text-xl font-semibold mb-4">8. 개인정보의 안전성 확보 조치</h2>
              <p className="mb-4">회사는 개인정보보호법 제29조에 따라 다음과 같은 안전성 확보 조치를 취하고 있습니다.</p>
              <ol className="list-decimal list-inside space-y-2 mb-4">
                <li><strong>개인정보의 암호화:</strong> 이용자의 개인정보는 비밀번호는 암호화되어 저장 및 관리되고 있어, 본인만이 알 수 있으며 중요한 데이터는 파일 및 전송 데이터를 암호화하여 사용합니다.</li>
                <li><strong>해킹 등에 대비한 기술적 대책:</strong> 회사는 해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위하여 보안프로그램을 설치하고 주기적인 갱신·점검을 하며 외부로부터 접근이 통제된 구역에 시스템을 설치하고 기술적/물리적으로 감시 및 차단하고 있습니다.</li>
                <li><strong>개인정보에 대한 접근 제한:</strong> 개인정보를 처리하는 데이터베이스시스템에 대한 접근권한의 부여, 변경, 말소를 통하여 개인정보에 대한 접근통제를 위하여 필요한 조치를 하고 있으며 침입차단시스템을 이용하여 외부로부터의 무단 접근을 통제하고 있습니다.</li>
                <li><strong>접속기록의 보관 및 위변조 방지:</strong> 개인정보처리시스템에 접속한 기록을 최소 6개월 이상 보관, 관리하고 있으며, 접속 기록이 위변조 및 도난, 분실되지 않도록 보안기능을 사용하고 있습니다.</li>
                <li><strong>개인정보의 정기적인 파기:</strong> 불필요한 개인정보는 개인정보보호책임자의 승인을 받아 즉시 파기하고 있습니다.</li>
              </ol>

              <h2 className="text-xl font-semibold mb-4">9. 개인정보 보호책임자</h2>
              <p className="mb-4">회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm">
                  <strong>개인정보 보호책임자</strong><br />
                  성명: 김진성<br />
                  직책: 대표이사<br />
                  연락처: privacy@rich-way.co.kr<br />
                  주소: 서울특별시 강남구 테헤란로 123, 456호
                </p>
              </div>

              <h2 className="text-xl font-semibold mb-4">10. 개인정보 처리방침의 변경</h2>
              <p className="mb-4">
                이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
              </p>

              <h2 className="text-xl font-semibold mb-4">11. 개인정보의 안전성 확보 조치</h2>
              <p className="mb-4">회사는 개인정보보호법 제29조에 따라 다음과 같은 안전성 확보 조치를 취하고 있습니다.</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>개인정보의 암호화</li>
                <li>해킹 등에 대비한 기술적 대책</li>
                <li>개인정보에 대한 접근 제한</li>
                <li>접속기록의 보관 및 위변조 방지</li>
                <li>개인정보의 정기적인 파기</li>
              </ul>

              <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>부칙</strong><br />
                  이 개인정보처리방침은 2025년 8월 5일부터 시행합니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 