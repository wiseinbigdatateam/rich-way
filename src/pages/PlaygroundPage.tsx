import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommunityWriteDialog from "@/components/CommunityWriteDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { MessageSquare, Heart, Eye, Search, PlusCircle, TrendingUp, Clock, User, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface CommunityPost {
  id: string;
  category: string;
  title: string;
  content: string;
  views: number;
  likes: number;
  answers_count: number;
  member_user_id: string;
  created_at: string;
  ishot: boolean;
}

const PlaygroundPage = () => {
  const [isWriteDialogOpen, setIsWriteDialogOpen] = useState(false);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<CommunityPost[]>([]);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  
  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 페이지당 표시할 게시글 수

  // 카테고리 목록
  const categories = ["전체", "투자정보", "부동산", "주식", "암호화폐", "창업", "질문답변", "성공사례", "자유게시판"];

  // 게시글 데이터 가져오기
  const fetchPosts = async () => {
    try {
      setLoading(true);

      // 실제 Supabase에서 데이터 가져오기
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('게시글 조회 오류:', error);
        toast({
          variant: "destructive",
          title: "데이터 로드 실패",
          description: "게시글을 불러오는데 실패했습니다.",
        });
        return;
      }

      setPosts(data || []);
    } catch (error) {
      console.error('게시글 조회 중 오류:', error);
      toast({
        variant: "destructive",
        title: "데이터 로드 실패",
        description: "게시글을 불러오는데 실패했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  // 게시글 필터링
  const filterPosts = () => {
    let filtered = posts;

    // 카테고리 필터링
    if (selectedCategory !== "전체") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // 검색어 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.member_user_id.toLowerCase().includes(query)
      );
    }

    setFilteredPosts(filtered);
    setCurrentPage(1); // 필터링 시 페이지 리셋
  };

  // 게시글 작성 성공 핸들러
  const handlePostSuccess = (newPost: any) => {
    setPosts(prev => [newPost, ...prev]);
    setIsWriteDialogOpen(false);
    toast({
      title: "성공",
      description: "게시글이 성공적으로 작성되었습니다.",
    });
  };

  // 글쓰기 버튼 클릭 핸들러
  const handleWriteClick = () => {
    if (!currentUser) {
      toast({
        title: "로그인 필요",
        description: "게시글을 작성하려면 로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }
    setIsWriteDialogOpen(true);
  };

  // 시간 포맷팅 함수
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}일 전`;
    return `${Math.floor(diffInSeconds / 2592000)}개월 전`;
  };

  // 카테고리 색상 함수
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "투자정보": "bg-blue-100 text-blue-800",
      "부동산": "bg-green-100 text-green-800",
      "주식": "bg-purple-100 text-purple-800",
      "암호화폐": "bg-orange-100 text-orange-800",
      "창업": "bg-red-100 text-red-800",
      "질문답변": "bg-yellow-100 text-yellow-800",
      "성공사례": "bg-emerald-100 text-emerald-800",
      "자유게시판": "bg-gray-100 text-gray-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  // 검색어 하이라이팅 함수
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  // 데이터 로드 및 필터링
  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  useEffect(() => {
    filterPosts();
  }, [posts, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">부자 놀이터</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            투자와 재테크 정보를 나누는 커뮤니티
          </p>
        </div>

        {/* 검색 및 글쓰기 영역 */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="제목, 내용, 작성자로 검색해보세요..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleWriteClick}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            글쓰기
          </Button>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* 검색 결과 정보 */}
        {(searchQuery || selectedCategory !== "전체") && !loading && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="text-blue-800">
                {searchQuery && selectedCategory !== "전체" ? (
                  <span>
                    <strong>"{searchQuery}"</strong> 검색 결과 in <strong>{selectedCategory}</strong>: 총 <strong>{filteredPosts.length}</strong>개
                  </span>
                ) : searchQuery ? (
                  <span>
                    <strong>"{searchQuery}"</strong> 검색 결과: 총 <strong>{filteredPosts.length}</strong>개
                  </span>
                ) : (
                  <span>
                    <strong>{selectedCategory}</strong> 카테고리: 총 <strong>{filteredPosts.length}</strong>개
                  </span>
                )}
              </div>
              {(searchQuery || selectedCategory !== "전체") && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("전체");
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  필터 초기화
                </Button>
              )}
            </div>
          </div>
        )}

        {/* 게시글 목록 */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">게시글을 불러오는 중...</span>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? `"${searchQuery}"에 대한 검색 결과가 없습니다.` : "게시글이 없습니다."}
            </div>
          ) : (
            <>
              {/* 페이징 계산 */}
              {(() => {
                const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const currentPosts = filteredPosts.slice(startIndex, endIndex);

                // 페이지 변경 핸들러
                const handlePageChange = (page: number) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                };

                return (
                  <>
                    <div className="space-y-4">
                      {currentPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Link to={`/playground/post/${post.id}`} className="block">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {post.ishot && (
                            <Badge className="bg-red-100 text-red-800">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              HOT
                            </Badge>
                          )}
                          <Badge className={getCategoryColor(post.category)}>
                            {post.category}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2 hover:text-blue-600 transition-colors">
                          {highlightSearchTerm(post.title, searchQuery)}
                        </h3>
                        <p className="text-slate-600 text-sm line-clamp-2 mb-3">
                          {highlightSearchTerm(post.content, searchQuery)}
                        </p>
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {post.member_user_id}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatTimeAgo(post.created_at)}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {post.views.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {post.likes}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {post.answers_count}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
                      ))}
                    </div>

                    {/* 페이징 */}
                    {totalPages > 1 && (
                      <div className="flex justify-center mt-8">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                              />
                            </PaginationItem>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => handlePageChange(page)}
                                  isActive={currentPage === page}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                            
                            <PaginationItem>
                              <PaginationNext 
                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </>
                );
              })()}
            </>
          )}
        </div>

        {/* 인기 글 사이드바 */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                인기 글
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {posts.filter(post => post.ishot).slice(0, 3).map((post, index) => (
                  <Link 
                    key={post.id} 
                    to={`/playground/post/${post.id}`}
                    className="block p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 text-sm line-clamp-2 mb-1">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{post.member_user_id}</span>
                          <span>•</span>
                          <span>👁 {post.views.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
      
      {/* 글쓰기 모달 */}
      <CommunityWriteDialog
        open={isWriteDialogOpen}
        onOpenChange={setIsWriteDialogOpen}
        onPostSuccess={handlePostSuccess}
        currentUser={currentUser}
      />
    </div>
  );
};

export default PlaygroundPage;
