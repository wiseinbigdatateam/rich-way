-- 제공된 스키마에 맞춘 Experts 테이블 생성
-- id는 uuid로 관리, education, career 등은 단일 text 필드로 변경 (줄바꿈으로 구분)
CREATE TABLE experts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255),
    password VARCHAR(255), -- 실제 운영에서는 해시된 비밀번호를 저장해야 합니다.
    profile_image_url VARCHAR(255),
    expert_name VARCHAR(100) NOT NULL,
    company_name VARCHAR(200),
    email VARCHAR(255) UNIQUE,
    main_field VARCHAR(100), -- '부동산', '세무', '레버리지' 등
    company_phone VARCHAR(50),
    personal_phone VARCHAR(50),
    tags TEXT[], -- 핵심 소개 문구 (배열)
    core_intro TEXT,
    youtube_channel_url VARCHAR(500),
    intro_video_url VARCHAR(500),
    press_url VARCHAR(500),
    education_and_certifications TEXT,
    career TEXT,
    achievements TEXT,
    expertise_detail TEXT,
    experience_years INT,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'pending'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 샘플 데이터 삽입
INSERT INTO experts (user_id, password, expert_name, company_name, profile_image_url, main_field, tags, core_intro, youtube_channel_url, intro_video_url, press_url, education_and_certifications, career, achievements, expertise_detail, experience_years, email, status) VALUES
-- 부동산 전문가
('expert1', 'expert1', '김부동', '부동산투자연구소', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', '부동산',
 ARRAY['15년 부동산 투자 경력', '아파트 투자 전문', '수익률 평균 20% 달성'],
 '강남권 아파트 투자부터 지방 수익형 부동산까지, 다양한 부동산 투자 노하우를 보유하고 있습니다.',
 'https://www.youtube.com/@ntstax', 'https://www.youtube.com/watch?v=L0GGqwJdfwA', 'https://www.mk.co.kr/news/business/10894163',
 E'서울대학교 경영학과 학사 졸업 (1998)\n연세대학교 부동산학과 석사 졸업 (2001)\n공인중개사 자격증 취득 (2000)\n부동산투자상담사 자격증 취득 (2005)',
 E'현재 부동산투자연구소 대표이사 (2015~현재)\nKB부동산 투자컨설팅팀 팀장 (2010~2015)\n신한은행 부동산PF팀 과장 (2005~2010)',
 E'강남권 아파트 투자로 연평균 수익률 23% 달성 (2010~2020)\n개인 부동산 포트폴리오 300억원 규모 운용\n부동산 투자 서적 ''아파트 부자되기'' 베스트셀러 저자',
 E'강남권 신축 아파트 투자 전략 수립\n지방 수익형 부동산 발굴 및 분석\n부동산 경매 및 공매 투자 노하우',
 15, 'kim@realestate.com', 'active'),

('expert2', 'expert2', '박상가', '상가투자클럽', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', '부동산',
 ARRAY['상가 투자 10년', '임대수익률 12% 평균', '200개 매물 분석 경험'],
 '상가 투자의 A부터 Z까지 모든 것을 알려드립니다. 상권 분석, 임차인 선별, 계약서 작성 노하우부터 세무 처리까지 상가 투자 성공을 위한 실전 경험을 공유합니다.',
 'https://www.youtube.com/@ntstax', 'https://www.youtube.com/watch?v=L0GGqwJdfwA', 'https://www.mk.co.kr/news/business/10894163',
 E'중앙대학교 부동산학과 학사 졸업 (2005)\n건국대학교 부동산대학원 석사 졸업 (2008)\n공인중개사 자격증 취득 (2006)',
 E'현재 상가투자클럽 운영실장 (2013~현재)\n리츠자산운용 상업용부동산팀 과장 (2010~2013)',
 E'상가 투자 평균 임대수익률 12.5% 달성\n200개 이상 상가 매물 분석 및 투자 중개',
 E'상권 분석 및 임차인 니즈 파악\n상가 임대료 협상 및 계약서 작성\n상가 리모델링 및 가치 상승 전략',
 10, 'park@sangga.com', 'active'),

-- 세무 전문가
('expert3', 'expert3', '최세무', '세무법인 절세', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face', '세무',
 ARRAY['세무사 자격 보유', '상속세 전문', '절세 컨설팅 500건'],
 '복잡한 세법을 쉽게 풀어서 설명하고, 개인별 맞춤 절세 전략을 제시합니다.',
 'https://www.youtube.com/@ntstax', 'https://www.youtube.com/watch?v=L0GGqwJdfwA', 'https://www.mk.co.kr/news/business/10894163',
 E'고려대학교 경영학과 학사 졸업 (1995)\n세무사 자격증 취득 (1997)\n공인회계사 자격증 취득 (2000)',
 E'현재 세무법인 절세 대표세무사 (2010~현재)\n삼일회계법인 세무본부 이사 (2005~2010)',
 E'상속세 절세 컨설팅 500건 이상 수행\n평균 상속세 절약률 35% 달성',
 E'상속세 및 증여세 절세 설계\n부동산 양도소득세 최적화\n법인 설립을 통한 소득세 절세',
 20, 'choi@taxsave.com', 'active'),

