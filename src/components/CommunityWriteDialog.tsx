import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";
import { Loader2, PenTool } from "lucide-react";

interface CommunityWriteDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onPostSuccess?: (post: any) => void;
  currentUser?: any;
}

const CATEGORIES = [
  { value: "자유게시판", label: "자유게시판" },
  { value: "투자정보", label: "투자정보" },
  { value: "부동산", label: "부동산" },
  { value: "주식", label: "주식" },
  { value: "암호화폐", label: "암호화폐" },
  { value: "창업", label: "창업" },
  { value: "질문답변", label: "질문답변" },
  { value: "성공사례", label: "성공사례" },
];

export default function CommunityWriteDialog({ 
  open, 
  onOpenChange, 
  onPostSuccess, 
  currentUser 
}: CommunityWriteDialogProps) {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "로그인 필요",
        description: "글을 작성하려면 먼저 로그인해주세요.",
      });
      return;
    }

    if (!category || !title.trim() || !content.trim()) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "카테고리, 제목, 내용을 모두 입력해주세요.",
      });
      return;
    }

    setLoading(true);

    try {
      // 실제 Supabase community_posts 테이블에 데이터 삽입
      const postData = {
        category,
        title: title.trim(),
        content: content.trim(),
        views: 0,
        likes: 0,
        answers_count: 0,
        parent_id: null,
        user_id: currentUser.id, // UUID 사용
        created_at: new Date().toISOString(),
        ishot: false
      };

      const { data, error } = await supabase
        .from('community_posts')
        .insert([postData])
        .select()
        .single();

      if (error) {
        console.error('게시글 작성 오류:', error);
        toast({
          variant: "destructive",
          title: "글쓰기 실패",
          description: "게시글 작성에 실패했습니다. 다시 시도해주세요.",
        });
        return;
      }

      console.log('✅ 게시글 작성 성공:', data);

      if (onPostSuccess) {
        onPostSuccess(data);
      }

      toast({
        title: "✅ 글쓰기 성공!",
        description: "게시글이 작성되었습니다!",
      });

      // 폼 초기화
      setCategory("");
      setTitle("");
      setContent("");
      onOpenChange?.(false);

    } catch (error) {
      console.error('게시글 작성 중 오류:', error);
      toast({
        variant: "destructive",
        title: "글쓰기 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCategory("");
    setTitle("");
    setContent("");
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            새 글 작성
          </DialogTitle>
          <DialogDescription>
            부자놀이터에 새로운 게시글을 작성해보세요.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* 카테고리 선택 */}
          <div className="grid gap-2">
            <Label htmlFor="category">카테고리 *</Label>
            <Select value={category} onValueChange={setCategory} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 제목 입력 */}
          <div className="grid gap-2">
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              maxLength={100}
              disabled={loading}
            />
            <div className="text-xs text-gray-500 text-right">
              {title.length}/100
            </div>
          </div>
          
          {/* 내용 입력 */}
          <div className="grid gap-2">
            <Label htmlFor="content">내용 *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요..."
              rows={8}
              maxLength={2000}
              disabled={loading}
              className="resize-none"
            />
            <div className="text-xs text-gray-500 text-right">
              {content.length}/2000
            </div>
          </div>

          {/* 작성자 정보 */}
          {currentUser && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
              <p className="text-sm text-gray-600">
                <strong>작성자:</strong> {currentUser.user_id || currentUser.name || currentUser.email?.split('@')[0] || '익명'}
              </p>
            </div>
          )}

          {/* 로그인 안내 */}
          {!currentUser && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-800">
                <strong>로그인이 필요합니다</strong><br />
                글을 작성하려면 먼저 로그인해주세요.
              </p>
            </div>
          )}

          {/* 버튼 그룹 */}
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={loading}
            >
              취소
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !currentUser}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  작성 중...
                </>
              ) : (
                <>
                  <PenTool className="mr-2 h-4 w-4" />
                  글 작성
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 