
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Users, BookOpen, ShoppingBag, LogOut, BarChart3, UserCheck, MessageSquare, GraduationCap, Brain, Calculator, CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import MemberManagement from "@/components/admin/MemberManagement";
import EducationManagement from "@/components/admin/EducationManagement";
import ProductManagement from "@/components/admin/ProductManagement";
import CommunityManagement from "@/components/admin/CommunityManagement";
import ExpertManagement from "@/components/admin/ExpertManagement";
import CoachingManagement from "@/components/admin/CoachingManagement";
import { AdminDashboardService, DashboardStats, ChartDataPoint } from "@/lib/adminDashboardService";

// 하드코딩된 데이터 제거 - 이제 실제 DB 데이터를 사용합니다

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
  }>(() => {
    const today = new Date();
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);
    return {
      from: sixMonthsAgo,
      to: today
    };
  });

  // 대시보드 데이터 상태
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 대시보드 데이터 로드
  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [stats, monthlyData, dailyData] = await Promise.all([
        AdminDashboardService.getDashboardStats(),
        AdminDashboardService.getMonthlyChartData(dateRange.from, dateRange.to),
        AdminDashboardService.getDailyChartData(dateRange.from, dateRange.to)
      ]);
      
      setDashboardStats(stats);
      setChartData(chartPeriod === 'monthly' ? monthlyData : dailyData);
    } catch (err) {
      console.error('대시보드 데이터 로드 실패:', err);
      setError('대시보드 데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) {
      navigate("/admin/login");
      return;
    }
    
    // 대시보드 데이터 로드
    loadDashboardData();
  }, [navigate]);

  // 차트 기간 또는 날짜 범위 변경 시 데이터 다시 로드
  useEffect(() => {
    if (dashboardStats) {
      loadChartData();
    }
  }, [chartPeriod, dateRange]);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin/login");
  };

  const loadChartData = async () => {
    try {
      const newChartData = chartPeriod === 'monthly' 
        ? await AdminDashboardService.getMonthlyChartData(dateRange.from, dateRange.to)
        : await AdminDashboardService.getDailyChartData(dateRange.from, dateRange.to);
      setChartData(newChartData);
    } catch (err) {
      console.error('차트 데이터 로드 실패:', err);
    }
  };

  const handleCardClick = (cardType: string) => {
    setSelectedChart(cardType);
  };

  const getChartData = () => {
    return chartData;
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
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">대시보드 데이터를 불러오는 중...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Button onClick={loadDashboardData} variant="outline">
                    다시 시도
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick('회원수')}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">총 회원수</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardStats?.totalMembers.toLocaleString() || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {dashboardStats?.memberGrowthRate >= 0 ? '+' : ''}{dashboardStats?.memberGrowthRate || 0}% from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick('전문가')}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">등록 전문가</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardStats?.totalExperts.toLocaleString() || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {dashboardStats?.expertGrowthRate >= 0 ? '+' : ''}{dashboardStats?.expertGrowthRate || 0}% from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick('MBTI진단')}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">MBTI 진단</CardTitle>
                    <Brain className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardStats?.totalMbtiDiagnoses.toLocaleString() || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {dashboardStats?.mbtiGrowthRate >= 0 ? '+' : ''}{dashboardStats?.mbtiGrowthRate || 0}% from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick('재무진단')}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">재무 진단</CardTitle>
                    <Calculator className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardStats?.totalFinanceDiagnoses.toLocaleString() || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {dashboardStats?.financeGrowthRate >= 0 ? '+' : ''}{dashboardStats?.financeGrowthRate || 0}% from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick('코칭신청')}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">코칭 신청</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardStats?.totalCoachingApplications.toLocaleString() || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {dashboardStats?.coachingGrowthRate >= 0 ? '+' : ''}{dashboardStats?.coachingGrowthRate || 0}% from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCardClick('교육신청')}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">교육 신청</CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {dashboardStats?.totalEducationApplications.toLocaleString() || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {dashboardStats?.educationGrowthRate >= 0 ? '+' : ''}{dashboardStats?.educationGrowthRate || 0}% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

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
                      disabled={isLoading}
                    >
                      월별
                    </Button>
                    <Button
                      size="sm"
                      variant={chartPeriod === 'daily' ? 'default' : 'outline'}
                      onClick={() => setChartPeriod('daily')}
                      disabled={isLoading}
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
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">차트 데이터 로딩 중...</p>
                      </div>
                    </div>
                  ) : (
                    <ChartComponent 
                      chartData={getChartData()} 
                      selectedChart={selectedChart} 
                      getLineColor={getLineColor} 
                    />
                  )}
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
