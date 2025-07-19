import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MembersLoginDialog from "@/components/MembersLoginDialog";
import SignupDialog from "@/components/SignupDialog";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const { user, loading, login, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // 로그인 성공 처리
  const handleLoginSuccess = (loggedInUser: any) => {
    login(loggedInUser);
    setIsLoginOpen(false);
    toast({
      title: "✅ 로그인 성공!",
      description: `${loggedInUser.name || loggedInUser.email?.split('@')[0] || '사용자'}님 환영합니다!`,
    });
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    await logout();
    toast({
      title: "로그아웃 완료",
      description: "안전하게 로그아웃되었습니다.",
    });
  };

  // 사용자 이름 가져오기 (members 테이블 구조 지원)
  const getUserDisplayName = () => {
    if (!user) return "";
    
    // members 테이블 구조: { name, email, user_id }
    if (user.name) return user.name;
    
    // Supabase Auth 구조: { user_metadata: { name }, email }
    if (user.user_metadata?.name) return user.user_metadata.name;
    
    // 이메일에서 이름 추출
    if (user.email) return user.email.split('@')[0];
    
    return "사용자";
  };

  return (
    <>
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* 로고 및 브랜드명 */}
            <Link to="/" className="flex items-center space-x-2 min-w-0 flex-shrink-0">
              <a href="/" tabIndex={0} aria-label="홈으로 이동" onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') window.location.href = '/'; }}>
                <img
                  src="/richway_logo_back_x.png"
                  alt="Rich Way 로고"
                  className="h-12 sm:h-16 lg:h-20 w-auto"
                />
              </a>
              <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-slate-900 hidden sm:block">부자되는 플랫폼</h1>
            </Link>

            {/* Desktop Navigation - lg 이상에서만 표시 */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <Link to="/diagnosis" className="text-slate-600 hover:text-blue-600 transition-colors text-sm xl:text-base whitespace-nowrap">
                부자진단
              </Link>
              <Link to="/coaching" className="text-slate-600 hover:text-blue-600 transition-colors text-sm xl:text-base whitespace-nowrap">
                부자코칭
              </Link>
              <Link to="/education" className="text-slate-600 hover:text-blue-600 transition-colors text-sm xl:text-base whitespace-nowrap">
                부자교육
              </Link>
              <Link to="/products" className="text-slate-600 hover:text-blue-600 transition-colors text-sm xl:text-base whitespace-nowrap">
                부자상품
              </Link>
              <Link to="/playground" className="text-slate-600 hover:text-blue-600 transition-colors text-sm xl:text-base whitespace-nowrap">
                부자놀이터
              </Link>
              <Link to="/mypage" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1 text-sm xl:text-base whitespace-nowrap">
                <User size={16} />
                <span className="hidden xl:inline">마이페이지</span>
                <span className="xl:hidden">마이페이지</span>
              </Link>
            </nav>

            {/* 인증 상태에 따른 오른쪽 메뉴 */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              {loading ? (
                <div className="text-slate-600 text-sm">로딩중...</div>
              ) : user ? (
                // 로그인된 상태
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.user_metadata?.avatar_url} alt={getUserDisplayName()} />
                          <AvatarFallback>{getUserDisplayName().charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">{getUserDisplayName()}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/mypage" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          <span>마이페이지</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/mypage" className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>설정</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>로그아웃</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                // 비로그인 상태
                <>
                  <span
                    className="cursor-pointer text-slate-600 hover:text-blue-600 transition-colors text-sm lg:text-base whitespace-nowrap"
                    onClick={() => setIsLoginOpen(true)}
                  >
                    로그인
                  </span>
                  <span
                    className="cursor-pointer text-slate-600 hover:text-blue-600 transition-colors text-sm lg:text-base whitespace-nowrap"
                    onClick={() => setIsSignupOpen(true)}
                  >
                    회원가입
                  </span>
                </>
              )}
              <Link to="/diagnosis">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm whitespace-nowrap">
                  <span className="hidden sm:inline">무료 진단 시작</span>
                  <span className="sm:hidden">진단 시작</span>
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="메뉴 열기"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-slate-200">
              <nav className="flex flex-col space-y-4 mt-4">
                <Link to="/diagnosis" className="text-slate-600 hover:text-blue-600 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                  부자진단
                </Link>
                <Link to="/coaching" className="text-slate-600 hover:text-blue-600 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                  부자코칭
                </Link>
                <Link to="/education" className="text-slate-600 hover:text-blue-600 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                  부자교육
                </Link>
                <Link to="/products" className="text-slate-600 hover:text-blue-600 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                  부자상품
                </Link>
                <Link to="/playground" className="text-slate-600 hover:text-blue-600 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                  부자놀이터
                </Link>
                <Link to="/mypage" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1 py-2" onClick={() => setIsMenuOpen(false)}>
                  <User size={16} />
                  마이페이지
                </Link>
                <div className="flex flex-col space-y-2 pt-4">
                  {loading ? (
                    <div className="text-slate-600">로딩중...</div>
                  ) : user ? (
                    // 로그인된 상태 (모바일)
                    <>
                      <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.user_metadata?.avatar_url} alt={getUserDisplayName()} />
                          <AvatarFallback>{getUserDisplayName().charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{getUserDisplayName()}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                      <Link
                        to="/mypage"
                        className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2 py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings size={16} />
                        설정
                      </Link>
                      <span
                        className="cursor-pointer text-slate-600 hover:text-red-600 transition-colors flex items-center gap-2 py-2"
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                      >
                        <LogOut size={16} />
                        로그아웃
                      </span>
                    </>
                  ) : (
                    // 비로그인 상태 (모바일)
                    <>
                      <span
                        className="cursor-pointer text-slate-600 hover:text-blue-600 transition-colors py-2"
                        onClick={() => {
                          setIsLoginOpen(true);
                          setIsMenuOpen(false);
                        }}
                      >
                        로그인
                      </span>
                      <span
                        className="cursor-pointer text-slate-600 hover:text-blue-600 transition-colors py-2"
                        onClick={() => {
                          setIsSignupOpen(true);
                          setIsMenuOpen(false);
                        }}
                      >
                        회원가입
                      </span>
                    </>
                  )}
                  <Link to="/diagnosis">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 w-full mt-4" onClick={() => setIsMenuOpen(false)}>
                      무료 진단 시작
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* 로그인/회원가입 다이얼로그 */}
      <MembersLoginDialog 
        open={isLoginOpen} 
        onOpenChange={setIsLoginOpen}
        onLoginSuccess={handleLoginSuccess}
      />
      <SignupDialog open={isSignupOpen} onOpenChange={setIsSignupOpen} />
    </>
  );
};

export default Header;
