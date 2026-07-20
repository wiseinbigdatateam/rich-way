import { funds } from '@/data/funds';
import { allSavings } from '@/data/savings/allSavings';
import { pensionSavings } from '@/data/pensionSavings';
import { retirementPensions } from '@/data/retirementPensions';

interface FinancialData {
  // 수입 정보
  monthlyIncome: number;
  spouseIncome: number;
  otherIncome: number;
  incomeType: string;
  incomeVariability: string;
  
  // 지출 정보
  housingCost: number;
  foodCost: number;
  educationCost: number;
  transportationCost: number;
  leisureCost: number;
  medicalCost: number;
  insuranceCost: number;
  otherExpense: number;
  monthlySavings: number;
  
  // 자산 정보
  savings: number;
  investments: number;
  realEstate: number;
  car: number;
  retirement: number;
  otherAssets: number;
  
  // 부채 정보
  creditLoan: number;
  depositLoan: number;
  mortgageLoan: number;
  studentLoan: number;
  otherDebt: number;
  
  // 목표 정보
  goals: string[];
  targetAmount: number;
  targetDate: string;
  
  // 개인 정보
  name: string;
  gender: string;
  age: number;
  familyType: string;
}

interface FinancialProduct {
  id: string;
  name: string;
  type: 'savings' | 'fund' | 'pension' | 'insurance' | 'investment' | 'retirement';
  category: string;
  expectedReturn: number; // 연 수익률 (%)
  riskLevel: 'low' | 'medium' | 'high';
  minAmount: number;
  maxAmount: number;
  period: number; // 기간 (개월)
  description: string;
  features: string[];
  suitability: string[]; // 적합한 사용자 유형
}

interface SimulationResult {
  targetAmount: number;
  currentAssets: number;
  monthlyInvestment: number;
  yearsToTarget: number;
  projectedGrowth: number[];
  recommendedProducts: FinancialProduct[];
  monthlyBreakdown: {
    savings: number;
    investment: number;
    emergency: number;
  };
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
  };
}

// 금융상품 데이터베이스 (샘플)
const financialProducts: FinancialProduct[] = [
  {
    id: 'savings_001',
    name: '목표달성 적금',
    type: 'savings',
    category: '적금',
    expectedReturn: 3.5,
    riskLevel: 'low',
    minAmount: 100000,
    maxAmount: 5000000,
    period: 36,
    description: '목표 금액 달성을 위한 안정적인 적금 상품',
    features: ['월 납입', '만기 시 수익률 보장', '중도 해지 가능'],
    suitability: ['emergency', 'housing', 'family']
  },
  {
    id: 'fund_001',
    name: '성장형 주식형 펀드',
    type: 'fund',
    category: '펀드',
    expectedReturn: 8.0,
    riskLevel: 'medium',
    minAmount: 500000,
    maxAmount: 10000000,
    period: 60,
    description: '장기 성장을 위한 주식형 펀드',
    features: ['분산 투자', '전문가 운용', '정기 리밸런싱'],
    suitability: ['investment', 'retirement', 'education']
  },
  {
    id: 'pension_001',
    name: '개인연금저축',
    type: 'pension',
    category: '연금',
    expectedReturn: 5.5,
    riskLevel: 'low',
    minAmount: 300000,
    maxAmount: 6000000,
    period: 120,
    description: '노후 준비를 위한 세제혜택 연금상품',
    features: ['세제혜택', '장기 저축', '안정적 수익'],
    suitability: ['retirement', 'family']
  },
  {
    id: 'fund_002',
    name: '배당형 채권형 펀드',
    type: 'fund',
    category: '펀드',
    expectedReturn: 4.5,
    riskLevel: 'low',
    minAmount: 300000,
    maxAmount: 5000000,
    period: 36,
    description: '안정적인 배당 수익을 추구하는 채권형 펀드',
    features: ['정기 배당', '원금 보호', '낮은 변동성'],
    suitability: ['emergency', 'housing', 'lifestyle']
  },
  {
    id: 'investment_001',
    name: 'ETF 포트폴리오',
    type: 'investment',
    category: 'ETF',
    expectedReturn: 7.0,
    riskLevel: 'medium',
    minAmount: 1000000,
    maxAmount: 20000000,
    period: 48,
    description: '다양한 자산에 분산 투자하는 ETF 조합',
    features: ['낮은 수수료', '투명한 운용', '유연한 매매'],
    suitability: ['investment', 'retirement', 'education']
  }
];

