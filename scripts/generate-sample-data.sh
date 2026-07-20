#!/bin/bash

# ========================================
# 📊 개발환경용 샘플 데이터 생성 스크립트
# ========================================

echo "📊 개발환경용 샘플 데이터를 생성합니다..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. 샘플 데이터 SQL 파일 생성
echo -e "${BLUE}📋 1단계: 샘플 데이터 SQL 파일 생성${NC}"

cat > sql/dev_sample_data.sql << 'EOF'
-- ========================================
-- 📊 개발환경용 샘플 데이터
-- ========================================

-- 테스트용 회원 데이터
INSERT INTO members (user_id, email, nickname, signup_type, created_at) VALUES
('dev_user_001', 'test1@example.com', '테스트사용자1', 'email', NOW()),
('dev_user_002', 'test2@example.com', '테스트사용자2', 'email', NOW()),
('dev_user_003', 'test3@example.com', '테스트사용자3', 'email', NOW()),
('dev_expert_001', 'expert1@example.com', '전문가1', 'expert', NOW()),
('dev_expert_002', 'expert2@example.com', '전문가2', 'expert', NOW()),
('dev_admin_001', 'admin@example.com', '관리자', 'admin', NOW())
ON CONFLICT (user_id) DO NOTHING;

-- MBTI 진단 샘플 데이터
INSERT INTO mbti_diagnosis (user_id, responses, result_type, report_content, created_at) VALUES
('dev_user_001', 
 '{"q1": 4, "q2": 3, "q3": 5, "q4": 2, "q5": 4, "q6": 3, "q7": 5, "q8": 2, "q9": 4, "q10": 3, "q11": 5, "q12": 2, "q13": 4, "q14": 3, "q15": 5, "q16": 2, "q17": 4, "q18": 3, "q19": 5, "q20": 2, "q21": 4, "q22": 3, "q23": 5, "q24": 2, "q25": 4, "q26": 3, "q27": 5, "q28": 2, "q29": 4, "q30": 3}',
 'ENTJ',
 '{"dimensionScores": {"ei": {"e": 65, "i": 35}, "sn": {"s": 40, "n": 60}, "tf": {"t": 70, "f": 30}, "jp": {"j": 75, "p": 25}}, "factors": {"psychological": 68, "behavioral": 72, "financial": 65, "environmental": 70}}',
 NOW() - INTERVAL '7 days'),
('dev_user_002',
 '{"q1": 2, "q2": 5, "q3": 1, "q4": 4, "q5": 2, "q6": 5, "q7": 1, "q8": 4, "q9": 2, "q10": 5, "q11": 1, "q12": 4, "q13": 2, "q14": 5, "q15": 1, "q16": 4, "q17": 2, "q18": 5, "q19": 1, "q20": 4, "q21": 2, "q22": 5, "q23": 1, "q24": 4, "q25": 2, "q26": 5, "q27": 1, "q28": 4, "q29": 2, "q30": 5}',
 'ISFP',
 '{"dimensionScores": {"ei": {"e": 30, "i": 70}, "sn": {"s": 75, "n": 25}, "tf": {"t": 25, "f": 75}, "jp": {"j": 20, "p": 80}}, "factors": {"psychological": 45, "behavioral": 38, "financial": 52, "environmental": 42}}',
 NOW() - INTERVAL '3 days'),
