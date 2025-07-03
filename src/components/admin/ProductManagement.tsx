
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

const ProductManagement = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "부자 가계부 앱", category: "앱", price: "9,900", sales: 1234, status: "판매중" },
    { id: 2, name: "투자 전략 템플릿", category: "템플릿", price: "29,000", sales: 567, status: "판매중" },
    { id: 3, name: "부동산 계산기", category: "도구", price: "19,900", sales: 890, status: "준비중" },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
    toast.success("상품이 삭제되었습니다.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          상품 관리
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                상품 추가
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>상품 정보</DialogTitle>
                <DialogDescription>
                  새로운 상품을 추가하거나 기존 상품 정보를 수정합니다.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="상품명" />
                <Input placeholder="카테고리" />
                <Input placeholder="가격" />
                <Textarea placeholder="상품 설명" />
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
              <TableHead>상품명</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>가격</TableHead>
              <TableHead>판매량</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price}원</TableCell>
                <TableCell>{product.sales}개</TableCell>
                <TableCell>
                  <Badge variant={product.status === "판매중" ? "default" : "secondary"}>
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(product.id)}
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

export default ProductManagement;
