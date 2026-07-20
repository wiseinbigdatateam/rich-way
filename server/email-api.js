const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
// 환경에 따른 .env 파일 로딩
const isProduction = process.env.NODE_ENV === 'production';
// 메일 서버 디렉토리의 .env 파일 우선 로딩
require('dotenv').config({ path: path.join(__dirname, '.env') });
// 백업으로 상위 디렉토리의 환경변수 파일도 로딩
const envFile = isProduction ? '.env.production' : '.env.development';
require('dotenv').config({ path: path.join(__dirname, '..', envFile) });

const app = express();
const PORT = process.env.PORT || 3001;

// multer 설정 (파일 업로드용)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5 // 최대 5개 파일
  },
  fileFilter: (req, file, cb) => {
    // 허용된 파일 타입
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
      'application/x-rar-compressed'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('지원하지 않는 파일 형식입니다.'), false);
    }
  }
});

// 미들웨어 설정
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'https://dev.rich-way.co.kr', 'https://rich-way.co.kr'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 이메일 설정 (네이버웍스)
const getEmailConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  let emailPassword = '';
  
  // 환경변수에서 비밀번호 가져오기
  if (isDevelopment) {
    emailPassword = process.env.VITE_EMAIL_PASSWORD_DEV || process.env.EMAIL_PASSWORD_DEV || '';
  } else {
    emailPassword = process.env.VITE_EMAIL_PASSWORD_PROD || process.env.EMAIL_PASSWORD_PROD || '';
  }
  
  // 비밀번호가 없으면 에러 발생
  if (!emailPassword) {
    throw new Error(`이메일 비밀번호가 설정되지 않았습니다. ${isDevelopment ? 'VITE_EMAIL_PASSWORD_DEV' : 'VITE_EMAIL_PASSWORD_PROD'} 환경변수를 확인해주세요.`);
  }
  
  console.log('🔧 이메일 설정 정보:');
  console.log('- 환경:', isDevelopment ? 'development' : 'production');
  console.log('- 이메일 주소: rich-way@wiseinc.co.kr');
  console.log('- 비밀번호 설정됨:', emailPassword ? '✅' : '❌');
  console.log('- 비밀번호 길이:', emailPassword.length);
  console.log('- 환경변수 파일:', isProduction ? '.env.production' : '.env.development');
  
  return {
    host: 'smtp.worksmobile.com', // 네이버웍스 SMTP 서버
    port: 587,
    secure: false, // STARTTLS 사용
    auth: {
      user: 'rich-way@wiseinc.co.kr', // 네이버웍스 이메일 주소
      pass: emailPassword, // 네이버웍스 이메일 비밀번호
    },
    tls: {
      rejectUnauthorized: false // SSL 인증서 검증 비활성화 (필요시)
    }
  };
};

