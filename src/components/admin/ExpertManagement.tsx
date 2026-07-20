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
import { uploadImageToS3, generateFileName, deleteImageFromS3, extractFileNameFromUrl } from "@/lib/awsS3";

interface Expert {
  id: string;
  user_id: string;
  password?: string;
  profile_image_url?: string;
  expert_name: string;
  company_name?: string;
  email: string;
  main_field: string;
  company_phone?: string;
  personal_phone?: string;
  tags?: string[];
  core_intro?: string;
  youtube_channel_url?: string;
  intro_video_url?: string;
  press_url?: string;
  education_and_certifications?: string;
  career?: string;
  achievements?: string;
  expertise_detail?: string;
  experience_years?: number;
  status: string;
  created_at: string;
  updated_at?: string;
  achievements_detail?: string;
  education_detail?: string;
  certifications_detail?: string;
  experience_detail?: string;
  expertise_areas?: string[];
  is_featured?: boolean;
  rating?: number;
  rating_count?: number;
  products?: any[];
}

const ExpertManagement = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingExpert, setEditingExpert] = useState<Expert | null>(null);
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

  // expert_products 상태 추가 (FREE, DELUXE, PREMIUM 순으로 정렬된 객체)
  const [expertProducts, setExpertProducts] = useState(() => {
    const products = {
    FREE: { price: 0, duration: 30, description: "" },
    DELUXE: { price: 250000, duration: 60, description: "" },
    PREMIUM: { price: 500000, duration: 90, description: "" }
    };
    
    // FREE, DELUXE, PREMIUM 순으로 정렬된 새로운 객체 생성
    const sortedProducts = Object.fromEntries(
      Object.entries(products).sort(([a], [b]) => {
        const order = { 'FREE': 1, 'DELUXE': 2, 'PREMIUM': 3 };
        const aOrder = order[a as keyof typeof order] || 999;
        const bOrder = order[b as keyof typeof order] || 999;
        return aOrder - bOrder;
      })
    );
    
    return sortedProducts;
  });
  const [uploading, setUploading] = useState(false);
  const [checkingUserId, setCheckingUserId] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [userIdAvailable, setUserIdAvailable] = useState<boolean | null>(null);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
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

  // 전문가 데이터를 가져오는 함수
  const fetchExpertsAndRatings = async () => {
    setLoading(true);
    setError(null);
    
    console.log('🔍 전문가 데이터 로딩 시작...');
    
    try {
      // 1. experts 테이블에서 모든 전문가 데이터 가져오기
      const { data: expertsData, error: expertsError } = await supabase
        .from('experts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (expertsError) {
        console.error('❌ 전문가 데이터 조회 실패:', expertsError);
        setError(`전문가 데이터 조회 실패: ${expertsError.message}`);
        setExperts([]);
        return;
      }
      
      console.log('✅ 전문가 데이터 조회 성공:', expertsData?.length || 0, '개');
      
      // 2. 데이터 포맷팅
      const formattedExperts: Expert[] = (expertsData || []).map((expert: any) => ({
        id: expert.id,
        user_id: expert.user_id || '',
        password: expert.password,
        profile_image_url: expert.profile_image_url,
        expert_name: expert.expert_name || '이름 없음',
        company_name: expert.company_name || '',
        email: expert.email || '',
        main_field: expert.main_field || '',
        company_phone: expert.company_phone,
        personal_phone: expert.personal_phone,
        tags: expert.tags || [],
        core_intro: expert.core_intro,
        youtube_channel_url: expert.youtube_channel_url,
        intro_video_url: expert.intro_video_url,
        press_url: expert.press_url,
        education_and_certifications: expert.education_and_certifications,
        career: expert.career,
        achievements: expert.achievements,
        expertise_detail: expert.expertise_detail,
        experience_years: expert.experience_years,
        status: expert.status || '대기',
        created_at: expert.created_at ? new Date(expert.created_at).toLocaleDateString('ko-KR') : '',
        updated_at: expert.updated_at ? new Date(expert.updated_at).toLocaleDateString('ko-KR') : '',
        achievements_detail: expert.achievements_detail,
        education_detail: expert.education_detail,
        certifications_detail: expert.certifications_detail,
        experience_detail: expert.experience_detail,
        expertise_areas: expert.expertise_areas || [],
        is_featured: expert.is_featured || false,
        rating: 0, // 기본값
        rating_count: 0, // 기본값
        products: [] // 기본값
      }));
      
      console.log('✅ 전문가 데이터 포맷팅 완료:', formattedExperts.length, '개');
      setExperts(formattedExperts);
      
    } catch (error) {
      console.error('❌ 전문가 데이터 조회 중 예외 발생:', error);
      setError(`전문가 데이터 조회 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
      setExperts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔧 ExpertManagement 컴포넌트 마운트');
    console.log('🌐 현재 환경:', window.location.hostname);
    
    // Supabase 연결 테스트
    const testConnection = async () => {
      try {
        console.log('🔍 Supabase 연결 테스트 시작...');
        
        // 1. 기본 연결 테스트 - 단순히 테이블 존재 여부만 확인
        const { data: testData, error: testError } = await supabase
          .from('experts')
          .select('id')
          .limit(1);
        
        if (testError) {
          console.error('❌ Supabase 연결 실패:', testError);
          console.error('❌ 오류 코드:', testError.code);
          console.error('❌ 오류 메시지:', testError.message);
          
          // RLS 정책 오류인지 확인
          if (testError.code === 'PGRST116') {
            console.error('❌ RLS 정책 오류: 테이블에 접근 권한이 없습니다.');
          } else if (testError.code === 'PGRST301') {
            console.error('❌ 인증 오류: Supabase 키가 잘못되었습니다.');
          } else if (testError.code === 'PGRST301') {
            console.error('❌ 테이블이 존재하지 않습니다.');
          }
        } else {
          console.log('✅ Supabase 연결 성공');
          console.log('✅ 테스트 데이터 개수:', testData?.length || 0);
        }
        
      } catch (err) {
        console.error('❌ Supabase 연결 테스트 실패:', err);
      }
    };
    
    testConnection();
    fetchExpertsAndRatings();
  }, []);

  const handleDelete = async (expert: Expert) => {
    try {
      // S3에서 프로필 이미지 삭제
      if (expert.profile_image_url && expert.profile_image_url.includes('s3.amazonaws.com')) {
        try {
          const fileName = extractFileNameFromUrl(expert.profile_image_url);
          await deleteImageFromS3(fileName);
          console.log('🗑️ 전문가 삭제 시 이미지 삭제 완료:', fileName);
        } catch (deleteError) {
          console.warn('이미지 삭제 실패 (무시됨):', deleteError);
        }
      }
      
      // 데이터베이스에서 전문가 삭제
      const { error } = await supabase
        .from("experts")
        .delete()
        .eq("user_id", expert.user_id);
      
      if (error) {
        console.error("전문가 삭제 오류:", error);
        toast.error("전문가 삭제에 실패했습니다.");
        return;
      }
      
      setExperts(experts.filter(e => e.user_id !== expert.user_id));
      toast.success("전문가가 삭제되었습니다.");
    } catch (error) {
      console.error('전문가 삭제 중 예외 발생:', error);
      toast.error("전문가 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleToggleFeatured = async (expert: Expert) => {
    try {
      const newFeaturedStatus = !expert.is_featured;
      
      const { error } = await supabase
        .from("experts")
        .update({ is_featured: newFeaturedStatus })
        .eq("user_id", expert.user_id);
      
      if (error) {
        console.error("메인페이지 노출 상태 변경 오류:", error);
        toast.error("메인페이지 노출 상태 변경에 실패했습니다.");
        return;
      }
      
      // 로컬 상태 업데이트
      setExperts(experts.map(e => 
        e.user_id === expert.user_id 
          ? { ...e, is_featured: newFeaturedStatus }
          : e
      ));
      
      toast.success(
        newFeaturedStatus 
          ? "메인페이지에 노출되도록 설정되었습니다." 
          : "메인페이지에서 숨겨졌습니다."
      );
    } catch (error) {
      console.error('메인페이지 노출 상태 변경 중 예외 발생:', error);
      toast.error("메인페이지 노출 상태 변경 중 오류가 발생했습니다.");
    }
  };

  const handleEdit = async (expert: Expert) => {
    // 1. experts 테이블에서 전문가 정보 가져오기
    const { data, error } = await (supabase
      .from("experts")
      .select("*")
      .eq("user_id", expert.user_id)
      .single() as any);
    if (error || !data) {
      toast.error("전문가 정보를 불러오지 못했습니다.");
      return;
    }

    // 2. expert_products 테이블에서 상품 정보 가져오기
    const { data: productsData, error: productsError } = await supabase
      .from("expert_products")
      .select("*")
      .eq("user_id", expert.user_id);

    if (!productsError && productsData) {
      // FREE, DELUXE, PREMIUM 순으로 정렬
      const sortedProducts = productsData.sort((a, b) => {
        const order = { 'FREE': 1, 'DELUXE': 2, 'PREMIUM': 3 };
        const aOrder = order[a.product_name as keyof typeof order] || 999;
        const bOrder = order[b.product_name as keyof typeof order] || 999;
        return aOrder - bOrder;
      });

      const productsMap: Record<string, { price: number; duration: number; description: string }> = {};
      sortedProducts.forEach(product => {
        productsMap[product.product_name] = {
          price: product.price || product.regular_price, // regular_price도 고려
          duration: product.duration,
          description: product.description
        };
      });
      const defaultProducts = {
        FREE: productsMap.FREE || { price: 0, duration: 30, description: "" },
        DELUXE: productsMap.DELUXE || { price: 250000, duration: 60, description: "" },
        PREMIUM: productsMap.PREMIUM || { price: 500000, duration: 90, description: "" }
      };
      
      // FREE, DELUXE, PREMIUM 순으로 정렬된 객체 생성
      const sortedEditProducts = Object.fromEntries(
        Object.entries(defaultProducts).sort(([a], [b]) => {
          const order = { 'FREE': 1, 'DELUXE': 2, 'PREMIUM': 3 };
          const aOrder = order[a as keyof typeof order] || 999;
          const bOrder = order[b as keyof typeof order] || 999;
          return aOrder - bOrder;
        })
      );
      
      setExpertProducts(sortedEditProducts);
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
      education_and_certifications: data.education_and_certifications || "",
      career: data.career || "",
      achievements: data.achievements || "",
      expertise_detail: data.expertise_detail || "",
      experience_years: data.experience_years !== undefined && data.experience_years !== null ? String(data.experience_years) : "",
      status: data.status || "대기",
      is_featured: data.is_featured || false
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingExpert(null);
    setIsEditMode(false);
    setEditingUserId(null);
    setUserIdAvailable(null);
    setEmailAvailable(null);
    // expertProducts 초기화 (FREE, DELUXE, PREMIUM 순으로 정렬)
    const defaultProducts = {
      FREE: { price: 0, duration: 30, description: "" },
      DELUXE: { price: 250000, duration: 60, description: "" },
      PREMIUM: { price: 500000, duration: 90, description: "" }
    };
    
    const sortedProducts = Object.fromEntries(
      Object.entries(defaultProducts).sort(([a], [b]) => {
        const order = { 'FREE': 1, 'DELUXE': 2, 'PREMIUM': 3 };
        const aOrder = order[a as keyof typeof order] || 999;
        const bOrder = order[b as keyof typeof order] || 999;
        return aOrder - bOrder;
      })
    );
    
    setExpertProducts(sortedProducts);
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
      is_featured: false
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
      // 아이디 변경 시 중복 확인 상태 초기화
      setUserIdAvailable(null);
    } else if (name === "email") {
      setForm({ ...form, [name]: value });
      // 이메일 변경 시 중복 확인 상태 초기화
      setEmailAvailable(null);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // 아이디 중복 확인
  const handleCheckUserId = async () => {
    if (!form.user_id.trim()) {
      toast.error("아이디를 입력해주세요.");
      return;
    }

    setCheckingUserId(true);
    try {
      const { data, error } = await (supabase as any)
        .from('experts')
        .select('user_id')
        .eq('user_id', form.user_id.trim())
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116는 결과가 없을 때의 오류
        console.error('아이디 확인 오류:', error);
        toast.error('아이디 확인 중 오류가 발생했습니다.');
        setUserIdAvailable(null);
        return;
      }

      if (data) {
        setUserIdAvailable(false);
        toast.error('이미 사용 중인 아이디입니다.');
      } else {
        setUserIdAvailable(true);
        toast.success('사용 가능한 아이디입니다.');
      }
    } catch (error) {
      console.error('아이디 확인 중 예외 발생:', error);
      toast.error('아이디 확인 중 오류가 발생했습니다.');
      setUserIdAvailable(null);
    } finally {
      setCheckingUserId(false);
    }
  };

  // 이메일 중복 확인
  const handleCheckEmail = async () => {
    if (!form.email.trim()) {
      toast.error("이메일을 입력해주세요.");
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      toast.error("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    setCheckingEmail(true);
    try {
      const { data, error } = await (supabase as any)
        .from('experts')
        .select('email')
        .eq('email', form.email.trim())
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116는 결과가 없을 때의 오류
        console.error('이메일 확인 오류:', error);
        toast.error('이메일 확인 중 오류가 발생했습니다.');
        setEmailAvailable(null);
        return;
      }

      if (data) {
        setEmailAvailable(false);
        toast.error('이미 사용 중인 이메일입니다.');
      } else {
        setEmailAvailable(true);
        toast.success('사용 가능한 이메일입니다.');
      }
    } catch (error) {
      console.error('이메일 확인 중 예외 발생:', error);
      toast.error('이메일 확인 중 오류가 발생했습니다.');
      setEmailAvailable(null);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleSave = async () => {
    if (!form.user_id || (!isEditMode && !form.password) || !form.expert_name || !form.email || !form.main_field) {
      toast.error("필수 항목을 입력하세요.");
      return;
    }

    // 새 등록 시 중복 확인 상태 체크
    if (!isEditMode) {
      if (userIdAvailable === null) {
        toast.error("아이디 중복 확인을 해주세요.");
        return;
      }
      if (userIdAvailable === false) {
        toast.error("이미 사용 중인 아이디입니다.");
        return;
      }
      if (emailAvailable === null) {
        toast.error("이메일 중복 확인을 해주세요.");
        return;
      }
      if (emailAvailable === false) {
        toast.error("이미 사용 중인 이메일입니다.");
        return;
      }
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
        education_and_certifications: form.education_and_certifications || "",
        career: form.career || "",
        achievements: form.achievements || "",
      };

      let error;
      if (isEditMode && editingUserId) {
        // 수정 모드: 기존 이미지가 있고 새 이미지로 변경된 경우 기존 이미지 삭제
        if (editingExpert?.profile_image_url && 
            editingExpert.profile_image_url !== form.profile_image_url && 
            editingExpert.profile_image_url.includes('s3.amazonaws.com')) {
          try {
            const oldFileName = extractFileNameFromUrl(editingExpert.profile_image_url);
            await deleteImageFromS3(oldFileName);
            console.log('🗑️ 기존 이미지 삭제 완료:', oldFileName);
          } catch (deleteError) {
            console.warn('기존 이미지 삭제 실패 (무시됨):', deleteError);
          }
        }
        
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

      // 4. expert_products 테이블에 상품 정보 저장/수정
      console.log('🔄 전문가 상품 정보 저장 중...');
      
      // FREE, DELUXE, PREMIUM 순으로 정렬
      const productEntries = Object.entries(expertProducts).sort(([a], [b]) => {
        const order = { 'FREE': 1, 'DELUXE': 2, 'PREMIUM': 3 };
        const aOrder = order[a as keyof typeof order] || 999;
        const bOrder = order[b as keyof typeof order] || 999;
        return aOrder - bOrder;
      });
      
      const productPromises = productEntries.map(async ([productName, productData]) => {
        const productRecord = {
          user_id: form.user_id,
          product_name: productName,
          regular_price: productData.price, // regular_price도 동일한 값으로 설정
          price: productData.price,
          duration: productData.duration,
          description: productData.description
        };

        if (isEditMode) {
          // 수정 모드: 기존 상품 업데이트 또는 새로 생성
          const { data: existingProduct } = await supabase
            .from('expert_products')
            .select('id')
            .eq('user_id', form.user_id)
            .eq('product_name', productName)
            .single();

          if (existingProduct) {
            return supabase
              .from('expert_products')
              .update(productRecord)
              .eq('id', existingProduct.id);
          } else {
            return supabase
              .from('expert_products')
              .insert([productRecord]);
          }
        } else {
          // 새 등록 모드: 상품 생성
          return supabase
            .from('expert_products')
            .insert([productRecord]);
        }
      });

      try {
        await Promise.all(productPromises);
        console.log('✅ 전문가 상품 정보 저장 완료');
      } catch (productError) {
        console.error('❌ 전문가 상품 정보 저장 오류:', productError);
        toast.error('전문가 상품 정보 저장에 실패했습니다.');
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
        is_featured: false
      });
      setIsEditMode(false);
      setEditingUserId(null);
      await fetchExpertsAndRatings(); // 저장/수정 성공 시 목록 즉시 갱신

    } catch (error) {
      console.error('전문가 저장 중 예외 발생:', error);
      toast.error('알 수 없는 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 프로필 이미지 업로드 (AWS S3)
  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 파일 선택 후 input 초기화 (같은 파일 재선택 가능)
    e.target.value = '';
    
    setUploading(true);
    try {
      // 아이디가 없으면 임시 아이디 사용
      const userId = form.user_id || `temp_${Date.now()}`;
      const fileName = generateFileName(userId, file.name);
      
      console.log('🔄 이미지 업로드 시작:', { fileName, fileSize: file.size, fileType: file.type });
      
      // S3에 업로드
      const publicUrl = await uploadImageToS3(file, fileName);
      
      // 폼에 URL 저장
      setForm({ ...form, profile_image_url: publicUrl });
      toast.success('프로필 이미지가 업로드되었습니다.');
      
      console.log('✅ 이미지 업로드 완료:', publicUrl);
    } catch (error) {
      console.error('❌ 이미지 업로드 오류:', error);
      
      // 사용자 친화적 오류 메시지
      let errorMessage = '이미지 업로드에 실패했습니다.';
      
      if (error instanceof Error) {
        if (error.message.includes('S3 버킷')) {
          errorMessage = 'AWS S3 설정을 확인해주세요.';
        } else if (error.message.includes('파일 크기')) {
          errorMessage = '파일 크기는 5MB 이하여야 합니다.';
        } else if (error.message.includes('이미지 형식')) {
          errorMessage = 'JPG, PNG, GIF, WebP 형식만 지원합니다.';
        } else if (error.message.includes('접근 권한') || error.message.includes('인증')) {
          errorMessage = 'AWS 인증 정보를 확인해주세요.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
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
                    <div className="relative w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200">
                      {form.profile_image_url ? (
                        <>
                          <img src={form.profile_image_url} alt="프로필" className="object-cover w-20 h-20" />
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, profile_image_url: "" })}
                            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                            aria-label="이미지 삭제"
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <User className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2" 
                        onClick={handleUploadButtonClick} 
                        disabled={uploading}
                      >
                        <Upload className="h-4 w-4" />
                        {uploading ? '업로드 중...' : '사진 업로드'}
                      </Button>
                      <p className="text-xs text-gray-500">
                        JPG, PNG, GIF (최대 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleProfileImageUpload}
                      aria-label="프로필 이미지 업로드"
                    />
                  </div>
                  {form.profile_image_url && (
                    <p className="text-sm text-green-600">✓ 프로필 이미지가 업로드되었습니다</p>
                  )}
                </div>
                {/* user_id, password 입력 필드 */}
                <div className="flex gap-4">
                  {/* 아이디 */}
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="user_id">아이디 *</Label>
                    <div className="flex gap-2">
                      <Input 
                        name="user_id" 
                        placeholder="아이디" 
                        value={form.user_id} 
                        onChange={handleFormChange} 
                        autoComplete="username"
                        className={userIdAvailable === true ? "border-green-500" : userIdAvailable === false ? "border-red-500" : ""}
                      />
                      {!isEditMode && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleCheckUserId}
                          disabled={checkingUserId || !form.user_id.trim()}
                          className="whitespace-nowrap"
                        >
                          {checkingUserId ? "확인 중..." : "중복 확인"}
                        </Button>
                      )}
                    </div>
                    {userIdAvailable === true && (
                      <p className="text-sm text-green-600">✓ 사용 가능한 아이디입니다</p>
                    )}
                    {userIdAvailable === false && (
                      <p className="text-sm text-red-600">✗ 이미 사용 중인 아이디입니다</p>
                    )}
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
                    <div className="flex gap-2">
                      <Input 
                        name="email" 
                        value={form.email} 
                        onChange={handleFormChange} 
                        type="email" 
                        placeholder="email@example.com"
                        className={emailAvailable === true ? "border-green-500" : emailAvailable === false ? "border-red-500" : ""}
                      />
                      {!isEditMode && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleCheckEmail}
                          disabled={checkingEmail || !form.email.trim()}
                          className="whitespace-nowrap"
                        >
                          {checkingEmail ? "확인 중..." : "중복 확인"}
                        </Button>
                      )}
                    </div>
                    {emailAvailable === true && (
                      <p className="text-sm text-green-600">✓ 사용 가능한 이메일입니다</p>
                    )}
                    {emailAvailable === false && (
                      <p className="text-sm text-red-600">✗ 이미 사용 중인 이메일입니다</p>
                    )}
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
                {/* 경력 및 상태 */}
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
                  
                  {/* FREE, DELUXE, PREMIUM 순으로 하드코딩된 순서로 렌더링 */}
                  {(() => {
                    // 하드코딩된 순서로 상품 렌더링
                    const productOrder = ['FREE', 'DELUXE', 'PREMIUM'];
                    
                    return productOrder.map((productName) => {
                      const productData = expertProducts[productName as keyof typeof expertProducts];
                      if (!productData) return null;
                      const getProductConfig = (name: string) => {
                        switch (name) {
                          case 'FREE':
                            return {
                              badge: <Badge variant="secondary">FREE</Badge>,
                              title: '무료 코칭',
                              bgColor: 'bg-gray-50',
                              priceDisabled: true,
                              priceValue: '0원',
                              placeholder: 'FREE 등급 코칭의 내용과 특징을 입력하세요'
                            };
                          case 'DELUXE':
                            return {
                              badge: <Badge variant="default">DELUXE</Badge>,
                              title: '스탠다드 코칭',
                              bgColor: 'bg-blue-50',
                              priceDisabled: false,
                              priceValue: productData.price,
                              placeholder: 'DELUXE 등급 코칭의 내용과 특징을 입력하세요'
                            };
                          case 'PREMIUM':
                            return {
                              badge: <Badge variant="destructive">PREMIUM</Badge>,
                              title: '프리미엄 코칭',
                              bgColor: 'bg-yellow-50',
                              priceDisabled: false,
                              priceValue: productData.price,
                              placeholder: 'PREMIUM 등급 코칭의 내용과 특징을 입력하세요'
                            };
                          default:
                            return {
                              badge: <Badge variant="outline">{productName}</Badge>,
                              title: `${productName} 코칭`,
                              bgColor: 'bg-gray-50',
                              priceDisabled: false,
                              priceValue: productData.price,
                              placeholder: `${productName} 등급 코칭의 내용과 특징을 입력하세요`
                            };
                        }
                      };

                      const config = getProductConfig(productName);

                      return (
                        <div key={productName} className={`border rounded-lg p-4 ${config.bgColor}`}>
                    <div className="flex items-center gap-2 mb-4">
                            {config.badge}
                            <span className="text-sm text-gray-600">{config.title}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                              <Label>가격 {productName === 'FREE' ? '' : '(원)'}</Label>
                        <Input 
                                type={productName === 'FREE' ? 'text' : 'number'}
                                value={config.priceValue}
                                disabled={config.priceDisabled}
                                className={config.priceDisabled ? 'bg-gray-100' : ''}
                                onChange={productName === 'FREE' ? undefined : (e) => setExpertProducts({
                            ...expertProducts,
                                  [productName]: { ...expertProducts[productName as keyof typeof expertProducts], price: parseInt(e.target.value) || 0 }
                          })}
                                placeholder={productName === 'FREE' ? undefined : '0'}
                        />
                              {productName === 'FREE' && (
                                <p className="text-xs text-gray-500">FREE 등급은 0원으로 고정됩니다</p>
                              )}
                      </div>
                      <div className="space-y-2">
                        <Label>소요시간 (분)</Label>
                        <Input 
                          type="number"
                                value={productData.duration}
                          onChange={(e) => setExpertProducts({
                            ...expertProducts,
                                  [productName]: { ...expertProducts[productName as keyof typeof expertProducts], duration: parseInt(e.target.value) || 30 }
                          })}
                                placeholder="30"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label>상품 소개</Label>
                      <Textarea 
                              value={productData.description}
                        onChange={(e) => setExpertProducts({
                          ...expertProducts,
                                [productName]: { ...expertProducts[productName as keyof typeof expertProducts], description: e.target.value }
                        })}
                              placeholder={config.placeholder}
                        rows={3}
                      />
                    </div>
                  </div>
                      );
                    });
                  })()}
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
                <TableHead>메인노출</TableHead>
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
                  <TableCell>⭐ {expert.rating !== null && expert.rating !== undefined ? expert.rating.toFixed(1) : "-"}</TableCell>
                  <TableCell>
                    {expert.products?.length > 0 ? (
                      <div className="text-sm">
                        {expert.products
                          .sort((a: any, b: any) => {
                            const order = { 'FREE': 1, 'DELUXE': 2, 'PREMIUM': 3 };
                            const aOrder = order[a.product_name as keyof typeof order] || 999;
                            const bOrder = order[b.product_name as keyof typeof order] || 999;
                            return aOrder - bOrder;
                          })
                          .map((product: any) => (
                          <div key={product.product_name} className="text-xs">
                            {product.product_name}: {(product.price || 0).toLocaleString()}원
                          </div>
                        ))}
                      </div>
                    ) : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(expert.status)}>{expert.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={expert.is_featured ? "default" : "outline"}
                      onClick={() => handleToggleFeatured(expert)}
                      className="w-16"
                    >
                      {expert.is_featured ? "노출" : "숨김"}
                    </Button>
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
                        onClick={() => handleDelete(expert)}
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
