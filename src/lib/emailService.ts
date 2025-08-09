// 이메일 발송 서비스
// 캡처된 설정을 기반으로 한 SMTP 이메일 발송

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailContent {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// 이메일 서버 설정 (캡처된 내용 기반)
const getEmailConfig = (): EmailConfig => {
  // 환경 감지: URL 기반으로 환경 판단
  const currentUrl = window.location.hostname;
  const isDevelopment = currentUrl === 'localhost' || currentUrl === 'dev.rich-way.co.kr';
  const isProduction = currentUrl === 'rich-way.co.kr';
  
  // 환경별 이메일 비밀번호 설정
  let emailPassword = '';
  if (isDevelopment) {
    emailPassword = import.meta.env.VITE_EMAIL_PASSWORD_DEV || '';
  } else if (isProduction) {
    emailPassword = import.meta.env.VITE_EMAIL_PASSWORD_PROD || '';
  } else {
    // 기본값 (운영 환경)
    emailPassword = import.meta.env.VITE_EMAIL_PASSWORD_PROD || '';
  }
  
  return {
    host: 'smtp.worksmobile.com',
    port: 587,
    secure: false, // STARTTLS 사용
    auth: {
      user: 'rich-way@wiseinc.co.kr', // 보내는 메일 주소 수정
      pass: emailPassword,
    },
  };
};

const emailConfig = getEmailConfig();

// 환경변수 설정 확인 및 디버깅 정보
console.log('📧 이메일 설정 확인:');
console.log('   현재 URL:', window.location.hostname);
console.log('   환경 감지:', window.location.hostname === 'localhost' || window.location.hostname === 'dev.rich-way.co.kr' ? '개발' : '운영');
console.log('   보내는 메일:', emailConfig.auth.user);
console.log('   이메일 비밀번호:', emailConfig.auth.pass ? '✅ 설정됨' : '❌ 설정되지 않음');

// 환경변수 설정 상태 확인
if (window.location.hostname === 'localhost' || window.location.hostname === 'dev.rich-way.co.kr') {
  console.log('   개발 환경 변수:', {
    VITE_EMAIL_PASSWORD_DEV: import.meta.env.VITE_EMAIL_PASSWORD_DEV ? '✅ 설정됨' : '❌ 설정되지 않음'
  });
} else {
  console.log('   운영 환경 변수:', {
    VITE_EMAIL_PASSWORD_PROD: import.meta.env.VITE_EMAIL_PASSWORD_PROD ? '✅ 설정됨' : '❌ 설정되지 않음'
  });
}

// 비밀번호 재설정 이메일 템플릿 생성
const createPasswordResetEmail = (email: string, resetLink: string) => {
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

// 이메일 발송 함수 (서버 사이드에서 실행되어야 함)
export const sendPasswordResetEmail = async (email: string, resetLink: string): Promise<{ success: boolean; message: string; error?: any }> => {
  try {
    // 클라이언트 사이드에서는 직접 SMTP 발송이 불가능하므로
    // 서버 API 엔드포인트를 호출하는 방식으로 구현
    
    // 환경에 따른 이메일 서버 URL 설정
    const currentUrl = window.location.hostname;
    const isDevelopment = currentUrl === 'localhost' || currentUrl === 'dev.rich-way.co.kr';
    const isProduction = currentUrl === 'rich-way.co.kr';
    
    let emailServerUrl = '';
    if (isDevelopment) {
      emailServerUrl = 'http://localhost:3001';
    } else if (isProduction) {
      emailServerUrl = 'https://rich-way.co.kr:3001'; // 운영 환경에서는 같은 도메인 사용
    } else {
      emailServerUrl = 'http://localhost:3001'; // 기본값
    }
    
    console.log('📧 이메일 서버 URL:', emailServerUrl);
    
    const response = await fetch(`${emailServerUrl}/api/send-password-reset-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        resetLink,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || '이메일 발송에 실패했습니다.');
    }

    return {
      success: true,
      message: `${email}로 비밀번호 재설정 이메일을 발송했습니다.`,
    };
  } catch (error) {
    console.error('이메일 발송 오류:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '이메일 발송 중 오류가 발생했습니다.',
      error,
    };
  }
};

// 이메일 템플릿 생성 함수 (클라이언트에서 사용)
export const generatePasswordResetEmailContent = (email: string, resetLink: string) => {
  return createPasswordResetEmail(email, resetLink);
};

// 이메일 설정 검증
export const validateEmailConfig = () => {
  const requiredEnvVars = ['VITE_EMAIL_PASSWORD'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('⚠️ 이메일 발송을 위한 환경변수가 설정되지 않았습니다:', missingVars);
    return false;
  }
  
  return true;
}; 