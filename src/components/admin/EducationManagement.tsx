import { useState } from "react";
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
import { Plus, Edit, Trash2, Play, X, Users, Search, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Session {
  id: string;
  sessionTitle: string;
  sessionSubtitle: string;
  lectures: Lecture[];
}

interface Lecture {
  id: string;
  lectureTitle: string;
  lectureSubtitle: string;
  duration: string;
  description: string;
  videoUrl: string;
}

interface Student {
  id: string;
  name: string;
  userId: string;
  courseName: string;
  applicationDate: string;
  paymentDate: string;
  courseDuration: string;
  courseStartDate: string;
  courseEndDate: string;
  paymentMethod: string;
  paymentAmount: string;
  status: "신청" | "결제완료";
}

const EducationManagement = () => {
  const [courses, setCourses] = useState([
    { id: 1, title: "부자가 되는 첫걸음", instructor: "김부자", category: "재테크/주식", price: "99,000", duration: "4주", students: 5, status: "진행중" },
    { id: 2, title: "투자 기초 완전정복", instructor: "이투자", category: "재테크/주식", price: "149,000", duration: "6주", students: 5, status: "진행중" },
    { id: 3, title: "부동산 투자 마스터", instructor: "박부동산", category: "부동산", price: "299,000", duration: "8주", students: 5, status: "준비중" },
  ]);
  
  const [students, setStudents] = useState<Student[]>([
    // 부자가 되는 첫걸음 수강생
    { id: "1", name: "홍길동", userId: "hong123", courseName: "부자가 되는 첫걸음", applicationDate: "2024-06-15", paymentDate: "2024-06-15", courseDuration: "4주", courseStartDate: "2024-06-20", courseEndDate: "2024-07-18", paymentMethod: "카드", paymentAmount: "99,000", status: "결제완료" },
    { id: "2", name: "김영희", userId: "kim456", courseName: "부자가 되는 첫걸음", applicationDate: "2024-06-14", paymentDate: "2024-06-14", courseDuration: "4주", courseStartDate: "2024-06-20", courseEndDate: "2024-07-18", paymentMethod: "계좌이체", paymentAmount: "99,000", status: "결제완료" },
    { id: "3", name: "박철수", userId: "park789", courseName: "부자가 되는 첫걸음", applicationDate: "2024-06-13", paymentDate: "", courseDuration: "4주", courseStartDate: "2024-06-20", courseEndDate: "2024-07-18", paymentMethod: "카드", paymentAmount: "99,000", status: "신청" },
    { id: "4", name: "이민수", userId: "lee101", courseName: "부자가 되는 첫걸음", applicationDate: "2024-06-12", paymentDate: "2024-06-12", courseDuration: "4주", courseStartDate: "2024-06-20", courseEndDate: "2024-07-18", paymentMethod: "카드", paymentAmount: "99,000", status: "결제완료" },
    { id: "5", name: "정수진", userId: "jung202", courseName: "부자가 되는 첫걸음", applicationDate: "2024-06-11", paymentDate: "2024-06-11", courseDuration: "4주", courseStartDate: "2024-06-20", courseEndDate: "2024-07-18", paymentMethod: "계좌이체", paymentAmount: "99,000", status: "결제완료" },
    
    // 투자 기초 완전정복 수강생
    { id: "6", name: "최영수", userId: "choi303", courseName: "투자 기초 완전정복", applicationDate: "2024-06-10", paymentDate: "2024-06-10", courseDuration: "6주", courseStartDate: "2024-07-01", courseEndDate: "2024-08-12", paymentMethod: "카드", paymentAmount: "149,000", status: "결제완료" },
    { id: "7", name: "강민정", userId: "kang404", courseName: "투자 기초 완전정복", applicationDate: "2024-06-09", paymentDate: "2024-06-09", courseDuration: "6주", courseStartDate: "2024-07-01", courseEndDate: "2024-08-12", paymentMethod: "계좌이체", paymentAmount: "149,000", status: "결제완료" },
    { id: "8", name: "윤서영", userId: "yoon505", courseName: "투자 기초 완전정복", applicationDate: "2024-06-08", paymentDate: "", courseDuration: "6주", courseStartDate: "2024-07-01", courseEndDate: "2024-08-12", paymentMethod: "카드", paymentAmount: "149,000", status: "신청" },
    { id: "9", name: "임대한", userId: "lim606", courseName: "투자 기초 완전정복", applicationDate: "2024-06-07", paymentDate: "2024-06-07", courseDuration: "6주", courseStartDate: "2024-07-01", courseEndDate: "2024-08-12", paymentMethod: "카드", paymentAmount: "149,000", status: "결제완료" },
    { id: "10", name: "송미경", userId: "song707", courseName: "투자 기초 완전정복", applicationDate: "2024-06-06", paymentDate: "2024-06-06", courseDuration: "6주", courseStartDate: "2024-07-01", courseEndDate: "2024-08-12", paymentMethod: "계좌이체", paymentAmount: "149,000", status: "결제완료" },
    
    // 부동산 투자 마스터 수강생
    { id: "11", name: "한지민", userId: "han808", courseName: "부동산 투자 마스터", applicationDate: "2024-06-05", paymentDate: "2024-06-05", courseDuration: "8주", courseStartDate: "2024-07-15", courseEndDate: "2024-09-09", paymentMethod: "카드", paymentAmount: "299,000", status: "결제완료" },
    { id: "12", name: "오성민", userId: "oh909", courseName: "부동산 투자 마스터", applicationDate: "2024-06-04", paymentDate: "2024-06-04", courseDuration: "8주", courseStartDate: "2024-07-15", courseEndDate: "2024-09-09", paymentMethod: "계좌이체", paymentAmount: "299,000", status: "결제완료" },
    { id: "13", name: "서준호", userId: "seo010", courseName: "부동산 투자 마스터", applicationDate: "2024-06-03", paymentDate: "", courseDuration: "8주", courseStartDate: "2024-07-15", courseEndDate: "2024-09-09", paymentMethod: "카드", paymentAmount: "299,000", status: "신청" },
    { id: "14", name: "김태연", userId: "kim111", courseName: "부동산 투자 마스터", applicationDate: "2024-06-02", paymentDate: "2024-06-02", courseDuration: "8주", courseStartDate: "2024-07-15", courseEndDate: "2024-09-09", paymentMethod: "카드", paymentAmount: "299,000", status: "결제완료" },
    { id: "15", name: "조현우", userId: "cho212", courseName: "부동산 투자 마스터", applicationDate: "2024-06-01", paymentDate: "2024-06-01", courseDuration: "8주", courseStartDate: "2024-07-15", courseEndDate: "2024-09-09", paymentMethod: "계좌이체", paymentAmount: "299,000", status: "결제완료" },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("courses");
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [courseSortField, setCourseSortField] = useState<string>("");
  const [courseSortDirection, setCourseSortDirection] = useState<"asc" | "desc">("asc");
  const [studentSortField, setStudentSortField] = useState<string>("");
  const [studentSortDirection, setStudentSortDirection] = useState<"asc" | "desc">("asc");
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    image: null as File | null,
    price: "",
    discountPrice: "",
    courseDuration: "",
    introduction: "",
    sampleVideoUrl: "",
    instructorInfo: ""
  });
  const [sessions, setSessions] = useState<Session[]>([]);

  const handleDelete = (id: number) => {
    setCourses(courses.filter(course => course.id !== id));
    toast.success("강의가 삭제되었습니다.");
  };

  const handleStudentsClick = (courseName: string) => {
    setSelectedCourse(courseName);
    setActiveTab("students");
  };

  const getStudentsByCourse = (courseName: string) => {
    return students.filter(student => student.courseName === courseName);
  };

  const updateStudentStatus = (studentId: string, newStatus: "신청" | "결제완료") => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, status: newStatus }
        : student
    ));
  };

  const updateStudentDuration = (studentId: string, startDate: string, endDate: string) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, courseStartDate: startDate, courseEndDate: endDate }
        : student
    ));
  };

  // 정렬 함수
  const sortCourses = (field: string) => {
    const direction = courseSortField === field && courseSortDirection === "asc" ? "desc" : "asc";
    setCourseSortField(field);
    setCourseSortDirection(direction);

    const sortedCourses = [...courses].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];
      
      if (field === "students" || field === "id") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }
      
      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
    
    setCourses(sortedCourses);
  };

  const sortStudents = (field: string) => {
    const direction = studentSortField === field && studentSortDirection === "asc" ? "desc" : "asc";
    setStudentSortField(field);
    setStudentSortDirection(direction);

    const sortedStudents = [...students].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      
      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
    
    setStudents(sortedStudents);
  };

  // 필터링된 데이터
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(courseSearchTerm.toLowerCase())
  );

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
      student.userId.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
      student.courseName.toLowerCase().includes(studentSearchTerm.toLowerCase());
    
    if (selectedCourse) {
      return matchesSearch && student.courseName === selectedCourse;
    }
    return matchesSearch;
  });

  const addSession = () => {
    const newSession: Session = {
      id: Date.now().toString(),
      sessionTitle: "",
      sessionSubtitle: "",
      lectures: []
    };
    setSessions([...sessions, newSession]);
  };

  const removeSession = (sessionId: string) => {
    setSessions(sessions.filter(session => session.id !== sessionId));
  };

  const updateSession = (sessionId: string, field: string, value: string) => {
    setSessions(sessions.map(session => 
      session.id === sessionId 
        ? { ...session, [field]: value }
        : session
    ));
  };

  const addLecture = (sessionId: string) => {
    const newLecture: Lecture = {
      id: Date.now().toString(),
      lectureTitle: "",
      lectureSubtitle: "",
      duration: "",
      description: "",
      videoUrl: ""
    };
    setSessions(sessions.map(session =>
      session.id === sessionId
        ? { ...session, lectures: [...session.lectures, newLecture] }
        : session
    ));
  };

  const removeLecture = (sessionId: string, lectureId: string) => {
    setSessions(sessions.map(session =>
      session.id === sessionId
        ? { ...session, lectures: session.lectures.filter(lecture => lecture.id !== lectureId) }
        : session
    ));
  };

  const updateLecture = (sessionId: string, lectureId: string, field: string, value: string) => {
    setSessions(sessions.map(session =>
      session.id === sessionId
        ? {
            ...session,
            lectures: session.lectures.map(lecture =>
              lecture.id === lectureId
                ? { ...lecture, [field]: value }
                : lecture
            )
          }
        : session
    ));
  };

  const handleSave = () => {
    console.log("Form Data:", formData);
    console.log("Sessions:", sessions);
    toast.success("강의가 저장되었습니다.");
    setIsDialogOpen(false);
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'link', 'image'
  ];

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
                  placeholder="강의명, 강사명, 분야로 검색..."
                  value={courseSearchTerm}
                  onChange={(e) => setCourseSearchTerm(e.target.value)}
                  className="w-80"
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    강의 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>강의 정보</DialogTitle>
                    <DialogDescription>
                      새로운 강의를 추가하거나 기존 강의 정보를 수정합니다.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* 분야 */}
                    <div className="space-y-2">
                      <Label htmlFor="category">분야</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="분야를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="core-free">CORE FREE</SelectItem>
                          <SelectItem value="real-estate">부동산</SelectItem>
                          <SelectItem value="tax">세무</SelectItem>
                          <SelectItem value="investment">재테크/주식</SelectItem>
                          <SelectItem value="startup">창업/부업</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 강과명 */}
                    <div className="space-y-2">
                      <Label htmlFor="title">강과명</Label>
                      <Input 
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="강의 제목을 입력하세요" 
                      />
                    </div>

                    {/* 대표 이미지 */}
                    <div className="space-y-2">
                      <Label htmlFor="image">대표 이미지</Label>
                      <Input 
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormData({...formData, image: e.target.files?.[0] || null})}
                      />
                    </div>

                    {/* 수강가격 */}
                    <div className="space-y-2">
                      <Label htmlFor="price">수강가격 (원)</Label>
                      <Input 
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        placeholder="수강가격을 입력하세요" 
                      />
                    </div>

                    {/* 할인가격 */}
                    <div className="space-y-2">
                      <Label htmlFor="discountPrice">할인가격 (원) - 선택사항</Label>
                      <Input 
                        id="discountPrice"
                        type="number"
                        value={formData.discountPrice}
                        onChange={(e) => setFormData({...formData, discountPrice: e.target.value})}
                        placeholder="할인가격을 입력하세요 (선택사항)" 
                      />
                    </div>

                    {/* 수강기간 */}
                    <div className="space-y-2">
                      <Label htmlFor="courseDuration">수강기간</Label>
                      <Input 
                        id="courseDuration"
                        value={formData.courseDuration}
                        onChange={(e) => setFormData({...formData, courseDuration: e.target.value})}
                        placeholder="예: 4주, 30일" 
                      />
                    </div>

                    {/* 강의소개 */}
                    <div className="space-y-2">
                      <Label htmlFor="introduction">강의소개</Label>
                      <div className="border rounded-md">
                        <ReactQuill
                          theme="snow"
                          value={formData.introduction}
                          onChange={(value) => setFormData({...formData, introduction: value})}
                          modules={quillModules}
                          formats={quillFormats}
                          placeholder="강의 소개를 입력하세요"
                          style={{ minHeight: '200px' }}
                        />
                      </div>
                    </div>

                    {/* 샘플영상 URL */}
                    <div className="space-y-2">
                      <Label htmlFor="sampleVideoUrl">샘플영상 URL</Label>
                      <Input 
                        id="sampleVideoUrl"
                        type="url"
                        value={formData.sampleVideoUrl}
                        onChange={(e) => setFormData({...formData, sampleVideoUrl: e.target.value})}
                        placeholder="YouTube, Vimeo 등 샘플영상 URL을 입력하세요" 
                      />
                    </div>

                    {/* 커리큘럼 */}
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
                                onChange={(e) => updateSession(session.id, 'sessionTitle', e.target.value)}
                                placeholder="세션 대제목"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>세션명 (소제목)</Label>
                              <Input
                                value={session.sessionSubtitle}
                                onChange={(e) => updateSession(session.id, 'sessionSubtitle', e.target.value)}
                                placeholder="세션 소제목"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>강의</Label>
                              <Button
                                type="button"
                                onClick={() => addLecture(session.id)}
                                variant="outline"
                                size="sm"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                강의 추가
                              </Button>
                            </div>
                            
                            {session.lectures.map((lecture, lectureIndex) => (
                              <div key={lecture.id} className="border rounded p-3 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">강의 {lectureIndex + 1}</span>
                                  <Button
                                    type="button"
                                    onClick={() => removeLecture(session.id, lecture.id)}
                                    variant="ghost"
                                    size="sm"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <Label className="text-sm">강의명 (대제목)</Label>
                                    <Input
                                      value={lecture.lectureTitle}
                                      onChange={(e) => updateLecture(session.id, lecture.id, 'lectureTitle', e.target.value)}
                                      placeholder="강의 대제목"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-sm">강의명 (소제목)</Label>
                                    <Input
                                      value={lecture.lectureSubtitle}
                                      onChange={(e) => updateLecture(session.id, lecture.id, 'lectureSubtitle', e.target.value)}
                                      placeholder="강의 소제목"
                                    />
                                  </div>
                                </div>
                                
                                <div className="space-y-1">
                                  <Label className="text-sm">강의시간</Label>
                                  <Input
                                    value={lecture.duration}
                                    onChange={(e) => updateLecture(session.id, lecture.id, 'duration', e.target.value)}
                                    placeholder="예: 30분"
                                  />
                                </div>
                                
                                <div className="space-y-1">
                                  <Label className="text-sm">동영상 링크</Label>
                                  <Input
                                    value={lecture.videoUrl}
                                    onChange={(e) => updateLecture(session.id, lecture.id, 'videoUrl', e.target.value)}
                                    placeholder="YouTube, Vimeo 등 동영상 URL을 입력하세요"
                                    type="url"
                                  />
                                </div>
                                
                                <div className="space-y-1">
                                  <Label className="text-sm">강의소개</Label>
                                  <Textarea
                                    value={lecture.description}
                                    onChange={(e) => updateLecture(session.id, lecture.id, 'description', e.target.value)}
                                    placeholder="강의 소개를 입력하세요"
                                    rows={2}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 강사소개 */}
                    <div className="space-y-2">
                      <Label htmlFor="instructorInfo">강사소개</Label>
                      <div className="border rounded-md">
                        <ReactQuill
                          theme="snow"
                          value={formData.instructorInfo}
                          onChange={(value) => setFormData({...formData, instructorInfo: value})}
                          modules={quillModules}
                          formats={quillFormats}
                          placeholder="강사 소개를 입력하세요"
                          style={{ minHeight: '200px' }}
                        />
                      </div>
                    </div>

                    <Button onClick={handleSave} className="w-full">저장</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" onClick={() => sortCourses('title')} className="h-auto p-0 font-medium">
                      제목 <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => sortCourses('category')} className="h-auto p-0 font-medium">
                      분야 <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => sortCourses('instructor')} className="h-auto p-0 font-medium">
                      강사 <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => sortCourses('price')} className="h-auto p-0 font-medium">
                      가격 <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => sortCourses('duration')} className="h-auto p-0 font-medium">
                      기간 <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => sortCourses('students')} className="h-auto p-0 font-medium">
                      수강생 <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => sortCourses('status')} className="h-auto p-0 font-medium">
                      상태 <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>{course.category}</TableCell>
                    <TableCell>{course.instructor}</TableCell>
                    <TableCell>{course.price}원</TableCell>
                    <TableCell>{course.duration}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStudentsClick(course.title)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {course.students}명
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge variant={course.status === "진행중" ? "default" : "secondary"}>
                        {course.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(course.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="수강생명, ID, 과목명으로 검색..."
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                    className="w-80"
                  />
                </div>
                {selectedCourse && (
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedCourse(null)}
                    >
                      ← 전체 보기
                    </Button>
                    <h3 className="text-lg font-semibold">{selectedCourse}</h3>
                  </div>
                )}
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortStudents('name')} className="h-auto p-0 font-medium">
                        수강생명 <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortStudents('userId')} className="h-auto p-0 font-medium">
                        ID <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortStudents('courseName')} className="h-auto p-0 font-medium">
                        과목명 <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortStudents('applicationDate')} className="h-auto p-0 font-medium">
                        신청일 <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortStudents('paymentDate')} className="h-auto p-0 font-medium">
                        결제일 <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>수강기간</TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortStudents('paymentMethod')} className="h-auto p-0 font-medium">
                        결제방법 <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => sortStudents('paymentAmount')} className="h-auto p-0 font-medium">
                        결제금액 <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.userId}</TableCell>
                      <TableCell>{student.courseName}</TableCell>
                      <TableCell>{student.applicationDate}</TableCell>
                      <TableCell>{student.paymentDate || "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Input
                            type="date"
                            value={student.courseStartDate}
                            onChange={(e) => updateStudentDuration(student.id, e.target.value, student.courseEndDate)}
                            className="w-32 text-xs"
                          />
                          <span className="self-center">~</span>
                          <Input
                            type="date"
                            value={student.courseEndDate}
                            onChange={(e) => updateStudentDuration(student.id, student.courseStartDate, e.target.value)}
                            className="w-32 text-xs"
                          />
                        </div>
                      </TableCell>
                      <TableCell>{student.paymentMethod}</TableCell>
                      <TableCell>{student.paymentAmount}원</TableCell>
                      <TableCell>
                        <Select
                          value={student.status}
                          onValueChange={(value: "신청" | "결제완료") => updateStudentStatus(student.id, value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="신청">신청</SelectItem>
                            <SelectItem value="결제완료">결제완료</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
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
