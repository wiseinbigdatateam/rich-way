import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Calculator, Users, PiggyBank, CreditCard, Shield, Briefcase, Clock } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useNavigate } from "react-router-dom";

const ExpertSection = () => {
  const [titleRef, titleVisible] = useScrollAnimation(0.2);
  const [cardsRef, cardsVisible] = useScrollAnimation(0.1);
  const [buttonRef, buttonVisible] = useScrollAnimation(0.3);
  const navigate = useNavigate();

  const consultationAreas = [
    {
      id: 1,
      title: "🏠 부동산 고수",
      description: "내 집 마련, 매수 타이밍, 전세 vs 매매, 투자형 부동산까지 — 수억 원이 오가는 결정, 전문가와 함께 분석해보세요.",
      icon: Home,
      color: "bg-blue-500",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=150&fit=crop"
    },
    {
      id: 2,
      title: "💰 세무/절세 고수",
      description: "세금은 모르면 손해입니다. 종합소득세, 양도세, 증여세 등 복잡한 세무 문제를 전문가와 함께 해결하세요.",
      icon: Calculator,
      color: "bg-green-500",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=150&fit=crop"
    },
    {
      id: 3,
      title: "👨‍👩‍👧‍👦 상속/증여 설계 고수",
      description: "가족 간 자산 이전, 증여 시기, 상속세 절감 전략까지 — 민감한 재산 문제, 미리 대비해야 부작용이 없습니다.",
      icon: Users,
      color: "bg-orange-500",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=150&fit=crop"
    },
    {
      id: 4,
      title: "📊 자산관리/재무설계 고수",
      description: "목표는 있는데, 어떻게 돈을 모아야 할지 모르시겠다면? 당신의 소득·지출·자산 현황을 기반으로 현실적인 재무 로드맵을 제시해드립니다.",
      icon: PiggyBank,
      color: "bg-purple-500",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=150&fit=crop"
    },
    {
      id: 5,
      title: "🏦 대출 구조/실행 고수",
      description: "내게 맞는 대출 상품은? 이자를 줄이는 방법은? 주담대, 전세대출, 신용대출까지 복잡한 대출 조건을 전문가가 비교 분석해드립니다.",
      icon: CreditCard,
      color: "bg-indigo-500",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=150&fit=crop"
    },
    {
      id: 6,
      title: "🛡 보험 리빌딩 고수",
      description: "혹시 중복 가입되어 있진 않으신가요? 기존 보험을 점검하고, 꼭 필요한 보장만 유지하세요. 실손, 암보험, 종신까지 정리해드립니다.",
      icon: Shield,
      color: "bg-red-500",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=150&fit=crop"
    },
    {
      id: 7,
      title: "👨‍💼 사업자/프리랜서 세무 고수",
      description: "개인사업자, 프리랜서, 크리에이터라면 세금·4대보험이 복잡하셨죠? 절세 구조, 사업자 등록 전략, 법인 전환 시기까지 코칭해드립니다.",
      icon: Briefcase,
      color: "bg-teal-500",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=150&fit=crop"
    },
    {
      id: 8,
      title: "🧓 노후/연금 준비 고수",
      description: "60세 이후 소득이 사라졌을 때, 지금 준비 안 하면 늦습니다. 연금저축, IRP, 퇴직연금까지 당신의 노후자산을 함께 설계해드립니다.",
      icon: Clock,
      color: "bg-amber-500",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=150&fit=crop"
    }
  ];

  return (
    <section id="experts" className="py-20 bg-slate-50">
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
            금융고수의 1:1 코칭
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            전문가에게 재테크, 세금, 부동산, 투자 등 다양한 분야의 코칭을 받아보세요. 각 분야의 전문가들이 여러분의 재정 건강을 위해 최선의 답변을 제공합니다.
          </p>
        </div>

        <div 
          ref={cardsRef}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
        >
          {consultationAreas.map((area, index) => (
            <Card 
              key={area.id} 
              className={`bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-700 hover:scale-105 hover:-translate-y-2 ${
                cardsVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-20'
              }`}
              style={{ 
                transitionDelay: cardsVisible ? `${index * 100}ms` : '0ms' 
              }}
            >
              {/* Image section - top 1/3 */}
              <div className="relative h-24 overflow-hidden">
                <img 
                  src={area.image} 
                  alt={area.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className={`absolute top-2 left-2 w-8 h-8 ${area.color} rounded-full flex items-center justify-center`}>
                  <area.icon className="text-white" size={16} />
                </div>
              </div>
              
              {/* Content section */}
              <div className="p-6">
                <div className="flex flex-col space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {area.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {area.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div 
          ref={buttonRef}
          className={`text-center mt-12 transition-all duration-1000 ${
            buttonVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-10 scale-95'
          }`}
        >
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            onClick={() => navigate('/coaching')}
            tabIndex={0}
            aria-label="전문가 코칭 신청하기"
          >
            전문가 코칭 신청하기
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ExpertSection;