export const spendingBenchmarks = [
  // 연령대, 가족구성, 소득구간(만원), 항목별 비율(%): 주거비, 식비, 교육비, 교통/통신, 여가/취미/쇼핑, 의료/건강, 보험, 기타지출
  { age: '20대', family: '1인가구', incomeRange: '200~300', values: [35, 20, 0, 7, 10, 1, 2, 10] },
  { age: '20대', family: '미혼부부', incomeRange: '300~400', values: [30, 18, 2, 6, 8, 2, 2, 12] },
  { age: '20대', family: '부부+자녀1', incomeRange: '300~400', values: [28, 18, 5, 6, 7, 3, 2, 13] },
  { age: '20대', family: '부부+자녀2', incomeRange: '300~400', values: [27, 18, 8, 6, 7, 3, 2, 9] },
  { age: '30대', family: '1인가구', incomeRange: '300~400', values: [25, 13, 2, 8, 8, 4, 2, 10] },
  { age: '30대', family: '부부', incomeRange: '300~500', values: [28, 14, 4, 6, 8, 4, 2, 9] },
  { age: '30대', family: '부부+자녀1', incomeRange: '400~600', values: [26, 14, 10, 6, 6, 4, 2, 5] },
  { age: '30대', family: '부부+자녀2', incomeRange: '400~600', values: [25, 13, 12, 6, 5, 4, 2, 3] },
  { age: '30대', family: '부부+자녀3이상', incomeRange: '500~700', values: [24, 12, 16, 5, 5, 4, 2, 3] },
  { age: '40대', family: '1인가구', incomeRange: '300~500', values: [23, 13, 1, 6, 8, 10, 3, 4] },
  { age: '40대', family: '부부', incomeRange: '400~600', values: [20, 13, 2, 7, 7, 5, 3, 7] },
  { age: '40대', family: '부부+자녀1', incomeRange: '500~700', values: [18, 13, 12, 5, 5, 5, 3, 7] },
  { age: '40대', family: '부부+자녀2', incomeRange: '500~600', values: [18, 14, 15, 6, 6, 5, 3, 6] },
  { age: '40대', family: '부부+자녀2', incomeRange: '600~800', values: [17, 15, 15, 6, 7, 5, 3, 6] },
  { age: '40대', family: '부부+자녀3이상', incomeRange: '700~900', values: [15, 13, 16, 5, 5, 5, 3, 7] },
  { age: '50대', family: '1인가구', incomeRange: '200~300', values: [15, 12, 0, 8, 8, 10, 3, 5] },
  { age: '50대', family: '부부', incomeRange: '400~600', values: [22, 15, 3, 8, 12, 7, 3, 8] },
  { age: '50대', family: '부부+부양가족', incomeRange: '400~600', values: [22, 12, 5, 8, 8, 7, 3, 3] },
  { age: '50대', family: '부부+자녀1', incomeRange: '400~600', values: [22, 13, 8, 9, 9, 7, 3, 6] },
  { age: '50대', family: '부부+자녀2', incomeRange: '400~600', values: [21, 13, 10, 9, 7, 7, 3, 6] },
  { age: '50대', family: '부부+자녀3이상', incomeRange: '400~600', values: [21, 12, 12, 6, 7, 7, 3, 7] },
  { age: '60대 이상', family: '1인가구', incomeRange: '100~200', values: [25, 12, 0, 8, 8, 12, 2, 10] },
  { age: '60대 이상', family: '부부', incomeRange: '200~400', values: [22, 11, 3, 7, 9, 14, 2, 13] },
  { age: '60대 이상', family: '부부+자녀1', incomeRange: '200~400', values: [20, 12, 6, 7, 7, 12, 2, 12] },
  { age: '60대 이상', family: '부부+자녀2', incomeRange: '200~400', values: [20, 12, 7, 7, 7, 12, 2, 12] },
  { age: '60대 이상', family: '부부+자녀3이상', incomeRange: '200~400', values: [19, 11, 8, 7, 7, 14, 2, 14] },
];

function getSpendingBenchmark(age: number, family: string, income: number) {
  let ageGroup = '';
  if (age < 30) ageGroup = '20대';
  else if (age < 40) ageGroup = '30대';
  else if (age < 50) ageGroup = '40대';
  else if (age < 60) ageGroup = '50대';
  else ageGroup = '60대 이상';
  let fam = family.replace(/명|\s/g, '');
  if (fam.includes('자녀3')) fam = '부부+자녀3이상';
  else if (fam.includes('자녀2')) fam = '부부+자녀2';
  else if (fam.includes('자녀1')) fam = '부부+자녀1';
  else if (fam.includes('미혼')) fam = '미혼부부';
  else if (fam.includes('부부') && !fam.includes('자녀')) fam = '부부';
  else if (fam.includes('1인')) fam = '1인가구';

  // 연령대 + 가족구성으로만 매칭 (소득대는 참고사항)
  let found = spendingBenchmarks.find(b => b.age === ageGroup && b.family === fam);
  if (found) return found;
  
  // 매칭되는 데이터가 없으면 해당 연령대의 첫 번째 데이터 사용
  found = spendingBenchmarks.find(b => b.age === ageGroup);
  if (found) return found;
  
  // 마지막으로 첫 번째 데이터 사용
  return spendingBenchmarks[0];
}

// 카테고리별 지출 비율을 반환하는 함수
function getSpendingBenchmarkRatios(age: number, family: string, income: number) {
  const benchmark = getSpendingBenchmark(age, family, income);
  const categories = ['주거비', '식비', '교육비', '교통/통신', '여가/취미/쇼핑', '의료/건강', '보험', '기타지출'];
  
  const ratios: { [key: string]: number } = {};
  categories.forEach((category, index) => {
    ratios[category] = benchmark.values[index] || 0;
  });
  
  return ratios;
}

export function analyzeSpending(user: {
  age: number;
  familyType: string;
  income: number; // 만원 단위(월소득)
  spending: { [key: string]: number }; // 입력값(만원)
}) {
  // 소비성 항목만 (저축/투자 제외)
  const keys = ['주거비','식비','교육비','교통/통신','여가/취미/쇼핑','의료/건강','보험','기타지출'];
  const income = user.income; // 만원 단위(입력값)
  const bm = getSpendingBenchmark(user.age, user.familyType, income);
  if (!bm) return null;
  const avgIncome = bm.incomeRange || '0~100'; // 소득구간 사용
  const incomeDiff = avgIncome !== '0~100' ? ((income - parseInt(avgIncome.split('~')[0], 10)) / parseInt(avgIncome.split('~')[0], 10)) * 100 : 0;
  let totalSaving = 0;
  // 내 총지출(만원)
  const myTotalSpending = keys.reduce((sum, k) => sum + (user.spending[k] || 0), 0);
  const result = keys.map((k, i) => {
    const actual = user.spending[k] || 0; // 내 지출(만원)
    const actualRatio = myTotalSpending > 0 ? (actual / myTotalSpending) * 100 : 0; // 내비율(%)
    const avgRatio = bm.values[i]; // 평균비율(%)
    const avgAmount = Math.round(income * avgRatio / 100); // 평균(만원)
    const diffAmount = avgAmount - actual; // 차이(만원)
    const diffRatio = avgRatio - actualRatio; // 차이(%)
    // 절감 가능액: 내 소비액이 평균보다 많을 때만
    const saving = actual > avgAmount ? actual - avgAmount : 0; // 절감 가능액(만원)
    if (saving > 0) totalSaving += saving;
    return {
      key: k,
      actual, // 내 지출(만원)
      actualRatio, // 내비율(%)
      avgAmount, // 평균(만원)
      avgRatio, // 평균(%)
      diffAmount, // 차이(만원)
      diffRatio, // 차이(%)
      saving, // 절감 가능액(만원)
    };
  });
  return { result, totalSaving, avgIncome, incomeDiff, income, benchmark: bm };
}

