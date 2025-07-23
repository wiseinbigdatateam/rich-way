import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCoachingApplications } from "@/hooks/useCoachingApplications";
import { useAuth } from "@/contexts/AuthContext";
import { getSessionStatus } from "@/utils/sessionManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Eye, LogOut, User, History, ArrowUpDown, Download, FileText, CheckCircle, Clock, Banknote, X, Info, AlertTriangle, CheckCircle2, AlertCircle, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface ConsultationHistory {
  id: string; // uuid
  date: string;
  title: string;
  content: string;
  status: "접수" | "진행중" | "진행완료";
}

interface ConsultationRequest {
  id: number;
  date: string;
  applicant: string;
  name: string;
  phone: string;
  email: string;
  consultationTitle: string;
  consultationContent: string;
  consultationMethod: "전화" | "화상" | "방문" | "메시지";
  field: string;
  experience: string;
  goals: string;
  expectations: string;
  attachmentFile?: string;
  status: "접수" | "진행중" | "진행완료";
  applicationCount: number;
  priceType: "무료" | "디럭스" | "프리미엄";
  productPrice: number; // 실제 product_price 추가
  history: ConsultationHistory[];
  expertProfileImageUrl?: string; // 전문가 프로필 이미지 URL 추가
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_read: boolean;
  created_at: string;
}

type SortField = "id" | "date" | "applicant" | "applicationCount" | "priceType" | "field" | "status";
type SortOrder = "asc" | "desc";

const ExpertPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expertInfo, setExpertInfo] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("전체");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  // 실제 데이터베이스에서 코칭 신청 데이터 가져오기
  const { applications, loading, error, updateApplicationStatus, addCoachingHistory, getCoachingHistory } = useCoachingApplications(expertInfo?.user_id);

  useEffect(() => {
    // 새로운 세션 관리 시스템으로 인증 확인
    const { isAuthenticated, userType } = getSessionStatus();
    
    if (!isAuthenticated || userType !== 'expert') {
      // 기존 시스템과의 호환성을 위해 기존 인증도 확인
      const legacyAuth = localStorage.getItem("expertAuth");
      if (!legacyAuth) {
        navigate("/expert/login");
        return;
      }
    }

    const expertData = localStorage.getItem("expertInfo");
    if (expertData) {
      const parsedData = JSON.parse(expertData);
      console.log('전문가 정보:', parsedData); // 디버깅 로그 추가
      
      // localStorage의 데이터를 최신 데이터베이스 정보로 업데이트
      const updateExpertInfo = async () => {
        try {
          const { data, error } = await (supabase as any)
            .from('experts')
            .select('*')
            .eq('user_id', parsedData.user_id);

          if (error) {
            console.error('전문가 정보 업데이트 오류:', error);
            setExpertInfo(parsedData); // 기존 데이터 사용
            return;
          }

          if (data && data.length > 0) {
            const expert = data[0];
            // 최신 데이터로 localStorage 업데이트
            const updatedExpertInfo = {
              user_id: expert.user_id,
              name: expert.expert_name,
              specialty: expert.main_field,
              company: expert.company_name,
              avatar: expert.profile_image_url || null
            };
            
            localStorage.setItem("expertInfo", JSON.stringify(updatedExpertInfo));
            setExpertInfo(updatedExpertInfo);
            console.log('업데이트된 전문가 정보:', updatedExpertInfo);
          } else {
            setExpertInfo(parsedData); // 기존 데이터 사용
          }
        } catch (err) {
          console.error('전문가 정보 업데이트 중 오류:', err);
          setExpertInfo(parsedData); // 기존 데이터 사용
        }
      };

      updateExpertInfo();
    }
  }, [navigate]);

  // 알림 데이터 가져오기
  useEffect(() => {
    console.log('알림 데이터 가져오기 useEffect 실행:', { expertInfo });
    if (expertInfo?.user_id) {
      console.log('전문가 user_id 확인:', expertInfo.user_id);
      fetchNotifications();
    } else {
      console.log('expertInfo.user_id가 없음');
    }
  }, [expertInfo?.user_id]);

  // 데이터베이스에서 가져온 코칭 신청 데이터를 화면에 맞는 형태로 변환
  const consultations = useMemo(() => {
    return applications.map((app: any) => ({
      id: app.id,
      date: app.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      applicant: app.name || '알 수 없음',
      name: app.name || '알 수 없음',
      phone: app.contact || '알 수 없음',
      email: app.email || '알 수 없음',
      consultationTitle: app.title || '코칭 신청',
      consultationContent: app.content || '상담 내용 없음',
      consultationMethod: app.method || '전화',
      field: '일반', // 실제 데이터베이스에 field 컬럼이 없으므로 기본값
      experience: '경험 정보 없음', // 실제 데이터베이스에 experience 컬럼이 없으므로 기본값
      goals: '목표 정보 없음', // 실제 데이터베이스에 goals 컬럼이 없으므로 기본값
      expectations: '기대사항 정보 없음', // 실제 데이터베이스에 expectations 컬럼이 없으므로 기본값
      attachmentFile: app.attachment_url || undefined,
      status: app.status || '접수',
        applicationCount: 1,
      priceType: app.product_name === 'FREE' ? '무료' : app.product_name === 'DELUXE' ? '디럭스' : '프리미엄',
      productPrice: app.product_price || 0, // 실제 product_price 추가
      history: app.history || [],
      expertProfileImageUrl: app.expert_profile_image_url || null // 전문가 프로필 이미지 URL 추가
    }));
  }, [applications]);

  const handleStatusChange = async (id: string, newStatus: "접수" | "진행중" | "진행완료") => {
    try {
      // 데이터베이스에서 상태 업데이트
      await updateApplicationStatus(id, newStatus);
      
      // 히스토리에 상태 변경 기록 추가
      const consultation = consultations.find(c => c.id === id);
      if (consultation) {
        await addCoachingHistory(id, `상태 변경: ${newStatus}`, `${consultation.applicant}님의 상담 상태가 ${newStatus}로 변경되었습니다.`, newStatus);
        
        // 상태 변경 시 자동 알림 생성
        const statusText = newStatus === '접수' ? '접수' : newStatus === '진행중' ? '진행중' : '완료';
        await createNotification(
          `상담 상태 변경`,
          `${consultation.applicant}님의 상담이 ${statusText}로 변경되었습니다.`,
          'success',
          id
        );
      }
      
      toast({
        title: "상태 변경 완료",
        description: "상담 상태가 변경되었습니다.",
      });
    } catch (error) {
      console.error('상담 상태 변경 중 오류 발생:', error);
      toast({
        title: "상태 변경 실패",
        description: "상담 상태 변경에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    const { logout } = useAuth();
    logout();
    navigate("/expert/login");
  };

  // 알림 관련 함수들
  const fetchNotifications = async () => {
    console.log('fetchNotifications 실행, expertInfo.user_id:', expertInfo?.user_id);
    if (!expertInfo?.user_id) {
      console.log('expertInfo.user_id가 없어서 fetchNotifications 중단');
      return;
    }

    try {
      console.log('Supabase에서 알림 데이터 조회 시작...');
      console.log('조회할 expert_user_id:', expertInfo.user_id);
      
      const { data, error } = await (supabase as any)
        .from('expert_notifications')
        .select('*')
        .eq('expert_user_id', expertInfo.user_id)
        .order('created_at', { ascending: false });

      console.log('Supabase 응답 - data:', data);
      console.log('Supabase 응답 - error:', error);

      if (error) {
        console.error('알림 데이터 조회 오류:', error);
        return;
      }

      console.log('알림 데이터 조회 결과:', data);
      setNotifications(data || []);
    } catch (err) {
      console.error('알림 데이터 조회 중 예외 발생:', err);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('expert_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('알림 읽음 처리 오류:', error);
        return;
      }

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (err) {
      console.error('알림 읽음 처리 중 예외 발생:', err);
    }
  };

  const markAllNotificationsAsRead = async () => {
    if (!expertInfo?.user_id) return;

    try {
      const { error } = await (supabase as any)
        .from('expert_notifications')
        .update({ is_read: true })
        .eq('expert_user_id', expertInfo.user_id)
        .eq('is_read', false);

      if (error) {
        console.error('모든 알림 읽음 처리 오류:', error);
        return;
      }

      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );

      toast({
        title: "알림 읽음 처리 완료",
        description: "모든 알림을 읽음 처리했습니다.",
      });
    } catch (err) {
      console.error('모든 알림 읽음 처리 중 예외 발생:', err);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('expert_notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error('알림 삭제 오류:', error);
        return;
      }

      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );

      toast({
        title: "알림 삭제 완료",
        description: "알림을 삭제했습니다.",
      });
    } catch (err) {
      console.error('알림 삭제 중 예외 발생:', err);
    }
  };

  // 새로운 알림 생성 함수
  const createNotification = async (title: string, message: string, type: 'info' | 'warning' | 'success' | 'error' = 'info', relatedApplicationId?: string) => {
    if (!expertInfo?.user_id) return;

    try {
      const { data, error } = await (supabase as any)
        .from('expert_notifications')
        .insert({
          expert_user_id: expertInfo.user_id,
          title,
          message,
          type,
          related_application_id: relatedApplicationId,
          is_read: false,
          created_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error('알림 생성 오류:', error);
        return;
      }

      // 새 알림을 목록 맨 위에 추가
      if (data && data.length > 0) {
        setNotifications(prev => [data[0], ...prev]);
      }

      console.log('새 알림 생성됨:', data);
    } catch (err) {
      console.error('알림 생성 중 예외 발생:', err);
    }
  };

  // 읽지 않은 알림 개수
  const unreadCount = notifications.filter(n => !n.is_read).length;
  console.log('알림 상태:', { 
    totalNotifications: notifications.length, 
    unreadCount, 
    notifications: notifications.map(n => ({ id: n.id, title: n.title, is_read: n.is_read }))
  });

  // 알림 타입별 아이콘
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'success': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  // 알림 타입별 배경색
  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-50 border-blue-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [selectedConsultationId, setSelectedConsultationId] = useState<string>("");
  const [newHistoryTitle, setNewHistoryTitle] = useState("");
  const [newHistoryContent, setNewHistoryContent] = useState("");
  const [newHistoryStatus, setNewHistoryStatus] = useState<"접수" | "진행중" | "진행완료">("진행중");

  const handleAddHistory = async (consultationId: string) => {
    setSelectedConsultationId(consultationId);
    setNewHistoryTitle("");
    setNewHistoryContent("");
    setNewHistoryStatus("진행중");
    setShowHistoryDialog(true);
  };

  const handleSaveHistory = async () => {
    if (!newHistoryTitle.trim() || !newHistoryContent.trim()) {
      toast({
        title: "입력 오류",
        description: "제목과 내용을 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addCoachingHistory(selectedConsultationId, newHistoryTitle, newHistoryContent, newHistoryStatus);
      
      toast({
        title: "히스토리 추가 완료",
        description: "히스토리가 성공적으로 추가되었습니다.",
      });
      
      setShowHistoryDialog(false);
      setNewHistoryTitle("");
      setNewHistoryContent("");
      setNewHistoryStatus("진행중");
    } catch (error) {
      console.error('히스토리 추가 중 오류 발생:', error);
      toast({
        title: "히스토리 추가 실패",
        description: "히스토리 추가에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "접수":
        return "bg-yellow-100 text-yellow-800";
      case "진행중":
        return "bg-blue-100 text-blue-800";
      case "진행완료":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriceTypeColor = (priceType: string) => {
    switch (priceType) {
      case "무료":
        return "bg-gray-100 text-gray-800";
      case "디럭스":
        return "bg-blue-100 text-blue-800";
      case "프리미엄":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getApplicationCountText = (count: number) => {
    if (count === 1) return "신규";
    return `${count}회`;
  };

  const getConsultationMethodColor = (method: string) => {
    switch (method) {
      case "전화":
        return "bg-green-100 text-green-800";
      case "화상":
        return "bg-blue-100 text-blue-800";
      case "방문":
        return "bg-orange-100 text-orange-800";
      case "메시지":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedConsultations = useMemo(() => {
    let filtered = consultations;
    
    if (searchTerm) {
      filtered = consultations.filter(consultation => {
        switch (searchType) {
          case "이름":
            return consultation.name.toLowerCase().includes(searchTerm.toLowerCase());
          case "연락처":
            return consultation.phone.includes(searchTerm);
          case "제목":
            return consultation.consultationTitle.toLowerCase().includes(searchTerm.toLowerCase());
          case "내용":
            return consultation.consultationContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   consultation.experience.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   consultation.goals.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   consultation.expectations.toLowerCase().includes(searchTerm.toLowerCase());
          default:
            return consultation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   consultation.phone.includes(searchTerm) ||
                   consultation.consultationTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   consultation.consultationContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   consultation.experience.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   consultation.goals.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   consultation.expectations.toLowerCase().includes(searchTerm.toLowerCase());
        }
      });
    }

    // Sorting logic
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle special cases for sorting
      if (sortField === "date") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortField === "status") {
        const statusOrder = { "접수": 1, "진행중": 2, "진행완료": 3 };
        aValue = statusOrder[aValue as keyof typeof statusOrder];
        bValue = statusOrder[bValue as keyof typeof statusOrder];
      } else if (sortField === "priceType") {
        const priceOrder = { "무료": 1, "디럭스": 2, "프리미엄": 3 };
        aValue = priceOrder[aValue as keyof typeof priceOrder];
        bValue = priceOrder[bValue as keyof typeof priceOrder];
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [consultations, searchTerm, searchType, sortField, sortOrder]);

  // Calculate dashboard statistics
  const dashboardStats = useMemo(() => {
    const 접수 = consultations.filter(c => c.status === "접수").length;
    const 진행중 = consultations.filter(c => c.status === "진행중").length;
    const 진행완료 = consultations.filter(c => c.status === "진행완료").length;
    
    // Calculate revenue based on actual product_price from database
    const 내수익 = consultations
      .filter(c => c.status === "진행완료")
      .reduce((total, c) => {
        return total + (c.productPrice || 0);
      }, 0);

    return { 접수, 진행중, 진행완료, 내수익 };
  }, [consultations]);

  if (!expertInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={expertInfo.avatar} />
                <AvatarFallback>
                  <User className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold">{expertInfo.name}</h1>
                <p className="text-sm text-gray-600">{expertInfo.specialty}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('/', '_blank')}
                className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                title="홈으로 (새창)"
              >
                <Home className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-4 h-4" />
                </Button>
                {unreadCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 min-w-[20px] h-5 flex items-center justify-center">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 알림 패널 */}
      {showNotifications && (
        <div className="absolute top-16 right-4 z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">알림</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const title = prompt("알림 제목을 입력하세요:");
                    const message = prompt("알림 내용을 입력하세요:");
                    if (title && message) {
                      createNotification(title, message, 'info');
                    }
                  }}
                  className="text-xs"
                >
                  새 알림
                </Button>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllNotificationsAsRead}
                    className="text-xs"
                  >
                    모두 읽음
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>알림이 없습니다</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.is_read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${
                            !notification.is_read ? 'text-gray-900' : 'text-gray-600'
                          }`}>
                            {notification.title}
                          </p>
                          <div className="flex items-center gap-1">
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notification.created_at).toLocaleString('ko-KR')}
                        </p>
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markNotificationAsRead(notification.id)}
                            className="mt-2 h-6 text-xs text-blue-600 hover:text-blue-800"
                          >
                            읽음 처리
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* 테스트용 알림 생성 버튼 */}
          <div className="md:col-span-4 mb-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">알림 관리</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const title = prompt("알림 제목을 입력하세요:");
                        const message = prompt("알림 내용을 입력하세요:");
                        if (title && message) {
                          createNotification(title, message, 'info');
                        }
                      }}
                    >
                      새 알림 생성
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        createNotification(
                          "시스템 점검 안내",
                          "오늘 밤 12시부터 2시간 동안 시스템 점검이 예정되어 있습니다.",
                          'warning'
                        );
                      }}
                    >
                      테스트 알림
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">접수</p>
                  <p className="text-3xl font-bold text-yellow-600">{dashboardStats.접수}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">진행중</p>
                  <p className="text-3xl font-bold text-blue-600">{dashboardStats.진행중}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">진행완료</p>
                  <p className="text-3xl font-bold text-green-600">{dashboardStats.진행완료}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">내수익</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {dashboardStats.내수익.toLocaleString()}원
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Banknote className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>상담 신청 관리</CardTitle>
            {/* 검색 기능 */}
            <div className="flex gap-4 items-center">
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체</SelectItem>
                  <SelectItem value="이름">이름</SelectItem>
                  <SelectItem value="연락처">연락처</SelectItem>
                  <SelectItem value="제목">제목</SelectItem>
                  <SelectItem value="내용">내용</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] cursor-pointer" onClick={() => handleSort("id")}>
                    <div className="flex items-center gap-1">
                      번호
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                    <div className="flex items-center gap-1">
                      신청날짜
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("applicant")}>
                    <div className="flex items-center gap-1">
                      신청인
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("applicationCount")}>
                    <div className="flex items-center gap-1">
                      신청횟수
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("priceType")}>
                    <div className="flex items-center gap-1">
                      가격구분
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("field")}>
                    <div className="flex items-center gap-1">
                      분야
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead>신청내용</TableHead>
                  <TableHead>히스토리</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                    <div className="flex items-center gap-1">
                      진행상황
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedConsultations.map((consultation, index) => (
                  <TableRow key={consultation.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{consultation.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage 
                            src={consultation.expertProfileImageUrl || undefined} 
                            alt={consultation.applicant}
                          />
                          <AvatarFallback className="text-xs">
                            {consultation.applicant.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{consultation.applicant}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getApplicationCountText(consultation.applicationCount)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriceTypeColor(consultation.priceType)}>
                        {consultation.priceType}
                      </Badge>
                    </TableCell>
                    <TableCell>{consultation.field}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            보기
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>상담 신청 상세 내용</DialogTitle>
                            <DialogDescription>
                              {consultation.applicant}님의 상담 신청 내용입니다.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Basic Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold text-sm text-gray-600 mb-1">이름</h4>
                                <p className="text-sm">{consultation.name}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm text-gray-600 mb-1">연락처</h4>
                                <p className="text-sm">{consultation.phone}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm text-gray-600 mb-1">이메일</h4>
                                <p className="text-sm">{consultation.email}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm text-gray-600 mb-1">상담방법</h4>
                                <Badge className={getConsultationMethodColor(consultation.consultationMethod)}>
                                  {consultation.consultationMethod}
                                </Badge>
                              </div>
                            </div>

                            {/* Consultation Details */}
                            <div>
                              <h4 className="font-semibold text-sm text-gray-600 mb-2">상담제목</h4>
                              <p className="text-sm bg-gray-50 p-3 rounded font-medium">{consultation.consultationTitle}</p>
                            </div>

                            <div>
                              <h4 className="font-semibold text-sm text-gray-600 mb-2">상담내용</h4>
                              <p className="text-sm bg-gray-50 p-3 rounded leading-relaxed">{consultation.consultationContent}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-sm text-gray-600 mb-2">현재 상황 및 경험</h4>
                              <p className="text-sm bg-gray-50 p-3 rounded">{consultation.experience}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-sm text-gray-600 mb-2">목표</h4>
                              <p className="text-sm bg-gray-50 p-3 rounded">{consultation.goals}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-sm text-gray-600 mb-2">전문가에게 기대하는 점</h4>
                              <p className="text-sm bg-gray-50 p-3 rounded">{consultation.expectations}</p>
                            </div>

                            {/* Attachment */}
                            {consultation.attachmentFile && (
                              <div>
                                <h4 className="font-semibold text-sm text-gray-600 mb-2">첨부파일</h4>
                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                                  <Download className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                                    {consultation.attachmentFile}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <History className="w-4 h-4 mr-1" />
                            히스토리 ({consultation.history.length})
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>코칭 히스토리</DialogTitle>
                            <DialogDescription>
                              {consultation.applicant}님의 이전 상담 내역입니다.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end mb-4">
                            <Button 
                              size="sm" 
                              onClick={() => handleAddHistory(consultation.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              히스토리 추가
                            </Button>
                          </div>
                          <div className="space-y-4">
                            {consultation.history.length > 0 ? (
                              consultation.history
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((historyItem, index) => (
                                  <div key={historyItem.id} className="border rounded-lg p-4 bg-white shadow-sm">
                                    <div className="flex justify-between items-start mb-3">
                                      <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                          <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                                        </div>
                                        <h4 className="font-semibold text-lg">{historyItem.title}</h4>
                                      </div>
                                    <Badge className={getStatusColor(historyItem.status)}>
                                      {historyItem.status}
                                    </Badge>
                                  </div>
                                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                                      <Clock className="w-4 h-4" />
                                      <span>{new Date(historyItem.date).toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}</span>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{historyItem.content}</p>
                                    </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-8">
                                <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">이전 상담 내역이 없습니다.</p>
                                <p className="text-sm text-gray-400 mt-1">히스토리 추가 버튼을 클릭하여 첫 번째 기록을 추가해보세요.</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(consultation.status)}>
                          {consultation.status}
                        </Badge>
                        <select
                          value={consultation.status}
                          onChange={(e) => handleStatusChange(consultation.id, e.target.value as any)}
                          className="text-xs border rounded px-2 py-1"
                        >
                          <option value="접수">접수</option>
                          <option value="진행중">진행중</option>
                          <option value="진행완료">진행완료</option>
                        </select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* 히스토리 추가 다이얼로그 */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>히스토리 추가</DialogTitle>
            <DialogDescription>
              새로운 코칭 히스토리를 추가합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">제목</label>
              <Input
                value={newHistoryTitle}
                onChange={(e) => setNewHistoryTitle(e.target.value)}
                placeholder="히스토리 제목을 입력하세요"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">상태</label>
              <Select value={newHistoryStatus} onValueChange={(value: any) => setNewHistoryStatus(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="접수">접수</SelectItem>
                  <SelectItem value="진행중">진행중</SelectItem>
                  <SelectItem value="진행완료">진행완료</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">내용</label>
              <textarea
                value={newHistoryContent}
                onChange={(e) => setNewHistoryContent(e.target.value)}
                placeholder="히스토리 내용을 입력하세요"
                className="mt-1 w-full h-32 p-3 border border-gray-300 rounded-md resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowHistoryDialog(false)}>
              취소
            </Button>
            <Button onClick={handleSaveHistory}>
              저장
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpertPage;
