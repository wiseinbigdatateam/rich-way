import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PiggyBank, ArrowRight, Send, User, Bot, Menu, Check, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FinanceAnalysisEngine from "@/lib/financeAnalysis";

interface Message {
  id: number;
  type: 'bot' | 'user';
  content: string;
  inputType?: 'text' | 'number' | 'date' | 'amount' | 'radio' | 'checkbox' | 'textarea' | 'target-amount';
  options?: { value: string; label: string }[];
  field?: string;
  placeholder?: string;
}

const FinanceDiagnosisPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: '귀하의 재무 목표를 달성하기 위한 최상의 플랜을 제공합니다. 금융 전문가의 자산관리 컨설팅 리포트를 무료로 받아보세요. 부자가 되는 첫 걸음입니다! 먼저 어떤 목표로 돈을 모우고자 하시는지 알려주세요.',
      inputType: 'checkbox',
      field: 'goals',
      options: [
        { value: 'emergency', label: '생활비 / 비상금 확보' },
        { value: 'housing', label: '전세금 / 내 집 마련' },
        { value: 'family', label: '결혼 / 출산 / 육아 준비' },
        { value: 'investment', label: '종잣돈 / 투자금 만들기' },
        { value: 'education', label: '자녀 교육비' },
        { value: 'retirement', label: '은퇴 / 노후 준비' },
        { value: 'lifestyle', label: '여행, 차 구입 등 라이프 이벤트' },
        { value: 'other', label: '기타' }
      ]
    }
  ]);
  
  const [currentInput, setCurrentInput] = useState('');
  const [currentCheckboxes, setCurrentCheckboxes] = useState<string[]>([]);
  const [currentRadioValue, setCurrentRadioValue] = useState('');
  const [otherInput, setOtherInput] = useState('');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isAllCompleted, setIsAllCompleted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 페이지 로드 시 저장된 데이터 복원
  useEffect(() => {
    const savedFormData = localStorage.getItem('financeDiagnosisFormData');
    const savedCurrentStep = localStorage.getItem('financeDiagnosisCurrentStep');
    const savedMessages = localStorage.getItem('financeDiagnosisMessages');
    
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
    
    if (savedCurrentStep) {
      const step = parseInt(savedCurrentStep);
      setCurrentStep(step);
      
      // 저장된 메시지 복원
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // 기본 메시지 설정
        setMessages([
          {
            id: 1,
            type: 'bot',
            content: '귀하의 재무 목표를 달성하기 위한 최상의 플랜을 제공합니다. 금융 전문가의 자산관리 컨설팅 리포트를 무료로 받아보세요. 부자가 되는 첫 걸음입니다! 먼저 어떤 목표로 돈을 모우고자 하시는지 알려주세요.',
            inputType: 'checkbox',
            field: 'goals',
            options: [
              { value: 'emergency', label: '생활비 / 비상금 확보' },
              { value: 'housing', label: '전세금 / 내 집 마련' },
              { value: 'family', label: '결혼 / 출산 / 육아 준비' },
              { value: 'investment', label: '종잣돈 / 투자금 만들기' },
              { value: 'education', label: '자녀 교육비' },
              { value: 'retirement', label: '은퇴 / 노후 준비' },
              { value: 'lifestyle', label: '여행, 차 구입 등 라이프 이벤트' },
              { value: 'other', label: '기타' }
            ]
          }
        ]);
      }
    }
  }, []);

  // 데이터 자동 저장 (매번 저장)
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem('financeDiagnosisFormData', JSON.stringify(formData));
    }
  }, [formData]);

  // 현재 단계 자동 저장
  useEffect(() => {
    if (currentStep > 0) {
      localStorage.setItem('financeDiagnosisCurrentStep', currentStep.toString());
    }
  }, [currentStep]);

  // 메시지 자동 저장
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem('financeDiagnosisMessages', JSON.stringify(messages));
    }
  }, [messages]);

  const questions = [
    {
      field: 'goals',
      question: '어떤 목표로 돈을 모우고자 하시는지 해당하는 것을 모두 선택해주세요.',
      inputType: 'checkbox' as const,
      options: [
        { value: 'emergency', label: '생활비 / 비상금 확보' },
        { value: 'housing', label: '전세금 / 내 집 마련' },
        { value: 'family', label: '결혼 / 출산 / 육아 준비' },
        { value: 'investment', label: '종잣돈 / 투자금 만들기' },
        { value: 'education', label: '자녀 교육비' },
        { value: 'retirement', label: '은퇴 / 노후 준비' },
        { value: 'lifestyle', label: '여행, 차 구입 등 라이프 이벤트' },
        { value: 'other', label: '기타' }
      ]
    },
    {
      field: 'targetAmount',
      question: '이 목표를 위해 필요한 예상 금액은 어느 정도인가요? (대략적이어도 괜찮습니다)',
      inputType: 'target-amount' as const,
      placeholder: '예상 필요 금액을 입력하세요 (예: 5)'
    },
    {
      field: 'targetDate',
      question: '언제까지 이 목표를 달성하고 싶으신가요? (구체적인 날짜가 아니어도 좋습니다)',
      inputType: 'text' as const,
      placeholder: '달성 목표 시점을 입력하세요 (예: 2026년 12월, 3년 이내 등)'
    },
    {
      field: 'monthlyIncome',
      question: '월 평균 세후 수입(본인)을 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '월 평균 세후 수입을 입력하세요'
    },
    {
      field: 'spouseIncome',
      question: '월 평균 세후 수입(배우자 포함)을 알려주세요. 해당 없으면 0을 입력하세요.',
      inputType: 'amount' as const,
      placeholder: '배우자 수입을 입력하세요 (없으면 0)'
    },
    {
      field: 'otherIncome',
      question: '기타 수입(부수입, 투자수익 등)이 있다면 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '기타 수입을 입력하세요 (없으면 0)'
    },
    {
      field: 'incomeType',
      question: '소득 형태를 선택해주세요.',
      inputType: 'radio' as const,
      options: [
        { value: 'salary', label: '고정급여직' },
        { value: 'freelancer', label: '프리랜서' },
        { value: 'business', label: '자영업' },
        { value: 'other', label: '기타' }
      ]
    },
    {
      field: 'incomeVariability',
      question: '소득의 변동성은 어느 정도인가요?',
      inputType: 'radio' as const,
      options: [
        { value: 'low', label: '거의 없음' },
        { value: 'medium', label: '다소 있음' },
        { value: 'high', label: '매우 높음' }
      ]
    },
    {
      field: 'housingCost',
      question: '월 주거비(월세, 이자, 관리비, 대출상환금 등 포함)를 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '월 주거비를 입력하세요'
    },
    {
      field: 'foodCost',
      question: '월 식비를 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '월 식비를 입력하세요'
    },
    {
      field: 'educationCost',
      question: '월 교육비(본인, 가족/자녀 교육비 포함)를 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '월 교육비를 입력하세요 (없으면 0)'
    },
    {
      field: 'transportationCost',
      question: '월 교통/통신비를 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '월 교통/통신비를 입력하세요'
    },
    {
      field: 'leisureCost',
      question: '월 여가/취미/쇼핑비를 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '월 여가/취미/쇼핑비를 입력하세요'
    },
    {
      field: 'medicalCost',
      question: '월 의료/건강비를 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '월 의료/건강비를 입력하세요'
    },
    {
      field: 'insuranceCost',
      question: '월 보험료를 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '월 보험료를 입력하세요'
    },
    {
      field: 'otherExpense',
      question: '월 기타 지출을 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '월 기타 지출을 입력하세요'
    },
    {
      field: 'monthlySavings',
      question: '월 저축/투자 금액을 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '월 저축/투자 금액을 입력하세요'
    },

    {
      field: 'savings',
      question: '현재 예적금 자산을 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '예적금 자산을 입력하세요'
    },
    {
      field: 'investments',
      question: '주식/펀드/ETF 등 투자자산을 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '투자자산을 입력하세요 (없으면 0)'
    },
    {
      field: 'realEstate',
      question: '부동산 자산(시가 기준)을 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '부동산 자산을 입력하세요 (없으면 0)'
    },
    {
      field: 'car',
      question: '자동차 자산(시가 기준)을 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '자동차 자산을 입력하세요 (없으면 0)'
    },
    {
      field: 'retirement',
      question: '퇴직연금/IRP/연금저축을 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '퇴직연금/IRP/연금저축을 입력하세요 (없으면 0)'
    },
    {
      field: 'otherAssets',
      question: '기타 자산을 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '기타 자산을 입력하세요 (없으면 0)'
    },
    {
      field: 'creditLoan',
      question: '신용대출 금액을 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '신용대출 금액을 입력하세요 (없으면 0)'
    },
    {
      field: 'depositLoan',
      question: '전세자금대출 금액을 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '전세자금대출 금액을 입력하세요 (없으면 0)'
    },
    {
      field: 'mortgageLoan',
      question: '주택담보대출 금액을 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '주택담보대출 금액을 입력하세요 (없으면 0)'
    },
    {
      field: 'studentLoan',
      question: '학자금대출 금액을 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '학자금대출 금액을 입력하세요 (없으면 0)'
    },
    {
      field: 'otherDebt',
      question: '기타 부채를 알려주세요.',
      inputType: 'amount' as const,
            placeholder: '기타 부채를 입력하세요 (없으면 0)'
    },
    {
      field: 'name',
      question: '성함을 알려주세요.',
      inputType: 'text' as const,
      placeholder: '이름을 입력하세요'
    },
    {
      field: 'gender',
      question: '성별을 선택해주세요.',
      inputType: 'radio' as const,
      options: [
        { value: 'male', label: '남' },
        { value: 'female', label: '여' }
      ]
    },
    {
      field: 'age',
      question: '나이를 알려주세요.',
      inputType: 'number' as const,
      placeholder: '나이를 입력하세요'
    },
    {
      field: 'familyType',
      question: '가족 구성을 선택해주세요.',
      inputType: 'radio' as const,
      options: [
        { value: 'single', label: '1인' },
        { value: 'couple', label: '2인' },
        { value: 'family1', label: '부부+자녀1명' },
        { value: 'family2', label: '부부+자녀2명 이상' },
        { value: 'other', label: '기타' }
      ]
    }
  ];

  useEffect(() => {
    scrollToBottom();
    focusInput();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToInputArea = () => {
    inputAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };
  
  const focusInput = () => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        scrollToInputArea();
      }
    }, 100);
  };

  const formatAmount = (value: string) => {
    if (!value) return '';
    // remove non-digit characters
    const numberValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
    if (isNaN(numberValue)) return '';
    return numberValue.toLocaleString('ko-KR');
  };

  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    setCurrentCheckboxes(prev =>
      checked ? [...prev, optionValue] : prev.filter(v => v !== optionValue)
    );
  };

  const handleRadioChange = (value: string) => {
    setCurrentRadioValue(value);
    // Auto submit after selection
    setTimeout(() => {
      handleNext(value);
    }, 100);
  };

  // 진단 다시 시작
  const handleRestart = () => {
    setFormData({});
    setCurrentStep(0);
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: '귀하의 재무 목표를 달성하기 위한 최상의 플랜을 제공합니다. 금융 전문가의 자산관리 컨설팅 리포트를 무료로 받아보세요. 부자가 되는 첫 걸음입니다! 먼저 어떤 목표로 돈을 모우고자 하시는지 알려주세요.',
        inputType: 'checkbox',
        field: 'goals',
        options: [
          { value: 'emergency', label: '생활비 / 비상금 확보' },
          { value: 'housing', label: '전세금 / 내 집 마련' },
          { value: 'family', label: '결혼 / 출산 / 육아 준비' },
          { value: 'investment', label: '종잣돈 / 투자금 만들기' },
          { value: 'education', label: '자녀 교육비' },
          { value: 'retirement', label: '은퇴 / 노후 준비' },
          { value: 'lifestyle', label: '여행, 차 구입 등 라이프 이벤트' },
          { value: 'other', label: '기타' }
        ]
      }
    ]);
    setIsAllCompleted(false);
    
    // 저장된 데이터 삭제
    localStorage.removeItem('financeDiagnosisFormData');
    localStorage.removeItem('financeDiagnosisCurrentStep');
    localStorage.removeItem('financeDiagnosisMessages');
  };

  const handleNext = async (valueOverride?: string) => {
    const currentQuestion = questions[currentStep];
    let value: any;
    let displayValue: string;

    if (currentQuestion.inputType === 'checkbox') {
      if (currentCheckboxes.length === 0) return;
      value = currentCheckboxes;
      if (currentCheckboxes.includes('other') && otherInput) {
        value = [...value, otherInput];
      }
      displayValue = value.map((val: string) => 
        currentQuestion.options?.find(opt => opt.value === val)?.label || val
      ).join(', ');
    } else if (currentQuestion.inputType === 'radio') {
      value = valueOverride || currentRadioValue;
      if (!value) return;
      displayValue = currentQuestion.options?.find(opt => opt.value === value)?.label || value;
    } else if (currentQuestion.inputType === 'target-amount' || currentQuestion.inputType === 'amount') {
      value = currentInput;
      if (!value.trim()) return;
      displayValue = currentQuestion.inputType === 'target-amount' ? `${formatAmount(value)}억원` : `${formatAmount(value)}만원`;
    } 
    else {
      value = currentInput;
      if (!value.trim()) return;
      displayValue = value;
    }

    const newFormData = { ...formData, [currentQuestion.field]: value };
    setFormData(newFormData);

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: displayValue,
    };

    const newMessages: Message[] = [...messages, userMessage];

    if (currentStep < questions.length - 1) {
      const nextQuestion = questions[currentStep + 1];
      const botMessage: Message = {
        id: messages.length + 2,
        type: 'bot',
        content: nextQuestion.question,
        inputType: nextQuestion.inputType,
        options: nextQuestion.options,
        field: nextQuestion.field,
        placeholder: nextQuestion.placeholder
      };
      newMessages.push(botMessage);
      setMessages(newMessages);
      setCurrentStep(currentStep + 1);
      
      // 데이터 저장
      localStorage.setItem('financeDiagnosisFormData', JSON.stringify(newFormData));
      localStorage.setItem('financeDiagnosisCurrentStep', (currentStep + 1).toString());
      localStorage.setItem('financeDiagnosisMessages', JSON.stringify(newMessages));
    } else {
      setIsAllCompleted(true);
      setMessages(newMessages);
      
      // 완료 시 저장된 데이터 삭제
      localStorage.removeItem('financeDiagnosisFormData');
      localStorage.removeItem('financeDiagnosisCurrentStep');
      localStorage.removeItem('financeDiagnosisMessages');
      
      await handleSubmit(newFormData);
    }
    
    // Reset inputs
    setCurrentInput('');
    setCurrentCheckboxes([]);
    // Do not reset radio value here, it's used for submission
    setOtherInput('');
  };

  const handleSubmit = async (finalFormData: Record<string, any>) => {
    setIsLoading(true);
    setError(null);

    const botMessage: Message = {
      id: messages.length + 2,
      type: 'bot',
      content: '재무 분석을 진행하고 있습니다. 잠시만 기다려주세요...',
    };
    setMessages(prev => [...prev, botMessage]);

    try {
      // 프론트엔드에서 직접 재무분석 수행
      const analysisEngine = new FinanceAnalysisEngine();
      
      // finalFormData를 FinancialData 타입으로 변환
      const rawTargetAmount = Number(finalFormData.targetAmount);
      const targetAmount = isNaN(rawTargetAmount) ? 0 : rawTargetAmount; // 억 단위 그대로 사용
      console.log('진단 입력 targetAmount(억):', targetAmount);
      const financialData = {
        ...finalFormData,
        // 수입/지출/자산/부채는 만원 단위를 원 단위로 변환 (× 10000)
        monthlyIncome: (Number(finalFormData.monthlyIncome) || 0) * 10000,
        spouseIncome: (Number(finalFormData.spouseIncome) || 0) * 10000,
        otherIncome: (Number(finalFormData.otherIncome) || 0) * 10000,
        incomeType: finalFormData.incomeType || 'salary',
        incomeVariability: finalFormData.incomeVariability || 'low',
        housingCost: (Number(finalFormData.housingCost) || 0) * 10000,
        foodCost: (Number(finalFormData.foodCost) || 0) * 10000,
        educationCost: (Number(finalFormData.educationCost) || 0) * 10000,
        transportationCost: (Number(finalFormData.transportationCost) || 0) * 10000,
        leisureCost: (Number(finalFormData.leisureCost) || 0) * 10000,
        medicalCost: (Number(finalFormData.medicalCost) || 0) * 10000,
        insuranceCost: (Number(finalFormData.insuranceCost) || 0) * 10000,
        otherExpense: (Number(finalFormData.otherExpense) || 0) * 10000,
        monthlySavings: (Number(finalFormData.monthlySavings) || 0) * 10000,
        savings: (Number(finalFormData.savings) || 0) * 10000,
        investments: (Number(finalFormData.investments) || 0) * 10000,
        realEstate: (Number(finalFormData.realEstate) || 0) * 10000,
        car: (Number(finalFormData.car) || 0) * 10000,
        retirement: (Number(finalFormData.retirement) || 0) * 10000,
        otherAssets: (Number(finalFormData.otherAssets) || 0) * 10000,
        creditLoan: (Number(finalFormData.creditLoan) || 0) * 10000,
        depositLoan: (Number(finalFormData.depositLoan) || 0) * 10000,
        mortgageLoan: (Number(finalFormData.mortgageLoan) || 0) * 10000,
        studentLoan: (Number(finalFormData.studentLoan) || 0) * 10000,
        otherDebt: (Number(finalFormData.otherDebt) || 0) * 10000,

        // 목표 금액은 억원 단위 입력값을 원 단위로 변환
        targetAmount,
        targetDate: finalFormData.targetDate || '3년 이내',
        name: finalFormData.name || '사용자',
        gender: finalFormData.gender || 'male',
        age: Number(finalFormData.age) || 30,
        familyType: finalFormData.familyType || 'single',
        goals: Array.isArray(finalFormData.goals) ? finalFormData.goals : []
      };
      
      // 재무 상태 분석
      const analysis = analysisEngine.analyzeFinancialStatus(financialData);
      
      // 맞춤형 금융상품 추천
      const recommendations = analysisEngine.recommendProducts(financialData, analysis);
      
      // 목표 달성 시뮬레이션
      const simulation = analysisEngine.simulateGoalAchievement(financialData, analysis, recommendations);
      
      // 종합 리포트 생성
      const report = analysisEngine.generateReport(financialData, analysis, recommendations, simulation);
      
      // localStorage에 리포트 저장 (페이지 새로고침 시에도 유지)
      localStorage.setItem('financeDiagnosisReport', JSON.stringify(report));
      
      // 결과 페이지로 이동
      navigate('/diagnosis/finance/result');
      
    } catch (err: any) {
      setError(err.message || '분석 중 오류가 발생했습니다.');
      const errorMessage: Message = {
        id: messages.length + 3,
        type: 'bot',
        content: `오류가 발생했습니다: ${err.message}`,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = () => {
    const currentQuestion = questions[currentStep];
    const placeholder = currentQuestion.placeholder || '답변을 입력해주세요...';

    switch (currentQuestion.inputType) {
      case 'checkbox':
        return (
          <div className="w-full max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-2">
              {currentQuestion.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 p-2 border rounded-md">
                  <Checkbox
                    id={option.value}
                    checked={currentCheckboxes.includes(option.value)}
                    onCheckedChange={(checked) => handleCheckboxChange(option.value, !!checked)}
                  />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer">{option.label}</Label>
                </div>
              ))}
            </div>
            {currentCheckboxes.includes('other') && (
              <Input
                type="text"
                value={otherInput}
                onChange={(e) => setOtherInput(e.target.value)}
                placeholder="기타 목표를 입력하세요"
                className="mt-2"
              />
            )}
            <Button
              onClick={() => handleNext()}
              disabled={currentCheckboxes.length === 0}
              className="bg-orange-500 hover:bg-orange-600 text-white w-full mt-4 font-semibold button-stable"
            >
              <Check className="mr-2 h-4 w-4" /> 확인
            </Button>
          </div>
        );
      case 'radio':
        return (
          <RadioGroup
            value={currentRadioValue}
            onValueChange={handleRadioChange}
            className="grid grid-cols-2 gap-4"
          >
            {currentQuestion.options?.map((option) => (
              <Label
                key={option.value}
                htmlFor={option.value}
                className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  currentRadioValue === option.value
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'bg-white hover:bg-orange-50'
                }`}
              >
                <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                {option.label}
              </Label>
            ))}
          </RadioGroup>
        );
      case 'target-amount':
        return (
          <div className="flex items-center w-full max-w-xs relative">
            <Input
              ref={inputRef}
              type="number"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder={placeholder}
              className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 pr-24"
              onKeyPress={(e) => e.key === 'Enter' && handleNext()}
            />
            <span className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-700 text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
              억원
            </span>
            <Button
              onClick={() => handleNext()}
              disabled={!currentInput.trim()}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold button-stable"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        );
      case 'amount':
        return (
          <div className="flex items-center w-full max-w-xs relative">
            <Input
              ref={inputRef}
              type="number"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder={placeholder}
              className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 pr-24"
              onKeyPress={(e) => e.key === 'Enter' && handleNext()}
            />
            <span className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-700 text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
              만원
            </span>
            <Button
              onClick={() => handleNext()}
              disabled={!currentInput.trim()}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold button-stable"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        );
      default:
        return (
          <div className="flex items-center w-full max-w-xs">
            <Input
              ref={inputRef}
              type={currentQuestion.inputType}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder={placeholder}
              className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              onKeyPress={(e) => e.key === 'Enter' && handleNext()}
            />
            <Button
              onClick={() => handleNext()}
              disabled={!currentInput.trim()}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold button-stable"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        );
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50">
        {/* 상단 버튼 영역 */}
        <div className="p-4 bg-white border-b">
          <div className="max-w-3xl mx-auto flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {currentStep > 0 && `진단 진행률: ${Math.round((currentStep / questions.length) * 100)}%`}
            </div>
            <Button
              onClick={handleRestart}
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-red-600 button-stable"
            >
              진단 다시 시작
            </Button>
          </div>
        </div>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message, index) => (
              <div key={message.id} className={`flex items-start gap-4 ${message.type === 'user' ? 'justify-end' : ''} animation-stable`}>
                {message.type === 'bot' && (
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
                    <Bot size={24} />
                  </div>
                )}
                <div className={`p-4 rounded-xl max-w-[80%] ${
                  message.type === 'bot'
                    ? 'bg-white text-gray-800 rounded-tl-none shadow'
                    : 'bg-orange-500 text-white rounded-br-none shadow'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.type === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                    <User size={24} />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-4 animation-stable">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
                  <Bot size={24} />
                </div>
                <div className="p-4 rounded-xl max-w-[80%] bg-white text-gray-800 rounded-tl-none shadow">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                    <p>리포트를 생성 중입니다...</p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>
        
        {!isAllCompleted && (
          <div ref={inputAreaRef} className="p-4 bg-white border-t animation-stable">
            <div className="max-w-3xl mx-auto flex justify-center">
              {renderInput()}
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 border-t">
            <div className="max-w-3xl mx-auto flex justify-center text-red-600">
              {error}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </>
  );
};

export default FinanceDiagnosisPage;
