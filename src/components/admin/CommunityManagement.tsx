
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, Trash2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const CommunityManagement = () => {
  const [posts, setPosts] = useState([
    { id: 1, title: "투자 초보 질문드립니다", author: "김초보", category: "질문", comments: 12, likes: 8, date: "2024-01-15", status: "공개" },
    { id: 2, title: "부동산 투자 후기", author: "이투자", category: "후기", comments: 25, likes: 34, date: "2024-01-14", status: "공개" },
    { id: 3, title: "주식 추천 받습니다", author: "박주식", category: "질문", comments: 7, likes: 5, date: "2024-01-13", status: "숨김" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = posts.filter(post => 
    post.title.includes(searchTerm) || post.author.includes(searchTerm)
  );

  const handleDelete = (id: number) => {
    setPosts(posts.filter(post => post.id !== id));
    toast.success("게시글이 삭제되었습니다.");
  };

  const toggleStatus = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id 
        ? { ...post, status: post.status === "공개" ? "숨김" : "공개" }
        : post
    ));
    toast.success("게시글 상태가 변경되었습니다.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>커뮤니티 관리</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="게시글 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>작성자</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>댓글</TableHead>
              <TableHead>좋아요</TableHead>
              <TableHead>작성일</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {post.comments}
                  </div>
                </TableCell>
                <TableCell>{post.likes}</TableCell>
                <TableCell>{post.date}</TableCell>
                <TableCell>
                  <Badge variant={post.status === "공개" ? "default" : "secondary"}>
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleStatus(post.id)}
                    >
                      {post.status === "공개" ? "숨김" : "공개"}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CommunityManagement;
