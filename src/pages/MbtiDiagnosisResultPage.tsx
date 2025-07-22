import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  TrendingUp, 
  Target, 
  Lightbulb, 
  Shield, 
  Zap,
  Users,
  BarChart3,
  PiggyBank,
  Star,
  Award,
  BookOpen,
  Share2,
  Download,
  Copy,
  Printer,
  Bookmark
} from "lucide-react";
import Header from "@/components/Header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import {
  estjLongReport,
  estpLongReport,
  esfjLongReport,
  esfpLongReport,
  entjLongReport,
  entpLongReport,
  enfjLongReport,
  enfpLongReport,
  istjLongReport,
  istpLongReport,
  isfjLongReport,
  isfpLongReport,
  intjLongReport,
  intpLongReport,
  infjLongReport,
  infpLongReport
} from "@/data/mbtiReports";
import DimensionGraph from "@/components/ui/dimension-graph";
import FactorsGraph from "@/components/ui/factors-graph";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { motion } from "framer-motion";
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import LoginDialog from '@/components/LoginDialog';
import SignupDialog from '@/components/SignupDialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import MembersLoginDialog from '@/components/MembersLoginDialog';

// MBTI 유형별 데이터 정의
const mbtiTypes = {
  "ISTJ": {
    name: "신중한 계획가",
    description: "체계적이고 안정적인 재무 관리로 꾸준한 부자",
    strengths: ["체계적인 예산 관리", "안정적인 투자", "위험 회피 성향"],
    weaknesses: ["보수적인 투자", "기회 놓치기 쉬움", "유연성 부족"],
    investmentStyle: "안정성 중심의 분산 투자",
    recommendedProducts: ["정기예금", "국채", "안정적인 펀드"],
    financialAdvice: [
      "월별 예산 계획을 세워 체계적으로 관리하세요",
      "비상금을 충분히 마련하여 안정성을 확보하세요",
      "소액부터 시작하여 투자 경험을 쌓아보세요"
    ],
    riskLevel: 2,
    growthPotential: 7,
    stabilityScore: 9
  },
  "ISFJ": {
    name: "배려하는 관리자",
    description: "가족과 미래를 생각하는 보수적 부자",
    strengths: ["가족 중심의 재무 계획", "꾸준한 저축", "책임감 있는 관리"],
    weaknesses: ["과도한 보수성", "자신감 부족", "타인 의존"],
    investmentStyle: "가족 안정을 위한 보수적 투자",
    recommendedProducts: ["보험 상품", "교육 저축", "안정적 펀드"],
    financialAdvice: [
      "가족을 위한 보험을 충분히 가입하세요",
      "자녀 교육비를 미리 준비하세요",
      "소액 투자로 시작하여 점진적으로 확대하세요"
    ],
    riskLevel: 2,
    growthPotential: 6,
    stabilityScore: 8
  },
  "INFJ": {
    name: "통찰력 있는 이상주의자",
    description: "가치관과 의미를 중시하는 이상적 부자",
    strengths: ["깊은 통찰력", "가치 중심 투자", "장기적 비전"],
    weaknesses: ["현실성 부족", "감정적 결정", "완벽주의"],
    investmentStyle: "가치와 의미를 중시하는 투자",
    recommendedProducts: ["ESG 투자", "사회적 기업", "문화 예술 투자"],
    financialAdvice: [
      "자신의 가치관에 맞는 투자를 찾아보세요",
      "감정적 결정보다는 논리적 분석을 하세요",
      "장기적 관점에서 투자 계획을 세우세요"
    ],
    riskLevel: 4,
    growthPotential: 8,
    stabilityScore: 6
  },
  "INTJ": {
    name: "전략적 사상가",
    description: "전략적 사고로 체계적 부자",
    strengths: ["전략적 사고", "독립적 판단", "장기 계획"],
    weaknesses: ["과도한 분석", "타인과의 협력 부족", "완벽주의"],
    investmentStyle: "전략적이고 체계적인 투자",
    recommendedProducts: ["주식 투자", "부동산", "벤처 투자"],
    financialAdvice: [
      "체계적인 투자 전략을 수립하세요",
      "다양한 정보를 수집하여 분석하세요",
      "장기적 관점에서 투자 결정을 하세요"
    ],
    riskLevel: 6,
    growthPotential: 9,
    stabilityScore: 7
  },
  "ISTP": {
    name: "실용적인 문제해결사",
    description: "실용적이고 유연한 현실적 부자",
    strengths: ["실용적 판단", "유연한 대응", "위기 대처 능력"],
    weaknesses: ["장기 계획 부족", "일관성 부족", "감정적 결정"],
    investmentStyle: "실용적이고 유연한 투자",
    recommendedProducts: ["단기 투자", "현물 투자", "기술 주식"],
    financialAdvice: [
      "실용적인 투자 기회를 찾아보세요",
      "유연하게 시장 변화에 대응하세요",
      "단기 목표부터 설정하여 점진적으로 확대하세요"
    ],
    riskLevel: 5,
    growthPotential: 7,
    stabilityScore: 6
  },
  "ISFP": {
    name: "예술적인 모험가",
    description: "개성과 자유를 추구하는 창의적 부자",
    strengths: ["창의적 사고", "직관적 판단", "개성 있는 선택"],
    weaknesses: ["계획성 부족", "감정적 결정", "일관성 부족"],
    investmentStyle: "개성과 창의성을 중시하는 투자",
    recommendedProducts: ["문화 예술 투자", "창업", "개성 있는 상품"],
    financialAdvice: [
      "자신의 개성에 맞는 투자를 찾아보세요",
      "감정적 결정보다는 객관적 분석을 하세요",
      "창의적인 수입원을 개발해보세요"
    ],
    riskLevel: 6,
    growthPotential: 8,
    stabilityScore: 4
  },
  "INFP": {
    name: "열정적인 이상주의자",
    description: "가치와 열정을 중시하는 이상적 부자",
    strengths: ["열정적 추진력", "가치 중심 사고", "창의적 아이디어"],
    weaknesses: ["현실성 부족", "감정적 결정", "일관성 부족"],
    investmentStyle: "가치와 열정을 중시하는 투자",
    recommendedProducts: ["사회적 기업", "창업", "문화 예술"],
    financialAdvice: [
      "자신의 가치관에 맞는 투자를 찾아보세요",
      "열정을 수입으로 연결해보세요",
      "감정적 결정보다는 논리적 분석을 하세요"
    ],
    riskLevel: 7,
    growthPotential: 9,
    stabilityScore: 4
  },
  "INTP": {
    name: "논리적인 사상가",
    description: "논리적 분석으로 체계적 부자",
    strengths: ["논리적 분석", "독립적 사고", "깊은 이해"],
    weaknesses: ["실행력 부족", "감정적 판단", "타인과의 협력"],
    investmentStyle: "논리적 분석을 바탕으로 한 투자",
    recommendedProducts: ["주식 투자", "기술 주식", "연구 개발 투자"],
    financialAdvice: [
      "체계적인 분석을 통해 투자 결정을 하세요",
      "논리적 사고를 바탕으로 한 투자 전략을 세우세요",
      "독립적 판단을 유지하되 전문가 조언도 참고하세요"
    ],
    riskLevel: 5,
    growthPotential: 8,
    stabilityScore: 6
  },
  "ESTP": {
    name: "활동적인 모험가",
    description: "활동적이고 모험적인 도전적 부자",
    strengths: ["활동적 추진력", "위기 대처 능력", "실용적 판단"],
    weaknesses: ["장기 계획 부족", "성급한 결정", "일관성 부족"],
    investmentStyle: "활동적이고 모험적인 투자",
    recommendedProducts: ["부동산 투자", "창업", "고위험 고수익 상품"],
    financialAdvice: [
      "활동적으로 투자 기회를 찾아보세요",
      "위험을 감수하되 체계적인 분석을 하세요",
      "단기 성과보다는 장기적 관점을 유지하세요"
    ],
    riskLevel: 8,
    growthPotential: 9,
    stabilityScore: 4
  },
  "ESFP": {
    name: "사교적인 연예인",
    description: "사교적이고 낙관적인 인맥 부자",
    strengths: ["사교성", "낙관적 태도", "인맥 활용"],
    weaknesses: ["계획성 부족", "감정적 결정", "일관성 부족"],
    investmentStyle: "사교성과 인맥을 활용한 투자",
    recommendedProducts: ["네트워크 비즈니스", "서비스업", "엔터테인먼트"],
    financialAdvice: [
      "인맥을 활용한 비즈니스 기회를 찾아보세요",
      "사교성을 활용한 네트워킹을 하세요",
      "감정적 결정보다는 객관적 분석을 하세요"
    ],
    riskLevel: 6,
    growthPotential: 8,
    stabilityScore: 5
  },
  "ENFP": {
    name: "열정적인 영감가",
    description: "열정과 창의성으로 혁신적 부자",
    strengths: ["열정적 추진력", "창의적 아이디어", "사람들과의 소통"],
    weaknesses: ["일관성 부족", "감정적 결정", "실행력 부족"],
    investmentStyle: "열정과 창의성을 중시하는 투자",
    recommendedProducts: ["창업", "혁신 기업", "창의적 비즈니스"],
    financialAdvice: [
      "열정을 수입으로 연결해보세요",
      "창의적인 아이디어를 비즈니스로 발전시키세요",
      "일관성 있는 실행 계획을 세우세요"
    ],
    riskLevel: 7,
    growthPotential: 9,
    stabilityScore: 4
  },
  "ENTP": {
    name: "혁신적인 사상가",
    description: "혁신적 사고로 창의적 부자",
    strengths: ["혁신적 사고", "전략적 판단", "도전 정신"],
    weaknesses: ["일관성 부족", "성급한 결정", "감정적 판단"],
    investmentStyle: "혁신적이고 전략적인 투자",
    recommendedProducts: ["벤처 투자", "기술 주식", "창업"],
    financialAdvice: [
      "혁신적인 투자 기회를 찾아보세요",
      "전략적 사고를 바탕으로 한 투자 결정을 하세요",
      "도전 정신을 유지하되 체계적인 분석을 하세요"
    ],
    riskLevel: 8,
    growthPotential: 9,
    stabilityScore: 5
  },
  "ESTJ": {
    name: "효율적인 관리자",
    description: "효율적 관리로 체계적 부자",
    strengths: ["효율적 관리", "체계적 실행", "책임감"],
    weaknesses: ["유연성 부족", "보수적 성향", "타인과의 갈등"],
    investmentStyle: "효율적이고 체계적인 투자",
    recommendedProducts: ["안정적 펀드", "부동산", "기업 투자"],
    financialAdvice: [
      "체계적인 투자 계획을 수립하세요",
      "효율적인 자산 관리를 하세요",
      "안정성을 중시하되 성장 기회도 놓치지 마세요"
    ],
    riskLevel: 4,
    growthPotential: 7,
    stabilityScore: 8
  },
  "ESFJ": {
    name: "사교적인 조력자",
    description: "사교성과 협력으로 인맥 부자",
    strengths: ["사교성", "협력 정신", "조직 관리 능력"],
    weaknesses: ["독립적 판단 부족", "갈등 회피", "보수적 성향"],
    investmentStyle: "협력과 네트워킹을 중시하는 투자",
    recommendedProducts: ["네트워크 비즈니스", "서비스업", "협동조합"],
    financialAdvice: [
      "인맥을 활용한 비즈니스 기회를 찾아보세요",
      "협력 관계를 통한 투자 기회를 개발하세요",
      "조직 관리 능력을 활용한 사업을 고려해보세요"
    ],
    riskLevel: 5,
    growthPotential: 7,
    stabilityScore: 7
  },
  "ENFJ": {
    name: "카리스마 있는 지도자",
    description: "리더십과 비전으로 영향력 있는 부자",
    strengths: ["리더십", "비전 제시", "사람들과의 소통"],
    weaknesses: ["과도한 이상주의", "감정적 결정", "완벽주의"],
    investmentStyle: "리더십과 비전을 중시하는 투자",
    recommendedProducts: ["기업 투자", "교육 사업", "사회적 기업"],
    financialAdvice: [
      "리더십을 활용한 비즈니스 기회를 찾아보세요",
      "비전을 가진 투자 프로젝트에 참여하세요",
      "사람들과의 소통을 통한 네트워킹을 하세요"
    ],
    riskLevel: 6,
    growthPotential: 8,
    stabilityScore: 6
  },
  "ENTJ": {
    name: "대담한 지도자",
    description: "대담한 리더십으로 영향력 있는 부자",
    strengths: ["대담한 리더십", "전략적 사고", "결단력"],
    weaknesses: ["과도한 독재적 성향", "타인과의 갈등", "감정적 판단"],
    investmentStyle: "대담하고 전략적인 투자",
    recommendedProducts: ["기업 인수", "벤처 투자", "고위험 고수익 상품"],
    financialAdvice: [
      "대담한 투자 결정을 하되 체계적인 분석을 하세요",
      "전략적 사고를 바탕으로 한 투자 전략을 세우세요",
      "리더십을 활용한 비즈니스 기회를 개발하세요"
    ],
    riskLevel: 8,
    growthPotential: 9,
    stabilityScore: 6
  }
};