export class FinanceAnalysisEngine {
  
  // 재무 상태 분석
  analyzeFinancialStatus(data: FinancialData) {
    const totalIncome = data.monthlyIncome + data.spouseIncome + data.otherIncome;
    const totalExpenses = data.housingCost + data.foodCost + data.educationCost + 
                         data.transportationCost + data.leisureCost + data.medicalCost + 
                         data.insuranceCost + data.otherExpense;
    const totalAssets = data.savings + data.investments + data.realEstate + 
                       data.car + data.retirement + data.otherAssets;
        const totalDebt = data.creditLoan + data.depositLoan + data.mortgageLoan +
                     data.studentLoan + data.otherDebt;
    
    // 사용자가 입력한 월 저축/투자 금액을 우선 사용, 없으면 계산값 사용
    const monthlySavings = data.monthlySavings > 0 ? data.monthlySavings : (totalIncome - totalExpenses);
    const savingsRate = (monthlySavings / totalIncome) * 100;
    const debtRatio = (totalDebt / totalAssets) * 100;
    const netWorth = totalAssets - totalDebt;
    
    return {
      totalIncome,
      totalExpenses,
      totalAssets,
      totalDebt,
      monthlySavings,
      savingsRate,
      debtRatio,
      netWorth,
      financialHealth: this.assessFinancialHealth(savingsRate, debtRatio, monthlySavings, totalIncome)
    };
  }
  
  // 재무 건강도 평가
  private assessFinancialHealth(savingsRate: number, debtRatio: number, monthlySavings: number, totalIncome?: number) {
    let score = 0;
    
    // 저축률 평가 (30점 만점)
    if (savingsRate >= 30) score += 30;
    else if (savingsRate >= 20) score += 25;
    else if (savingsRate >= 10) score += 20;
    else if (savingsRate >= 5) score += 10;
    else score += 5;
    
    // 부채비율 평가 (30점 만점)
    if (debtRatio <= 20) score += 30;
    else if (debtRatio <= 40) score += 25;
    else if (debtRatio <= 60) score += 15;
    else if (debtRatio <= 80) score += 5;
    else score += 0;
    
    // 월 저축 가능액(%) 평가 (40점 만점, 소득 대비 비율)
    let savingRatio = 0;
    if (typeof totalIncome === 'number' && totalIncome > 0) {
      savingRatio = (monthlySavings / totalIncome) * 100;
    }
    if (savingRatio >= 40) score += 40;
    else if (savingRatio >= 30) score += 35;
    else if (savingRatio >= 20) score += 30;
    else if (savingRatio >= 10) score += 20;
    else if (savingRatio >= 0) score += 10;
    else score += 0;
    
    if (score >= 80) return { level: 'excellent', score, description: '매우 양호한 재무 상태', detail: { savingsRate, debtRatio, monthlySavings, savingRatio } };
    else if (score >= 60) return { level: 'good', score, description: '양호한 재무 상태', detail: { savingsRate, debtRatio, monthlySavings, savingRatio } };
    else if (score >= 40) return { level: 'fair', score, description: '개선이 필요한 재무 상태', detail: { savingsRate, debtRatio, monthlySavings, savingRatio } };
    else return { level: 'poor', score, description: '긴급한 개선이 필요한 재무 상태', detail: { savingsRate, debtRatio, monthlySavings, savingRatio } };
  }
  
