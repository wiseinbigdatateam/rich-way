#!/bin/bash

# ========================================
# 🛠️ 개발용 데이터베이스 설정 스크립트
# ========================================

echo "🚀 개발용 Supabase 데이터베이스 설정을 시작합니다..."

# 1. 개발용 Supabase 프로젝트 생성 안내
echo ""
echo "📋 1단계: 개발용 Supabase 프로젝트 생성"
echo "   - https://supabase.com 에서 새 프로젝트 생성"
echo "   - 프로젝트명: rich-way-dev"
echo "   - Settings > API에서 URL과 anon key 복사"
echo ""

# 2. 환경변수 파일 생성
echo "📋 2단계: 개발 환경변수 파일 생성"
if [ ! -f ".env.development" ]; then
    cp env.development.example .env.development
    echo "   ✅ .env.development 파일이 생성되었습니다."
    echo "   📝 .env.development 파일을 편집하여 실제 개발용 Supabase 정보를 입력하세요."
else
    echo "   ⚠️ .env.development 파일이 이미 존재합니다."
fi

# 3. 데이터베이스 스키마 마이그레이션 안내
echo ""
echo "📋 3단계: 데이터베이스 스키마 마이그레이션"
echo "   개발용 Supabase 프로젝트에서 다음 SQL을 실행하세요:"
echo ""

# SQL 파일 목록 출력
echo "   📁 실행할 SQL 파일들:"
for file in sql/*.sql; do
    if [ -f "$file" ]; then
        echo "   - $file"
    fi
done

echo ""
echo "   💡 Supabase Dashboard > SQL Editor에서 각 파일을 순서대로 실행하세요."
echo ""

# 4. 샘플 데이터 삽입 안내
echo "📋 4단계: 샘플 데이터 삽입"
echo "   개발용 데이터베이스에 테스트용 샘플 데이터를 삽입하세요."
echo "   - members 테이블에 테스트 사용자 추가"
echo "   - 진단 테이블에 샘플 진단 결과 추가"
echo ""

# 5. 설정 완료 확인
echo "📋 5단계: 설정 완료 확인"
echo "   개발 서버를 실행하여 연결을 확인하세요:"
echo "   npm run dev"
echo ""
echo "   콘솔에서 다음 메시지를 확인하세요:"
echo "   🔧 Supabase 환경 설정:"
echo "      환경: 🟡 개발"
echo "      설정: ✅ development"
echo ""

echo "✅ 개발용 데이터베이스 설정 가이드가 완료되었습니다!"
echo ""
echo "🔗 다음 단계:"
echo "   1. 개발용 Supabase 프로젝트 생성"
echo "   2. .env.development 파일에 실제 정보 입력"
echo "   3. 데이터베이스 스키마 마이그레이션"
echo "   4. 샘플 데이터 삽입"
echo "   5. 개발 서버 실행 및 테스트" 