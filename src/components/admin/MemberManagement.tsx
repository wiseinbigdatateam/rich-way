import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Member {
  id: string;
  name: string;
  user_id: string;
  email: string;
  phone: string;
  created_at: string;
  signup_type?: string;
  status?: string;
}

const MemberManagement = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", user_id: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 회원 데이터를 가져오는 함수
  const fetchMembers = async () => {
    setLoading(true);
    
    console.log('🔍 회원 데이터 로딩 시작...');
    
    try {
      // members 테이블에서 모든 회원 데이터 가져오기
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (membersError) {
        console.error('❌ 회원 데이터 조회 실패:', membersError);
        toast.error("회원 데이터를 불러오지 못했습니다.");
        setMembers([]);
        return;
      }
      
      console.log('✅ 회원 데이터 조회 성공:', membersData?.length || 0, '개');
      
      // 데이터 포맷팅
      const formattedMembers: Member[] = (membersData || []).map((member: any) => ({
        id: member.id,
        name: member.name || '이름 없음',
        user_id: member.user_id || '',
        email: member.email || '',
        phone: member.phone || '',
        created_at: member.created_at ? new Date(member.created_at).toLocaleDateString('ko-KR') : '',
        signup_type: member.signup_type || 'email',
        status: member.status || 'pending'
      }));
      
      console.log('✅ 회원 데이터 포맷팅 완료:', formattedMembers.length, '개');
      setMembers(formattedMembers);
      
    } catch (error) {
      console.error('❌ 회원 데이터 조회 중 예외 발생:', error);
      toast.error("회원 데이터를 불러오는 중 오류가 발생했습니다.");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = members.filter(
    (member) =>
      member.name.includes(searchTerm) ||
      member.user_id.includes(searchTerm) ||
      member.email.includes(searchTerm)
  );

  // Badge 색상 결정 함수(예시, 필요시 상태/등급/첨부파일 등 컬럼에 적용)
  const getBadgeVariant = (value: string) => {
    if (!value) return "secondary";
    if (value.includes("활성")) return "default";
    if (value.includes("대기")) return "secondary";
    if (value.includes("비활성")) return "destructive";
    if (value.endsWith("pdf")) return "default";
    if (value.endsWith("xlsx")) return "blue";
    return "outline";
  };

  const paginatedMembers = filteredMembers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredMembers.length / pageSize);

  // 삭제
  const handleDelete = async (id: string) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (error) {
      toast.error("삭제에 실패했습니다.");
      return;
    }
    toast.success("회원이 삭제되었습니다.");
    fetchMembers();
  };

  // 수정 다이얼로그 오픈
  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setEditForm({
      name: member.name,
      user_id: member.user_id,
      email: member.email,
      phone: member.phone || "",
    });
    setIsDialogOpen(true);
  };

  // 수정 폼 입력 핸들러
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // 수정 저장
  const handleEditSave = async () => {
    if (!editingMember) return;
    const { error } = await supabase
      .from("members")
      .update({
        name: editForm.name,
        user_id: editForm.user_id,
        email: editForm.email,
        phone: editForm.phone,
      })
      .eq("id", editingMember.id);
    if (error) {
      toast.error("수정에 실패했습니다.");
      return;
    }
    toast.success("회원 정보가 수정되었습니다.");
    setIsDialogOpen(false);
    setEditingMember(null);
    fetchMembers();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          회원 관리
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                회원 추가
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>회원 정보</DialogTitle>
                <DialogDescription>
                  새로운 회원을 추가하거나 기존 회원 정보를 수정합니다.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="이름" />
                <Input placeholder="이메일" type="email" />
                <Input placeholder="전화번호" />
                <Button className="w-full">저장</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="회원 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>넥네임</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>전화번호</TableHead>
              <TableHead>가입일</TableHead>
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">로딩 중...</TableCell>
              </TableRow>
            ) : filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">회원이 없습니다.</TableCell>
              </TableRow>
            ) : (
              paginatedMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.user_id}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>{member.created_at?.slice(0, 10)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        aria-label="회원 정보 수정"
                        onClick={() => handleEdit(member)}
                        tabIndex={0}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        aria-label="회원 삭제"
                        onClick={() => handleDelete(member.id)}
                        tabIndex={0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* 수정 다이얼로그 */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>회원 정보 수정</DialogTitle>
              <DialogDescription>이름, 닉네임, 이메일, 전화번호를 수정할 수 있습니다.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input name="name" placeholder="이름" value={editForm.name} onChange={handleEditFormChange} />
              <Input name="user_id" placeholder="닉네임" value={editForm.user_id} onChange={handleEditFormChange} />
              <Input name="email" placeholder="이메일" value={editForm.email} onChange={handleEditFormChange} />
              <Input name="phone" placeholder="전화번호" value={editForm.phone} onChange={handleEditFormChange} />
              <Button className="w-full" onClick={handleEditSave}>저장</Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex items-center justify-between mt-4 w-full">
          <div className="flex-1"></div>
          <div className="flex items-center gap-2 justify-center">
            <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>이전</Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button key={i+1} variant={currentPage === i+1 ? "default" : "outline"} onClick={() => setCurrentPage(i+1)}>{i+1}</Button>
            ))}
            <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>다음</Button>
          </div>
          <div className="flex-1 flex justify-end">
            <Select value={String(pageSize)} onValueChange={v => { setPageSize(Number(v)); setCurrentPage(1); }}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10개씩</SelectItem>
                <SelectItem value="50">50개씩</SelectItem>
                <SelectItem value="100">100개씩</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberManagement;
