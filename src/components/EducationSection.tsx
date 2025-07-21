import { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface Lecture {
  id: string;
  category: string;
  title: string;
  thumbnail_url: string;
  price: number;
  discount_price: number | null;
  duration: number | null;
  description: string;
  sample_video_url: string | null;
  instructor_intro: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  averageRating?: number;
  reviewCount?: number;
}

const EducationSection = () => {
  const [titleRef, titleVisible] = useScrollAnimation(0.2);
  const [coursesRef, coursesVisible] = useScrollAnimation(0.1);
  const [buttonRef, buttonVisible] = useScrollAnimation(0.3);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
        const scrollAmount = 320; // 카드 너비 + gap
        
        // 현재 스크롤 위치가 컨테이너 너비를 초과하면 처음으로 리셋
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
          container.scrollTo({ left: 0, behavior: 'auto' });
        } else {
          // 계속 스크롤
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 3000); // 3초마다 스크롤
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

  // 스크롤 핸들러 (수동 스크롤용)
  const handleScroll = useCallback((direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 320; // 카드 너비 + gap
      
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  }, []);

  useEffect(() => {
    const fetchLectures = async () => {
      setLoading(true);
      // 강의 데이터 6개만 최신순으로 가져오기 (한 줄 체이닝)
      const { data: lecturesData, error } = await supabase
        .from('lectures')
        .select('*')
        .eq('status', '사용')
        .order('created_at', { ascending: false })
        .limit(6);
      if (error) {
        setLectures([]);
        setLoading(false);
        return;
      }
      // 리뷰 데이터 가져오기
      const { data: reviewsData } = await supabase
        .from('lecture_reviews')
        .select('lecture_id, rating');
      // 강의별 리뷰 통계 계산
      const reviewStats = new Map<string, { totalRating: number; count: number }>();
      (reviewsData || []).forEach((review: any) => {
        const existing = reviewStats.get(review.lecture_id);
        if (existing) {
          existing.totalRating += review.rating;
          existing.count += 1;
        } else {
          reviewStats.set(review.lecture_id, {
            totalRating: review.rating,
            count: 1
          });
        }
      });
      // 강의 데이터에 리뷰 통계 추가
      const lecturesWithReviews = (lecturesData || []).map((lecture: any) => {
        const stats = reviewStats.get(lecture.id);
        return {
          ...lecture,
          averageRating: stats ? Math.round((stats.totalRating / stats.count) * 10) / 10 : 0,
          reviewCount: stats ? stats.count : 0
        };
      });
      setLectures(lecturesWithReviews);
      setLoading(false);
    };
    fetchLectures();
  }, []);

  // 컴포넌트 마운트 시 자동 스크롤 시작
  useEffect(() => {
    if (lectures.length > 0 && isAutoScrolling) {
      startAutoScroll();
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      stopAutoScroll();
    };
  }, [lectures, isAutoScrolling, startAutoScroll, stopAutoScroll]);

  // 강의 시간 포맷팅
  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "시간 미정";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
    }
    return `${mins}분`;
  };

  // 할인율 계산
  const getDiscountRate = (price: number, discountPrice: number | null) => {
    if (!discountPrice) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  // 카드 클릭 시 상세페이지 이동
  const handleLectureClick = (lectureId: string) => {
    navigate(`/education/${lectureId}`);
  };

  return (
    <section id="education" className="py-20 bg-white">
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
            부자교육
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            금융고수들의 실전 노하우를 전수하는 진짜 부자되는 숨은 보물같은 교육
          </p>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-slate-600">강의 정보를 불러오는 중...</p>
          </div>
        ) : lectures.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">등록된 강의가 없습니다.</p>
            <Button onClick={() => navigate('/education')}>강의 등록하기</Button>
          </div>
        ) : (
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
              {lectures.map((lecture, index) => (
                <Card 
                  key={lecture.id} 
                  className="flex-shrink-0 w-80 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300 overflow-hidden cursor-pointer"
                  onClick={() => handleLectureClick(lecture.id)}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={lecture.thumbnail_url} 
                      alt={lecture.title}
                      className="w-full h-36 object-cover transition-transform duration-300 hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop";
                      }}
                    />
                    <Badge 
                      className="absolute top-3 left-3 bg-blue-600 text-white font-semibold px-2 py-1 text-xs"
                    >
                      {lecture.duration ? formatDuration(lecture.duration) : "시간 미정"}
                    </Badge>
                    {lecture.discount_price && (
                      <Badge 
                        className="absolute top-3 right-3 bg-red-500 text-white font-semibold px-2 py-1 text-xs"
                      >
                        {getDiscountRate(lecture.price, lecture.discount_price)}% 할인
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg leading-tight line-clamp-2 cursor-pointer">
                      {lecture.title}
                    </CardTitle>
                    <div className="text-sm text-gray-600">
                      {lecture.instructor_intro ? lecture.instructor_intro.split('은')[0] + '은' : '전문가'}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{lecture.averageRating ?? 0}</span>
                      <span className="text-gray-500">({lecture.reviewCount ?? 0})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold text-lg">
                        {lecture.discount_price ? lecture.discount_price.toLocaleString() : lecture.price.toLocaleString()}원
                      </span>
                      {lecture.discount_price && (
                        <span className="text-gray-400 line-through text-sm">
                          {lecture.price.toLocaleString()}원
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div 
          ref={buttonRef}
          className={`text-center mt-12 transition-all duration-1000 ${
            buttonVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-10 scale-95'
          }`}
        >
          <Button
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            onClick={() => navigate('/education')}
          >
            더 많은 강의 보기
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

export default EducationSection;
