#!/bin/bash

# 운영서버의 전문가 데이터를 개발서버로 동기화하는 스크립트

# 환경 변수 설정
PROD_URL="https://eomxbatjlmllvyxdzxqr.supabase.co"
DEV_URL="https://fsghhujlnrwxyxjmncmq.supabase.co"
PROD_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvbXhiYXRqbG1sbHZ5eGR6eHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0ODY3NjgsImV4cCI6MjA2OTA2Mjc2OH0.ov305V5WAp0N0DXYndPmAz5YqPNOxrnOt_YF1zekwdQ"
DEV_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzZ2hodWpsbnJ3eHl4am1uY21xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMjAwNDQsImV4cCI6MjA2NTg5NjA0NH0.V_UUfHbdL-MTSAmOJO6O-fxZ9JelPLSDNUOVP84-N8o"

echo "=== 전문가 데이터 동기화 시작 ==="

# 1. 운영서버에서 전문가 데이터 가져오기
echo "운영서버에서 전문가 데이터를 가져오는 중..."
PROD_EXPERTS=$(curl -s "$PROD_URL/rest/v1/experts?select=*" \
  -H "apikey: $PROD_API_KEY" \
  -H "Authorization: Bearer $PROD_API_KEY")

if [ $? -ne 0 ]; then
    echo "❌ 운영서버에서 데이터를 가져오는데 실패했습니다."
    exit 1
fi

# 데이터 개수 확인
EXPERT_COUNT=$(echo "$PROD_EXPERTS" | jq length)
echo "✅ 운영서버에서 $EXPERT_COUNT 명의 전문가 데이터를 가져왔습니다."

# 2. 개발서버의 기존 데이터 삭제 (선택사항)
echo "개발서버의 기존 전문가 데이터를 삭제하는 중..."
curl -X DELETE "$DEV_URL/rest/v1/experts?select=*" \
  -H "apikey: $DEV_API_KEY" \
  -H "Authorization: Bearer $DEV_API_KEY" \
  -H "Prefer: return=minimal" > /dev/null 2>&1

echo "✅ 기존 데이터 삭제 완료"

# 3. 각 전문가 데이터를 개발서버에 삽입
echo "개발서버에 전문가 데이터를 삽입하는 중..."
SUCCESS_COUNT=0
FAIL_COUNT=0

for i in $(seq 0 $((EXPERT_COUNT-1))); do
    EXPERT_DATA=$(echo "$PROD_EXPERTS" | jq ".[$i]")
    
    # id 필드 제거 (새로운 UUID 생성)
    EXPERT_DATA=$(echo "$EXPERT_DATA" | jq 'del(.id)')
    
    echo "전문가 $((i+1))/$EXPERT_COUNT 삽입 중: $(echo "$EXPERT_DATA" | jq -r '.expert_name')"
    
    RESPONSE=$(curl -s -X POST "$DEV_URL/rest/v1/experts" \
      -H "apikey: $DEV_API_KEY" \
      -H "Authorization: Bearer $DEV_API_KEY" \
      -H "Content-Type: application/json" \
      -H "Prefer: return=minimal" \
      -d "$EXPERT_DATA")
    
    if [ $? -eq 0 ] && [ -z "$RESPONSE" ]; then
        echo "  ✅ 성공"
        ((SUCCESS_COUNT++))
    else
        echo "  ❌ 실패: $RESPONSE"
        ((FAIL_COUNT++))
    fi
    
    # 요청 간 간격 추가
    sleep 0.5
done

echo ""
echo "=== 동기화 완료 ==="
echo "성공: $SUCCESS_COUNT"
echo "실패: $FAIL_COUNT"
echo "총 전문가 수: $EXPERT_COUNT"

if [ $FAIL_COUNT -eq 0 ]; then
    echo "🎉 모든 전문가 데이터가 성공적으로 동기화되었습니다!"
else
    echo "⚠️  일부 데이터 동기화에 실패했습니다."
fi
