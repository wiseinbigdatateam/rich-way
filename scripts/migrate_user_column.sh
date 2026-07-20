#!/bin/bash

# members 테이블의 user_id를 user로 변경하는 마이그레이션 스크립트

echo "🔄 members 테이블 컬럼명 변경 마이그레이션 시작..."

# 1. SQL 파일 실행
echo "📝 1단계: 컬럼명 변경 SQL 실행"
psql $DATABASE_URL -f sql/rename_user_id_to_user.sql

if [ $? -eq 0 ]; then
    echo "✅ 컬럼명 변경 완료"
else
    echo "❌ 컬럼명 변경 실패"
    exit 1
fi

# 2. 더미 데이터 업데이트
echo "📝 2단계: 더미 데이터 업데이트"
psql $DATABASE_URL -f sql/update_dummy_data_for_user_column.sql

if [ $? -eq 0 ]; then
    echo "✅ 더미 데이터 업데이트 완료"
else
    echo "❌ 더미 데이터 업데이트 실패"
    exit 1
fi

echo "🎉 마이그레이션 완료!"
echo "📋 변경 사항:"
echo "   - members.user_id → members.user"
echo "   - coaching_applications.member_user_id → coaching_applications.member_user"
echo "   - mbti_diagnosis.user_id → mbti_diagnosis.user"
echo "   - finance_diagnosis.user_id → finance_diagnosis.user" 