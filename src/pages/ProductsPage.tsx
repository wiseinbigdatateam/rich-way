import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Shield, Award } from "lucide-react";

const ProductsPage = () => {
  const products = [
    {
      id: 1,
      title: "부자되는 투자 상품",
      description: "안전하고 수익성 높은 투자 상품을 추천해드립니다",
      rating: 4.8,
      category: "투자",
      price: "월 9,900원",
      features: ["전문가 추천", "리스크 분석", "포트폴리오 관리"]
    },
    {
      id: 2,
      title: "재테크 보험 상품",
      description: "보장과 수익을 동시에 챙기는 스마트한 보험",
      rating: 4.6,
      category: "보험",
      price: "월 29,900원",
      features: ["보장 + 투자", "세제혜택", "전문 상담"]
    },
    {
      id: 3,
      title: "부동산 투자 상품",
      description: "부동산 투자의 새로운 기회를 제공합니다",
      rating: 4.7,
      category: "부동산",
      price: "월 19,900원",
      features: ["시장 분석", "투자 기회", "전문가 조언"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">부자 상품</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            검증된 금융 상품으로 부자가 되는 길을 안내합니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{product.category}</Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-xl">{product.title}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-2xl font-bold text-blue-600 mb-2">{product.price}</div>
                  <ul className="space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-slate-600">
                        <Shield className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800">
                  상품 보기
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductsPage;
