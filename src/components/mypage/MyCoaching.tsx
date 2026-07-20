
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, User, MessageSquare, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMyCoaching } from "@/hooks/useMyCoaching";
import { Skeleton } from "@/components/ui/skeleton";

const MyCoaching = () => {
  const { user } = useAuth();
  const { currentCoaching, coachingHistory, upcomingSessions, loading, error } = useMyCoaching(user?.user_id);

  // 로딩 상태
  if (loading) {
    return (
      <div className="space-y-6">
        {/* 현재 진행 중인 코칭 로딩 */}
        <Card>
          <CardHeader>
            <CardTitle>진행 중인 코칭</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
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

  return (
    <div className="space-y-6">
      {/* 현재 진행 중인 코칭 */}
      {currentCoaching ? (
        <Card>
          <CardHeader>
            <CardTitle>진행 중인 코칭</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{currentCoaching.application.title}</h3>
                  <p className="text-gray-600 flex items-center gap-2">
                    <User size={16} />
                    {currentCoaching.application.expert_name}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">진행중</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">코칭 기간</div>
                  <div className="font-medium">
                    {currentCoaching.application.start_date} ~ {currentCoaching.application.end_date}
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
                    {currentCoaching.application.completed_sessions}/{currentCoaching.application.total_sessions}
                  </div>
                </div>
              </div>

              {currentCoaching.nextSession && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-blue-600" />
                    <span className="font-medium text-blue-900">다음 세션</span>
                  </div>
                  <p className="text-blue-800">
                    {currentCoaching.nextSession.session_date} {currentCoaching.nextSession.session_time}
                  </p>
                  <p className="text-blue-700 text-sm">{currentCoaching.nextSession.title}</p>
                  <Button size="sm" className="mt-2">
                    세션 참여하기
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>진행 중인 코칭</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>현재 진행 중인 코칭이 없습니다.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 예정된 세션 */}
      {upcomingSessions.length > 0 ? (
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
                        {session.session_date} {session.session_time} | {session.session_type === 'video' ? '1:1 화상 코칭' : session.session_type}
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
      ) : null}

      {/* 코칭 이력 */}
      {coachingHistory.length > 0 ? (
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
                        {coaching.expert_name}
                      </p>
                    </div>
                    <Badge className="bg-gray-100 text-gray-800">
                      {coaching.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {coaching.start_date} ~ {coaching.end_date}
                  </p>
                  
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    총 {coaching.total_sessions}회 세션 중 {coaching.completed_sessions}회 완료
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>코칭 이력</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>아직 완료된 코칭이 없습니다.</p>
            </div>
          </CardContent>
        </Card>
      )}

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
