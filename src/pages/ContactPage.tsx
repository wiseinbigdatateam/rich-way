import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  User, 
  Upload, 
  X, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  HelpCircle,
  Search,
  Send,
  Loader2
} from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  subject: string;
  message: string;
  attachments: File[];
  priority: string;
  preferredContact: string;
}

const ContactPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("inquiry");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    subject: "",
    message: "",
    attachments: [],
    priority: "normal",
    preferredContact: "email"
  });

  const inquiryTypes = [
    { value: "general", label: "일반 문의", icon: "💬" },
    { value: "technical", label: "기술 지원", icon: "🔧" },
    { value: "billing", label: "결제 문의", icon: "💳" },
    { value: "coaching", label: "코칭 문의", icon: "🎯" },
    { value: "diagnosis", label: "진단 문의", icon: "📊" },
    { value: "education", label: "교육 문의", icon: "📚" },
    { value: "product", label: "상품 문의", icon: "🛍️" },
    { value: "bug", label: "버그 신고", icon: "🐛" },
    { value: "suggestion", label: "건의사항", icon: "💡" },
    { value: "partnership", label: "파트너십", icon: "🤝" },
    { value: "other", label: "기타", icon: "❓" }
  ];

  const faqData = [
    {
      question: "문의 접수 후 답변까지 얼마나 걸리나요?",
      answer: "일반적으로 1-3일 이내에 답변드립니다. 긴급한 문의의 경우 더 빠른 답변이 가능합니다."
    },
    {
      question: "문의 상태를 어떻게 확인할 수 있나요?",
      answer: "문의 접수 시 발급되는 문의번호로 상태를 확인할 수 있습니다. 이메일로도 상태 업데이트를 받으실 수 있습니다."
    },
    {
      question: "파일 첨부는 어떤 형식을 지원하나요?",
      answer: "이미지(JPG, PNG, GIF), 문서(PDF, DOC, DOCX), 압축파일(ZIP, RAR) 형식을 지원합니다. 최대 10MB까지 첨부 가능합니다."
    },
    {
      question: "개인정보는 어떻게 보호되나요?",
      answer: "문의 내용과 첨부파일은 암호화되어 안전하게 보관됩니다. 답변 완료 후 30일이 지나면 자동으로 삭제됩니다."
    },
    {
      question: "긴급한 문의는 어떻게 하나요?",
      answer: "긴급한 문의의 경우 우선순위를 '긴급'으로 설정하거나, 이메일(rich-way@wiseinc.co.kr)로 직접 연락주세요."
    }
  ];

  const handleInputChange = (field: keyof ContactFormData, value: string | File[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/x-rar-compressed'];

    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast({
          variant: "destructive",
          title: "파일 크기 초과",
          description: `${file.name}의 크기가 10MB를 초과합니다.`
        });
        return false;
      }

      const isValidType = allowedTypes.some(type => file.type.startsWith(type));
      if (!isValidType) {
        toast({
          variant: "destructive",
          title: "지원하지 않는 파일 형식",
          description: `${file.name}은 지원하지 않는 파일 형식입니다.`
        });
        return false;
      }

      return true;
    });

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 필수 필드 검증
      if (!formData.name || !formData.email || !formData.inquiryType || !formData.subject || !formData.message) {
        toast({
          variant: "destructive",
          title: "입력 오류",
          description: "모든 필수 항목을 입력해주세요.",
        });
        return;
      }

      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({
          variant: "destructive",
          title: "이메일 형식 오류",
          description: "올바른 이메일 주소를 입력해주세요.",
        });
        return;
      }

      // 환경에 따른 이메일 서버 URL 설정
      const currentUrl = window.location.hostname;
      const isDevelopment = currentUrl === 'localhost' || currentUrl === 'dev.rich-way.co.kr';
      const isProduction = currentUrl === 'rich-way.co.kr';
      
      let emailServerUrl = '';
      if (isDevelopment) {
        emailServerUrl = 'http://localhost:3001';
      } else if (isProduction) {
        emailServerUrl = 'https://rich-way.co.kr:3001';
      } else {
        emailServerUrl = 'http://localhost:3001';
      }

      // FormData 생성 (파일 첨부용)
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('inquiryType', formData.inquiryType);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('priority', formData.priority);
      formDataToSend.append('preferredContact', formData.preferredContact);

      // 파일 첨부
      formData.attachments.forEach((file, index) => {
        formDataToSend.append(`attachments`, file);
      });

      // 문의 이메일 발송
      const response = await fetch(`${emailServerUrl}/api/send-contact-email`, {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '문의 발송에 실패했습니다.');
      }

      // 성공 처리
      toast({
        title: "✅ 문의 접수 완료",
        description: (
          <div className="space-y-2">
            <p className="font-medium">문의가 성공적으로 접수되었습니다.</p>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• 빠른 시일 내에 답변드리겠습니다</p>
              <p>• 입력하신 이메일로 답변을 받으실 수 있습니다</p>
              <p>• 문의번호: {result.messageId}</p>
            </div>
          </div>
        ),
        duration: 5000,
      });

      // 폼 초기화
      setFormData({
        name: "",
        email: "",
        phone: "",
        inquiryType: "",
        subject: "",
        message: "",
        attachments: [],
        priority: "normal",
        preferredContact: "email"
      });

      // 문의 완료 탭으로 이동
      setActiveTab("complete");

    } catch (error) {
      console.error('문의 발송 오류:', error);
      toast({
        variant: "destructive",
        title: "문의 발송 실패",
        description: error instanceof Error ? error.message : "문의 발송 중 오류가 발생했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredFaq = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Header />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 섹션 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              <MessageSquare className="inline-block mr-3 h-10 w-10 text-green-500" />
              1:1 문의하기
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              궁금한 점이나 문의사항이 있으시면 언제든 연락주세요.
            </p>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              전문가가 빠른 시일 내에 답변드리겠습니다.
            </p>
          </div>

          {/* 탭 네비게이션 */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="inquiry" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                문의하기
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                자주 묻는 질문
              </TabsTrigger>
              <TabsTrigger value="complete" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                문의 완료
              </TabsTrigger>
            </TabsList>

            {/* 문의하기 탭 */}
            <TabsContent value="inquiry" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 문의 폼 */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        문의서 작성
                      </CardTitle>
                      <CardDescription>
                        아래 양식을 작성하여 문의사항을 접수해주세요.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 기본 정보 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="flex items-center">
                              <User className="mr-2 h-4 w-4" />
                              이름 *
                            </Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              placeholder="이름을 입력하세요"
                              required
                              disabled={loading}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center">
                              <Mail className="mr-2 h-4 w-4" />
                              이메일 *
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              placeholder="이메일을 입력하세요"
                              required
                              disabled={loading}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="flex items-center">
                            <Phone className="mr-2 h-4 w-4" />
                            연락처 (선택)
                          </Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="연락처를 입력하세요 (선택사항)"
                            disabled={loading}
                          />
                        </div>

                        {/* 문의 유형 및 우선순위 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="inquiryType">문의 유형 *</Label>
                            <Select
                              value={formData.inquiryType}
                              onValueChange={(value) => handleInputChange('inquiryType', value)}
                              disabled={loading}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="문의 유형을 선택하세요" />
                              </SelectTrigger>
                              <SelectContent>
                                {inquiryTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    <span className="mr-2">{type.icon}</span>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="priority">우선순위</Label>
                            <Select
                              value={formData.priority}
                              onValueChange={(value) => handleInputChange('priority', value)}
                              disabled={loading}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">낮음</SelectItem>
                                <SelectItem value="normal">보통</SelectItem>
                                <SelectItem value="high">높음</SelectItem>
                                <SelectItem value="urgent">긴급</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* 제목 */}
                        <div className="space-y-2">
                          <Label htmlFor="subject">제목 *</Label>
                          <Input
                            id="subject"
                            value={formData.subject}
                            onChange={(e) => handleInputChange('subject', e.target.value)}
                            placeholder="문의 제목을 입력하세요"
                            required
                            disabled={loading}
                          />
                        </div>

                        {/* 문의 내용 */}
                        <div className="space-y-2">
                          <Label htmlFor="message">문의 내용 *</Label>
                          <Textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            placeholder="문의 내용을 자세히 입력해주세요. 구체적으로 작성해주시면 더 정확한 답변을 드릴 수 있습니다."
                            rows={6}
                            required
                            disabled={loading}
                          />
                        </div>

                        {/* 파일 첨부 */}
                        <div className="space-y-2">
                          <Label htmlFor="attachments" className="flex items-center">
                            <Upload className="mr-2 h-4 w-4" />
                            파일 첨부 (선택)
                          </Label>
                          <div className="space-y-2">
                            <Input
                              id="attachments"
                              type="file"
                              multiple
                              onChange={handleFileUpload}
                              disabled={loading}
                              accept="image/*,.pdf,.doc,.docx,.zip,.rar"
                            />
                            <p className="text-sm text-slate-500">
                              이미지, PDF, 문서, 압축파일 (최대 10MB)
                            </p>
                          </div>
                          
                          {/* 첨부된 파일 목록 */}
                          {formData.attachments.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium">첨부된 파일:</p>
                              <div className="space-y-1">
                                {formData.attachments.map((file, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                                    <span className="text-sm truncate">{file.name}</span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeFile(index)}
                                      disabled={loading}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 선호 연락 방법 */}
                        <div className="space-y-2">
                          <Label htmlFor="preferredContact">선호하는 연락 방법</Label>
                          <Select
                            value={formData.preferredContact}
                            onValueChange={(value) => handleInputChange('preferredContact', value)}
                            disabled={loading}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="email">이메일</SelectItem>
                              <SelectItem value="phone">전화</SelectItem>
                              <SelectItem value="both">둘 다</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* 제출 버튼 */}
                        <Button type="submit" disabled={loading} className="w-full">
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              문의 접수 중...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              문의 접수하기
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* 연락처 정보 */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">📞 연락처 정보</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-green-500" />
                        <span className="text-sm">rich-way@wiseinc.co.kr</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">평일 09:00 - 18:00</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">답변 기간: 1-3일 이내</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 빠른 링크 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">🔗 빠른 링크</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => navigate('/faq')}
                      >
                        <HelpCircle className="mr-2 h-4 w-4" />
                        FAQ 보기
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => window.open('mailto:rich-way@wiseinc.co.kr', '_blank')}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        이메일로 직접 문의
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* FAQ 탭 */}
            <TabsContent value="faq" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    자주 묻는 질문
                  </CardTitle>
                  <CardDescription>
                    고객님들이 자주 묻는 질문들을 모았습니다.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* 검색 */}
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="FAQ 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* FAQ 목록 */}
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFaq.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  {filteredFaq.length === 0 && searchQuery && (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500">검색 결과가 없습니다.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 문의 완료 탭 */}
            <TabsContent value="complete" className="space-y-6">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl text-green-600">문의 접수 완료!</CardTitle>
                  <CardDescription>
                    문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">📧 답변 안내</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 입력하신 이메일로 답변을 받으실 수 있습니다</li>
                      <li>• 일반적으로 1-3일 이내에 답변드립니다</li>
                      <li>• 긴급한 문의의 경우 더 빠른 답변이 가능합니다</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">📋 추가 문의</h4>
                    <p className="text-sm mb-3">
                      추가 문의사항이 있으시면 언제든 연락주세요.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab("inquiry")}
                      >
                        새 문의하기
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/faq')}
                      >
                        FAQ 보기
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage; 