
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const [heroRef, heroVisible] = useScrollAnimation(0.2);
  const [chartRef, chartVisible] = useScrollAnimation(0.3);
  const [animatedBars, setAnimatedBars] = useState(0);
  const [showAchievement, setShowAchievement] = useState(false);

  // 차트 데이터
  const chartData = [
    { year: "1년", height: 30, amount: "10억" },
    { year: "2년", height: 45, amount: "20억" },
    { year: "3년", height: 60, amount: "35억" },
    { year: "4년", height: 75, amount: "55억" },
    { year: "5년", height: 85, amount: "70억" },
    { year: "6년", height: 100, amount: "100억" },
  ];

  useEffect(() => {
    if (chartVisible) {
      // 차트가 보이면 막대그래프를 순차적으로 애니메이션
      const timer = setInterval(() => {
        setAnimatedBars(prev => {
          if (prev < chartData.length) {
            return prev + 1;
          } else {
            clearInterval(timer);
            // 모든 막대가 완성된 후 1초 뒤에 100억 달성 메시지 표시
            setTimeout(() => {
              setShowAchievement(true);
            }, 1000);
            return prev;
          }
        });
      }, 300);

      return () => clearInterval(timer);
    }
  }, [chartVisible]);

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div 
            ref={heroRef}
            className={`space-y-8 transition-all duration-1000 ${
              heroVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              부자되는 놀이터,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
                리치웨이와 함께하세요
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              지금 나의 부자 성향을 진단받고, 목표달성을 위한 금융 여정을 시작하세요
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-lg px-8 py-4 h-auto rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/diagnosis')}
              >
                무료 진단 시작하기
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-blue-700 border-blue-300 hover:bg-blue-50 hover:border-blue-400 text-lg px-8 py-4 h-auto rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/education')}
              >
                교육 콘텐츠 보기
              </Button>
            </div>

            {/* Features */}
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              {[
                "맞춤형 자산 설계",
                "전문가 1:1 상담", 
                "커뮤니티 활동"
              ].map((feature, index) => (
                <div 
                  key={feature}
                  className={`flex items-center space-x-2 transition-all duration-700 ${
                    heroVisible 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 -translate-x-5'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                  <span className="text-slate-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual - Dynamic Chart */}
          <div 
            ref={chartRef}
            className={`relative transition-all duration-1000 ${
              chartVisible 
                ? 'opacity-100 translate-x-0 scale-100' 
                : 'opacity-0 translate-x-10 scale-95'
            }`}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 relative z-10 hover:shadow-2xl transition-shadow duration-300">
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900">자산 성장률</h3>
                </div>

                {/* Dynamic Chart */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end h-40 bg-gradient-to-t from-blue-50 to-transparent rounded-lg p-4 relative">
                    {chartData.map((data, index) => (
                      <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                        <div className="relative w-full flex justify-center items-end h-32">
                          <div 
                            className={`w-8 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t transition-all duration-700 ease-out ${
                              index < animatedBars ? 'opacity-100' : 'opacity-0'
                            }`}
                            style={{
                              height: index < animatedBars ? `${data.height}%` : '0%',
                              transitionDelay: `${index * 300}ms`
                            }}
                          ></div>
                        </div>
                        <span className={`text-xs text-slate-600 transition-all duration-300 ${
                          index < animatedBars ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                        }`} style={{ transitionDelay: `${index * 300 + 200}ms` }}>
                          {data.year}
                        </span>
                      </div>
                    ))}
                    
                    {/* 100억 달성 메시지 - 위치를 더 높이고 6년 막대와 겹치지 않게 조정 */}
                    {showAchievement && (
                      <div className="absolute -top-16 right-0 transform rotate-12 animate-bounce">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                          🎉 100억 달성!
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress indicators */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">현재 재무 목표 달성률</span>
                    <span className="text-lg font-bold text-blue-600">90%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: chartVisible ? '90%' : '0%',
                        transitionDelay: '800ms'
                      }}
                    ></div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-slate-500">현재 자산: </span>
                    <span className="text-lg font-bold text-indigo-600">90억</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full opacity-20 blur-xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full opacity-20 blur-xl animate-pulse"></div>
            {showAchievement && (
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-30 blur-lg animate-ping"></div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
