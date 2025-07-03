import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Shield, TrendingUp, Home, CreditCard } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useNavigate } from "react-router-dom";

const ProductSection = () => {
  const [titleRef, titleVisible] = useScrollAnimation(0.2);
  const [categoriesRef, categoriesVisible] = useScrollAnimation(0.1);
  const [ctaRef, ctaVisible] = useScrollAnimation(0.3);
  const navigate = useNavigate();

  const productCategories = [
    {
      icon: TrendingUp,
      title: "투자상품",
      description: "맞춤형 투자 상품 추천",
      color: "text-green-600",
      bgColor: "bg-green-100",
      products: [
        { name: "S&P 500 ETF", provider: "미래에셋", rate: "연 8-12%", risk: "중위험" },
        { name: "코스피 200 ETF", provider: "삼성자산운용", rate: "연 6-10%", risk: "중위험" },
        { name: "배당주 펀드", provider: "KB자산운용", rate: "연 4-8%", risk: "저위험" }
      ]
    },
    {
      icon: Shield,
      title: "보험상품",
      description: "생애주기별 보험 설계",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      products: [
        { name: "종합보험", provider: "삼성생명", rate: "월 15만원", risk: "보장형" },
        { name: "건강보험", provider: "한화생명", rate: "월 8만원", risk: "보장형" },
        { name: "연금보험", provider: "교보생명", rate: "월 20만원", risk: "적립형" }
      ]
    },
    {
      icon: Home,
      title: "대출상품",
      description: "주택구입 및 투자 대출",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      products: [
        { name: "주택담보대출", provider: "KB국민은행", rate: "연 3.5%", risk: "변동금리" },
        { name: "신용대출", provider: "우리은행", rate: "연 4.2%", risk: "고정금리" },
        { name: "전세자금대출", provider: "하나은행", rate: "연 2.8%", risk: "우대금리" }
      ]
    },
    {
      icon: CreditCard,
      title: "카드상품",
      description: "혜택 맞춤형 카드 추천",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      products: [
        { name: "캐시백 카드", provider: "신한카드", rate: "최대 2%", risk: "연회비 무료" },
        { name: "마일리지 카드", provider: "현대카드", rate: "1마일/1천원", risk: "연회비 5만원" },
        { name: "주유할인 카드", provider: "롯데카드", rate: "리터당 100원", risk: "연회비 무료" }
      ]
    }
  ];

  return (
    <section id="products" className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div 
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            맞춤형 금융상품
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            진단 결과와 재무 목표에 맞는 최적의 금융상품을 추천해드립니다
          </p>
        </div>

        <div 
          ref={categoriesRef}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
        >
          {productCategories.map((category, index) => (
            <Card 
              key={index} 
              className={`hover:shadow-lg transition-all duration-700 hover:scale-105 hover:-translate-y-2 ${
                categoriesVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-20'
              }`}
              style={{ 
                transitionDelay: categoriesVisible ? `${index * 200}ms` : '0ms' 
              }}
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 ${category.bgColor} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                  <category.icon className={category.color} size={28} />
                </div>
                <CardTitle className="text-xl">{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {category.products.map((product, productIndex) => (
                    <div key={productIndex} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-medium text-sm">{product.name}</div>
                        <Badge variant="outline" className="text-xs">
                          {product.risk}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-600">{product.provider}</div>
                      <div className="text-sm font-semibold text-green-600 mt-1">
                        {product.rate}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full mt-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                  <ExternalLink className="mr-2" size={16} />
                  상품 보기
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div 
          ref={ctaRef}
          className={`bg-white rounded-2xl p-8 border border-slate-200 transition-all duration-1000 hover:shadow-xl ${
            ctaVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-20 scale-95'
          }`}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                나에게 딱 맞는 상품을 찾고 계신가요?
              </h3>
              <p className="text-slate-600 mb-6">
                진단 결과를 바탕으로 수백 개의 금융상품 중에서 
                가장 적합한 상품들만 골라 추천해드립니다.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-slate-700">실시간 금리/수익률 비교</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-slate-700">수수료 및 조건 투명 공개</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-slate-700">전문가 검증 상품만 선별</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 text-center">
              <h4 className="text-lg font-bold text-slate-900 mb-4">
                맞춤 상품 추천 받기
              </h4>
              <p className="text-slate-600 mb-6 text-sm">
                5분 진단만으로 최적의 금융상품을 찾아드립니다
              </p>
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                onClick={() => navigate('/diagnosis/finance')}
                tabIndex={0}
                aria-label="진단하고 상품 받기"
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate('/diagnosis/finance');
                  }
                }}
              >
                진단하고 상품 받기
              </Button>
              <div className="text-xs text-slate-500 mt-3">
                * 상품 추천은 무료이며, 가입은 선택사항입니다
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
