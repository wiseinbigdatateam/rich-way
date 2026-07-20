import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MessageSquare, Heart, Eye, Edit, Trash2, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface CommunityPost {
  id: number;
  title: string;
  content: string;
  category: string;
  member_user_id: string;
  created_at: string;
  updated_at: string;
  views_count: number;
  likes_count: number;
  answers_count: number;
  ishot: boolean;
}

interface PostComment {
  id: number;
  post_id: number;
  content: string;
  created_at: string;
  likes: number;
  post_title: string;
  post_author: string;
}

const MyPosts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [myPosts, setMyPosts] = useState<CommunityPost[]>([]);
  const [myComments, setMyComments] = useState<PostComment[]>([]);

  // 카테고리 색상 매핑
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      '자유게시판': 'bg-gray-100 text-gray-800',
      '투자정보': 'bg-blue-100 text-blue-800',
      '부동산': 'bg-green-100 text-green-800',
      '주식': 'bg-red-100 text-red-800',
      '암호화폐': 'bg-yellow-100 text-yellow-800',
      '창업': 'bg-purple-100 text-purple-800',
      '질문답변': 'bg-orange-100 text-orange-800',
      '성공사례': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  // 시간 포맷팅
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}일 전`;
    
    return postDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // 내 게시글 로드
  const loadMyPosts = async () => {
    if (!user) return;

    try {
      if (!isSupabaseConfigured) {
        // Demo 모드: 샘플 데이터
        const demoPosts: CommunityPost[] = [
                     {
             id: 1,
             title: "부동산 투자 초보자를 위한 팁",
             content: "부동산 투자를 시작하려는 분들에게 도움이 될 만한 기본 지식을 공유합니다...",
             category: "부동산",
             member_user_id: user.user_id || user.id || 'demo-user',
             created_at: "2024-02-15T10:30:00Z",
             updated_at: "2024-02-15T10:30:00Z",
             views_count: 245,
             likes_count: 18,
             answers_count: 12,
             ishot: false
           },
           {
             id: 2,
             title: "올해 주식 투자 전략 정리",
             content: "2024년 주식 시장 전망과 함께 제가 준비한 투자 전략을 공유드립니다...",
             category: "주식",
             member_user_id: user.user_id || user.id || 'demo-user',
             created_at: "2024-02-10T14:20:00Z",
             updated_at: "2024-02-10T14:20:00Z",
             views_count: 189,
             likes_count: 25,
             answers_count: 8,
             ishot: true
           }
        ];
        setMyPosts(demoPosts);
      } else {
        // 실제 Supabase에서 내 게시글 조회
        const { data, error } = await (supabase as any)
          .from('community_posts')
          .select('*')
          .eq('member_user_id', user.user_id || user.id || 'demo-user')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('내 게시글 조회 오류:', error);
          toast({
            title: "오류",
            description: "게시글을 불러올 수 없습니다.",
            variant: "destructive"
          });
          return;
        }

        setMyPosts(data || []);
      }
    } catch (error) {
      console.error('게시글 로드 오류:', error);
    }
  };

  // 내 댓글 로드
  const loadMyComments = async () => {
    if (!user) return;

    try {
      if (!isSupabaseConfigured) {
        // Demo 모드: 샘플 댓글 데이터
        const demoComments: PostComment[] = [
          {
            id: 1,
            post_id: 1,
            content: "정말 유용한 정보네요! 특히 ESG 투자 부분이 인상적이었습니다.",
            created_at: "2024-02-14T16:30:00Z",
            likes: 5,
            post_title: "2024년 투자 트렌드 분석",
            post_author: "김투자"
          },
          {
            id: 2,
            post_id: 2,
            content: "비트코인 ETF 승인 이후 시장 변화가 정말 눈에 띄네요.",
            created_at: "2024-02-12T11:15:00Z",
            likes: 3,
            post_title: "암호화폐 시장 현황",
            post_author: "박코인"
          }
        ];
        setMyComments(demoComments);
      } else {
        // 실제 Supabase에서 내 댓글 조회 (게시글 제목과 함께)
        const { data, error } = await (supabase as any)
          .from('community_comments')
          .select(`
            id,
            post_id,
            content,
            created_at,
            likes,
            community_posts!inner(title, member_user_id)
          `)
          .eq('member_user_id', user.user_id || user.id || 'demo-user')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('내 댓글 조회 오류:', error);
          toast({
            title: "오류",
            description: "댓글을 불러올 수 없습니다.",
            variant: "destructive"
          });
          return;
        }

        // 데이터 변환
        const transformedComments = (data || []).map((comment: any) => ({
          id: comment.id,
          post_id: comment.post_id,
          content: comment.content,
          created_at: comment.created_at,
          likes: comment.likes,
          post_title: comment.community_posts.title,
          post_author: comment.community_posts.member_user_id
        }));

        setMyComments(transformedComments);
      }
    } catch (error) {
      console.error('댓글 로드 오류:', error);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([loadMyPosts(), loadMyComments()])
        .finally(() => setLoading(false));
    }
  }, [user]);

  // 게시글 삭제
  const handleDeletePost = async (postId: number) => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;

    try {
      if (!isSupabaseConfigured) {
        // Demo 모드: 로컬 상태에서 제거
        setMyPosts(prev => prev.filter(post => post.id !== postId));
        toast({
          title: "삭제 완료",
          description: "게시글이 삭제되었습니다. (Demo 모드)"
        });
      } else {
        // 실제 Supabase에서 삭제
        const { error } = await (supabase as any)
          .from('community_posts')
          .delete()
          .eq('id', postId)
          .eq('member_user_id', user?.user_id || user?.id || 'demo-user');

        if (error) {
          console.error('게시글 삭제 오류:', error);
          toast({
            title: "오류",
            description: "게시글 삭제에 실패했습니다.",
            variant: "destructive"
          });
          return;
        }

        // 로컬 상태 업데이트
        setMyPosts(prev => prev.filter(post => post.id !== postId));
        toast({
          title: "삭제 완료",
          description: "게시글이 성공적으로 삭제되었습니다."
        });
      }
    } catch (error) {
      console.error('게시글 삭제 오류:', error);
      toast({
        title: "오류",
        description: "게시글 삭제 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  // 게시글 클릭 시 상세 페이지로 이동
  const handlePostClick = (postId: number) => {
    navigate(`/playground/post/${postId}`);
  };

  // 댓글의 게시글로 이동
  const handleCommentPostClick = (postId: number) => {
    navigate(`/playground/post/${postId}`);
  };

  // 새 글 쓰기
  const handleNewPost = () => {
    navigate('/playground');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">내가 쓴 글 ({myPosts.length})</TabsTrigger>
          <TabsTrigger value="comments">내 댓글 ({myComments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>내가 쓴 글</span>
                <Button onClick={handleNewPost}>
                  <Plus size={16} className="mr-2" />
                  새 글 쓰기
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {myPosts.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">아직 작성한 게시글이 없습니다.</p>
                  <Button onClick={handleNewPost}>
                    <Plus size={16} className="mr-2" />
                    첫 번째 글 작성하기
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myPosts.map((post) => (
                    <div key={post.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 cursor-pointer" onClick={() => handlePostClick(post.id)}>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium hover:text-blue-600">{post.title}</h4>
                            <Badge className={getCategoryColor(post.category)}>
                              {post.category}
                            </Badge>
                            {post.ishot && (
                              <Badge className="bg-red-100 text-red-800">
                                HOT
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {post.content.length > 100 
                              ? `${post.content.substring(0, 100)}...` 
                              : post.content
                            }
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {formatTimeAgo(post.created_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye size={14} />
                              {post.views_count}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart size={14} />
                              {post.likes_count}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare size={14} />
                              {post.answers_count}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handlePostClick(post.id)}
                            title="수정"
                          >
                            <Edit size={14} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeletePost(post.id)}
                            title="삭제"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>내 댓글</CardTitle>
            </CardHeader>
            <CardContent>
              {myComments.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">작성한 댓글이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myComments.map((comment) => (
                    <div key={comment.id} className="p-4 border rounded-lg">
                      <div className="mb-2">
                        <h4 
                          className="font-medium text-blue-600 hover:underline cursor-pointer"
                          onClick={() => handleCommentPostClick(comment.post_id)}
                        >
                          {comment.post_title}
                        </h4>
                        <p className="text-sm text-gray-500">by {comment.post_author}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded mb-2">
                        <p className="text-sm">{comment.content}</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatTimeAgo(comment.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart size={14} />
                          {comment.likes}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyPosts;
