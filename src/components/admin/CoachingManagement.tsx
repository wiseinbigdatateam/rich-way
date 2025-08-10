import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, History, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface CoachingApplication {
  id: string;
  user_id: string;
  expert_id: string;
  title: string;
  content: string;
  method: string;
  contact: string;
  email: string;
  attachment_url?: string;
  product_name: string;
  product_price: number;
  status: string;
  start_date?: string;
  end_date?: string;
  total_sessions?: number;
  completed_sessions?: number;
  hourly_rate?: number;
  total_amount?: number;
  applied_at?: string;
  paid_at?: string;
  created_at?: string;
  updated_at?: string;
}

const CoachingManagement = () => {
  const [applications, setApplications] = useState<CoachingApplication[]>([]);
  const [experts, setExperts] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<CoachingApplication | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("전체");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 데이터 fetch
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      
      console.log('🔍 코칭 신청 데이터 로딩 시작...');
      
      try {
        // 1. coaching_applications 테이블에서 모든 데이터 가져오기
        const { data: apps, error: appsError } = await supabase
          .from("coaching_applications")
          .select("*")
          .order('created_at', { ascending: false });
        
        if (appsError) {
          console.error('❌ 코칭 신청 데이터 조회 실패:', appsError);
          setError(`코칭 신청 데이터 조회 실패: ${appsError.message}`);
          setApplications([]);
        } else {
          console.log('✅ 코칭 신청 데이터 조회 성공:', apps?.length || 0, '개');
          setApplications(apps || []);
        }

        // 2. experts 테이블에서 데이터 가져오기
        const { data: exps, error: expsError } = await supabase
          .from("experts")
          .select("id, user_id, expert_name, main_field");
        
        if (expsError) {
          console.error('❌ 전문가 데이터 조회 실패:', expsError);
        } else {
          console.log('✅ 전문가 데이터 조회 성공:', exps?.length || 0, '개');
          setExperts(exps || []);
        }

        // 3. members 테이블에서 데이터 가져오기
        const { data: mems, error: memsError } = await supabase
          .from("members")
          .select("id, user_id, name");
        
        if (memsError) {
          console.error('❌ 회원 데이터 조회 실패:', memsError);
        } else {
          console.log('✅ 회원 데이터 조회 성공:', mems?.length || 0, '개');
          setMembers(mems || []);
        }

      } catch (error) {
        console.error('❌ 데이터 조회 중 예외 발생:', error);
        setError(`데이터 조회 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAll();
  }, []);

  // 신청인 user_id별 신청횟수 계산
  const applicationCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    applications.forEach(app => {
      map[app.user_id] = (map[app.user_id] || 0) + 1;
    });
    return map;
  }, [applications]);

  // 전문가 id → expert_name, main_field 매핑
  const expertMap = useMemo(() => {
    const map: Record<string, any> = {};
    experts.forEach(e => { 
      map[e.id] = e; 
    });
    return map;
  }, [experts]);

  // 회원 id → name 매핑
  const memberMap = useMemo(() => {
    const map: Record<string, string> = {};
    members.forEach(m => { 
      map[m.id] = m.name; 
    });
    return map;
  }, [members]);

  const handleSort = (field: string) => {
    if (sortField === field && sortOrder === "asc") {
      setSortOrder("desc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return <ArrowUpDown className={`h-4 w-4 ${sortOrder === "desc" ? "rotate-180" : ""}`} />;
  };

  const handleViewDetails = (application: CoachingApplication) => {
    setSelectedApplication(application);
    setIsDetailOpen(true);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("coaching_applications")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) {
        console.error('❌ 상태 업데이트 실패:', error);
        toast.error("진행상황 업데이트에 실패했습니다.");
        return;
      }

      setApplications(prev =>
        prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
      );
      toast.success("진행상황이 업데이트되었습니다.");
    } catch (error) {
      console.error('❌ 상태 업데이트 중 예외 발생:', error);
      toast.error("진행상황 업데이트 중 오류가 발생했습니다.");
    }
  };

  const filteredAndSortedApplications = useMemo(() => {
    let filtered = applications;

    // Search filter
    if (searchTerm) {
      filtered = applications.filter(app => {
        const memberName = memberMap[app.user_id] || '';
        const expertName = expertMap[app.expert_id]?.expert_name || '';
        
        switch (searchType) {
          case "이름":
            return memberName.toLowerCase().includes(searchTerm.toLowerCase());
          case "연락처":
            return app.contact.includes(searchTerm);
          case "제목":
            return app.title.toLowerCase().includes(searchTerm.toLowerCase());
          case "내용":
            return app.content.toLowerCase().includes(searchTerm.toLowerCase());
          case "전체":
          default:
            return (
              memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              app.contact.includes(searchTerm) ||
              app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              app.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
              expertName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
      });
    }

    // Sort
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortField) {
          case "date":
            aValue = new Date(a.created_at || a.applied_at || a.updated_at || "").getTime();
            bValue = new Date(b.created_at || b.applied_at || b.updated_at || "").getTime();
            break;
          case "expert":
            aValue = expertMap[a.expert_id]?.expert_name || "";
            bValue = expertMap[b.expert_id]?.expert_name || "";
            break;
          case "applicant":
            aValue = memberMap[a.user_id] || "";
            bValue = memberMap[b.user_id] || "";
            break;
          case "applicationType":
            const typeOrder = { "신규": 1, "2회": 2, "3회": 3 };
            const aCount = applicationCountMap[a.user_id] || 1;
            const bCount = applicationCountMap[b.user_id] || 1;
            aValue = typeOrder[aCount === 1 ? "신규" : `${aCount}회`] || 999;
            bValue = typeOrder[bCount === 1 ? "신규" : `${bCount}회`] || 999;
            break;
          case "priceType":
            const priceOrder = { "무료": 1, "디럭스": 2, "프리미엄": 3 };
            const aPriceType = a.product_name.toLowerCase().includes("premium") || a.product_name.includes("프리미엄") ? "프리미엄" : 
                              a.product_name.toLowerCase().includes("deluxe") || a.product_name.includes("디럭스") ? "디럭스" : "무료";
            const bPriceType = b.product_name.toLowerCase().includes("premium") || b.product_name.includes("프리미엄") ? "프리미엄" : 
                              b.product_name.toLowerCase().includes("deluxe") || b.product_name.includes("디럭스") ? "디럭스" : "무료";
            aValue = priceOrder[aPriceType] || 999;
            bValue = priceOrder[bPriceType] || 999;
            break;
          case "category":
            aValue = expertMap[a.expert_id]?.main_field || "";
            bValue = expertMap[b.expert_id]?.main_field || "";
            break;
          case "status":
            const statusOrder = { "접수": 1, "진행중": 2, "진행완료": 3 };
            aValue = statusOrder[a.status] || 999;
            bValue = statusOrder[b.status] || 999;
            break;
          default:
            aValue = a[sortField as keyof CoachingApplication];
            bValue = b[sortField as keyof CoachingApplication];
        }

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [applications, searchTerm, searchType, sortField, sortOrder, expertMap, memberMap, applicationCountMap]);

  const totalPages = Math.ceil(filteredAndSortedApplications.length / pageSize);
  const paginatedApplications = filteredAndSortedApplications.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>상담 신청 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">데이터를 불러오는 중...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>상담 신청 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <p className="text-red-600">오류가 발생했습니다: {error}</p>
              <Button onClick={() => window.location.reload()} className="mt-2">
                다시 시도
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>상담 신청 관리</CardTitle>
        <div className="text-sm text-gray-600">
          총 {applications.length}개의 상담 신청이 있습니다.
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="전체">전체</SelectItem>
              <SelectItem value="이름">이름</SelectItem>
              <SelectItem value="연락처">연락처</SelectItem>
              <SelectItem value="제목">제목</SelectItem>
              <SelectItem value="내용">내용</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="검색어를 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>

        {applications.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <p className="text-gray-600">상담 신청이 없습니다.</p>
            </div>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>번호</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("expert")}
                  >
                    <div className="flex items-center gap-2">
                      전문가 이름
                      {getSortIcon("expert")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-2">
                      신청날짜
                      {getSortIcon("date")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("applicant")}
                  >
                    <div className="flex items-center gap-2">
                      신청인
                      {getSortIcon("applicant")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("applicationType")}
                  >
                    <div className="flex items-center gap-2">
                      신청횟수
                      {getSortIcon("applicationType")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("priceType")}
                  >
                    <div className="flex items-center gap-2">
                      가격구분
                      {getSortIcon("priceType")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center gap-2">
                      분야
                      {getSortIcon("category")}
                    </div>
                  </TableHead>
                  <TableHead>신청내용</TableHead>
                  <TableHead>히스토리</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-2">
                      진행상황
                      {getSortIcon("status")}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedApplications.map((application, index) => (
                  <TableRow key={application.id}>
                    <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {expertMap[application.expert_id]?.expert_name || '알 수 없음'}
                    </TableCell>
                    <TableCell>
                      {application.created_at ? new Date(application.created_at).toLocaleDateString('ko-KR') : 
                       application.applied_at ? new Date(application.applied_at).toLocaleDateString('ko-KR') : 
                       '날짜 없음'}
                    </TableCell>
                    <TableCell>{memberMap[application.user_id] || '알 수 없음'}</TableCell>
                    <TableCell>
                      <Badge variant={applicationCountMap[application.user_id] === 1 ? "default" : "secondary"}>
                        {applicationCountMap[application.user_id] === 1 ? "신규" : `${applicationCountMap[application.user_id]}회`}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          application.product_name.toLowerCase().includes("premium") || application.product_name.includes("프리미엄")
                            ? "destructive"
                            : application.product_name.toLowerCase().includes("deluxe") || application.product_name.includes("디럭스")
                            ? "default"
                            : "secondary"
                        }
                        className={
                          application.product_name.toLowerCase().includes("deluxe") || application.product_name.includes("디럭스")
                            ? "bg-black text-white"
                            : ""
                        }
                      >
                        {application.product_name}
                      </Badge>
                    </TableCell>
                    <TableCell>{expertMap[application.expert_id]?.main_field || '알 수 없음'}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(application)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        보기
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <History className="h-4 w-4" />
                        히스토리
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={application.status}
                        onValueChange={(value) => handleStatusChange(application.id, value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="접수">접수</SelectItem>
                          <SelectItem value="진행중">진행중</SelectItem>
                          <SelectItem value="진행완료">진행완료</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
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
            )}
          </>
        )}

        {/* Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>상담 신청 상세 내용</DialogTitle>
              <DialogDescription>
                상담 신청의 상세 정보를 확인할 수 있습니다.
              </DialogDescription>
            </DialogHeader>
            {selectedApplication && (
              <div className="space-y-4 p-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>상담제목</Label>
                    <Input value={selectedApplication.title} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>전문가</Label>
                    <Input value={expertMap[selectedApplication.expert_id]?.expert_name || '알 수 없음'} readOnly />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>상담내용</Label>
                  <Textarea value={selectedApplication.content ?? ""} readOnly rows={4} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>상담방법</Label>
                    <Input value={selectedApplication.method} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>이름</Label>
                    <Input value={memberMap[selectedApplication.user_id] || '알 수 없음'} readOnly />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>연락처</Label>
                    <Input value={selectedApplication.contact} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>이메일</Label>
                    <Input value={selectedApplication.email} readOnly />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>첨부파일</Label>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    {selectedApplication.attachment_url ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{selectedApplication.attachment_url}</span>
                        <Button size="sm" variant="outline">다운로드</Button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">첨부파일이 없습니다.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CoachingManagement;
