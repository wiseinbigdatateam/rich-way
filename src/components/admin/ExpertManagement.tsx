import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, User, Upload, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const ExpertManagement = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingExpert, setEditingExpert] = useState(null);
  const [form, setForm] = useState({
    user_id: "",
    password: "",
    profile_image_url: "",
    expert_name: "",
    company_name: "",
    email: "",
    main_field: "",
    company_phone: "",
    personal_phone: "",
    tags: "",
    core_intro: "",
    youtube_channel_url: "",
    intro_video_url: "",
    press_url: "",
    education_and_certifications: "",
    career: "",
    achievements: "",
    expertise_detail: "",
    experience_years: "",
    status: "대기",
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const specialties = [
    "부동산",
    "세무절세", 
    "금융레버리지",
    "사업",
    "은퇴설계",
    "보험",
    "기타"
  ];

  // useEffect 밖으로 분리
  const fetchExpertsAndRatings = async () => {
    setLoading(true);
    setError(null);
    // 전문가 목록 가져오기
    const { data: expertsData, error: expertsError } = await supabase.from("experts").select("*");
    if (expertsError) {
      setError(expertsError.message);
      setExperts([]);
      setLoading(false);
      return;
    }
    // 전문가별 평균 평점 가져오기
    const { data: ratingsData, error: ratingsError } = await supabase
      .from("expert_reviews")
      .select("expert_user_id, rating");
    const ratingMap: Record<string, number> = {};
    if (!ratingsError && ratingsData) {
      // 전문가별 rating 평균 계산
      const ratingStats: Record<string, { sum: number; count: number }> = {};
      ratingsData.forEach((row: any) => {
        if (!ratingStats[row.expert_user_id]) {
          ratingStats[row.expert_user_id] = { sum: 0, count: 0 };
        }
        ratingStats[row.expert_user_id].sum += row.rating;
        ratingStats[row.expert_user_id].count += 1;
      });
      Object.entries(ratingStats).forEach(([expert_user_id, stat]) => {
        ratingMap[expert_user_id] = stat.count > 0 ? stat.sum / stat.count : 0;
      });
    }
    // experts에 평균 평점 매핑
    const expertsWithRating = (expertsData || []).map((expert: any) => ({
      ...expert,
      avg_rating: ratingMap[expert.user_id] ? Math.round(ratingMap[expert.user_id] * 10) / 10 : null,
    }));
    setExperts(expertsWithRating);
    setLoading(false);
  };

  useEffect(() => {
    fetchExpertsAndRatings();
  }, []);

  const handleDelete = (id: number) => {
    setExperts(experts.filter(expert => expert.id !== id));
    toast.success("전문가가 삭제되었습니다.");
  };

  const handleEdit = async (expert) => {
    const { data, error } = await (supabase
      .from("experts")
      .select("*")
      .eq("user_id", expert.user_id)
      .single() as any);
    if (error || !data) {
      toast.error("전문가 정보를 불러오지 못했습니다.");
      return;
    }
    setEditingExpert(data);
    setIsEditMode(true);
    setEditingUserId(data.user_id);
    setForm({
      user_id: data.user_id || "",
      password: "", // 비밀번호는 보안상 비워둠
      profile_image_url: data.profile_image_url || "",
      expert_name: data.expert_name || "",
      company_name: data.company_name || "",
      email: data.email || "",
      main_field: data.main_field || "",
      company_phone: data.company_phone || "",
      personal_phone: data.personal_phone || "",
      tags: Array.isArray(data.tags) ? data.tags.join("#") : (data.tags || ""),
      core_intro: data.core_intro || "",
      youtube_channel_url: data.youtube_channel_url || "",
      intro_video_url: data.intro_video_url || "",
      press_url: data.press_url || "",
      education_and_certifications: Array.isArray(data.education_and_certifications) ? data.education_and_certifications.join("\n") : (data.education_and_certifications || ""),
      career: Array.isArray(data.career) ? data.career.join("\n") : (data.career || ""),
      achievements: Array.isArray(data.achievements) ? data.achievements.join("\n") : (data.achievements || ""),
      expertise_detail: data.expertise_detail || "",
      experience_years: data.experience_years !== undefined && data.experience_years !== null ? String(data.experience_years) : "",
      status: data.status || "대기",
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingExpert(null);
    setIsEditMode(false);
    setEditingUserId(null);
    setForm({
      user_id: "",
      password: "",
      profile_image_url: "",
      expert_name: "",
      company_name: "",
      email: "",
      main_field: "",
      company_phone: "",
      personal_phone: "",
      tags: "",
      core_intro: "",
      youtube_channel_url: "",
      intro_video_url: "",
      press_url: "",
      education_and_certifications: "",
      career: "",
      achievements: "",
      expertise_detail: "",
      experience_years: "",
      status: "대기",
    });
    setIsDialogOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "user_id") {
      // 한글 제거
      const onlyAscii = value.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, "");
      if (value !== onlyAscii) {
        toast.error("아이디에는 한글을 사용할 수 없습니다.");
      }
      setForm({ ...form, [name]: onlyAscii });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!form.user_id || (!isEditMode && !form.password) || !form.expert_name || !form.email || !form.main_field) {
      toast.error("필수 항목을 입력하세요.");
      return;
    }

    try {
      // 새 전문가 등록 시 experts 테이블에만 저장
      if (!isEditMode) {
        console.log('🔄 새 전문가 등록 - experts 테이블에 저장 중...');
        
        // 1. experts 테이블에 해당 user_id나 email이 있는지 확인
        const { data: existingExperts, error: checkError } = await (supabase as any)
          .from('experts')
          .select('user_id, email')
          .or(`user_id.eq.${form.user_id},email.eq.${form.email}`);

        if (checkError) {
          console.error('Experts 확인 오류:', checkError);
          toast.error('전문가 정보 확인 중 오류가 발생했습니다.');
          return;
        }

        // 2. 중복 확인
        if (existingExperts && existingExperts.length > 0) {
          const existingUser = existingExperts.find((e: any) => e.user_id === form.user_id);
          const existingEmail = existingExperts.find((e: any) => e.email === form.email);
          
          if (existingUser) {
            toast.error('이미 존재하는 전문가 아이디입니다. 다른 아이디를 사용해주세요.');
            return;
          }
          
          if (existingEmail) {
            toast.error('이미 사용 중인 이메일입니다. 다른 이메일을 사용해주세요.');
            return;
          }
        }
      }

      // 3. experts 테이블에 전문가 정보 저장/수정
      const insertForm = {
        ...form,
        experience_years: form.experience_years ? Number(form.experience_years) : null,
        tags: form.tags ? form.tags.split("#").map(tag => tag.trim()).filter(Boolean) : [],
        education_and_certifications: form.education_and_certifications ? form.education_and_certifications.split("\n").map(item => item.trim()).filter(Boolean) : [],
        career: form.career ? form.career.split("\n").map(item => item.trim()).filter(Boolean) : [],
        achievements: form.achievements ? form.achievements.split("\n").map(item => item.trim()).filter(Boolean) : [],
      };

      let error;
      if (isEditMode && editingUserId) {
        // 수정 모드: 비밀번호 입력이 없으면 password 필드 제외
        const updateForm = { ...insertForm };
        if (!form.password) {
          delete updateForm.password;
        }
        ({ error } = await (supabase as any).from("experts").update(updateForm).eq("user_id", editingUserId));
      } else {
        // 새 등록 모드
        ({ error } = await supabase.from("experts").insert([insertForm]));
      }

      if (error) {
        console.error("Experts 저장 오류:", error);
        
        // 구체적인 에러 메시지 제공
        if (error.code === '23505') {
          toast.error('이미 등록된 전문가입니다. 다른 아이디를 사용해주세요.');
        } else if (error.code === '409') {
          toast.error('데이터 충돌이 발생했습니다. 페이지를 새로고침하고 다시 시도해주세요.');
        } else {
          toast.error(isEditMode ? "전문가 정보 수정에 실패했습니다." : "전문가 등록에 실패했습니다.");
        }
        return;
      }

      toast.success(isEditMode ? "전문가 정보가 수정되었습니다." : "전문가가 등록되었습니다.");
      setIsDialogOpen(false);
      setForm({
        user_id: "",
        password: "",
        profile_image_url: "",
        expert_name: "",
        company_name: "",
        email: "",
        main_field: "",
        company_phone: "",
        personal_phone: "",
        tags: "",
        core_intro: "",
        youtube_channel_url: "",
        intro_video_url: "",
        press_url: "",
        education_and_certifications: "",
        career: "",
        achievements: "",
        expertise_detail: "",
        experience_years: "",
        status: "대기",
      });
      setIsEditMode(false);
      setEditingUserId(null);
      await fetchExpertsAndRatings(); // 저장/수정 성공 시 목록 즉시 갱신

    } catch (error) {
      console.error('전문가 저장 중 예외 발생:', error);
      toast.error('알 수 없는 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 프로필 이미지 업로드
  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `expert_${form.user_id || Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage.from('profile-images').upload(fileName, file, { upsert: true });
    if (error) {
      toast.error('이미지 업로드에 실패했습니다.');
      setUploading(false);
      return;
    }
    // public URL 얻기
    const { data: publicUrlData } = supabase.storage.from('profile-images').getPublicUrl(fileName);
    setForm({ ...form, profile_image_url: publicUrlData.publicUrl });
    setUploading(false);
    toast.success('프로필 이미지가 업로드되었습니다.');
  };

  // 사진 업로드 버튼 클릭 시 파일 input 트리거
  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Badge 색상 결정 함수(예시, 필요시 상태/등급/첨부파일 등 컬럼에 적용)
  const getBadgeVariant = (value: string) => {
    if (!value) return "secondary";
    if (value.includes("활성")) return "default";
    if (value.includes("대기")) return "secondary";
    if (value.includes("비활성")) return "destructive";
    if (value.endsWith("pdf")) return "default";
    if (value.endsWith("xlsx")) return "default";
    return "outline";
  };

  const paginatedExperts = experts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(experts.length / pageSize);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          전문가 관리
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                전문가 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "전문가 정보 수정" : "전문가 등록"}
                </DialogTitle>
                <DialogDescription>
                  전문가의 프로필 정보와 코칭 상품을 설정합니다.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 p-2">
                {/* 프로필 이미지 */}
                <div className="space-y-2">
                  <Label>프로필 이미지</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                      {form.profile_image_url ? (
                        <img src={form.profile_image_url} alt="프로필" className="object-cover w-20 h-20" />
                      ) : (
                        <User className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <Button variant="outline" className="flex items-center gap-2" onClick={handleUploadButtonClick} disabled={uploading}>
                      <Upload className="h-4 w-4" />
                      {uploading ? '업로드 중...' : '사진 업로드'}
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleProfileImageUpload}
                      aria-label="프로필 이미지 업로드"
                    />
                  </div>
                </div>
                {/* user_id, password 입력 필드 */}
                <div className="flex gap-4">
                  {/* 아이디 */}
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="user_id">아이디 *</Label>
                    <Input name="user_id" placeholder="아이디" value={form.user_id} onChange={handleFormChange} autoComplete="username" />
                  </div>
                  {/* 비밀번호 */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-row items-center gap-2 mt-2">
                      <Label htmlFor="password">비밀번호 *</Label>
                      <span className="text-xs text-gray-500 ml-1">(미입력 시 기존 비밀번호 유지)</span>
                    </div>
                    <div className="relative flex items-center">
                      <Input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="비밀번호"
                        value={form.password}
                        onChange={handleFormChange}
                        autoComplete="new-password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        tabIndex={0}
                        aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
                {/* 이름/소속 등 나머지 필드 */}
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Label>이름 *</Label>
                    <Input name="expert_name" value={form.expert_name} onChange={handleFormChange} placeholder="전문가 이름" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>회사(소속)</Label>
                    <Input name="company_name" value={form.company_name} onChange={handleFormChange} placeholder="소속 회사명" />
                  </div>
                </div>
                {/* 기본 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>이메일 *</Label>
                    <Input name="email" value={form.email} onChange={handleFormChange} type="email" placeholder="email@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>대표분야 *</Label>
                    <Select value={form.main_field} onValueChange={val => setForm({ ...form, main_field: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="전문 분야 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* 연락처 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>회사 전화번호</Label>
                    <Input name="company_phone" value={form.company_phone} onChange={handleFormChange} placeholder="02-1234-5678" />
                  </div>
                  <div className="space-y-2">
                    <Label>개인 전화번호</Label>
                    <Input name="personal_phone" value={form.personal_phone} onChange={handleFormChange} placeholder="010-1234-5678" />
                  </div>
                </div>
                {/* 태그 */}
                <div className="space-y-2">
                  <Label>태그 (최대 10개)</Label>
                  <Input name="tags" value={form.tags} onChange={handleFormChange} placeholder="#부동산 #투자 #재테크 #자산관리" />
                  <p className="text-sm text-gray-500"># 기호로 구분하여 입력하세요</p>
                </div>
                {/* 핵심 소개 */}
                <div className="space-y-2">
                  <Label>핵심 소개</Label>
                  <Textarea name="core_intro" value={form.core_intro} onChange={handleFormChange} placeholder="전문가의 핵심 소개를 2줄 정도로 입력하세요" rows={2} />
                </div>
                {/* 링크 정보 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">링크 정보</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label>운영 유튜브 링크</Label>
                      <Input name="youtube_channel_url" value={form.youtube_channel_url} onChange={handleFormChange} placeholder="https://youtube.com/@channel" type="url" />
                    </div>
                    <div className="space-y-2">
                      <Label>소개 영상</Label>
                      <Input name="intro_video_url" value={form.intro_video_url} onChange={handleFormChange} placeholder="https://youtube.com/watch?v=..." type="url" />
                    </div>
                    <div className="space-y-2">
                      <Label>언론 보도 링크</Label>
                      <Input name="press_url" value={form.press_url} onChange={handleFormChange} placeholder="https://news.example.com/article" type="url" />
                    </div>
                  </div>
                </div>
                {/* 상세 정보 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">상세 정보</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>학력 및 자격</Label>
                      <Textarea name="education_and_certifications" value={form.education_and_certifications} onChange={handleFormChange} placeholder="학력 사항과 보유 자격증을 입력하세요" rows={4} />
                    </div>
                    <div className="space-y-2">
                      <Label>경력</Label>
                      <Textarea name="career" value={form.career} onChange={handleFormChange} placeholder="주요 경력 사항을 입력하세요" rows={4} />
                    </div>
                    <div className="space-y-2">
                      <Label>주요 성과</Label>
                      <Textarea name="achievements" value={form.achievements} onChange={handleFormChange} placeholder="주요 성과와 실적을 입력하세요" rows={4} />
                    </div>
                    <div className="space-y-2">
                      <Label>전문 영역</Label>
                      <Textarea name="expertise_detail" value={form.expertise_detail} onChange={handleFormChange} placeholder="상세 전문 영역과 서비스 내용을 입력하세요" rows={4} />
                    </div>
                  </div>
                </div>
                {/* 기타 설정 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>경력 (년)</Label>
                    <Input name="experience_years" value={form.experience_years} onChange={handleFormChange} placeholder="15" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label>상태</Label>
                    <Select value={form.status} onValueChange={val => setForm({ ...form, status: val })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="활성">활성</SelectItem>
                        <SelectItem value="대기">대기</SelectItem>
                        <SelectItem value="비활성">비활성</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 코칭 상품 등급별 설정 */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">코칭 상품 등급</h3>
                  
                  {/* FREE 등급 */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary">FREE</Badge>
                      <span className="text-sm text-gray-600">무료 코칭</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>가격</Label>
                        <Input value="0원" disabled className="bg-gray-100" />
                        <p className="text-xs text-gray-500">FREE 등급은 0원으로 고정됩니다</p>
                      </div>
                      <div className="space-y-2">
                        <Label>소요시간</Label>
                        <Input placeholder="30분" />
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label>상품 소개</Label>
                      <Textarea 
                        placeholder="FREE 등급 코칭의 내용과 특징을 입력하세요"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* DELUXE 등급 */}
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="default">DELUXE</Badge>
                      <span className="text-sm text-gray-600">스탠다드 코칭</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>가격 (원)</Label>
                        <Input placeholder="250000" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>소요시간</Label>
                        <Input placeholder="60분" />
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label>상품 소개</Label>
                      <Textarea 
                        placeholder="DELUXE 등급 코칭의 내용과 특징을 입력하세요"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* PREMIUM 등급 */}
                  <div className="border rounded-lg p-4 bg-yellow-50">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="destructive">PREMIUM</Badge>
                      <span className="text-sm text-gray-600">프리미엄 코칭</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>가격 (원)</Label>
                        <Input placeholder="500000" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>소요시간</Label>
                        <Input placeholder="90분" />
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label>상품 소개</Label>
                      <Textarea 
                        placeholder="PREMIUM 등급 코칭의 내용과 특징을 입력하세요"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} className="flex-1">저장</Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">취소</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="p-4 text-center text-gray-500">로딩 중...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>전문가명</TableHead>
                <TableHead>소속</TableHead>
                <TableHead>전문분야</TableHead>
                <TableHead>경력</TableHead>
                <TableHead>평점</TableHead>
                <TableHead>가격</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedExperts.map((expert) => (
                <TableRow key={expert.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {expert.expert_name}
                  </TableCell>
                  <TableCell>{expert.company_name}</TableCell>
                  <TableCell>{expert.main_field}</TableCell>
                  <TableCell>{expert.experience_years ? `${expert.experience_years}년` : "-"}</TableCell>
                  <TableCell>⭐ {expert.avg_rating !== null && expert.avg_rating !== undefined ? expert.avg_rating.toFixed(1) : "-"}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(expert.status)}>{expert.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit(expert)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(expert.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <div className="flex items-center justify-between mt-4 w-full">
          <div className="flex-1"></div>
          <div className="flex items-center gap-2 justify-center">
            <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>이전</Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button key={i+1} variant={currentPage === i+1 ? "default" : "outline"} onClick={() => setCurrentPage(i+1)}>{i+1}</Button>
            ))}
            <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>다음</Button>
          </div>
          <div className="flex-1 flex justify-end">
            <Select value={String(pageSize)} onValueChange={v => { setPageSize(Number(v)); setCurrentPage(1); }}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10개씩</SelectItem>
                <SelectItem value="50">50개씩</SelectItem>
                <SelectItem value="100">100개씩</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertManagement;
