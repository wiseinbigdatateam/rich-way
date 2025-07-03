import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Eye, LogOut, User, History, ArrowUpDown, Download, FileText, CheckCircle, Clock, DollarSign } from "lucide-react";

interface ConsultationHistory {
  id: number;
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
  history: ConsultationHistory[];
}

type SortField = "id" | "date" | "applicant" | "applicationCount" | "priceType" | "field" | "status";
type SortOrder = "asc" | "desc";

const ExpertPage = () => {
  const navigate = useNavigate();
  const [expertInfo, setExpertInfo] = useState<any>(null);
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [newNotifications, setNewNotifications] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("전체");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  useEffect(() => {
    // 전문가 인증 확인
    const isAuthenticated = localStorage.getItem("expertAuth");
    if (!isAuthenticated) {
      navigate("/expert/login");
      return;
    }

    const expertData = localStorage.getItem("expertInfo");
    if (expertData) {
      setExpertInfo(JSON.parse(expertData));
    }

    // Enhanced mock consultation data with new fields
    const mockConsultations: ConsultationRequest[] = [
      {
        id: 1,
        date: "2024-12-18",
        applicant: "홍길동",
        name: "홍길동",
        phone: "010-1234-5678",
        email: "hong@example.com",
        consultationTitle: "부동산 투자 시작하기",
        consultationContent: "서울 지역 아파트 투자에 대한 전반적인 상담을 원합니다. 투자 금액은 5억 정도를 생각하고 있으며, 안정적인 수익을 기대합니다.",
        consultationMethod: "화상",
        field: "부동산 투자",
        experience: "부동산 투자 경험이 전혀 없는 초보자입니다.",
        goals: "서울에 내 집 마련이 목표이며, 추후 투자도 고려하고 있습니다.",
        expectations: "실무 경험이 풍부한 전문가로부터 실질적인 조언을 얻고 싶습니다.",
        attachmentFile: "부동산_관심지역.pdf",
        status: "접수",
        applicationCount: 1,
        priceType: "무료",
        history: []
      },
      {
        id: 2,
        date: "2024-12-17",
        applicant: "김영희",
        name: "김영희",
        phone: "010-2345-6789",
        email: "kim@example.com",
        consultationTitle: "개인사업자 세무 최적화",
        consultationContent: "프리랜서에서 개인사업자로 전환하면서 세무 관리가 복잡해졌습니다. 효율적인 절세 방안을 찾고 싶습니다.",
        consultationMethod: "전화",
        field: "세무/절세",
        experience: "개인사업자로 3년차이며, 세무 관리에 어려움을 겪고 있습니다.",
        goals: "효율적인 세무 관리와 절세 방안을 찾고 싶습니다.",
        expectations: "실무적인 절세 팁과 체계적인 세무 관리 방법을 배우고 싶습니다.",
        status: "진행중",
        applicationCount: 2,
        priceType: "디럭스",
        history: [
          {
            id: 1,
            date: "2024-11-15",
            title: "세무 기초 상담",
            content: "개인사업자 세무 신고 방법에 대한 기본 상담",
            status: "진행완료"
          }
        ]
      },
      {
        id: 3,
        date: "2024-12-16",
        applicant: "박민수",
        name: "박민수",
        phone: "010-3456-7890",
        email: "park@example.com",
        consultationTitle: "노후 자금 마련 전략",
        consultationContent: "40대 중반으로 본격적인 노후 준비를 시작하고 싶습니다. 현재 자산 상황을 점검하고 체계적인 계획을 세우고 싶습니다.",
        consultationMethod: "방문",
        field: "자산관리/재무설계",
        experience: "직장인 5년차로 자산 관리를 체계적으로 시작하고 싶습니다.",
        goals: "은퇴 후 안정적인 노후 자금 마련이 목표입니다.",
        expectations: "개인 상황에 맞는 맞춤형 재무 설계를 받고 싶습니다.",
        attachmentFile: "현재자산현황.xlsx",
        status: "진행완료",
        applicationCount: 3,
        priceType: "프리미엄",
        history: [
          {
            id: 1,
            date: "2024-10-20",
            title: "재무 진단 상담",
            content: "현재 자산 상황 분석 및 기본 재무 계획 수립",
            status: "진행완료"
          },
          {
            id: 2,
            date: "2024-11-25",
            title: "투자 포트폴리오 구성",
            content: "위험도별 투자 상품 추천 및 포트폴리오 구성 방안",
            status: "진행완료"
          }
        ]
      },
      {
        id: 4,
        date: "2024-12-15",
        applicant: "이수진",
        name: "이수진",
        phone: "010-4567-8901",
        email: "lee@example.com",
        consultationTitle: "상속세 절세 전략",
        consultationContent: "부모님 소유 부동산 상속 준비 과정에서 상속세 부담을 최소화할 수 있는 방안을 찾고 있습니다.",
        consultationMethod: "화상",
        field: "상속/증여 설계",
        experience: "부모님께서 부동산을 소유하고 계시며, 상속 준비가 필요합니다.",
        goals: "상속세 부담을 최소화하면서 원활한 상속을 진행하고 싶습니다.",
        expectations: "상속세 절세 방안과 증여 시기에 대한 조언을 받고 싶습니다.",
        status: "접수",
        applicationCount: 1,
        priceType: "프리미엄",
        history: []
      },
      {
        id: 5,
        date: "2024-12-14",
        applicant: "정하늘",
        name: "정하늘",
        phone: "010-5678-9012",
        email: "jung@example.com",
        consultationTitle: "최적 주택담보대출 상담",
        consultationContent: "신혼부부로 첫 주택 구매를 위한 대출 상담이 필요합니다. 다양한 대출 상품 비교와 최적 조건을 찾고 싶습니다.",
        consultationMethod: "전화",
        field: "대출 구조/실행",
        experience: "첫 주택 구매를 위해 대출을 알아보고 있습니다.",
        goals: "최적의 대출 조건으로 내집마련을 하고 싶습니다.",
        expectations: "대출 상품 비교와 최적 조건 선택에 대한 조언을 받고 싶습니다.",
        attachmentFile: "대출상품_비교표.pdf",
        status: "진행중",
        applicationCount: 2,
        priceType: "디럭스",
        history: [
          {
            id: 1,
            date: "2024-11-10",
            title: "주택담보대출 기초 상담",
            content: "주택담보대출 종류와 금리 비교 상담",
            status: "진행완료"
          }
        ]
      },
      {
        id: 6,
        date: "2024-12-13",
        applicant: "최강호",
        name: "최강호",
        phone: "010-6789-0123",
        email: "choi@example.com",
        consultationTitle: "보험 포트폴리오 재구성",
        consultationContent: "기존에 가입한 여러 보험을 점검하고 불필요한 중복을 제거하여 효율적인 보험 포트폴리오를 만들고 싶습니다.",
        consultationMethod: "메시지",
        field: "보험 리빌딩",
        experience: "여러 보험에 가입되어 있지만 중복이나 과다 가입이 걱정됩니다.",
        goals: "꼭 필요한 보장만 유지하며 보험료를 절약하고 싶습니다.",
        expectations: "기존 보험 점검과 최적화 방안을 제시받고 싶습니다.",
        status: "진행완료",
        applicationCount: 1,
        priceType: "무료",
        history: []
      },
      {
        id: 7,
        date: "2024-12-12",
        applicant: "강민지",
        name: "강민지",
        phone: "010-7890-1234",
        email: "kang@example.com",
        consultationTitle: "프리랜서 세무 전략",
        consultationContent: "프리랜서 활동이 늘어나면서 복잡해진 세무 관리를 체계적으로 정리하고 절세 전략을 수립하고 싶습니다.",
        consultationMethod: "화상",
        field: "사업자/프리랜서 세무",
        experience: "프리랜서로 활동 중이며 세무 관리가 복잡합니다.",
        goals: "체계적인 세무 관리와 절세 방안을 찾고 싶습니다.",
        expectations: "프리랜서에게 맞는 세무 전략과 절세 팁을 배우고 싶습니다.",
        attachmentFile: "프리랜서_소득내역.xlsx",
        status: "접수",
        applicationCount: 3,
        priceType: "프리미엄",
        history: [
          {
            id: 1,
            date: "2024-09-15",
            title: "프리랜서 세무 기초",
            content: "프리랜서 세무 신고 방법과 필요 서류 안내",
            status: "진행완료"
          },
          {
            id: 2,
            date: "2024-10-30",
            title: "부가세 신고 상담",
            content: "부가세 신고 절차와 절세 방안 상담",
            status: "진행완료"
          }
        ]
      },
      {
        id: 8,
        date: "2024-12-11",
        applicant: "윤태현",
        name: "윤태현",
        phone: "010-8901-2345",
        email: "yoon@example.com",
        consultationTitle: "개인연금 최적화",
        consultationContent: "현재 가입된 개인연금과 퇴직연금을 점검하고 더 나은 수익률을 위한 최적화 방안을 찾고 싶습니다.",
        consultationMethod: "방문",
        field: "노후/연금 준비",
        experience: "40대 중반으로 노후 준비를 본격적으로 시작하려고 합니다.",
        goals: "안정적인 노후 자금 마련과 연금 관리 방법을 알고 싶습니다.",
        expectations: "개인연금과 퇴직연금 최적화 방안을 제시받고 싶습니다.",
        status: "진행중",
        applicationCount: 1,
        priceType: "디럭스",
        history: []
      },
      {
        id: 9,
        date: "2024-12-10",
        applicant: "임소영",
        name: "임소영",
        phone: "010-9012-3456",
        email: "lim@example.com",
        consultationTitle: "소액 부동산 투자 가이드",
        consultationContent: "적은 자본으로 시작할 수 있는 안전한 부동산 투자 방법을 알고 싶습니다. 리스크 관리가 중요합니다.",
        consultationMethod: "전화",
        field: "부동산 투자",
        experience: "소액으로 부동산 투자를 시작하고 싶은 초보 투자자입니다.",
        goals: "안전하면서도 수익성 있는 부동산 투자를 하고 싶습니다.",
        expectations: "초보자에게 적합한 투자 전략과 위험 관리 방법을 배우고 싶습니다.",
        status: "진행완료",
        applicationCount: 2,
        priceType: "무료",
        history: [
          {
            id: 1,
            date: "2024-11-05",
            title: "부동산 투자 입문",
            content: "부동산 투자 기초 지식과 시장 분석 방법",
            status: "진행완료"
          }
        ]
      },
      {
        id: 10,
        date: "2024-12-09",
        applicant: "송준호",
        name: "송준호",
        phone: "010-0123-4567",
        email: "song@example.com",
        consultationTitle: "신혼부부 재무계획",
        consultationContent: "결혼 후 체계적인 재정 관리 방법과 내집마련, 자녀 교육비까지 고려한 장기 재무 계획을 세우고 싶습니다.",
        consultationMethod: "화상",
        field: "자산관리/재무설계",
        experience: "신혼부부로 체계적인 재정 관리를 시작하려고 합니다.",
        goals: "내집마련과 자녀 교육비 준비를 동시에 하고 싶습니다.",
        expectations: "신혼부부에게 맞는 단계별 재무 계획을 세우고 싶습니다.",
        attachmentFile: "가계부_3개월.xlsx",
        status: "접수",
        applicationCount: 1,
        priceType: "디럭스",
        history: []
      }
    ];

    setConsultations(mockConsultations);
  }, [navigate]);

  const handleStatusChange = (id: number, newStatus: "접수" | "진행중" | "진행완료") => {
    setConsultations(prev =>
      prev.map(consultation =>
        consultation.id === id
          ? { ...consultation, status: newStatus }
          : consultation
      )
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("expertAuth");
    localStorage.removeItem("expertInfo");
    navigate("/expert/login");
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
    
    // Calculate revenue based on completed consultations and price types
    const 내수익 = consultations
      .filter(c => c.status === "진행완료")
      .reduce((total, c) => {
        switch (c.priceType) {
          case "무료": return total + 0;
          case "디럭스": return total + 150000;
          case "프리미엄": return total + 300000;
          default: return total;
        }
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
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4" />
                </Button>
                {newNotifications > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 min-w-[20px] h-5 flex items-center justify-center">
                    {newNotifications}
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

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                  <DollarSign className="w-6 h-6 text-purple-600" />
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
                {filteredAndSortedConsultations.map((consultation) => (
                  <TableRow key={consultation.id}>
                    <TableCell className="font-medium">{consultation.id}</TableCell>
                    <TableCell>{consultation.date}</TableCell>
                    <TableCell>{consultation.applicant}</TableCell>
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
                          <Button variant="outline" size="sm" disabled={consultation.history.length === 0}>
                            <History className="w-4 h-4 mr-1" />
                            히스토리
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>코칭 히스토리</DialogTitle>
                            <DialogDescription>
                              {consultation.applicant}님의 이전 상담 내역입니다.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            {consultation.history.length > 0 ? (
                              consultation.history.map((historyItem) => (
                                <div key={historyItem.id} className="border rounded-lg p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold">{historyItem.title}</h4>
                                    <Badge className={getStatusColor(historyItem.status)}>
                                      {historyItem.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{historyItem.date}</p>
                                  <p className="text-sm bg-gray-50 p-3 rounded">{historyItem.content}</p>
                                </div>
                              ))
                            ) : (
                              <p className="text-center text-gray-500">이전 상담 내역이 없습니다.</p>
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
    </div>
  );
};

export default ExpertPage;
