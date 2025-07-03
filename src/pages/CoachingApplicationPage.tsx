import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { CloudUpload, Phone, Video, MessageSquare, MapPin } from "lucide-react";
import Header from "@/components/Header";

// 요금제 정보
const plans = [
  {
    id: "free",
    name: "FREE",
    displayPrice: "무료",
    price: 0,
    originalPrice: null,
    features: ["기본 상담 (30분)", "간단한 재무 진단", "기본 조언 제공"],
    color: "border-gray-200",
    highlight: false,
    badge: null,
  },
  {
    id: "deluxe",
    name: "DELUXE",
    displayPrice: "198,000원",
    price: 198000,
    originalPrice: "300,000원",
    features: [
      "심화 상담 (60분)",
      "상세 재무 분석",
      "맞춤형 전략 제시",
      "3개월 후속 관리",
      "전문 자료 제공",
    ],
    color: "border-blue-500",
    highlight: true,
    badge: "인기",
  },
  {
    id: "premium",
    name: "PREMIUM",
    displayPrice: "498,000원",
    price: 498000,
    originalPrice: "700,000원",
    features: [
      "프리미엄 상담 (120분)",
      "종합 재무 설계",
      "실행 계획 수립",
      "6개월 지속 관리",
      "전문가 직접 연결",
      "우선 지원 서비스",
    ],
    color: "border-purple-500",
    highlight: false,
    badge: null,
  },
];

type PlanType = "free" | "deluxe" | "premium";

// 상담 방법 옵션
const consultMethods = [
  {
    value: "전화",
    label: "전화 상담",
    icon: <Phone className="w-5 h-5 mr-2" />,
  },
  {
    value: "화상",
    label: "화상 상담",
    icon: <Video className="w-5 h-5 mr-2" />,
  },
  {
    value: "메시지",
    label: "메시지 상담",
    icon: <MessageSquare className="w-5 h-5 mr-2" />,
  },
  {
    value: "방문",
    label: "방문 상담",
    icon: <MapPin className="w-5 h-5 mr-2" />,
  },
];

const CoachingApplicationPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 전문가 정보
  const expertId = location.state?.expertId || "";
  const expertName = location.state?.expertName || "";
  const expertCompany = location.state?.expertCompany || "";

  // 폼 상태
  const [form, setForm] = useState({
    title: "",
    content: "",
    method: "전화",
    name: "",
    phone: "",
    email: "",
    plan: "free" as PlanType,
  });
  const [loading, setLoading] = useState(false);
  // 첨부파일 상태
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileUploading, setFileUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  // 유저 정보 자동 입력
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  // 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handlePlanChange = (plan: PlanType) => setForm((prev) => ({ ...prev, plan }));
  const handleMethodChange = (method: string) => setForm((prev) => ({ ...prev, method }));

  // 첨부파일 핸들러
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!validateFile(f)) return;
    setFile(f);
    setFileName(f.name);
    await uploadFile(f);
  };
  const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    if (!validateFile(f)) return;
    setFile(f);
    setFileName(f.name);
    await uploadFile(f);
  };
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };
  const validateFile = (f: File) => {
    const allowed = ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx"];
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!ext || !allowed.includes(ext)) {
      alert("허용되지 않는 파일 형식입니다.");
      return false;
    }
    if (f.size > 10 * 1024 * 1024) {
      alert("파일 용량은 10MB 이하만 가능합니다.");
      return false;
    }
    return true;
  };
  const uploadFile = async (f: File) => {
    setFileUploading(true);
    const filePath = `coaching-attachments/${Date.now()}_${encodeURIComponent(f.name)}`;
    const { error } = await supabase.storage.from("attachments").upload(filePath, f, { upsert: true });
    if (error) {
      alert("파일 업로드 실패: " + error.message);
      setFileUploading(false);
      return;
    }
    const { data } = supabase.storage.from("attachments").getPublicUrl(filePath);
    setFileUrl(data.publicUrl);
    setFileUploading(false);
  };

  // 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!form.title || !form.content || !form.name || !form.phone || !form.email) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }
    if (!expertId) {
      alert("전문가 정보가 없습니다.");
      return;
    }
    setLoading(true);
    const planObj = plans.find((p) => p.id === form.plan);
    const { data, error } = await supabase.from("coaching_applications").insert([
      {
        expert_user_id: expertId,
        member_user_id: user.user_id,
        title: form.title,
        content: form.content,
        method: form.method,
        name: form.name,
        contact: form.phone,
        email: form.email,
        product_name: planObj?.name,
        product_price: planObj?.price || 0,
        attachment_url: fileUrl || null,
        status: "접수",
      },
    ]);
    setLoading(false);
    if (error) {
      alert("신청 실패: " + error.message);
      return;
    }
    alert("신청이 완료되었습니다!");
    navigate("/coaching/success", {
      state: {
        applicationId: data?.[0]?.id || '',
        expertName,
        expertCompany,
        planName: planObj?.name,
        planPrice: planObj?.displayPrice,
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">코칭 신청</h1>
          <p className="text-lg text-slate-600">
            {expertName && expertCompany ? `${expertName} (${expertCompany})` : '전문가'}와 함께하는 맞춤형 코칭
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* 좌측: 코칭 신청서 카드 */}
          <div className="bg-white rounded-xl shadow p-8">
            <h2 className="text-xl font-bold mb-4">코칭 신청서</h2>
            <p className="text-sm text-gray-500 mb-6">상세한 정보를 입력해주시면 전문가가 맞춤형 코칭을 제공합니다.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" aria-label="코칭 신청 폼">
              <div>
                <label htmlFor="title" className="block font-semibold mb-1">상담 제목 <span className="text-red-500">*</span></label>
                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="상담받고 싶은 주제를 간단히 적어주세요"
                  className="border rounded px-3 py-2 w-full"
                  required
                  aria-label="상담 제목"
                />
              </div>
              <div>
                <label htmlFor="content" className="block font-semibold mb-1">상담 내용 <span className="text-red-500">*</span></label>
                <textarea
                  id="content"
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="현재 상황과 궁금한 점을 자세히 설명해주세요"
                  className="border rounded px-3 py-2 w-full min-h-[100px]"
                  required
                  aria-label="상담 내용"
                />
              </div>
              <div>
                <span className="block font-semibold mb-1">상담 방법 <span className="text-red-500">*</span></span>
                <div className="flex flex-col gap-3 mt-2">
                  {consultMethods.map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center border rounded-lg px-4 py-2 cursor-pointer transition-all select-none
                        ${form.method === method.value ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-300"}
                      `}
                      tabIndex={0}
                      aria-label={method.label}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") handleMethodChange(method.value);
                      }}
                      onClick={() => handleMethodChange(method.value)}
                    >
                      <input
                        type="radio"
                        name="method"
                        value={method.value}
                        checked={form.method === method.value}
                        onChange={() => handleMethodChange(method.value)}
                        className="accent-blue-600 mr-2"
                        tabIndex={-1}
                        aria-label={method.label}
                      />
                      {method.icon}
                      <span className="text-base">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block font-semibold mb-1">이름 <span className="text-red-500">*</span></label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="실명을 입력해주세요"
                    className="border rounded px-3 py-2 w-full"
                    required
                    aria-label="이름"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block font-semibold mb-1">연락처 <span className="text-red-500">*</span></label>
                  <input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="010-0000-0000"
                    className="border rounded px-3 py-2 w-full"
                    required
                    aria-label="연락처"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block font-semibold mb-1">이메일 <span className="text-red-500">*</span></label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="border rounded px-3 py-2 w-full"
                  required
                  aria-label="이메일"
                />
              </div>
              {/* 첨부파일 */}
              <div>
                <label
                  htmlFor="file-upload"
                  className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors relative"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  tabIndex={0}
                  aria-label="첨부파일 업로드"
                >
                  <CloudUpload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <div className="text-sm text-gray-600">파일을 드래그하거나 클릭하여 업로드</div>
                  <div className="text-xs text-gray-400 mt-1">JPG, PNG, GIF, PDF, DOC, DOCX (최대 10MB)</div>
                  {fileUploading && <div className="text-blue-500 mt-2">업로드 중...</div>}
                  {fileName && !fileUploading && (
                    <div className="mt-2 text-green-600 text-sm">{fileName} 업로드 완료</div>
                  )}
                  <input
                    id="file-upload"
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleFileChange}
                    tabIndex={-1}
                    aria-label="첨부파일 선택"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded text-lg font-semibold hover:bg-blue-700 transition mt-2"
                aria-label="코칭 신청하기"
                tabIndex={0}
                disabled={loading || fileUploading}
              >
                {loading ? "신청 중..." : "코칭 신청하기"}
              </button>
            </form>
          </div>
          {/* 우측: 요금제 카드 */}
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-bold text-center mb-2">코칭 요금제</h3>
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-xl shadow p-6 border transition-all cursor-pointer ${
                  form.plan === plan.id ? `border-2 ring-2 ring-blue-500 ${plan.color}` : plan.color
                } ${plan.highlight ? 'border-2' : 'border'}`}
                onClick={() => handlePlanChange(plan.id as PlanType)}
                tabIndex={0}
                aria-label={plan.name}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handlePlanChange(plan.id as PlanType);
                }}
              >
                {plan.badge && (
                  <span className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">{plan.badge}</span>
                )}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg">{plan.name}</span>
                </div>
                <div className="flex items-end gap-2 mb-1">
                  <span className={`text-2xl font-bold ${plan.id === 'deluxe' ? 'text-blue-600' : plan.id === 'premium' ? 'text-purple-600' : 'text-gray-700'}`}>{plan.displayPrice}</span>
                  {plan.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">{plan.originalPrice}</span>
                  )}
                </div>
                <ul className="mt-2 space-y-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <svg className="w-4 h-4 text-green-500 mr-1 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachingApplicationPage;
