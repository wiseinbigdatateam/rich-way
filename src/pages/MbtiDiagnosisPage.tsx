
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const MbtiDiagnosisPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  
  const questions = [
    "다양한 사람들과의 대화를 통해 유용한 재테크/투자 정보를 얻는다.",
    "새로운 기회를 위해 낯선 사람과도 쉽게 관계를 맺는다.",
    "재무 계획이나 투자 결정을 혼자 조용히 고민하는 편이다.",
    "사람들과의 대화를 통해 동기부여를 받고 재무 목표를 설정한 적이 있다.",
    "투자나 부업 아이디어가 생기면, 주로 혼자 조사해서 결정한다.",
    "지출, 수입, 예산 등 구체적인 숫자를 꼼꼼히 관리한다.",
    "'현재 상황'보다는 '미래 가능성'을 중시하며 재무 계획을 세운다.",
    "큰 목표보다는 일단 눈앞의 소소한 재무 문제를 해결하는 데 집중하는 편이다.",
    "\"은퇴 후 자산\", \"10년 뒤 내 집 마련\"과 같은 장기 플랜을 자주 상상한다.",
    "숫자나 예산보다는 직감적으로 \"이 투자는 될 것 같다\"는 식으로 판단하는 경우가 많다.",
    "투자나 소비 결정을 할 때 논리적으로 장단점을 따져본다.",
    "나에게 중요한 재무 결정은 '어떤 삶을 살고 싶은가'라는 가치관에서 출발한다.",
    "소비할 때 \"이건 나를 위한 보상이야\"라는 감정이 영향을 미친다.",
    "돈은 삶의 자유와 효율을 위한 도구라고 생각한다.",
    "지출 전에는 '가성비'나 '미래 가치'를 먼저 고려한다.",
    "월급이 들어오면 먼저 정해진 계획대로 저축/투자를 실행한다.",
    "재무 목표를 명확히 세우고, 달성률을 체크해보는 편이다.",
    "상황이 바뀌면 기존의 재무 계획도 유연하게 바꿔도 괜찮다고 생각한다.",
    "큰 재무 결정을 할 때까지는 시간이 오래 걸려도 계획을 치밀하게 세운다.",
    "지금 수입 구조나 투자 방식이 지루하거나 틀에 박혔다고 느낄 때가 있다.",
    "나는 매달 고정된 수입이 있고, 당분간 그 수입은 유지될 가능성이 높다.",
    "내 총 자산(예금, 투자, 부동산 등)은 작년보다 분명히 늘었다.",
    "나는 신용카드나 대출 등의 부채를 무리 없이 감당하고 있다.",
    "갑작스러운 지출(병원비, 실직 등)에 대비한 최소 3개월치 생활비를 마련해두었다.",
    "나는 현금, 예금 외에도 다양한 금융자산(주식, 펀드, 부동산 등)에 분산 투자하고 있다.",
    "내가 현재 종사하는 직업은 시장 수요가 높고, 장기적으로 안정적인 편이다.",
    "나는 본업 외에도 부업, 임대, 투자 등에서 일정한 수입을 얻고 있다.",
    "예상치 못한 재무 위기가 생길 경우, 가족이나 지인 등으로부터 도움을 받을 수 있다.",
    "나는 질병이나 사고, 자산 손실 등에 대비한 보험에 가입해 두었다.",
    "나는 퇴직연금, 청약저축, 세제 혜택 상품 등 정부·직장의 재무 제도를 잘 활용하고 있다.",
    "금리나 물가, 부동산 등의 경제 변화를 보고 내 재무 전략을 조정한 적이 있다."
  ];
  
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = score;
    setAnswers(newAnswers);
    
    // 자동으로 다음 질문으로 이동
    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }, 200);
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const isCompleted = answers.length === totalQuestions && answers[totalQuestions - 1] !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-lg">
              <Lightbulb className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-purple-700 mb-4 tracking-tight leading-tight" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
            내가 부자가 될 상인가?
          </h1>
          <p className="text-lg text-slate-600 mb-2">
            31개의 문항을 통해 당신의 부자 유형을 진단하고, 맞춤형 재무 리포트를 받아보세요.
          </p>
          <p className="text-sm text-slate-500">
            12분 미만 소요 • 31개 질문
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-slate-600">
              {currentQuestion + 1}/{totalQuestions}
            </span>
            <span className="text-sm font-medium text-purple-600">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress 
            value={progress} 
            className="h-3 bg-slate-200" 
          />
        </div>

        {/* Question Card */}
        <Card className="mb-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-800 leading-relaxed">
                {questions[currentQuestion]}
              </h2>
            </div>
            
            {/* Answer Options - Centered and 2/3 width */}
            <div className="flex justify-center">
              <div className="w-full max-w-2xl space-y-3">
                {[
                  { score: 5, text: "매우 그렇다" },
                  { score: 4, text: "그런 편이다" },
                  { score: 3, text: "보통이다" },
                  { score: 2, text: "그렇지 않은 편이다" },
                  { score: 1, text: "전혀 그렇지 않다" }
                ].map((option) => {
                  const isSelected = answers[currentQuestion] === option.score;
                  return (
                    <div key={option.score} className="relative group">
                      <Button
                        onClick={() => handleAnswer(option.score)}
                        variant="outline"
                        className={`w-full py-6 text-lg font-medium rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg relative overflow-hidden ${
                          isSelected
                            ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white border-transparent shadow-xl transform scale-[1.02]"
                            : "bg-gradient-to-r from-purple-50 via-purple-25 to-purple-50 border-purple-200 hover:border-purple-300 hover:bg-purple-100 text-slate-700"
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <span className="relative z-10 flex items-center justify-center">
                          {isSelected && (
                            <div className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse"></div>
                          )}
                          {option.text}
                        </span>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div>
            {currentQuestion > 0 && (
              <Button
                onClick={goToPrevious}
                variant="outline"
                className="px-6 py-3 rounded-xl border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
              >
                <ArrowLeft className="mr-2" size={18} />
                이전
              </Button>
            )}
          </div>
          
          <Link to="/diagnosis">
            <Button 
              variant="ghost" 
              className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200"
            >
              진단 메인으로
            </Button>
          </Link>

          <div>
            {isLastQuestion && isCompleted && (
              <Button 
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                결과 보기
              </Button>
            )}
          </div>
        </div>

        {/* Question Counter at Bottom */}
        <div className="text-center mt-8">
          <div className="inline-flex space-x-1">
            {Array.from({ length: totalQuestions }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i <= currentQuestion
                    ? "bg-purple-600 transform scale-125"
                    : "bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MbtiDiagnosisPage;