  // 맞춤형 금융상품 추천
  recommendProducts(data: FinancialData, analysis: any): FinancialProduct[] {
    const goals = data.goals;
    const monthlySavings = analysis.monthlySavings;
    const riskTolerance = this.assessRiskTolerance(data, analysis);
    const age = data.age;
    const familyType = data.familyType;
    const totalIncome = data.monthlyIncome + data.spouseIncome + data.otherIncome;
    const debtRatio = analysis.debtRatio;
    const savingsRate = analysis.savingsRate;
    
    // 카테고리별 상품 분류
    const categoryProducts: { [key: string]: FinancialProduct[] } = {
      fund: [],
      savings: [],
      pension: [],
      retirement: []
    };
    
    // 1. 펀드 상품 추가
    funds.forEach((fund, index) => {
      const riskLevel = this.mapRiskLevel(fund.risk);
      const expectedReturn = fund.return1y || fund.return6m || 3.5;
      
      categoryProducts.fund.push({
        id: `fund_${index}`,
        name: fund.name,
        type: 'fund',
        category: fund.type,
        expectedReturn: expectedReturn,
        riskLevel: riskLevel,
        minAmount: 100000, // 최소 10만원
        maxAmount: 10000000, // 최대 1000만원
        period: 60, // 5년
        description: `${fund.company}에서 운용하는 ${fund.type} 펀드`,
        features: ['분산 투자', '전문가 운용', '정기 리밸런싱'],
        suitability: this.getSuitabilityByGoal(goals, 'fund')
      });
    });
    
    // 2. 적금 상품 추가
    allSavings.forEach((savings, index) => {
      const product: FinancialProduct = {
        id: `savings_${index}`,
        name: savings.productName,
        type: 'savings' as const,
        category: '정기적금',
        expectedReturn: savings.afterTaxRate * 100, // 소수점을 퍼센트로 변환 (0.04 -> 4%)
        riskLevel: 'low',
        minAmount: 100000, // 최소 10만원
        maxAmount: savings.maxLimit || 5000000, // 최대 500만원
        period: 36, // 3년
        description: `${savings.bank}의 안정적인 정기적금 상품`,
        features: ['월 납입', '만기 시 수익률 보장', '중도 해지 가능'],
        suitability: this.getSuitabilityByGoal(goals, 'savings')
      };
      
      categoryProducts.savings.push(product);
    });
    
    // 3. 연금저축 상품 추가
    pensionSavings.forEach((pension, index) => {
      categoryProducts.pension.push({
        id: `pension_${index}`,
        name: `${pension.company} 연금저축`,
        type: 'pension',
        category: '연금저축',
        expectedReturn: pension.yield || 5.0,
        riskLevel: 'low',
        minAmount: 300000, // 최소 30만원
        maxAmount: 6000000, // 최대 600만원
        period: 120, // 10년
        description: '세제혜택을 받을 수 있는 연금저축 상품',
        features: ['세제혜택', '장기 저축', '안정적 수익'],
        suitability: this.getSuitabilityByGoal(goals, 'pension')
      });
    });
    
    // 4. 퇴직연금 상품 추가
    retirementPensions.forEach((retirement, index) => {
      categoryProducts.retirement.push({
        id: `retirement_${index}`,
        name: `${retirement.company} 퇴직연금`,
        type: 'retirement',
        category: '퇴직연금',
        expectedReturn: retirement.yield || 4.5,
        riskLevel: 'low',
        minAmount: 500000, // 최소 50만원
        maxAmount: 10000000, // 최대 1000만원
        period: 180, // 15년
        description: '장기 노후 준비를 위한 퇴직연금 상품',
        features: ['장기 투자', '세제혜택', '안정적 수익'],
        suitability: this.getSuitabilityByGoal(goals, 'retirement')
      });
    });
    
    // 각 카테고리별로 맞춤형 필터링 및 정렬
    const recommendations: FinancialProduct[] = [];
    
    Object.keys(categoryProducts).forEach(category => {
      let products = categoryProducts[category];
      
      console.log(`${category} 카테고리 초기 상품 수:`, products.length);
      
      // 1. 위험도에 따른 필터링 (개인 상황 고려)
      products = products.filter(product => {
        // 부채비율이 높은 경우 안전한 상품 우선
        if (debtRatio >= 60) {
          return product.riskLevel === 'low';
        }
        // 40대 이상은 안정성 중시
        if (age >= 40) {
          return product.riskLevel === 'low' || product.riskLevel === 'medium';
        }
        // 20대는 적극적 투자 가능
        if (age < 30) {
          return true; // 모든 위험도 허용
        }
        // 30대는 중간 위험도까지
        return product.riskLevel !== 'high';
      });
      
      console.log(`${category} 카테고리 위험도 필터링 후:`, products.length);
      
      // 2. 월 저축액에 따른 필터링 (소득 수준 고려)
      const affordableMultiplier = this.getAffordableMultiplier(age, familyType, totalIncome, debtRatio);
      products = products.filter(product => 
        product.minAmount <= monthlySavings * affordableMultiplier
      );
      
      console.log(`${category} 카테고리 월 저축액 필터링 후:`, products.length);
      
      // 3. 개인 상황별 가중치 적용하여 정렬
      products = products.map(product => {
        let score = product.expectedReturn;
        
        // 연령별 가중치
        if (age < 30) {
          // 20대: 수익률 중시
          score *= 1.2;
        } else if (age >= 50) {
          // 50대 이상: 안정성 중시
          if (product.riskLevel === 'low') score *= 1.3;
          else if (product.riskLevel === 'high') score *= 0.7;
        }
        
        // 가족구성별 가중치
        if (familyType.includes('자녀')) {
          // 자녀가 있는 경우 안정성 중시
          if (product.riskLevel === 'low') score *= 1.2;
          else if (product.riskLevel === 'high') score *= 0.8;
        }
        
        // 소득 수준별 가중치
        if (totalIncome >= 8000000) { // 800만원 이상
          // 고소득: 다양한 상품 선택 가능
          score *= 1.1;
        } else if (totalIncome <= 3000000) { // 300만원 이하
          // 저소득: 안정성 중시
          if (product.riskLevel === 'low') score *= 1.3;
          else if (product.riskLevel === 'high') score *= 0.6;
        }
        
        // 부채비율별 가중치
        if (debtRatio >= 60) {
          // 부채비율 높음: 안전자산 우선
          if (product.riskLevel === 'low') score *= 1.5;
          else score *= 0.5;
        } else if (debtRatio <= 20) {
          // 부채비율 낮음: 투자 여유
          score *= 1.2;
        }
        
        // 저축률별 가중치
        if (savingsRate >= 30) {
          // 저축률 높음: 적극적 투자 가능
          score *= 1.2;
        } else if (savingsRate < 10) {
          // 저축률 낮음: 안정성 중시
          if (product.riskLevel === 'low') score *= 1.4;
          else score *= 0.7;
        }
        
        return { ...product, score };
      });
      
      // 가중치 점수로 정렬하고 상위 3개 선택
      const top3 = products
        .sort((a, b) => (b as any).score - (a as any).score)
        .slice(0, 3)
        .map(product => {
          const { score, ...rest } = product as any;
          return rest;
        });
      
      console.log(`${category} 카테고리 최종 추천:`, top3.length, '개');
      
      recommendations.push(...top3);
    });
    
    console.log('전체 추천 상품 수:', recommendations.length);
    console.log('추천 상품 타입별 분포:', recommendations.reduce((acc, product) => {
      acc[product.type] = (acc[product.type] || 0) + 1;
      return acc;
    }, {} as any));
    
    return recommendations;
  }
  
  // 위험도 매핑 함수
  private mapRiskLevel(risk: string): 'low' | 'medium' | 'high' {
    if (risk.includes('낮은위험') || risk.includes('보통위험')) return 'low';
    if (risk.includes('다소높은위험')) return 'medium';
    return 'high';
  }
  
  // 목표별 적합성 매핑 함수
  private getSuitabilityByGoal(goals: string[], productType: string): string[] {
    const suitabilityMap: { [key: string]: string[] } = {
      'fund': ['investment', 'retirement', 'education'],
      'savings': ['emergency', 'housing', 'family'],
      'pension': ['retirement', 'family'],
      'retirement': ['retirement', 'family']
    };
    
    return suitabilityMap[productType] || ['general'];
  }
  
