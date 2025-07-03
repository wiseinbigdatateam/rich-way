
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, PlayCircle, BookOpen, Award } from "lucide-react";

const MyEducation = () => {
  const enrolledCourses = [
    {
      id: 1,
      title: "부동산 투자 완전정복",
      instructor: "김부동산",
      progress: 75,
      totalLectures: 20,
      completedLectures: 15,
      enrollDate: "2024-01-15",
      status: "진행중",
      thumbnail: "/placeholder.svg"
    },
    {
      id: 2,
      title: "주식 투자 기초부터 실전까지",
      instructor: "박주식",
      progress: 100,
      totalLectures: 15,
      completedLectures: 15,
      enrollDate: "2023-12-01",
      status: "완료",
      thumbnail: "/placeholder.svg"
    },
    {
      id: 3,
      title: "재정관리와 가계부 작성법",
      instructor: "이재정",
      progress: 40,
      totalLectures: 10,
      completedLectures: 4,
      enrollDate: "2024-02-01",
      status: "진행중",
      thumbnail: "/placeholder.svg"
    }
  ];

  const certificates = [
    {
      id: 1,
      name: "부동산 투자 전문가",
      issueDate: "2024-01-20",
      issuer: "한국부자연구원"
    },
    {
      id: 2,
      name: "주식 투자 기초 수료증",
      issueDate: "2023-12-15",
      issuer: "한국부자연구원"
    }
  ];

  return (
    <div className="space-y-6">
      {/* 학습 현황 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="text-blue-600" size={20} />
              <span className="text-sm font-medium">수강 중인 강의</span>
            </div>
            <p className="text-2xl font-bold">2개</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="text-green-600" size={20} />
              <span className="text-sm font-medium">완료한 강의</span>
            </div>
            <p className="text-2xl font-bold">1개</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-purple-600" size={20} />
              <span className="text-sm font-medium">총 학습시간</span>
            </div>
            <p className="text-2xl font-bold">45시간</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="text-orange-600" size={20} />
              <span className="text-sm font-medium">획득 수료증</span>
            </div>
            <p className="text-2xl font-bold">2개</p>
          </CardContent>
        </Card>
      </div>

      {/* 내 강의 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>내 강의</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-20 h-20 object-cover rounded"
                />
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{course.title}</h4>
                    <Badge className={course.status === "완료" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                      {course.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>
                  
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>진행률</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} />
                    </div>
                    <div className="text-sm text-gray-600">
                      {course.completedLectures}/{course.totalLectures} 강의
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      수강신청일: {course.enrollDate}
                    </span>
                    <Button size="sm" variant={course.status === "완료" ? "outline" : "default"}>
                      <PlayCircle size={16} className="mr-1" />
                      {course.status === "완료" ? "다시보기" : "학습하기"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 수료증 */}
      <Card>
        <CardHeader>
          <CardTitle>나의 수료증</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="text-gold-600" size={20} />
                  <h4 className="font-medium">{cert.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-1">발급기관: {cert.issuer}</p>
                <p className="text-sm text-gray-600 mb-3">발급일: {cert.issueDate}</p>
                <Button size="sm" variant="outline">
                  수료증 다운로드
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 추천 강의 */}
      <Card>
        <CardHeader>
          <CardTitle>추천 강의</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">암호화폐 투자 가이드</h4>
              <p className="text-sm text-blue-700 mt-1">
                초보자를 위한 암호화폐 투자 기초부터 실전 전략까지
              </p>
              <Button size="sm" className="mt-3">
                강의 보기
              </Button>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">세금 절약 전략</h4>
              <p className="text-sm text-green-700 mt-1">
                합법적인 절세 방법과 세무 계획 수립하기
              </p>
              <Button size="sm" className="mt-3">
                강의 보기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyEducation;
