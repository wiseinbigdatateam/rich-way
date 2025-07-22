import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Home, TrendingUp, Users, PiggyBank, CreditCard, Shield, Briefcase, Calendar, Award, Building, GraduationCap, Youtube, ExternalLink, Play, Coins, Landmark, Target, Banknote, DollarSign, LineChart, Loader2, Calculator } from "lucide-react";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useExperts, type Expert } from "@/hooks/useExperts";
import { supabase } from "@/lib/supabase";

// 전문가와 상품 정보를 포함한 확장된 타입
interface ExpertWithProducts extends Expert {
  products?: Array<{
    product_name: string;
    price: number;
    duration: number;
    description: string;
  }>;
}

const CoachingPage = () => {
  const navigate = useNavigate();
  const { experts: allExperts, loading, error } = useExperts();
  
  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 페이지당 표시할 전문가 수
  
  // 전문가를 카테고리별로 분류 (상품 정보 포함)
  const [coachingData, setCoachingData] = useState<{
    realestate: ExpertWithProducts[];
    tax: ExpertWithProducts[];
    finance: ExpertWithProducts[];
    business: ExpertWithProducts[];
    retirement: ExpertWithProducts[];
    insurance: ExpertWithProducts[];
  }>({
    realestate: [],
    tax: [],
    finance: [],
    business: [],
    retirement: [],
    insurance: []
  });

  // 전문가별 상품 정보를 가져오는 함수
  const fetchExpertProducts = async (expertUserId: string) => {
    const { data: products, error } = await supabase
      .from('expert_products')
      .select('*')
      .eq('user_id', expertUserId);
    
    if (error) {
      console.error('상품 정보 가져오기 오류:', error);
      return [];
    }
    
    return products || [];
  };

  useEffect(() => {
    const loadExpertsWithProducts = async () => {
      if (allExperts.length > 0) {
        // 각 전문가의 상품 정보를 가져와서 결합
        const expertsWithProducts = await Promise.all(
          allExperts.map(async (expert) => {
            const products = await fetchExpertProducts(expert.user_id);
            return {
              ...expert,
              products
            };
          })
        );

        // 카테고리별로 분류
        const categorizedExperts = {
          realestate: expertsWithProducts.filter(expert => expert.main_field === '부동산'),
          tax: expertsWithProducts.filter(expert => expert.main_field === '세무절세'),
          finance: expertsWithProducts.filter(expert => expert.main_field === '금융레버리지'),
          business: expertsWithProducts.filter(expert => expert.main_field === '사업'),
          retirement: expertsWithProducts.filter(expert => expert.main_field === '은퇴설계'),
          insurance: expertsWithProducts.filter(expert => expert.main_field === '보험')
        };
        
        setCoachingData(categorizedExperts);
      }
    };

    loadExpertsWithProducts();
  }, [allExperts]);

  // 실제 데이터가 없으면 빈 배열 사용 (더미 데이터 제거)
  const displayData = coachingData;

  const handleCoachingApplication = (expert: ExpertWithProducts) => {
    // 기본 상품 정보 (FREE 상품이 있다면 사용, 없으면 첫 번째 상품)
    const defaultProduct = expert.products?.find(p => p.product_name === 'FREE') || expert.products?.[0];
    
    navigate('/coaching/apply', { 
      state: { 
        expertName: expert.expert_name, 
        expertCompany: expert.company_name || expert.main_field,
        expertId: expert.user_id,
        hourlyRate: defaultProduct?.price || 0,
        productName: defaultProduct?.product_name || 'FREE'
      } 
    });
  };

  const TabContent = ({ category, experts }: { category: string, experts: ExpertWithProducts[] }) => {
    // 페이징 계산
    const totalPages = Math.ceil(experts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentExperts = experts.slice(startIndex, endIndex);

    // 페이지 변경 핸들러
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
      <div className="space-y-6">
        {experts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">해당 분야의 전문가가 준비 중입니다.</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {currentExperts.map((expert) => (
                <Card key={expert.id} className="hover:shadow-lg transition-shadow duration-300 border-2 border-gray-100 hover:border-blue-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={expert.profile_image_url} alt={expert.expert_name} />
                          <AvatarFallback>{expert.expert_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-lg">{expert.expert_name}</CardTitle>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  전문가 상세보기
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <Avatar className="w-12 h-12">
                                      <AvatarImage src={expert.profile_image_url} alt={expert.expert_name} />
                                      <AvatarFallback>{expert.expert_name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="text-xl font-bold">{expert.expert_name}</div>
                                      <div className="text-sm text-gray-500">{expert.company_name}</div>
                                    </div>
                                  </DialogTitle>
                                </DialogHeader>
                                
                                <div className="space-y-6">
                                  {/* 기본 정보 */}
                                  <div>
                                    <h3 className="font-semibold mb-2">기본 정보</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="font-medium">전문 분야:</span> {expert.main_field}
                                      </div>
                                      <div>
                                        <span className="font-medium">경력:</span> {expert.experience_years}년
                                      </div>
                                      <div>
                                        <span className="font-medium">이메일:</span> {expert.email}
                                      </div>
                                      <div>
                                        <span className="font-medium">연락처:</span> {expert.personal_phone || expert.company_phone}
                                      </div>
                                    </div>
                                  </div>

                                  {/* 소개 */}
                                  {expert.core_intro && (
                                    <div>
                                      <h3 className="font-semibold mb-2">소개</h3>
                                      <p className="text-sm text-gray-700 whitespace-pre-line">{expert.core_intro}</p>
                                    </div>
                                  )}

                                  {/* 학력 및 자격 */}
                                  {expert.education_and_certifications && (
                                    <div>
                                      <h3 className="font-semibold mb-2">학력 및 자격</h3>
                                      <p className="text-sm text-gray-700 whitespace-pre-line">{expert.education_and_certifications}</p>
                                    </div>
                                  )}

                                  {/* 경력 */}
                                  {expert.career && (
                                    <div>
                                      <h3 className="font-semibold mb-2">경력</h3>
                                      <p className="text-sm text-gray-700 whitespace-pre-line">{expert.career}</p>
                                    </div>
                                  )}

                                  {/* 주요 성과 */}
                                  {expert.achievements && (
                                    <div>
                                      <h3 className="font-semibold mb-2">주요 성과</h3>
                                      <p className="text-sm text-gray-700 whitespace-pre-line">{expert.achievements}</p>
                                    </div>
                                  )}

                                  {/* 전문 영역 */}
                                  {expert.expertise_detail && (
                                    <div>
                                      <h3 className="font-semibold mb-2">전문 영역</h3>
                                      <p className="text-sm text-gray-700 whitespace-pre-line">{expert.expertise_detail}</p>
                                    </div>
                                  )}

                                  {/* 상품 정보 */}
                                  {expert.products && expert.products.length > 0 && (
                                    <div>
                                      <h3 className="font-semibold mb-2">코칭 상품</h3>
                                      <div className="space-y-2">
                                        {expert.products.map((product) => (
                                          <div key={product.product_name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div>
                                              <div className="font-medium">{product.product_name}</div>
                                              <div className="text-sm text-gray-600">{product.duration}분</div>
                                              {product.description && (
                                                <div className="text-sm text-gray-500 mt-1">{product.description}</div>
                                              )}
                                            </div>
                                            <div className="text-right">
                                              <div className="font-bold text-lg">
                                                {product.price === 0 ? '무료' : `${product.price.toLocaleString()}원`}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* 태그 */}
                                  {expert.tags && expert.tags.length > 0 && (
                                    <div>
                                      <h3 className="font-semibold mb-2">전문 태그</h3>
                                      <div className="flex flex-wrap gap-2">
                                        {expert.tags.map((tag, index) => (
                                          <Badge key={index} variant="secondary">{tag}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              <span>{expert.main_field}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{expert.experience_years}년 경력</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Button 
                          onClick={() => handleCoachingApplication(expert)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          코칭 신청
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {/* 소개 */}
                      <div>
                        <p className="text-gray-700 line-clamp-3">
                          {expert.core_intro || '전문가 소개가 준비 중입니다.'}
                        </p>
                      </div>

                      {/* 상품 정보 */}
                      {expert.products && expert.products.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">코칭 상품</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {expert.products.map((product) => (
                              <div key={product.product_name} className="text-xs">
                                {product.product_name}: {product.price === 0 ? '무료' : `${product.price.toLocaleString()}원`}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 태그 */}
                      {expert.tags && expert.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {expert.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {expert.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{expert.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
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
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">전문가 정보를 불러오는 중...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-500">전문가 정보를 불러오는데 실패했습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      {/* 
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              전문가와 함께하는 <br />
              <span className="text-yellow-300">맞춤형 부자 코칭</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              각 분야 최고의 전문가들이 당신의 자산 증식과 부자 되기 여정을 도와드립니다
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>전문가 검증 완료</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>안전한 코칭 환경</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>실전 경험 기반</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      */}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-4">전문 분야별 코칭</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            부동산, 세무절세, 금융레버리지, 사업, 은퇴설계, 보험 등 다양한 분야의 전문가들이 
            당신의 상황에 맞는 최적의 솔루션을 제공합니다.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={() => setCurrentPage(1)}>
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              전체
            </TabsTrigger>
            <TabsTrigger value="realestate" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              부동산
            </TabsTrigger>
            <TabsTrigger value="tax" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              세무절세
            </TabsTrigger>
            <TabsTrigger value="finance" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              금융레버리지
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              사업
            </TabsTrigger>
            <TabsTrigger value="retirement" className="flex items-center gap-2">
              <PiggyBank className="w-4 h-4" />
              은퇴설계
            </TabsTrigger>
            <TabsTrigger value="insurance" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              보험
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <TabContent category="전체" experts={[
              ...displayData.realestate,
              ...displayData.tax,
              ...displayData.finance,
              ...displayData.business,
              ...displayData.retirement,
              ...displayData.insurance
            ]} />
          </TabsContent>
          
          <TabsContent value="realestate">
            <TabContent category="부동산" experts={displayData.realestate} />
          </TabsContent>
          
          <TabsContent value="tax">
            <TabContent category="세무절세" experts={displayData.tax} />
          </TabsContent>
          
          <TabsContent value="finance">
            <TabContent category="금융레버리지" experts={displayData.finance} />
          </TabsContent>
          
          <TabsContent value="business">
            <TabContent category="사업" experts={displayData.business} />
          </TabsContent>
          
          <TabsContent value="retirement">
            <TabContent category="은퇴설계" experts={displayData.retirement} />
          </TabsContent>
          
          <TabsContent value="insurance">
            <TabContent category="보험" experts={displayData.insurance} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CoachingPage;
