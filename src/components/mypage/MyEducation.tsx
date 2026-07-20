import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, PlayCircle, BookOpen, Award, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { downloadCertificatePDF } from "@/lib/certificatePdf";

type CourseStatus = "진행중" | "완료" | "예정";

interface EnrolledCourse {
  applicationId: string;
  lectureId: string;
  title: string;
  instructor: string;
  thumbnail: string;
  enrollDate: string;
  startDate: string;
  endDate: string;
  status: CourseStatus;
  totalLectures: number;
  completedLectures: number;
  progress: number;
  certificateIssuedAt: string | null;
  price: number;
}

const todayStr = () => new Date().toISOString().slice(0, 10);

const getCourseStatus = (startDate?: string | null, endDate?: string | null): CourseStatus => {
  const today = todayStr();
  if (startDate && startDate > today) return "예정";
  if (endDate && endDate < today) return "완료";
  return "진행중";
};

const MyEducation = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const memberId = user?.id || null;

  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyCourses = async () => {
      if (!memberId) {
        setCourses([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data: apps, error: appsError } = await supabase
          .from("lecture_applications")
          .select("*")
          .eq("member_user_id", memberId)
          .eq("status", "입금완료")
          .order("paid_at", { ascending: false });

        if (appsError) throw appsError;

        if (!apps || apps.length === 0) {
          setCourses([]);
          setLoading(false);
          return;
        }

        // 같은 강의 중복 신청 시 최신(종료일/결제일 기준) 1건만 사용
        const latestByLecture = new Map<string, any>();
        for (const app of apps) {
          const existing = latestByLecture.get(app.lecture_id);
          if (!existing) {
            latestByLecture.set(app.lecture_id, app);
            continue;
          }
          const existingEnd = existing.end_date || "";
          const nextEnd = app.end_date || "";
          if (nextEnd > existingEnd) {
            latestByLecture.set(app.lecture_id, app);
          }
        }

        const uniqueApps = Array.from(latestByLecture.values());
        const lectureIds = uniqueApps.map((a) => a.lecture_id);

        const { data: lectures, error: lecturesError } = await supabase
          .from("lectures")
          .select("id, title, thumbnail_url, instructors_user_id, category")
          .in("id", lectureIds);

        if (lecturesError) throw lecturesError;

        const lectureMap = new Map((lectures || []).map((l: any) => [l.id, l]));
        const instructorIds = [
          ...new Set(
            (lectures || [])
              .map((l: any) => (l.instructors_user_id ? String(l.instructors_user_id).trim() : null))
              .filter(Boolean)
          ),
        ] as string[];

        const instructorMap = new Map<string, string>();
        if (instructorIds.length > 0) {
          const { data: instructors } = await supabase
            .from("instructors")
            .select("user_id, name")
            .in("user_id", instructorIds);
          (instructors || []).forEach((i: any) => {
            instructorMap.set(String(i.user_id).trim(), i.name);
          });
        }

        const { data: videos } = await supabase
          .from("lecture_videos")
          .select("id, lecture_id")
          .in("lecture_id", lectureIds);

        const videoCountMap = new Map<string, number>();
        (videos || []).forEach((v: any) => {
          videoCountMap.set(v.lecture_id, (videoCountMap.get(v.lecture_id) || 0) + 1);
        });

        const mapped: EnrolledCourse[] = uniqueApps.map((app) => {
          const lecture = lectureMap.get(app.lecture_id);
          const status = getCourseStatus(app.start_date, app.end_date);
          const totalLectures = videoCountMap.get(app.lecture_id) || 0;
          // 진도 테이블 미연동 상태: 수강기간 기반 간이 진행률
          let progress = 0;
          if (status === "완료") progress = 100;
          else if (status === "진행중" && app.start_date && app.end_date) {
            const start = new Date(app.start_date).getTime();
            const end = new Date(app.end_date).getTime();
            const now = Date.now();
            if (end > start) {
              progress = Math.min(
                99,
                Math.max(0, Math.round(((now - start) / (end - start)) * 100))
              );
            }
          }
          const completedLectures =
            totalLectures > 0 ? Math.round((progress / 100) * totalLectures) : 0;

          return {
            applicationId: app.id,
            lectureId: app.lecture_id,
            title: lecture?.title || app.lecture_name || "강의",
            instructor:
              (lecture?.instructors_user_id &&
                instructorMap.get(String(lecture.instructors_user_id).trim())) ||
              "전문가",
            thumbnail:
              lecture?.thumbnail_url ||
              "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop",
            enrollDate: (app.paid_at || app.applied_at || app.created_at || "").slice(0, 10),
            startDate: app.start_date || "",
            endDate: app.end_date || "",
            status,
            totalLectures,
            completedLectures,
            progress,
            certificateIssuedAt: app.certificate_issued_at,
            price: Number(app.price || 0),
          };
        });

        mapped.sort((a, b) => (b.enrollDate || "").localeCompare(a.enrollDate || ""));
        setCourses(mapped);
      } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : "수강 목록을 불러오지 못했습니다.");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [memberId]);

  const summary = useMemo(() => {
    const inProgress = courses.filter((c) => c.status === "진행중").length;
    const completed = courses.filter((c) => c.status === "완료").length;
    const certificates = courses.filter((c) => c.certificateIssuedAt).length;
    return { inProgress, completed, certificates, total: courses.length };
  }, [courses]);

  const certificateCourses = courses.filter((c) => c.certificateIssuedAt);

  const handleCertificateDownload = async (course: EnrolledCourse) => {
    await downloadCertificatePDF(
      {
        name: user?.name || user?.user_id || "수강생",
        course: course.title,
        period: `${course.startDate || "-"} ~ ${course.endDate || "-"}`,
        date: (course.certificateIssuedAt || "").slice(0, 10),
        org: "리치웨이",
        member_user_id: memberId || "",
      },
      `${course.title}-수료증.pdf`
    );
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-600">
          로그인 후 내 강의를 확인할 수 있습니다.
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        수강 목록을 불러오는 중...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* 학습 현황 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="text-blue-600" size={20} />
              <span className="text-sm font-medium">수강 중인 강의</span>
            </div>
            <p className="text-2xl font-bold">{summary.inProgress}개</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="text-green-600" size={20} />
              <span className="text-sm font-medium">수강 종료 강의</span>
            </div>
            <p className="text-2xl font-bold">{summary.completed}개</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-purple-600" size={20} />
              <span className="text-sm font-medium">전체 수강 강의</span>
            </div>
            <p className="text-2xl font-bold">{summary.total}개</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="text-orange-600" size={20} />
              <span className="text-sm font-medium">발급 수료증</span>
            </div>
            <p className="text-2xl font-bold">{summary.certificates}개</p>
          </CardContent>
        </Card>
      </div>

      {/* 내 강의 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>내 강의</CardTitle>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <div className="py-10 text-center text-gray-500 space-y-3">
              <p>수강 중인 강의가 없습니다.</p>
              <Button onClick={() => navigate("/education")}>강의 둘러보기</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.applicationId}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 border rounded-lg"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full sm:w-20 h-40 sm:h-20 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop";
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="font-medium truncate">{course.title}</h4>
                      <Badge
                        className={
                          course.status === "완료"
                            ? "bg-green-100 text-green-800"
                            : course.status === "예정"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-blue-100 text-blue-800"
                        }
                      >
                        {course.status}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>

                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>수강 기간 진행률</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} />
                      </div>
                      <div className="text-sm text-gray-600 whitespace-nowrap">
                        영상 {course.totalLectures}개
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="text-sm text-gray-500">
                        <span>결제일: {course.enrollDate || "-"}</span>
                        {(course.startDate || course.endDate) && (
                          <span className="ml-0 sm:ml-3 block sm:inline">
                            수강기간: {course.startDate || "-"} ~ {course.endDate || "-"}
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant={course.status === "완료" ? "outline" : "default"}
                        onClick={() => navigate(`/education/${course.lectureId}`)}
                      >
                        <PlayCircle size={16} className="mr-1" />
                        {course.status === "완료" ? "다시보기" : "학습하기"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 수료증 */}
      <Card>
        <CardHeader>
          <CardTitle>나의 수료증</CardTitle>
        </CardHeader>
        <CardContent>
          {certificateCourses.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">발급된 수료증이 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificateCourses.map((course) => (
                <div
                  key={`cert-${course.applicationId}`}
                  className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="text-amber-600" size={20} />
                    <h4 className="font-medium">{course.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">강사: {course.instructor}</p>
                  <p className="text-sm text-gray-600 mb-3">
                    발급일: {(course.certificateIssuedAt || "").slice(0, 10)}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCertificateDownload(course)}
                  >
                    수료증 다운로드
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyEducation;