  // 위험도 평가 (맞춤형)
  private assessRiskTolerance(data: FinancialData, analysis: any): 'low' | 'medium' | 'high' {
    const debtRatio = analysis.debtRatio;
    const savingsRate = analysis.savingsRate;
    const monthlySavings = analysis.monthlySavings;
    // 맞춤형 위험도 등급
    if (debtRatio >= 60) return 'high';
    if (debtRatio >= 20) return 'medium';
    return 'low';
  }

  // 맞춤형 위험 평가 상세 설명
  private generateRiskAssessment(data: FinancialData, analysis: any) {
    const debtRatio = analysis.debtRatio;
    const savingsRate = analysis.savingsRate;
    const monthlySavings = analysis.monthlySavings;
    const riskLevel = this.assessRiskTolerance(data, analysis);
    const factors: string[] = [];
    if (debtRatio >= 60) factors.push('부채비율이 60% 이상으로 부채 상환이 시급합니다.');
    else if (debtRatio >= 20) factors.push('부채비율이 20~60%로 부채 관리와 저축을 병행하세요.');
    else factors.push('부채비율이 20% 이하로 재무적으로 안정적입니다.');
    if (savingsRate < 10) factors.push('저축률이 10% 미만으로 지출 절감이 필요합니다.');
    else if (savingsRate >= 30) factors.push('저축률이 30% 이상으로 안정적입니다.');
    if (monthlySavings <= 0) factors.push('저축 가능액이 없습니다. 지출 구조를 점검하세요.');
    return { level: riskLevel, factors };
  }

  // 맞춤형 액션 플랜 생성
  private generateActionPlan(data: FinancialData, analysis: any, recommendations: FinancialProduct[], simulation: SimulationResult) {
    const actions = [];
    const debtRatio = analysis.debtRatio;
    const savingsRate = analysis.savingsRate;
    const netWorth = analysis.netWorth;
    const monthlySavings = analysis.monthlySavings;
    const yearsToTarget = simulation.yearsToTarget;
    // 단기
    const shortTerm: string[] = [];
    if (debtRatio >= 60) shortTerm.push('고금리 부채 상환 최우선');
    if (savingsRate < 10) shortTerm.push('불필요한 지출 항목 점검 및 절감');
    if (netWorth <= 0) shortTerm.push('비상금 100만원부터 확보');
    if (shortTerm.length === 0) shortTerm.push('비상금 3개월치 확보, 정기예금 가입');
    // 중기
    const midTerm: string[] = [];
    if (savingsRate >= 10 && savingsRate < 30) midTerm.push('월 저축액 10% 증액 목표');
    if (debtRatio >= 20 && debtRatio < 60) midTerm.push('부채 20% 감축 목표');
    if (midTerm.length === 0) midTerm.push('추가 투자 상품 검토, 소득 다변화 방안 모색');
    // 장기
    const longTerm: string[] = [];
    if (yearsToTarget >= 10) longTerm.push('투자 비중 확대, 수익률 개선 필요');
    if (yearsToTarget <= 3) longTerm.push('목표 달성 후 자산 증식 전략 수립');
    if (longTerm.length === 0) longTerm.push('정기적인 포트폴리오 리밸런싱, 추가 투자 기회 모니터링');
    actions.push({ period: '단기 (3개월)', actions: shortTerm });
    actions.push({ period: '중기 (1년)', actions: midTerm });
    actions.push({ period: '장기 (목표 달성까지)', actions: longTerm });
    return actions;
  }

  // 가중 평균 수익률 계산 (맞춤형 포트폴리오 비율 반영)
  private calculateWeightedReturn(recommendedProducts: FinancialProduct[], data?: FinancialData, analysis?: any): number {
    if (recommendedProducts.length === 0) return 6.0; // 기본 수익률
    
    // 개인 상황에 따른 맞춤형 포트폴리오 비율 계산
    const portfolioRatios = this.calculateCustomPortfolioRatios(data, analysis);
    
    let weightedSum = 0;
    let totalWeight = 0;
    
    // 각 카테고리별로 상위 1개 상품만 선택하여 가중 평균 계산
    const categoryProducts: { [key: string]: FinancialProduct } = {};
    
    recommendedProducts.forEach(product => {
      if (!categoryProducts[product.type] || 
          product.expectedReturn > categoryProducts[product.type].expectedReturn) {
        categoryProducts[product.type] = product;
      }
    });
    
    // 가중 평균 계산
    Object.keys(categoryProducts).forEach(type => {
      const product = categoryProducts[type];
      const ratio = portfolioRatios[type as keyof typeof portfolioRatios] || 0;
      weightedSum += product.expectedReturn * ratio;
      totalWeight += ratio;
    });
    
    return totalWeight > 0 ? weightedSum / totalWeight : 6.0;
  }

