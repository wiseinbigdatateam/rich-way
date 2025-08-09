
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageSquare, Eye, ArrowLeft, User, Clock, Reply, Loader2, MessageCircle, Send } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import MembersLoginDialog from "@/components/MembersLoginDialog";

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

interface CommunityComment {
  id: string;
  post_id: string;
  parent_comment_id: string | null;
  member_user_id: string;
  content: string;
  likes: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  replies?: CommunityComment[];
}

const PlaygroundPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentLikes, setCommentLikes] = useState<{[key: string]: boolean}>({});
  const [commentLikeLoading, setCommentLikeLoading] = useState<{[key: string]: boolean}>({});
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { toast } = useToast();
  const { user: currentUser, login } = useAuth();

  // 좋아요 상태 확인
  const checkLikeStatus = async () => {
    if (!id || !currentUser || !isSupabaseConfigured) return;

    try {
      const { data, error } = await supabase
        .from('community_post_likes')
        .select('id')
        .eq('post_id', id)
        .eq('member_user_id', currentUser.user_id)
        .single();

      if (!error && data) {
        setIsLiked(true);
      }
    } catch (error) {
      // 좋아요가 없는 경우는 정상
      setIsLiked(false);
    }
  };

  // 좋아요 토글
  const handleLikeToggle = async () => {
    if (!currentUser) {
      toast({
        title: "로그인 필요",
        description: "좋아요를 누르려면 로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    if (!post) return;

    try {
      setLikeLoading(true);

      if (isSupabaseConfigured) {
        if (isLiked) {
          // 좋아요 취소
          const { error } = await supabase
            .from('community_post_likes')
            .delete()
            .eq('post_id', post.id)
            .eq('member_user_id', currentUser.user_id);

          if (error) throw error;
          
          setIsLiked(false);
          setPost(prev => prev ? { ...prev, likes: prev.likes - 1 } : null);
        } else {
          // 좋아요 추가
          const { error } = await supabase
            .from('community_post_likes')
            .insert({
              post_id: post.id,
              member_user_id: currentUser.user_id
            });

          if (error) throw error;
          
          setIsLiked(true);
          setPost(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
        }
      } else {
        // Demo 모드
        setIsLiked(!isLiked);
        setPost(prev => prev ? { 
          ...prev, 
          likes: isLiked ? prev.likes - 1 : prev.likes + 1 
        } : null);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "오류",
        description: "좋아요 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setLikeLoading(false);
    }
  };

  // 게시글 데이터 가져오기
  const fetchPost = async () => {
    if (!id) return;
    
    try {
      setLoading(true);

      // 실제 Supabase에서 데이터 가져오기
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('게시글 조회 오류:', error);
        toast({
          variant: "destructive",
          title: "데이터 로드 실패",
          description: "게시글을 불러오는데 실패했습니다.",
        });
        return;
      }

      setPost(data);
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

  // 댓글 좋아요 토글
  const handleCommentLikeToggle = async (commentId: string, currentLikes: number) => {
    if (!currentUser) {
      toast({
        title: "로그인 필요",
        description: "좋아요를 누르려면 로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      setCommentLikeLoading(prev => ({ ...prev, [commentId]: true }));
      const isLiked = commentLikes[commentId];

      if (isSupabaseConfigured) {
        if (isLiked) {
          // 좋아요 취소
          const { error } = await supabase
            .from('community_comment_likes')
            .delete()
            .eq('comment_id', commentId)
            .eq('member_user_id', currentUser.user_id);

          if (error) throw error;
        } else {
          // 좋아요 추가
          const { error } = await supabase
            .from('community_comment_likes')
            .insert({
              comment_id: commentId,
              member_user_id: currentUser.user_id
            });

          if (error) throw error;
        }
      }

      // 상태 업데이트
      setCommentLikes(prev => ({ ...prev, [commentId]: !isLiked }));
      
      // 댓글 좋아요 수 업데이트
      setComments(prevComments => 
        prevComments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, likes: isLiked ? currentLikes - 1 : currentLikes + 1 };
          }
          // 대댓글도 확인
          if (comment.replies) {
            const updatedReplies = comment.replies.map(reply => 
              reply.id === commentId 
                ? { ...reply, likes: isLiked ? currentLikes - 1 : currentLikes + 1 }
                : reply
            );
            return { ...comment, replies: updatedReplies };
          }
          return comment;
        })
      );

    } catch (error) {
      console.error('Error toggling comment like:', error);
      toast({
        title: "오류",
        description: "댓글 좋아요 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setCommentLikeLoading(prev => ({ ...prev, [commentId]: false }));
    }
  };

  // 댓글 좋아요 상태 확인
  const checkCommentLikeStatus = async (commentIds: string[]) => {
    if (!currentUser || !isSupabaseConfigured || commentIds.length === 0) return;

    try {
      const { data, error } = await supabase
        .from('community_comment_likes')
        .select('comment_id')
        .in('comment_id', commentIds)
        .eq('member_user_id', currentUser.user_id);

      if (!error && data) {
        const likedComments: {[key: string]: boolean} = {};
        data.forEach(like => {
          likedComments[like.comment_id] = true;
        });
        setCommentLikes(likedComments);
      }
    } catch (error) {
      console.error('Error checking comment like status:', error);
    }
  };

  // 댓글 데이터 가져오기
  const fetchComments = async () => {
    if (!id) return;
    
    try {
      setCommentsLoading(true);

      // 실제 Supabase에서 댓글 데이터 가져오기
      const { data, error } = await supabase
        .from('community_comments')
        .select('*')
        .eq('post_id', id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('댓글 조회 오류:', error);
        toast({
          variant: "destructive",
          title: "댓글 로드 실패",
          description: "댓글을 불러오는 중 오류가 발생했습니다.",
        });
        return;
      }

      // 댓글과 대댓글을 계층 구조로 정리
      const commentsMap = new Map<string, CommunityComment>();
      const rootComments: CommunityComment[] = [];

      // 모든 댓글을 맵에 저장하고 replies 배열 초기화
      data?.forEach(comment => {
        commentsMap.set(comment.id, { ...comment, replies: [] });
      });

      // 계층 구조 생성
      data?.forEach(comment => {
        const commentWithReplies = commentsMap.get(comment.id)!;
        
        if (comment.parent_comment_id) {
          // 대댓글인 경우 부모 댓글의 replies에 추가
          const parentComment = commentsMap.get(comment.parent_comment_id);
          if (parentComment) {
            parentComment.replies!.push(commentWithReplies);
          }
        } else {
          // 최상위 댓글인 경우 rootComments에 추가
          rootComments.push(commentWithReplies);
        }
      });

      setComments(rootComments);
      console.log('🟢 실제 댓글 데이터 로드 완료:', rootComments.length, '개');

      // 댓글 좋아요 상태 확인
      const allCommentIds: string[] = [];
      data?.forEach(comment => {
        allCommentIds.push(comment.id);
      });
      if (allCommentIds.length > 0) {
        checkCommentLikeStatus(allCommentIds);
      }

    } catch (error) {
      console.error('댓글 조회 오류:', error);
      toast({
        variant: "destructive",
        title: "댓글 로드 실패",
        description: "댓글을 불러오는 중 오류가 발생했습니다.",
      });
    } finally {
      setCommentsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchPost();
    fetchComments();
    checkLikeStatus();
  }, [id, currentUser]);

  // 시간 포맷팅 함수
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}시간 전`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}일 전`;
    }
  };



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

  // 새로운 댓글 작성 함수
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      toast({
        variant: "destructive",
        title: "댓글 내용을 입력해주세요",
        description: "댓글 내용을 입력해주세요.",
      });
      return;
    }

    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "로그인이 필요합니다",
        description: "댓글을 작성하려면 로그인해주세요.",
      });
      return;
    }

    if (!post) return;

    try {
      setCommentSubmitting(true);

      // 실제 Supabase 모드 - 직접 Supabase 클라이언트 사용
      const { error } = await supabase
        .from('community_comments')
        .insert({
          post_id: post.id,
          member_user_id: currentUser.user_id || currentUser.id,
          content: newComment.trim(),
          parent_comment_id: null
        });

      if (error) {
        console.error('댓글 작성 Supabase 오류:', error);
        throw new Error('댓글 작성에 실패했습니다');
      }

      // 댓글 목록 새로고침
      await fetchComments();
      setNewComment("");
      
      toast({
        title: "댓글 작성 완료!",
        description: "댓글이 성공적으로 작성되었습니다.",
      });

    } catch (error) {
      console.error('댓글 작성 오류:', error);
      toast({
        variant: "destructive",
        title: "댓글 작성 실패",
        description: "댓글 작성 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setCommentSubmitting(false);
    }
  };

  // 새로운 대댓글 작성 함수
  const handleReplySubmit = async (commentId: string) => {
    if (!replyText.trim()) {
      toast({
        variant: "destructive",
        title: "대댓글 내용을 입력해주세요",
        description: "대댓글 내용을 입력해주세요.",
      });
      return;
    }

    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "로그인이 필요합니다",
        description: "대댓글을 작성하려면 로그인해주세요.",
      });
      return;
    }

    if (!post) return;

    try {
      // 실제 Supabase 모드 - 직접 Supabase 클라이언트 사용
      const { error } = await supabase
        .from('community_comments')
        .insert({
          post_id: post.id,
          parent_comment_id: commentId,
          member_user_id: currentUser.user_id || currentUser.id,
          content: replyText.trim()
        });

      if (error) {
        console.error('대댓글 작성 Supabase 오류:', error);
        throw new Error('대댓글 작성에 실패했습니다');
      }

      // 댓글 목록 새로고침
      await fetchComments();
      setReplyText("");
      setReplyingTo(null);
      
      toast({
        title: "대댓글 작성 완료!",
        description: "대댓글이 성공적으로 작성되었습니다.",
      });

    } catch (error) {
      console.error('대댓글 작성 오류:', error);
      toast({
        variant: "destructive",
        title: "대댓글 작성 실패",
        description: "대댓글 작성 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-6 py-12">
        {/* 뒤로가기 버튼 */}
        <Link to="/playground" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="w-4 h-4" />
          목록으로 돌아가기
        </Link>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">게시글을 불러오는 중...</span>
          </div>
        ) : !post ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">게시글을 찾을 수 없습니다</h2>
            <p className="text-slate-600 mb-6">요청한 게시글이 존재하지 않거나 삭제되었습니다.</p>
            <Link to="/playground" className="text-blue-600 hover:text-blue-800">
              목록으로 돌아가기
            </Link>
          </div>
        ) : (
          <>
            {/* 게시글 내용 */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getCategoryColor(post.category)}>
                    {post.category}
                  </Badge>
                  {post.ishot && (
                    <Badge variant="destructive" className="text-xs">
                      🔥 HOT
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl mb-4">{post.title}</CardTitle>
                <div className="flex items-center justify-between text-sm text-slate-600">
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
                      {comments.reduce((total, comment) => total + 1 + (comment.replies?.length || 0), 0)}
                    </div>
                  </div>
                </div>
              </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {post.content.split('\n').map((line, index) => {
                if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-xl font-bold mt-6 mb-3 text-slate-900">{line.replace('## ', '')}</h2>;
                } else if (line.startsWith('- **')) {
                  const match = line.match(/- \*\*(.*?)\*\*: (.*)/);
                  if (match) {
                    return (
                      <li key={index} className="mb-2">
                        <strong>{match[1]}</strong>: {match[2]}
                      </li>
                    );
                  }
                } else if (line.trim() === '') {
                  return <br key={index} />;
                }
                return <p key={index} className="mb-4 text-slate-700 leading-relaxed">{line}</p>;
              })}
            </div>
            
            {/* 좋아요/공유 버튼 */}
            <div className="flex items-center gap-4 mt-8 pt-6 border-t">
              <Button 
                variant={isLiked ? "default" : "outline"}
                className={`flex items-center gap-2 ${isLiked ? 'bg-red-500 hover:bg-red-600 text-white' : ''}`}
                onClick={handleLikeToggle}
                disabled={likeLoading}
              >
                {likeLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                )}
                좋아요 ({post.likes})
              </Button>
              <Button variant="outline">
                공유하기
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 댓글 작성 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              댓글 작성
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentUser ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {currentUser.user_id?.[0] || currentUser.name?.[0] || currentUser.email?.[0] || '?'}
                  </div>
                  <div className="flex-1">
                    <Textarea
                      placeholder="댓글을 작성해주세요..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-muted-foreground">
                        {newComment.length}/1000
                      </span>
                      <Button 
                        onClick={handleCommentSubmit} 
                        disabled={!newComment.trim() || commentSubmitting || newComment.length > 1000}
                        size="sm"
                      >
                        {commentSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            등록 중...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            댓글 등록
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="mb-2">댓글을 작성하려면 로그인이 필요합니다</p>
                <Button 
                  variant="link" 
                  className="text-blue-600 hover:underline font-medium p-0 h-auto"
                  onClick={() => setShowLoginDialog(true)}
                >
                  로그인하기
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

                {/* 댓글 목록 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              댓글 ({comments.reduce((total, comment) => total + 1 + (comment.replies?.length || 0), 0)})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {commentsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">댓글을 불러오는 중...</span>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                첫 번째 댓글을 작성해보세요!
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-slate-200 last:border-b-0 pb-6 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {comment.member_user_id?.[0] || '?'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-slate-900">{comment.member_user_id}</span>
                          <span className="text-sm text-slate-500">{formatTimeAgo(comment.created_at)}</span>
                        </div>
                        <p className="text-slate-700 mb-3">{comment.content}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <button 
                            className={`flex items-center gap-1 transition-colors ${
                              commentLikes[comment.id] 
                                ? 'text-red-600 hover:text-red-700' 
                                : 'text-slate-500 hover:text-blue-600'
                            }`}
                            onClick={() => handleCommentLikeToggle(comment.id, comment.likes)}
                            disabled={commentLikeLoading[comment.id]}
                          >
                            {commentLikeLoading[comment.id] ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Heart className={`w-4 h-4 ${commentLikes[comment.id] ? 'fill-current' : ''}`} />
                            )}
                            좋아요 ({comment.likes})
                          </button>
                          <button 
                            className="flex items-center gap-1 text-slate-500 hover:text-blue-600"
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          >
                            <Reply className="w-4 h-4" />
                            답글
                          </button>
                        </div>

                        {/* 대댓글 작성 폼 */}
                        {replyingTo === comment.id && (
                          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                            <Textarea
                              placeholder="답글을 작성해주세요..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="mb-3 min-h-[80px]"
                            />
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setReplyingTo(null)}
                              >
                                취소
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleReplySubmit(comment.id)}
                                disabled={!replyText.trim()}
                              >
                                답글 등록
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* 대댓글 목록 */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start gap-3 ml-8 p-3 bg-slate-50 rounded-lg">
                                <div className="w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {reply.member_user_id?.[0] || '?'}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-slate-900 text-sm">{reply.member_user_id}</span>
                                    <span className="text-xs text-slate-500">{formatTimeAgo(reply.created_at)}</span>
                                  </div>
                                  <p className="text-slate-700 text-sm mb-2">{reply.content}</p>
                                  <button 
                                    className={`flex items-center gap-1 text-xs transition-colors ${
                                      commentLikes[reply.id] 
                                        ? 'text-red-600 hover:text-red-700' 
                                        : 'text-slate-500 hover:text-blue-600'
                                    }`}
                                    onClick={() => handleCommentLikeToggle(reply.id, reply.likes)}
                                    disabled={commentLikeLoading[reply.id]}
                                  >
                                    {commentLikeLoading[reply.id] ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Heart className={`w-3 h-3 ${commentLikes[reply.id] ? 'fill-current' : ''}`} />
                                    )}
                                    좋아요 ({reply.likes})
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
          </>
        )}
      </div>
      
      {/* 로그인 모달 */}
      <MembersLoginDialog 
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onLoginSuccess={(user) => {
          login(user);
          setShowLoginDialog(false);
        }}
      />
    </div>
  );
};

export default PlaygroundPostPage;