interface DimensionScores {
  ei: { e: number; i: number };
  sn: { s: number; n: number };
  tf: { t: number; f: number };
  jp: { j: number; p: number };
}

interface Factors {
  psychological: number;
  behavioral: number;
  financial: number;
  environmental: number;
}

// MBTI별 컨셉명, 핵심요약, 대표 행동 개선 방향 매핑
const mbtiSummaryTable = {
  ENFJ: {
    concept: '비전형 자산 리더',
    summary: '이상적 리더형, 실행력과 관계 기반 자산 설계 우수',
    action: '타인을 위한 소비를 줄이고, 나만의 재무 목표를 구체화하세요.'
  },
  ENTJ: {
    concept: '승부사형 전략가',
    summary: '전략 설계와 실행력 최고, 복리 성장 최적화',
    action: '큰 그림만 보지 말고, 단기 예산 관리를 병행하세요.'
  },
  ENFP: {
    concept: '기회 감지 탐험가',
    summary: '기회 포착 강하지만 루틴 약함, 실천력 보완 필요',
    action: '아이디어는 넘치니, 자동이체 설정으로 실천부터 시작해보세요.'
  },
  INFJ: {
    concept: '가치 중심 자산 설계자',
    summary: '가치 기반 계획형, 지속 실행력 보완 시 강력',
    action: '타인의 재무 걱정보다, 자신의 자산 증대에 집중하세요.'
  },
  INTJ: {
    concept: '복리 설계 전략가',
    summary: '복리 설계 최적화, 동시 실행력 보완 시 성장',
    action: '부문 신중함 경향이 있으므로, 분산 투자로 습관부터 시작해보세요.'
  },
  ESFJ: {
    concept: '생활밀착 재무 관리자',
    summary: '책임형 설계자, 자기 중심 목표 설계 필요',
    action: '감정적 소비 습관을 체크하고 저축 자동화를 시도해보세요.'
  },
  ENTP: {
    concept: '자산화 기획 창조자',
    summary: '실행은 빠르나 구조화 부족, 수입 다변화 강점',
    action: '아이디어는 많은데 실천이 부족하므로, 자동이체 설정부터 시작해봐요.'
  },
  INFP: {
    concept: '감성형 자산 설계자',
    summary: '감정 중심 소비, 루틴화와 절제력 필요',
    action: '감정적 소비 습관을 체크하고 목표 지향적 소비로 전환해보세요.'
  },
  ISFJ: {
    concept: '안정형 축적가',
    summary: '보수형 자산 유지, 안정적 자산 설계 특화',
    action: '위험 회피 성향이 강해요. 안정형 투자로 시작해보세요.'
  },
  ESTJ: {
    concept: '전략 실행형 관리자',
    summary: '실천력 강한 루틴형, 성장형 자산 접근 시 탁월',
    action: '저축은 잘하지만 자산을 늘릴 투자도 고민해보세요.'
  },
  INTP: {
    concept: '분석형 루틴 설계자',
    summary: '분석력 탁월, 실행력과 반복 루틴 약함',
    action: '현상 유지에 머물지 말고, 자동이체 등 실천 루틴에 도전해보세요.'
  },
  ISTJ: {
    concept: '보수적 자산 수호자',
    summary: '보수형 투자, 안정 자산 설계 특화',
    action: '재무적 계획 수립부터 시작하세요. 숫자 감각은 충분합니다.'
  },
  ISFP: {
    concept: '감성 중심 소비 설계자',
    summary: '감성 소비 중심, 루틴화와 절제력 필요',
    action: '감정 소비 습관을 체크하고 목표 지향적 소비로 전환해보세요.'
  },
  ESFP: {
    concept: '관계형 습관 구축자',
    summary: '관계 중심 소비, 루틴화와 습관 구조화 필요',
    action: '관계 소비 습관을 체크하고 자동이체로 습관을 만들어보세요.'
  },
  ESTP: {
    concept: '기회형 즉응 투자자',
    summary: '즉흥 실행력 강하나 자산 누적 구조 취약',
    action: '즉흥 투자보다 계획적 자산 배분이 필요해요.'
  },
  ISTP: {
    concept: '실전형 미니멀플레이어',
    summary: '일관성 단기 실행형, 장기 설계와 루틴 약함',
    action: '재무적 계획 수립부터 시작하세요. 숫자 감각은 충분합니다.'
  }
};

