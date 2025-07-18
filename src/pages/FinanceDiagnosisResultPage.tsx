import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import MembersLoginDialog from '@/components/MembersLoginDialog';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { 
  ArrowLeft, 
  RefreshCw, 
  Share2, 
  TrendingUp, 
  Target, 
  Calendar,
  DollarSign,
  PiggyBank,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  User,
  Wallet,
  Printer,
  Download,
  HelpCircle,
  Star,
  TrendingDown,
  Zap,
  CreditCard,
  Home,
  Car,
  BookOpen,
  ShoppingBag,
  Heart,
  Shield as ShieldIcon,
  Building,
  Briefcase,
  Smartphone,
  TrendingUp as TrendingUpIcon,
  X,
  Youtube,
  FileText,
  Building2,
  ShoppingCart,
  GraduationCap,
  Copy,
  Bookmark
} from 'lucide-react';
import Header from '@/components/Header';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useToast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { funds } from '@/data/funds';
import { allSavings } from '@/data/savings/allSavings';
import { pensionSavings } from '@/data/pensionSavings';

import { retirementPensions } from '@/data/retirementPensions';
import { getInsuranceRecommendations } from '@/data/insuranceRecommendations';
import { getAssetGrowthStrategies, getStrategyDetail } from '@/data/assetGrowthStrategies';

// 네이비+골드 테마 색상
const theme = {
  navy: {
    primary: '#1A2238',
    secondary: '#2C3E50',
    light: '#34495E',
    dark: '#0F1419'
  },
  gold: {
    primary: '#FFD700',
    secondary: '#FFA500',
    light: '#FFF8DC',
    dark: '#B8860B'
  },
  white: '#FFFFFF',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  }
};

interface PersonalInfo {
  name: string;
  gender: string;
  age: number;
  familyType: string;
}

interface AssetInfo {
  savings: number;
  investments: number;
  realEstate: number;
  car: number;
  retirement: number;
  otherAssets: number;
  creditLoan: number;
  depositLoan: number;
  mortgageLoan: number;
  studentLoan: number;
  otherDebt: number;

}

interface ExpenseInfo {
  housingCost: number;
  utilityCost: number;
  foodCost: number;
  educationCost: number;
  leisureCost: number;
  loanPayment: number;
  insuranceCost: number;
}

interface IncomeInfo {
  monthlyIncome: number;
  spouseIncome: number;
  otherIncome: number;
}

interface FinancialSummary {
  targetAmount: number;
  targetDate: string;
  netWorth: number;
  monthlySavings: number;
  financialHealth: {
    level: string;
    score: number;
    description: string;
    detail?: {
      savingsRate: number;
      debtRatio: number;
      savingRatio: number;
    };
  };
}

interface SpendingAnalysis {
  category: string;
  actualAmount: number;
  benchmarkAmount: number;
  difference: number;
  status: 'good' | 'warning' | 'poor';
  icon: React.ReactNode;
  color: string;
}

interface RecommendedProduct {
  id: string;
  name: string;
  type: 'fund' | 'savings' | 'pension' | 'retirement';
  category: string;
  return: number;
  riskLevel: 'low' | 'medium' | 'high';
  minAmount: number;
  description: string;
  reason: string;
}

interface SimulationData {
  years: number[];
  basicAssets: number[];
  recommendedAssets: number[];
  targetAmount: number;
  basicYears: number;
  recommendedYears: number;
}

interface AnalysisReport {
  personalInfo: PersonalInfo;
  assetInfo: AssetInfo;
  expenseInfo: ExpenseInfo;
  incomeInfo: IncomeInfo;
  summary: FinancialSummary;
  spendingAnalysis: SpendingAnalysis[];
  recommendations: RecommendedProduct[];
  simulation: SimulationData;
}

// 더미 데이터
const dummyReport: AnalysisReport = {
  personalInfo: {
    name: '김철수',
    gender: '남성',
    age: 35,
    familyType: '부부+자녀1명'
  },
  assetInfo: {
    savings: 50000000,
    investments: 30000000,
    realEstate: 200000000,
    car: 15000000,
    retirement: 25000000,
    otherAssets: 10000000,
    creditLoan: 0,
    depositLoan: 0,
    mortgageLoan: 0,
    studentLoan: 0,
    otherDebt: 0,

  },
  expenseInfo: {
    housingCost: 1200000,
    utilityCost: 300000,
    foodCost: 800000,
    educationCost: 500000,
    leisureCost: 400000,
    loanPayment: 800000,
    insuranceCost: 300000
  },
  incomeInfo: {
    monthlyIncome: 5000000,
    spouseIncome: 3000000,
    otherIncome: 500000
  },
  summary: {
    targetAmount: 500000000,
    targetDate: '2030년 12월',
    netWorth: 320000000,
    monthlySavings: 1500000,
    financialHealth: {
      level: 'good',
      score: 75,
      description: '안정적인 재무 상태를 유지하고 있습니다.'
    }
  },
  spendingAnalysis: [
    {
      category: '주거비',
      actualAmount: 1200000,
      benchmarkAmount: 1050000,
      difference: 150000,
      status: 'warning',
      icon: <Home className="w-5 h-5" />,
      color: '#3B82F6'
    },
    {
      category: '식비',
      actualAmount: 800000,
      benchmarkAmount: 700000,
      difference: 100000,
      status: 'warning',
      icon: <CreditCard className="w-5 h-5" />,
      color: '#10B981'
    },
    {
      category: '교통비',
      actualAmount: 300000,
      benchmarkAmount: 350000,
      difference: -50000,
      status: 'good',
      icon: <Car className="w-5 h-5" />,
      color: '#F59E0B'
    },
    {
      category: '교육비',
      actualAmount: 500000,
      benchmarkAmount: 600000,
      difference: -100000,
      status: 'good',
      icon: <BookOpen className="w-5 h-5" />,
      color: '#8B5CF6'
    },
    {
      category: '여가비',
      actualAmount: 400000,
      benchmarkAmount: 420000,
      difference: -20000,
      status: 'good',
      icon: <ShoppingBag className="w-5 h-5" />,
      color: '#EC4899'
    },
    {
      category: '의료/보험',
      actualAmount: 300000,
      benchmarkAmount: 280000,
      difference: 20000,
      status: 'good',
      icon: <ShieldIcon className="w-5 h-5" />,
      color: '#EF4444'
    }
  ],
  recommendations: [
    {
      id: '1',
      name: 'KB스타정기예금',
      type: 'savings',
      category: '정기예금',
      return: 3.5,
      riskLevel: 'low',
      minAmount: 1000000,
      description: '안정적인 수익률을 제공하는 정기예금 상품',
      reason: '비상금 확보 및 단기 목표 달성에 적합'
    },
    {
      id: '2',
      name: 'NH-Amundi KOSPI200 ETF',
      type: 'fund',
      category: 'ETF',
      return: 8.5,
      riskLevel: 'medium',
      minAmount: 100000,
      description: 'KOSPI200 지수를 추종하는 ETF 상품',
      reason: '장기 투자 및 자산 증식에 최적'
    },
    {
      id: '3',
      name: '개인연금저축',
      type: 'pension',
      category: '연금',
      return: 5.5,
      riskLevel: 'low',
      minAmount: 300000,
      description: '노후 준비를 위한 세제혜택 연금상품',
      reason: '세제혜택과 안정적 수익을 동시에'
    }
  ],
  simulation: {
    years: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    basicAssets: [338000000, 356000000, 374000000, 392000000, 410000000, 428000000, 446000000, 464000000, 482000000, 500000000],
    recommendedAssets: [338000000, 367000000, 398000000, 432000000, 468000000, 508000000, 551000000, 598000000, 649000000, 704000000],
    targetAmount: 500000000,
    basicYears: 10,
    recommendedYears: 7
  }
};

const FinanceDiagnosisResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHealthDetail, setShowHealthDetail] = useState(false);
  const { toast } = useToast();
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const { user, isAuthenticated, login } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // location.state에서 리포트 확인
    if (location.state && location.state.report) {
      setReport(location.state.report);
    } else {
      // localStorage에서 저장된 리포트 확인
      const savedReport = localStorage.getItem('financeDiagnosisReport');
      if (savedReport) {
        try {
          const parsedReport = JSON.parse(savedReport);
          console.log('저장된 리포트 데이터:', parsedReport);
          console.log('부채 정보:', {
            creditLoan: parsedReport?.assetInfo?.creditLoan,
            depositLoan: parsedReport?.assetInfo?.depositLoan,
            mortgageLoan: parsedReport?.assetInfo?.mortgageLoan,
            studentLoan: parsedReport?.assetInfo?.studentLoan,
            otherDebt: parsedReport?.assetInfo?.otherDebt,
    
            totalDebt: (parsedReport?.assetInfo?.creditLoan || 0) + 
                      (parsedReport?.assetInfo?.depositLoan || 0) + 
                      (parsedReport?.assetInfo?.mortgageLoan || 0) + 
                      (parsedReport?.assetInfo?.studentLoan || 0) + 
                      (parsedReport?.assetInfo?.otherDebt || 0)
          });
          setReport(parsedReport);
        } catch (error) {
          console.error('저장된 리포트 파싱 오류:', error);
        }
      }
    }
    setLoading(false);
  }, [location]);

  const formatCurrency = (amount: number) => {
    if (amount >= 100000000) {
      return `${(amount / 100000000).toFixed(1)}억원`;
    } else if (amount >= 10000) {
      return `${(amount / 10000).toFixed(0)}만원`;
    } else {
      return `${amount.toLocaleString()}원`;
    }
  };

  // 개인 상황에 따른 권장 저축률 계산
  const getRecommendedSavingsRate = (age: number, familyType: string): number => {
    let baseRate = 0.2; // 기본 20%
    
    // 나이별 조정
    if (age < 30) {
      baseRate = 0.15; // 20대: 15% (초기 자산 형성 단계)
    } else if (age < 40) {
      baseRate = 0.25; // 30대: 25% (가족 형성 및 자산 축적 단계)
    } else if (age < 50) {
      baseRate = 0.30; // 40대: 30% (자산 축적 최적기)
    } else if (age < 60) {
      baseRate = 0.25; // 50대: 25% (노후 준비 단계)
    } else {
      baseRate = 0.20; // 60대 이상: 20% (노후 단계)
    }
    
    // 가족 구성별 조정
    switch (familyType) {
      case 'family1':
        baseRate += 0.05; // 자녀 1명: +5%
        break;
      case 'family2':
        baseRate += 0.10; // 자녀 2명: +10%
        break;
      case 'couple':
        baseRate += 0.02; // 부부: +2%
        break;
      case 'single':
        // 1인가구는 기본값 유지
        break;
      default:
        // 기타는 기본값 유지
        break;
    }
    
    return Math.min(baseRate, 0.40); // 최대 40%로 제한
  };

  // 나이대 그룹 반환
  const getAgeGroup = (age: number): string => {
    if (age < 30) return '20대';
    if (age < 40) return '30대';
    if (age < 50) return '40대';
    if (age < 60) return '50대';
    return '60대 이상';
  };

  // 가족 구성 설명 반환
  const getFamilyDescription = (familyType: string): string => {
    switch (familyType) {
      case 'family1':
        return '부부+자녀1명 (+5%)';
      case 'family2':
        return '부부+자녀2명 이상 (+10%)';
      case 'couple':
        return '부부';
      case 'single':
        return '1인가구';
      case 'other':
        return '기타';
      default:
        return '1인가구';
    }
  };

  // 저축률 기준 설명 반환
  const getSavingsRateDescription = (age: number, familyType: string): string => {
    const baseRate = getRecommendedSavingsRate(age, familyType);
    const ageGroup = getAgeGroup(age);
    
    let description = '';
    if (age < 30) {
      description = '초기 자산 형성 단계';
    } else if (age < 40) {
      description = '가족 형성 및 자산 축적 단계';
    } else if (age < 50) {
      description = '자산 축적 최적기';
    } else if (age < 60) {
      description = '노후 준비 단계';
    } else {
      description = '노후 단계';
    }
    
    // 가족 구성별 추가 설명
    let familyAdjustment = '';
    switch (familyType) {
      case 'family1':
        familyAdjustment = ' + 자녀1명 조정';
        break;
      case 'family2':
        familyAdjustment = ' + 자녀2명 이상 조정';
        break;
      case 'couple':
        familyAdjustment = ' + 부부 조정';
        break;
    }
    
    return `${description}${familyAdjustment} (기본 ${(baseRate * 100).toFixed(0)}%)`;
  };

  // 가족 구성 표시명 반환 (기본정보용)
  const getFamilyDisplayName = (familyType: string): string => {
    switch (familyType) {
      case 'family1':
        return '부부+자녀1명';
      case 'family2':
        return '부부+자녀2명 이상';
      case 'couple':
        return '2인';
      case 'single':
        return '1인';
      case 'other':
        return '기타';
      default:
        return '-';
    }
  };

  // 성별 표시명 반환
  const getGenderDisplayName = (gender: string): string => {
    switch (gender) {
      case 'male':
        return '남성';
      case 'female':
        return '여성';
      default:
        return '-';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 차트 데이터
  const basicSimulationData = useMemo(() => {
    if (!report?.simulation?.years) return [];
    return report.simulation.years.map((year, index) => ({
      year,
      basic: report.simulation.basicAssets?.[index] || 0,
      recommended: report.simulation.recommendedAssets?.[index] || 0,
      target: report.simulation.targetAmount || 0
    }));
  }, [report]);

  // X축 틱 포맷터 함수
  const formatYearTick = (tickItem: any) => {
    return `${tickItem}년`;
  };

  const spendingChartData = useMemo(() => {
    if (!report?.spendingAnalysis) return [];
    return report.spendingAnalysis.map(item => ({
      name: item.category,
      actual: item.actualAmount,
      benchmark: item.benchmarkAmount,
      color: item.color
    }));
  }, [report]);

  const handlePrint = () => window.print();
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const handleShareSNS = (type: string) => {
    let url = '';
    const encodedUrl = encodeURIComponent(shareUrl);
    switch(type) {
      case 'kakao':
        url = `https://sharer.kakao.com/talk/friends/picker/link?url=${encodedUrl}`;
        window.open(url, '_blank');
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        window.open(url, '_blank');
        break;
      case 'x':
        url = `https://x.com/intent/tweet?url=${encodedUrl}`;
        window.open(url, '_blank');
        break;
      case 'instagram':
        url = `https://www.instagram.com/?url=${encodedUrl}`;
        window.open(url, '_blank');
        break;
      default:
        break;
    }
    setShowShare(false);
  };
  const saveFinanceDiagnosis = async () => {
    try {
      if (!user) throw new Error('로그인 필요');
      if (!report) throw new Error('진단 데이터가 올바르지 않습니다.');
      
      // responses는 JSONB 타입이므로 객체 그대로 저장
      // report_content는 text 타입이므로 JSON 문자열로 저장
      const payload = {
        user_id: user.user_id,
        responses: report, // JSONB 타입이므로 객체 그대로
        report_content: JSON.stringify(report), // text 타입이므로 문자열로
      };
      
      console.log('재무진단 저장 user:', user);
      console.log('재무진단 저장 payload:', payload);
      
      const { error } = await supabase.from('finance_diagnosis').insert([payload]);
      if (error) throw error;
      
      toast({ title: '저장 완료', description: '마이페이지에서 확인하세요.' });
      navigate('/mypage?tab=diagnosis');
    } catch (error: any) {
      console.error('supabase insert error:', error);
      toast({ 
        title: '저장 실패', 
        description: error.message || '알 수 없는 오류가 발생했습니다.' 
      });
    }
  };

  // 저장 버튼 클릭 핸들러
  const handleSave = async () => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    await saveFinanceDiagnosis();
  };

  // 로그인/회원가입 성공 시 후처리
  // 로그인 성공 시 user 상태가 반영된 뒤에만 저장 (최대 1초까지 재시도)
  const handleLoginSuccess = async (userData: any) => {
    // 로그인 모달 닫기
    setShowLogin(false);
    
    await login(userData);
    // user 상태가 null이 아니게 된 뒤에만 저장 (최대 1초까지 재시도)
    let tries = 0;
    const trySave = () => {
      if (user) {
        saveFinanceDiagnosis();
      } else if (tries < 10) {
        tries++;
        setTimeout(trySave, 100);
      } else {
        toast({ title: '로그인 정보 동기화 실패', description: '잠시 후 다시 시도해 주세요.' });
      }
    };
    trySave();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 to-navy-800 flex items-center justify-center">
        <div className="text-white text-xl">분석 결과를 불러오는 중...</div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 to-navy-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">재무진단 결과를 찾을 수 없습니다.</div>
          <Button 
            onClick={() => navigate('/diagnosis/finance')}
            className="bg-gold-500 hover:bg-gold-600 text-white"
          >
            재무진단 다시하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 to-navy-800 font-['Noto_Sans']">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 섹션 */}
        <div className="mb-8">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="text-white hover:bg-navy-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로가기
          </Button>
          
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-navy-900 mb-2">
                  {report?.personalInfo?.name || '사용자'}님의 목표달성을 위한 재무전략 리포트
                </h1>
                <p className="text-gray-600">
                  목표: {report?.summary?.targetAmount || 0}억 • 달성시점: {report?.summary?.targetDate || '미정'}년
                </p>
              </div>
              <div className="flex justify-end items-center gap-4 mb-6">
                <button onClick={handlePrint} title="인쇄하기" className="p-3 rounded-full bg-white shadow hover:bg-navy-100 transition flex items-center justify-center">
                  <Printer className="w-7 h-7 text-navy-600" />
                </button>
                <div className="relative">
                  <button onClick={() => setShowShare(v => !v)} title="공유하기" className="p-3 rounded-full bg-white shadow hover:bg-blue-100 transition flex items-center justify-center">
                    <Share2 className="w-7 h-7 text-blue-600" />
                  </button>
                  {showShare && (
                    <div className="absolute right-0 top-full mt-3 z-50 bg-sky-50/95 border-2 border-sky-300 rounded-2xl shadow-2xl py-8 px-8 flex flex-col items-center min-w-[340px] max-w-[95vw] gap-6 animate-fade-in-up">
                      <button onClick={() => setShowShare(false)} className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-200 transition" title="닫기">
                        <svg className="w-7 h-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                      <div className="flex flex-row justify-center items-center gap-6 mb-4">
                        <button onClick={() => handleShareSNS('kakao')} className="hover:scale-110 transition" title="카카오톡">
                          <svg className="w-12 h-12" viewBox="0 0 24 24"><ellipse fill="#FEE500" cx="12" cy="12" rx="12" ry="12"/><path d="M12 6.5c-3.59 0-6.5 2.15-6.5 4.8 0 1.53 1.13 2.88 2.87 3.74l-.3 2.13a.5.5 0 00.74.52l2.5-1.36c.23.02.47.03.7.03 3.59 0 6.5-2.15 6.5-4.8S15.59 6.5 12 6.5z" fill="#391B1B"/></svg>
                        </button>
                        <button onClick={() => handleShareSNS('facebook')} className="hover:scale-110 transition" title="페이스북">
                          <svg className="w-12 h-12" viewBox="0 0 24 24"><circle fill="#1877F3" cx="12" cy="12" r="12"/><path d="M15.12 8.5h-1.25c-.19 0-.37.18-.37.37v1.13h1.62l-.21 1.62h-1.41V17h-1.75v-5.38h-1.13v-1.62h1.13v-1.13c0-1.13.75-2 2-2h1.25v1.63z" fill="#fff"/></svg>
                        </button>
                        <button onClick={() => handleShareSNS('x')} className="hover:scale-110 transition" title="X(엑스)">
                          <svg className="w-12 h-12" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="1227" rx="200" fill="#000"/><path d="M860 320H740L600 540L460 320H340L540 620L340 907H460L600 687L740 907H860L660 620L860 320Z" fill="#fff"/></svg>
                        </button>
                        <button onClick={() => handleShareSNS('instagram')} className="hover:scale-110 transition" title="인스타그램">
                          <svg className="w-12 h-12" viewBox="0 0 24 24"><radialGradient id="ig2" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fdf497"/><stop offset="45%" stopColor="#fdf497"/><stop offset="60%" stopColor="#fd5949"/><stop offset="90%" stopColor="#d6249f"/><stop offset="100%" stopColor="#285AEB"/></radialGradient><circle fill="url(#ig2)" cx="12" cy="12" r="12"/><path d="M16.5 7.5a1 1 0 11-2 0 1 1 0 012 0zm-4.5 1.25A3.25 3.25 0 1015.25 12 3.25 3.25 0 0012 8.75zm0 5.25A2 2 0 1114 12a2 2 0 01-2 2zm4.5-5.25a.75.75 0 10.75.75.75.75 0 00-.75-.75z" fill="#fff"/></svg>
                        </button>
                      </div>
                      <div className="flex flex-row items-center gap-3 w-full bg-white rounded-lg px-4 py-3">
                        <input type="text" readOnly value={shareUrl} className="flex-1 bg-transparent text-gray-700 text-base font-semibold outline-none cursor-pointer select-all" onClick={e => (e.target as HTMLInputElement).select()} />
                        <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-2 min-w-[70px] rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-base whitespace-nowrap">
                          <Copy className="w-5 h-5" />{copied ? '복사됨!' : '복사'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={handleSave} title="마이페이지에 저장" className="p-3 rounded-full bg-white shadow hover:bg-green-100 transition flex items-center justify-center">
                  <Bookmark className="w-7 h-7 text-green-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 재무건전성 진단 요약 */}
        <Card className="bg-white rounded-2xl shadow-xl border-0 mb-8">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-2xl">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              재무건전성 진단 요약
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-navy-50 rounded-xl">
                <div className="text-4xl font-bold text-navy-900 mb-2">{formatCurrency(
                  (report?.assetInfo?.savings || 0) +
                  (report?.assetInfo?.investments || 0) +
                  (report?.assetInfo?.realEstate || 0) +
                  (report?.assetInfo?.car || 0) +
                  (report?.assetInfo?.retirement || 0) +
                  (report?.assetInfo?.otherAssets || 0) -
                  (report?.assetInfo?.creditLoan || 0) -
                  (report?.assetInfo?.depositLoan || 0) -
                  (report?.assetInfo?.mortgageLoan || 0) -
                  (report?.assetInfo?.studentLoan || 0) -
                  (report?.assetInfo?.otherDebt || 0)
                )}</div>
                <div className="text-lg text-gray-600 font-medium">순자산</div>
                <div className="text-sm text-gray-500 mt-1">총 자산 - 총 부채</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-4xl font-bold text-green-600 mb-2">{formatCurrency(
                  (report?.incomeInfo?.monthlyIncome || 0) +
                  (report?.incomeInfo?.spouseIncome || 0) +
                  (report?.incomeInfo?.otherIncome || 0) -
                  (report?.expenseInfo?.housingCost || 0) -
                  (report?.expenseInfo?.utilityCost || 0) -
                  (report?.expenseInfo?.foodCost || 0) -
                  (report?.expenseInfo?.educationCost || 0) -
                  (report?.expenseInfo?.leisureCost || 0) -
                  (report?.expenseInfo?.loanPayment || 0) -
                  (report?.expenseInfo?.insuranceCost || 0)
                )}</div>
                <div className="text-lg text-gray-600 font-medium">월 저축/투자 가능액</div>
                <div className="text-sm text-gray-500 mt-1">
                  현재 월 저축 {formatCurrency(report?.summary?.monthlySavings || 0)} + 추가 여유분 {formatCurrency(
                    ((report?.incomeInfo?.monthlyIncome || 0) +
                    (report?.incomeInfo?.spouseIncome || 0) +
                    (report?.incomeInfo?.otherIncome || 0) -
                    (report?.expenseInfo?.housingCost || 0) -
                    (report?.expenseInfo?.utilityCost || 0) -
                    (report?.expenseInfo?.foodCost || 0) -
                    (report?.expenseInfo?.educationCost || 0) -
                    (report?.expenseInfo?.leisureCost || 0) -
                    (report?.expenseInfo?.loanPayment || 0) -
                    (report?.expenseInfo?.insuranceCost || 0)) - (report?.summary?.monthlySavings || 0)
                  )}
                </div>
              </div>
              <div className="text-center p-4 bg-gold-50 rounded-xl">
                <div className="text-4xl font-bold text-gold-600 mb-2">{report?.summary?.financialHealth?.score || 0}점</div>
                <div className="text-lg text-gray-600 font-medium">재무건전성</div>
                <div className="text-sm text-gray-500 mt-1">종합 평가 점수</div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300"
                  onClick={() => setShowHealthDetail(true)}
                >
                  평가결과 상세보기
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 재무요약 섹션들 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {/* 1. 기본정보 */}
          <Card className="bg-white rounded-2xl shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-navy-600 to-navy-700 text-white rounded-t-2xl bg-[#374151]">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                기본정보
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between p-3">
                  <span className="text-gray-700 font-medium text-sm">이름</span>
                  <span className="font-semibold text-black">{report?.personalInfo?.name || '-'}</span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-gray-700 font-medium text-sm">성별</span>
                  <span className="font-semibold text-black">{getGenderDisplayName(report?.personalInfo?.gender || '')}</span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-gray-700 font-medium text-sm">나이</span>
                  <span className="font-semibold text-black">{report?.personalInfo?.age || 0}세</span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-gray-700 font-medium text-sm">가족구성</span>
                  <span className="font-semibold text-black">{getFamilyDisplayName(report?.personalInfo?.familyType || '')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. 소득정보 */}
          <Card className="bg-white rounded-2xl shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-2xl">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                소득정보
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">본인 월소득</span>
                  <span className="font-semibold text-green-700">{formatCurrency(report?.incomeInfo?.monthlyIncome || 0)}</span>
                </div>
                <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">배우자 월소득</span>
                  <span className="font-semibold text-green-700">{formatCurrency(report?.incomeInfo?.spouseIncome || 0)}</span>
                </div>
                <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">기타소득</span>
                  <span className="font-semibold text-green-700">{formatCurrency(report?.incomeInfo?.otherIncome || 0)}</span>
                </div>
                <div className="flex justify-between p-3 bg-green-100 rounded-lg border-2 border-green-300">
                  <span className="text-gray-700 font-semibold text-sm">총 월소득</span>
                  <span className="font-bold text-green-800">{formatCurrency((report?.incomeInfo?.monthlyIncome || 0) + (report?.incomeInfo?.spouseIncome || 0) + (report?.incomeInfo?.otherIncome || 0))}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. 지출정보 */}
          <Card className="bg-white rounded-2xl shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-2xl">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                지출정보
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">주거비</span>
                  <span className="font-semibold text-red-700">{formatCurrency(report?.expenseInfo?.housingCost || 0)}</span>
                </div>
                <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">식비</span>
                  <span className="font-semibold text-red-700">{formatCurrency(report?.expenseInfo?.foodCost || 0)}</span>
                </div>
                <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">공과금</span>
                  <span className="font-semibold text-red-700">{formatCurrency(report?.expenseInfo?.utilityCost || 0)}</span>
                </div>
                <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">교육비</span>
                  <span className="font-semibold text-red-700">{formatCurrency(report?.expenseInfo?.educationCost || 0)}</span>
                </div>
                <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">여가비</span>
                  <span className="font-semibold text-red-700">{formatCurrency(report?.expenseInfo?.leisureCost || 0)}</span>
                </div>
                <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">보험료</span>
                  <span className="font-semibold text-red-700">{formatCurrency(report?.expenseInfo?.insuranceCost || 0)}</span>
                </div>
                <div className="flex justify-between p-3 bg-red-100 rounded-lg border-2 border-red-300">
                  <span className="text-gray-700 font-semibold text-sm">총 월지출</span>
                  <span className="font-bold text-red-800">{formatCurrency((report?.expenseInfo?.housingCost || 0) + (report?.expenseInfo?.utilityCost || 0) + (report?.expenseInfo?.foodCost || 0) + (report?.expenseInfo?.educationCost || 0) + (report?.expenseInfo?.leisureCost || 0) + (report?.expenseInfo?.loanPayment || 0) + (report?.expenseInfo?.insuranceCost || 0))}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. 자산정보 */}
          <Card className="bg-white rounded-2xl shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl">
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                자산정보
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">예적금</span>
                  <span className="font-semibold text-blue-700">{formatCurrency(report?.assetInfo?.savings || 0)}</span>
                </div>
                <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">투자자산</span>
                  <span className="font-semibold text-blue-700">{formatCurrency(report?.assetInfo?.investments || 0)}</span>
                </div>
                <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">부동산</span>
                  <span className="font-semibold text-blue-700">{formatCurrency(report?.assetInfo?.realEstate || 0)}</span>
                </div>
                <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">자동차</span>
                  <span className="font-semibold text-blue-700">{formatCurrency(report?.assetInfo?.car || 0)}</span>
                </div>
                <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">퇴직연금</span>
                  <span className="font-semibold text-blue-700">{formatCurrency(report?.assetInfo?.retirement || 0)}</span>
                </div>
                <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">기타자산</span>
                  <span className="font-semibold text-blue-700">{formatCurrency(report?.assetInfo?.otherAssets || 0)}</span>
                </div>
                <div className="flex justify-between p-3 bg-blue-100 rounded-lg border-2 border-blue-300">
                  <span className="text-gray-700 font-semibold text-sm">총 자산</span>
                  <span className="font-bold text-blue-800">{formatCurrency((report?.assetInfo?.savings || 0) + (report?.assetInfo?.investments || 0) + (report?.assetInfo?.realEstate || 0) + (report?.assetInfo?.car || 0) + (report?.assetInfo?.retirement || 0) + (report?.assetInfo?.otherAssets || 0))}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5. 부채정보 */}
          <Card className="bg-white rounded-2xl shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-2xl">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                부채정보
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">신용대출</span>
                  <span className="font-semibold text-orange-700">{formatCurrency(report?.assetInfo?.creditLoan || 0)}</span>
                </div>
                <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">전세자금대출</span>
                  <span className="font-semibold text-orange-700">{formatCurrency(report?.assetInfo?.depositLoan || 0)}</span>
                </div>
                <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">주택담보대출</span>
                  <span className="font-semibold text-orange-700">{formatCurrency(report?.assetInfo?.mortgageLoan || 0)}</span>
                </div>
                <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">학자금대출</span>
                  <span className="font-semibold text-orange-700">{formatCurrency(report?.assetInfo?.studentLoan || 0)}</span>
                </div>
                <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-gray-700 font-medium text-sm">기타부채</span>
                  <span className="font-semibold text-orange-700">{formatCurrency(report?.assetInfo?.otherDebt || 0)}</span>
                </div>

                <div className="flex justify-between p-3 bg-orange-100 rounded-lg border-2 border-orange-300">
                  <span className="text-gray-700 font-semibold text-sm">총 부채</span>
                  <span className="font-bold text-orange-800">{formatCurrency((report?.assetInfo?.creditLoan || 0) + (report?.assetInfo?.depositLoan || 0) + (report?.assetInfo?.mortgageLoan || 0) + (report?.assetInfo?.studentLoan || 0) + (report?.assetInfo?.otherDebt || 0))}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 2. 기본적 순자산 시뮬레이션 */}
        <Card className="bg-white rounded-2xl shadow-xl border-0 mb-8">
          <CardHeader className="bg-gradient-to-r from-navy-600 to-navy-700 text-white rounded-t-2xl">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              2. 기본적 순자산 시뮬레이션
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={basicSimulationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="year" stroke="#6B7280" tickFormatter={formatYearTick} />
                  <YAxis stroke="#6B7280" tickFormatter={value => (value / 100000000).toFixed(1) + '억'} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="basic" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    name="기본 예금"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
                    name="목표 금액"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* 년도별 순자산액 표 */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow mb-8 custom-scrollbar">
              <table className="min-w-[900px] w-full text-base">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-20 bg-gradient-to-b from-blue-50 to-white border-b border-gray-200 p-4 text-center font-bold text-blue-900 align-middle">년도</th>
                    {basicSimulationData.map((data, index) => (
                      <th key={index} className="border-b border-gray-200 p-4 text-center font-bold text-blue-900 bg-blue-50 whitespace-nowrap">{data.year}년</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="even:bg-blue-50 hover:bg-blue-100 transition">
                    <td className="sticky left-0 z-10 bg-gradient-to-r from-blue-50 to-white border-r border-gray-200 p-4 font-bold text-blue-700 text-center align-middle leading-snug min-w-32 w-40">
                      순자산액<br/>(억원)
                    </td>
                    {basicSimulationData.map((data, index) => (
                      <td key={index} className="p-4 text-center font-bold text-navy-900 text-lg">{(data.basic / 100000000).toFixed(1)}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-blue-900 font-medium">
                <strong>총평:</strong> {report?.personalInfo?.name || '사용자'}님이 2025년부터 예금금리수준으로 월 저축을 할 때 목표금액을 달성하기 위해서는 {report?.simulation?.basicYears || 0}년이 소요됩니다. (2025년은 수익률 없이 저축만, 2026년부터 수익률 적용)
              </p>
              <p className="text-blue-800 text-sm mt-2">
                <strong>※ 시뮬레이션 계산 기준:</strong> 현재 월 저축금액만을 사용하여 계산
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 3. 지출분석 및 저축 가이드 */}
        {report?.spendingAnalysis && report.spendingAnalysis.some(item => item.actualAmount > 0) ? (
          <Card className="bg-white rounded-2xl shadow-xl border-0 mb-8">
            <CardHeader className="bg-gradient-to-r from-navy-600 to-navy-700 text-white rounded-t-2xl">
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                3. 지출분석 및 저축 가이드
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-4">지출 항목별 분석</h3>
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800 font-medium">
                      💡 <strong>평균 지출 기준:</strong> 귀하와 동일한 연령대, 가족구성, 소득대의 평균지출 수준으로 평균지출을 산출했습니다.
                    </p>
                  </div>
                  <div className="space-y-3">
                    {report?.spendingAnalysis?.filter(item => item.actualAmount > 0).map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="text-gray-600">
                              {item.icon}
                            </div>
                            <span className="font-medium text-gray-700">{item.category}</span>
                          </div>
                          <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                            {item.status === 'good' ? '양호' : 
                             item.status === 'warning' ? '주의' : '개선필요'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">실제 지출:</span>
                            <span className="ml-2 font-medium">{formatCurrency(item.actualAmount)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">평균 지출:</span>
                            <span className="ml-2 font-medium">{formatCurrency(item.benchmarkAmount)}</span>
                          </div>
                        </div>
                        {item.difference > 0 && (
                          <div className="mt-2 text-sm text-red-600">
                            절약 가능액: {formatCurrency(item.difference)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-4">저축 가이드</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-xl">
                      <h4 className="font-semibold text-green-900 mb-2">추가 저축 가능액</h4>
                      <div className="text-2xl font-bold text-green-700 mb-2">
                        {formatCurrency(report?.spendingAnalysis?.filter(item => item.actualAmount > 0).reduce((sum, item) => sum + (item.difference > 0 ? item.difference : 0), 0) || 0)}
                      </div>
                      <p className="text-sm text-green-700">
                        평균 대비 높은 지출 항목에서 절약 가능한 금액입니다.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
                      <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                        <span className="text-lg">💡</span>
                        실천 가능한 저축 목표
                      </h4>
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg border border-orange-300">
                          <div className="text-lg font-bold text-orange-800 mb-1">
                            {formatCurrency((report?.spendingAnalysis?.filter(item => item.actualAmount > 0).reduce((sum, item) => sum + (item.difference > 0 ? item.difference : 0), 0) || 0) * 0.5)}
                          </div>
                          <p className="text-sm text-orange-700">
                            추가저축 가능액 {formatCurrency(report?.spendingAnalysis?.filter(item => item.actualAmount > 0).reduce((sum, item) => sum + (item.difference > 0 ? item.difference : 0), 0) || 0)} 중 최소 50%인 {formatCurrency((report?.spendingAnalysis?.filter(item => item.actualAmount > 0).reduce((sum, item) => sum + (item.difference > 0 ? item.difference : 0), 0) || 0) * 0.5)}는 추가 저축 및 투자금액으로 돌리세요.
                          </p>
                        </div>
                        <div className="bg-gradient-to-r from-orange-100 to-red-100 p-3 rounded-lg border-2 border-orange-400">
                          <p className="text-sm font-bold text-orange-900">
                            🎯 <strong>지출을 아끼고 저축과 투자를 늘리는 것이 당장 할 수 있는 최고의 방법입니다!</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <h4 className="font-semibold text-blue-900 mb-2">개선 권장사항</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        {report?.spendingAnalysis?.filter(item => item.actualAmount > 0 && item.difference > 0).map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            {item.category}: {formatCurrency(item.difference)} 절약 가능
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white rounded-2xl shadow-xl border-0 mb-8">
            <CardHeader className="bg-gradient-to-r from-navy-600 to-navy-700 text-white rounded-t-2xl">
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                3. 지출분석 및 저축 가이드
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">지출 데이터 없음</h3>
                <p className="text-gray-600 mb-4">
                  지출분석을 위해서는 월 지출 정보를 입력해주세요.
                </p>
                <Button 
                  onClick={() => navigate('/diagnosis/finance')}
                  className="bg-navy-600 hover:bg-navy-700 text-white"
                >
                  지출 정보 입력하기
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 4. 순자산 증대를 위한 최적의 상품 추천 */}
        <Card className="bg-white rounded-2xl shadow-xl border-0 mb-8">
          <CardHeader className="bg-gradient-to-r from-navy-600 to-navy-700 text-white rounded-t-2xl">
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              4. 순자산 증대를 위한 최적의 상품 추천
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-navy-900">카테고리별 추천 상품</h3>
                <Link to="/products">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
                    금융상품 상세 보러가기
                  </Button>
                </Link>
              </div>
              
              {/* 면책 조항 */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="text-yellow-600 mt-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">📋 추천 상품 안내</p>
                    <p className="leading-relaxed">
                      추천상품은 최근 수익율과 안정성을 기반으로 귀하에 적합한 상위 3개 상품을 예시로 제시한 것입니다. 
                      자사는 직접 상품을 판매 권유하고 있지 않습니다. 상품 가입 전에 더 철저한 분석을 진행하고 판단하시기 바랍니다.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* 펀드 상품 */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <h4 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                  <TrendingUpIcon className="w-5 h-5" />
                  📈 펀드 상품 (상위 3개)
                </h4>
                <div className="space-y-4">
                  {report?.recommendations?.filter(p => p.type === 'fund').slice(0, 3).map((product, index) => (
                    <div key={product.id} className="bg-white border-2 border-green-300 rounded-xl p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={index === 0 ? "bg-yellow-500 text-white" : index === 1 ? "bg-gray-400 text-white" : "bg-orange-500 text-white"}>
                              {index + 1}위
                            </Badge>
                            <h5 className="text-md font-semibold text-green-900">
                              {product.name}
                            </h5>
                          </div>
                          <p className="text-green-700 text-sm mb-2">
                            {product.description}
                          </p>
                          <div className="flex gap-2 mb-2">
                            <Badge className={getRiskLevelColor(product.riskLevel)}>
                              {product.riskLevel === 'low' ? '낮은 위험' : 
                               product.riskLevel === 'medium' ? '보통 위험' : '높은 위험'}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                              {product.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-800">
                            {product.return}%
                          </div>
                          <div className="text-xs text-green-600">예상 수익률</div>
                        </div>
                      </div>
                      
                      <div className="border-t-2 border-green-200 pt-3">
                        <div className="text-sm text-green-700 mb-1">
                          <span className="font-medium">추천 이유:</span> {product.reason}
                        </div>
                        <div className="text-xs text-green-600">
                          최소 투자금액: {formatCurrency(product.minAmount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 구분선 */}
              <div className="border-t-4 border-gray-300 my-8"></div>

              {/* 정기적금 상품 */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                <h4 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <PiggyBank className="w-5 h-5" />
                  🏦 정기적금 상품 (상위 3개)
                </h4>
                <div className="space-y-4">
                  {report?.recommendations?.filter(p => p.type === 'savings').slice(0, 3).map((product, index) => (
                    <div key={product.id} className="bg-white border-2 border-blue-300 rounded-xl p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={index === 0 ? "bg-yellow-500 text-white" : index === 1 ? "bg-gray-400 text-white" : "bg-orange-500 text-white"}>
                              {index + 1}위
                            </Badge>
                            <h5 className="text-md font-semibold text-blue-900">
                              {product.name}
                            </h5>
                          </div>
                          <p className="text-blue-700 text-sm mb-2">
                            {product.description}
                          </p>
                          <div className="flex gap-2 mb-2">
                            <Badge className={getRiskLevelColor(product.riskLevel)}>
                              {product.riskLevel === 'low' ? '낮은 위험' : 
                               product.riskLevel === 'medium' ? '보통 위험' : '높은 위험'}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                              {product.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-800">
                            {product.return}%
                          </div>
                          <div className="text-xs text-blue-600">예상 수익률</div>
                        </div>
                      </div>
                      
                      <div className="border-t-2 border-blue-200 pt-3">
                        <div className="text-sm text-blue-700 mb-1">
                          <span className="font-medium">추천 이유:</span> {product.reason}
                        </div>
                        <div className="text-xs text-blue-600">
                          최소 투자금액: {formatCurrency(product.minAmount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 구분선 */}
              <div className="border-t-4 border-gray-300 my-8"></div>

              {/* 연금저축 상품 */}
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6 border-2 border-purple-200">
                <h4 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  🛡️ 연금저축 상품 (상위 3개)
                </h4>
                <div className="space-y-4">
                  {report?.recommendations?.filter(p => p.type === 'pension' && p.category === '연금저축').slice(0, 3).map((product, index) => (
                    <div key={product.id} className="bg-white border-2 border-purple-300 rounded-xl p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={index === 0 ? "bg-yellow-500 text-white" : index === 1 ? "bg-gray-400 text-white" : "bg-orange-500 text-white"}>
                              {index + 1}위
                            </Badge>
                            <h5 className="text-md font-semibold text-purple-900">
                              {product.name}
                            </h5>
                          </div>
                          <p className="text-purple-700 text-sm mb-2">
                            {product.description}
                          </p>
                          <div className="flex gap-2 mb-2">
                            <Badge className={getRiskLevelColor(product.riskLevel)}>
                              {product.riskLevel === 'low' ? '낮은 위험' : 
                               product.riskLevel === 'medium' ? '보통 위험' : '높은 위험'}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                              {product.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-purple-800">
                            {product.return}%
                          </div>
                          <div className="text-xs text-purple-600">예상 수익률</div>
                        </div>
                      </div>
                      
                      <div className="border-t-2 border-purple-200 pt-3">
                        <div className="text-sm text-purple-700 mb-1">
                          <span className="font-medium">추천 이유:</span> {product.reason}
                        </div>
                        <div className="text-xs text-purple-600">
                          최소 투자금액: {formatCurrency(product.minAmount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 구분선 */}
              <div className="border-t-4 border-gray-300 my-8"></div>

              {/* 퇴직연금 상품 */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
                <h4 className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  👥 퇴직연금 상품 (상위 3개)
                </h4>
                <div className="space-y-4">
                  {report?.recommendations?.filter(p => p.type === 'retirement').slice(0, 3).map((product, index) => (
                    <div key={product.id} className="bg-white border-2 border-orange-300 rounded-xl p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={index === 0 ? "bg-yellow-500 text-white" : index === 1 ? "bg-gray-400 text-white" : "bg-orange-500 text-white"}>
                              {index + 1}위
                            </Badge>
                            <h5 className="text-md font-semibold text-orange-900">
                              {product.name}
                            </h5>
                          </div>
                          <p className="text-orange-700 text-sm mb-2">
                            {product.description}
                          </p>
                          <div className="flex gap-2 mb-2">
                            <Badge className={getRiskLevelColor(product.riskLevel)}>
                              {product.riskLevel === 'low' ? '낮은 위험' : 
                               product.riskLevel === 'medium' ? '보통 위험' : '높은 위험'}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                              {product.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-orange-800">
                            {product.return}%
                          </div>
                          <div className="text-xs text-orange-600">예상 수익률</div>
                        </div>
                      </div>
                      
                      <div className="border-t-2 border-orange-200 pt-3">
                        <div className="text-sm text-orange-700 mb-1">
                          <span className="font-medium">추천 이유:</span> {product.reason}
                        </div>
                        <div className="text-xs text-orange-600">
                          최소 투자금액: {formatCurrency(product.minAmount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 최적 포트폴리오 조합 */}
              <div className="mt-8 p-6 bg-gradient-to-r from-navy-50 to-gold-50 rounded-xl border-2 border-navy-200">
                <h4 className="text-lg font-semibold text-navy-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-gold-600" />
                  최적 포트폴리오 조합 (각 카테고리 1순위)
                </h4>
                
                {/* 맞춤형 포트폴리오 비율 계산 */}
                {(() => {
                  const age = report?.personalInfo?.age || 30;
                  const familyType = report?.personalInfo?.familyType || '';
                  const totalIncome = (report?.incomeInfo?.monthlyIncome || 0) + 
                                   (report?.incomeInfo?.spouseIncome || 0) + 
                                   (report?.incomeInfo?.otherIncome || 0);
                  const debtRatio = report?.summary?.financialHealth?.detail?.debtRatio || 0;
                  const savingsRate = report?.summary?.financialHealth?.detail?.savingsRate || 0;
                  
                  // 연령대 결정
                  let ageGroup = '';
                  if (age < 30) ageGroup = '20대';
                  else if (age < 40) ageGroup = '30대';
                  else if (age < 50) ageGroup = '40대';
                  else if (age < 60) ageGroup = '50대';
                  else ageGroup = '60대 이상';

                  // 가족구성 정규화
                  let family = familyType.replace(/명|\s/g, '');
                  if (family.includes('자녀3')) family = '부부+자녀3이상';
                  else if (family.includes('자녀2')) family = '부부+자녀2';
                  else if (family.includes('자녀1')) family = '부부+자녀1';
                  else if (family.includes('미혼')) family = '미혼부부';
                  else if (family.includes('부양')) family = '부부+부양가족';
                  else if (family.includes('부부')) family = '부부';
                  else family = '1인가구';

                  // 소득구간 결정 (만원 단위)
                  const incomeInManWon = totalIncome / 10000;
                  let incomeRange = '';
                  if (incomeInManWon < 200) incomeRange = '100~200';
                  else if (incomeInManWon < 300) incomeRange = '200~300';
                  else if (incomeInManWon < 400) incomeRange = '300~400';
                  else if (incomeInManWon < 500) incomeRange = '400~500';
                  else if (incomeInManWon < 600) incomeRange = '500~600';
                  else if (incomeInManWon < 700) incomeRange = '600~700';
                  else if (incomeInManWon < 800) incomeRange = '700~800';
                  else if (incomeInManWon < 900) incomeRange = '800~900';
                  else incomeRange = '900~1000';

                  // 맞춤형 포트폴리오 비율 계산 (5% 단위로 조정)
                  let fundRatio = 0;
                  let savingsRatio = 0;
                  let pensionRatio = 0;
                  let retirementRatio = 0;

                  // 연령대별 기본 비율 설정
                  if (ageGroup === '20대') {
                    if (family === '1인가구') {
                      fundRatio = 50; savingsRatio = 25; pensionRatio = 15; retirementRatio = 10;
                    } else if (family === '미혼부부') {
                      fundRatio = 45; savingsRatio = 30; pensionRatio = 15; retirementRatio = 10;
                    } else if (family.includes('자녀')) {
                      fundRatio = 35; savingsRatio = 40; pensionRatio = 15; retirementRatio = 10;
                    } else {
                      fundRatio = 40; savingsRatio = 35; pensionRatio = 15; retirementRatio = 10;
                    }
                  } else if (ageGroup === '30대') {
                    if (family === '1인가구') {
                      fundRatio = 40; savingsRatio = 30; pensionRatio = 20; retirementRatio = 10;
                    } else if (family === '부부') {
                      fundRatio = 35; savingsRatio = 35; pensionRatio = 20; retirementRatio = 10;
                    } else if (family.includes('자녀1')) {
                      fundRatio = 30; savingsRatio = 40; pensionRatio = 20; retirementRatio = 10;
                    } else if (family.includes('자녀2')) {
                      fundRatio = 25; savingsRatio = 45; pensionRatio = 20; retirementRatio = 10;
                    } else if (family.includes('자녀3')) {
                      fundRatio = 20; savingsRatio = 50; pensionRatio = 20; retirementRatio = 10;
                    } else {
                      fundRatio = 35; savingsRatio = 35; pensionRatio = 20; retirementRatio = 10;
                    }
                  } else if (ageGroup === '40대') {
                    if (family === '1인가구') {
                      fundRatio = 30; savingsRatio = 40; pensionRatio = 20; retirementRatio = 10;
                    } else if (family === '부부') {
                      fundRatio = 25; savingsRatio = 45; pensionRatio = 20; retirementRatio = 10;
                    } else if (family.includes('자녀1')) {
                      fundRatio = 20; savingsRatio = 50; pensionRatio = 20; retirementRatio = 10;
                    } else if (family.includes('자녀2')) {
                      fundRatio = 15; savingsRatio = 55; pensionRatio = 20; retirementRatio = 10;
                    } else if (family.includes('자녀3')) {
                      fundRatio = 10; savingsRatio = 60; pensionRatio = 20; retirementRatio = 10;
                    } else {
                      fundRatio = 25; savingsRatio = 45; pensionRatio = 20; retirementRatio = 10;
                    }
                  } else if (ageGroup === '50대') {
                    if (family === '1인가구') {
                      fundRatio = 20; savingsRatio = 50; pensionRatio = 20; retirementRatio = 10;
                    } else if (family === '부부') {
                      fundRatio = 15; savingsRatio = 55; pensionRatio = 20; retirementRatio = 10;
                    } else if (family.includes('자녀')) {
                      fundRatio = 10; savingsRatio = 60; pensionRatio = 20; retirementRatio = 10;
                    } else {
                      fundRatio = 15; savingsRatio = 55; pensionRatio = 20; retirementRatio = 10;
                    }
                  } else { // 60대 이상
                    fundRatio = 10; savingsRatio = 60; pensionRatio = 20; retirementRatio = 10;
                  }

                  // 소득 수준별 미세 조정
                  if (incomeRange === '100~200' || incomeRange === '200~300') {
                    // 저소득: 안정성 중시
                    fundRatio = Math.max(5, fundRatio - 10);
                    savingsRatio = Math.min(70, savingsRatio + 10);
                  } else if (incomeRange === '800~900' || incomeRange === '900~1000') {
                    // 고소득: 적극적 투자
                    fundRatio = Math.min(60, fundRatio + 10);
                    savingsRatio = Math.max(20, savingsRatio - 10);
                  }

                  // 부채비율별 조정
                  if (debtRatio >= 60) {
                    // 부채비율 높음: 안전자산 우선
                    fundRatio = Math.max(5, fundRatio - 15);
                    savingsRatio = Math.min(75, savingsRatio + 15);
                  } else if (debtRatio <= 20) {
                    // 부채비율 낮음: 투자 여유
                    fundRatio = Math.min(65, fundRatio + 15);
                    savingsRatio = Math.max(15, savingsRatio - 15);
                  }

                  // 저축률별 조정
                  if (savingsRate < 10) {
                    // 저축률 낮음: 안정성 중시
                    fundRatio = Math.max(5, fundRatio - 10);
                    savingsRatio = Math.min(70, savingsRatio + 10);
                  } else if (savingsRate >= 30) {
                    // 저축률 높음: 적극적 투자
                    fundRatio = Math.min(60, fundRatio + 10);
                    savingsRatio = Math.max(20, savingsRatio - 10);
                  }

                  // 비율 정규화 (총합이 100이 되도록)
                  const total = fundRatio + savingsRatio + pensionRatio + retirementRatio;
                  fundRatio = Math.round((fundRatio / total) * 100);
                  savingsRatio = Math.round((savingsRatio / total) * 100);
                  pensionRatio = Math.round((pensionRatio / total) * 100);
                  retirementRatio = Math.round((retirementRatio / total) * 100);

                  // 5% 단위로 반올림
                  fundRatio = Math.round(fundRatio / 5) * 5;
                  savingsRatio = Math.round(savingsRatio / 5) * 5;
                  pensionRatio = Math.round(pensionRatio / 5) * 5;
                  retirementRatio = Math.round(retirementRatio / 5) * 5;

                  // 총합이 100이 되도록 조정
                  const adjustedTotal = fundRatio + savingsRatio + pensionRatio + retirementRatio;
                  if (adjustedTotal !== 100) {
                    const diff = 100 - adjustedTotal;
                    if (diff > 0) {
                      // 차이가 양수면 가장 큰 비율에 추가
                      if (savingsRatio >= fundRatio && savingsRatio >= pensionRatio && savingsRatio >= retirementRatio) {
                        savingsRatio += diff;
                      } else if (fundRatio >= pensionRatio && fundRatio >= retirementRatio) {
                        fundRatio += diff;
                      } else if (pensionRatio >= retirementRatio) {
                        pensionRatio += diff;
                      } else {
                        retirementRatio += diff;
                      }
                    } else {
                      // 차이가 음수면 가장 큰 비율에서 차감
                      if (savingsRatio >= fundRatio && savingsRatio >= pensionRatio && savingsRatio >= retirementRatio) {
                        savingsRatio += diff;
                      } else if (fundRatio >= pensionRatio && fundRatio >= retirementRatio) {
                        fundRatio += diff;
                      } else if (pensionRatio >= retirementRatio) {
                        pensionRatio += diff;
                      } else {
                        retirementRatio += diff;
                      }
                    }
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {report?.recommendations?.filter(p => p.type === 'fund').slice(0, 1).map((product, index) => (
                        <div key={product.id} className="text-center p-4 bg-white rounded-xl border border-navy-200">
                          <div className="text-2xl font-bold text-navy-900">{fundRatio}%</div>
                          <div className="text-sm text-gray-600 mb-2">펀드</div>
                          <div className="text-xs text-navy-700 font-medium">{product.name}</div>
                          <div className="text-xs text-gold-600 font-bold">{product.return}%</div>
                        </div>
                      ))}
                      {report?.recommendations?.filter(p => p.type === 'savings').slice(0, 1).map((product, index) => (
                        <div key={product.id} className="text-center p-4 bg-white rounded-xl border border-navy-200">
                          <div className="text-2xl font-bold text-navy-900">{savingsRatio}%</div>
                          <div className="text-sm text-gray-600 mb-2">정기적금</div>
                          <div className="text-xs text-navy-700 font-medium">{product.name}</div>
                          <div className="text-xs text-gold-600 font-bold">{product.return}%</div>
                        </div>
                      ))}
                      {report?.recommendations?.filter(p => p.type === 'pension' && p.category === '연금저축').slice(0, 1).map((product, index) => (
                        <div key={product.id} className="text-center p-4 bg-white rounded-xl border border-navy-200">
                          <div className="text-2xl font-bold text-navy-900">{pensionRatio}%</div>
                          <div className="text-sm text-gray-600 mb-2">연금저축</div>
                          <div className="text-xs text-navy-700 font-medium">{product.name}</div>
                          <div className="text-xs text-gold-600 font-bold">{product.return}%</div>
                        </div>
                      ))}
                      {report?.recommendations?.filter(p => p.type === 'retirement').slice(0, 1).map((product, index) => (
                        <div key={product.id} className="text-center p-4 bg-white rounded-xl border border-navy-200">
                          <div className="text-2xl font-bold text-navy-900">{retirementRatio}%</div>
                          <div className="text-sm text-gray-600 mb-2">퇴직연금</div>
                          <div className="text-xs text-navy-700 font-medium">{product.name}</div>
                          <div className="text-xs text-gold-600 font-bold">{product.return}%</div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
                
                <div className="mt-4 p-3 bg-navy-100 rounded-lg">
                  <p className="text-sm text-navy-800">
                    <strong>포트폴리오 특징:</strong> 귀하의 연령({getAgeGroup(report?.personalInfo?.age || 30)}), 
                    가족구성({getFamilyDescription(report?.personalInfo?.familyType || '')}), 소득 수준 등을 종합적으로 고려하여 
                    안정성과 수익성을 모두 고려한 맞춤형 투자 포트폴리오를 구성했습니다.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5. 추천상품 기반 순자산 시뮬레이션 */}
        <Card className="bg-white rounded-2xl shadow-xl border-0 mb-8">
          <CardHeader className="bg-gradient-to-r from-navy-600 to-navy-700 text-white rounded-t-2xl">
            <CardTitle className="flex items-center gap-2">
              <TrendingUpIcon className="w-5 h-5" />
              5. 추천상품 기반 순자산 시뮬레이션
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={basicSimulationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="year" stroke="#6B7280" tickFormatter={formatYearTick} />
                  <YAxis stroke="#6B7280" tickFormatter={value => (value / 100000000).toFixed(1) + '억'} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="basic" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                    name="기본 예금"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="recommended" 
                    stroke={theme.gold.primary} 
                    strokeWidth={3}
                    dot={{ fill: theme.gold.primary, strokeWidth: 2, r: 4 }}
                    name="추천 상품"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
                    name="목표 금액"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* 년도별 추천상품 기반 순자산액 표 */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow mb-8 custom-scrollbar">
              <table className="min-w-[900px] w-full text-base">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-20 bg-gradient-to-b from-orange-50 to-white border-b border-gray-200 p-4 text-center font-bold text-orange-900 align-middle">년도</th>
                    {basicSimulationData.map((data, index) => (
                      <th key={index} className="border-b border-gray-200 p-4 text-center font-bold text-orange-900 bg-orange-50 whitespace-nowrap">{data.year}년</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="even:bg-orange-50 hover:bg-orange-100 transition">
                    <td className="sticky left-0 z-10 bg-gradient-to-r from-orange-50 to-white border-r border-gray-200 p-4 font-bold text-orange-700 text-center align-middle leading-snug min-w-32 w-40">
                      추천상품 기반<br/>순자산액<br/>(억원)
                    </td>
                    {basicSimulationData.map((data, index) => (
                      <td key={index} className="p-4 text-center font-bold text-navy-900 text-lg">{(data.recommended / 100000000).toFixed(1)}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 p-4 bg-gold-50 rounded-xl">
              <p className="text-gold-900 font-medium">
                <strong>총평:</strong> {report?.personalInfo?.name || '사용자'}님이 2025년부터 추천상품 기반으로 월 저축/투자를 할 때 목표금액을 달성하기 위해서는 {report?.simulation?.recommendedYears || 0}년이 소요됩니다. 기본적 순자산 투자방법에 비해 목표달성까지 {(report?.simulation?.basicYears || 0) - (report?.simulation?.recommendedYears || 0)}년 줄어듭니다. (2025년은 수익률 없이 저축, 2026년부터 수익률 적용)
              </p>
              <p className="text-gold-800 text-sm mt-2">
                <strong>※ 시뮬레이션 계산 기준:</strong> 현재 월 저축 + 추가 여유분 + 실천가능한 저축목표(추가저축 가능액의 50%)를 합한 금액을 월 저축/투자금액으로 사용
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 6. 자산을 증대시키는 3가지 방법 */}
        <Card className="bg-white rounded-2xl shadow-xl border-0 mb-8">
          <CardHeader className="bg-gradient-to-r from-navy-600 to-navy-700 text-white rounded-t-2xl">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              6. 자산을 증대시키는 3가지 방법
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {(() => {
              const strategyData = getAssetGrowthStrategies(
                report?.personalInfo?.age || 30,
                report?.personalInfo?.familyType || '1인가구',
                (report?.incomeInfo?.monthlyIncome || 0) + (report?.incomeInfo?.spouseIncome || 0) + (report?.incomeInfo?.otherIncome || 0)
              );

              if (!strategyData) {
                return (
                  <div className="text-center p-8 bg-gray-50 rounded-xl">
                    <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">맞춤형 자산 증대 전략</h3>
                    <p className="text-gray-600 mb-4">
                      입력하신 정보에 맞는 자산 증대 전략을 제공할 수 없습니다.
                    </p>
                    <Badge variant="outline" className="text-sm">
                      정보 부족
                    </Badge>
                  </div>
                );
              }

              const getStrategyIcon = (strategy: string) => {
                if (strategy.includes('유튜브')) return <Youtube className="w-8 h-8 text-red-500 mx-auto mb-2" />;
                if (strategy.includes('부동산')) return <Home className="w-8 h-8 text-purple-500 mx-auto mb-2" />;
                if (strategy.includes('창업')) return <Building className="w-8 h-8 text-green-500 mx-auto mb-2" />;
                if (strategy.includes('스마트스토어')) return <ShoppingCart className="w-8 h-8 text-orange-500 mx-auto mb-2" />;
                if (strategy.includes('ETF')) return <TrendingUp className="w-8 h-8 text-emerald-500 mx-auto mb-2" />;
                if (strategy.includes('리츠')) return <Building2 className="w-8 h-8 text-cyan-500 mx-auto mb-2" />;
                if (strategy.includes('과외')) return <GraduationCap className="w-8 h-8 text-indigo-500 mx-auto mb-2" />;
                if (strategy.includes('블로그')) return <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />;
                if (strategy.includes('크몽')) return <Briefcase className="w-8 h-8 text-teal-500 mx-auto mb-2" />;
                if (strategy.includes('비트코인')) return <Target className="w-8 h-8 text-yellow-500 mx-auto mb-2" />;
                return <Target className="w-8 h-8 text-gray-500 mx-auto mb-2" />;
              };

              const getStrategyColor = (strategy: string) => {
                if (strategy.includes('유튜브')) return 'text-red-600';
                if (strategy.includes('부동산')) return 'text-green-600';
                if (strategy.includes('창업')) return 'text-blue-600';
                if (strategy.includes('드롭쉬핑')) return 'text-purple-600';
                if (strategy.includes('ETF')) return 'text-orange-600';
                if (strategy.includes('리츠')) return 'text-indigo-600';
                if (strategy.includes('과외')) return 'text-teal-600';
                if (strategy.includes('블로그')) return 'text-pink-600';
                if (strategy.includes('프리랜서')) return 'text-cyan-600';
                if (strategy.includes('디지털')) return 'text-yellow-600';
                return 'text-gray-600';
              };

              return (
                <div className="space-y-6">
                  {/* 맞춤형 전략 안내 */}
                  <div className="bg-gradient-to-r from-gold-50 to-yellow-50 border border-gold-200 p-4 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Target className="w-6 h-6 text-gold-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gold-900 mb-2">맞춤형 자산 증대 전략</h4>
                        <p className="text-gold-800 text-sm leading-relaxed">
                          {report?.personalInfo?.name || '사용자'}님의 연령대({strategyData.primary.age}), 
                          가족구성({strategyData.primary.family}), 소득구간({strategyData.primary.incomeRange}만원)을 
                          고려하여 최적화된 3가지 자산 증대 방법을 제시합니다.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 3가지 전략 카드 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 1순위 전략 - 골드/오렌지 테마 */}
                    <div className="text-center p-6 border-4 border-orange-400 bg-gradient-to-b from-orange-50 via-yellow-50 to-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      {getStrategyIcon(strategyData.primary.strategy)}
                      <Badge className="bg-orange-500 text-white text-base font-bold mb-3 px-4 py-2">1순위 추천</Badge>
                      <h3 className="text-xl font-bold text-orange-900 mb-3 leading-tight">{strategyData.primary.strategy}</h3>
                      <p className="text-gray-700 text-base mb-4 leading-relaxed">
                        {strategyData.primary.successSummary}
                      </p>
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Badge variant="outline" className="text-sm font-medium">
                          {strategyData.primary.sourceType}
                        </Badge>
                      </div>
                      <a 
                        href={strategyData.primary.sourceLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-orange-700 hover:text-orange-900 underline mb-4 font-medium"
                      >
                        성공사례 보기
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </a>
                      
                      {/* 전략 상세 설명 */}
                      {(() => {
                        const detail = getStrategyDetail(strategyData.primary.strategy);
                        if (!detail) return null;
                        return (
                          <div className="mt-4 pt-4 border-t-2 border-orange-300 text-left">
                            <div className="space-y-4 text-sm">
                              <div>
                                <span className="font-bold text-orange-800 text-base">대상자:</span>
                                <p className="text-gray-700 mt-2 leading-relaxed">{detail.targetAudience}</p>
                              </div>
                              <div>
                                <span className="font-bold text-orange-800 text-base">전략 개요:</span>
                                <p className="text-gray-700 mt-2 leading-relaxed">{detail.strategyOverview}</p>
                              </div>
                              <div>
                                <span className="font-bold text-orange-800 text-base">시작 가이드:</span>
                                <p className="text-gray-700 mt-2 leading-relaxed">{detail.startGuide}</p>
                              </div>
                              <div>
                                <span className="font-bold text-orange-800 text-base">주의사항:</span>
                                <p className="text-gray-700 mt-2 leading-relaxed">{detail.precautions}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                    
                    {/* 2순위 전략 - 블루/퍼플 테마 */}
                    <div className="text-center p-6 border-4 border-blue-500 bg-gradient-to-b from-blue-50 via-indigo-50 to-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      {getStrategyIcon(strategyData.secondary.strategy)}
                      <Badge className="bg-blue-600 text-white text-base font-bold mb-3 px-4 py-2">2순위 추천</Badge>
                      <h3 className="text-xl font-bold text-blue-900 mb-3 leading-tight">{strategyData.secondary.strategy}</h3>
                      <p className="text-gray-700 text-base mb-4 leading-relaxed">
                        {strategyData.secondary.successSummary}
                      </p>
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Badge variant="outline" className="text-sm font-medium">
                          {strategyData.secondary.sourceType}
                        </Badge>
                      </div>
                      <a 
                        href={strategyData.secondary.sourceLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-700 hover:text-blue-900 underline mb-4 font-medium"
                      >
                        성공사례 보기
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </a>
                      
                      {/* 전략 상세 설명 */}
                      {(() => {
                        const detail = getStrategyDetail(strategyData.secondary.strategy);
                        if (!detail) return null;
                        return (
                          <div className="mt-4 pt-4 border-t-2 border-blue-400 text-left">
                            <div className="space-y-4 text-sm">
                              <div>
                                <span className="font-bold text-blue-800 text-base">대상자:</span>
                                <p className="text-gray-700 mt-2 leading-relaxed">{detail.targetAudience}</p>
                              </div>
                              <div>
                                <span className="font-bold text-blue-800 text-base">전략 개요:</span>
                                <p className="text-gray-700 mt-2 leading-relaxed">{detail.strategyOverview}</p>
                              </div>
                              <div>
                                <span className="font-bold text-blue-800 text-base">시작 가이드:</span>
                                <p className="text-gray-700 mt-2 leading-relaxed">{detail.startGuide}</p>
                              </div>
                              <div>
                                <span className="font-bold text-blue-800 text-base">주의사항:</span>
                                <p className="text-gray-700 mt-2 leading-relaxed">{detail.precautions}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                    
                    {/* 3순위 전략 - 그린/에메랄드 테마 */}
                    <div className="text-center p-6 border-4 border-emerald-500 bg-gradient-to-b from-emerald-50 via-green-50 to-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      {getStrategyIcon(strategyData.tertiary.strategy)}
                      <Badge className="bg-emerald-600 text-white text-base font-bold mb-3 px-4 py-2">3순위 추천</Badge>
                      <h3 className="text-xl font-bold text-emerald-900 mb-3 leading-tight">{strategyData.tertiary.strategy}</h3>
                      <p className="text-gray-700 text-base mb-4 leading-relaxed">
                        {strategyData.tertiary.successSummary}
                      </p>
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Badge variant="outline" className="text-sm font-medium">
                          {strategyData.tertiary.sourceType}
                        </Badge>
                      </div>
                      <a 
                        href={strategyData.tertiary.sourceLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-emerald-700 hover:text-emerald-900 underline mb-4 font-medium"
                      >
                        성공사례 보기
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </a>
                      
                      {/* 전략 상세 설명 */}
                      {(() => {
                        const detail = getStrategyDetail(strategyData.tertiary.strategy);
                        if (!detail) return null;
                        return (
                          <div className="mt-4 pt-4 border-t-2 border-emerald-400 text-left">
                            <div className="space-y-4 text-sm">
                              <div>
                                <span className="font-bold text-emerald-800 text-base">대상자:</span>
                                <p className="text-gray-700 mt-2 leading-relaxed">{detail.targetAudience}</p>
                              </div>
                              <div>
                                <span className="font-bold text-emerald-800 text-base">전략 개요:</span>
                                <p className="text-gray-700 mt-2 leading-relaxed">{detail.strategyOverview}</p>
                              </div>
                              <div>
                                <span className="font-bold text-emerald-800 text-base">시작 가이드:</span>
                                <p className="text-gray-700 mt-2 leading-relaxed">{detail.startGuide}</p>
                              </div>
                              <div>
                                <span className="font-bold text-emerald-800 text-base">주의사항:</span>
                                <p className="text-gray-700 mt-2 leading-relaxed">{detail.precautions}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* 전략 실행 가이드 */}
                  <div className="bg-navy-50 border border-navy-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <HelpCircle className="w-5 h-5 text-navy-600" />
                      <h4 className="font-semibold text-navy-900 text-lg">전략 실행 가이드</h4>
                    </div>
                    <div className="space-y-2 text-sm text-navy-800">
                      <p>• <strong>1순위 전략</strong>부터 우선적으로 시작하세요</p>
                      <p>• <strong>2순위 전략</strong>은 1순위가 안정화된 후 고려하세요</p>
                      <p>• <strong>3순위 전략</strong>은 여유 자금이 있을 때 추가하세요</p>
                      <p>• 각 전략의 성공사례를 참고하여 구체적인 실행 계획을 세우세요</p>
                      <p>• 정기적으로 전략의 성과를 점검하고 필요시 조정하세요</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* 7. 리스크 헷지를 위한 보험 전략 */}
        <Card className="bg-white rounded-2xl shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-navy-600 to-navy-700 text-white rounded-t-2xl">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              7. 리스크 헷지를 위한 보험 전략
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {(() => {
              const insuranceRec = getInsuranceRecommendations(
                report?.personalInfo?.age || 30,
                report?.personalInfo?.familyType || '1인가구',
                (report?.incomeInfo?.monthlyIncome || 0) + (report?.incomeInfo?.spouseIncome || 0) + (report?.incomeInfo?.otherIncome || 0)
              );

              if (!insuranceRec) {
                return (
                  <div className="text-center p-8 bg-gray-50 rounded-xl">
                    <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">보험 전략</h3>
                    <p className="text-gray-600 mb-4">
                      입력하신 정보에 맞는 보험 추천을 제공할 수 없습니다.
                    </p>
                    <Badge variant="outline" className="text-sm">
                      정보 부족
                    </Badge>
                  </div>
                );
              }

              return (
                <div className="space-y-6">
                  {/* 안내 문구 카드 */}
                  <div className="bg-gradient-to-r from-navy-50 to-blue-50 border border-navy-200 p-6 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-navy-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-navy-900 mb-3">보험 전략 가이드</h4>
                        <p className="text-navy-800 leading-relaxed">
                          자산 목표를 달성하는 과정에 나와 가족에게 일어날 수 있는 위험 비용은 투자와 같습니다. 
                          귀하의 연령대, 가족구성, 소득 수준을 고려하여 필수, 추천, 비추천 보험을 참조하여 자산 리스크를 관리하세요. 
                          보험 총 지출은 월 소득의 5~10% 이내로 유지하는 걸 권장합니다. 
                          특히 비추천 보험은 현재 상황에서 불필요한 지출이므로 가입을 피하고, 
                          재검토 필요시점에 맞춰 보험 포트폴리오를 점검하시기 바랍니다.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 개인 정보 요약 */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-navy-900 mb-2">맞춤형 보험 추천 기준</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">연령대:</span>
                        <span className="font-medium">{insuranceRec.age}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">가족구성:</span>
                        <span className="font-medium">{insuranceRec.family}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">소득구간:</span>
                        <span className="font-medium">{insuranceRec.incomeRange}만원</span>
                      </div>
                    </div>
                  </div>

                  {/* 보험 추천 카테고리 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 필수 보험 */}
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <h4 className="font-semibold text-red-900 text-lg">필수 보험</h4>
                      </div>
                      <div className="space-y-2">
                        {insuranceRec.recommendations.required.map((insurance, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-red-800">{insurance}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-red-600 mt-3">
                        반드시 가입이 필요한 보험입니다.
                      </p>
                    </div>

                    {/* 추천 보험 */}
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold text-green-900 text-lg">추천 보험</h4>
                      </div>
                      <div className="space-y-2">
                        {insuranceRec.recommendations.recommended.map((insurance, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">{insurance}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-green-600 mt-3">
                        여유가 있다면 가입을 권장합니다.
                      </p>
                    </div>

                    {/* 비추천 보험 */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <X className="w-5 h-5 text-gray-600" />
                        <h4 className="font-semibold text-gray-900 text-lg">비추천 보험</h4>
                      </div>
                      <div className="space-y-2">
                        {insuranceRec.recommendations.notRecommended.slice(0, 5).map((insurance, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <X className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">{insurance}</span>
                          </div>
                        ))}
                        {insuranceRec.recommendations.notRecommended.length > 5 && (
                          <div className="text-xs text-gray-500">
                            외 {insuranceRec.recommendations.notRecommended.length - 5}개
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-3">
                        현재 상황에서는 불필요한 보험입니다. 자금 효율성을 위해 가입을 권장하지 않습니다.
                      </p>
                    </div>
                  </div>

                  {/* 상세 보험 추천 테이블 */}
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-navy-600 text-white p-4">
                      <h4 className="font-semibold text-lg">상세 보험 추천</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">보험 종류</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">추천 여부</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">설명</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {Object.entries(insuranceRec.recommendations.details).map(([insurance, status]) => (
                            <tr key={insurance} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{insurance}</td>
                              <td className="px-4 py-3 text-center">
                                <Badge 
                                  className={
                                    status === '필수' ? 'bg-red-100 text-red-800' :
                                    status === '추천' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                  }
                                >
                                  {status}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {status === '필수' && '반드시 가입이 필요한 보험입니다. 기본적인 위험 대비를 위해 필수적입니다.'}
                                {status === '추천' && '여유가 있다면 가입을 권장합니다. 추가적인 보장을 제공합니다.'}
                                {status === '비추천' && '현재 상황에서는 불필요한 보험입니다. 자금 효율성을 위해 가입을 권장하지 않습니다.'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 재검토 필요시점 */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900 text-lg">재검토 필요시점</h4>
                    </div>
                    <div className="space-y-2 text-sm text-blue-800">
                      <p className="font-medium">{insuranceRec.reviewNeeded}</p>
                      <p className="text-xs text-blue-600 mt-2">
                        위 시점에 도달하면 보험 포트폴리오를 재검토하여 필요에 따라 조정하시기 바랍니다.
                      </p>
                    </div>
                  </div>

                  {/* 보험 가입 가이드 */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <HelpCircle className="w-5 h-5 text-yellow-600" />
                      <h4 className="font-semibold text-yellow-900 text-lg">보험 가입 가이드</h4>
                    </div>
                    <div className="space-y-2 text-sm text-yellow-800">
                      <p>• <strong>필수 보험</strong>부터 우선적으로 가입하세요</p>
                      <p>• <strong>추천 보험</strong>은 여유 자금이 있을 때 고려하세요</p>
                      <p>• <strong>비추천 보험</strong>은 현재 상황에서 불필요하므로 가입을 피하세요</p>
                      <p>• 보험료는 월 소득의 10% 이내로 유지하는 것이 좋습니다</p>
                      <p>• 정기적으로 보험 포트폴리오를 점검하고 조정하세요</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* 바로가기 버튼 섹션 */}
        <div className="mt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* 부자상품 카드 */}
            <Link to="/products">
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center min-h-[260px]">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-2">부자상품</h4>
                <p className="text-base mb-6">맞춤형 투자 상품으로 자산을 증대시키세요</p>
                <button className="mt-auto bg-white/30 hover:bg-white/40 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 text-base transition">
                  상품 둘러보기
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </button>
              </div>
            </Link>
            {/* 부자코칭 카드 */}
            <Link to="/coaching">
              <div className="bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center min-h-[260px]">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-2">부자코칭</h4>
                <p className="text-base mb-6">전문가와 함께 맞춤형 재무 계획을 세우세요</p>
                <button className="mt-auto bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 text-base transition">
                  코칭 신청하기
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </button>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 재무건전성 상세 정보 다이얼로그 */}
      <Dialog open={showHealthDetail} onOpenChange={setShowHealthDetail}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              재무건전성 평가 상세 분석
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 overflow-y-auto max-h-[calc(80vh-120px)] pr-2">
            {/* 종합 점수 */}
            <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {report?.summary?.financialHealth?.score || 0}점
              </div>
              <div className="text-lg font-semibold text-gray-700 mb-1">
                {report?.summary?.financialHealth?.level === 'excellent' ? '매우 양호' :
                 report?.summary?.financialHealth?.level === 'good' ? '양호' :
                 report?.summary?.financialHealth?.level === 'fair' ? '보통' : '개선 필요'}
              </div>
              <div className="text-sm text-gray-600">
                {report?.summary?.financialHealth?.description || '재무 상태를 평가합니다.'}
              </div>
            </div>

            {/* 평가 항목별 상세 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-navy-900">평가 항목별 분석</h3>
              
              {/* 저축률 평가 */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">저축률 평가</span>
                  <Badge className="bg-blue-100 text-blue-800">30점 만점</Badge>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  월 소득 대비 저축 가능액의 비율을 평가합니다.
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>현재 저축률:</span>
                    <span className="font-medium">
                      {report?.summary?.financialHealth?.detail?.savingsRate?.toFixed(1) || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>월 소득:</span>
                    <span className="font-medium">{formatCurrency(report?.incomeInfo?.monthlyIncome || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>월 저축액:</span>
                    <span className="font-medium">{formatCurrency(report?.summary?.monthlySavings || 0)}</span>
                  </div>
                </div>
              </div>

              {/* 부채비율 평가 */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">부채비율 평가</span>
                  <Badge className="bg-green-100 text-green-800">30점 만점</Badge>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  총 자산 대비 총 부채의 비율을 평가합니다.
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>현재 부채비율:</span>
                    <span className="font-medium">
                      {report?.summary?.financialHealth?.detail?.debtRatio?.toFixed(1) || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>총 자산:</span>
                    <span className="font-medium">{formatCurrency((report?.assetInfo?.savings || 0) + (report?.assetInfo?.investments || 0) + (report?.assetInfo?.realEstate || 0) + (report?.assetInfo?.car || 0) + (report?.assetInfo?.retirement || 0) + (report?.assetInfo?.otherAssets || 0))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>총 부채:</span>
                    <span className="font-medium">{formatCurrency((report?.assetInfo?.creditLoan || 0) + (report?.assetInfo?.depositLoan || 0) + (report?.assetInfo?.mortgageLoan || 0) + (report?.assetInfo?.studentLoan || 0) + (report?.assetInfo?.otherDebt || 0))}</span>
                  </div>
                </div>
              </div>

              {/* 월 저축 가능액 평가 */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">월 저축 가능액 평가</span>
                  <Badge className="bg-orange-100 text-orange-800">40점 만점</Badge>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  월 저축 가능액의 절대적 금액과 적정성을 평가합니다.
                </div>
                                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>월 저축액:</span>
                      <span className="font-medium">{formatCurrency(report?.summary?.monthlySavings || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>권장 월 저축액:</span>
                      <span className="font-medium">{formatCurrency((report?.incomeInfo?.monthlyIncome || 0) * getRecommendedSavingsRate(report?.personalInfo?.age || 30, report?.personalInfo?.familyType || 'single'))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>저축 적정성:</span>
                      <span className="font-medium">
                        {(report?.summary?.monthlySavings || 0) >= ((report?.incomeInfo?.monthlyIncome || 0) * getRecommendedSavingsRate(report?.personalInfo?.age || 30, report?.personalInfo?.familyType || 'single')) ? '적정' : '부족'}
                      </span>
                    </div>
                    <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                      <div className="font-medium mb-1">권장 기준:</div>
                      <div>• 나이: {getAgeGroup(report?.personalInfo?.age || 30)} ({getRecommendedSavingsRate(report?.personalInfo?.age || 30, report?.personalInfo?.familyType || 'single') * 100}%)</div>
                      <div>• 가족구성: {getFamilyDescription(report?.personalInfo?.familyType || 'single')} (입력값: {report?.personalInfo?.familyType || '없음'})</div>
                      <div>• 기준: {getSavingsRateDescription(report?.personalInfo?.age || 30, report?.personalInfo?.familyType || 'single')}</div>
                    </div>
                  </div>
              </div>
            </div>

            {/* 개선 권장사항 */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">개선 권장사항</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                {report?.summary?.financialHealth?.score < 80 && (
                  <li>• 저축률을 20% 이상으로 높이기 위해 지출을 점검하세요</li>
                )}
                {report?.summary?.financialHealth?.detail?.debtRatio > 40 && (
                  <li>• 부채비율이 높습니다. 부채 상환을 우선시하세요</li>
                )}
                {report?.summary?.financialHealth?.detail?.savingRatio < 20 && (
                  <li>• 월 저축 가능액을 늘리기 위해 수입 증대나 지출 절감을 고려하세요</li>
                )}
                {report?.summary?.financialHealth?.score >= 80 && (
                  <li>• 현재 양호한 재무 상태를 유지하세요</li>
                )}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 로그인 모달 */}
      <Dialog open={showAuthPrompt} onOpenChange={setShowAuthPrompt}>
          <DialogContent className="max-w-[380px] text-center">
            <div className="text-lg font-bold text-sky-700 mb-6">로그인 또는 회원가입을 하세요</div>
            <div className="flex gap-4 justify-center">
                             <button onClick={() => { setShowLogin(true); setShowAuthPrompt(false); }} className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">로그인</button>
               <button onClick={() => { setShowAuthPrompt(false); }} className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition">회원가입</button>
            </div>
          </DialogContent>
        </Dialog>
                 <MembersLoginDialog open={showLogin} onOpenChange={setShowLogin} onLoginSuccess={handleLoginSuccess} />
    </div>
  );
};

export default FinanceDiagnosisResultPage; 