
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, User, MessageSquare, Star } from "lucide-react";

const MyCoaching = () => {
  const currentCoaching = {
    id: 1,
    coach: "이재테크 전문가",
    title: "부동산 투자 마스터 코칭",
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    progress: 65,
    totalSessions: 8,
    completedSessions: 5,
    nextSession: "2024-02-20 14:00"
  };

  const coachingHistory = [
    {
      id: 2,
      coach: "김주식 코치",
      title: "주식 투자 기초 코칭",
      period: "2023-10-01 ~ 2023-12-01",
      status: "완료",
      rating: 5,
      review: "매우 만족스러운 코칭이었습니다. 실전에 바로 적용할 수 있는 내용들이 많았어요."
    },
    {
      id: 3,
      coach: "박부자 멘토",
      title: "재정 관리 코칭",
      period: "2023-07-01 ~ 2023-09-01",
      status: "완료",
      rating: 4,
      review: "체계적인 재정 관리 방법을 배울 수 있었습니다."
    }
  ];

  const upcomingSessions = [
    {
      id: 1,
      title: "포트폴리오 리뷰 및 조정",
      date: "2024-02-20",
      time: "14:00",
      type: "1:1 화상 코칭"
    },
    {
      id: 2,
      title: "월간 성과 분석",
      date: "2024-02-27",
      time: "15:00",
      type: "1:1 화상 코칭"
    }
  ];

  return (
    <div className="space-y-6">
      {/* 현재 진행 중인 코칭 */}
      <Card>
        <CardHeader>
          <CardTitle>진행 중인 코칭</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{currentCoaching.title}</h3>
                <p className="text-gray-600 flex items-center gap-2">
                  <User size={16} />
                  {currentCoaching.coach}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">진행중</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">코칭 기간</div>
                <div className="font-medium">
                  {currentCoaching.startDate} ~ {currentCoaching.endDate}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">진행률</div>
                <div className="font-medium">{currentCoaching.progress}%</div>
                <Progress value={currentCoaching.progress} className="mt-1" />
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">세션</div>
                <div className="font-medium">
                  {currentCoaching.completedSessions}/{currentCoaching.totalSessions}
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-blue-600" />
                <span className="font-medium text-blue-900">다음 세션</span>
              </div>
              <p className="text-blue-800">{currentCoaching.nextSession}</p>
              <Button size="sm" className="mt-2">
                세션 참여하기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 예정된 세션 */}
      <Card>
        <CardHeader>
          <CardTitle>예정된 세션</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="text-gray-400" size={20} />
                  <div>
                    <h4 className="font-medium">{session.title}</h4>
                    <p className="text-sm text-gray-600">
                      {session.date} {session.time} | {session.type}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  참여하기
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 코칭 이력 */}
      <Card>
        <CardHeader>
          <CardTitle>코칭 이력</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coachingHistory.map((coaching) => (
              <div key={coaching.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{coaching.title}</h4>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <User size={14} />
                      {coaching.coach}
                    </p>
                  </div>
                  <Badge className="bg-gray-100 text-gray-800">
                    {coaching.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{coaching.period}</p>
                
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < coaching.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">({coaching.rating}/5)</span>
                </div>
                
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                  "{coaching.review}"
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 새 코칭 신청 */}
      <Card>
        <CardHeader>
          <CardTitle>새 코칭 찾기</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium mb-2">새로운 코칭을 시작해보세요</h3>
            <p className="text-gray-600 mb-4">
              전문가와 함께하는 1:1 맞춤 코칭으로 목표를 달성하세요
            </p>
            <Button>코칭 둘러보기</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyCoaching;
