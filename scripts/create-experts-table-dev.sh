#!/bin/bash

# 개발서버에 experts 테이블을 생성하는 스크립트

# 환경 변수 설정
DEV_URL="https://fsghhujlnrwxyxjmncmq.supabase.co"
DEV_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzZ2hodWpsbnJ3eHl4am1uY21xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMjAwNDQsImV4cCI6MjA2NTg5NjA0NH0.V_UUfHbdL-MTSAmOJO6O-fxZ9JelPLSDNUOVP84-N8o"

echo "=== 개발서버에 experts 테이블 생성 시작 ==="

# 1. experts 테이블 생성
echo "experts 테이블을 생성하는 중..."

# 테이블 생성 SQL을 여러 단계로 나누어 실행
# 1단계: 기본 테이블 구조
echo "1단계: 기본 테이블 구조 생성..."
curl -X POST "$DEV_URL/rest/v1/rpc/exec_sql" \
  -H "apikey: $DEV_API_KEY" \
  -H "Authorization: Bearer $DEV_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "CREATE TABLE IF NOT EXISTS experts (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id TEXT UNIQUE NOT NULL, password TEXT NOT NULL, profile_image_url TEXT, expert_name TEXT NOT NULL, company_name TEXT, email TEXT, main_field TEXT, company_phone TEXT, personal_phone TEXT, tags TEXT[], core_intro TEXT, youtube_channel_url TEXT, intro_video_url TEXT, press_url TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());"
  }'

echo ""
echo "2단계: 인덱스 생성..."
curl -X POST "$DEV_URL/rest/v1/rpc/exec_sql" \
  -H "apikey: $DEV_API_KEY" \
  -H "Authorization: Bearer $DEV_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "CREATE INDEX IF NOT EXISTS idx_experts_user_id ON experts(user_id); CREATE INDEX IF NOT EXISTS idx_experts_expert_name ON experts(expert_name); CREATE INDEX IF NOT EXISTS idx_experts_main_field ON experts(main_field);"
  }'

echo ""
echo "3단계: RLS 비활성화..."
curl -X POST "$DEV_URL/rest/v1/rpc/exec_sql" \
  -H "apikey: $DEV_API_KEY" \
  -H "Authorization: Bearer $DEV_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "ALTER TABLE experts DISABLE ROW LEVEL SECURITY;"
  }'

echo ""
echo "4단계: 업데이트 트리거 함수 생성..."
curl -X POST "$DEV_URL/rest/v1/rpc/exec_sql" \
  -H "apikey: $DEV_API_KEY" \
  -H "Authorization: Bearer $DEV_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ language \"plpgsql\";"
  }'

echo ""
echo "5단계: 업데이트 트리거 생성..."
curl -X POST "$DEV_URL/rest/v1/rpc/exec_sql" \
  -H "apikey: $DEV_API_KEY" \
  -H "Authorization: Bearer $DEV_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "CREATE TRIGGER update_experts_updated_at BEFORE UPDATE ON experts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();"
  }'

echo ""
echo "=== 테이블 생성 완료 ==="
echo "이제 experts 테이블이 생성되었습니다."
echo "다음 단계로 전문가 데이터 동기화를 진행할 수 있습니다."