// MBTI별 현재/미래 부자지수 및 순위 데이터
const mbtiScoreRankTable = [
  { type: 'ENFJ', current: 82, currentRank: 4, future: 92, futureRank: 1 },
  { type: 'ENTJ', current: 84, currentRank: 1, future: 90, futureRank: 2 },
  { type: 'ENFP', current: 68, currentRank: 12, future: 88, futureRank: 3 },
  { type: 'INFJ', current: 76, currentRank: 7, future: 86, futureRank: 4 },
  { type: 'INTJ', current: 83, currentRank: 2, future: 85, futureRank: 5 },
  { type: 'ESFJ', current: 76, currentRank: 8, future: 84, futureRank: 6 },
  { type: 'ENTP', current: 70, currentRank: 10, future: 83, futureRank: 7 },
  { type: 'INFP', current: 69, currentRank: 11, future: 81, futureRank: 8 },
  { type: 'ISFJ', current: 78, currentRank: 6, future: 80, futureRank: 9 },
  { type: 'ESTJ', current: 78, currentRank: 5, future: 79, futureRank: 10 },
  { type: 'INTP', current: 73, currentRank: 9, future: 78, futureRank: 11 },
  { type: 'ISTJ', current: 75, currentRank: 8, future: 75, futureRank: 12 },
  { type: 'ISFP', current: 64, currentRank: 15, future: 72, futureRank: 13 },
  { type: 'ESFP', current: 61, currentRank: 16, future: 71, futureRank: 14 },
  { type: 'ESTP', current: 65, currentRank: 14, future: 68, futureRank: 15 },
  { type: 'ISTP', current: 68, currentRank: 13, future: 65, futureRank: 16 },
];

const MbtiDiagnosisResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mbtiType, setMbtiType] = useState<string>("");
  const [dimensionScores, setDimensionScores] = useState<DimensionScores | null>(null);
  const [factors, setFactors] = useState<Factors | null>(null);
  const [answers, setAnswers] = useState<number[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const { toast } = useToast();
  const { user, login } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // 출력 버튼 핸들러
  const handlePrintWithAuth = () => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    window.print();
  };

  // 공유 버튼 핸들러
  const handleShareWithAuth = () => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    setShowShare(v => !v);
  };
  // MBTI 진단 결과 저장 함수
  const saveMbtiDiagnosis = async () => {
    try {
      if (!user) throw new Error('로그인 필요');
      if (!answers || !dimensionScores || !factors || !mbtiType) throw new Error('진단 데이터가 올바르지 않습니다.');
      // member_id는 payload에서 제거 (Supabase가 기본값 auth.uid() 자동 사용)
      const payload = {
        user_id: user.user_id, // 닉네임 등
        responses: JSON.stringify(answers),
        result_type: mbtiType,
        report_content: JSON.stringify({ dimensionScores, factors }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      console.log('MBTI 저장 user:', user);
      console.log('MBTI 저장 payload:', payload);
      const { error } = await supabase.from('mbti_diagnosis').insert([payload]);
      if (error) throw error;
      toast({ title: '저장 완료', description: '마이페이지에서 확인하세요.' });
      navigate('/mypage?tab=diagnosis');
    } catch (error: any) {
      console.error('supabase insert error:', error);
      toast({ title: '저장 실패', description: error.message || '알 수 없는 오류가 발생했습니다.' });
    }
  };

  // 저장 버튼 클릭 핸들러
  const handleSave = async () => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    await saveMbtiDiagnosis();
  };

  // 로그인/회원가입 성공 시 후처리
  const handleLoginSuccess = async (userData: any) => {
    setShowLogin(false);
    setShowSignup(false);
    setShowAuthPrompt(false);
    await login(userData);
    // user 상태가 null이 아니게 된 뒤에만 저장 (최대 1초까지 재시도)
    let tries = 0;
    const trySave = () => {
      if (user) {
        saveMbtiDiagnosis();
      } else if (tries < 10) {
        tries++;
        setTimeout(trySave, 100);
      } else {
        toast({ title: '로그인 정보 동기화 실패', description: '잠시 후 다시 시도해 주세요.' });
      }
    };
    trySave();
  };

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
        // 카카오톡 공식 공유 URL (카카오톡 로그인 및 공유 페이지로 이동)
        url = `https://sharer.kakao.com/talk/friends/picker/link?url=${encodedUrl}`;
        window.open(url, '_blank');
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        window.open(url, '_blank');
        break;
      case 'x':
        // X(트위터) 공식 공유 URL
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

  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const type = params.get('type');
      const dimensionScoresStr = params.get('dimensionScores');
      const factorsStr = params.get('factors');
      const answersStr = params.get('answers');
      
      if (type && mbtiTypes[type as keyof typeof mbtiTypes]) {
        setMbtiType(type);
        if (dimensionScoresStr) {
          try {
            const dimensionScoresObj = JSON.parse(decodeURIComponent(dimensionScoresStr));
            setDimensionScores(dimensionScoresObj);
          } catch (e) {
            console.error('Failed to parse dimensionScores:', e);
          }
        }
        if (factorsStr) {
          try {
            const factorsObj = JSON.parse(decodeURIComponent(factorsStr));
            setFactors(factorsObj);
          } catch (e) {
            console.error('Failed to parse factors:', e);
          }
        }
        let answersObj = null;
        if (answersStr) {
          try {
            answersObj = JSON.parse(decodeURIComponent(answersStr));
          } catch (e) {
            console.error('Failed to parse answers:', e);
          }
        }
        if (!answersObj) {
          // localStorage에서 불러오기
          try {
            const localAnswers = localStorage.getItem("mbtiAnswers");
            if (localAnswers) {
              answersObj = JSON.parse(localAnswers);
            }
          } catch (e) {
            console.error('Failed to load answers from localStorage:', e);
          }
        }
        if (answersObj) setAnswers(answersObj);
      } else {
        navigate('/');
        return;
      }
    } catch (error) {
      console.error('Error parsing URL parameters:', error);
      navigate('/');
      return;
    }
    
    setIsLoading(false);
  }, [location, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">결과를 분석하고 있습니다...</p>
        </div>
      </div>
    );
  }

  // MBTI 유형별 리포트 데이터 가져오기
  const getLongReport = (type: string) => {
    switch (type) {
      case 'ESTJ': return estjLongReport;
      case 'ESTP': return estpLongReport;
      case 'ESFJ': return esfjLongReport;
      case 'ESFP': return esfpLongReport;
      case 'ENTJ': return entjLongReport;
      case 'ENTP': return entpLongReport;
      case 'ENFJ': return enfjLongReport;
      case 'ENFP': return enfpLongReport;
      case 'ISTJ': return istjLongReport;
      case 'ISTP': return istpLongReport;
      case 'ISFJ': return isfjLongReport;
      case 'ISFP': return isfpLongReport;
      case 'INTJ': return intjLongReport;
      case 'INTP': return intpLongReport;
      case 'INFJ': return infjLongReport;
      case 'INFP': return infpLongReport;
      default: return null;
    }
  };

  const report = getLongReport(mbtiType);
  const result = mbtiTypes[mbtiType as keyof typeof mbtiTypes];

  if (!report || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600">유효하지 않은 MBTI 유형입니다.</p>
        </div>
      </div>
    );
  }

  // 총점, 현재/미래 부자지수, 총평 계산
  let totalScore = null;
  let totalScore100 = null;
  let currentWealthIndex = null;
  let futureWealthIndex = null;
  let summaryText = '';
  if (answers && Array.isArray(answers) && answers.length === 31 && factors) {
    totalScore = answers.reduce((a, b) => a + b, 0);
    totalScore100 = Math.round((totalScore / 155) * 1000) / 10; // 100점 만점 환산, 소수점 1자리
    currentWealthIndex = totalScore100; // 현재 부자지수는 100점 만점 환산 점수와 동일
    futureWealthIndex = Math.round(((factors.behavioral + factors.environmental) / 2) * 10) / 10; // 0~100, 소수점 1자리
    if (currentWealthIndex >= 80 && futureWealthIndex >= 80) summaryText = '이미 높은 부자지수를 가지고 있습니다!';
    else if (currentWealthIndex >= 80) summaryText = '현재 부자지수는 높지만, 미래 성장도 신경써보세요!';
    else if (futureWealthIndex >= 80) summaryText = '미래 성장 가능성이 매우 높습니다!';
    else if (currentWealthIndex >= 60) summaryText = '평균 이상의 부자지수입니다. 꾸준히 관리해보세요!';
    else summaryText = '지금부터 차근차근 부자습관을 만들어가면 충분히 성장할 수 있습니다!';
  }

  // 내 유형 강조를 위해 데이터에 색상/크기 속성 추가 (함수 대신 데이터에 직접 할당)
  const enhancedScoreRankTable = mbtiScoreRankTable.map(row => ({
    ...row,
    isMe: row.type === mbtiType
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <Header />
      <motion.div
        className="container mx-auto px-4 py-8 max-w-4xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* 리포트 상단 인쇄/공유/저장 버튼 */}
        <div className="flex justify-end items-center gap-4 mb-6">
          <button onClick={handlePrintWithAuth} title="인쇄하기" className="p-3 rounded-full bg-white shadow hover:bg-purple-100 transition flex items-center justify-center">
            <Printer className="w-7 h-7 text-purple-600" />
          </button>
          <div className="relative">
            <button onClick={handleShareWithAuth} title="공유하기" className="p-3 rounded-full bg-white shadow hover:bg-blue-100 transition flex items-center justify-center">
              <Share2 className="w-7 h-7 text-blue-600" />
            </button>
            {showShare && (
              <div className="absolute right-0 top-full mt-3 z-50 bg-sky-50/95 border-3 border-sky-300 rounded-4xl shadow-3xl py-10 px-10 flex flex-col items-center min-w-[500px] max-w-[95vw] gap-7 animate-fade-in-up">
                <button onClick={() => setShowShare(false)} className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-200 transition" title="닫기">
                  <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="flex flex-row justify-center items-center gap-10 mb-6">
                  <button onClick={() => handleShareSNS('kakao')} className="hover:scale-110 transition" title="카카오톡">
                    <svg className="w-16 h-16" viewBox="0 0 24 24"><ellipse fill="#FEE500" cx="12" cy="12" rx="12" ry="12"/><path d="M12 6.5c-3.59 0-6.5 2.15-6.5 4.8 0 1.53 1.13 2.88 2.87 3.74l-.3 2.13a.5.5 0 00.74.52l2.5-1.36c.23.02.47.03.7.03 3.59 0 6.5-2.15 6.5-4.8S15.59 6.5 12 6.5z" fill="#391B1B"/></svg>
                  </button>
                  <button onClick={() => handleShareSNS('facebook')} className="hover:scale-110 transition" title="페이스북">
                    <svg className="w-16 h-16" viewBox="0 0 24 24"><circle fill="#1877F3" cx="12" cy="12" r="12"/><path d="M15.12 8.5h-1.25c-.19 0-.37.18-.37.37v1.13h1.62l-.21 1.62h-1.41V17h-1.75v-5.38h-1.13v-1.62h1.13v-1.13c0-1.13.75-2 2-2h1.25v1.63z" fill="#fff"/></svg>
                  </button>
                  <button onClick={() => handleShareSNS('x')} className="hover:scale-110 transition" title="X(엑스)">
                    {/* X(엑스) 아이콘 SVG */}
                    <svg className="w-16 h-16" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="1200" height="1227" rx="200" fill="#000"/>
                      <path d="M860 320H740L600 540L460 320H340L540 620L340 907H460L600 687L740 907H860L660 620L860 320Z" fill="#fff"/>
                    </svg>
                  </button>
                  <button onClick={() => handleShareSNS('instagram')} className="hover:scale-110 transition" title="인스타그램">
                    <svg className="w-16 h-16" viewBox="0 0 24 24"><radialGradient id="ig" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fdf497"/><stop offset="45%" stopColor="#fdf497"/><stop offset="60%" stopColor="#fd5949"/><stop offset="90%" stopColor="#d6249f"/><stop offset="100%" stopColor="#285AEB"/></radialGradient><circle fill="url(#ig)" cx="12" cy="12" r="12"/><path d="M16.5 7.5a1 1 0 11-2 0 1 1 0 012 0zm-4.5 1.25A3.25 3.25 0 1015.25 12 3.25 3.25 0 0012 8.75zm0 5.25A2 2 0 1114 12a2 2 0 01-2 2zm4.5-5.25a.75.75 0 10.75.75.75.75 0 00-.75-.75z" fill="#fff"/></svg>
                  </button>
                </div>
                <div className="flex flex-row items-center gap-4 w-full bg-white rounded-lg px-5 py-4">
                  <input type="text" readOnly value={shareUrl} className="flex-1 bg-transparent text-gray-700 text-lg font-semibold outline-none cursor-pointer select-all" onClick={e => (e.target as HTMLInputElement).select()} />
                  <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 min-w-[80px] rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-base whitespace-nowrap">
                    <Copy className="w-6 h-6" />{copied ? '복사됨!' : '복사'}
                  </button>
                </div>
              </div>
            )}
          </div>
          <button onClick={handleSave} title="마이페이지에 저장" className="p-3 rounded-full bg-white shadow hover:bg-green-100 transition flex items-center justify-center">
            <Bookmark className="w-7 h-7 text-green-600" />
          </button>
        </div>
        {/* 내 유형의 컨셉/요약/개선점 카드 (헤더+설명+개선점 통합) */}
        {mbtiSummaryTable[mbtiType] && (
          <motion.div
            className="mb-8 border-4 border-purple-400 shadow-2xl bg-white/95 rounded-2xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div className="p-10 text-center">
              <h1 className="text-4xl font-extrabold text-purple-700 mb-2">
                {`부자${mbtiType} - ${mbtiSummaryTable[mbtiType].concept}`}
              </h1>
              <p className="text-2xl font-extrabold text-purple-600 mt-4 mb-8">
                {mbtiSummaryTable[mbtiType].summary}
              </p>
              <div className="text-2xl font-extrabold text-purple-700 mb-3">🛠 핵심 개선점</div>
              <div className="text-xl font-bold text-slate-800 mb-2">{mbtiSummaryTable[mbtiType].action}</div>
            </motion.div>
          </motion.div>
        )}
        {/* 내 유형의 현재/미래 부자지수 및 순위 카드 (시각적 개선) */}
        {(() => {
          const myScore = mbtiScoreRankTable.find(row => row.type === mbtiType);
          if (!myScore) return null;
          // 원형 progress bar SVG 생성 함수 (더 크게, 점수/순위 줄 나눔)
          const CircleProgress = ({ value, color, rank, rankColor, rankIcon }: { value: number, color: string, rank: number, rankColor: string, rankIcon: string }) => {
            const radius = 70;
            const stroke = 14;
            const normalizedRadius = radius - stroke / 2;
            const circumference = normalizedRadius * 2 * Math.PI;
            const offset = circumference - (value / 100) * circumference;
            return (
              <div className="flex flex-col items-center">
                <svg height={radius * 2} width={radius * 2} className="block mx-auto">
                  <circle
                    stroke="#e5e7eb"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                  />
                  <circle
                    stroke={color}
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference + ' ' + circumference}
                    strokeDashoffset={offset}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    style={{ transition: 'stroke-dashoffset 0.5s' }}
                  />
                  <text
                    x="50%"
                    y="54%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="3.2rem"
                    fontWeight="bold"
                    fill={color}
                  >
                    {value}
                  </text>
                </svg>
                <div className="mt-4 flex flex-col items-center">
                  <span className={`text-3xl font-extrabold ${rankColor} flex items-center`}>{rankIcon} {rank}위</span>
                  <span className="text-lg font-bold text-slate-500 mt-1">(16개 유형 중)</span>
                </div>
              </div>
            );
          };
          // 순위 아이콘/색상
          const rankIcon = (rank: number) => {
            if (rank === 1) return '🥇';
            if (rank === 2) return '🥈';
            if (rank === 3) return '🥉';
            return '🏅';
          };
          const rankColor = (rank: number, base: string) => {
            if (rank === 1) return base === 'current' ? 'text-purple-700' : 'text-indigo-600';
            if (rank === 2) return base === 'current' ? 'text-purple-500' : 'text-indigo-500';
            return 'text-slate-600';
          };
          return (
            <motion.div
              className="mb-12 border-4 border-purple-300 shadow-2xl bg-white/95 rounded-2xl"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <motion.div className="p-12 text-center">
                <div className="flex flex-col md:flex-row md:justify-center md:space-x-32 items-center space-y-8 md:space-y-0">
                  <div>
                    <div className="mb-6 text-2xl text-slate-500 font-bold">현재 부자지수</div>
                    <CircleProgress value={myScore.current} color="#7c3aed" rank={myScore.currentRank} rankColor={rankColor(myScore.currentRank, 'current')} rankIcon={rankIcon(myScore.currentRank)} />
                  </div>
                  <div>
                    <div className="mb-6 text-2xl text-slate-500 font-bold">미래 부자지수</div>
                    <CircleProgress value={myScore.future} color="#a5b4fc" rank={myScore.futureRank} rankColor={rankColor(myScore.futureRank, 'future')} rankIcon={rankIcon(myScore.futureRank)} />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
        {/* MBTI 차원별 분석 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <Card className="bg-white/95 shadow rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-purple-700 mb-6">MBTI 차원별 분석</h2>
              {dimensionScores && (
                <div className="space-y-6">
                  <DimensionGraph dimension="ei" scores={dimensionScores.ei} />
                  <DimensionGraph dimension="sn" scores={dimensionScores.sn} />
                  <DimensionGraph dimension="tf" scores={dimensionScores.tf} />
                  <DimensionGraph dimension="jp" scores={dimensionScores.jp} />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        {/* 리포트 요약 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.22 }}
        >
          <Card className="bg-white/95 shadow rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">리포트 요약</h2>
              <div className="space-y-4">
                {report.summary.map((item, idx) => (
                  <p key={idx} className="text-slate-700 text-lg">{item}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* 핵심 특징 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.25 }}
        >
          <Card className="bg-white/95 shadow rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">핵심 특징</h2>
              <div className="space-y-4">
                {report.core.map((item, idx) => (
                  <p key={idx} className="text-slate-700 text-lg">{item}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* 4대 요인 분석 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.18 }}
        >
          <Card className="bg-white/95 shadow rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-purple-700 mb-6">4대 요인 분석</h2>
              {factors && <FactorsGraph factors={factors} />}
            </CardContent>
          </Card>
        </motion.div>
        {/* 4대 요인 상세 분석 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.28 }}
        >
          <Card className="bg-white/95 shadow rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">4대 요인 상세 분석</h2>
              <div className="space-y-6">
                {report.factors.map((factor, idx) => (
                  <div key={idx}>
                    <h3 className="text-lg font-semibold text-purple-600 mb-2">{factor.title}</h3>
                    <p className="text-slate-700 text-lg">{factor.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* 강점 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.31 }}
        >
          <Card className="bg-white/95 shadow rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">강점</h2>
              <ul className="list-disc list-inside space-y-2">
                {report.strengths.map((strength, idx) => (
                  <li key={idx} className="text-slate-700 text-lg">{strength}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
        {/* 과제와 실행 전략 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.34 }}
        >
          <Card className="bg-white/95 shadow rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">과제와 실행 전략</h2>
              <div className="space-y-6">
                {report.tasks.map((task, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-purple-600 mb-2">{task.title}</h3>
                    <p className="text-slate-700 text-lg mb-2"><span className="font-semibold">진단 근거:</span> {task.reason}</p>
                    <p className="text-slate-700 text-lg mb-2"><span className="font-semibold">실행 전략:</span> {task.strategy}</p>
                    <div className="text-slate-700 text-lg">
                      <span className="font-semibold">실행 방법:</span>
                      <ul className="list-disc list-inside mt-1 ml-4">
                        {task.method.map((method, i) => (
                          <li key={i}>{method}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* 자산관리 전략 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.37 }}
        >
          <Card className="bg-white/95 shadow rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">자산관리 전략</h2>
              <div className="space-y-6">
                {report.assetStrategy.map((strategy, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-purple-600 mb-2">{strategy.title}</h3>
                    <p className="text-slate-700 text-lg">{strategy.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* 실행 체크리스트 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Card className="bg-white/95 shadow rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">실행 체크리스트</h2>
              <ul className="list-disc list-inside space-y-2">
                {report.checklist.map((item, idx) => (
                  <li key={idx} className="text-slate-700 text-lg">{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
        {/* 추천 교육 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.43 }}
        >
          <Card className="bg-white/95 shadow rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">추천 교육</h2>
              <ul className="list-disc list-inside space-y-2">
                {report.education.map((item, idx) => (
                  <li key={idx} className="text-slate-700 text-lg">{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
        {/* 추천 금융/보험 상품 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.46 }}
        >
          <Card className="bg-white/95 shadow rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">추천 금융/보험 상품</h2>
              <ul className="list-disc list-inside space-y-2">
                {report.products.map((item, idx) => (
                  <li key={idx} className="text-slate-700 text-lg">{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
        {/* 추천 커뮤니티/세미나 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.49 }}
        >
          <Card className="bg-white/95 shadow rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">추천 커뮤니티/세미나</h2>
              <ul className="list-disc list-inside space-y-2">
                {report.community.map((item, idx) => (
                  <li key={idx} className="text-slate-700 text-lg">{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
        {/* 요약 및 제언 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.52 }}
        >
          <Card className="bg-white/95 shadow rounded-2xl">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">요약 및 제언</h2>
              <div className="space-y-4">
                {report.summaryAdvice.map((item, idx) => (
                  <p key={idx} className="text-slate-700 text-lg">{item}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* 리포트 하단 바로가기 버튼 */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-16">
          <a href="/products" className="flex items-center gap-3 px-10 py-6 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-2xl shadow-2xl hover:scale-105 hover:from-pink-600 hover:to-purple-600 transition min-w-[260px] justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M9 7V5a3 3 0 116 0v2m-9 4h12l-1.5 9h-9L6 11z" /></svg>
            부자상품 가기
          </a>
          <a href="/coaching" className="flex items-center gap-3 px-10 py-6 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-2xl shadow-2xl hover:scale-105 hover:from-blue-600 hover:to-indigo-600 transition min-w-[260px] justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 10-8 0 4 4 0 008 0zm6 4v2a2 2 0 01-2 2h-1.5M3 16v2a2 2 0 002 2h1.5" /></svg>
            고수 코칭받기
          </a>
          <a href="/education" className="flex items-center gap-3 px-10 py-6 rounded-2xl bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold text-2xl shadow-2xl hover:scale-105 hover:from-green-500 hover:to-blue-500 transition min-w-[260px] justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0H7m5 0h5" /></svg>
            부자교육 받기
          </a>
        </div>
        {/* 인증/저장 다이얼로그 */}
        <Dialog open={showAuthPrompt} onOpenChange={setShowAuthPrompt}>
          <DialogContent className="max-w-[380px] text-center">
            <div className="text-lg font-bold text-sky-700 mb-6">로그인 또는 회원가입을 하세요</div>
            <div className="flex gap-4 justify-center">
              <button onClick={() => { setShowLogin(true); setShowAuthPrompt(false); }} className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">로그인</button>
              <button onClick={() => { setShowSignup(true); setShowAuthPrompt(false); }} className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition">회원가입</button>
            </div>
          </DialogContent>
        </Dialog>
        <MembersLoginDialog open={showLogin} onOpenChange={setShowLogin} onLoginSuccess={handleLoginSuccess} />
        <SignupDialog open={showSignup} onOpenChange={setShowSignup} onSignupSuccess={handleLoginSuccess} />
      </motion.div>
    </div>
  );
};

export default MbtiDiagnosisResultPage; 