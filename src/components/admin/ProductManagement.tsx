import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { Product, ProductStatus } from "@/hooks/useProducts";

const CATEGORIES = ["투자", "보험", "부동산", "대출", "카드", "앱", "템플릿", "도구"] as const;
const STATUSES: ProductStatus[] = ["판매중", "준비중", "판매중지"];

const emptyForm = {
  name: "",
  category: "",
  description: "",
  price: "",
  regularPrice: "",
  provider: "",
  rateInfo: "",
  riskLevel: "",
  features: "",
  rating: "4.5",
  salesCount: "0",
  status: "판매중" as ProductStatus,
  linkUrl: "",
  sortOrder: "0",
};

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProducts(
        (data || []).map((row: any) => ({
          ...row,
          features: row.features || [],
          rating: Number(row.rating) || 0,
          sales_count: row.sales_count || 0,
        }))
      );
    } catch (error: any) {
      console.error(error);
      toast.error(`상품 목록 조회 실패: ${error.message || "알 수 없는 오류"}`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description || "",
      price: String(product.price),
      regularPrice: product.regular_price != null ? String(product.regular_price) : "",
      provider: product.provider || "",
      rateInfo: product.rate_info || "",
      riskLevel: product.risk_level || "",
      features: (product.features || []).join(", "),
      rating: String(product.rating),
      salesCount: String(product.sales_count),
      status: product.status,
      linkUrl: product.link_url || "",
      sortOrder: String(product.sort_order),
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("상품명을 입력해주세요.");
      return;
    }
    if (!formData.category) {
      toast.error("카테고리를 선택해주세요.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim() || null,
        price: Number(formData.price) || 0,
        regular_price: formData.regularPrice ? Number(formData.regularPrice) : null,
        provider: formData.provider.trim() || null,
        rate_info: formData.rateInfo.trim() || null,
        risk_level: formData.riskLevel.trim() || null,
        features: formData.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
        rating: Number(formData.rating) || 4.5,
        sales_count: Number(formData.salesCount) || 0,
        status: formData.status,
        link_url: formData.linkUrl.trim() || null,
        sort_order: Number(formData.sortOrder) || 0,
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingId);
        if (error) throw error;
        toast.success("상품이 수정되었습니다.");
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
        toast.success("상품이 추가되었습니다.");
      }

      setIsDialogOpen(false);
      setEditingId(null);
      setFormData(emptyForm);
      await fetchProducts();
    } catch (error: any) {
      console.error(error);
      toast.error(`저장 실패: ${error.message || "알 수 없는 오류"}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("이 상품을 삭제하시겠습니까?")) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      toast.success("상품이 삭제되었습니다.");
      await fetchProducts();
    } catch (error: any) {
      console.error(error);
      toast.error(`삭제 실패: ${error.message || "알 수 없는 오류"}`);
    }
  };

  const handleToggleStatus = async (product: Product) => {
    const nextStatus: ProductStatus = product.status === "판매중" ? "판매중지" : "판매중";
    try {
      const { error } = await supabase
        .from("products")
        .update({ status: nextStatus, updated_at: new Date().toISOString() })
        .eq("id", product.id);
      if (error) throw error;
      toast.success(`상태가 '${nextStatus}'(으)로 변경되었습니다.`);
      await fetchProducts();
    } catch (error: any) {
      console.error(error);
      toast.error(`상태 변경 실패: ${error.message || "알 수 없는 오류"}`);
    }
  };

  const formatPrice = (price: number) => {
    if (price <= 0) return "문의";
    return `${price.toLocaleString()}원`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          상품 관리
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2" onClick={handleOpenCreate}>
                <Plus className="h-4 w-4" />
                상품 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "상품 수정" : "상품 추가"}</DialogTitle>
                <DialogDescription>
                  부자상품 정보를 등록하거나 수정합니다.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>상품명 *</Label>
                  <Input
                    placeholder="상품명"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>카테고리 *</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>가격 (원)</Label>
                    <Input
                      type="number"
                      placeholder="9900"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>정가 (원)</Label>
                    <Input
                      type="number"
                      placeholder="12900"
                      value={formData.regularPrice}
                      onChange={(e) => setFormData({ ...formData, regularPrice: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>제공사</Label>
                    <Input
                      placeholder="미래에셋"
                      value={formData.provider}
                      onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>수익률/요금 정보</Label>
                    <Input
                      placeholder="연 8-12%"
                      value={formData.rateInfo}
                      onChange={(e) => setFormData({ ...formData, rateInfo: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>위험도</Label>
                    <Input
                      placeholder="중위험"
                      value={formData.riskLevel}
                      onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>평점</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>특징 (쉼표로 구분)</Label>
                  <Input
                    placeholder="전문가 추천, 리스크 분석"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>상품 설명</Label>
                  <Textarea
                    placeholder="상품 설명"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>판매량</Label>
                    <Input
                      type="number"
                      value={formData.salesCount}
                      onChange={(e) => setFormData({ ...formData, salesCount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>정렬순서</Label>
                    <Input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>상태</Label>
                    <Select value={formData.status} onValueChange={(v: ProductStatus) => setFormData({ ...formData, status: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>링크 URL</Label>
                  <Input
                    placeholder="https://"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                  />
                </div>
                <Button className="w-full" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  저장
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
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
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    등록된 상품이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>{product.sales_count.toLocaleString()}개</TableCell>
                    <TableCell>
                      <Badge
                        variant={product.status === "판매중" ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => handleToggleStatus(product)}
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleOpenEdit(product)}>
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
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductManagement;
