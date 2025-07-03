import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Home, TrendingUp, Users, PiggyBank, CreditCard, Shield, Briefcase, Calendar, Award, Building, GraduationCap, Youtube, ExternalLink, Play, Coins, Landmark, Target, Banknote, DollarSign, LineChart, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useExperts, type Expert } from "@/hooks/useExperts";
import { supabase } from "@/lib/supabase";

const CoachingPage = () => {
  const navigate = useNavigate();
  const { experts: allExperts, loading, error } = useExperts();
  
  // 전문가를 카테고리별로 분류
  const [coachingData, setCoachingData] = useState<{
    realestate: Expert[];
    tax: Expert[];
    finance: Expert[];
    business: Expert[];
    retirement: Expert[];
  }>({
    realestate: [],
    tax: [],
    finance: [],
    business: [],
    retirement: []
  });

  useEffect(() => {
    if (allExperts.length > 0) {
      const categorizedExperts = {
        realestate: allExperts.filter(expert => expert.expert_type === '부동산'),
        tax: allExperts.filter(expert => expert.expert_type === '세무'),
        finance: allExperts.filter(expert => expert.expert_type === '금융'),
        business: allExperts.filter(expert => expert.expert_type === '사업'),
        retirement: allExperts.filter(expert => expert.expert_type === '은퇴설계')
      };
      setCoachingData(categorizedExperts);
    }
  }, [allExperts]);

  // 하드코딩된 더미 데이터 (실제 데이터가 없을 때 사용)
  const dummyCoachingData = {
    realestate: [
      {
        id: "1",
        user_id: "expert1",
        expert_name: "김부동 대표",
        expert_type: "부동산",
        introduction: "강남권 아파트 투자부터 지방 수익형 부동산까지, 다양한 부동산 투자 노하우를 보유하고 있습니다. 시장 분석과 입지 선정, 자금 조달 방법까지 종합적인 부동산 투자 전략을 코칭해드립니다.",
        profile_image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        experience_years: 15,
        hourly_rate: 100000,
        certifications: ["공인중개사", "부동산투자상담사"],
        contact_email: "kim@expert.com",
        contact_phone: "010-1234-5678",
        is_active: true,
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "2",
        user_id: "expert2",
        expert_name: "박상가 실장",
        expert_type: "부동산",
        introduction: "상가 투자의 A부터 Z까지 모든 것을 알려드립니다. 상권 분석, 임차인 선별, 계약서 작성 노하우부터 세무 처리까지 상가 투자 성공을 위한 실전 경험을 공유합니다.",
        profile_image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        experience_years: 10,
        hourly_rate: 120000,
        certifications: ["공인중개사", "감정평가사"],
        contact_email: "park@expert.com",
        contact_phone: "010-2345-6789",
        is_active: true,
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    tax: [
      {
        id: "3",
        user_id: "expert3",
        expert_name: "최세무 세무사",
        expert_type: "세무",
        introduction: "복잡한 세법을 쉽게 풀어서 설명하고, 개인별 맞춤 절세 전략을 제시합니다. 상속·증여세 최적화부터 부동산 취득·양도소득세 절세까지 모든 세무 문제를 해결해드립니다.",
        profile_image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
        experience_years: 20,
        hourly_rate: 150000,
        certifications: ["세무사", "공인회계사"],
        contact_email: "choi@expert.com",
        contact_phone: "010-3456-7890",
        is_active: true,
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    finance: [
      {
        id: "4",
        user_id: "expert4",
        expert_name: "강레버 대표",
        expert_type: "금융",
        introduction: "적정 레버리지를 활용한 자산 증식 전략을 코칭합니다. 은행별 대출 상품 비교부터 금리 협상, 담보 설정까지 금융 레버리지 활용의 모든 노하우를 제공합니다.",
        profile_image_url: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=150&h=150&fit=crop&crop=face",
        experience_years: 12,
        hourly_rate: 130000,
        certifications: ["금융투자분석사", "신용분석사"],
        contact_email: "kang@expert.com",
        contact_phone: "010-4567-8901",
        is_active: true,
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    business: [
      {
        id: "5",
        user_id: "expert5",
        expert_name: "사업자 김사장",
        expert_type: "사업",
        introduction: "창업부터 사업 확장까지 모든 단계의 사업 운영 노하우를 보유하고 있습니다. 사업 아이템 발굴, 사업계획서 작성, 자금 조달, 정부지원사업 활용법까지 종합적인 창업 솔루션을 제공합니다.",
        profile_image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        experience_years: 18,
        hourly_rate: 140000,
        certifications: ["창업지도사", "중소기업진흥공단 창업컨설턴트"],
        contact_email: "kim.biz@expert.com",
        contact_phone: "010-5678-9012",
        is_active: true,
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    retirement: [
      {
        id: "6",
        user_id: "expert6",
        expert_name: "연금박사 박교수",
        expert_type: "은퇴설계",
        introduction: "체계적인 은퇴 설계와 연금 상품 선택 노하우를 제공합니다. 국민연금, 퇴직연금, 개인연금의 최적 조합과 노후 자금 마련을 위한 단계별 투자 전략을 코칭해드립니다.",
        profile_image_url: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&h=150&fit=crop&crop=face",
        experience_years: 25,
        hourly_rate: 160000,
        certifications: ["은퇴설계전문가", "연금상품전문가"],
        contact_email: "park.pension@expert.com",
        contact_phone: "010-6789-0123",
        is_active: true,
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  };

  // 실제 데이터가 없으면 더미 데이터 사용
  const displayData = loading || error ? dummyCoachingData : 
    (Object.values(coachingData).some(arr => arr.length > 0) ? coachingData : dummyCoachingData);

  const handleCoachingApplication = (expert: Expert) => {
    navigate('/coaching/apply', { 
      state: { 
        expertName: expert.expert_name, 
        expertCompany: expert.expert_type,
        expertId: expert.user_id,
        hourlyRate: expert.hourly_rate 
      } 
    });
  };

  const TabContent = ({ category, experts }: { category: string, experts: Expert[] }) => (
    <div className="space-y-6">
      {experts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">해당 분야의 전문가가 준비 중입니다.</p>
        </div>
      ) : (
        experts.map((expert) => (
          <Card key={expert.id} className="hover:shadow-lg transition-shadow duration-300 border-2 border-gray-100 hover:border-blue-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={expert.profile_image_url} alt={expert.expert_name} />
                    <AvatarFallback>{expert.expert_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{expert.expert_name}</CardTitle>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            전문가 상세보기
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-3">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={expert.profile_image_url} alt={expert.expert_name} />
                                <AvatarFallback>{expert.expert_name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="text-xl font-bold">{expert.expert_name}</h3>
                                <p className="text-gray-600">{expert.expert_type} 전문가</p>
                              </div>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="mt-6 space-y-6">
                            <div>
                              <h4 className="font-semibold mb-2">전문가 소개</h4>
                              <p className="text-gray-700">{expert.introduction}</p>
                            </div>
                            
                            {expert.certifications && expert.certifications.length > 0 && (
                              <div>
                                <h4 className="font-semibold mb-2">보유 자격증</h4>
                                <div className="flex flex-wrap gap-2">
                                  {expert.certifications.map((cert, index) => (
                                    <Badge key={index} variant="secondary">
                                      {cert}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {expert.education && (
                              <div>
                                <h4 className="font-semibold mb-2">학력</h4>
                                <p className="text-gray-700">{expert.education}</p>
                              </div>
                            )}
                            
                            <div className="flex justify-between items-center pt-4 border-t">
                              <div>
                                <p className="text-sm text-gray-600">경력: {expert.experience_years || 0}년</p>
                                {expert.hourly_rate && (
                                  <p className="text-lg font-semibold text-blue-600">
                                    {expert.hourly_rate.toLocaleString()}원/시간
                                  </p>
                                )}
                              </div>
                              <Button onClick={() => handleCoachingApplication(expert)}>
                                {expert.expert_name} 전문가에게 코칭 신청하기
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <CardDescription className="text-sm text-gray-600 mb-2">
                      {expert.expert_type}투자연구소
                    </CardDescription>
                  </div>
                  <div className="text-3xl">🏢</div>
                </div>
                <Button 
                  onClick={() => handleCoachingApplication(expert)} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                >
                  코칭신청
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {expert.experience_years || 15}년 {expert.expert_type} 투자 경력
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {expert.expert_type === '부동산' ? '아파트 부자 전문' : `${expert.expert_type} 전문`}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    수익률 평균 20% 달성
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {expert.introduction}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.youtube.com/@ntstax" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      <Youtube className="w-3 h-3" />
                      <span className="text-xs">운영 유튜브</span>
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.youtube.com/watch?v=L0GGqwJdfwA" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      <span className="text-xs">소개영상</span>
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.mk.co.kr/news/business/10894163" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      <span className="text-xs">신문기사</span>
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-6 py-20">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-lg text-gray-600">전문가 정보를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-6 py-20">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-lg text-red-600 mb-4">{error}</p>
              <p className="text-gray-600">더미 데이터로 진행합니다.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categories = [
    { 
      id: "realestate", 
      name: "부동산", 
      icon: <Building className="w-5 h-5" />,
      gradient: "from-blue-500 to-indigo-600"
    },
    { 
      id: "tax", 
      name: "세무절세", 
      icon: <Target className="w-5 h-5" />,
      gradient: "from-green-500 to-emerald-600"
    },
    { 
      id: "finance", 
      name: "금융레버리지", 
      icon: <LineChart className="w-5 h-5" />,
      gradient: "from-purple-500 to-violet-600"
    },
    { 
      id: "business", 
      name: "사업", 
      icon: <Briefcase className="w-5 h-5" />,
      gradient: "from-orange-500 to-red-600"
    },
    { 
      id: "retirement", 
      name: "은퇴설계", 
      icon: <Shield className="w-5 h-5" />,
      gradient: "from-teal-500 to-cyan-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            전문가 1:1 맞춤 코칭
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            각 분야의 전문가들과 직접 만나 개인별 맞춤 전략을 수립하세요. 
            체계적인 분석과 실전 노하우로 당신의 목표 달성을 도와드립니다.
          </p>
        </div>

        <Tabs defaultValue="realestate" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-white border border-gray-200 rounded-xl p-1 shadow-sm h-16">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center justify-center gap-2 px-4 py-4 text-lg font-bold text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-gray-50 rounded-lg h-14"
              >
                {category.icon}
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(displayData).map(([category, experts]) => (
            <TabsContent key={category} value={category} className="mt-6">
              <TabContent category={category} experts={experts} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default CoachingPage;
