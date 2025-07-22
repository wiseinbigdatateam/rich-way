import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { User, Upload, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { uploadImageToS3, generateFileName } from "@/lib/awsS3";

const ExpertRegistrationPage = () => {
  const navigate = useNavigate();
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
    is_featured: false
  });

  // expert_products 상태 추가
  const [expertProducts, setExpertProducts] = useState({
    FREE: { price: 0, duration: 30, description: "" },
    DELUXE: { price: 250000, duration: 60, description: "" },
    PREMIUM: { price: 500000, duration: 90, description: "" }
  });

  const [uploading, setUploading] = useState(false);
  const [checkingUserId, setCheckingUserId] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [userIdAvailable, setUserIdAvailable] = useState<boolean | null>(null);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const specialties = [
    "부동산",
    "세무절세", 
    "금융레버리지",
    "사업",
    "은퇴설계",
    "보험",
    "기타"
  ];

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductChange = (type: string, field: string, value: string | number) => {
    setExpertProducts(prev => ({
      ...prev,
      [type]: {
        ...prev[type as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleCheckUserId = async () => {
    if (!form.user_id.trim()) {
      toast.error("아이디를 입력해주세요.");
      return;
    }

    setCheckingUserId(true);
    try {
      const { data, error } = await supabase
        .from("experts")
        .select("user_id");

      if (error) {
        setUserIdAvailable(true);
        toast.success("사용 가능한 아이디입니다.");
      } else if (data && data.some((expert: any) => expert.user_id === form.user_id)) {
        setUserIdAvailable(false);
        toast.error("이미 사용 중인 아이디입니다.");
      } else {
        setUserIdAvailable(true);
        toast.success("사용 가능한 아이디입니다.");
      }
    } catch (error) {
      console.error("아이디 확인 중 오류:", error);
      toast.error("아이디 확인 중 오류가 발생했습니다.");
    } finally {
      setCheckingUserId(false);
    }
  };

  const handleCheckEmail = async () => {
    if (!form.email.trim()) {
      toast.error("이메일을 입력해주세요.");
      return;
    }

    setCheckingEmail(true);
    try {
      const { data, error } = await supabase
        .from("experts")
        .select("email");

      if (error) {
        setEmailAvailable(true);
        toast.success("사용 가능한 이메일입니다.");
      } else if (data && data.some((expert: any) => expert.email === form.email)) {
        setEmailAvailable(false);
        toast.error("이미 사용 중인 이메일입니다.");
      } else {
        setEmailAvailable(true);
        toast.success("사용 가능한 이메일입니다.");
      }
    } catch (error) {
      console.error("이메일 확인 중 오류:", error);
      toast.error("이메일 확인 중 오류가 발생했습니다.");
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    setUploading(true);
    try {
      const fileName = generateFileName(file.name, "expert-profiles");
      const uploadedUrl = await uploadImageToS3(file, fileName);
      
      setForm(prev => ({
        ...prev,
        profile_image_url: uploadedUrl
      }));
      
      toast.success("프로필 이미지가 업로드되었습니다.");
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      toast.error("이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 숫자 필드 처리: 빈 문자열이면 null, 값이 있으면 Number로 변환
    const submitForm = {
      ...form,
      experience_years:
        form.experience_years && !isNaN(Number(form.experience_years))
          ? Number(form.experience_years)
          : null,
      tags:
        !form.tags || form.tags.trim() === ""
          ? null
          : Array.isArray(form.tags)
            ? form.tags
            : form.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean),
    };

    if (!form.user_id || !form.password || !form.expert_name || !form.email || !form.main_field) {
      toast.error("필수 항목을 모두 입력해주세요.");
      return;
    }

    if (userIdAvailable === false) {
      toast.error("사용할 수 없는 아이디입니다.");
      return;
    }

    if (emailAvailable === false) {
      toast.error("사용할 수 없는 이메일입니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. 전문가 정보 저장
      const { data: expertData, error: expertError } = await supabase
        .from("experts")
        .insert([submitForm]);

      if (expertError) {
        console.error("전문가 등록 오류:", expertError);
        toast.error("전문가 등록에 실패했습니다.");
        return;
      }

      // 2. 전문가 상품 정보 저장
      const productsToInsert = Object.entries(expertProducts).map(([type, product]) => ({
        user_id: submitForm.user_id,
        product_name: type,
        regular_price: product.price,
        price: product.price,
        duration: product.duration,
        description: product.description
      }));

      const { error: productsError } = await supabase
        .from("expert_products")
        .insert(productsToInsert);

      if (productsError) {
        console.error("상품 정보 저장 오류:", productsError);
        toast.error("상품 정보 저장에 실패했습니다.");
        return;
      }

      toast.success("전문가 등록 신청이 완료되었습니다. 관리자 검토 후 승인됩니다.");
      navigate("/expert/login");
    } catch (error) {
      console.error("전문가 등록 중 오류:", error);
      toast.error("전문가 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/expert/login")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            돌아가기
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">전문가 등록 신청</h1>
            <p className="text-gray-600 mt-2">전문가로 등록하여 회원들에게 코칭 서비스를 제공하세요</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="user_id">아이디 *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="user_id"
                      name="user_id"
                      value={form.user_id}
                      onChange={handleFormChange}
                      placeholder="전문가 아이디"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCheckUserId}
                      disabled={checkingUserId}
                      className="whitespace-nowrap"
                    >
                      {checkingUserId ? "확인중..." : "중복확인"}
                    </Button>
                  </div>
                  {userIdAvailable === true && (
                    <p className="text-sm text-green-600">✓ 사용 가능한 아이디입니다.</p>
                  )}
                  {userIdAvailable === false && (
                    <p className="text-sm text-red-600">✗ 이미 사용 중인 아이디입니다.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">비밀번호 *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleFormChange}
                      placeholder="비밀번호"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expert_name">이름 *</Label>
                  <Input
                    id="expert_name"
                    name="expert_name"
                    value={form.expert_name}
                    onChange={handleFormChange}
                    placeholder="전문가 이름"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">이메일 *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleFormChange}
                      placeholder="이메일 주소"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCheckEmail}
                      disabled={checkingEmail}
                      className="whitespace-nowrap"
                    >
                      {checkingEmail ? "확인중..." : "중복확인"}
                    </Button>
                  </div>
                  {emailAvailable === true && (
                    <p className="text-sm text-green-600">✓ 사용 가능한 이메일입니다.</p>
                  )}
                  {emailAvailable === false && (
                    <p className="text-sm text-red-600">✗ 이미 사용 중인 이메일입니다.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_name">회사명</Label>
                  <Input
                    id="company_name"
                    name="company_name"
                    value={form.company_name}
                    onChange={handleFormChange}
                    placeholder="소속 회사명"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="main_field">전문 분야 *</Label>
                  <Select value={form.main_field} onValueChange={(value) => setForm(prev => ({ ...prev, main_field: value }))}>
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

                <div className="space-y-2">
                  <Label htmlFor="personal_phone">개인 연락처</Label>
                  <Input
                    id="personal_phone"
                    name="personal_phone"
                    value={form.personal_phone}
                    onChange={handleFormChange}
                    placeholder="개인 전화번호"
                  />
                </div>



                <div className="space-y-2">
                  <Label htmlFor="experience_years">경력 연차</Label>
                  <Input
                    id="experience_years"
                    name="experience_years"
                    value={form.experience_years}
                    onChange={handleFormChange}
                    placeholder="예: 10년"
                  />
                </div>
              </div>

              {/* 프로필 이미지 */}
              <div className="space-y-2">
                <Label>프로필 이미지</Label>
                <div className="flex items-center gap-4">
                  {form.profile_image_url && (
                    <img
                      src={form.profile_image_url}
                      alt="프로필 이미지"
                      className="w-20 h-20 rounded-full object-cover border"
                    />
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleUploadButtonClick}
                    disabled={uploading}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {uploading ? "업로드 중..." : "이미지 업로드"}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 상세 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>상세 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="education_and_certifications">학력 및 자격증</Label>
                <Input
                  id="education_and_certifications"
                  name="education_and_certifications"
                  value={form.education_and_certifications}
                  onChange={handleFormChange}
                  placeholder="학력 및 자격증 정보"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="core_intro">핵심 소개</Label>
                <Textarea
                  id="core_intro"
                  name="core_intro"
                  value={form.core_intro}
                  onChange={handleFormChange}
                  placeholder="전문가로서의 핵심 소개를 작성해주세요"
                  rows={3}
                />
              </div>


            </CardContent>
          </Card>



          {/* 상품 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>상품 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(expertProducts).map(([type, product]) => (
                <div key={type} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-4">{type} 상품</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>가격 (원)</Label>
                      <Input
                        type="number"
                        value={product.price}
                        onChange={(e) => handleProductChange(type, "price", parseInt(e.target.value) || 0)}
                        placeholder="가격"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>상담 시간 (분)</Label>
                      <Input
                        type="number"
                        value={product.duration}
                        onChange={(e) => handleProductChange(type, "duration", parseInt(e.target.value) || 0)}
                        placeholder="상담 시간"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>상품 설명</Label>
                      <Textarea
                        value={product.description}
                        onChange={(e) => handleProductChange(type, "description", e.target.value)}
                        placeholder="상품 설명"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 제출 버튼 */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/expert/login")}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "등록 중..." : "전문가 등록 신청"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpertRegistrationPage; 