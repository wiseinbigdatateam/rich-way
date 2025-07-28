import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, User, FileText, TrendingUp, Calculator } from "lucide-react";

interface DiagnosisDetail {
  id: string;
  type: string;
  date: string;
  score?: number;
  status: string;
  result: string;
  reportContent?: any;
  responses?: any;
}

const DiagnosisDetailPage: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState<DiagnosisDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiagnosisDetail = async () => {
      if (!type || !id) {
        setError("진단 정보를 찾을 수 없습니다.");
        setLoading(false);
        return;
      }

      try {
        let data: any = null;
        let error: any = null;

        if (type === "mbti") {
          const result = await supabase
            .from("mbti_diagnosis")
            .select("*")
            .eq("id", id)
            .single();
          data = result.data;
          error = result.error;
        } else if (type === "finance") {
          const result = await supabase
            .from("finance_diagnosis")
            .select("*")
            .eq("id", id)
            .single();
          data = result.data;
          error = result.error;
        }

        if (error) {
          throw error;
        }

        if (data) {
          const diagnosisDetail: DiagnosisDetail = {
            id: data.id,
            type: type === "mbti" ? "MBTI 진단" : "재무 진단",
            date: new Date(data.created_at).toLocaleDateString('ko-KR'),
            status: "완료",
            result: type === "mbti" ? data.result_type : "재무 분석 완료",
            reportContent: data.report_content,
            responses: data.responses
          };

          // 재무 진단의 경우 점수 계산
          if (type === "finance" && data.report_content) {
            try {
              // report_content가 문자열인지 객체인지 확인
              let report;
              if (typeof data.report_content === 'string') {
                report = JSON.parse(data.report_content);
              } else {
                report = data.report_content;
              }
              
              // 최신 데이터 구조 (summary.financialHealth.score 사용)
              if (report.summary && report.summary.financialHealth) {
                diagnosisDetail.score = report.summary.financialHealth.score;
                diagnosisDetail.result = report.summary.financialHealth.level === 'excellent' ? '우수' : 
                                       report.summary.financialHealth.level === 'good' ? '양호' : 
                                       report.summary.financialHealth.level === 'fair' ? '보통' : '개선 필요';
              }
              // 이전 데이터 구조 (analysis 텍스트 기반)
              else if (report.analysis) {
                if (report.analysis.includes("우수")) {
                  diagnosisDetail.result = "우수";
                  diagnosisDetail.score = 85;
                } else if (report.analysis.includes("안정")) {
                  diagnosisDetail.result = "양호";
                  diagnosisDetail.score = 75;
                } else if (report.analysis.includes("개선")) {
                  diagnosisDetail.result = "발전 필요";
                  diagnosisDetail.score = 65;
                }
              }
            } catch (e) {
              console.log("재무 진단 결과 파싱 오류:", e);
              // 파싱 실패 시 기본값 설정
              diagnosisDetail.result = "재무 분석 완료";
              diagnosisDetail.score = 70;
            }
          }

          setDiagnosis(diagnosisDetail);
        } else {
          setError("진단 정보를 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("진단 상세 정보 조회 오류:", err);
        setError("진단 정보를 불러오는 중 오류가 발생했습니다.");
      }
      setLoading(false);
    };

    fetchDiagnosisDetail();
  }, [type, id]);

  const handleBack = () => {
    navigate("/mypage?tab=diagnosis");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !diagnosis) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="outline" onClick={handleBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로 가기
          </Button>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-gray-500">{error || "진단 정보를 찾을 수 없습니다."}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로 가기
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{diagnosis.type} 상세 결과</h1>
            <p className="text-gray-600">진단 결과와 분석 내용을 확인하세요</p>
          </div>
        </div>

        {/* 진단 기본 정보 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {diagnosis.type === "MBTI 진단" ? (
                <TrendingUp className="w-5 h-5 text-blue-600" />
              ) : (
                <Calculator className="w-5 h-5 text-green-600" />
              )}
              {diagnosis.type}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">진단일</span>
                <span className="font-medium">{diagnosis.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">결과</span>
                <Badge
                  variant={
                    diagnosis.result === "양호" || diagnosis.result === "우수" || diagnosis.result === "ENTJ"
                      ? "default"
                      : "secondary"
                  }
                  className={
                    diagnosis.result === "양호" || diagnosis.result === "우수"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : diagnosis.result === "발전 필요"
                      ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
                      : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                  }
                >
                  {diagnosis.result}
                </Badge>
              </div>
              {diagnosis.score && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">점수</span>
                  <span className="font-medium text-blue-600">{diagnosis.score}점</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 진단 결과 상세 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>진단 결과 분석</CardTitle>
          </CardHeader>
          <CardContent>
            {diagnosis.reportContent ? (
              <div className="space-y-6">
                {diagnosis.type === "MBTI 진단" ? (
                  <div>
                    <div className="mb-6">
                      <h3 className="font-semibold text-2xl mb-4 text-blue-600">성격 유형: {diagnosis.result}</h3>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-gray-700 leading-relaxed text-lg">
                          {typeof diagnosis.reportContent === 'string' 
                            ? JSON.parse(diagnosis.reportContent).description 
                            : diagnosis.reportContent.description}
                        </p>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-3 text-gray-800">주요 특징</h4>
                        <ul className="space-y-2 text-gray-700">
                          {diagnosis.result === "ENTJ" && (
                            <>
                              <li>• 리더십과 조직 관리 능력이 뛰어남</li>
                              <li>• 전략적 사고와 계획 수립에 능함</li>
                              <li>• 효율성과 결과 지향적</li>
                              <li>• 논리적이고 분석적인 의사결정</li>
                            </>
                          )}
                          {diagnosis.result === "INTJ" && (
                            <>
                              <li>• 독창적이고 혁신적인 사고</li>
                              <li>• 장기적 비전과 전략 수립</li>
                              <li>• 높은 지적 능력과 분석력</li>
                              <li>• 완벽주의적 성향</li>
                            </>
                          )}
                          {diagnosis.result === "ENFP" && (
                            <>
                              <li>• 열정적이고 창의적인 성격</li>
                              <li>• 사람들과의 관계를 중시</li>
                              <li>• 새로운 가능성을 발견하는 능력</li>
                              <li>• 적응력과 유연성이 뛰어남</li>
                            </>
                          )}
                          {diagnosis.result === "ISTP" && (
                            <>
                              <li>• 실용적이고 현실적인 접근</li>
                              <li>• 문제 해결 능력이 뛰어남</li>
                              <li>• 도구와 기계를 다루는 능력</li>
                              <li>• 독립적이고 자유로운 성향</li>
                            </>
                          )}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-lg mb-3 text-gray-800">개발 방향</h4>
                        <ul className="space-y-2 text-gray-700">
                          {diagnosis.result === "ENTJ" && (
                            <>
                              <li>• 감정적 공감 능력 개발</li>
                              <li>• 팀원들의 감정 고려하기</li>
                              <li>• 인내심과 관용 기르기</li>
                              <li>• 완벽주의 완화하기</li>
                            </>
                          )}
                          {diagnosis.result === "INTJ" && (
                            <>
                              <li>• 대인관계 기술 향상</li>
                              <li>• 감정 표현 능력 개발</li>
                              <li>• 팀워크와 협력 강화</li>
                              <li>• 실용적 사고 균형 맞추기</li>
                            </>
                          )}
                          {diagnosis.result === "ENFP" && (
                            <>
                              <li>• 집중력과 완성도 향상</li>
                              <li>• 체계적 계획 수립 능력</li>
                              <li>• 감정적 안정성 기르기</li>
                              <li>• 우선순위 설정 능력</li>
                            </>
                          )}
                          {diagnosis.result === "ISTP" && (
                            <>
                              <li>• 장기적 계획 수립 능력</li>
                              <li>• 감정적 교류 능력 개발</li>
                              <li>• 팀워크와 협력 강화</li>
                              <li>• 추상적 사고 능력 향상</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-6">
                      <h3 className="font-semibold text-2xl mb-4 text-green-600">재무 상태 분석</h3>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-gray-700 leading-relaxed text-lg">
                          {(() => {
                            try {
                              const report = typeof diagnosis.reportContent === 'string' 
                                ? JSON.parse(diagnosis.reportContent) 
                                : diagnosis.reportContent;
                              return report.summary?.financialHealth?.description || report.analysis || "재무 분석이 완료되었습니다.";
                            } catch (e) {
                              return "재무 분석이 완료되었습니다.";
                            }
                          })()}
                        </p>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-3 text-gray-800">주요 추천사항</h4>
                        <ul className="space-y-2 text-gray-700">
                          {(() => {
                            try {
                              const report = typeof diagnosis.reportContent === 'string' 
                                ? JSON.parse(diagnosis.reportContent) 
                                : diagnosis.reportContent;
                              const recommendations = report.recommendations || [];
                              return recommendations.slice(0, 5).map((rec: any, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-green-600 font-bold">•</span>
                                  <span>{rec.reason || rec}</span>
                                </li>
                              ));
                            } catch (e) {
                              return (
                                <>
                                  <li className="flex items-start gap-2">
                                    <span className="text-green-600 font-bold">•</span>
                                    <span>투자 포트폴리오 다각화</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-green-600 font-bold">•</span>
                                    <span>비상금 확보</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-green-600 font-bold">•</span>
                                    <span>보험 상품 검토</span>
                                  </li>
                                </>
                              );
                            }
                          })()}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-lg mb-3 text-gray-800">재무 건강도</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">종합 점수</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full" 
                                  style={{ width: `${Math.min(diagnosis.score || 75, 100)}%` }}
                                ></div>
                              </div>
                              <span className="font-semibold text-green-600">{diagnosis.score || 75}점</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">저축률</span>
                            <span className="font-semibold text-blue-600">
                              {(() => {
                                try {
                                  const report = typeof diagnosis.reportContent === 'string' 
                                    ? JSON.parse(diagnosis.reportContent) 
                                    : diagnosis.reportContent;
                                  return report.summary?.financialHealth?.detail?.savingsRate || 20;
                                } catch (e) {
                                  return 20;
                                }
                              })()}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">부채비율</span>
                            <span className="font-semibold text-orange-600">
                              {(() => {
                                try {
                                  const report = typeof diagnosis.reportContent === 'string' 
                                    ? JSON.parse(diagnosis.reportContent) 
                                    : diagnosis.reportContent;
                                  return report.summary?.financialHealth?.detail?.debtRatio || 0;
                                } catch (e) {
                                  return 0;
                                }
                              })()}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 진단 응답 데이터 */}
                    <Separator className="my-6" />
                    <div>
                      <h4 className="font-semibold text-lg mb-3 text-gray-800">진단 응답 데이터</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(() => {
                          try {
                            const report = typeof diagnosis.reportContent === 'string' 
                              ? JSON.parse(diagnosis.reportContent) 
                              : diagnosis.reportContent;
                            const personalInfo = report.personalInfo || {};
                            const incomeInfo = report.incomeInfo || {};
                            const assetInfo = report.assetInfo || {};
                            const expenseInfo = report.expenseInfo || {};
                            
                            return (
                              <>
                                <div className="bg-blue-50 p-3 rounded-lg">
                                  <h5 className="font-medium text-blue-800 mb-2">개인 정보</h5>
                                  <p className="text-sm text-gray-700">나이: {personalInfo.age || '-'}세</p>
                                  <p className="text-sm text-gray-700">성별: {personalInfo.gender === 'male' ? '남성' : '여성'}</p>
                                  <p className="text-sm text-gray-700">가족형태: {personalInfo.familyType || '-'}</p>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg">
                                  <h5 className="font-medium text-green-800 mb-2">수입 정보</h5>
                                  <p className="text-sm text-gray-700">본인 수입: {incomeInfo.monthlyIncome?.toLocaleString() || '-'}원</p>
                                  <p className="text-sm text-gray-700">배우자 수입: {incomeInfo.spouseIncome?.toLocaleString() || '-'}원</p>
                                  <p className="text-sm text-gray-700">기타 수입: {incomeInfo.otherIncome?.toLocaleString() || '-'}원</p>
                                </div>
                                <div className="bg-orange-50 p-3 rounded-lg">
                                  <h5 className="font-medium text-orange-800 mb-2">자산 정보</h5>
                                  <p className="text-sm text-gray-700">예금: {assetInfo.savings?.toLocaleString() || '-'}원</p>
                                  <p className="text-sm text-gray-700">투자: {assetInfo.investments?.toLocaleString() || '-'}원</p>
                                  <p className="text-sm text-gray-700">부동산: {assetInfo.realEstate?.toLocaleString() || '-'}원</p>
                                </div>
                              </>
                            );
                          } catch (e) {
                            return <p className="text-gray-500">응답 데이터를 불러올 수 없습니다.</p>;
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">상세 분석 내용이 없습니다.</p>
            )}
          </CardContent>
        </Card>

        {/* 진단 응답 데이터 (재무 진단의 경우) */}
        {diagnosis.type === "재무 진단" && diagnosis.responses && (
          <Card>
            <CardHeader>
              <CardTitle>진단 응답 데이터</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800">수입 정보</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">월 급여</span>
                      <span className="font-medium">{(diagnosis.responses.monthlyIncome || 0).toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">배우자 수입</span>
                      <span className="font-medium">{(diagnosis.responses.spouseIncome || 0).toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">기타 수입</span>
                      <span className="font-medium">{(diagnosis.responses.otherIncome || 0).toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between p-2 bg-blue-50 rounded border-l-4 border-blue-500">
                      <span className="text-blue-800 font-semibold">총 월 수입</span>
                      <span className="font-bold text-blue-800">
                        {((diagnosis.responses.monthlyIncome || 0) + (diagnosis.responses.spouseIncome || 0) + (diagnosis.responses.otherIncome || 0)).toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800">지출 정보</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">주거비</span>
                      <span className="font-medium">{(diagnosis.responses.housingCost || 0).toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">식비</span>
                      <span className="font-medium">{(diagnosis.responses.foodCost || 0).toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">교육비</span>
                      <span className="font-medium">{(diagnosis.responses.educationCost || 0).toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">교통비</span>
                      <span className="font-medium">{(diagnosis.responses.transportationCost || 0).toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">여가비</span>
                      <span className="font-medium">{(diagnosis.responses.leisureCost || 0).toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">의료비</span>
                      <span className="font-medium">{(diagnosis.responses.medicalCost || 0).toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">보험료</span>
                      <span className="font-medium">{(diagnosis.responses.insuranceCost || 0).toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">기타 지출</span>
                      <span className="font-medium">{(diagnosis.responses.otherExpense || 0).toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-50 rounded border-l-4 border-red-500">
                      <span className="text-red-800 font-semibold">총 월 지출</span>
                      <span className="font-bold text-red-800">
                        {((diagnosis.responses.housingCost || 0) + (diagnosis.responses.foodCost || 0) + 
                          (diagnosis.responses.educationCost || 0) + (diagnosis.responses.transportationCost || 0) + 
                          (diagnosis.responses.leisureCost || 0) + (diagnosis.responses.medicalCost || 0) + 
                          (diagnosis.responses.insuranceCost || 0) + (diagnosis.responses.otherExpense || 0)).toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800">자산 정보</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">현재 저축</span>
                      <span className="font-medium">{(diagnosis.responses.savings || 0).toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-50 rounded border-l-4 border-green-500">
                      <span className="text-green-800 font-semibold">월 저축 가능액</span>
                      <span className="font-bold text-green-800">
                        {(((diagnosis.responses.monthlyIncome || 0) + (diagnosis.responses.spouseIncome || 0) + (diagnosis.responses.otherIncome || 0)) - 
                          ((diagnosis.responses.housingCost || 0) + (diagnosis.responses.foodCost || 0) + 
                           (diagnosis.responses.educationCost || 0) + (diagnosis.responses.transportationCost || 0) + 
                           (diagnosis.responses.leisureCost || 0) + (diagnosis.responses.medicalCost || 0) + 
                           (diagnosis.responses.insuranceCost || 0) + (diagnosis.responses.otherExpense || 0))).toLocaleString()}원
                      </span>
                    </div>
                    <div className="flex justify-between p-2 bg-blue-50 rounded border-l-4 border-blue-500">
                      <span className="text-blue-800 font-semibold">저축률</span>
                      <span className="font-bold text-blue-800">
                        {diagnosis.responses.monthlyIncome && diagnosis.responses.monthlyIncome > 0
                          ? Math.round(((((diagnosis.responses.monthlyIncome || 0) + (diagnosis.responses.spouseIncome || 0) + (diagnosis.responses.otherIncome || 0)) - 
                              ((diagnosis.responses.housingCost || 0) + (diagnosis.responses.foodCost || 0) + 
                               (diagnosis.responses.educationCost || 0) + (diagnosis.responses.transportationCost || 0) + 
                               (diagnosis.responses.leisureCost || 0) + (diagnosis.responses.medicalCost || 0) + 
                               (diagnosis.responses.insuranceCost || 0) + (diagnosis.responses.otherExpense || 0))) / 
                              ((diagnosis.responses.monthlyIncome || 0) + (diagnosis.responses.spouseIncome || 0) + (diagnosis.responses.otherIncome || 0))) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DiagnosisDetailPage; 