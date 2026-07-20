import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, X, Search, ArrowUpDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { supabase } from "@/lib/supabase";
import { uploadImageToS3, generateFileName } from "@/lib/awsS3";

type LectureStatus = "사용" | "사용중지";
type ApplicationStatus = "신청" | "입금완료" | "결제취소";

interface CurriculumVideo {
  id: string;
  videoTitle: string;
  videoSubtitle: string;
  duration: string;
  description: string;
  videoUrl: string;
}

interface CurriculumSession {
  id: string;
  sessionTitle: string;
  sessionSubtitle: string;
  videos: CurriculumVideo[];
}

interface LectureRow {
  id: string;
  category: string;
  title: string;
  thumbnail_url: string | null;
  price: number;
  discount_price: number | null;
  duration: number | null;
  description: string | null;
  sample_video_url: string | null;
  instructor_intro: string | null;
  status: LectureStatus;
  access_period: number | null;
  created_at: string;
  student_count?: number;
}

interface ApplicationRow {
  id: string;
  lecture_id: string;
  lecture_name: string;
  member_user_id: string;
  member_name: string;
  member_email: string;
  applied_at: string | null;
  paid_at: string | null;
  start_date: string;
  end_date: string;
  payment_method: string | null;
  price: number;
  status: ApplicationStatus;
}

const CATEGORIES = ["기초코어", "부동산", "세무", "투자", "창업사업"] as const;

const emptyForm = {
  category: "",
  title: "",
  thumbnailUrl: "",
  price: "",
  discountPrice: "",
  durationMinutes: "",
  accessPeriod: "30",
  description: "",
  sampleVideoUrl: "",
  instructorIntro: "",
  status: "사용" as LectureStatus,
};

const parseDurationToMinutes = (value: string): number | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^\d+$/.test(trimmed)) return Number(trimmed);

  let total = 0;
  const hourMatch = trimmed.match(/(\d+)\s*시간/);
  const minMatch = trimmed.match(/(\d+)\s*분/);
  if (hourMatch) total += Number(hourMatch[1]) * 60;
  if (minMatch) total += Number(minMatch[1]);
  return total > 0 ? total : null;
};

const formatMinutesLabel = (minutes: number | null | undefined) => {
  if (!minutes) return "-";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
  return `${mins}분`;
};

const stripHtml = (html: string | null | undefined) => {
  if (!html) return "-";
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text || "-";
};