  // 개인 상황에 따른 맞춤형 포트폴리오 비율 계산
  private calculateCustomPortfolioRatios(data?: FinancialData, analysis?: any): { [key: string]: number } {
    if (!data || !analysis) {
      // 기본 비율
      return {
        fund: 0.4,      // 펀드 40%
        savings: 0.3,   // 정기적금 30%
        pension: 0.2,   // 연금저축 20%
        retirement: 0.1 // 퇴직연금 10%
      };
    }

    const age = data.age;
    const familyType = data.familyType;
    const totalIncome = data.monthlyIncome + data.spouseIncome + data.otherIncome;
    const debtRatio = analysis.debtRatio || 0;
    const savingsRate = analysis.savingsRate || 0;
    const riskTolerance = this.assessRiskTolerance(data, analysis);

    // 기본 비율 설정
    let fundRatio = 0.4;
    let savingsRatio = 0.3;
    let pensionRatio = 0.2;
    let retirementRatio = 0.1;

    // 1. 연령별 조정
    if (age < 30) {
      // 20대: 적극적 투자 (펀드 비중 증가)
      fundRatio = 0.5;
      savingsRatio = 0.25;
      pensionRatio = 0.15;
      retirementRatio = 0.1;
    } else if (age < 40) {
      // 30대: 균형적 투자
      fundRatio = 0.4;
      savingsRatio = 0.3;
      pensionRatio = 0.2;
      retirementRatio = 0.1;
    } else if (age < 50) {
      // 40대: 안정성 중시 (저축 비중 증가)
      fundRatio = 0.3;
      savingsRatio = 0.4;
      pensionRatio = 0.2;
      retirementRatio = 0.1;
    } else if (age < 60) {
      // 50대: 보수적 투자
      fundRatio = 0.2;
      savingsRatio = 0.5;
      pensionRatio = 0.2;
      retirementRatio = 0.1;
    } else {
      // 60대 이상: 매우 보수적
      fundRatio = 0.1;
      savingsRatio = 0.6;
      pensionRatio = 0.2;
      retirementRatio = 0.1;
    }

    // 2. 가족구성별 조정
    if (familyType.includes('자녀')) {
      // 자녀가 있는 경우 안정성 중시
      fundRatio *= 0.8;
      savingsRatio *= 1.2;
      pensionRatio *= 1.1;
    } else if (familyType.includes('부부') && !familyType.includes('자녀')) {
      // 부부만: 적극적 투자 가능
      fundRatio *= 1.1;
      savingsRatio *= 0.9;
    } else if (familyType.includes('1인')) {
      // 1인가구: 자유로운 투자
      fundRatio *= 1.2;
      savingsRatio *= 0.8;
    }

    // 3. 소득 수준별 조정
    if (totalIncome >= 8000000) { // 800만원 이상
      // 고소득: 다양한 투자 가능
      fundRatio *= 1.2;
      pensionRatio *= 1.1;
    } else if (totalIncome <= 3000000) { // 300만원 이하
      // 저소득: 안정성 중시
      fundRatio *= 0.7;
      savingsRatio *= 1.3;
    }

    // 4. 부채비율별 조정
    if (debtRatio >= 60) {
      // 부채비율 높음: 안전자산 우선
      fundRatio *= 0.5;
      savingsRatio *= 1.5;
    } else if (debtRatio <= 20) {
      // 부채비율 낮음: 투자 여유
      fundRatio *= 1.3;
      savingsRatio *= 0.8;
    }

    // 5. 저축률별 조정
    if (savingsRate >= 30) {
      // 저축률 높음: 적극적 투자 가능
      fundRatio *= 1.2;
      pensionRatio *= 1.1;
    } else if (savingsRate < 10) {
      // 저축률 낮음: 안정성 중시
      fundRatio *= 0.6;
      savingsRatio *= 1.4;
    }

    // 6. 위험도 성향별 조정
    if (riskTolerance === 'high') {
      fundRatio *= 1.3;
      savingsRatio *= 0.7;
    } else if (riskTolerance === 'low') {
      fundRatio *= 0.6;
      savingsRatio *= 1.4;
    }

    // 비율 정규화 (총합이 1이 되도록)
    const total = fundRatio + savingsRatio + pensionRatio + retirementRatio;
    fundRatio /= total;
    savingsRatio /= total;
    pensionRatio /= total;
    retirementRatio /= total;

    return {
      fund: fundRatio,
      savings: savingsRatio,
      pension: pensionRatio,
      retirement: retirementRatio
    };
  }

  // 목표 달성 시뮬레이션
  simulateGoalAchievement(data: FinancialData, analysis: any, recommendedProducts: FinancialProduct[]): SimulationResult {
    // 목표 금액은 억원 단위 그대로 사용
    const targetAmount = data.targetAmount; // 억원 단위
    const currentAssets = analysis.netWorth; // 순자산 기준
    
    // 월 저축 가능액 계산 (현재 월 저축 + 추가 여유분)
    const totalIncome = data.monthlyIncome + data.spouseIncome + data.otherIncome;
    const totalExpenses = data.housingCost + data.foodCost + data.educationCost + 
                         data.transportationCost + data.leisureCost + data.medicalCost + 
                         data.insuranceCost + data.otherExpense;
    const additionalSurplus = totalIncome - totalExpenses - analysis.monthlySavings;
    const monthlySavingsPotential = analysis.monthlySavings + Math.max(0, additionalSurplus);
    
    // 실천가능한 저축목표 계산 (추가저축 가능액의 50%)
    const practicalSavingsGoal = Math.max(0, additionalSurplus) * 0.5;
    
    // 시뮬레이션에 사용할 총 월 저축/투자금액
    const totalMonthlySavings = monthlySavingsPotential + practicalSavingsGoal;

    // 추천 상품들의 가중 평균 수익률 계산 (포트폴리오 비율 반영)
    const avgReturn = this.calculateWeightedReturn(recommendedProducts, data, analysis);

    // 월 투자 금액 계산 (총 저축액의 70%를 투자에 사용)
    const monthlyInvestment = totalMonthlySavings * 0.7;

    // 목표 달성까지의 기간 계산 (기본값)
    const yearsToTarget = this.calculateYearsToTarget(
      currentAssets, 
      monthlyInvestment, 
      targetAmount * 100000000, // 시뮬레이션 내부는 원 단위
      avgReturn
    );

    // 목표 시점이 연도(예: '2032년') 형식이면, 현재 연도와의 차이로 시뮬레이션 기간 결정
    let simulationYears = yearsToTarget;
    const yearMatch = typeof data.targetDate === 'string' && data.targetDate.match(/(\d{4})/);
    if (yearMatch) {
      const targetYear = parseInt(yearMatch[1], 10);
      const now = new Date();
      const currentYear = now.getFullYear();
      const diff = targetYear - currentYear;
      if (diff > 0) {
        simulationYears = Math.max(diff, yearsToTarget); // 목표시점까지 또는 실제 달성까지 중 더 긴 기간
      }
    }

    // 연도별 자산 성장 시뮬레이션 (simulationYears 만큼)
    const projectedGrowth = this.calculateProjectedGrowth(
      currentAssets,
      monthlyInvestment,
      avgReturn,
      Math.max(1, Math.ceil(simulationYears))
    );

    // 월별 자산 배분
    const monthlyBreakdown = {
      savings: totalMonthlySavings * 0.2, // 20%는 안전자산
      investment: monthlyInvestment,
      emergency: totalMonthlySavings * 0.1 // 10%는 비상금
    };

    // 위험도 평가
    const riskAssessment = {
      level: this.assessRiskTolerance(data, analysis),
      factors: this.identifyRiskFactors(data, analysis)
    };

    return {
      targetAmount: targetAmount, // 이미 원 단위로 반환
      currentAssets,
      monthlyInvestment,
      yearsToTarget,
      projectedGrowth,
      recommendedProducts,
      monthlyBreakdown,
      riskAssessment
    };
  }
  
