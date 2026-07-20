import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Edit2, Mail, Phone, Calendar, MapPin, Save, X, Lock, Bell, Trash2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  user_id: string;
  name: string;
  nickname?: string;
  email: string;
  phone?: string;
  birth_date?: string;
  address?: string;
  address_detail?: string;
  postal_code?: string;
  created_at: string;
}

interface NotificationSettings {
  email_notifications: boolean;
  community_notifications: boolean;
  marketing_notifications: boolean;
}

const MyInfo = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    nickname: "",
    phone: "",
    birth_date: "",
    address: "",
    address_detail: "",
    postal_code: ""
  });

  // 비밀번호 변경 관련 상태
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // 알림 설정 관련 상태
  const [notificationDialog, setNotificationDialog] = useState(false);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_notifications: true,
    community_notifications: true,
    marketing_notifications: false
  });
  const [notificationLoading, setNotificationLoading] = useState(false);

  // 회원 탈퇴 관련 상태
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 비밀번호 일치 여부 상태
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // 저장 시 비밀번호 입력 관련 상태
  const [savePasswordDialog, setSavePasswordDialog] = useState(false);
  const [savePassword, setSavePassword] = useState("");
  const [showSavePassword, setShowSavePassword] = useState(false);
  const [savePasswordLoading, setSavePasswordLoading] = useState(false);

  // 사용자 정보 로드
  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadNotificationSettings();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      if (!isSupabaseConfigured) {
        // Demo 모드: 기본 정보 설정
        const demoUserId = user.user_id || user.id || 'demo-user';
        const demoProfile: UserProfile = {
          user_id: demoUserId,
          name: user.name || "김부자",
          nickname: demoUserId, // 닉네임을 user_id로 설정
          email: user.email || "kerow@hanmail.net",
          phone: "010-1234-5678",
          birth_date: "1990-01-01",
          address: "서울시 강남구 테헤란로 123",
          created_at: user.created_at || new Date().toISOString()
        };
        setUserProfile(demoProfile);
        setEditForm({
          name: demoProfile.name,
          nickname: demoUserId, // 닉네임을 user_id로 설정
          phone: demoProfile.phone || "",
          birth_date: demoProfile.birth_date || "",
          address: demoProfile.address || "",
          address_detail: demoProfile.address_detail || "",
          postal_code: demoProfile.postal_code || ""
        });
      } else {
        // 실제 Supabase에서 사용자 정보 조회
        console.log('🔍 사용자 정보 조회 시도:', { user_id: user.user_id, id: user.id, email: user.email });
        
        // 먼저 user_id로 조회 시도
        let { data, error } = await (supabase as any)
          .from('members')
          .select('*')
          .eq('user_id', user.user_id || user.id);

        // user_id로 찾지 못하면 email로 조회
        if (!data || data.length === 0) {
          console.log('🔍 user_id로 찾지 못함, email로 재시도:', user.email);
          const emailResult = await (supabase as any)
            .from('members')
            .select('*')
            .eq('email', user.email);
          
          data = emailResult.data;
          error = emailResult.error;
        }

        if (error) {
          console.error('사용자 정보 조회 오류:', error);
          // 사용자가 members 테이블에 없는 경우 기본 프로필 생성
          const defaultUserId = user.user_id || user.id || 'unknown';
          const defaultProfile: UserProfile = {
            user_id: defaultUserId,
            name: user.name || user.email?.split('@')[0] || "사용자",
            email: user.email || "",
            phone: "",
            birth_date: "",
            address: "",
            created_at: user.created_at || new Date().toISOString()
          };
          setUserProfile(defaultProfile);
          setEditForm({
            name: defaultProfile.name,
            nickname: defaultUserId, // 닉네임을 user_id로 설정
            phone: "",
            birth_date: "",
            address: "",
            address_detail: "",
            postal_code: ""
          });
          
          toast({
            title: "알림",
            description: "기본 프로필을 생성했습니다. 정보를 수정해주세요.",
          });
          return;
        }

        if (data && data.length > 0) {
          const profile = data[0];
          
          // 닉네임을 user_id로 설정
          const nickname = profile.user_id || "";
          console.log('🏷️ 닉네임을 user_id로 설정:', { user_id: profile.user_id, nickname });

          // 프로필에 닉네임 추가
          const profileWithNickname = { ...profile, nickname };
          setUserProfile(profileWithNickname);
          
          setEditForm({
            name: profile.name || "",
            nickname: nickname,
            phone: profile.phone || "",
            birth_date: profile.birth_date || "",
            address: profile.address || "",
            address_detail: profile.address_detail || "",
            postal_code: profile.postal_code || ""
          });
          console.log('✅ 사용자 정보 로드 성공:', profileWithNickname);
        } else {
          // 데이터가 없는 경우 기본 프로필 생성
          console.log('ℹ️ members 테이블에 사용자 정보 없음, 기본 프로필 생성');
          const defaultUserId = user.user_id || user.id || 'unknown';
          const defaultProfile: UserProfile = {
            user_id: defaultUserId,
            name: user.name || user.email?.split('@')[0] || "사용자",
            email: user.email || "",
            phone: "",
            birth_date: "",
            address: "",
            created_at: user.created_at || new Date().toISOString()
          };
          setUserProfile(defaultProfile);
          setEditForm({
            name: defaultProfile.name,
            nickname: defaultUserId, // 닉네임을 user_id로 설정
            phone: "",
            birth_date: "",
            address: "",
            address_detail: "",
            postal_code: ""
          });
          
          toast({
            title: "알림",
            description: "기본 프로필을 생성했습니다. 정보를 수정해주세요.",
          });
        }
      }
    } catch (error) {
      console.error('사용자 정보 로드 오류:', error);
      // 오류 발생 시에도 기본 프로필 제공
      const fallbackUserId = user.user_id || user.id || 'unknown';
      const fallbackProfile: UserProfile = {
        user_id: fallbackUserId,
        name: user.name || user.email?.split('@')[0] || "사용자",
        email: user.email || "",
        phone: "",
        birth_date: "",
        address: "",
        created_at: user.created_at || new Date().toISOString()
      };
      setUserProfile(fallbackProfile);
      setEditForm({
        name: fallbackProfile.name,
        nickname: fallbackUserId, // 닉네임을 user_id로 설정
        phone: "",
        birth_date: "",
        address: "",
        address_detail: "",
        postal_code: ""
      });
      
      toast({
        title: "알림",
        description: "기본 프로필을 사용합니다. 정보를 수정해주세요.",
      });
    }
  };

  const handleSaveClick = () => {
    // 저장 버튼 클릭 시 비밀번호 입력 다이얼로그 열기
    setSavePasswordDialog(true);
    setSavePassword("");
  };

  const handleSave = async () => {
    if (!user || !userProfile) return;

    setSavePasswordLoading(true);
    try {
      if (!isSupabaseConfigured) {
        // Demo 모드: 로컬 상태만 업데이트
        const updatedProfile = {
          ...userProfile,
          ...editForm
        };
        setUserProfile(updatedProfile);
        
        toast({
          title: "저장 완료",
          description: "프로필 정보가 업데이트되었습니다. (Demo 모드)"
        });
      } else {
        // 실제 Supabase 업데이트 또는 생성
        console.log('💾 사용자 정보 저장 시도:', editForm);
        console.log('🔍 사용자 ID:', user.user_id || user.id);
        
        // 먼저 기존 사용자 존재 여부 확인 (user_id 또는 email로)
        const { data: existingUserById } = await (supabase as any)
          .from('members')
          .select('user_id, email')
          .eq('user_id', user.user_id || user.id)
          .maybeSingle();

        const { data: existingUserByEmail } = await (supabase as any)
          .from('members')
          .select('user_id, email')
          .eq('email', user.email)
          .maybeSingle();

        const existingUser = existingUserById || existingUserByEmail;
        
        console.log('🔍 기존 사용자 확인:', { 
          byId: existingUserById, 
          byEmail: existingUserByEmail, 
          final: existingUser 
        });

        // 날짜 형식 검증 및 변환
        const formatBirthDate = (dateString: string) => {
          if (!dateString) return null;
          
          // YYYY-MM-DD 형식인지 확인
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (dateRegex.test(dateString)) {
            return dateString;
          }
          
          // 다른 형식이면 변환 시도
          const date = new Date(dateString);
          if (isNaN(date.getTime())) {
            console.warn('⚠️ 잘못된 날짜 형식:', dateString);
            return null;
          }
          
          return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
        };

        const formattedBirthDate = formatBirthDate(editForm.birth_date);
        console.log('📅 날짜 형식 변환:', { original: editForm.birth_date, formatted: formattedBirthDate });

        const updateData = {
          name: editForm.name,
          phone: editForm.phone || null,
          birth_date: formattedBirthDate,
          address: editForm.address || null,
          address_detail: editForm.address_detail || null,
          postal_code: editForm.postal_code || null,
          updated_at: new Date().toISOString()
        };

        let result;
        
        // Upsert 방식으로 안전하게 처리
        const upsertData = {
          user_id: user.user_id || user.id,
          email: user.email,
          password: savePassword, // 사용자가 입력한 비밀번호 사용
          ...updateData,
          signup_type: 'email',
          created_at: new Date().toISOString()
        };
        
        console.log('📝 Upsert 데이터:', upsertData);
        
        // Supabase upsert 사용 (conflict 시 업데이트)
        result = await (supabase as any)
          .from('members')
          .upsert(upsertData, { 
            onConflict: 'email',
            ignoreDuplicates: false 
          })
          .select();

        console.log('📊 DB 저장 결과:', result);

        if (result.error) {
          console.error('❌ 사용자 정보 저장 오류:', result.error);
          toast({
            title: "오류",
            description: `정보 저장에 실패했습니다: ${result.error.message}`,
            variant: "destructive"
          });
          return;
        }

        if (result.data && result.data.length > 0) {
          console.log('✅ DB 저장 성공:', result.data[0]);
        }

        // 닉네임은 user_id를 표시하는 용도로만 사용 (별도 저장 안함)
        console.log('ℹ️ 닉네임은 user_id 표시용:', editForm.nickname);

        // 로컬 상태 업데이트
        const updatedProfile = {
          ...userProfile,
          ...editForm,
          updated_at: new Date().toISOString()
        };
        setUserProfile(updatedProfile);
        
        toast({
          title: "저장 완료",
          description: "프로필 정보가 성공적으로 저장되었습니다."
        });
      }

      setIsEditing(false);
      setSavePasswordDialog(false);
      setSavePassword("");
    } catch (error) {
      console.error('정보 저장 오류:', error);
      toast({
        title: "오류",
        description: "정보 저장 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setSavePasswordLoading(false);
    }
  };

  // 비밀번호 일치 여부 확인
  const checkPasswordsMatch = (newPassword: string, confirmPassword: string) => {
    if (confirmPassword === "") {
      setPasswordsMatch(true); // 확인 비밀번호가 비어있으면 에러 표시 안함
      return;
    }
    
    const isMatch = newPassword === confirmPassword;
    setPasswordsMatch(isMatch);
    
    if (!isMatch && confirmPassword.length > 0) {
      console.log('❌ 비밀번호 불일치 감지');
    } else if (isMatch && confirmPassword.length > 0) {
      console.log('✅ 비밀번호 일치 확인');
    }
  };

  // 알림 설정 로드
  const loadNotificationSettings = async () => {
    if (!user) return;

    try {
      if (!isSupabaseConfigured) {
        // Demo 모드: 기본 알림 설정
        setNotifications({
          email_notifications: true,
          community_notifications: true,
          marketing_notifications: false
        });
      } else {
        // 실제 Supabase에서 알림 설정 조회 (테이블이 없을 경우 처리)
        try {
          const { data, error } = await (supabase as any)
            .from('member_settings')
            .select('email_notifications, community_notifications, marketing_notifications')
            .eq('user_id', user.user_id || user.id)
            .single();

          if (error) {
            // 테이블이 없거나 데이터가 없는 경우 기본값 설정
            if (error.code === '42P01' || error.code === 'PGRST116') {
              console.log('member_settings 테이블이 없거나 데이터가 없습니다. 기본값을 사용합니다.');
              setNotifications({
                email_notifications: true,
                community_notifications: true,
                marketing_notifications: false
              });
            } else {
              console.error('알림 설정 로드 오류:', error);
            }
            return;
          }

          if (data) {
            setNotifications(data);
          }
        } catch (tableError: any) {
          // 테이블이 존재하지 않는 경우 기본값 설정
          if (tableError.code === '42P01') {
            console.log('member_settings 테이블이 존재하지 않습니다. 기본값을 사용합니다.');
            setNotifications({
              email_notifications: true,
              community_notifications: true,
              marketing_notifications: false
            });
          } else {
            console.error('알림 설정 로드 중 예상치 못한 오류:', tableError);
          }
        }
      }
    } catch (error) {
      console.error('알림 설정 로드 오류:', error);
      // 오류 발생 시 기본값 설정
      setNotifications({
        email_notifications: true,
        community_notifications: true,
        marketing_notifications: false
      });
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      setEditForm({
        name: userProfile.name || "",
        nickname: userProfile.user_id || "", // 닉네임을 user_id로 설정
        phone: userProfile.phone || "",
        birth_date: userProfile.birth_date || "",
        address: userProfile.address || "",
        address_detail: userProfile.address_detail || "",
        postal_code: userProfile.postal_code || ""
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 주소 검색 함수
  const handleAddressSearch = () => {
    new (window as any).daum.Postcode({
      oncomplete: function(data: any) {
        console.log('🏠 주소 검색 결과:', data);
        
        // 기본 주소 조합
        let fullAddress = data.address;
        let extraAddress = '';

        // 참고항목이 있는 경우 추가
        if (data.addressType === 'R') {
          if (data.bname !== '') {
            extraAddress += data.bname;
          }
          if (data.buildingName !== '') {
            extraAddress += (extraAddress !== '' ? ', ' + data.buildingName : data.buildingName);
          }
          fullAddress += (extraAddress !== '' ? ' (' + extraAddress + ')' : '');
        }

        // 폼에 주소와 우편번호 설정
        setEditForm({
          ...editForm,
          address: fullAddress,
          postal_code: data.zonecode
        });

        toast({
          title: "주소 선택 완료",
          description: `${fullAddress} (${data.zonecode})`,
        });
      }
    }).open();
  };

  // 비밀번호 변경 핸들러 (DB 업데이트 포함)
  const handlePasswordChange = async () => {
    // 중복 실행 방지
    if (passwordLoading) return;
    
    // 기본 검증
    if (!user) {
      toast({ title: "오류", description: "사용자 정보를 찾을 수 없습니다.", variant: "destructive" });
      return;
    }
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast({ title: "오류", description: "모든 필드를 입력해주세요.", variant: "destructive" });
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: "오류", description: "새 비밀번호가 일치하지 않습니다.", variant: "destructive" });
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast({ title: "오류", description: "새 비밀번호는 6자 이상이어야 합니다.", variant: "destructive" });
      return;
    }

    // Demo 모드에서 현재 비밀번호 확인
    if (!isSupabaseConfigured && passwordForm.currentPassword !== "1q2w3e$R") {
      toast({ title: "오류", description: "현재 비밀번호가 올바르지 않습니다. (Demo: 1q2w3e$R)", variant: "destructive" });
      return;
    }

    setPasswordLoading(true);
    
    try {
      // Demo 모드든 실제 모드든 members 테이블 업데이트
      console.log('🔄 DB에 비밀번호 업데이트 중...');
      console.log('📧 사용자 이메일:', user.email);
      console.log('🔑 새 비밀번호:', passwordForm.newPassword);
      
      const { data, error } = await (supabase as any)
        .from('members')
        .update({ 
          password: passwordForm.newPassword,
          updated_at: new Date().toISOString()
        })
        .eq('email', user.email)
        .select();
      
      if (error) {
        console.error('❌ DB 업데이트 실패:', error);
        toast({ 
          title: "오류", 
          description: "비밀번호 변경에 실패했습니다. 다시 시도해주세요.", 
          variant: "destructive" 
        });
        return;
      }
      
      console.log('✅ DB 업데이트 성공:', data);
      
      // 업데이트된 데이터 확인
      if (data && data.length > 0) {
        console.log('📋 업데이트된 사용자 정보:', data[0]);
        console.log('🔑 변경된 비밀번호:', data[0].password);
        console.log('⏰ 업데이트 시간:', data[0].updated_at);
      }
      
      // 성공 처리
      toast({ 
        title: "변경 완료", 
        description: `비밀번호가 변경되었습니다.${!isSupabaseConfigured ? ' (Demo 모드)' : ''} DB에 저장되었습니다.` 
      });
      
      // 폼 초기화 및 다이얼로그 닫기
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswords({ current: false, new: false, confirm: false });
      setPasswordDialog(false);
      
    } catch (error) {
      console.error('❌ 비밀번호 변경 중 오류:', error);
      toast({ 
        title: "오류", 
        description: "비밀번호 변경 중 오류가 발생했습니다.", 
        variant: "destructive" 
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // 알림 설정 저장 핸들러
  const handleNotificationSave = async () => {
    if (!user) return;

    setNotificationLoading(true);
    try {
      if (!isSupabaseConfigured) {
        toast({
          title: "저장 완료",
          description: "알림 설정이 저장되었습니다. (Demo 모드)",
        });
      } else {
        // 실제 Supabase에서 알림 설정 저장
        const { error } = await (supabase as any)
          .from('member_settings')
          .upsert({
            user_id: user.user_id || user.id,
            email_notifications: notifications.email_notifications,
            community_notifications: notifications.community_notifications,
            marketing_notifications: notifications.marketing_notifications,
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.error('알림 설정 저장 오류:', error);
          toast({
            title: "오류",
            description: "알림 설정 저장에 실패했습니다.",
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "저장 완료",
          description: "알림 설정이 성공적으로 저장되었습니다.",
        });
      }

      setNotificationDialog(false);
    } catch (error) {
      console.error('알림 설정 저장 오류:', error);
      toast({
        title: "오류",
        description: "알림 설정 저장 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setNotificationLoading(false);
    }
  };

  // 회원 탈퇴 핸들러 (DB 삭제 포함)
  const handleAccountDelete = async () => {
    if (!user) return;

    if (deleteConfirmText !== "회원탈퇴") {
      toast({
        title: "오류",
        description: "'회원탈퇴'를 정확히 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setDeleteLoading(true);
    try {
      // Demo 모드든 실제 모드든 members 테이블에서 삭제
      console.log('🗑️ DB에서 회원 정보 삭제 중...');
      console.log('📧 삭제할 사용자 이메일:', user.email);
      console.log('🆔 삭제할 사용자 ID:', user.user_id || user.id);
      
      // 이메일로 삭제 (더 확실한 방법)
      const { data, error } = await (supabase as any)
        .from('members')
        .delete()
        .eq('email', user.email)
        .select();
      
      if (error) {
        console.error('❌ DB 삭제 실패:', error);
        toast({
          title: "오류",
          description: "회원 탈퇴 처리에 실패했습니다. 다시 시도해주세요.",
          variant: "destructive"
        });
        return;
      }
      
      console.log('✅ DB 삭제 성공:', data);
      
      // 삭제된 데이터 확인
      if (data && data.length > 0) {
        console.log('🗑️ 삭제된 사용자 정보:', data[0]);
      }
      
      // 실제 Supabase 모드에서는 Auth 로그아웃도 수행
      if (isSupabaseConfigured) {
        try {
          await (supabase as any).auth.signOut();
          console.log('🟢 Supabase Auth 로그아웃 완료');
        } catch (authError) {
          console.log('🟡 Supabase Auth 로그아웃 오류 (무시):', authError);
        }
      }
      
      toast({
        title: "탈퇴 완료",
        description: `회원 탈퇴가 완료되었습니다.${!isSupabaseConfigured ? ' (Demo 모드)' : ''} DB에서 삭제되었습니다.`,
      });
      
      // 로그아웃 및 홈으로 이동
      logout();
      
    } catch (error) {
      console.error('❌ 회원 탈퇴 중 오류:', error);
      toast({
        title: "오류",
        description: "회원 탈퇴 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!user || !userProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 프로필 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            프로필 정보
            <Button
              variant={isEditing ? "outline" : "default"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              disabled={loading}
              className={isEditing 
                ? "border-red-200 text-red-600 hover:bg-red-50" 
                : "bg-green-600 hover:bg-green-700 text-white"
              }
            >
              <Edit2 size={16} className="mr-2" />
              {isEditing ? "편집 취소" : "정보 수정"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="text-xl">
                {userProfile.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{userProfile.name}</h3>
              <p className="text-gray-600">
                회원가입일: {formatDate(userProfile.created_at)}
              </p>
              {!isSupabaseConfigured && (
                <p className="text-sm text-orange-600 mt-1">
                  Demo 모드로 실행 중
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 기본 정보 섹션 */}
            <div className="space-y-4">
              <Label className="text-base font-medium flex items-center gap-2">
                <Edit2 size={18} className="text-green-500" />
                기본 정보
              </Label>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm text-gray-600">이름</Label>
                  <Input
                    id="name"
                    value={isEditing ? editForm.name : userProfile.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    disabled={!isEditing}
                    className={isEditing ? "border-green-200 focus:border-green-400" : "bg-gray-50 border-gray-200"}
                    placeholder="이름을 입력하세요"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nickname" className="text-sm text-gray-600">닉네임 (User ID)</Label>
                  <Input
                    id="nickname"
                    value={userProfile.user_id || ""}
                    disabled={true}
                    className="bg-gray-50 border-gray-200 font-mono text-sm"
                    placeholder="User ID"
                  />
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    커뮤니티에서 표시될 고유 식별자입니다 (변경 불가)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm text-gray-600">이메일</Label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={userProfile.email}
                      disabled={true}
                      className="pl-10 bg-gray-50 border-gray-200"
                    />
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    이메일은 변경할 수 없습니다
                  </p>
                </div>
              </div>
            </div>

            {/* 연락처 및 개인정보 섹션 */}
            <div className="space-y-4">
              <Label className="text-base font-medium flex items-center gap-2">
                <Phone size={18} className="text-purple-500" />
                연락처 및 개인정보
              </Label>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm text-gray-600">전화번호</Label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="phone"
                      value={isEditing ? editForm.phone : (userProfile.phone || "")}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      disabled={!isEditing}
                      placeholder="010-0000-0000"
                      className={`pl-10 ${isEditing ? "border-purple-200 focus:border-purple-400" : "bg-gray-50 border-gray-200"}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-sm text-gray-600">생년월일</Label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="birthDate"
                      type="date"
                      value={isEditing ? editForm.birth_date : (userProfile.birth_date || "")}
                      onChange={(e) => setEditForm({...editForm, birth_date: e.target.value})}
                      disabled={!isEditing}
                      className={`pl-10 ${isEditing ? "border-purple-200 focus:border-purple-400" : "bg-gray-50 border-gray-200"}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 md:col-span-2">
              <Label className="text-base font-medium flex items-center gap-2">
                <MapPin size={18} className="text-blue-500" />
                주소 정보
              </Label>
              
              {/* 우편번호 + 주소 검색 */}
              <div className="space-y-2">
                <Label htmlFor="postal_code" className="text-sm text-gray-600">우편번호</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="postal_code"
                    value={isEditing ? editForm.postal_code : (userProfile.postal_code || "")}
                    onChange={(e) => setEditForm({...editForm, postal_code: e.target.value})}
                    disabled={!isEditing}
                    placeholder="12345"
                    className="w-28 text-center font-mono text-lg tracking-wider"
                    maxLength={5}
                  />
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddressSearch}
                      className="px-4 py-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 font-medium"
                    >
                      <MapPin size={16} className="mr-2" />
                      주소 검색
                    </Button>
                  )}
                </div>
              </div>

              {/* 기본주소 */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm text-gray-600">기본주소</Label>
                <Input
                  id="address"
                  value={isEditing ? editForm.address : (userProfile.address || "")}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  disabled={!isEditing}
                  placeholder="도로명주소 또는 지번주소"
                  className="bg-gray-50 border-gray-200"
                />
              </div>

              {/* 상세주소 */}
              <div className="space-y-2">
                <Label htmlFor="address_detail" className="text-sm text-gray-600">상세주소</Label>
                <Input
                  id="address_detail"
                  value={isEditing ? editForm.address_detail : (userProfile.address_detail || "")}
                  onChange={(e) => setEditForm({...editForm, address_detail: e.target.value})}
                  disabled={!isEditing}
                  placeholder="동, 층, 호수 등을 입력하세요"
                  className="bg-white border-gray-200"
                />
              </div>

              {/* 주소 미리보기 */}
              {(userProfile?.postal_code || userProfile?.address || userProfile?.address_detail) && !isEditing && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">전체 주소</div>
                  <div className="text-sm font-medium text-gray-800">
                    {userProfile.postal_code && `(${userProfile.postal_code}) `}
                    {userProfile.address}
                    {userProfile.address_detail && `, ${userProfile.address_detail}`}
                  </div>
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              <Button 
                onClick={handleSaveClick} 
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
              >
                <Save size={18} className="mr-2" />
                변경사항 저장
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCancel} 
                disabled={loading}
                className="flex-1 border-gray-300 hover:bg-gray-50 font-medium py-3"
              >
                <X size={18} className="mr-2" />
                취소
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 계정 설정 */}
      <Card>
        <CardHeader>
          <CardTitle>계정 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 비밀번호 변경 */}
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => {
              console.log('🔘 비밀번호 변경 다이얼로그 열기 클릭됨');
              // 폼 초기화
              setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
              });
              setShowPasswords({
                current: false,
                new: false,
                confirm: false
              });
              setPasswordsMatch(true); // 비밀번호 일치 상태 초기화
              setPasswordDialog(true);
              console.log('✅ 다이얼로그 상태 변경됨:', true);
            }}
          >
            <Lock size={16} className="mr-2" />
            비밀번호 변경
          </Button>
          
          <Dialog 
            open={passwordDialog} 
            onOpenChange={(open) => {
              console.log('🔄 다이얼로그 상태 변경:', open);
              setPasswordDialog(open);
            }}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>비밀번호 변경</DialogTitle>
                <DialogDescription>
                  보안을 위해 현재 비밀번호를 입력한 후 새 비밀번호를 설정해주세요.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">현재 비밀번호</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      placeholder="현재 비밀번호를 입력하세요"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                    >
                      {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">새 비밀번호</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => {
                        const newPassword = e.target.value;
                        setPasswordForm({...passwordForm, newPassword});
                        checkPasswordsMatch(newPassword, passwordForm.confirmPassword);
                      }}
                      placeholder="새 비밀번호를 입력하세요 (최소 6자)"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                    >
                      {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => {
                        const confirmPassword = e.target.value;
                        setPasswordForm({...passwordForm, confirmPassword});
                        checkPasswordsMatch(passwordForm.newPassword, confirmPassword);
                      }}
                      placeholder="새 비밀번호를 다시 입력하세요"
                      className={!passwordsMatch && passwordForm.confirmPassword ? "border-red-500 focus:border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                    >
                      {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                  {/* 비밀번호 일치 상태 표시 */}
                  {passwordForm.confirmPassword && (
                    <div className="mt-2">
                      {passwordsMatch ? (
                        <p className="text-sm text-green-600 flex items-center">
                          <span className="mr-1">✓</span>
                          비밀번호가 일치합니다
                        </p>
                      ) : (
                        <p className="text-sm text-red-600 flex items-center">
                          <span className="mr-1">✗</span>
                          비밀번호가 일치하지 않습니다
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button 
                  type="button"
                  onClick={handlePasswordChange}
                  disabled={passwordLoading || !passwordsMatch || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword} 
                  className="flex-1"
                >
                  {passwordLoading ? "변경 중..." : "비밀번호 변경"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    console.log('🔘 취소 버튼 클릭됨');
                    setPasswordDialog(false);
                  }} 
                  disabled={passwordLoading}
                >
                  취소
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* 알림 설정 */}
          <Dialog open={notificationDialog} onOpenChange={setNotificationDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Bell size={16} className="mr-2" />
                알림 설정
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>알림 설정</DialogTitle>
                <DialogDescription>
                  받고 싶은 알림 유형을 선택해주세요.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>이메일 알림</Label>
                    <p className="text-sm text-gray-500">
                      중요한 정보를 이메일로 받습니다
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email_notifications}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, email_notifications: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>커뮤니티 알림</Label>
                    <p className="text-sm text-gray-500">
                      댓글, 좋아요 등의 활동 알림을 받습니다
                    </p>
                  </div>
                  <Switch
                    checked={notifications.community_notifications}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, community_notifications: checked})
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>마케팅 알림</Label>
                    <p className="text-sm text-gray-500">
                      이벤트, 프로모션 정보를 받습니다
                    </p>
                  </div>
                  <Switch
                    checked={notifications.marketing_notifications}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, marketing_notifications: checked})
                    }
                  />
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button onClick={handleNotificationSave} disabled={notificationLoading} className="flex-1">
                  {notificationLoading ? "저장 중..." : "저장"}
                </Button>
                <Button variant="outline" onClick={() => setNotificationDialog(false)} disabled={notificationLoading}>
                  취소
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* 회원 탈퇴 */}
          <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 size={16} className="mr-2" />
                회원 탈퇴
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>회원 탈퇴</AlertDialogTitle>
                <AlertDialogDescription>
                  정말로 회원 탈퇴를 하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                  <br /><br />
                  탈퇴 시 다음 정보가 모두 삭제됩니다:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>개인 정보 및 프로필</li>
                    <li>작성한 게시글 및 댓글</li>
                    <li>진단 결과 및 기록</li>
                    <li>코칭 신청 내역</li>
                  </ul>
                  <br />
                  계속하려면 아래에 <strong>'회원탈퇴'</strong>를 정확히 입력해주세요.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="my-4">
                <Input
                  placeholder="회원탈퇴"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleteLoading}>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleAccountDelete}
                  disabled={deleteLoading || deleteConfirmText !== "회원탈퇴"}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleteLoading ? "탈퇴 처리 중..." : "회원 탈퇴"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* 저장 시 비밀번호 입력 다이얼로그 */}
      <Dialog open={savePasswordDialog} onOpenChange={setSavePasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>비밀번호 확인</DialogTitle>
            <DialogDescription>
              프로필 정보를 저장하기 위해 비밀번호를 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="savePassword">비밀번호</Label>
              <div className="relative">
                <Input
                  id="savePassword"
                  type={showSavePassword ? "text" : "password"}
                  value={savePassword}
                  onChange={(e) => setSavePassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && savePassword.trim()) {
                      handleSave();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowSavePassword(!showSavePassword)}
                >
                  {showSavePassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-6">
            <Button 
              onClick={handleSave}
              disabled={savePasswordLoading || !savePassword.trim()} 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Save size={16} className="mr-2" />
              {savePasswordLoading ? "저장 중..." : "저장"}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setSavePasswordDialog(false);
                setSavePassword("");
              }} 
              disabled={savePasswordLoading}
            >
              취소
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyInfo;
