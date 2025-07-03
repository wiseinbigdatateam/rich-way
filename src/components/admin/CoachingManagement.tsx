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

const CoachingManagement = () => {
  const [applications, setApplications] = useState([]);
  const [experts, setExperts] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
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
      const [{ data: apps, error: err1 }, { data: exps, error: err2 }, { data: mems, error: err3 }] = await Promise.all([
        supabase.from("coaching_applications").select("*"),
        supabase.from("experts").select("user_id, expert_name, main_field"),
        supabase.from("members").select("user_id, name")
      ]);
      if (err1 || err2 || err3) {
        setError(err1?.message || err2?.message || err3?.message);
        setLoading(false);
        return;
      }
      setApplications(apps || []);
      setExperts(exps || []);
      setMembers(mems || []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  // 신청인 user_id별 신청횟수 계산
  const applicationCountMap = useMemo(() => {
    const map = {};
    applications.forEach(app => {
      map[app.member_user_id] = (map[app.member_user_id] || 0) + 1;
    });
    return map;
  }, [applications]);

  // 전문가 user_id → expert_name, main_field 매핑
  const expertMap = useMemo(() => {
    const map = {};
    experts.forEach(e => { map[e.user_id] = e; });
    return map;
  }, [experts]);
  // 회원 user_id → name 매핑
  const memberMap = useMemo(() => {
    const map = {};
    members.forEach(m => { map[m.user_id] = m.name; });
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

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setIsDetailOpen(true);
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    const { error } = await (
      (supabase
        .from("coaching_applications")
        .update({ status: newStatus }) as any
      ).eq("id", id)
    );

    if (error) {
      toast.error("진행상황 업데이트에 실패했습니다.");
      return;
    }

    setApplications(prev =>
      prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
    );
    toast.success("진행상황이 업데이트되었습니다.");
  };

  const filteredAndSortedApplications = useMemo(() => {
    let filtered = applications;

    // Search filter
    if (searchTerm) {
      filtered = applications.filter(app => {
        switch (searchType) {
          case "이름":
            return app.applicant.toLowerCase().includes(searchTerm.toLowerCase());
          case "연락처":
            return app.phone.includes(searchTerm);
          case "제목":
            return app.title.toLowerCase().includes(searchTerm.toLowerCase());
          case "내용":
            return app.content.toLowerCase().includes(searchTerm.toLowerCase());
          case "전체":
          default:
            return (
              app.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
              app.phone.includes(searchTerm) ||
              app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              app.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
              app.expert.toLowerCase().includes(searchTerm.toLowerCase())
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
            aValue = new Date(a.date);
            bValue = new Date(b.date);
            break;
          case "expert":
            aValue = a.expert;
            bValue = b.expert;
            break;
          case "applicant":
            aValue = a.applicant;
            bValue = b.applicant;
            break;
          case "applicationType":
            const typeOrder = { "신규": 1, "2회": 2, "3회": 3 };
            aValue = typeOrder[a.applicationType] || 999;
            bValue = typeOrder[b.applicationType] || 999;
            break;
          case "priceType":
            const priceOrder = { "무료": 1, "디럭스": 2, "프리미엄": 3 };
            aValue = priceOrder[a.priceType] || 999;
            bValue = priceOrder[b.priceType] || 999;
            break;
          case "category":
            aValue = a.category;
            bValue = b.category;
            break;
          case "status":
            const statusOrder = { "접수": 1, "진행중": 2, "진행완료": 3 };
            aValue = statusOrder[a.status] || 999;
            bValue = statusOrder[b.status] || 999;
            break;
          default:
            aValue = a[sortField];
            bValue = b[sortField];
        }

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [applications, searchTerm, searchType, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedApplications.length / pageSize);
  const paginatedApplications = filteredAndSortedApplications.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Card>
      <CardHeader>
        <CardTitle>상담 신청 관리</CardTitle>
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
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">{expertMap[application.expert_user_id]?.expert_name}</TableCell>
                <TableCell>{application.updated_at}</TableCell>
                <TableCell>{memberMap[application.member_user_id]}</TableCell>
                <TableCell>
                  <Badge variant={applicationCountMap[application.member_user_id] === 1 ? "default" : "secondary"}>
                    {applicationCountMap[application.member_user_id] === 1 ? "신규" : `${applicationCountMap[application.member_user_id]}회`}
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
                <TableCell>{expertMap[application.expert_user_id]?.main_field}</TableCell>
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
                    <Input value={expertMap[selectedApplication.expert_user_id]?.expert_name} readOnly />
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
                    <Input value={memberMap[selectedApplication.member_user_id]} readOnly />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>연락처</Label>
                    <Input value={selectedApplication.phone} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>이메일</Label>
                    <Input value={selectedApplication.email} readOnly />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>첨부파일</Label>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    {Array.isArray(selectedApplication.attachments) && selectedApplication.attachments.length > 0 ? (
                      <ul className="space-y-2">
                        {selectedApplication.attachments.map((file, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="text-sm">{file}</span>
                            <Button size="sm" variant="outline">다운로드</Button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">첨부파일이 없습니다.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Pagination */}
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

export default CoachingManagement;
