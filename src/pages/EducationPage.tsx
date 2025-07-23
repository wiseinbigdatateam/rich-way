import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Clock, BookOpen, TrendingUp, Building, Calculator, Briefcase, PiggyBank, Grid } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate, useSearchParams } from "react-router-dom";
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
}

interface LectureReview {
  id: string;
  lecture_id: string;
  user_id: string;
  rating: number;
  review_text: string;
  created_at: string;
}

interface LectureWithReviews extends Lecture {
  averageRating: number;
  reviewCount: number;
}

const EducationPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [lectures, setLectures] = useState<LectureWithReviews[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 페이지당 표시할 강의 수
  
  // URL 파라미터에서 카테고리 가져오기, 기본값은 "전체"
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    const categoryFromUrl = searchParams.get('category');
    return categoryFromUrl || "전체";
  });

  // URL 파라미터 업데이트 함수
  const updateCategoryInUrl = (category: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (category === "전체") {
      newSearchParams.delete('category');
    } else {
      newSearchParams.set('category', category);
    }
    setSearchParams(newSearchParams);
  };

  // 카테고리 변경 시 URL 업데이트
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateCategoryInUrl(category);
    setCurrentPage(1); // 카테고리 변경 시 페이지 리셋
  };

  // 강의 데이터와 리뷰 데이터 가져오기
  useEffect(() => {
    const fetchLecturesWithReviews = async () => {
      try {
        // 강의 데이터 가져오기
        const { data: lecturesData, error: lecturesError } = await supabase
          .from('lectures')
          .select('*')
          .eq('status', '사용')
          .order('created_at', { ascending: false });

        if (lecturesError) {
          console.error('Error fetching lectures:', lecturesError);
          return;
        }

        // 리뷰 데이터 가져오기
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('lecture_reviews')
          .select('*');

        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
          // 리뷰 데이터가 없어도 강의는 표시
          const lecturesWithReviews = (lecturesData || []).map(lecture => ({
            ...lecture,
            averageRating: 0,
            reviewCount: 0
          }));
          setLectures(lecturesWithReviews);
          setLoading(false);
          return;
        }

        // 강의별 리뷰 통계 계산
        const reviewStats = new Map<string, { totalRating: number; count: number }>();
        
        (reviewsData || []).forEach(review => {
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
        const lecturesWithReviews = (lecturesData || []).map(lecture => {
          const stats = reviewStats.get(lecture.id);
          return {
            ...lecture,
            averageRating: stats ? Math.round((stats.totalRating / stats.count) * 10) / 10 : 0,
            reviewCount: stats ? stats.count : 0
          };
        });

        setLectures(lecturesWithReviews);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLecturesWithReviews();
  }, []);

  // 카테고리별 강의 필터링
  const getFilteredLectures = (category: string) => {
    if (category === "전체") {
      return lectures;
    }
    return lectures.filter(lecture => lecture.category === category);
  };

  // 카테고리별 강의 수 계산
  const getLectureCount = (category: string) => {
    return getFilteredLectures(category).length;
  };

  // 가격 포맷팅
  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

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

  const categories = [
    { 
      id: "전체", 
      name: "전체", 
      icon: <Grid className="w-5 h-5" />,
      gradient: "from-gray-500 to-gray-600"
    },
    { 
      id: "기초코어", 
      name: "기초코어", 
      icon: <BookOpen className="w-5 h-5" />,
      gradient: "from-blue-500 to-indigo-600"
    },
    { 
      id: "부동산", 
      name: "부동산", 
      icon: <Building className="w-5 h-5" />,
      gradient: "from-green-500 to-emerald-600"
    },
    { 
      id: "세무", 
      name: "세무", 
      icon: <Calculator className="w-5 h-5" />,
      gradient: "from-purple-500 to-violet-600"
    },
    { 
      id: "투자", 
      name: "투자", 
      icon: <TrendingUp className="w-5 h-5" />,
      gradient: "from-orange-500 to-red-600"
    },
    { 
      id: "창업사업", 
      name: "창업사업", 
      icon: <Briefcase className="w-5 h-5" />,
      gradient: "from-teal-500 to-cyan-600"
    }
  ];

  const handleLectureClick = (lectureId: string) => {
    console.log(`강의 상세페이지로 이동: ${lectureId}`);
    // 현재 선택된 카테고리를 URL 파라미터로 전달
    navigate(`/education/${lectureId}?fromCategory=${selectedCategory}`);
  };

  const TabContent = ({ category }: { category: string }) => {
    const filteredLectures = getFilteredLectures(category);
    
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="h-36 bg-gray-200 rounded-t-lg"></div>
              <CardHeader className="pb-3">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (filteredLectures.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">해당 카테고리의 강의가 없습니다.</p>
        </div>
      );
    }

    // 페이징 계산
    const totalPages = Math.ceil(filteredLectures.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentLectures = filteredLectures.slice(startIndex, endIndex);

    // 페이지 변경 핸들러
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
      <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentLectures.map((lecture) => (
          <Card 
            key={lecture.id} 
            className="hover:shadow-lg transition-shadow duration-300 border border-gray-200 hover:border-blue-300 overflow-hidden"
          >
            <div className="relative overflow-hidden cursor-pointer" onClick={() => handleLectureClick(lecture.id)}>
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
              <CardTitle className="text-lg leading-tight line-clamp-2 cursor-pointer" onClick={() => handleLectureClick(lecture.id)}>
                {lecture.title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {lecture.instructor_intro ? lecture.instructor_intro.split('은')[0] + '은' : '전문가'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">
                        {lecture.reviewCount > 0 ? lecture.averageRating.toFixed(1) : '평점 없음'}
                      </span>
                      <span className="text-gray-500">
                        {lecture.reviewCount > 0 ? `(${lecture.reviewCount})` : '(0)'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    {lecture.discount_price ? (
                      <div>
                        <div className="text-sm text-gray-400 line-through">
                          {formatPrice(lecture.price)}원
                        </div>
                        <div className="text-lg font-bold text-red-600">
                          {formatPrice(lecture.discount_price)}원
                        </div>
                      </div>
                    ) : (
                      <div className="text-lg font-bold text-blue-600">
                        {formatPrice(lecture.price)}원
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 line-clamp-2">
                  {lecture.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>

        {/* 페이징 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">강의 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            부자교육 온라인 강의
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            각 분야의 전문가들이 직접 전수하는 실전 노하우를 온라인으로 학습하세요. 
            기초부터 고급까지 단계별 커리큘럼으로 체계적인 학습이 가능합니다.
          </p>
        </div>

        <Tabs value={selectedCategory} className="w-full" onValueChange={handleCategoryChange}>
          <TabsList className="grid w-full grid-cols-6 mb-8 bg-white border border-gray-200 rounded-xl p-1 shadow-sm h-16">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center justify-center gap-2 px-4 py-4 text-base font-bold text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-gray-50 rounded-lg h-14"
              >
                {category.icon}
                <span className="hidden sm:inline">{category.name}</span>
                <Badge className="ml-1 bg-gray-200 text-gray-700 text-xs">
                  {getLectureCount(category.id)}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              <TabContent category={category.id} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default EducationPage;