  // 목표 달성 기간 계산
  private calculateYearsToTarget(currentAssets: number, monthlyInvestment: number, targetAmount: number, annualReturn: number): number {
    if (currentAssets >= targetAmount) return 0; // 이미 목표 달성
    const monthlyReturn = annualReturn / 12 / 100;
    const monthlyInvestmentTotal = monthlyInvestment * 12;
    
    if (currentAssets >= targetAmount) return 0;
    
    // 복리 계산 공식 사용
    let years = 0;
    let currentValue = currentAssets;
    
    while (currentValue < targetAmount && years < 50) {
      currentValue = currentValue * (1 + annualReturn / 100) + monthlyInvestmentTotal;
      years++;
    }
    
    return years;
  }
  
  // 연도별 자산 성장 계산
  private calculateProjectedGrowth(currentAssets: number, monthlyInvestment: number, annualReturn: number, years: number): number[] {
    const growth: number[] = [];
    let currentValue = currentAssets;
    const monthlyInvestmentTotal = monthlyInvestment * 12;
    const currentYear = new Date().getFullYear(); // 2025년
    
    for (let year = 1; year <= years; year++) {
      const actualYear = currentYear + year - 1; // 실제 연도 계산
      
      if (actualYear === currentYear) {
        // 2025년: 수익률 없이 저축만 (기존 자산 + 저축액)
        currentValue = currentAssets + monthlyInvestmentTotal;
      } else {
        // 2026년부터: 수익률 적용 (이전 연도 자산 + 수익 + 저축액)
        currentValue = currentValue * (1 + annualReturn / 100) + monthlyInvestmentTotal;
      }
      
      growth.push(Math.round(currentValue));
    }
    
    return growth;
  }
  
  // 위험 요인 식별
  private identifyRiskFactors(data: FinancialData, analysis: any): string[] {
    const factors: string[] = [];
    
    if (analysis.savingsRate < 10) {
      factors.push('저축률이 낮아 목표 달성이 어려울 수 있습니다');
    }
    
    if (analysis.debtRatio > 60) {
      factors.push('부채비율이 높아 투자 여력이 제한적입니다');
    }
    
    if (data.incomeVariability === 'high') {
      factors.push('소득 변동성이 높아 안정적인 투자가 어려울 수 있습니다');
    }
    
    if (analysis.monthlySavings < 200000) {
      factors.push('월 저축액이 적어 목표 달성에 시간이 오래 걸릴 수 있습니다');
    }
    
    return factors;
  }
  
  // 지출 분석 데이터 생성
  private generateSpendingAnalysis(data: FinancialData, analysis: any) {
    // 아이콘은 컴포넌트에서 직접 import하여 사용하므로 여기서는 제거
    
    const spendingCategories = [
      {
        category: '주거비',
        actualAmount: data.housingCost,
        color: '#3B82F6'
      },
      {
        category: '식비',
        actualAmount: data.foodCost,
        color: '#10B981'
      },
      {
        category: '교통/통신',
        actualAmount: data.transportationCost,
        color: '#F59E0B'
      },
      {
        category: '교육비',
        actualAmount: data.educationCost,
        color: '#8B5CF6'
      },
      {
        category: '여가/취미/쇼핑',
        actualAmount: data.leisureCost,
        color: '#EC4899'
      },
      {
        category: '의료/건강',
        actualAmount: data.medicalCost,
        color: '#EF4444'
      },
      {
        category: '보험',
        actualAmount: data.insuranceCost,
        color: '#8B5A2B'
      },
      {
        category: '기타지출',
        actualAmount: data.otherExpense,
        color: '#6B7280'
      }
    ];
    
    // 연령대, 가족구성, 소득대에 따른 평균 지출액 계산
    const totalIncome = data.monthlyIncome + data.spouseIncome + data.otherIncome;
    const benchmark = getSpendingBenchmarkRatios(data.age, data.familyType, totalIncome / 10000); // 만원 단위로 변환
    
    return spendingCategories.map(item => {
      const benchmarkAmount = (benchmark[item.category] || 0) * totalIncome / 100;
      const difference = item.actualAmount - benchmarkAmount;
      const status = difference > 0 ? 'warning' : 'good';
      
      return {
        category: item.category,
        actualAmount: item.actualAmount,
        benchmarkAmount: benchmarkAmount,
        difference: difference,
        status: status,
        color: item.color
      };
    });
  }
  
