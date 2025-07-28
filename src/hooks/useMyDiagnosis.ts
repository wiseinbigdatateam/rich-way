import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface DiagnosisHistoryItem {
  id: string;
  type: string;
  date: string;
  score?: number;
  status: string;
  result: string;
  reportContent?: string;
}

export interface FinancialOverview {
  totalAssets: number;
  monthlyIncome: number;
  monthlyExpense: number;
  savingsRate: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const useMyDiagnosis = (userId: string | undefined, page: number = 1, itemsPerPage: number = 3) => {
  const [diagnosisHistory, setDiagnosisHistory] = useState<DiagnosisHistoryItem[]>([]);
  const [financialOverview, setFinancialOverview] = useState<FinancialOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 3,
    hasNextPage: false,
    hasPreviousPage: false
  });

  useEffect(() => {
    if (!userId) {
      setDiagnosisHistory([]);
      setFinancialOverview(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        console.log("진단 데이터 조회 시작 - 사용자 ID:", userId, "페이지:", page);

        // MBTI 진단 이력 조회
        const { data: mbtiHistory, error: mbtiError } = await (supabase as any)
          .from("mbti_diagnosis")
          .select("id, user_id, result_type, created_at, report_content")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        console.log("MBTI 진단 결과:", mbtiHistory, mbtiError);

        // 재무 진단 이력 조회
        const { data: financeHistory, error: financeError } = await (supabase as any)
          .from("finance_diagnosis")
          .select("id, user_id, created_at, report_content, responses")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        console.log("재무 진단 결과:", financeHistory, financeError);

        if (mbtiError || financeError) {
          console.error("진단 이력 조회 오류:", mbtiError || financeError);
          setError("데이터를 불러오는 중 오류가 발생했습니다.");
          setDiagnosisHistory([]);
          setFinancialOverview(null);
        } else {
          // 진단 이력 통합
          const combinedHistory: DiagnosisHistoryItem[] = [];
          
          // MBTI 진단 이력 추가
          if (mbtiHistory && mbtiHistory.length > 0) {
            console.log("MBTI 진단 데이터 처리 시작:", mbtiHistory.length, "개");
            mbtiHistory.forEach((item: any, index: number) => {
              console.log(`MBTI 진단 ${index + 1}:`, item);
              combinedHistory.push({
                id: item.id,
                type: "MBTI 진단",
                date: new Date(item.created_at).toLocaleDateString('ko-KR'),
                status: "완료",
                result: item.result_type,
                reportContent: item.report_content
              });
            });
            console.log("MBTI 진단 처리 완료, combinedHistory 길이:", combinedHistory.length);
          } else {
            console.log("MBTI 진단 데이터가 없습니다.");
          }

          // 재무 진단 이력 추가
          if (financeHistory && financeHistory.length > 0) {
            console.log("재무 진단 데이터 처리 시작:", financeHistory.length, "개");
            financeHistory.forEach((item: any, index: number) => {
              console.log(`재무 진단 ${index + 1}:`, item);
              // 재무 진단 결과 분석
              let result = "재무 분석 완료";
              let score = 75; // 기본 점수
              
              try {
                if (item.report_content) {
                  // report_content가 문자열인지 객체인지 확인
                  let report;
                  if (typeof item.report_content === 'string') {
                    report = JSON.parse(item.report_content);
                  } else {
                    report = item.report_content;
                  }
                  
                  // 최신 데이터 구조 (summary.financialHealth.score 사용)
                  if (report.summary && report.summary.financialHealth) {
                    score = report.summary.financialHealth.score;
                    result = report.summary.financialHealth.level === 'excellent' ? '우수' : 
                             report.summary.financialHealth.level === 'good' ? '양호' : 
                             report.summary.financialHealth.level === 'fair' ? '보통' : '개선 필요';
                  }
                  // 이전 데이터 구조 (analysis 텍스트 기반)
                  else if (report.analysis) {
                    if (report.analysis.includes("우수")) {
                      result = "우수";
                      score = 85;
                    } else if (report.analysis.includes("안정")) {
                      result = "양호";
                      score = 75;
                    } else if (report.analysis.includes("개선")) {
                      result = "발전 필요";
                      score = 65;
                    }
                  }
                }
              } catch (e) {
                console.log("재무 진단 결과 파싱 오류:", e);
              }

              combinedHistory.push({
                id: item.id,
                type: "재무 진단",
                date: new Date(item.created_at).toLocaleDateString('ko-KR'),
                score: score,
                status: "완료",
                result: result,
                reportContent: item.report_content
              });
            });
            console.log("재무 진단 처리 완료, combinedHistory 길이:", combinedHistory.length);
          } else {
            console.log("재무 진단 데이터가 없습니다.");
          }

          // 날짜순으로 정렬
          combinedHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          // 페이징 처리
          const totalItems = combinedHistory.length;
          const totalPages = Math.ceil(totalItems / itemsPerPage);
          const startIndex = (page - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const paginatedHistory = combinedHistory.slice(startIndex, endIndex);
          
          setDiagnosisHistory(paginatedHistory);
          setPagination({
            currentPage: page,
            totalPages,
            totalItems,
            itemsPerPage,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
          });

          console.log("통합된 진단 이력:", paginatedHistory);
          console.log("페이징 정보:", {
            currentPage: page,
            totalPages,
            totalItems,
            itemsPerPage,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
          });

          // 재무 요약 계산 (가장 최근 재무 진단에서 추출)
          if (financeHistory && financeHistory.length > 0) {
            const latestFinance = financeHistory[0];
            try {
              // report_content에서 재무 정보 추출
              let report;
              if (typeof latestFinance.report_content === 'string') {
                report = JSON.parse(latestFinance.report_content);
              } else {
                report = latestFinance.report_content;
              }
              
              // 최신 데이터 구조에서 추출
              if (report.summary && report.summary.financialHealth) {
                const incomeInfo = report.incomeInfo || {};
                const assetInfo = report.assetInfo || {};
                const expenseInfo = report.expenseInfo || {};
                
                const monthlyIncome = (incomeInfo.monthlyIncome || 0) + (incomeInfo.spouseIncome || 0) + (incomeInfo.otherIncome || 0);
                const monthlyExpense = (expenseInfo.housingCost || 0) + (expenseInfo.foodCost || 0) + 
                                     (expenseInfo.educationCost || 0) + (expenseInfo.transportationCost || 0) + 
                                     (expenseInfo.leisureCost || 0) + (expenseInfo.medicalCost || 0) + 
                                     (expenseInfo.insuranceCost || 0) + (expenseInfo.otherExpense || 0);
                const totalAssets = (assetInfo.savings || 0) + (assetInfo.investments || 0) + 
                                   (assetInfo.realEstate || 0) + (assetInfo.car || 0) + 
                                   (assetInfo.retirement || 0) + (assetInfo.otherAssets || 0);
                const savingsRate = report.summary.financialHealth.detail?.savingsRate || 0;

                const overview = {
                  totalAssets,
                  monthlyIncome,
                  monthlyExpense,
                  savingsRate: Math.round(savingsRate * 100) / 100
                };

                setFinancialOverview(overview);
                console.log("재무 요약 (최신 구조):", overview);
              }
              // 이전 데이터 구조에서 추출
              else {
                const responses = typeof latestFinance.responses === 'string' 
                  ? JSON.parse(latestFinance.responses) 
                  : latestFinance.responses;
                
                const monthlyIncome = (responses.monthlyIncome || 0) + (responses.spouseIncome || 0) + (responses.otherIncome || 0);
                const monthlyExpense = (responses.housingCost || 0) + (responses.foodCost || 0) + 
                                     (responses.educationCost || 0) + (responses.transportationCost || 0) + 
                                     (responses.leisureCost || 0) + (responses.medicalCost || 0) + 
                                     (responses.insuranceCost || 0) + (responses.otherExpense || 0);
                const savings = responses.savings || 0;
                const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpense) / monthlyIncome) * 100 : 0;

                const overview = {
                  totalAssets: savings,
                  monthlyIncome,
                  monthlyExpense,
                  savingsRate: Math.round(savingsRate * 100) / 100
                };

                setFinancialOverview(overview);
                console.log("재무 요약 (이전 구조):", overview);
              }
            } catch (parseError) {
              console.error("재무 데이터 파싱 오류:", parseError);
              setFinancialOverview(null);
            }
          } else {
            setFinancialOverview(null);
          }
        }
      } catch (err) {
        console.error("진단 데이터 조회 중 오류:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        setDiagnosisHistory([]);
        setFinancialOverview(null);
      }
      setLoading(false);
    };

    fetchData();
  }, [userId, page, itemsPerPage]);

  return { diagnosisHistory, financialOverview, loading, error, pagination };
}; 