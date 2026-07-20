
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CreditCard, TrendingUp, Package, Star } from "lucide-react";

const MyProducts = () => {
  const purchasedProducts = [
    {
      id: 1,
      name: "프리미엄 투자 분석 도구",
      type: "소프트웨어",
      purchaseDate: "2024-01-15",
      price: 299000,
      status: "활성",
      expiryDate: "2025-01-15",
      description: "실시간 주식 분석 및 포트폴리오 관리 도구"
    },
    {
      id: 2,
      name: "부동산 투자 가이드북",
      type: "전자책",
      purchaseDate: "2024-01-10",
      price: 49000,
      status: "구매완료",
      description: "전문가가 작성한 부동산 투자 완전 가이드"
    },
    {
      id: 3,
      name: "개인 재정관리 앱 프리미엄",
      type: "앱",
      purchaseDate: "2023-12-01",
      price: 19900,
      status: "만료",
      expiryDate: "2024-12-01",
      description: "AI 기반 개인 재정관리 및 예산 계획 앱"
    }
  ];

  const subscriptions = [
    {
      id: 1,
      name: "프리미엄 뉴스레터",
      type: "구독",
      startDate: "2024-01-01",
      nextBilling: "2024-03-01",
      price: 29900,
      status: "활성",
      description: "매주 발송되는 투자 전문가의 시장 분석 리포트"
    },
    {
      id: 2,
      name: "VIP 멘토링 서비스",
      type: "멘토링",
      startDate: "2024-02-01",
      nextBilling: "2024-03-01",
      price: 199000,
      status: "활성",
      description: "1:1 전문가 멘토링 및 포트폴리오 관리 서비스"
    }
  ];

  const wishlist = [
    {
      id: 1,
      name: "고급 차트 분석 도구",
      type: "소프트웨어",
      price: 599000,
      rating: 4.8,
      description: "프로 트레이더를 위한 고급 기술적 분석 도구"
    },
    {
      id: 2,
      name: "해외 부동산 투자 가이드",
      type: "전자책",
      price: 79000,
      rating: 4.6,
      description: "해외 부동산 투자를 위한 실전 가이드북"
    }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="purchased" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="purchased">구매한 상품</TabsTrigger>
          <TabsTrigger value="subscriptions">구독 서비스</TabsTrigger>
          <TabsTrigger value="wishlist">관심 상품</TabsTrigger>
        </TabsList>

        <TabsContent value="purchased" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package size={20} />
                구매한 상품
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchasedProducts.map((product) => (
                  <div key={product.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.description}</p>
                      </div>
                      <Badge 
                        className={
                          product.status === "활성" 
                            ? "bg-green-100 text-green-800" 
                            : product.status === "만료"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {product.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">구매일</span>
                        <p className="font-medium">{product.purchaseDate}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">가격</span>
                        <p className="font-medium">{product.price.toLocaleString()}원</p>
                      </div>
                      <div>
                        <span className="text-gray-500">유형</span>
                        <p className="font-medium">{product['type']}</p>
                      </div>
                      {product.expiryDate && (
                        <div>
                          <span className="text-gray-500">만료일</span>
                          <p className="font-medium">{product.expiryDate}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <Button size="sm">이용하기</Button>
                      <Button size="sm" variant="outline">다운로드</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard size={20} />
                구독 서비스
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscriptions.map((sub) => (
                  <div key={sub.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{sub.name}</h4>
                        <p className="text-sm text-gray-600">{sub.description}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {sub.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">시작일</span>
                        <p className="font-medium">{sub.startDate}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">다음 결제일</span>
                        <p className="font-medium">{sub.nextBilling}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">월 요금</span>
                        <p className="font-medium">{sub.price.toLocaleString()}원</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <Button size="sm">관리하기</Button>
                      <Button size="sm" variant="outline">결제 정보 변경</Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        구독 취소
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wishlist" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star size={20} />
                관심 상품
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wishlist.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">{item.price.toLocaleString()}원</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{item.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm">장바구니 담기</Button>
                      <Button size="sm" variant="outline">바로 구매</Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        관심 상품 제거
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyProducts;
