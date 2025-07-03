
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, TrendingUp, PieChart, BarChart3 } from "lucide-react";

const MyDiagnosis = () => {
  const diagnosisHistory = [
    {
      id: 1,
      type: "재정 진단",
      date: "2024-01-15",
      score: 75,
      status: "완료",
      result: "양호",
      color: "bg-green-100 text-green-800"
    },
    {
      id: 2,
      type: "MBTI 진단",
      date: "2024-01-10",
      score: null,
      status: "완료",
      result: "ENFP",
      color: "bg-blue-100 text-blue-800"
    },
    {
      id: 3,
      type: "부자 진단",
      date: "2024-01-08",
      score: 68,
      status: "완료",
      result: "발전 필요",
      color: "bg-yellow-100 text-yellow-800"
    }
  ];

  const financialOverview = {
    totalAssets: 50000000,
    monthlyIncome: 4500000,
    monthlyExpense: 3200000,
    savingsRate: 28.9
  };

  return (
    <div className="space-y-6">
      {/* 최근 진단 결과 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-green-600" size={20} />
              <span className="text-sm font-medium">총 자산</span>
            </div>
            <p className="text-2xl font-bold">{(financialOverview.totalAssets / 10000).toFixed(0)}만원</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="text-blue-600" size={20} />
              <span className="text-sm font-medium">월 수입</span>
            </div>
            <p className="text-2xl font-bold">{(financialOverview.monthlyIncome / 10000).toFixed(0)}만원</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="text-red-600" size={20} />
              <span className="text-sm font-medium">월 지출</span>
            </div>
            <p className="text-2xl font-bold">{(financialOverview.monthlyExpense / 10000).toFixed(0)}만원</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-purple-600" size={20} />
              <span className="text-sm font-medium">저축률</span>
            </div>
            <p className="text-2xl font-bold">{financialOverview.savingsRate}%</p>
          </CardContent>
        </Card>
      </div>

      {/* 진단 이력 */}
      <Card>
        <CardHeader>
          <CardTitle>진단 이력</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {diagnosisHistory.map((diagnosis) => (
              <div key={diagnosis.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Calendar className="text-gray-400" size={20} />
                  <div>
                    <h4 className="font-medium">{diagnosis.type}</h4>
                    <p className="text-sm text-gray-600">{diagnosis.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {diagnosis.score && (
                    <div className="text-center">
                      <div className="text-sm text-gray-600">점수</div>
                      <div className="font-semibold">{diagnosis.score}점</div>
                    </div>
                  )}
                  
                  <Badge className={diagnosis.color}>
                    {diagnosis.result}
                  </Badge>
                  
                  <Button variant="outline" size="sm">
                    상세보기
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 진단 추천 */}
      <Card>
        <CardHeader>
          <CardTitle>추천 진단</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">투자 성향 진단</h4>
              <p className="text-sm text-blue-700 mt-1">
                당신의 투자 성향을 파악하여 맞춤형 투자 전략을 제안해드립니다.
              </p>
              <Button size="sm" className="mt-3">
                진단 시작하기
              </Button>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">부채 관리 진단</h4>
              <p className="text-sm text-green-700 mt-1">
                현재 부채 상황을 분석하고 효율적인 관리 방법을 알아보세요.
              </p>
              <Button size="sm" className="mt-3">
                진단 시작하기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyDiagnosis;
