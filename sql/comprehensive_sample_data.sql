-- ========================================
-- 📊 포괄적인 샘플 데이터 (모든 테이블)
-- ========================================

-- 1. 회원 데이터 (members)
INSERT INTO members (user_id, email, nickname, signup_type, created_at) VALUES
('dev_user_001', 'test1@example.com', '테스트사용자1', 'email', NOW() - INTERVAL '30 days'),
('dev_user_002', 'test2@example.com', '테스트사용자2', 'email', NOW() - INTERVAL '25 days'),
('dev_user_003', 'test3@example.com', '테스트사용자3', 'email', NOW() - INTERVAL '20 days'),
('dev_user_004', 'test4@example.com', '테스트사용자4', 'email', NOW() - INTERVAL '15 days'),
('dev_user_005', 'test5@example.com', '테스트사용자5', 'email', NOW() - INTERVAL '10 days'),
('dev_expert_001', 'expert1@example.com', '김재무전문가', 'expert', NOW() - INTERVAL '60 days'),
('dev_expert_002', 'expert2@example.com', '이투자전문가', 'expert', NOW() - INTERVAL '55 days'),
('dev_expert_003', 'expert3@example.com', '박부동산전문가', 'expert', NOW() - INTERVAL '50 days'),
('dev_admin_001', 'admin@example.com', '시스템관리자', 'admin', NOW() - INTERVAL '90 days')
ON CONFLICT (user_id) DO NOTHING;

-- 2. 전문가 상세 정보 (experts)
INSERT INTO experts (user_id, name, profile_image, introduction, expertise_areas, experience_years, certifications, contact_info, hourly_rate, status, created_at) VALUES
('dev_expert_001', '김재무전문가', 'https://example.com/expert1.jpg', '20년간 재무설계 분야에서 활동한 전문가입니다. 개인과 기업의 재무 최적화를 도와드립니다.', '["재무설계", "투자상담", "세무최적화"]', 20, '["CFP", "AFP", "세무사"]', '{"phone": "010-1234-5678", "email": "expert1@example.com"}', 100000, 'active', NOW()),
('dev_expert_002', '이투자전문가', 'https://example.com/expert2.jpg', '주식, 채권, 펀드 등 다양한 투자 분야에서 15년간 경험을 쌓은 전문가입니다.', '["주식투자", "펀드투자", "포트폴리오관리"]', 15, '["투자상담사", "펀드투자상담사"]', '{"phone": "010-2345-6789", "email": "expert2@example.com"}', 80000, 'active', NOW()),
('dev_expert_003', '박부동산전문가', 'https://example.com/expert3.jpg', '부동산 투자와 개발 분야에서 12년간 활동하며 다양한 프로젝트를 성공적으로 진행했습니다.', '["부동산투자", "부동산개발", "임대차관리"]', 12, '["부동산중개사", "부동산투자상담사"]', '{"phone": "010-3456-7890", "email": "expert3@example.com"}', 120000, 'active', NOW())
ON CONFLICT (user_id) DO NOTHING;

-- 3. 전문가 상품 (expert_products)
INSERT INTO expert_products (expert_id, title, description, price, category, status, created_at) VALUES
('dev_expert_001', '재무설계 기초 코칭', '개인 재무설계의 기초를 다지는 1:1 코칭 프로그램 (4회)', 500000, 'coaching', 'active', NOW() - INTERVAL '45 days'),
('dev_expert_001', '투자 포트폴리오 분석', '현재 투자 포트폴리오 분석 및 개선 방안 제시 (2회)', 300000, 'consulting', 'active', NOW() - INTERVAL '40 days'),
('dev_expert_001', '세무 최적화 상담', '개인 세무 최적화를 위한 전문 상담 (3회)', 400000, 'consulting', 'active', NOW() - INTERVAL '35 days'),
('dev_expert_002', '주식 투자 입문 가이드', '주식 투자 입문자를 위한 맞춤형 가이드 (5회)', 600000, 'education', 'active', NOW() - INTERVAL '50 days'),
('dev_expert_002', '펀드 투자 상담', '펀드 투자 전략 수립 및 포트폴리오 구성 (2회)', 350000, 'consulting', 'active', NOW() - INTERVAL '45 days'),
('dev_expert_003', '부동산 투자 가이드', '부동산 투자 입문자를 위한 맞춤형 가이드 (6회)', 800000, 'education', 'active', NOW() - INTERVAL '55 days'),
('dev_expert_003', '부동산 개발 프로젝트 상담', '부동산 개발 프로젝트 기획 및 실행 전략 (4회)', 1000000, 'consulting', 'active', NOW() - INTERVAL '50 days')
ON CONFLICT (id) DO NOTHING;