('dev_user_003',
 '{"q1": 3, "q2": 4, "q3": 3, "q4": 4, "q5": 3, "q6": 4, "q7": 3, "q8": 4, "q9": 3, "q10": 4, "q11": 3, "q12": 4, "q13": 3, "q14": 4, "q15": 3, "q16": 4, "q17": 3, "q18": 4, "q19": 3, "q20": 4, "q21": 3, "q22": 4, "q23": 3, "q24": 4, "q25": 3, "q26": 4, "q27": 3, "q28": 4, "q29": 3, "q30": 4}',
 'ENFP',
 '{"dimensionScores": {"ei": {"e": 60, "i": 40}, "sn": {"s": 35, "n": 65}, "tf": {"t": 30, "f": 70}, "jp": {"j": 25, "p": 75}}, "factors": {"psychological": 58, "behavioral": 62, "financial": 55, "environmental": 60}}',
 NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- 재무 진단 샘플 데이터
INSERT INTO finance_diagnosis (user_id, responses, report_content, created_at) VALUES
('dev_user_001',
 '{"monthlyIncome": 5000000, "spouseIncome": 3000000, "otherIncome": 500000, "incomeType": "salary", "incomeVariability": "low", "housingCost": 1500000, "foodCost": 800000, "educationCost": 500000, "transportationCost": 300000, "leisureCost": 400000, "medicalCost": 200000, "insuranceCost": 300000, "otherExpense": 200000, "monthlySavings": 1000000, "savings": 50000000, "targetAmount": 10}',
 '{"totalAssets": 50000000, "monthlyIncome": 8500000, "monthlyExpense": 4300000, "savingsRate": 49.4, "analysis": "안정적인 재무 상태입니다. 저축률이 높고 체계적인 재무 관리가 이루어지고 있습니다."}',
 NOW() - INTERVAL '5 days'),
('dev_user_002',
 '{"monthlyIncome": 3500000, "spouseIncome": 0, "otherIncome": 200000, "incomeType": "salary", "incomeVariability": "medium", "housingCost": 1200000, "foodCost": 600000, "educationCost": 300000, "transportationCost": 250000, "leisureCost": 300000, "medicalCost": 150000, "insuranceCost": 200000, "otherExpense": 150000, "monthlySavings": 300000, "savings": 15000000, "targetAmount": 5}',
 '{"totalAssets": 15000000, "monthlyIncome": 3700000, "monthlyExpense": 3150000, "savingsRate": 14.9, "analysis": "기본적인 재무 상태이지만 저축률을 높일 필요가 있습니다. 지출 관리 개선이 필요합니다."}',
 NOW() - INTERVAL '2 days'),
('dev_user_003',
 '{"monthlyIncome": 7000000, "spouseIncome": 4000000, "otherIncome": 1000000, "incomeType": "business", "incomeVariability": "high", "housingCost": 2000000, "foodCost": 1000000, "educationCost": 800000, "transportationCost": 500000, "leisureCost": 600000, "medicalCost": 300000, "insuranceCost": 400000, "otherExpense": 300000, "monthlySavings": 2000000, "savings": 100000000, "targetAmount": 20}',
 '{"totalAssets": 100000000, "monthlyIncome": 12000000, "monthlyExpense": 6300000, "savingsRate": 47.5, "analysis": "우수한 재무 상태입니다. 높은 수입과 적절한 지출 관리로 안정적인 자산 축적이 이루어지고 있습니다."}',
 NOW())
ON CONFLICT (id) DO NOTHING;

-- 전문가 상품 샘플 데이터
INSERT INTO expert_products (expert_id, title, description, price, category, status, created_at) VALUES
('dev_expert_001', '재무설계 기초 코칭', '개인 재무설계의 기초를 다지는 1:1 코칭 프로그램', 500000, 'coaching', 'active', NOW()),
('dev_expert_001', '투자 포트폴리오 분석', '현재 투자 포트폴리오 분석 및 개선 방안 제시', 300000, 'consulting', 'active', NOW()),
('dev_expert_002', '부동산 투자 가이드', '부동산 투자 입문자를 위한 맞춤형 가이드', 800000, 'education', 'active', NOW()),
('dev_expert_002', '세무 상담 서비스', '개인 세무 최적화를 위한 전문 상담', 400000, 'consulting', 'active', NOW())
ON CONFLICT (id) DO NOTHING;

-- 코칭 신청 샘플 데이터
INSERT INTO coaching_applications (member_id, expert_id, product_id, application_content, status, created_at) VALUES
('dev_user_001', 'dev_expert_001', (SELECT id FROM expert_products WHERE title = '재무설계 기초 코칭' LIMIT 1), '재무설계에 관심이 많아서 기초부터 배우고 싶습니다.', 'pending', NOW() - INTERVAL '3 days'),
('dev_user_002', 'dev_expert_002', (SELECT id FROM expert_products WHERE title = '부동산 투자 가이드' LIMIT 1), '부동산 투자를 시작하려고 하는데 체계적으로 배우고 싶습니다.', 'approved', NOW() - INTERVAL '1 day'),
('dev_user_003', 'dev_expert_001', (SELECT id FROM expert_products WHERE title = '투자 포트폴리오 분석' LIMIT 1), '현재 투자 포트폴리오를 분석받고 싶습니다.', 'completed', NOW() - INTERVAL '7 days')
ON CONFLICT (id) DO NOTHING;

-- 커뮤니티 게시글 샘플 데이터
INSERT INTO community_posts (member_id, title, content, category, created_at) VALUES
('dev_user_001', '재무설계 시작하기', '재무설계를 시작하려고 하는데 어떤 것부터 해야 할까요?', 'finance', NOW() - INTERVAL '5 days'),
('dev_user_002', '투자 경험 공유', '최근 주식 투자를 시작했는데 경험을 공유해드릴게요.', 'investment', NOW() - INTERVAL '3 days'),
('dev_user_003', '저축 방법 추천', '효과적인 저축 방법을 추천해주세요.', 'savings', NOW() - INTERVAL '1 day'),
('dev_expert_001', '재무설계 전문가 조언', '재무설계에 대한 전문가 조언을 드립니다.', 'expert_advice', NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- 커뮤니티 댓글 샘플 데이터
INSERT INTO community_comments (post_id, member_id, content, created_at) VALUES
((SELECT id FROM community_posts WHERE title = '재무설계 시작하기' LIMIT 1), 'dev_user_002', '저도 같은 고민이었는데, 먼저 수입과 지출을 파악하는 것부터 시작하세요.', NOW() - INTERVAL '4 days'),
((SELECT id FROM community_posts WHERE title = '재무설계 시작하기' LIMIT 1), 'dev_expert_001', '체계적인 재무설계를 위해서는 전문가와 상담하는 것을 추천드립니다.', NOW() - INTERVAL '3 days'),
((SELECT id FROM community_posts WHERE title = '투자 경험 공유' LIMIT 1), 'dev_user_001', '좋은 경험 공유 감사합니다. 저도 참고하겠습니다.', NOW() - INTERVAL '2 days'),
((SELECT id FROM community_posts WHERE title = '저축 방법 추천' LIMIT 1), 'dev_user_002', '자동이체로 매월 일정 금액을 저축하는 것이 효과적입니다.', NOW())
ON CONFLICT (id) DO NOTHING;

-- 확인 메시지
SELECT '개발환경용 샘플 데이터가 성공적으로 생성되었습니다.' as message;
EOF

echo -e "${GREEN}✅ sql/dev_sample_data.sql 파일이 생성되었습니다.${NC}"

# 2. 실행 안내
echo ""
echo -e "${BLUE}📋 2단계: 샘플 데이터 적용${NC}"
echo -e "${YELLOW}💡 개발환경 Supabase Dashboard에서 다음 작업을 수행하세요:${NC}"
echo ""
echo "   1. 개발환경 Supabase 프로젝트 접속"
echo "   2. SQL Editor 열기"
echo "   3. sql/dev_sample_data.sql 파일의 내용을 복사하여 실행"
echo ""

# 3. 테스트 계정 정보
echo -e "${BLUE}📋 3단계: 테스트 계정 정보${NC}"
echo -e "${GREEN}✅ 생성된 테스트 계정들:${NC}"
echo ""
echo "   👤 일반 사용자:"
echo "      - test1@example.com (테스트사용자1)"
echo "      - test2@example.com (테스트사용자2)"
echo "      - test3@example.com (테스트사용자3)"
echo ""
echo "   👨‍💼 전문가:"
echo "      - expert1@example.com (전문가1)"
echo "      - expert2@example.com (전문가2)"
echo ""
echo "   👨‍💻 관리자:"
echo "      - admin@example.com (관리자)"
echo ""

# 4. 기능 테스트 안내
echo -e "${BLUE}📋 4단계: 기능 테스트${NC}"
echo -e "${YELLOW}💡 다음 기능들을 테스트해보세요:${NC}"
echo ""
echo "   🔍 진단 기능:"
echo "      - MBTI 진단 (3개 샘플 결과)"
echo "      - 재무 진단 (3개 샘플 결과)"
echo ""
echo "   👤 마이페이지:"
echo "      - 진단 이력 확인"
echo "      - 재무 요약 확인"
echo ""
echo "   💼 전문가 시스템:"
echo "      - 전문가 상품 조회"
echo "      - 코칭 신청 (3개 샘플)"
echo ""
echo "   💬 커뮤니티:"
echo "      - 게시글 조회 (4개 샘플)"
echo "      - 댓글 확인 (4개 샘플)"
echo ""

echo -e "${GREEN}✅ 샘플 데이터 생성 가이드가 완료되었습니다!${NC}" 