  // 시뮬레이션 데이터 생성
  private generateSimulationData(data: FinancialData, analysis: any, simulation: SimulationResult) {
    const currentYear = new Date().getFullYear(); // 2025년
    const years = Array.from({ length: Math.max(10, Math.ceil(simulation.yearsToTarget)) }, (_, i) => currentYear + i);
    
    // 기본 시뮬레이션용 월 저축금액 (기존 방식: 사용자 입력 월 저축만)
    const basicMonthlySavings = analysis.monthlySavings;
    
    // 추천상품 기반 시뮬레이션용 월 저축금액 (새로운 방식: 월 저축 가능액 + 실천가능한 저축목표)
    const totalIncome = data.monthlyIncome + data.spouseIncome + data.otherIncome;
    const totalExpenses = data.housingCost + data.foodCost + data.educationCost + 
                         data.transportationCost + data.leisureCost + data.medicalCost + 
                         data.insuranceCost + data.otherExpense;
    const additionalSurplus = totalIncome - totalExpenses - analysis.monthlySavings;
    const monthlySavingsPotential = analysis.monthlySavings + Math.max(0, additionalSurplus);
    const practicalSavingsGoal = Math.max(0, additionalSurplus) * 0.5;
    const recommendedMonthlySavings = monthlySavingsPotential + practicalSavingsGoal;
    
    // 기본 예금 시뮬레이션 (3.5% 수익률) - 기존 월 저축만 사용
    const basicAssets = this.calculateProjectedGrowth(
      analysis.netWorth,
      basicMonthlySavings * 0.7,
      3.5,
      years.length
    );
    
    // 추천 상품 기반 시뮬레이션 (가중 평균 수익률 사용) - 새로운 계산 방식 사용
    const avgReturn = this.calculateWeightedReturn(simulation.recommendedProducts, data, analysis);
    
    const recommendedAssets = this.calculateProjectedGrowth(
      analysis.netWorth,
      recommendedMonthlySavings * 0.7,
      avgReturn,
      years.length
    );
    
    return {
      years: years,
      basicAssets: basicAssets,
      recommendedAssets: recommendedAssets,
      targetAmount: data.targetAmount * 100000000, // 억원을 원으로 변환
      basicYears: this.calculateYearsToTarget(analysis.netWorth, basicMonthlySavings * 0.7, data.targetAmount * 100000000, 3.5),
      recommendedYears: simulation.yearsToTarget
    };
  }
  
  // 추천 이유 생성
  private generateRecommendationReason(product: FinancialProduct, data: FinancialData, analysis: any): string {
    const reasons = {
      'savings': '비상금 확보 및 단기 목표 달성에 적합',
      'fund': '장기 투자 및 자산 증식에 최적',
      'pension': '세제혜택과 안정적 수익을 동시에',
      'investment': '높은 수익률을 추구하는 투자자에게 적합',
      'insurance': '리스크 관리와 자산 보호에 필수'
    };
    
    return reasons[product.type] || '개인 상황에 맞는 맞춤형 상품';
  }
  
  // 종합 리포트 생성 (위험도 평가도 맞춤형으로)
  generateReport(data: FinancialData, analysis: any, recommendations: FinancialProduct[], simulation: SimulationResult) {
    const riskAssessment = this.generateRiskAssessment(data, analysis);
    // simulation.riskAssessment를 맞춤형으로 덮어씀
    simulation.riskAssessment = riskAssessment;
    
    // 지출 분석 데이터 생성
    const spendingAnalysis = this.generateSpendingAnalysis(data, analysis);
    
    // 시뮬레이션 데이터 생성
    const simulationData = this.generateSimulationData(data, analysis, simulation);
    
    // 추천 상품 데이터 변환
    const recommendationsData = recommendations.map(product => ({
      id: product.id,
      name: product.name,
      type: product.type as 'fund' | 'savings' | 'pension' | 'retirement',
      category: product.category,
      return: product.expectedReturn,
      riskLevel: product.riskLevel,
      minAmount: product.minAmount,
      description: product.description,
      reason: this.generateRecommendationReason(product, data, analysis)
    }));
    
    const report = {
      personalInfo: {
        name: data.name,
        gender: data.gender,
        age: data.age,
        familyType: data.familyType
      },
      assetInfo: {
        savings: data.savings,
        investments: data.investments,
        realEstate: data.realEstate,
        car: data.car,
        retirement: data.retirement,
        otherAssets: data.otherAssets,
        creditLoan: data.creditLoan,
        depositLoan: data.depositLoan,
        mortgageLoan: data.mortgageLoan,
        studentLoan: data.studentLoan,
        otherDebt: data.otherDebt,

      },
      expenseInfo: {
        housingCost: data.housingCost,
        foodCost: data.foodCost,
        educationCost: data.educationCost,
        transportationCost: data.transportationCost,
        leisureCost: data.leisureCost,
        medicalCost: data.medicalCost,
        insuranceCost: data.insuranceCost,
        otherExpense: data.otherExpense,

      },
      incomeInfo: {
        monthlyIncome: data.monthlyIncome,
        spouseIncome: data.spouseIncome,
        otherIncome: data.otherIncome
      },
      summary: {
        targetAmount: data.targetAmount, // 이미 억 단위로 들어옴
        targetDate: data.targetDate,
        netWorth: analysis.netWorth,
        monthlySavings: analysis.monthlySavings,
        financialHealth: analysis.financialHealth
      },
      spendingAnalysis: spendingAnalysis,
      recommendations: recommendationsData,
      simulation: simulationData
    };
    return report;
  }

  // 개인 상황별 투자 가능 배수 계산
  private getAffordableMultiplier(age: number, familyType: string, totalIncome: number, debtRatio: number): number {
    let multiplier = 6; // 기본 6개월치
    
    // 연령별 조정
    if (age < 30) multiplier = 8; // 20대: 더 적극적
    else if (age >= 50) multiplier = 4; // 50대 이상: 보수적
    
    // 가족구성별 조정
    if (familyType.includes('자녀')) multiplier *= 0.8; // 자녀가 있으면 보수적
    
    // 소득별 조정
    if (totalIncome >= 8000000) multiplier *= 1.2; // 고소득: 여유
    else if (totalIncome <= 3000000) multiplier *= 0.7; // 저소득: 보수적
    
    // 부채비율별 조정
    if (debtRatio >= 60) multiplier *= 0.5; // 부채 많으면 매우 보수적
    else if (debtRatio <= 20) multiplier *= 1.3; // 부채 적으면 적극적
    
    return Math.max(2, Math.min(12, multiplier)); // 2~12개월 범위로 제한
  }
}

export default FinanceAnalysisEngine; 