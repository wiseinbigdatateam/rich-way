
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Users, BookOpen, ShoppingBag, LogOut, BarChart3, UserCheck, MessageSquare, GraduationCap, Brain, Calculator, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import MemberManagement from "@/components/admin/MemberManagement";
import EducationManagement from "@/components/admin/EducationManagement";
import ProductManagement from "@/components/admin/ProductManagement";
import CommunityManagement from "@/components/admin/CommunityManagement";
import ExpertManagement from "@/components/admin/ExpertManagement";
import CoachingManagement from "@/components/admin/CoachingManagement";

// Sample data for charts
const monthlyData = [
  { name: '1월', 회원수: 980, 전문가: 38, 'MBTI진단': 420, '재무진단': 380, 코칭신청: 67, 교육신청: 156 },
  { name: '2월', 회원수: 1020, 전문가: 40, 'MBTI진단': 450, '재무진단': 420, 코칭신청: 72, 교육신청: 178 },
  { name: '3월', 회원수: 1080, 전문가: 42, 'MBTI진단': 480, '재무진단': 460, 코칭신청: 78, 교육신청: 192 },
  { name: '4월', 회원수: 1150, 전문가: 43, 'MBTI진단': 520, '재무진단': 500, 코칭신청: 83, 교육신청: 205 },
  { name: '5월', 회원수: 1200, 전문가: 44, 'MBTI진단': 540, '재무진단': 520, 코칭신청: 86, 교육신청: 218 },
  { name: '6월', 회원수: 1234, 전문가: 45, 'MBTI진단': 567, '재무진단': 540, 코칭신청: 89, 교육신청: 234 }
];

const dailyData = [
  { name: '1일', 회원수: 15, 전문가: 0, 'MBTI진단': 8, '재무진단': 12, 코칭신청: 2, 교육신청: 5 },
  { name: '2일', 회원수: 12, 전문가: 1, 'MBTI진단': 6, '재무진단': 9, 코칭신청: 1, 교육신청: 4 },
  { name: '3일', 회원수: 18, 전문가: 0, 'MBTI진단': 10, '재무진단': 15, 코칭신청: 3, 교육신청: 7 },
  { name: '4일', 회원수: 22, 전문가: 0, 'MBTI진단': 12, '재무진단': 18, 코칭신청: 2, 교육신청: 6 },
  { name: '5일', 회원수: 19, 전문가: 1, 'MBTI진단': 9, '재무진단': 14, 코칭신청: 4, 교육신청: 8 },
  { name: '6일', 회원수: 25, 전문가: 0, 'MBTI진단': 15, '재무진단': 20, 코칭신청: 3, 교육신청: 9 },
  { name: '7일', 회원수: 16, 전문가: 0, 'MBTI진단': 7, '재무진단': 11, 코칭신청: 1, 교육신청: 3 }
];

// recharts를 동적으로 import하는 컴포넌트
const ChartComponent = ({ 
  chartData, 
  selectedChart, 
  getLineColor 
}: { 
  chartData: any[]; 
  selectedChart: string | null; 
  getLineColor: (cardType: string) => string; 
}) => {
  const [ChartComponents, setChartComponents] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChart = async () => {
      try {
        const recharts = await import('recharts');
        setChartComponents(recharts);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load recharts:', error);
        setLoading(false);
      }
    };
    loadChart();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">차트 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!ChartComponents) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-gray-600">차트를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <ChartComponents.ResponsiveContainer width="100%" height="100%">
      <ChartComponents.LineChart data={chartData}>
        <ChartComponents.CartesianGrid strokeDasharray="3 3" />
        <ChartComponents.XAxis dataKey="name" />
        <ChartComponents.YAxis />
        <ChartComponents.Tooltip />
        <ChartComponents.Legend />
        <ChartComponents.Line
          type="monotone"
          dataKey={selectedChart}
          stroke={getLineColor(selectedChart || '')}
          strokeWidth={2}
          dot={{ fill: getLineColor(selectedChart || '') }}
        />
      </ChartComponents.LineChart>
    </ChartComponents.ResponsiveContainer>
  );
};

const AdminPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedChart, setSelectedChart] = useState<string | null>("회원수");
  const [chartPeriod, setChartPeriod] = useState<'monthly' | 'daily'>('monthly');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 5, 30)
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin/login");
  };

  const handleCardClick = (cardType: string) => {
    setSelectedChart(cardType);
  };

  const getChartData = () => {
    return chartPeriod === 'monthly' ? monthlyData : dailyData;
  };

  const getLineColor = (cardType: string) => {
    const colors = {
      '회원수': '#8884d8',
      '전문가': '#82ca9d',
      'MBTI진단': '#ffc658',
      '재무진단': '#ff7300',
      '코칭신청': '#0088fe',
      '교육신청': '#00c49f'
    };
    return colors[cardType] || '#8884d8';
  };

  const handleDateRangeSelect = (field: 'from' | 'to', date: Date | undefined) => {
    setDateRange(prev => ({
      ...prev,
      [field]: date
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">리치웨이 관리자</h1>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            로그아웃
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              대시보드
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              회원관리
            </TabsTrigger>
            <TabsTrigger value="experts" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              전문가관리
            </TabsTrigger>
            <TabsTrigger value="coaching" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              코칭관리
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              교육관리
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              상품관리
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick('회원수')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">총 회원수</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick('전문가')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">등록 전문가</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick('MBTI진단')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">MBTI 진단</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">567</div>
                  <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick('재무진단')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">재무 진단</CardTitle>
                  <Calculator className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">423</div>
                  <p className="text-xs text-muted-foreground">+9% from last month</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick('코칭신청')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">코칭 신청</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">+5% from last month</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick('교육신청')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">교육 신청</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">234</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* 기본 차트 표시 영역 */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedChart} 추세 분석</CardTitle>
                  <div className="flex gap-2 items-center">
                    {/* 조회 기간 설정 */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">조회기간:</span>
                      
                      {/* 시작일 선택 */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              "justify-start text-left font-normal",
                              !dateRange.from && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "시작일"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateRange.from}
                            onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>

                      <span className="text-sm text-muted-foreground">~</span>

                      {/* 종료일 선택 */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              "justify-start text-left font-normal",
                              !dateRange.to && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "종료일"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateRange.to}
                            onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <Button
                      size="sm"
                      variant={chartPeriod === 'monthly' ? 'default' : 'outline'}
                      onClick={() => setChartPeriod('monthly')}
                    >
                      월별
                    </Button>
                    <Button
                      size="sm"
                      variant={chartPeriod === 'daily' ? 'default' : 'outline'}
                      onClick={() => setChartPeriod('daily')}
                    >
                      일별
                    </Button>
                    {selectedChart !== "회원수" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedChart("회원수")}
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartComponent 
                    chartData={getChartData()} 
                    selectedChart={selectedChart} 
                    getLineColor={getLineColor} 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members">
            <MemberManagement />
          </TabsContent>

          <TabsContent value="experts">
            <ExpertManagement />
          </TabsContent>

          <TabsContent value="coaching">
            <CoachingManagement />
          </TabsContent>

          <TabsContent value="education">
            <EducationManagement />
          </TabsContent>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
