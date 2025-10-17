#!/bin/bash

# =====================================================
# 운영서버 환경변수를 개발 DB로 임시 변경
# =====================================================

set -e

echo "🔄 운영서버 환경변수를 개발 DB로 변경합니다..."

# 개발 DB 정보 (여기에 실제 개발 DB 정보를 입력하세요)
DEV_SUPABASE_URL="https://your-dev-supabase-url.supabase.co"
DEV_SUPABASE_KEY="your-dev-supabase-anon-key"

# 현재 운영 환경변수 백업
if [ ! -f ".env.production.original" ]; then
    echo "📦 현재 운영 환경변수 백업 중..."
    cp .env.production .env.production.original
    echo "✅ 백업 완료: .env.production.original"
fi

# 개발 DB로 변경된 환경변수 생성
echo "🔧 개발 DB 연결 환경변수 생성 중..."
cat > .env.production << EOF
# =====================================================
# 임시: 운영서버에서 개발 DB 사용
# =====================================================

# ========================================
# 🚀 Supabase 설정 (개발 DB 연결)
# ========================================
VITE_SUPABASE_URL_PROD=$DEV_SUPABASE_URL
VITE_SUPABASE_ANON_KEY_PROD=$DEV_SUPABASE_KEY

# ========================================
# 🔧 기타 설정
# ========================================
VITE_APP_ENV=production
VITE_APP_URL=https://rich-way.co.kr

# ========================================
# 📧 이메일 설정 (운영환경)
# ========================================
VITE_EMAIL_PASSWORD_PROD=4xFETu3AbovX
EOF

echo "✅ 환경변수 변경 완료!"
echo ""
echo "🚀 이제 다음 명령으로 배포하세요:"
echo "   npm run build"
echo "   ./scripts/deploy-prod.sh"
echo ""
echo "🔙 원래대로 되돌리려면:"
echo "   ./scripts/restore-prod-db.sh"
