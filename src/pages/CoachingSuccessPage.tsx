import { CheckCircle, ArrowRight, Home, Calendar, User, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { Link, useLocation } from "react-router-dom";

const CoachingSuccessPage = () => {
  const location = useLocation();
  
  // location.state에서 신청 정보 가져오기
  const applicationId = location.state?.applicationId || "";
  const expertName = location.state?.expertName || "전문가";
  const expertCompany = location.state?.expertCompany || "";
  const planName = location.state?.planName || "";
  const planPrice = location.state?.planPrice || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              코칭신청 접수가 완료되었습니다
            </h1>
            <p className="text-xl text-slate-600 mb-6">
              전문가가 신청 내용을 검토한 후 빠른 시일 내에 연락드리겠습니다.
            </p>
            {applicationId && (
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                신청번호: {applicationId}
              </div>
            )}
          </div>

          {/* 신청 정보 요약 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>신청 정보</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">전문가 정보</h3>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-blue-600">{expertName}</p>
                    {expertCompany && (
                      <p className="text-sm text-gray-600">{expertCompany} 전문가</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">선택 요금제</h3>
                  <div className="space-y-2">
                    {planName && (
                      <Badge variant="secondary" className="text-sm">
                        {planName}
                      </Badge>
                    )}
                    {planPrice && (
                      <p className="text-lg font-semibold text-green-600">{planPrice}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 다음 단계 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>다음 단계</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">신청서 검토</h3>
                    <p className="text-sm text-gray-600 mb-2">전문가가 신청 내용을 상세히 검토합니다.</p>
                    <Badge variant="outline" className="text-xs">
                      예상 소요시간: 1-2시간
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">일정 조율</h3>
                    <p className="text-sm text-gray-600 mb-2">1-2일 내로 연락드려 상담 일정을 조율합니다.</p>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">전화 또는 문자로 연락</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">코칭 시작</h3>
                    <p className="text-sm text-gray-600 mb-2">약속된 시간에 맞춤형 코칭을 받으실 수 있습니다.</p>
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      1:1 맞춤 상담
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 안내사항 */}
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <h3 className="font-semibold text-blue-900">📋 참고사항</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• 전문가가 신청서를 검토 후 맞춤형 코칭 계획을 준비합니다</p>
                  <p>• 코칭 전 사전 자료나 준비사항이 있다면 미리 안내드립니다</p>
                  <p>• 상담 시간 변경이 필요한 경우 최소 2시간 전에 연락해주세요</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 연락처 및 액션 버튼 */}
          <div className="text-center space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-3">문의사항이 있으시면 언제든지 연락주세요</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">고객센터:</span>
                  <span className="text-blue-600">1588-0000</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">이메일:</span>
                  <span className="text-blue-600">coaching@richway.com</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/coaching">
                <Button variant="outline" className="w-full sm:w-auto">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  다른 전문가 보기
                </Button>
              </Link>
              <Link to="/mypage">
                <Button variant="outline" className="w-full sm:w-auto">
                  <User className="w-4 h-4 mr-2" />
                  내 신청 내역 보기
                </Button>
              </Link>
              <Link to="/">
                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                  <Home className="w-4 h-4 mr-2" />
                  홈으로 돌아가기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachingSuccessPage;
