#!/bin/bash

# ========================================
# 🗄️ 운영환경 → 개발환경 DB 마이그레이션 스크립트
# ========================================

echo "🚀 운영환경 DB를 개발환경에 마이그레이션합니다..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. 환경 확인
echo -e "${BLUE}📋 1단계: 환경 확인${NC}"

if [ ! -f ".env.development" ]; then
    echo -e "${RED}❌ .env.development 파일이 없습니다.${NC}"
    echo -e "${YELLOW}💡 다음 명령어로 생성하세요:${NC}"
    echo "   cp env.development.example .env.development"
    echo "   # .env.development 파일에 개발용 Supabase 정보 입력"
    exit 1
fi

echo -e "${GREEN}✅ .env.development 파일 확인됨${NC}"

# 2. 운영환경 DB 스키마 추출 안내
echo ""
echo -e "${BLUE}📋 2단계: 운영환경 DB 스키마 추출${NC}"
echo -e "${YELLOW}💡 운영환경 Supabase Dashboard에서 다음 작업을 수행하세요:${NC}"
echo ""
echo "   1. 운영환경 Supabase 프로젝트 접속"
echo "   2. SQL Editor 열기"
echo "   3. scripts/export-production-schema.sql 파일의 내용을 복사하여 실행"
echo "   4. 각 쿼리 결과를 복사하여 저장"
echo ""

# 3. 개발환경 DB 설정 안내
echo -e "${BLUE}📋 3단계: 개발환경 DB 설정${NC}"
echo -e "${YELLOW}💡 개발환경 Supabase Dashboard에서 다음 작업을 수행하세요:${NC}"
echo ""
echo "   1. 개발환경 Supabase 프로젝트 접속"
echo "   2. SQL Editor 열기"
echo "   3. 아래 순서로 SQL 실행:"
echo ""

# SQL 파일 목록 출력
echo -e "${GREEN}📁 실행할 SQL 파일들:${NC}"
for file in sql/*.sql; do
    if [ -f "$file" ]; then
        echo "   - $file"
    fi
done

echo ""
echo -e "${YELLOW}💡 또는 운영환경에서 추출한 스키마를 직접 실행하세요.${NC}"

# 4. 샘플 데이터 삽입 안내
echo ""
echo -e "${BLUE}📋 4단계: 샘플 데이터 삽입${NC}"
echo -e "${YELLOW}💡 개발환경에 테스트용 샘플 데이터를 삽입하세요:${NC}"
echo ""
echo "   📝 샘플 데이터 파일들:"
for file in sql/insert_*.sql; do
    if [ -f "$file" ]; then
        echo "   - $file"
    fi
done

echo ""
echo -e "${YELLOW}💡 또는 다음 명령어로 샘플 데이터를 생성할 수 있습니다:${NC}"
echo "   ./scripts/generate-sample-data.sh"

# 5. 연결 테스트 안내
echo ""
echo -e "${BLUE}📋 5단계: 연결 테스트${NC}"
echo -e "${YELLOW}💡 개발 서버를 실행하여 연결을 확인하세요:${NC}"
echo ""
echo "   npm run dev"
echo ""
echo "   콘솔에서 다음 메시지를 확인하세요:"
echo "   🔧 Supabase 환경 설정:"
echo "      환경: 🟡 개발"
echo "      설정: ✅ development"

# 6. 데이터 동기화 옵션
echo ""
echo -e "${BLUE}📋 6단계: 데이터 동기화 (선택사항)${NC}"
echo -e "${YELLOW}💡 운영환경의 실제 데이터를 개발환경에 복사하려면:${NC}"
echo ""
echo "   1. 운영환경에서 데이터 내보내기:"
echo "      - Table Editor에서 각 테이블 선택"
echo "      - Export 기능으로 CSV 다운로드"
echo ""
echo "   2. 개발환경에 데이터 가져오기:"
echo "      - Table Editor에서 Import 기능 사용"
echo "      - CSV 파일 업로드"
echo ""
echo -e "${RED}⚠️  주의: 실제 사용자 데이터는 개발환경에 복사하지 마세요!${NC}"

echo ""
echo -e "${GREEN}✅ 마이그레이션 가이드가 완료되었습니다!${NC}"
echo ""
echo -e "${BLUE}🔗 다음 단계:${NC}"
echo "   1. 운영환경에서 스키마 추출"
echo "   2. 개발환경에 스키마 적용"
echo "   3. 샘플 데이터 삽입"
echo "   4. 연결 테스트"
echo "   5. 기능 테스트" 