// 이메일 템플릿 생성
const createPasswordResetEmail = (email, resetLink) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>비밀번호 재설정</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #ffffff; padding: 30px; border: 1px solid #e9ecef; }
        .button { display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #6c757d; }
        .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Rich Way</h1>
          <p>비밀번호 재설정</p>
        </div>
        <div class="content">
          <h2>안녕하세요!</h2>
          <p>비밀번호 재설정 요청이 접수되었습니다.</p>
          <p>아래 버튼을 클릭하여 새로운 비밀번호를 설정해주세요.</p>
          
          <div style="text-align: center;">
            <a href="${resetLink}" class="button">비밀번호 재설정</a>
          </div>
          
          <div class="warning">
            <strong>주의사항:</strong>
            <ul>
              <li>이 링크는 24시간 동안만 유효합니다.</li>
              <li>본인이 요청하지 않은 경우 이 이메일을 무시하세요.</li>
              <li>보안을 위해 비밀번호 재설정 후 기존 세션은 자동으로 종료됩니다.</li>
            </ul>
          </div>
          
          <p>버튼이 작동하지 않는 경우, 아래 링크를 브라우저에 복사하여 붙여넣기 해주세요:</p>
          <p style="word-break: break-all; color: #007bff;">${resetLink}</p>
        </div>
        <div class="footer">
          <p>이 이메일은 Rich Way 서비스에서 발송되었습니다.</p>
          <p>문의사항이 있으시면 <a href="mailto:rich-way@wiseinc.co.kr">rich-way@wiseinc.co.kr</a>로 연락해주세요.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Rich Way - 비밀번호 재설정

안녕하세요!

비밀번호 재설정 요청이 접수되었습니다.
아래 링크를 클릭하여 새로운 비밀번호를 설정해주세요:

${resetLink}

주의사항:
- 이 링크는 24시간 동안만 유효합니다.
- 본인이 요청하지 않은 경우 이 이메일을 무시하세요.
- 보안을 위해 비밀번호 재설정 후 기존 세션은 자동으로 종료됩니다.

문의사항이 있으시면 rich-way@wiseinc.co.kr로 연락해주세요.

Rich Way 팀
  `;

  return { html, text };
};

// 문의 이메일 템플릿 생성
const createContactEmail = (contactData) => {
  const { name, email, phone, inquiryType, subject, message, priority, preferredContact } = contactData;
  
  const priorityText = {
    'low': '낮음',
    'normal': '보통',
    'high': '높음',
    'urgent': '긴급'
  };
  
  const inquiryTypeText = {
    'general': '일반 문의',
    'technical': '기술 지원',
    'billing': '결제 문의',
    'coaching': '코칭 문의',
    'diagnosis': '진단 문의',
    'education': '교육 문의',
    'product': '상품 문의',
    'bug': '버그 신고',
    'suggestion': '건의사항',
    'partnership': '파트너십',
    'other': '기타'
  };
  
  const preferredContactText = {
    'email': '이메일',
    'phone': '전화',
    'both': '둘 다'
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>1:1 문의 접수</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #ffffff; padding: 30px; border: 1px solid #e9ecef; }
        .info-section { background-color: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0; }
        .info-row { display: flex; margin-bottom: 10px; }
        .info-label { font-weight: bold; width: 120px; }
        .info-value { flex: 1; }
        .message-section { background-color: #ffffff; border: 1px solid #e9ecef; padding: 20px; border-radius: 4px; margin: 20px 0; }
        .priority-urgent { background-color: #f8d7da; border-color: #f5c6cb; }
        .priority-high { background-color: #fff3cd; border-color: #ffeaa7; }
        .priority-normal { background-color: #d1ecf1; border-color: #bee5eb; }
        .priority-low { background-color: #d4edda; border-color: #c3e6cb; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #6c757d; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Rich Way</h1>
          <p>1:1 문의 접수</p>
        </div>
        <div class="content">
          <h2>새로운 문의가 접수되었습니다</h2>
          
          <div class="info-section">
            <h3>📋 문의자 정보</h3>
            <div class="info-row">
              <span class="info-label">이름:</span>
              <span class="info-value">${name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">이메일:</span>
              <span class="info-value">${email}</span>
            </div>
            ${phone ? `<div class="info-row">
              <span class="info-label">연락처:</span>
              <span class="info-value">${phone}</span>
            </div>` : ''}
            <div class="info-row">
              <span class="info-label">선호 연락:</span>
              <span class="info-value">${preferredContactText[preferredContact] || '이메일'}</span>
            </div>
          </div>
          
          <div class="info-section priority-${priority}">
            <h3>📝 문의 내용</h3>
            <div class="info-row">
              <span class="info-label">문의 유형:</span>
              <span class="info-value">${inquiryTypeText[inquiryType] || inquiryType}</span>
            </div>
            <div class="info-row">
              <span class="info-label">우선순위:</span>
              <span class="info-value">${priorityText[priority] || '보통'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">제목:</span>
              <span class="info-value">${subject}</span>
            </div>
          </div>
          
          <div class="message-section">
            <h3>💬 문의 내용</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="background-color: #e7f3ff; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h4>📧 답변 안내</h4>
            <p>• 문의자: ${name} (${email})</p>
            <p>• 선호 연락 방법: ${preferredContactText[preferredContact] || '이메일'}</p>
            <p>• 우선순위: ${priorityText[priority] || '보통'}</p>
            ${priority === 'urgent' ? '<p style="color: #dc3545; font-weight: bold;">⚠️ 긴급 문의입니다. 빠른 답변이 필요합니다.</p>' : ''}
          </div>
        </div>
        <div class="footer">
          <p>이 이메일은 Rich Way 서비스에서 발송되었습니다.</p>
          <p>문의사항이 있으시면 <a href="mailto:rich-way@wiseinc.co.kr">rich-way@wiseinc.co.kr</a>로 연락해주세요.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Rich Way - 1:1 문의 접수

새로운 문의가 접수되었습니다.

📋 문의자 정보
이름: ${name}
이메일: ${email}
${phone ? `연락처: ${phone}` : ''}
선호 연락: ${preferredContactText[preferredContact] || '이메일'}

📝 문의 내용
문의 유형: ${inquiryTypeText[inquiryType] || inquiryType}
우선순위: ${priorityText[priority] || '보통'}
제목: ${subject}

💬 문의 내용
${message}

📧 답변 안내
문의자: ${name} (${email})
선호 연락 방법: ${preferredContactText[preferredContact] || '이메일'}
우선순위: ${priorityText[priority] || '보통'}
${priority === 'urgent' ? '⚠️ 긴급 문의입니다. 빠른 답변이 필요합니다.' : ''}

Rich Way 팀
  `;

  return { html, text };
};

