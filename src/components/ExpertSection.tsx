import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Star, Award, Users, BookOpen, TrendingUp } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import { useExperts } from "@/hooks/useExperts";

const ExpertSection = () => {
  const [titleRef, titleVisible] = useScrollAnimation(0.2);
  const [cardsRef, cardsVisible] = useScrollAnimation(0.1);
  const [buttonRef, buttonVisible] = useScrollAnimation(0.3);
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // 실제 experts 테이블에서 데이터 가져오기 (메인페이지용 전문가만)
  const { experts: allExperts, loading, error } = useExperts();
  
  // 메인페이지에 노출할 전문가만 필터링 (is_featured가 true인 전문가들)
  const experts = allExperts.filter(expert => expert.is_featured === true);

  // 자동 스크롤 상태
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 자동 스크롤 함수
  const startAutoScroll = useCallback(() => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }

    autoScrollIntervalRef.current = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollAmount = 300; // 한 번에 스크롤할 픽셀 수
        
        // 현재 스크롤 위치가 컨테이너 너비를 초과하면 처음으로 리셋
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
          container.scrollTo({ left: 0, behavior: 'auto' });
        } else {
          // 계속 스크롤
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 2000); // 2초마다 스크롤 (더 빠르게 테스트)
  }, []);

  // 자동 스크롤 중지
  const stopAutoScroll = useCallback(() => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  }, []);

  // 마우스 호버 시 자동 스크롤 일시 중지
  const handleMouseEnter = useCallback(() => {
    if (isAutoScrolling) {
      stopAutoScroll();
    }
  }, [isAutoScrolling, stopAutoScroll]);

  // 마우스가 벗어나면 자동 스크롤 재시작
  const handleMouseLeave = useCallback(() => {
    if (isAutoScrolling) {
      startAutoScroll();
    }
  }, [isAutoScrolling, startAutoScroll]);

  // 자동 스크롤 시작/중지 토글
  const toggleAutoScroll = useCallback(() => {
    if (isAutoScrolling) {
      stopAutoScroll();
      setIsAutoScrolling(false);
    } else {
      startAutoScroll();
      setIsAutoScrolling(true);
    }
  }, [isAutoScrolling, startAutoScroll, stopAutoScroll]);

  // 컴포넌트 마운트 시 자동 스크롤 시작
  useEffect(() => {
    if (experts.length > 0 && isAutoScrolling) {
      startAutoScroll();
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      stopAutoScroll();
    };
  }, [experts, isAutoScrolling, startAutoScroll, stopAutoScroll]);

  // 스크롤 핸들러 (수동 스크롤용)
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 400; // 한 번에 스크롤할 픽셀 수
      
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // 전문 분야별 색상 매핑
  const getFieldColor = (field: string) => {
    const colorMap: { [key: string]: string } = {
      "에니어그램": "bg-blue-500",
      "재무설계": "bg-green-500",
      "부동산": "bg-purple-500",
      "세무": "bg-orange-500",
      "주식": "bg-red-500",
      "보험": "bg-teal-500",
      "창업": "bg-indigo-500",
      "상속": "bg-pink-500"
    };
    return colorMap[field] || "bg-gray-500";
  };

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
            전문가의 1:1 코칭
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            각 분야의 전문가들이 여러분의 성공을 위해 최선의 답변을 제공합니다. 
            성격 분석부터 재무설계, 부동산, 세무, 주식 투자까지 모든 것을 도와드립니다.
          </p>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-slate-600">전문가 정보를 불러오는 중...</span>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>다시 시도</Button>
          </div>
        )}

        {/* 전문가 카드들 */}
        {!loading && !error && experts.length > 0 && (
          <div className="relative max-w-7xl mx-auto">
            {/* 자동 스크롤 제어 버튼 */}
            <div className="absolute top-4 right-4 z-20">
              <Button
                onClick={toggleAutoScroll}
                variant="outline"
                size="sm"
                className={`rounded-full ${isAutoScrolling ? 'bg-blue-100 border-blue-300' : 'bg-gray-100 border-gray-300'}`}
              >
                {isAutoScrolling ? '⏸️ 자동정지' : '▶️ 자동재생'}
              </Button>
            </div>

            {/* 좌측 스크롤 버튼 */}
            <button
              onClick={() => handleScroll('left')}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              aria-label="왼쪽으로 스크롤"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>

            {/* 우측 스크롤 버튼 */}
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              aria-label="오른쪽으로 스크롤"
            >
              <ChevronRight className="w-6 h-6 text-slate-600" />
            </button>

            {/* 카드 스크롤 컨테이너 */}
            <div 
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-4 px-4"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {experts.slice(0, 5).map((expert, index) => (
                <Card 
                  key={expert.id} 
                  className="flex-shrink-0 w-80 bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {/* 전문가 이미지 */}
                  <div className="relative h-64 overflow-hidden">
                    {expert.profile_image_url ? (
                      <img 
                        src={expert.profile_image_url} 
                        alt={expert.expert_name}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    {/* 기본 placeholder (이미지가 없거나 로드 실패 시) */}
                    <div className={`w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center ${expert.profile_image_url ? 'hidden' : ''}`}>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-slate-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">
                            {expert.expert_name?.charAt(0) || '?'}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm font-medium">프로필 이미지</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className={`absolute top-3 left-3 ${getFieldColor(expert.main_field)} text-white px-2 py-1 rounded-full text-xs font-semibold`}>
                      {expert.main_field}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-lg font-bold text-white mb-1">{expert.expert_name}</h3>
                      <p className="text-white/90 text-xs">{expert.company_name || expert.main_field} 전문가</p>
                    </div>
                  </div>
                  
                  {/* 전문가 정보 */}
                  <div className="p-4">
                    {/* 슬로건 */}
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-slate-900 italic line-clamp-2">
                        "{expert.core_intro || `${expert.main_field} 전문가와 함께 성공하세요!`}"
                      </p>
                    </div>

                    {/* 주요 업적 */}
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        주요 업적
                      </h4>
                      <div className="text-xs text-slate-600">
                        {expert.achievements ? (
                          <p className="line-clamp-2">{expert.achievements}</p>
                        ) : (
                          <p className="text-slate-400 text-xs">업적 정보를 준비 중입니다.</p>
                        )}
                      </div>
                    </div>

                    {/* 코칭 신청 버튼 */}
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 rounded-lg transition-all duration-300 hover:scale-105 text-sm"
                      onClick={() => navigate('/coaching/apply', { 
                        state: { 
                          expertId: expert.user_id, 
                          expertName: expert.expert_name, 
                          expertCompany: expert.company_name || expert.main_field
                        } 
                      })}
                      tabIndex={0}
                      aria-label={`${expert.expert_name} 전문가 코칭 신청하기`}
                    >
                      코칭 신청하기
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 전문가가 없을 때 */}
        {!loading && !error && experts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">현재 등록된 전문가가 없습니다.</p>
            <Button onClick={() => navigate('/coaching')}>전문가 등록하기</Button>
          </div>
        )}

        <div 
          ref={buttonRef}
          className={`text-center mt-12 transition-all duration-1000 ${
            buttonVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-10 scale-95'
          }`}
        >
          <Button 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            onClick={() => navigate('/coaching')}
            tabIndex={0}
            aria-label="모든 전문가 보기"
          >
            모든 전문가 보기
          </Button>
        </div>
      </div>

      {/* 스크롤바 숨김 스타일 */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ExpertSection;
