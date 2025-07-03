import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleMailto = () => {
    window.location.href = "mailto:rich-way@wiseinc.co.kr";
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 py-8 px-2 sm:px-4 md:px-8 lg:px-0">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-3xl font-bold mb-8 text-center text-slate-900">1:1 문의</h1>
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleMailto(); }}>
            <div>
              <label htmlFor="name" className="block mb-1 font-medium">이름</label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                aria-required="true"
                aria-label="이름"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 font-medium">이메일</label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                aria-required="true"
                aria-label="이메일"
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-1 font-medium">문의내용</label>
              <textarea
                id="message"
                name="message"
                className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={6}
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                aria-required="true"
                aria-label="문의내용"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="이메일로 문의하기"
            >
              이메일로 문의하기
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage; 