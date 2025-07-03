
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

const DiagnosisManagement = () => {
  const [diagnoses, setDiagnoses] = useState([
    { id: 1, title: "재정 진단", description: "개인 재정 상태를 종합적으로 분석", questions: 15, status: "활성" },
    { id: 2, title: "MBTI 진단", description: "투자 성향 MBTI 테스트", questions: 20, status: "활성" },
    { id: 3, title: "부자 성향 진단", description: "부자가 되기 위한 성향 분석", questions: 12, status: "비활성" },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = (id: number) => {
    setDiagnoses(diagnoses.filter(diagnosis => diagnosis.id !== id));
    toast.success("진단이 삭제되었습니다.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          진단 관리
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                진단 추가
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>진단 정보</DialogTitle>
                <DialogDescription>
                  새로운 진단을 추가하거나 기존 진단 정보를 수정합니다.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="진단 제목" />
                <Textarea placeholder="진단 설명" />
                <Input placeholder="질문 수" type="number" />
                <Button className="w-full">저장</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>설명</TableHead>
              <TableHead>질문 수</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {diagnoses.map((diagnosis) => (
              <TableRow key={diagnosis.id}>
                <TableCell className="font-medium">{diagnosis.title}</TableCell>
                <TableCell>{diagnosis.description}</TableCell>
                <TableCell>{diagnosis.questions}개</TableCell>
                <TableCell>{diagnosis.status}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(diagnosis.id)}
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

export default DiagnosisManagement;