-- 4. 코칭 신청 (coaching_applications)
INSERT INTO coaching_applications (expert_user_id, member_user_id, title, content, method, name, contact, email, attachment_url, product_name, product_price, applied_at, status, created_at) VALUES
('dev_expert_001', 'dev_user_001', '재무설계 기초 코칭 신청', '재무설계에 관심이 많아서 기초부터 체계적으로 배우고 싶습니다. 현재 수입과 지출을 파악하고 있는데, 더 체계적인 방법을 알고 싶습니다.', '화상', '김테스트', '010-1111-2222', 'test1@example.com', NULL, '재무설계 기초 코칭', 500000, NOW() - INTERVAL '10 days', '접수', NOW() - INTERVAL '10 days'),
('dev_expert_002', 'dev_user_002', '주식 투자 입문 가이드 신청', '주식 투자를 시작하려고 하는데 체계적으로 배우고 싶습니다. 기초부터 차근차근 설명해주시면 감사하겠습니다.', '전화', '이테스트', '010-2222-3333', 'test2@example.com', NULL, '주식 투자 입문 가이드', 600000, NOW() - INTERVAL '8 days', '진행중', NOW() - INTERVAL '8 days'),
('dev_expert_003', 'dev_user_003', '부동산 투자 가이드 신청', '부동산 투자를 시작하려고 하는데 어떤 지역과 매물을 선택해야 할지 모르겠습니다. 전문가의 조언을 받고 싶습니다.', '방문', '박테스트', '010-3333-4444', 'test3@example.com', NULL, '부동산 투자 가이드', 800000, NOW() - INTERVAL '5 days', '진행완료', NOW() - INTERVAL '5 days'),
('dev_expert_001', 'dev_user_004', '투자 포트폴리오 분석 신청', '현재 주식과 펀드에 투자하고 있는데, 포트폴리오를 분석받고 개선 방안을 제시받고 싶습니다.', '화상', '최테스트', '010-4444-5555', 'test4@example.com', NULL, '투자 포트폴리오 분석', 300000, NOW() - INTERVAL '3 days', '접수', NOW() - INTERVAL '3 days'),
('dev_expert_002', 'dev_user_005', '펀드 투자 상담 신청', '펀드 투자에 관심이 있는데 어떤 펀드를 선택해야 할지 모르겠습니다. 전문가의 상담을 받고 싶습니다.', '전화', '정테스트', '010-5555-6666', 'test5@example.com', NULL, '펀드 투자 상담', 350000, NOW() - INTERVAL '1 day', '접수', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- 5. 코칭 히스토리 (coaching_history)
INSERT INTO coaching_history (application_id, title, content, status, created_at) VALUES
((SELECT id FROM coaching_applications WHERE title = '재무설계 기초 코칭 신청' LIMIT 1), '1차 코칭 - 재무 현황 파악', '고객의 현재 재무 현황을 파악하고 목표 설정을 도왔습니다. 월 수입 500만원, 지출 300만원, 저축 200만원으로 안정적인 재무 상태입니다.', '진행중', NOW() - INTERVAL '8 days'),
((SELECT id FROM coaching_applications WHERE title = '주식 투자 입문 가이드 신청' LIMIT 1), '1차 코칭 - 투자 기초 교육', '주식 투자의 기초 개념과 용어를 설명했습니다. 고객이 이해하기 쉽도록 실제 사례를 들어 설명했습니다.', '진행중', NOW() - INTERVAL '6 days'),
((SELECT id FROM coaching_applications WHERE title = '주식 투자 입문 가이드 신청' LIMIT 1), '2차 코칭 - 투자 전략 수립', '고객의 투자 성향을 파악하고 적합한 투자 전략을 수립했습니다. 보수적 투자 성향으로 안정적인 배당주 중심 포트폴리오를 제안했습니다.', '진행중', NOW() - INTERVAL '4 days'),
((SELECT id FROM coaching_applications WHERE title = '부동산 투자 가이드 신청' LIMIT 1), '1차 코칭 - 부동산 시장 분석', '현재 부동산 시장 동향과 투자 가능 지역을 분석했습니다. 서울 강남구와 송파구를 중심으로 분석했습니다.', '진행완료', NOW() - INTERVAL '3 days'),
((SELECT id FROM coaching_applications WHERE title = '부동산 투자 가이드 신청' LIMIT 1), '2차 코칭 - 매물 선정 기준', '투자용 매물 선정 기준과 체크리스트를 제공했습니다. 수익률, 위치, 건물 상태 등을 종합적으로 고려한 기준을 제시했습니다.', '진행완료', NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- 6. MBTI 진단 (mbti_diagnosis)
INSERT INTO mbti_diagnosis (user_id, responses, result_type, report_content, created_at) VALUES
('dev_user_001', 
 '{"q1": 4, "q2": 3, "q3": 5, "q4": 2, "q5": 4, "q6": 3, "q7": 5, "q8": 2, "q9": 4, "q10": 3, "q11": 5, "q12": 2, "q13": 4, "q14": 3, "q15": 5, "q16": 2, "q17": 4, "q18": 3, "q19": 5, "q20": 2, "q21": 4, "q22": 3, "q23": 5, "q24": 2, "q25": 4, "q26": 3, "q27": 5, "q28": 2, "q29": 4, "q30": 3}',
 'ENTJ',
 '{"dimensionScores": {"ei": {"e": 65, "i": 35}, "sn": {"s": 40, "n": 60}, "tf": {"t": 70, "f": 30}, "jp": {"j": 75, "p": 25}}, "factors": {"psychological": 68, "behavioral": 72, "financial": 65, "environmental": 70}}',
 NOW() - INTERVAL '15 days'),
('dev_user_002',
 '{"q1": 2, "q2": 5, "q3": 1, "q4": 4, "q5": 2, "q6": 5, "q7": 1, "q8": 4, "q9": 2, "q10": 5, "q11": 1, "q12": 4, "q13": 2, "q14": 5, "q15": 1, "q16": 4, "q17": 2, "q18": 5, "q19": 1, "q20": 4, "q21": 2, "q22": 5, "q23": 1, "q24": 4, "q25": 2, "q26": 5, "q27": 1, "q28": 4, "q29": 2, "q30": 5}',
 'ISFP',
 '{"dimensionScores": {"ei": {"e": 30, "i": 70}, "sn": {"s": 75, "n": 25}, "tf": {"t": 25, "f": 75}, "jp": {"j": 20, "p": 80}}, "factors": {"psychological": 45, "behavioral": 38, "financial": 52, "environmental": 42}}',
 NOW() - INTERVAL '12 days'),
('dev_user_003',
 '{"q1": 3, "q2": 4, "q3": 3, "q4": 4, "q5": 3, "q6": 4, "q7": 3, "q8": 4, "q9": 3, "q10": 4, "q11": 3, "q12": 4, "q13": 3, "q14": 4, "q15": 3, "q16": 4, "q17": 3, "q18": 4, "q19": 3, "q20": 4, "q21": 3, "q22": 4, "q23": 3, "q24": 4, "q25": 3, "q26": 4, "q27": 3, "q28": 4, "q29": 3, "q30": 4}',
 'ENFP',
 '{"dimensionScores": {"ei": {"e": 60, "i": 40}, "sn": {"s": 35, "n": 65}, "tf": {"t": 30, "f": 70}, "jp": {"j": 25, "p": 75}}, "factors": {"psychological": 58, "behavioral": 62, "financial": 55, "environmental": 60}}',
 NOW() - INTERVAL '8 days'),
('dev_user_004',
 '{"q1": 5, "q2": 2, "q3": 4, "q4": 1, "q5": 5, "q6": 2, "q7": 4, "q8": 1, "q9": 5, "q10": 2, "q11": 4, "q12": 1, "q13": 5, "q14": 2, "q15": 4, "q16": 1, "q17": 5, "q18": 2, "q19": 4, "q20": 1, "q21": 5, "q22": 2, "q23": 4, "q24": 1, "q25": 5, "q26": 2, "q27": 4, "q28": 1, "q29": 5, "q30": 2}',
 'ISTJ',
 '{"dimensionScores": {"ei": {"e": 25, "i": 75}, "sn": {"s": 80, "n": 20}, "tf": {"t": 85, "f": 15}, "jp": {"j": 90, "p": 10}}, "factors": {"psychological": 35, "behavioral": 42, "financial": 78, "environmental": 45}}',
 NOW() - INTERVAL '5 days'),
('dev_user_005',
 '{"q1": 1, "q2": 5, "q3": 2, "q4": 5, "q5": 1, "q6": 5, "q7": 2, "q8": 5, "q9": 1, "q10": 5, "q11": 2, "q12": 5, "q13": 1, "q14": 5, "q15": 2, "q16": 5, "q17": 1, "q18": 5, "q19": 2, "q20": 5, "q21": 1, "q22": 5, "q23": 2, "q24": 5, "q25": 1, "q26": 5, "q27": 2, "q28": 5, "q29": 1, "q30": 5}',
 'ESFJ',
 '{"dimensionScores": {"ei": {"e": 75, "i": 25}, "sn": {"s": 60, "n": 40}, "tf": {"t": 20, "f": 80}, "jp": {"j": 65, "p": 35}}, "factors": {"psychological": 72, "behavioral": 68, "financial": 48, "environmental": 55}}',
 NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- 7. 재무 진단 (finance_diagnosis)
INSERT INTO finance_diagnosis (user_id, responses, report_content, created_at) VALUES
('dev_user_001',
 '{"monthlyIncome": 5000000, "spouseIncome": 3000000, "otherIncome": 500000, "incomeType": "salary", "incomeVariability": "low", "housingCost": 1500000, "foodCost": 800000, "educationCost": 500000, "transportationCost": 300000, "leisureCost": 400000, "medicalCost": 200000, "insuranceCost": 300000, "otherExpense": 200000, "monthlySavings": 1000000, "savings": 50000000, "targetAmount": 10}',
 '{"totalAssets": 50000000, "monthlyIncome": 8500000, "monthlyExpense": 4300000, "savingsRate": 49.4, "analysis": "안정적인 재무 상태입니다. 저축률이 높고 체계적인 재무 관리가 이루어지고 있습니다."}',
 NOW() - INTERVAL '12 days'),
('dev_user_002',
 '{"monthlyIncome": 3500000, "spouseIncome": 0, "otherIncome": 200000, "incomeType": "salary", "incomeVariability": "medium", "housingCost": 1200000, "foodCost": 600000, "educationCost": 300000, "transportationCost": 250000, "leisureCost": 300000, "medicalCost": 150000, "insuranceCost": 200000, "otherExpense": 150000, "monthlySavings": 300000, "savings": 15000000, "targetAmount": 5}',
 '{"totalAssets": 15000000, "monthlyIncome": 3700000, "monthlyExpense": 3150000, "savingsRate": 14.9, "analysis": "기본적인 재무 상태이지만 저축률을 높일 필요가 있습니다. 지출 관리 개선이 필요합니다."}',
 NOW() - INTERVAL '10 days'),
('dev_user_003',
 '{"monthlyIncome": 7000000, "spouseIncome": 4000000, "otherIncome": 1000000, "incomeType": "business", "incomeVariability": "high", "housingCost": 2000000, "foodCost": 1000000, "educationCost": 800000, "transportationCost": 500000, "leisureCost": 600000, "medicalCost": 300000, "insuranceCost": 400000, "otherExpense": 300000, "monthlySavings": 2000000, "savings": 100000000, "targetAmount": 20}',
 '{"totalAssets": 100000000, "monthlyIncome": 12000000, "monthlyExpense": 6300000, "savingsRate": 47.5, "analysis": "우수한 재무 상태입니다. 높은 수입과 적절한 지출 관리로 안정적인 자산 축적이 이루어지고 있습니다."}',
 NOW() - INTERVAL '7 days'),
('dev_user_004',
 '{"monthlyIncome": 4500000, "spouseIncome": 2500000, "otherIncome": 300000, "incomeType": "salary", "incomeVariability": "low", "housingCost": 1800000, "foodCost": 700000, "educationCost": 400000, "transportationCost": 350000, "leisureCost": 350000, "medicalCost": 250000, "insuranceCost": 250000, "otherExpense": 250000, "monthlySavings": 800000, "savings": 30000000, "targetAmount": 8}',
 '{"totalAssets": 30000000, "monthlyIncome": 7300000, "monthlyExpense": 4350000, "savingsRate": 40.4, "analysis": "양호한 재무 상태입니다. 안정적인 수입과 적절한 저축률을 보이고 있습니다."}',
 NOW() - INTERVAL '4 days'),
('dev_user_005',
 '{"monthlyIncome": 3000000, "spouseIncome": 2000000, "otherIncome": 100000, "incomeType": "salary", "incomeVariability": "medium", "housingCost": 1000000, "foodCost": 500000, "educationCost": 200000, "transportationCost": 200000, "leisureCost": 250000, "medicalCost": 100000, "insuranceCost": 150000, "otherExpense": 100000, "monthlySavings": 400000, "savings": 8000000, "targetAmount": 3}',
 '{"totalAssets": 8000000, "monthlyIncome": 5100000, "monthlyExpense": 2550000, "savingsRate": 50.0, "analysis": "안정적인 재무 상태입니다. 높은 저축률을 보이고 있어 목표 달성이 가능할 것으로 보입니다."}',
 NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- 8. 커뮤니티 게시글 (community_posts)
INSERT INTO community_posts (member_user_id, title, content, category, created_at) VALUES
('dev_user_001', '재무설계 시작하기', '재무설계를 시작하려고 하는데 어떤 것부터 해야 할까요? 현재 월 수입 500만원이고 지출은 300만원 정도입니다. 체계적인 방법을 알고 싶습니다.', 'finance', NOW() - INTERVAL '20 days'),
('dev_user_002', '투자 경험 공유', '최근 주식 투자를 시작했는데 경험을 공유해드릴게요. 처음에는 어려웠지만 차근차근 배우면서 재미를 느끼고 있습니다.', 'investment', NOW() - INTERVAL '18 days'),
('dev_user_003', '저축 방법 추천', '효과적인 저축 방법을 추천해주세요. 현재 월 100만원 정도 저축하고 있는데 더 늘리고 싶습니다.', 'savings', NOW() - INTERVAL '15 days'),
('dev_user_004', '부동산 투자 고민', '부동산 투자를 고려하고 있는데 어떤 지역이 좋을까요? 서울 강남구와 송파구를 비교하고 있습니다.', 'real_estate', NOW() - INTERVAL '12 days'),
('dev_user_005', '펀드 투자 질문', '펀드 투자를 시작하려고 하는데 어떤 펀드를 선택해야 할지 모르겠습니다. 안정성과 수익성을 모두 고려하고 싶습니다.', 'investment', NOW() - INTERVAL '10 days'),
('dev_expert_001', '재무설계 전문가 조언', '재무설계에 대한 전문가 조언을 드립니다. 개인마다 상황이 다르므로 맞춤형 접근이 중요합니다.', 'expert_advice', NOW() - INTERVAL '25 days'),
('dev_expert_002', '투자 포트폴리오 관리 팁', '투자 포트폴리오 관리에 대한 팁을 공유합니다. 분산 투자와 리스크 관리가 핵심입니다.', 'expert_advice', NOW() - INTERVAL '22 days'),
('dev_expert_003', '부동산 시장 전망', '현재 부동산 시장 전망과 투자 전략에 대해 말씀드립니다. 지역별 차이를 고려해야 합니다.', 'expert_advice', NOW() - INTERVAL '20 days'),
('dev_user_001', '세금 절약 방법', '세금 절약 방법에 대해 궁금합니다. 연말정산과 세무 최적화에 대한 정보를 공유해주세요.', 'tax', NOW() - INTERVAL '8 days'),
('dev_user_002', '은퇴 준비 계획', '은퇴 준비를 위한 계획을 세우고 있습니다. 어떤 준비가 필요한지 조언을 구합니다.', 'retirement', NOW() - INTERVAL '6 days')
ON CONFLICT (id) DO NOTHING;

-- 9. 커뮤니티 댓글 (community_comments)
INSERT INTO community_comments (post_id, member_user_id, content, created_at) VALUES
((SELECT id FROM community_posts WHERE title = '재무설계 시작하기' LIMIT 1), 'dev_user_002', '저도 같은 고민이었는데, 먼저 수입과 지출을 파악하는 것부터 시작하세요. 엑셀로 정리하면 도움이 됩니다.', NOW() - INTERVAL '19 days'),
((SELECT id FROM community_posts WHERE title = '재무설계 시작하기' LIMIT 1), 'dev_expert_001', '체계적인 재무설계를 위해서는 전문가와 상담하는 것을 추천드립니다. 개인마다 상황이 다르기 때문입니다.', NOW() - INTERVAL '18 days'),
((SELECT id FROM community_posts WHERE title = '재무설계 시작하기' LIMIT 1), 'dev_user_003', '저축 목표를 세우고 단계별로 진행하는 것이 좋습니다. 너무 무리하지 마세요.', NOW() - INTERVAL '17 days'),
((SELECT id FROM community_posts WHERE title = '투자 경험 공유' LIMIT 1), 'dev_user_001', '좋은 경험 공유 감사합니다. 저도 참고하겠습니다. 처음에는 소액으로 시작하는 것이 좋겠네요.', NOW() - INTERVAL '17 days'),
((SELECT id FROM community_posts WHERE title = '투자 경험 공유' LIMIT 1), 'dev_expert_002', '좋은 접근입니다. 분산 투자와 장기 관점을 유지하시면 좋은 결과를 얻을 수 있을 것입니다.', NOW() - INTERVAL '16 days'),
((SELECT id FROM community_posts WHERE title = '저축 방법 추천' LIMIT 1), 'dev_user_002', '자동이체로 매월 일정 금액을 저축하는 것이 효과적입니다. 저는 월급날 바로 이체하도록 설정했습니다.', NOW() - INTERVAL '14 days'),
((SELECT id FROM community_posts WHERE title = '저축 방법 추천' LIMIT 1), 'dev_user_004', '적금이나 펀드 적립식 투자도 좋은 방법입니다. 복리 효과를 볼 수 있어요.', NOW() - INTERVAL '13 days'),
((SELECT id FROM community_posts WHERE title = '부동산 투자 고민' LIMIT 1), 'dev_expert_003', '강남구는 안정적이지만 가격이 높고, 송파구는 성장 가능성이 높습니다. 투자 목적에 따라 선택하세요.', NOW() - INTERVAL '11 days'),
((SELECT id FROM community_posts WHERE title = '부동산 투자 고민' LIMIT 1), 'dev_user_005', '송파구가 더 투자하기 좋을 것 같습니다. 가격 대비 성장 가능성이 높아요.', NOW() - INTERVAL '10 days'),
((SELECT id FROM community_posts WHERE title = '펀드 투자 질문' LIMIT 1), 'dev_expert_002', '안정성과 수익성을 모두 고려한다면 혼합형 펀드를 추천합니다. 리스크 분산 효과가 있습니다.', NOW() - INTERVAL '9 days'),
((SELECT id FROM community_posts WHERE title = '펀드 투자 질문' LIMIT 1), 'dev_user_001', '저도 혼합형 펀드에 투자하고 있습니다. 안정적이면서도 적당한 수익을 얻을 수 있어요.', NOW() - INTERVAL '8 days'),
((SELECT id FROM community_posts WHERE title = '세금 절약 방법' LIMIT 1), 'dev_expert_001', '연말정산 시 공제 항목을 잘 활용하는 것이 중요합니다. 의료비, 교육비, 기부금 등을 확인해보세요.', NOW() - INTERVAL '7 days'),
((SELECT id FROM community_posts WHERE title = '은퇴 준비 계획' LIMIT 1), 'dev_expert_001', '은퇴 준비는 30대부터 시작하는 것이 좋습니다. 연금, 투자, 보험 등을 종합적으로 고려해야 합니다.', NOW() - INTERVAL '5 days'),
((SELECT id FROM community_posts WHERE title = '은퇴 준비 계획' LIMIT 1), 'dev_user_003', '저도 은퇴 준비를 시작했습니다. 월 50만원씩 연금에 가입하고 있어요.', NOW() - INTERVAL '4 days')
ON CONFLICT (id) DO NOTHING;

-- 10. 게시글 좋아요 (community_post_likes)
INSERT INTO community_post_likes (post_id, member_user_id, created_at) VALUES
((SELECT id FROM community_posts WHERE title = '재무설계 시작하기' LIMIT 1), 'dev_user_002', NOW() - INTERVAL '19 days'),
((SELECT id FROM community_posts WHERE title = '재무설계 시작하기' LIMIT 1), 'dev_user_003', NOW() - INTERVAL '18 days'),
((SELECT id FROM community_posts WHERE title = '재무설계 시작하기' LIMIT 1), 'dev_user_004', NOW() - INTERVAL '17 days'),
((SELECT id FROM community_posts WHERE title = '투자 경험 공유' LIMIT 1), 'dev_user_001', NOW() - INTERVAL '17 days'),
((SELECT id FROM community_posts WHERE title = '투자 경험 공유' LIMIT 1), 'dev_user_003', NOW() - INTERVAL '16 days'),
((SELECT id FROM community_posts WHERE title = '투자 경험 공유' LIMIT 1), 'dev_user_005', NOW() - INTERVAL '15 days'),
((SELECT id FROM community_posts WHERE title = '저축 방법 추천' LIMIT 1), 'dev_user_001', NOW() - INTERVAL '14 days'),
((SELECT id FROM community_posts WHERE title = '저축 방법 추천' LIMIT 1), 'dev_user_002', NOW() - INTERVAL '13 days'),
((SELECT id FROM community_posts WHERE title = '부동산 투자 고민' LIMIT 1), 'dev_user_001', NOW() - INTERVAL '11 days'),
((SELECT id FROM community_posts WHERE title = '부동산 투자 고민' LIMIT 1), 'dev_user_003', NOW() - INTERVAL '10 days'),
((SELECT id FROM community_posts WHERE title = '펀드 투자 질문' LIMIT 1), 'dev_user_002', NOW() - INTERVAL '9 days'),
((SELECT id FROM community_posts WHERE title = '펀드 투자 질문' LIMIT 1), 'dev_user_004', NOW() - INTERVAL '8 days'),
((SELECT id FROM community_posts WHERE title = '재무설계 전문가 조언' LIMIT 1), 'dev_user_001', NOW() - INTERVAL '24 days'),
((SELECT id FROM community_posts WHERE title = '재무설계 전문가 조언' LIMIT 1), 'dev_user_002', NOW() - INTERVAL '23 days'),
((SELECT id FROM community_posts WHERE title = '재무설계 전문가 조언' LIMIT 1), 'dev_user_003', NOW() - INTERVAL '22 days'),
((SELECT id FROM community_posts WHERE title = '투자 포트폴리오 관리 팁' LIMIT 1), 'dev_user_001', NOW() - INTERVAL '21 days'),
((SELECT id FROM community_posts WHERE title = '투자 포트폴리오 관리 팁' LIMIT 1), 'dev_user_004', NOW() - INTERVAL '20 days'),
((SELECT id FROM community_posts WHERE title = '부동산 시장 전망' LIMIT 1), 'dev_user_002', NOW() - INTERVAL '19 days'),
((SELECT id FROM community_posts WHERE title = '부동산 시장 전망' LIMIT 1), 'dev_user_005', NOW() - INTERVAL '18 days')
ON CONFLICT (id) DO NOTHING;

-- 11. 댓글 좋아요 (community_comment_likes)
INSERT INTO community_comment_likes (comment_id, member_user_id, created_at) VALUES
((SELECT id FROM community_comments WHERE content LIKE '%엑셀로 정리하면 도움이 됩니다%' LIMIT 1), 'dev_user_001', NOW() - INTERVAL '18 days'),
((SELECT id FROM community_comments WHERE content LIKE '%엑셀로 정리하면 도움이 됩니다%' LIMIT 1), 'dev_user_003', NOW() - INTERVAL '17 days'),
((SELECT id FROM community_comments WHERE content LIKE '%전문가와 상담하는 것을 추천드립니다%' LIMIT 1), 'dev_user_002', NOW() - INTERVAL '17 days'),
((SELECT id FROM community_comments WHERE content LIKE '%저축 목표를 세우고 단계별로 진행하는 것이 좋습니다%' LIMIT 1), 'dev_user_001', NOW() - INTERVAL '16 days'),
((SELECT id FROM community_comments WHERE content LIKE '%좋은 경험 공유 감사합니다%' LIMIT 1), 'dev_user_003', NOW() - INTERVAL '16 days'),
((SELECT id FROM community_comments WHERE content LIKE '%분산 투자와 장기 관점을 유지하시면%' LIMIT 1), 'dev_user_001', NOW() - INTERVAL '15 days'),
((SELECT id FROM community_comments WHERE content LIKE '%자동이체로 매월 일정 금액을 저축하는 것이 효과적입니다%' LIMIT 1), 'dev_user_001', NOW() - INTERVAL '13 days'),
((SELECT id FROM community_comments WHERE content LIKE '%자동이체로 매월 일정 금액을 저축하는 것이 효과적입니다%' LIMIT 1), 'dev_user_003', NOW() - INTERVAL '12 days'),
((SELECT id FROM community_comments WHERE content LIKE '%적금이나 펀드 적립식 투자도 좋은 방법입니다%' LIMIT 1), 'dev_user_002', NOW() - INTERVAL '12 days'),
((SELECT id FROM community_comments WHERE content LIKE '%강남구는 안정적이지만 가격이 높고%' LIMIT 1), 'dev_user_001', NOW() - INTERVAL '10 days'),
((SELECT id FROM community_comments WHERE content LIKE '%송파구가 더 투자하기 좋을 것 같습니다%' LIMIT 1), 'dev_user_003', NOW() - INTERVAL '9 days'),
((SELECT id FROM community_comments WHERE content LIKE '%안정성과 수익성을 모두 고려한다면 혼합형 펀드를 추천합니다%' LIMIT 1), 'dev_user_001', NOW() - INTERVAL '8 days'),
((SELECT id FROM community_comments WHERE content LIKE '%저도 혼합형 펀드에 투자하고 있습니다%' LIMIT 1), 'dev_user_002', NOW() - INTERVAL '7 days'),
((SELECT id FROM community_comments WHERE content LIKE '%연말정산 시 공제 항목을 잘 활용하는 것이 중요합니다%' LIMIT 1), 'dev_user_003', NOW() - INTERVAL '6 days'),
((SELECT id FROM community_comments WHERE content LIKE '%은퇴 준비는 30대부터 시작하는 것이 좋습니다%' LIMIT 1), 'dev_user_001', NOW() - INTERVAL '4 days'),
((SELECT id FROM community_comments WHERE content LIKE '%저도 은퇴 준비를 시작했습니다%' LIMIT 1), 'dev_user_002', NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

-- 12. 회원 설정 (member_settings)
INSERT INTO member_settings (user_id, notification_email, notification_push, privacy_level, theme, language, created_at) VALUES
('dev_user_001', true, true, 'public', 'light', 'ko', NOW() - INTERVAL '30 days'),
('dev_user_002', true, false, 'friends', 'dark', 'ko', NOW() - INTERVAL '25 days'),
('dev_user_003', false, true, 'private', 'light', 'ko', NOW() - INTERVAL '20 days'),
('dev_user_004', true, true, 'public', 'light', 'ko', NOW() - INTERVAL '15 days'),
('dev_user_005', false, false, 'friends', 'dark', 'ko', NOW() - INTERVAL '10 days'),
('dev_expert_001', true, true, 'public', 'light', 'ko', NOW() - INTERVAL '60 days'),
('dev_expert_002', true, true, 'public', 'light', 'ko', NOW() - INTERVAL '55 days'),
('dev_expert_003', true, true, 'public', 'light', 'ko', NOW() - INTERVAL '50 days'),
('dev_admin_001', true, true, 'public', 'light', 'ko', NOW() - INTERVAL '90 days')
ON CONFLICT (user_id) DO NOTHING;

-- 13. 사용자 세션 (user_sessions)
INSERT INTO user_sessions (user_id, session_data, expires_at, created_at) VALUES
('dev_user_001', '{"last_activity": "2024-01-15T10:30:00Z", "ip_address": "192.168.1.100", "user_agent": "Mozilla/5.0..."}', NOW() + INTERVAL '24 hours', NOW() - INTERVAL '2 hours'),
('dev_user_002', '{"last_activity": "2024-01-15T11:15:00Z", "ip_address": "192.168.1.101", "user_agent": "Mozilla/5.0..."}', NOW() + INTERVAL '24 hours', NOW() - INTERVAL '1 hour'),
('dev_user_003', '{"last_activity": "2024-01-15T12:00:00Z", "ip_address": "192.168.1.102", "user_agent": "Mozilla/5.0..."}', NOW() + INTERVAL '24 hours', NOW() - INTERVAL '30 minutes'),
('dev_expert_001', '{"last_activity": "2024-01-15T09:45:00Z", "ip_address": "192.168.1.103", "user_agent": "Mozilla/5.0..."}', NOW() + INTERVAL '24 hours', NOW() - INTERVAL '3 hours'),
('dev_expert_002', '{"last_activity": "2024-01-15T10:20:00Z", "ip_address": "192.168.1.104", "user_agent": "Mozilla/5.0..."}', NOW() + INTERVAL '24 hours', NOW() - INTERVAL '2 hours 30 minutes')
ON CONFLICT (id) DO NOTHING;

-- 확인 메시지
SELECT '포괄적인 샘플 데이터가 성공적으로 생성되었습니다!' as message;

-- 데이터 통계 확인
SELECT 
    'members' as table_name, COUNT(*) as count FROM members
UNION ALL
SELECT 'experts', COUNT(*) FROM experts
UNION ALL
SELECT 'expert_products', COUNT(*) FROM expert_products
UNION ALL
SELECT 'coaching_applications', COUNT(*) FROM coaching_applications
UNION ALL
SELECT 'coaching_history', COUNT(*) FROM coaching_history
UNION ALL
SELECT 'mbti_diagnosis', COUNT(*) FROM mbti_diagnosis
UNION ALL
SELECT 'finance_diagnosis', COUNT(*) FROM finance_diagnosis
UNION ALL
SELECT 'community_posts', COUNT(*) FROM community_posts
UNION ALL
SELECT 'community_comments', COUNT(*) FROM community_comments
UNION ALL
SELECT 'community_post_likes', COUNT(*) FROM community_post_likes
UNION ALL
SELECT 'community_comment_likes', COUNT(*) FROM community_comment_likes
UNION ALL
SELECT 'member_settings', COUNT(*) FROM member_settings
UNION ALL
SELECT 'user_sessions', COUNT(*) FROM user_sessions
ORDER BY table_name; 