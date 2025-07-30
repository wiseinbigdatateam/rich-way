
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMyDiagnosis, PaginationInfo } from "@/hooks/useMyDiagnosis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  TrendingUp,
  Calendar,
  DollarSign,
  Clock,
  BarChart3,
  Target,
  Brain,
  Calculator,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const MyDiagnosis: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { diagnosisHistory, financialOverview, loading, error, pagination } = useMyDiagnosis(
    user?.user_id,
    currentPage,
    3
  );

  const hasDiagnosisHistory = diagnosisHistory && diagnosisHistory.length > 0;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDetailView = (item: any) => {
    const type = item.type === "MBTI 진단" ? "mbti" : "finance";
    navigate(`/diagnosis-detail/${type}/${item.id}`);
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="space-y-6">
        {/* 재무 개요 로딩 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* 진단 이력 로딩 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">진단 이력</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const financialData = {
    totalAssets: financialOverview?.totalAssets || 0,
    monthlyIncome: financialOverview?.monthlyIncome || 0,
    monthlyExpense: financialOverview?.monthlyExpense || 0,
    savingsRate: financialOverview?.savingsRate || 0,
  };

  return (
    <div className="space-y-6">
      {/* 1. 재무 개요 (Financial Overview) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 총 자산 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">총 자산</p>
                <p className="text-xl font-bold text-gray-900">
                  {financialData.totalAssets > 0 
                    ? `${(financialData.totalAssets / 10000).toFixed(0)}만원`
                    : "-"
                  }
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 월 수입 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">월 수입</p>
                <p className="text-xl font-bold text-gray-900">
                  {financialData.monthlyIncome > 0 
                    ? `${(financialData.monthlyIncome / 10000).toFixed(0)}만원`
                    : "-"
                  }
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 월 지출 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">월 지출</p>
                <p className="text-xl font-bold text-gray-900">
                  {financialData.monthlyExpense > 0 
                    ? `${(financialData.monthlyExpense / 10000).toFixed(0)}만원`
                    : "-"
                  }
                </p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 저축률 */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">저축률</p>
                <p className="text-xl font-bold text-gray-900">
                  {financialData.savingsRate > 0 
                    ? `${financialData.savingsRate}%`
                    : "-"
                  }
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. 진단 이력 (Diagnosis History) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            진단 이력
            {pagination.totalItems > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({pagination.totalItems}개)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasDiagnosisHistory ? (
            <div className="space-y-4">
              {diagnosisHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Calendar className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium text-gray-900">{item.type}</h3>
                        <Badge
                          variant={
                            item.status === "완료" || item.result === "양호" || item.result === "우수"
                              ? "default"
                              : item.result === "발전 필요"
                              ? "secondary"
                              : "outline"
                          }
                          className={
                            item.result === "양호" || item.result === "우수"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : item.result === "발전 필요"
                              ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
                              : ""
                          }
                        >
                          {item.result || item.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{item.date}</span>
                        {item.score && (
                          <span className="font-medium text-blue-600">
                            {item.score}점
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-4"
                    onClick={() => handleDetailView(item)}
                  >
                    상세보기
                  </Button>
                </div>
              ))}

              {/* 페이징 컨트롤 */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    {pagination.totalItems}개 중 {(currentPage - 1) * pagination.itemsPerPage + 1}-
                    {Math.min(currentPage * pagination.itemsPerPage, pagination.totalItems)}개
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPreviousPage}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      이전
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={pageNum === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                    >
                      다음
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>아직 진단 이력이 없습니다.</p>
              <p className="text-sm mt-1">진단을 진행해보세요!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. 추천 진단 (Recommended Diagnoses) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5" />
            추천 진단
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 투자 성향 진단 */}
            <Card className="border-2 border-gray-100 hover:border-blue-200 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">투자 성향 진단</h3>
                <p className="text-sm text-gray-600 mb-4">
                  당신의 투자 성향을 파악하여 맞춤형 투자 전략을 제안해드립니다.
                </p>
                <Button
                  className="w-full"
                  onClick={() => {
                    navigate('/diagnosis/mbti');
                  }}
                >
                  진단 시작하기
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* 부채 관리 진단 */}
            <Card className="border-2 border-gray-100 hover:border-green-200 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calculator className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">부채 관리 진단</h3>
                <p className="text-sm text-gray-600 mb-4">
                  현재 부채 상황을 분석하고 효율적인 관리 방법을 알아보세요.
                </p>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    navigate('/diagnosis/finance');
                  }}
                >
                  진단 시작하기
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyDiagnosis;
