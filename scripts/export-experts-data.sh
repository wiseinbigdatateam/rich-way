#!/bin/bash

# 운영서버의 전문가 데이터를 JSON 파일로 내보내는 스크립트

# 환경 변수 설정
PROD_URL="https://eomxbatjlmllvyxdzxqr.supabase.co"
PROD_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvbXhiYXRqbG1sbHZ5eGR6eHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0ODY3NjgsImV4cCI6MjA2OTA2Mjc2OH0.ov305V5WAp0N0DXYndPmAz5YqPNOxrnOt_YF1zekwdQ"

echo "=== 전문가 데이터 내보내기 시작 ==="

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

# 2. JSON 파일로 저장
OUTPUT_FILE="experts_data_$(date +%Y%m%d_%H%M%S).json"
echo "$PROD_EXPERTS" > "$OUTPUT_FILE"

echo "✅ 전문가 데이터가 $OUTPUT_FILE 파일로 저장되었습니다."

# 3. 각 전문가 정보 출력
echo ""
echo "=== 전문가 목록 ==="
for i in $(seq 0 $((EXPERT_COUNT-1))); do
    EXPERT_NAME=$(echo "$PROD_EXPERTS" | jq -r ".[$i].expert_name")
    EXPERT_ID=$(echo "$PROD_EXPERTS" | jq -r ".[$i].user_id")
    echo "$((i+1)). $EXPERT_NAME (ID: $EXPERT_ID)"
done

echo ""
echo "=== 내보내기 완료 ==="
echo "파일: $OUTPUT_FILE"
echo "전문가 수: $EXPERT_COUNT"
echo ""
echo "이제 이 JSON 파일을 개발서버에 수동으로 삽입할 수 있습니다."