const EducationManagement = () => {
  const [lectures, setLectures] = useState<LectureRow[]>([]);
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("courses");
  const [selectedLectureId, setSelectedLectureId] = useState<string | null>(null);
  const [selectedLectureTitle, setSelectedLectureTitle] = useState<string | null>(null);

  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [courseSortField, setCourseSortField] = useState<string>("created_at");
  const [courseSortDirection, setCourseSortDirection] = useState<"asc" | "desc">("desc");
  const [studentSortField, setStudentSortField] = useState<string>("applied_at");
  const [studentSortDirection, setStudentSortDirection] = useState<"asc" | "desc">("desc");

  const [formData, setFormData] = useState(emptyForm);
  const [sessions, setSessions] = useState<CurriculumSession[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header", "bold", "italic", "underline", "strike", "blockquote",
    "list", "bullet", "indent", "link", "image",
  ];

  const fetchLectures = async () => {
    setLoading(true);
    try {
      const { data: lectureData, error: lectureError } = await supabase
        .from("lectures")
        .select("*")
        .order("created_at", { ascending: false });

      if (lectureError) throw lectureError;

      const { data: appData, error: appError } = await supabase
        .from("lecture_applications")
        .select("lecture_id");

      if (appError) throw appError;

      const countMap = new Map<string, number>();
      (appData || []).forEach((row: { lecture_id: string }) => {
        countMap.set(row.lecture_id, (countMap.get(row.lecture_id) || 0) + 1);
      });

      setLectures(
        (lectureData || []).map((lecture: any) => ({
          ...lecture,
          student_count: countMap.get(lecture.id) || 0,
        }))
      );
    } catch (error: any) {
      console.error(error);
      toast.error(`강의 목록 조회 실패: ${error.message || "알 수 없는 오류"}`);
      setLectures([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data: appData, error: appError } = await supabase
        .from("lecture_applications")
        .select("*")
        .order("applied_at", { ascending: false });

      if (appError) throw appError;

      const memberIds = [...new Set((appData || []).map((a: any) => a.member_user_id).filter(Boolean))];
      let memberMap: Record<string, { name: string; email: string }> = {};

      if (memberIds.length > 0) {
        const { data: membersByAuth } = await supabase
          .from("members")
          .select("auth_user_id, name, email")
          .in("auth_user_id", memberIds);

        (membersByAuth || []).forEach((m: any) => {
          if (m.auth_user_id) {
            memberMap[m.auth_user_id] = { name: m.name || "-", email: m.email || "-" };
          }
        });

        const missingIds = memberIds.filter((id) => !memberMap[id]);
        if (missingIds.length > 0) {
          const { data: usersData } = await supabase
            .from("users")
            .select("id, name, email")
            .in("id", missingIds);

          (usersData || []).forEach((u: any) => {
            memberMap[u.id] = { name: u.name || "-", email: u.email || "-" };
          });
        }
      }

      setApplications(
        (appData || []).map((app: any) => ({
          id: app.id,
          lecture_id: app.lecture_id,
          lecture_name: app.lecture_name,
          member_user_id: app.member_user_id,
          member_name: memberMap[app.member_user_id]?.name || "-",
          member_email: memberMap[app.member_user_id]?.email || app.member_user_id,
          applied_at: app.applied_at,
          paid_at: app.paid_at,
          start_date: app.start_date,
          end_date: app.end_date,
          payment_method: app.payment_method,
          price: app.price,
          status: app.status,
        }))
      );
    } catch (error: any) {
      console.error(error);
      toast.error(`수강생 목록 조회 실패: ${error.message || "알 수 없는 오류"}`);
      setApplications([]);
    }
  };

  useEffect(() => {
    fetchLectures();
    fetchApplications();
  }, []);

  const resetForm = () => {
    setFormData(emptyForm);
    setSessions([]);
    setImageFile(null);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const loadCurriculum = async (lectureId: string) => {
    const { data: sessionData, error: sessionError } = await supabase
      .from("lecture_sessions")
      .select("*")
      .eq("lecture_id", lectureId)
      .order("session_order", { ascending: true });

    if (sessionError) throw sessionError;

    const { data: videoData, error: videoError } = await supabase
      .from("lecture_videos")
      .select("*")
      .eq("lecture_id", lectureId);

    if (videoError) throw videoError;

    const videosBySession = new Map<string, CurriculumVideo[]>();
    (videoData || []).forEach((video: any) => {
      const list = videosBySession.get(video.session_id) || [];
      list.push({
        id: video.id,
        videoTitle: video.video_title || "",
        videoSubtitle: video.video_subtitle || "",
        duration: video.video_duration ? String(video.video_duration) : "",
        description: video.video_description || "",
        videoUrl: video.video_url || "",
      });
      videosBySession.set(video.session_id, list);
    });

    setSessions(
      (sessionData || []).map((session: any) => ({
        id: session.id,
        sessionTitle: session.session_title || "",
        sessionSubtitle: session.session_subtitle || "",
        videos: videosBySession.get(session.id) || [],
      }))
    );
  };

  const openEditDialog = async (lecture: LectureRow) => {
    try {
      setEditingId(lecture.id);
      setFormData({
        category: lecture.category,
        title: lecture.title,
        thumbnailUrl: lecture.thumbnail_url || "",
        price: String(lecture.price ?? ""),
        discountPrice: lecture.discount_price != null ? String(lecture.discount_price) : "",
        durationMinutes: lecture.duration != null ? String(lecture.duration) : "",
        accessPeriod: lecture.access_period != null ? String(lecture.access_period) : "30",
        description: lecture.description || "",
        sampleVideoUrl: lecture.sample_video_url || "",
        instructorIntro: lecture.instructor_intro || "",
        status: lecture.status,
      });
      setImageFile(null);
      await loadCurriculum(lecture.id);
      setIsDialogOpen(true);
    } catch (error: any) {
      console.error(error);
      toast.error(`강의 불러오기 실패: ${error.message || "알 수 없는 오류"}`);
    }
  };

  const addSession = () => {
    setSessions((prev) => [
      ...prev,
      {
        id: `temp-session-${Date.now()}`,
        sessionTitle: "",
        sessionSubtitle: "",
        videos: [],
      },
    ]);
  };

  const removeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== sessionId));
  };

  const updateSession = (sessionId: string, field: "sessionTitle" | "sessionSubtitle", value: string) => {
    setSessions((prev) =>
      prev.map((session) => (session.id === sessionId ? { ...session, [field]: value } : session))
    );
  };

  const addVideo = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              videos: [
                ...session.videos,
                {
                  id: `temp-video-${Date.now()}`,
                  videoTitle: "",
                  videoSubtitle: "",
                  duration: "",
                  description: "",
                  videoUrl: "",
                },
              ],
            }
          : session
      )
    );
  };

  const removeVideo = (sessionId: string, videoId: string) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? { ...session, videos: session.videos.filter((video) => video.id !== videoId) }
          : session
      )
    );
  };

  const updateVideo = (
    sessionId: string,
    videoId: string,
    field: keyof CurriculumVideo,
    value: string
  ) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              videos: session.videos.map((video) =>
                video.id === videoId ? { ...video, [field]: value } : video
              ),
            }
          : session
      )
    );
  };

  const saveCurriculum = async (lectureId: string) => {
    const { error: deleteError } = await supabase
      .from("lecture_sessions")
      .delete()
      .eq("lecture_id", lectureId);

    if (deleteError) throw deleteError;

    for (let sessionIndex = 0; sessionIndex < sessions.length; sessionIndex += 1) {
      const session = sessions[sessionIndex];
      if (!session.sessionTitle.trim()) continue;

      const { data: insertedSession, error: sessionError } = await supabase
        .from("lecture_sessions")
        .insert({
          lecture_id: lectureId,
          session_title: session.sessionTitle.trim(),
          session_subtitle: session.sessionSubtitle.trim() || null,
          session_order: sessionIndex + 1,
        })
        .select("id")
        .single();

      if (sessionError) throw sessionError;

      const videoRows = session.videos
        .filter((video) => video.videoTitle.trim() && video.videoUrl.trim())
        .map((video) => ({
          lecture_id: lectureId,
          session_id: insertedSession.id,
          video_title: video.videoTitle.trim(),
          video_subtitle: video.videoSubtitle.trim() || null,
          video_duration: parseDurationToMinutes(video.duration),
          video_url: video.videoUrl.trim(),
          video_description: video.description.trim() || null,
        }));

      if (videoRows.length > 0) {
        const { error: videoError } = await supabase.from("lecture_videos").insert(videoRows);
        if (videoError) throw videoError;
      }
    }
  };

  const handleSave = async () => {
    if (!formData.category) {
      toast.error("분야를 선택해주세요.");
      return;
    }
    if (!formData.title.trim()) {
      toast.error("강의명을 입력해주세요.");
      return;
    }
    if (!formData.price || Number.isNaN(Number(formData.price))) {
      toast.error("수강가격을 올바르게 입력해주세요.");
      return;
    }

    setSaving(true);
    try {
      let thumbnailUrl = formData.thumbnailUrl || null;

      if (imageFile) {
        setUploading(true);
        const fileName = generateFileName("lecture", imageFile.name);
        thumbnailUrl = await uploadImageToS3(imageFile, fileName);
        setUploading(false);
      }

      const payload = {
        category: formData.category,
        title: formData.title.trim(),
        thumbnail_url: thumbnailUrl,
        price: Number(formData.price),
        discount_price: formData.discountPrice ? Number(formData.discountPrice) : null,
        duration: formData.durationMinutes ? Number(formData.durationMinutes) : null,
        access_period: formData.accessPeriod ? Number(formData.accessPeriod) : 30,
        description: formData.description || null,
        sample_video_url: formData.sampleVideoUrl.trim() || null,
        instructor_intro: formData.instructorIntro || null,
        status: formData.status,
        updated_at: new Date().toISOString(),
      };

      let lectureId = editingId;

      if (editingId) {
        const { error } = await supabase.from("lectures").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("lectures")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw error;
        lectureId = data.id;
      }

      if (!lectureId) throw new Error("강의 ID를 확인할 수 없습니다.");

      await saveCurriculum(lectureId);
      toast.success(editingId ? "강의가 수정되었습니다." : "강의가 등록되었습니다.");
      setIsDialogOpen(false);
      resetForm();
      await fetchLectures();
    } catch (error: any) {
      console.error(error);
      toast.error(`저장 실패: ${error.message || "알 수 없는 오류"}`);
    } finally {
      setUploading(false);
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("이 강의를 삭제할까요? 관련 세션/영상도 함께 삭제됩니다.")) return;

    const { error } = await supabase.from("lectures").delete().eq("id", id);
    if (error) {
      toast.error(`삭제 실패: ${error.message}`);
      return;
    }

    toast.success("강의가 삭제되었습니다.");
    if (selectedLectureId === id) {
      setSelectedLectureId(null);
      setSelectedLectureTitle(null);
    }
    await fetchLectures();
    await fetchApplications();
  };

  const handleStatusToggle = async (lecture: LectureRow) => {
    const nextStatus: LectureStatus = lecture.status === "사용" ? "사용중지" : "사용";
    const { error } = await supabase
      .from("lectures")
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq("id", lecture.id);

    if (error) {
      toast.error(`상태 변경 실패: ${error.message}`);
      return;
    }

    toast.success(`상태가 '${nextStatus}'(으)로 변경되었습니다.`);
    await fetchLectures();
  };

  const updateApplicationStatus = async (applicationId: string, status: ApplicationStatus) => {
    const patch: Record<string, unknown> = { status };
    if (status === "입금완료") {
      patch.paid_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("lecture_applications")
      .update(patch)
      .eq("id", applicationId);

    if (error) {
      toast.error(`수강 상태 변경 실패: ${error.message}`);
      return;
    }

    toast.success("수강 상태가 변경되었습니다.");
    await fetchApplications();
  };

  const updateApplicationDates = async (
    applicationId: string,
    startDate: string,
    endDate: string
  ) => {
    const { error } = await supabase
      .from("lecture_applications")
      .update({ start_date: startDate, end_date: endDate })
      .eq("id", applicationId);

    if (error) {
      toast.error(`수강기간 변경 실패: ${error.message}`);
      return;
    }

    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId ? { ...app, start_date: startDate, end_date: endDate } : app
      )
    );
  };

  const sortCourses = (field: string) => {
    const direction =
      courseSortField === field && courseSortDirection === "asc" ? "desc" : "asc";
    setCourseSortField(field);
    setCourseSortDirection(direction);
  };

  const sortStudents = (field: string) => {
    const direction =
      studentSortField === field && studentSortDirection === "asc" ? "desc" : "asc";
    setStudentSortField(field);
    setStudentSortDirection(direction);
  };

  const sortedLectures = [...lectures]
    .filter((lecture) => {
      const q = courseSearchTerm.toLowerCase();
      if (!q) return true;
      return (
        lecture.title.toLowerCase().includes(q) ||
        lecture.category.toLowerCase().includes(q) ||
        stripHtml(lecture.instructor_intro).toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const dir = courseSortDirection === "asc" ? 1 : -1;
      const aValue: any = a[courseSortField as keyof LectureRow];
      const bValue: any = b[courseSortField as keyof LectureRow];
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * dir;
      }
      return String(aValue).localeCompare(String(bValue), "ko") * dir;
    });

  const filteredStudents = applications
    .filter((student) => {
      const q = studentSearchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        student.member_name.toLowerCase().includes(q) ||
        student.member_email.toLowerCase().includes(q) ||
        student.lecture_name.toLowerCase().includes(q) ||
        student.member_user_id.toLowerCase().includes(q);

      if (selectedLectureId) {
        return matchesSearch && student.lecture_id === selectedLectureId;
      }
      return matchesSearch;
    })
    .sort((a, b) => {
      const dir = studentSortDirection === "asc" ? 1 : -1;
      const aValue: any = a[studentSortField as keyof ApplicationRow];
      const bValue: any = b[studentSortField as keyof ApplicationRow];
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * dir;
      }
      return String(aValue).localeCompare(String(bValue), "ko") * dir;
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>교육 관리</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="courses">교육관리</TabsTrigger>
            <TabsTrigger value="students">수강생관리</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="강의명, 분야, 강사소개로 검색..."
                  value={courseSearchTerm}
                  onChange={(e) => setCourseSearchTerm(e.target.value)}
                  className="w-80"
                />
              </div>
              <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) resetForm();
                }}
              >
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2" onClick={openCreateDialog}>
                    <Plus className="h-4 w-4" />
                    강의 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingId ? "강의 수정" : "강의 등록"}</DialogTitle>
                    <DialogDescription>
                      저장하면 부자교육 페이지에 바로 반영됩니다. 상태가 &apos;사용&apos;인 강의만 노출됩니다.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>분야</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="분야를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>강의명</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="강의 제목을 입력하세요"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>상태</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: LectureStatus) =>
                          setFormData({ ...formData, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="사용">사용 (프론트 노출)</SelectItem>
                          <SelectItem value="사용중지">사용중지</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>대표 이미지</Label>
                      {formData.thumbnailUrl && (
                        <img
                          src={formData.thumbnailUrl}
                          alt="thumbnail"
                          className="w-40 h-24 object-cover rounded border"
                        />
                      )}
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>수강가격 (원)</Label>
                        <Input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>할인가격 (원)</Label>
                        <Input
                          type="number"
                          value={formData.discountPrice}
                          onChange={(e) =>
                            setFormData({ ...formData, discountPrice: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>총 강의시간 (분)</Label>
                        <Input
                          type="number"
                          value={formData.durationMinutes}
                          onChange={(e) =>
                            setFormData({ ...formData, durationMinutes: e.target.value })
                          }
                          placeholder="예: 120"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>수강 가능 기간 (일)</Label>
                        <Input
                          type="number"
                          value={formData.accessPeriod}
                          onChange={(e) =>
                            setFormData({ ...formData, accessPeriod: e.target.value })
                          }
                          placeholder="예: 30"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>강의소개</Label>
                      <div className="border rounded-md">
                        <ReactQuill
                          theme="snow"
                          value={formData.description}
                          onChange={(value) => setFormData({ ...formData, description: value })}
                          modules={quillModules}
                          formats={quillFormats}
                          placeholder="강의 소개를 입력하세요"
                          style={{ minHeight: "200px" }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>샘플영상 URL</Label>
                      <Input
                        type="url"
                        value={formData.sampleVideoUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, sampleVideoUrl: e.target.value })
                        }
                        placeholder="YouTube, Vimeo 등 URL"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>커리큘럼</Label>
                        <Button type="button" onClick={addSession} variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          세션 추가
                        </Button>
                      </div>

                      {sessions.map((session, sessionIndex) => (
                        <div key={session.id} className="border rounded-lg p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">세션 {sessionIndex + 1}</h4>
                            <Button
                              type="button"
                              onClick={() => removeSession(session.id)}
                              variant="ghost"
                              size="sm"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>세션명 (대제목)</Label>
                              <Input
                                value={session.sessionTitle}
                                onChange={(e) =>
                                  updateSession(session.id, "sessionTitle", e.target.value)
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>세션명 (소제목)</Label>
                              <Input
                                value={session.sessionSubtitle}
                                onChange={(e) =>
                                  updateSession(session.id, "sessionSubtitle", e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>영상</Label>
                              <Button
                                type="button"
                                onClick={() => addVideo(session.id)}
                                variant="outline"
                                size="sm"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                영상 추가
                              </Button>
                            </div>

                            {session.videos.map((video, videoIndex) => (
                              <div key={video.id} className="border rounded p-3 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">영상 {videoIndex + 1}</span>
                                  <Button
                                    type="button"
                                    onClick={() => removeVideo(session.id, video.id)}
                                    variant="ghost"
                                    size="sm"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <Label className="text-sm">영상명 (대제목)</Label>
                                    <Input
                                      value={video.videoTitle}
                                      onChange={(e) =>
                                        updateVideo(session.id, video.id, "videoTitle", e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-sm">영상명 (소제목)</Label>
                                    <Input
                                      value={video.videoSubtitle}
                                      onChange={(e) =>
                                        updateVideo(
                                          session.id,
                                          video.id,
                                          "videoSubtitle",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <Label className="text-sm">영상시간 (분)</Label>
                                  <Input
                                    value={video.duration}
                                    onChange={(e) =>
                                      updateVideo(session.id, video.id, "duration", e.target.value)
                                    }
                                    placeholder="예: 30"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <Label className="text-sm">동영상 링크</Label>
                                  <Input
                                    type="url"
                                    value={video.videoUrl}
                                    onChange={(e) =>
                                      updateVideo(session.id, video.id, "videoUrl", e.target.value)
                                    }
                                  />
                                </div>

                                <div className="space-y-1">
                                  <Label className="text-sm">영상소개</Label>
                                  <Textarea
                                    value={video.description}
                                    onChange={(e) =>
                                      updateVideo(
                                        session.id,
                                        video.id,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                    rows={2}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label>강사소개</Label>
                      <div className="border rounded-md">
                        <ReactQuill
                          theme="snow"
                          value={formData.instructorIntro}
                          onChange={(value) =>
                            setFormData({ ...formData, instructorIntro: value })
                          }
                          modules={quillModules}
                          formats={quillFormats}
                          placeholder="강사 소개를 입력하세요"
                          style={{ minHeight: "200px" }}
                        />
                      </div>
                    </div>

                    <Button onClick={handleSave} className="w-full" disabled={saving || uploading}>
                      {(saving || uploading) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      {uploading ? "이미지 업로드 중..." : saving ? "저장 중..." : "저장"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                강의 목록을 불러오는 중...
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortCourses("title")} className="h-auto p-0 font-medium">
                        제목 <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortCourses("category")} className="h-auto p-0 font-medium">
                        분야 <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>강사소개</TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortCourses("price")} className="h-auto p-0 font-medium">
                        가격 <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortCourses("duration")} className="h-auto p-0 font-medium">
                        시간 <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>수강생</TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortCourses("status")} className="h-auto p-0 font-medium">
                        상태 <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedLectures.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        등록된 강의가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedLectures.map((lecture) => (
                      <TableRow key={lecture.id}>
                        <TableCell className="font-medium max-w-[220px]">
                          <div className="truncate">{lecture.title}</div>
                        </TableCell>
                        <TableCell>{lecture.category}</TableCell>
                        <TableCell className="max-w-[180px]">
                          <div className="truncate">{stripHtml(lecture.instructor_intro)}</div>
                        </TableCell>
                        <TableCell>
                          {lecture.discount_price != null ? (
                            <div>
                              <div className="line-through text-xs text-muted-foreground">
                                {lecture.price.toLocaleString()}원
                              </div>
                              <div>{lecture.discount_price.toLocaleString()}원</div>
                            </div>
                          ) : (
                            `${lecture.price.toLocaleString()}원`
                          )}
                        </TableCell>
                        <TableCell>{formatMinutesLabel(lecture.duration)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => {
                              setSelectedLectureId(lecture.id);
                              setSelectedLectureTitle(lecture.title);
                              setActiveTab("students");
                            }}
                          >
                            {lecture.student_count || 0}명
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={lecture.status === "사용" ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => handleStatusToggle(lecture)}
                          >
                            {lecture.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => openEditDialog(lecture)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(lecture.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="수강생명, 이메일, 과목명으로 검색..."
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                    className="w-80"
                  />
                </div>
                {selectedLectureTitle && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedLectureId(null);
                        setSelectedLectureTitle(null);
                      }}
                    >
                      ← 전체 보기
                    </Button>
                    <h3 className="text-lg font-semibold">{selectedLectureTitle}</h3>
                  </div>
                )}
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortStudents("member_name")} className="h-auto p-0 font-medium">
                        수강생명 <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortStudents("member_email")} className="h-auto p-0 font-medium">
                        이메일 <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortStudents("lecture_name")} className="h-auto p-0 font-medium">
                        과목명 <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortStudents("applied_at")} className="h-auto p-0 font-medium">
                        신청일 <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortStudents("paid_at")} className="h-auto p-0 font-medium">
                        결제일 <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>수강기간</TableHead>
                    <TableHead>결제방법</TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortStudents("price")} className="h-auto p-0 font-medium">
                        결제금액 <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                        수강 신청 내역이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.member_name}</TableCell>
                        <TableCell>{student.member_email}</TableCell>
                        <TableCell>{student.lecture_name}</TableCell>
                        <TableCell>
                          {student.applied_at
                            ? new Date(student.applied_at).toLocaleDateString("ko-KR")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {student.paid_at
                            ? new Date(student.paid_at).toLocaleDateString("ko-KR")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Input
                              type="date"
                              value={student.start_date}
                              onChange={(e) =>
                                updateApplicationDates(
                                  student.id,
                                  e.target.value,
                                  student.end_date
                                )
                              }
                              className="w-32 text-xs"
                            />
                            <span className="self-center">~</span>
                            <Input
                              type="date"
                              value={student.end_date}
                              onChange={(e) =>
                                updateApplicationDates(
                                  student.id,
                                  student.start_date,
                                  e.target.value
                                )
                              }
                              className="w-32 text-xs"
                            />
                          </div>
                        </TableCell>
                        <TableCell>{student.payment_method || "-"}</TableCell>
                        <TableCell>{student.price.toLocaleString()}원</TableCell>
                        <TableCell>
                          <Select
                            value={student.status}
                            onValueChange={(value: ApplicationStatus) =>
                              updateApplicationStatus(student.id, value)
                            }
                          >
                            <SelectTrigger className="w-28">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="신청">신청</SelectItem>
                              <SelectItem value="입금완료">입금완료</SelectItem>
                              <SelectItem value="결제취소">결제취소</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EducationManagement;