// 이메일 발송 API
app.post('/api/send-password-reset-email', async (req, res) => {
  try {
    const { to, resetLink } = req.body;
    
    if (!to || !resetLink) {
      return res.status(400).json({
        success: false,
        message: '이메일 주소와 리셋 링크가 필요합니다.'
      });
    }
    
    // 이메일 설정
    const emailConfig = getEmailConfig();
    const transporter = nodemailer.createTransport(emailConfig);
    
    // 이메일 템플릿 생성
    const { html, text } = createPasswordResetEmail(to, resetLink);
    
    // 이메일 발송
    const mailOptions = {
      from: emailConfig.auth.user,
      to: to,
      subject: 'Rich Way - 비밀번호 재설정',
      html: html,
      text: text
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ 이메일 발송 성공:', info.messageId);
    
    res.json({
      success: true,
      message: `${to}로 비밀번호 재설정 이메일을 발송했습니다.`,
      messageId: info.messageId
    });
    
  } catch (error) {
    console.error('❌ 이메일 발송 실패:', error);
    res.status(500).json({
      success: false,
      message: '이메일 발송에 실패했습니다.',
      error: error.message
    });
  }
});

// 문의 이메일 발송 API (파일 첨부 지원)
app.post('/api/send-contact-email', upload.array('attachments', 5), async (req, res) => {
  try {
    console.log('📨 문의 이메일 요청 받음');
    console.log('📋 요청 바디:', req.body);
    console.log('📎 첨부파일:', req.files);
    
    const { name, email, phone, inquiryType, subject, message, priority, preferredContact } = req.body;
    const files = req.files || [];

    // 필수 필드 검증
    const requiredFields = { name, email, inquiryType, subject, message };
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || value.trim() === '')
      .map(([key]) => key);

    if (missingFields.length > 0) {
      console.log('❌ 누락된 필드:', missingFields);
      return res.status(400).json({
        success: false,
        message: `다음 필수 필드가 누락되었습니다: ${missingFields.join(', ')}`
      });
    }

    // 이메일 설정
    const emailConfig = getEmailConfig();
    const transporter = nodemailer.createTransport(emailConfig);

    // 이메일 템플릿 생성
    const { html, text } = createContactEmail({ name, email, phone, inquiryType, subject, message, priority, preferredContact });

    // 이메일 발송 옵션
    const mailOptions = {
      from: emailConfig.auth.user,
      to: 'rich-way@wiseinc.co.kr', // 문의 이메일은 고정으로 발송
      subject: `[Rich Way] 1:1 문의 - ${subject}`,
      html: html,
      text: text,
      attachments: files.map((file, index) => ({
        filename: file.originalname,
        content: file.buffer,
        contentType: file.mimetype
      }))
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ 문의 이메일 발송 성공:', info.messageId);
    console.log(`📎 첨부파일: ${files.length}개`);

    res.json({
      success: true,
      message: '문의가 성공적으로 접수되었습니다.',
      messageId: info.messageId,
      attachments: files.length
    });

  } catch (error) {
    console.error('❌ 문의 이메일 발송 실패:', error);
    res.status(500).json({
      success: false,
      message: '문의 이메일 발송에 실패했습니다.',
      error: error.message
    });
  }
});

// 서버 상태 확인 API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 이메일 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📧 이메일 API: http://localhost:${PORT}/api/send-password-reset-email`);
  console.log(`🔧 상태 확인: http://localhost:${PORT}/api/health`);
});
