#!/bin/bash

# =====================================================
# 운영서버 환경변수를 원래 운영 DB로 복원
# =====================================================

set -e

echo "🔙 운영서버 환경변수를 원래 운영 DB로 복원합니다..."

# 백업 파일 확인
if [ ! -f ".env.production.original" ]; then
    echo "❌ 백업 파일을 찾을 수 없습니다: .env.production.original"
    echo "💡 수동으로 복원하려면 다음 내용을 .env.production에 저장하세요:"
    echo ""
    cat env.production.backup
    exit 1
fi

# 원래 환경변수 복원
echo "📦 원래 환경변수 복원 중..."
cp .env.production.original .env.production

echo "✅ 환경변수 복원 완료!"
echo ""
echo "🚀 이제 다음 명령으로 배포하세요:"
echo "   npm run build"
echo "   ./scripts/deploy-prod.sh"
echo ""
echo "🗑️  백업 파일 삭제하려면:"
echo "   rm .env.production.original"
