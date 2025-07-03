
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, PiggyBank, Lightbulb } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const DiagnosisPage = () => {
  const [titleRef, titleVisible] = useScrollAnimation(0.2);
  const [card1Ref, card1Visible] = useScrollAnimation(0.3);
  const [card2Ref, card2Visible] = useScrollAnimation(0.3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <div 
            ref={titleRef}
            className={`text-center mb-16 transition-all duration-1000 ${
              titleVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              내가 부자가 될 상인가!
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              당신의 재무 건강을 체크하고 맞춤형 솔루션을 받아보세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* 부자 MBTI 진단 카드 */}
            <Card 
              ref={card1Ref}
              className={`group relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-700 hover:scale-[1.02] rounded-2xl ${
                card1Visible 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-10'
              }`}
            >
              <div className="relative h-40 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=160&fit=crop&crop=center"
                  alt="Financial Analysis"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-purple-800/40"></div>
                <div className="absolute top-4 left-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Lightbulb className="text-white" size={24} />
                </div>
              </div>
              
              <CardHeader className="text-center pb-4 pt-6 relative z-10">
                <CardTitle className="text-2xl font-bold text-purple-900 mb-2">
                  부자 MBTI 진단
                </CardTitle>
              </CardHeader>
              
              <CardContent className="text-center px-8 pb-8 relative z-10">
                <p className="text-purple-700 text-base leading-relaxed mb-8">
                  30개의 문항을 통해 당신의 부자 유형을 진단하고, 맞춤형 재무 리포트를 받아보세요. 당신만의 부자 성향과 투자 스타일을 찾아드립니다.
                </p>
                <Link to="/diagnosis/mbti">
                  <Button 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    진단하기
                    <ArrowRight className="ml-2" size={18} />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* 재무 설계 진단 카드 */}
            <Card 
              ref={card2Ref}
              className={`group relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 border border-green-200 shadow-lg hover:shadow-xl transition-all duration-700 hover:scale-[1.02] rounded-2xl ${
                card2Visible 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-10'
              }`}
            >
              <div className="relative h-40 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=160&fit=crop&crop=center"
                  alt="Financial Planning"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-green-600/20 to-green-800/40"></div>
                <div className="absolute top-4 left-4 w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <PiggyBank className="text-white" size={24} />
                </div>
              </div>
              
              <CardHeader className="text-center pb-4 pt-6 relative z-10">
                <CardTitle className="text-2xl font-bold text-green-900 mb-2">
                  재무 설계 진단
                </CardTitle>
              </CardHeader>
              
              <CardContent className="text-center px-8 pb-8 relative z-10">
                <p className="text-green-700 text-base leading-relaxed mb-8">
                  당신의 목표와 자산을 기반으로 개인화된 재무 계획을 세워드립니다. 소득, 지출, 투자 목표를 통해 맞춤형 자산 성장 전략을 제시합니다.
                </p>
                <Link to="/diagnosis/finance">
                  <Button 
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    진단하기
                    <ArrowRight className="ml-2" size={18} />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default DiagnosisPage;