-- 레버리지 전문가
('expert4', 'expert4', '강레버', '금융레버리지연구소', 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=150&h=150&fit=crop&crop=face', '레버리지',
 ARRAY['금융 레버리지 전문', '대출 한도 최대화', '금리 협상 노하우'],
 '적정 레버리지를 활용한 자산 증식 전략을 코칭합니다.',
 'https://www.youtube.com/@ntstax', 'https://www.youtube.com/watch?v=L0GGqwJdfwA', 'https://www.mk.co.kr/news/business/10894163',
 E'서울대학교 경제학과 학사 졸업 (1999)\n금융투자분석사 자격증 취득 (2001)',
 E'현재 금융레버리지연구소 대표 (2016~현재)\nKB국민은행 기업금융부 부장 (2012~2016)',
 E'개인 대출 한도 최대화 성공률 98%\n평균 금리 협상 절약률 1.2%p 달성',
 E'은행별 대출 상품 비교 분석\n개인 신용등급 관리 및 개선\n부동산 담보대출 한도 최대화',
 18, 'kang@leverage.com', 'pending');


-- ===== 수정된 쿼리 예시 =====

-- 1. 모든 활성 상태 전문가 조회
SELECT * FROM experts WHERE status = 'active' ORDER BY main_field, expert_name;

-- 2. 주요 분야별 전문가 수 조회
SELECT main_field, COUNT(*) as expert_count
FROM experts
WHERE status = 'active'
GROUP BY main_field
ORDER BY expert_count DESC;

-- 3. 특정 분야의 전문가 조회 (부동산)
SELECT id, expert_name, company_name, tags, core_intro
FROM experts
WHERE main_field = '부동산' AND status = 'active';

-- 4. 전문가 검색 (이름이나 회사명으로)
SELECT * FROM experts
WHERE expert_name ILIKE '%김%' OR company_name ILIKE '%투자%';

-- 5. 최근 등록된 전문가 조회
SELECT expert_name, company_name, main_field, created_at
FROM experts
ORDER BY created_at DESC
LIMIT 5;

-- 6. 특정 태그가 포함된 전문가 조회
SELECT expert_name, company_name, tags
FROM experts
WHERE '수익률 평균 20% 달성' = ANY(tags);

-- 7. 전문가별 경력 정보 조회 (세무 분야)
SELECT expert_name, company_name, career
FROM experts
WHERE main_field = '세무';

-- 8. 경력 연수가 많은 전문가 순으로 조회
SELECT expert_name, company_name, experience_years, achievements
FROM experts
ORDER BY experience_years DESC;

-- 9. 특정 자격증을 보유한 전문가 조회 (텍스트 검색)
SELECT expert_name, company_name, education_and_certifications
FROM experts
WHERE education_and_certifications ILIKE '%세무사%' OR education_and_certifications ILIKE '%회계사%';

-- 10. 전문 분야 상세 내용에 특정 키워드가 포함된 전문가 조회
SELECT expert_name, company_name, expertise_detail
FROM experts
WHERE expertise_detail ILIKE '%부동산%';

-- 11. 복합 조건 검색 (부동산 분야 + 태그에 '수익률' 포함)
SELECT expert_name, company_name, tags, core_intro
FROM experts
WHERE main_field = '부동산'
  AND EXISTS (
    SELECT 1 FROM unnest(tags) AS tag WHERE tag ILIKE '%수익률%'
);

-- 12. 전문가 통계 정보
SELECT
    COUNT(*) as total_experts,
    COUNT(DISTINCT main_field) as field_count,
    AVG(experience_years) as avg_experience_years,
    MAX(experience_years) as max_experience_years
FROM experts;

-- 13. 분야별 평균 경력 연수
SELECT
    main_field,
    COUNT(*) as expert_count,
    AVG(experience_years) as avg_years
FROM experts
GROUP BY main_field
ORDER BY avg_years DESC;

-- 14. 경력에 '대표'가 포함된 전문가 조회
SELECT expert_name, company_name, career
FROM experts
WHERE career ILIKE '%대표%';

-- 15. 전문가 상세 정보 조회
SELECT * FROM experts WHERE id = (SELECT id FROM experts WHERE expert_name = '김부동' LIMIT 1); 