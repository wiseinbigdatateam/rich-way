
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import MyInfo from "@/components/mypage/MyInfo";
import MyDiagnosis from "@/components/mypage/MyDiagnosis";
import MyCoaching from "@/components/mypage/MyCoaching";
import MyEducation from "@/components/mypage/MyEducation";
import MyProducts from "@/components/mypage/MyProducts";
import MyPosts from "@/components/mypage/MyPosts";
import MembersLoginDialog from "@/components/MembersLoginDialog";
import { User, Activity, Users, BookOpen, ShoppingBag, MessageSquare, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // 디버깅용 로그
  console.log('🔍 MyPage 상태:', { user: !!user, loading, showLoginDialog });

  // 로그인 성공 처리
  const handleLoginSuccess = (userData: any) => {
    console.log('🎯 MyPage 로그인 성공 처리:', userData);
    login(userData);
    setShowLoginDialog(false);
    // 강제로 페이지 리렌더링을 위한 작은 지연
    setTimeout(() => {
      console.log('🔄 로그인 후 상태 확인:', { user: userData, loading: false });
    }, 100);
  };

  const tabs = [
    { id: "info", label: "내정보", icon: User, component: MyInfo },
    { id: "diagnosis", label: "진단", icon: Activity, component: MyDiagnosis },
    { id: "coaching", label: "코칭", icon: Users, component: MyCoaching },
    { id: "education", label: "교육", icon: BookOpen, component: MyEducation },
    { id: "products", label: "맞춤상품", icon: ShoppingBag, component: MyProducts },
    { id: "posts", label: "나의글", icon: MessageSquare, component: MyPosts },
  ];

  // 로딩 중 표시 (사용자 정보가 없고 로딩 중일 때만)
  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">로딩 중...</p>
            </div>
          </div>
        </div>
        
        {/* 로그인 모달 */}
        <MembersLoginDialog 
          open={showLoginDialog} 
          onOpenChange={setShowLoginDialog}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  // 로그인하지 않은 사용자 처리
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <Card className="w-full max-w-md text-center">
              <CardContent className="pt-6">
                <LogIn size={48} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold mb-2">로그인이 필요합니다</h2>
                <p className="text-gray-600 mb-6">
                  마이페이지를 이용하시려면 먼저 로그인해주세요.
                </p>
                <Button onClick={() => setShowLoginDialog(true)} className="w-full">
                  로그인하러 가기
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* 로그인 모달 */}
        <MembersLoginDialog 
          open={showLoginDialog} 
          onOpenChange={setShowLoginDialog}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">마이페이지</h1>
          <p className="text-slate-600">내 정보와 활동을 관리하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 사이드바 */}
          <Card className="lg:col-span-1">
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical">
                <TabsList className="flex flex-col h-auto w-full bg-transparent p-2">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="w-full justify-start gap-2 py-3 px-4 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
                      >
                        <IconComponent size={20} />
                        {tab.label}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {tabs.map((tab) => {
                const Component = tab.component;
                return (
                  <TabsContent key={tab.id} value={tab.id}>
                    <Component />
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* 로그인 모달 */}
      <MembersLoginDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default MyPage;
