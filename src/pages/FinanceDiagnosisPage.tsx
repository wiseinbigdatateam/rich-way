import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PiggyBank, ArrowRight, Send, User, Bot, Menu, Check } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

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
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isAllCompleted, setIsAllCompleted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      question: '월 주거비(월세/관리비 등)를 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '월 주거비를 입력하세요'
    },
    {
      field: 'utilityCost',
      question: '월 공과금/통신비를 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '월 공과금/통신비를 입력하세요'
    },
    {
      field: 'foodCost',
      question: '월 식비를 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '월 식비를 입력하세요'
    },
    {
      field: 'educationCost',
      question: '월 교육비(자녀)를 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '월 교육비를 입력하세요 (없으면 0)'
    },
    {
      field: 'leisureCost',
      question: '월 여가/취미/쇼핑비를 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '월 여가/취미/쇼핑비를 입력하세요'
    },
    {
      field: 'loanPayment',
      question: '월 대출 상환금을 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '월 대출 상환금을 입력하세요 (없으면 0)'
    },
    {
      field: 'insuranceCost',
      question: '월 보험료를 알려주세요.',
      inputType: 'amount' as const,
      placeholder: '월 보험료를 입력하세요'
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToInputArea = () => {
    inputAreaRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const focusInput = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Scroll to input area when a new bot message is added
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.type === 'bot' && messages.length > 1) {
      setTimeout(() => {
        scrollToInputArea();
        // Focus input if it's not checkbox or radio type
        const inputType = lastMessage.inputType;
        if (inputType && !['checkbox', 'radio'].includes(inputType)) {
          focusInput();
        }
      }, 500); // Small delay to ensure the message is rendered
    }
  }, [messages]);

  const formatAmount = (value: string) => {
    const number = parseInt(value.replace(/,/g, ''));
    if (isNaN(number)) return '';
    return number.toLocaleString();
  };

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      setCurrentCheckboxes([...currentCheckboxes, value]);
    } else {
      setCurrentCheckboxes(currentCheckboxes.filter(item => item !== value));
    }
  };

  const handleRadioChange = (value: string) => {
    setCurrentRadioValue(value);
    // Auto submit after selection
    setTimeout(() => {
      handleSubmit(value);
    }, 100);
  };

  const handleSubmit = (value?: string) => {
    const currentQuestion = questions[currentStep];
    let inputValue = value || currentInput;
    let displayValue = inputValue;

    // Handle different input types
    if (currentQuestion.inputType === 'checkbox') {
      if (currentCheckboxes.length === 0) return;
      inputValue = currentCheckboxes.join(',');
      displayValue = currentCheckboxes.map(val => 
        currentQuestion.options?.find(opt => opt.value === val)?.label || val
      ).join(', ');
      
      if (currentCheckboxes.includes('other') && otherInput) {
        displayValue += `, 기타: ${otherInput}`;
        inputValue += `,other_detail:${otherInput}`;
      }
    } else if (currentQuestion.inputType === 'radio') {
      if (!inputValue) return;
      displayValue = currentQuestion.options?.find(opt => opt.value === inputValue)?.label || inputValue;
    } else if (currentQuestion.inputType === 'target-amount') {
      if (!inputValue.trim()) return;
      displayValue = `${formatAmount(inputValue)}억원`;
    } else if (currentQuestion.inputType === 'amount') {
      if (!inputValue.trim()) return;
      displayValue = `${formatAmount(inputValue)}만원`;
    } else {
      if (!inputValue.trim()) return;
    }

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: displayValue
    };

    // Update form data
    const newFormData = {
      ...formData,
      [currentQuestion.field]: inputValue
    };
    setFormData(newFormData);

    const newMessages = [...messages, userMessage];

    // Check if there are more questions
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
      setCurrentStep(currentStep + 1);
    } else {
      // All questions completed
      const completionMessage: Message = {
        id: messages.length + 2,
        type: 'bot',
        content: '모든 정보를 입력해주셔서 감사합니다! 이제 귀하의 재무 상황을 종합적으로 분석하여 맞춤형 재무 설계 리포트를 제공해드릴 수 있습니다.'
      };
      newMessages.push(completionMessage);
      setIsAllCompleted(true);
    }

    setMessages(newMessages);
    setCurrentInput('');
    setCurrentCheckboxes([]);
    setCurrentRadioValue('');
    setOtherInput('');
  };

  const getCurrentInputType = () => {
    const lastMessage = messages[messages.length - 1];
    return lastMessage?.type === 'bot' ? lastMessage.inputType : null;
  };

  const getCurrentOptions = () => {
    const lastMessage = messages[messages.length - 1];
    return lastMessage?.type === 'bot' ? lastMessage.options : [];
  };

  const getCurrentPlaceholder = () => {
    const lastMessage = messages[messages.length - 1];
    return lastMessage?.type === 'bot' ? lastMessage.placeholder : '';
  };

  const renderInput = () => {
    const inputType = getCurrentInputType();
    const options = getCurrentOptions();
    const placeholder = getCurrentPlaceholder();

    if (inputType === 'checkbox') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {options?.map((option) => (
              <Button
                key={option.value}
                variant={currentCheckboxes.includes(option.value) ? "default" : "outline"}
                onClick={() => handleCheckboxChange(option.value, !currentCheckboxes.includes(option.value))}
                className={`h-auto p-3 text-left justify-start relative ${
                  currentCheckboxes.includes(option.value) 
                    ? "bg-orange-500 hover:bg-orange-600 text-white" 
                    : "border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                <div className="flex items-center space-x-2 w-full">
                  <div className={`w-4 h-4 border rounded flex items-center justify-center ${
                    currentCheckboxes.includes(option.value) 
                      ? "bg-white border-white" 
                      : "border-gray-400"
                  }`}>
                    {currentCheckboxes.includes(option.value) && (
                      <Check size={12} className="text-orange-500" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
              </Button>
            ))}
          </div>
          {currentCheckboxes.includes('other') && (
            <div className="mt-3">
              <Input
                type="text"
                value={otherInput}
                onChange={(e) => setOtherInput(e.target.value)}
                placeholder="기타 내용을 입력하세요"
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          )}
          <Button
            onClick={() => handleSubmit()}
            disabled={currentCheckboxes.length === 0}
            className="bg-orange-500 hover:bg-orange-600 text-white w-full mt-4 font-semibold"
          >
            선택 완료
          </Button>
        </div>
      );
    }

    if (inputType === 'radio') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {options?.map((option) => (
              <Button
                key={option.value}
                variant={currentRadioValue === option.value ? "default" : "outline"}
                onClick={() => handleRadioChange(option.value)}
                className={`h-auto p-3 text-left justify-start relative ${
                  currentRadioValue === option.value 
                    ? "bg-orange-500 hover:bg-orange-600 text-white" 
                    : "border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                <div className="flex items-center space-x-2 w-full">
                  <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${
                    currentRadioValue === option.value 
                      ? "bg-white border-white" 
                      : "border-gray-400"
                  }`}>
                    {currentRadioValue === option.value && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      );
    }

    if (inputType === 'target-amount') {
      return (
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setCurrentInput(formatAmount(value));
              }}
              placeholder={placeholder}
              className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 pr-12"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
              억원
            </span>
          </div>
          <Button
            onClick={() => handleSubmit()}
            disabled={!currentInput.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold"
          >
            <Send size={18} />
          </Button>
        </div>
      );
    }

    if (inputType === 'amount') {
      return (
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setCurrentInput(formatAmount(value));
              }}
              placeholder={placeholder}
              className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 pr-16"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
              만원
            </span>
          </div>
          <Button
            onClick={() => handleSubmit()}
            disabled={!currentInput.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold"
          >
            <Send size={18} />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex space-x-2">
        <Input
          ref={inputRef}
          type={inputType === 'number' ? 'number' : 'text'}
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          placeholder={placeholder}
          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <Button
          onClick={() => handleSubmit()}
          disabled={!currentInput.trim()}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold"
        >
          <Send size={18} />
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">나의 재무 목표 달성을 위한 최상의 플랜</h1>
            <p className="text-gray-600 mb-1">금융 전문가의 자산관리 컨설팅 리포트를 무료로 받아보세요.</p>
            <p className="text-2xl font-bold text-blue-600">부자가 되는 첫 걸음입니다</p>
          </div>

          {/* Header - KakaoTalk style */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <PiggyBank className="text-orange-600" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">재무설계 상담사</h2>
                <p className="text-xs text-gray-500">온라인</p>
              </div>
            </div>
            <Menu className="text-gray-400" size={24} />
          </div>

          {/* Chat Container - KakaoTalk style */}
          <div className="bg-white min-h-96">
            {/* Messages */}
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {message.type === 'bot' && (
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                        <PiggyBank className="text-orange-600" size={16} />
                      </div>
                    )}
                    <div className={`px-3 py-2 rounded-2xl max-w-xs break-words ${
                      message.type === 'user'
                        ? 'bg-orange-500 text-white rounded-br-md'
                        : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-200'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    {message.type === 'user' && (
                      <div className="text-xs text-gray-400 mb-1">읽음</div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - KakaoTalk style */}
            {!isAllCompleted && (
              <div ref={inputAreaRef} className="p-4 bg-white border-t border-gray-100">
                {renderInput()}
              </div>
            )}
          </div>

          {/* Actions - KakaoTalk style */}
          <div className="bg-white border-t border-gray-200 p-4 flex justify-between items-center">
            <Link to="/diagnosis">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-white">
                진단 메인으로
              </Button>
            </Link>

            {isAllCompleted && (
              <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg px-8 py-3">
                분석시작하기
                <ArrowRight className="ml-2" size={20} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDiagnosisPage;
