import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const faqs = [
  {
    id: "faq1",
    question: "서비스 이용은 무료인가요?",
    answer: "네, 기본 서비스는 무료로 제공되며 일부 프리미엄 서비스는 유료입니다.",
  },
  {
    id: "faq2",
    question: "회원가입은 어떻게 하나요?",
    answer: "상단의 회원가입 버튼을 클릭 후 안내에 따라 정보를 입력하시면 됩니다.",
  },
  {
    id: "faq3",
    question: "비밀번호를 잊어버렸어요.",
    answer: "로그인 화면에서 '비밀번호 찾기'를 통해 재설정하실 수 있습니다.",
  },
  {
    id: "faq4",
    question: "1:1 문의는 어떻게 하나요?",
    answer: "푸터의 1:1 문의 메뉴를 통해 문의하실 수 있습니다.",
  },
  {
    id: "faq5",
    question: "개인정보는 안전하게 보호되나요?",
    answer: "네, 관련 법령에 따라 안전하게 관리되고 있습니다.",
  },
];

const FaqPage = () => (
  <div className="min-h-screen bg-white flex flex-col">
    <Header />
    <main className="flex-1 py-8 px-2 sm:px-4 md:px-8 lg:px-0">
      <div className="max-w-3xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-8 text-center text-slate-900">자주 묻는 질문(FAQ)</h1>
        <nav aria-label="FAQ 목차" className="mb-8">
          <ul className="flex flex-wrap gap-2 justify-center text-sm md:text-base">
            {faqs.map(faq => (
              <li key={faq.id}>
                <a href={`#${faq.id}`} className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 px-2 py-1 rounded transition" tabIndex={0} aria-label={faq.question}>
                  {faq.question}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="prose max-w-none text-gray-800 leading-relaxed">
          {faqs.map(faq => (
            <section key={faq.id} className="mb-8">
              <h2 id={faq.id} className="text-xl font-bold text-blue-700 mt-10 mb-2">{faq.question}</h2>
              <p>{faq.answer}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default FaqPage; 