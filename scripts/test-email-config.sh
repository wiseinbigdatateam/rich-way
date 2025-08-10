#!/bin/bash

# =====================================================
# 이메일 설정 테스트 스크립트
# =====================================================

echo "🔧 이메일 설정 테스트 시작..."
echo "====================================================="

# 현재 디렉토리 확인
echo "📍 현재 디렉토리: $(pwd)"

# 환경변수 파일 확인
echo "📁 환경변수 파일 확인:"
if [ -f ".env.production" ]; then
    echo "  ✅ .env.production 파일 존재"
    echo "  📧 이메일 비밀번호 설정 여부:"
    if grep -q "VITE_EMAIL_PASSWORD_PROD" .env.production; then
        echo "    ✅ VITE_EMAIL_PASSWORD_PROD 설정됨"
        # 비밀번호 길이만 표시 (보안상)
        PASSWORD_LENGTH=$(grep "VITE_EMAIL_PASSWORD_PROD" .env.production | cut -d'=' -f2 | wc -c)
        echo "    📏 비밀번호 길이: $((PASSWORD_LENGTH - 1))"
    else
        echo "    ❌ VITE_EMAIL_PASSWORD_PROD 설정되지 않음"
    fi
else
    echo "  ❌ .env.production 파일이 존재하지 않음"
    echo "  💡 env.production.example을 복사하여 .env.production 파일을 생성하세요"
fi

if [ -f ".env.development" ]; then
    echo "  ✅ .env.development 파일 존재"
else
    echo "  ❌ .env.development 파일이 존재하지 않음"
fi

echo ""
echo "🔧 이메일 서버 설정 확인:"
echo "  📧 SMTP 서버: smtp.worksmobile.com"
echo "  🔌 포트: 587"
echo "  🔐 사용자: rich-way@wiseinc.co.kr"

echo ""
echo "📋 다음 단계:"
echo "1. .env.production 파일이 없다면: cp env.production.example .env.production"
echo "2. .env.production 파일에서 VITE_EMAIL_PASSWORD_PROD를 실제 네이버웍스 비밀번호로 변경"
echo "3. 이메일 서버 재시작: NODE_ENV=production node email-api.js"

echo ""
echo "====================================================="
echo "🔧 이메일 설정 테스트 완료"
