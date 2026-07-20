import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from './ui/use-toast';
import { Loader2, Mail, Phone, User, MessageSquare, Upload, X, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactDialog = ({ open, onOpenChange }: ContactDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    subject: '',
    message: '',
    priority: 'normal',
    preferredContact: 'email'
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const { toast } = useToast();

  const inquiryTypes = [
    { value: 'general', label: '일반 문의', icon: '💬' },
    { value: 'technical', label: '기술 지원', icon: '🔧' },
    { value: 'billing', label: '결제 문의', icon: '💳' },
    { value: 'coaching', label: '코칭 문의', icon: '🎯' },
    { value: 'diagnosis', label: '진단 문의', icon: '📊' },
    { value: 'education', label: '교육 문의', icon: '📚' },
    { value: 'product', label: '상품 문의', icon: '🛍️' },
    { value: 'bug', label: '버그 신고', icon: '🐛' },
    { value: 'suggestion', label: '건의사항', icon: '💡' },
    { value: 'partnership', label: '파트너십', icon: '🤝' },
    { value: 'other', label: '기타', icon: '❓' }
  ];

  const handleInputChange = (field: string, value: string) => {
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

    setAttachments(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
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
      attachments.forEach((file, index) => {
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
        name: '',
        email: '',
        phone: '',
        inquiryType: '',
        subject: '',
        message: '',
        priority: 'normal',
        preferredContact: 'email'
      });
      setAttachments([]);

      // 다이얼로그 닫기
      onOpenChange(false);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            <MessageSquare className="inline-block mr-2 h-6 w-6 text-green-500" />
            1:1 문의하기
          </DialogTitle>
          <DialogDescription className="text-center">
            궁금한 점이나 문의사항이 있으시면 언제든 연락주세요.
            빠른 시일 내에 답변드리겠습니다.
          </DialogDescription>
        </DialogHeader>

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
              <p className="text-sm text-gray-500">
                이미지, PDF, 문서, 압축파일 (최대 10MB)
              </p>
            </div>
            
            {/* 첨부된 파일 목록 */}
            {attachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">첨부된 파일:</p>
                <div className="space-y-1">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
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

          {/* 개인정보 처리방침 동의 */}
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="privacy"
                required
                disabled={loading}
                className="mt-1"
              />
              <Label htmlFor="privacy" className="text-sm">
                <Link to="/privacy" className="text-green-500 hover:underline">
                  개인정보 처리방침
                </Link>
                에 동의합니다. (필수)
              </Label>
            </div>
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
                <MessageSquare className="mr-2 h-4 w-4" />
                문의 접수하기
              </>
            )}
          </Button>
        </form>

        {/* 연락처 정보 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">📞 추가 연락처</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• 이메일: rich-way@wiseinc.co.kr</p>
            <p>• 응답 시간: 평일 09:00 - 18:00</p>
            <p>• 답변 기간: 1-3일 이내</p>
            <p>• 긴급 문의: 우선순위를 '긴급'으로 설정하세요</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
