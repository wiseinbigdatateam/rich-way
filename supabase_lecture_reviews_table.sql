-- 강의 리뷰 테이블 생성 (실제 스키마에 맞춤)
CREATE TABLE IF NOT EXISTS public.lecture_reviews (
    id uuid not null default gen_random_uuid(),
    lecture_id uuid not null,
    member_user_id character varying(50) not null,
    rating integer not null,
    review text null,
    likes integer null default 0,
    created_at timestamp with time zone null default now(),
    constraint lecture_reviews_pkey primary key (id),
    constraint fk_lecture_reviews_lecture_id foreign KEY (lecture_id) references lectures (id) on delete CASCADE,
    constraint lecture_reviews_rating_check check (
        (
            (rating >= 1)
            and (rating <= 5)
        )
    )
) TABLESPACE pg_default;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_lecture_reviews_lecture_id ON public.lecture_reviews(lecture_id);
CREATE INDEX IF NOT EXISTS idx_lecture_reviews_member_user_id ON public.lecture_reviews(member_user_id);
CREATE INDEX IF NOT EXISTS idx_lecture_reviews_created_at ON public.lecture_reviews(created_at);

-- RLS 활성화
ALTER TABLE public.lecture_reviews ENABLE ROW LEVEL SECURITY;

-- RLS 정책 설정
-- 모든 사용자가 리뷰 조회 가능
CREATE POLICY "Anyone can view lecture reviews" ON public.lecture_reviews
    FOR SELECT USING (true);

-- 인증된 사용자만 리뷰 작성 가능
CREATE POLICY "Authenticated users can insert reviews" ON public.lecture_reviews
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 사용자는 자신의 리뷰만 수정/삭제 가능
CREATE POLICY "Users can update own reviews" ON public.lecture_reviews
    FOR UPDATE USING (member_user_id = auth.uid()::text);

CREATE POLICY "Users can delete own reviews" ON public.lecture_reviews
    FOR DELETE USING (member_user_id = auth.uid()::text);

-- 강의 리뷰 임시 데이터 삽입
-- 먼저 lectures 테이블의 실제 ID를 확인하고 아래 쿼리로 조회
-- SELECT id, title FROM public.lectures WHERE status = '사용' ORDER BY category, created_at;

-- 아래 INSERT 문에서 '실제강의ID' 부분을 위 쿼리 결과의 실제 ID로 교체해야 합니다.

-- 기초코어 강의 리뷰
INSERT INTO public.lecture_reviews (lecture_id, member_user_id, rating, review, likes) VALUES
-- 나나위의 내집마련 기초반 리뷰 (실제강의ID1로 교체 필요)
('실제강의ID1', 'member001', 5, '정말 실용적인 강의였습니다. 월 300만원으로 내집마련이 가능하다니 믿기지 않았는데, 구체적인 방법을 알려주셔서 감사합니다.', 12),
('실제강의ID1', 'member002', 4, '좋은 강의였지만 조금 더 구체적인 사례가 있었으면 좋겠습니다. 그래도 기본기는 탄탄히 다질 수 있었어요.', 8),
('실제강의ID1', 'member003', 5, '직장인에게 정말 필요한 정보들이 가득했습니다. 추천합니다! 특히 대출 상품 비교 부분이 유용했어요.', 15),
('실제강의ID1', 'member004', 5, '나나위 강사님의 실전 경험이 정말 도움이 되었습니다. 이론뿐만 아니라 실제 적용 가능한 팁들이 많았어요.', 20),
('실제강의ID1', 'member005', 4, '내집마련 로드맵이 체계적으로 잘 정리되어 있어서 좋았습니다. 단계별로 따라하기 쉬웠어요.', 6),

-- 돈의 심리학 리뷰 (실제강의ID2로 교체 필요)
('실제강의ID2', 'member006', 5, '돈에 대한 마인드셋이 완전히 바뀌었습니다. 정말 좋은 강의였어요. 특히 부자들의 사고방식을 이해할 수 있었어요.', 25),
('실제강의ID2', 'member007', 4, '심리학적 접근이 흥미로웠습니다. 실생활에 적용하기 좋은 내용들이 많았습니다. 돈에 대한 인식이 달라졌어요.', 18),
('실제강의ID2', 'member008', 5, '부자 마인드셋을 만드는 데 정말 도움이 되었습니다. 김부자 강사님의 설명이 명확하고 이해하기 쉬웠어요.', 22),
('실제강의ID2', 'member009', 5, '돈의 심리학이라는 제목에 걸맞게 심리적 측면에서 접근한 강의였습니다. 추천합니다!', 14),
('실제강의ID2', 'member010', 4, '좋은 강의였지만 조금 더 구체적인 실습 예제가 있었으면 좋겠습니다.', 7),

-- 재정관리 첫걸음 리뷰 (실제강의ID3으로 교체 필요)
('실제강의ID3', 'member011', 4, '가계부 작성부터 차근차근 알려주셔서 좋았습니다. 초보자도 쉽게 따라할 수 있어요.', 9),
('실제강의ID3', 'member012', 5, '재정관리의 기초를 탄탄히 다질 수 있었습니다. 박재정 강사님의 체계적인 설명이 인상적이었어요.', 16),
('실제강의ID3', 'member013', 4, '실습을 통해 바로 적용할 수 있어서 좋았습니다. 가계부 템플릿도 유용했어요.', 11),
('실제강의ID3', 'member014', 5, '재정관리의 핵심을 잘 짚어주는 강의였습니다. 목표 설정 방법도 배울 수 있어서 좋았어요.', 13),
('실제강의ID3', 'member015', 4, '기초부터 차근차근 설명해주셔서 이해하기 쉬웠습니다. 추천합니다!', 8),

-- 금융상품 기초 이해하기 리뷰 (실제강의ID4로 교체 필요)
('실제강의ID4', 'member016', 5, '복잡한 금융상품을 쉽게 설명해주셔서 이해하기 쉬웠습니다. 이금융 강사님의 설명이 명확했어요.', 19),
('실제강의ID4', 'member017', 4, '다양한 금융상품의 특징을 잘 알 수 있었습니다. 비교 분석이 유용했어요.', 12),
('실제강의ID4', 'member018', 5, '자신에게 맞는 금융상품을 선택하는 방법을 배울 수 있었습니다. 실용적인 강의였어요.', 17),
('실제강의ID4', 'member019', 4, '금융상품의 장단점을 명확하게 설명해주셔서 좋았습니다. 투자 결정에 도움이 되었어요.', 10),
('실제강의ID4', 'member020', 5, '은행에서 일하신 경험을 바탕으로 한 설명이라 더욱 신뢰할 수 있었습니다.', 14),

-- 신용관리와 신용점수 올리기 리뷰 (실제강의ID5로 교체 필요)
('실제강의ID5', 'member021', 5, '신용점수 관리의 모든 비밀을 알 수 있었습니다. 최신용 강사님의 노하우가 정말 유용했어요.', 23),
('실제강의ID5', 'member022', 4, '실전적인 방법들이 많아서 좋았습니다. 신용점수 향상에 실제로 도움이 되었어요.', 15),
('실제강의ID5', 'member023', 5, '신용점수를 효과적으로 올리는 방법을 배울 수 있었습니다. 체계적인 접근법이 인상적이었어요.', 18),
('실제강의ID5', 'member024', 4, '신용관리의 중요성을 다시 한번 깨달을 수 있었습니다. 실용적인 팁들이 많았어요.', 11),
('실제강의ID5', 'member025', 5, '신용점수 관리 전문가의 강의라 더욱 신뢰할 수 있었습니다. 추천합니다!', 20),

-- 경제 흐름 읽기 리뷰 (실제강의ID6으로 교체 필요)
('실제강의ID6', 'member026', 4, '경제 뉴스를 제대로 읽는 눈을 기를 수 있었습니다. 한경제 강사님의 분석이 탁월했어요.', 13),
('실제강의ID6', 'member027', 5, '복잡한 경제 지표를 쉽게 설명해주셔서 좋았습니다. 경제학 박사의 깊이 있는 강의였어요.', 21),
('실제강의ID6', 'member028', 4, '경제 흐름을 파악하는 방법을 배울 수 있었습니다. 실용적인 관점에서 접근한 강의였어요.', 16),
('실제강의ID6', 'member029', 5, '경제 뉴스를 보는 관점이 완전히 달라졌습니다. 전문가의 시각을 배울 수 있어서 좋았어요.', 19),
('실제강의ID6', 'member030', 4, '경제 지표의 의미를 이해할 수 있어서 좋았습니다. 투자 결정에 도움이 되었어요.', 12);

-- 부동산 강의 리뷰
INSERT INTO public.lecture_reviews (lecture_id, member_user_id, rating, review, likes) VALUES
-- 실전호반비 리뷰 (실제강의ID7로 교체 필요)
('실제강의ID7', 'member031', 5, '현장에서 직접 경험한 노하우가 정말 유용했습니다. 호반비 강사님의 실전 경험이 돋보였어요.', 28),
('실제강의ID7', 'member032', 5, '부동산 투자의 모든 것을 배울 수 있었습니다. 황금 입지 선별법이 특히 유용했어요.', 24),
('실제강의ID7', 'member033', 4, '실전적인 내용들이 많아서 좋았습니다. 이론뿐만 아니라 실제 적용 가능한 팁들이 많았어요.', 17),
('실제강의ID7', 'member034', 5, '20년 경력의 전문가 강의라 더욱 신뢰할 수 있었습니다. 추천합니다!', 22),
('실제강의ID7', 'member035', 4, '부동산 투자의 핵심을 잘 짚어주는 강의였습니다. 실전 사례가 많아서 좋았어요.', 15),

-- 대출 100% 활용법 리뷰 (실제강의ID8으로 교체 필요)
('실제강의ID8', 'member036', 5, '은행에서 알려주지 않는 정보들이 정말 많았습니다. 대출왕 강사님의 내부 정보가 유용했어요.', 26),
('실제강의ID8', 'member037', 4, '대출 한도 증액과 금리 인하 노하우가 유용했습니다. 실용적인 강의였어요.', 18),
('실제강의ID8', 'member038', 5, '대출을 100% 활용하는 방법을 배울 수 있었습니다. 은행 업무 경험을 바탕으로 한 설명이 인상적이었어요.', 23),
('실제강의ID8', 'member039', 4, '대출 상품의 숨겨진 비밀들을 알 수 있어서 좋았습니다. 투자에 도움이 되었어요.', 16),
('실제강의ID8', 'member040', 5, '은행 심사 기준을 완벽하게 파악할 수 있었습니다. 대출 승인 확률을 높이는 방법을 배웠어요.', 20),

-- 아파트 경매 올인원 리뷰 (실제강의ID9으로 교체 필요)
('실제강의ID9', 'member041', 5, '경매의 모든 과정을 완벽하게 배울 수 있었습니다. 명도코치 강사님의 노하우가 정말 유용했어요.', 31),
('실제강의ID9', 'member042', 5, '7주만에 경매를 마스터할 수 있었습니다. 체계적인 커리큘럼이 인상적이었어요.', 27),
('실제강의ID9', 'member043', 4, '경매 입찰부터 낙찰까지 완벽 가이드였습니다. 실전 사례가 많아서 좋았어요.', 19),
('실제강의ID9', 'member044', 5, '경매 전문가의 모든 비밀을 공개해주셔서 감사합니다. 추천합니다!', 25),
('실제강의ID9', 'member045', 4, '경매 투자의 리스크와 수익을 명확하게 설명해주셔서 좋았습니다.', 14);

-- 세무 강의 리뷰
INSERT INTO public.lecture_reviews (lecture_id, member_user_id, rating, review, likes) VALUES
-- 절세의 기술 리뷰 (실제강의ID13으로 교체 필요)
('실제강의ID13', 'member046', 5, '합법적인 절세 방법을 배울 수 있었습니다. 세무왕 강사님의 전문성이 돋보였어요.', 29),
('실제강의ID13', 'member047', 5, '세무사가 직접 알려주는 정보라서 신뢰할 수 있었습니다. 실용적인 절세 전략이 많았어요.', 24),
('실제강의ID13', 'member048', 4, '세금을 합법적으로 줄이는 방법을 배울 수 있었습니다. 체계적인 접근법이 좋았어요.', 18),
('실제강의ID13', 'member049', 5, '20년 경력의 세무사 강의라 더욱 신뢰할 수 있었습니다. 추천합니다!', 22),
('실제강의ID13', 'member050', 4, '절세의 핵심을 잘 짚어주는 강의였습니다. 실무에 바로 적용 가능한 내용들이 많았어요.', 16),

-- 상속세 절세 설계 리뷰 (실제강의ID14으로 교체 필요)
('실제강의ID14', 'member051', 5, '상속세 절세의 모든 비밀을 알 수 있었습니다. 상속전문가 강사님의 노하우가 정말 유용했어요.', 26),
('실제강의ID14', 'member052', 4, '가족 자산 승계 전략이 유용했습니다. 체계적인 설계 방법을 배울 수 있어서 좋았어요.', 19),
('실제강의ID14', 'member053', 5, '상속세를 최소화하는 설계 방법을 배울 수 있었습니다. 실전 사례가 많아서 좋았어요.', 23),
('실제강의ID14', 'member054', 4, '상속세 분야 전문가의 강의라 더욱 신뢰할 수 있었습니다. 추천합니다!', 17),
('실제강의ID14', 'member055', 5, '상속세 절세의 핵심을 명확하게 설명해주셔서 좋았습니다. 실용적인 전략이 많았어요.', 21);

-- 투자 강의 리뷰
INSERT INTO public.lecture_reviews (lecture_id, member_user_id, rating, review, likes) VALUES
-- 주식투자 왕초보 탈출 리뷰 (실제강의ID19으로 교체 필요)
('실제강의ID19', 'member056', 5, '주식투자 완전 초보자도 따라할 수 있었습니다. 주식왕 강사님의 설명이 명확했어요.', 30),
('실제강의ID19', 'member057', 5, '기초부터 실전까지 완벽한 가이드였습니다. 체계적인 커리큘럼이 인상적이었어요.', 25),
('실제강의ID19', 'member058', 4, '주식투자의 모든 것을 배울 수 있었습니다. 실전 사례가 많아서 좋았어요.', 20),
('실제강의ID19', 'member059', 5, '15년 경력의 투자자 강의라 더욱 신뢰할 수 있었습니다. 추천합니다!', 28),
('실제강의ID19', 'member060', 4, '주식투자의 핵심을 잘 짚어주는 강의였습니다. 리스크 관리 방법도 배울 수 있어서 좋았어요.', 18),

-- ETF 투자 리뷰 (실제강의ID20으로 교체 필요)
('실제강의ID20', 'member061', 5, 'ETF를 활용한 안전한 수익 창출 방법을 배울 수 있었습니다. ETF마스터 강사님의 전략이 유용했어요.', 24),
('실제강의ID20', 'member062', 4, 'ETF 투자의 모든 것을 배울 수 있었습니다. 체계적인 접근법이 좋았어요.', 16),
('실제강의ID20', 'member063', 5, '안전하고 꾸준한 수익을 만드는 전략이 유용했습니다. 실용적인 강의였어요.', 22),
('실제강의ID20', 'member064', 4, 'ETF 투자의 장단점을 명확하게 설명해주셔서 좋았습니다. 추천합니다!', 14),
('실제강의ID20', 'member065', 5, '10년간 ETF 투자만을 전문으로 해온 강사님의 노하우가 정말 유용했어요.', 19);

-- 창업사업 강의 리뷰
INSERT INTO public.lecture_reviews (lecture_id, member_user_id, rating, review, likes) VALUES
-- 1인 창업 성공 리뷰 (실제강의ID25으로 교체 필요)
('실제강의ID25', 'member066', 5, '1인 창업의 모든 과정을 배울 수 있었습니다. 창업멘토 강사님의 경험이 정말 유용했어요.', 27),
('실제강의ID25', 'member067', 5, '아이디어부터 수익화까지 완벽한 가이드였습니다. 체계적인 로드맵이 인상적이었어요.', 23),
('실제강의ID25', 'member068', 4, '성공적인 수익화 방법을 배울 수 있었습니다. 실전 사례가 많아서 좋았어요.', 18),
('실제강의ID25', 'member069', 5, '20년간 다양한 1인 창업을 성공시킨 강사님의 노하우가 정말 유용했어요.', 25),
('실제강의ID25', 'member070', 4, '창업의 핵심을 잘 짚어주는 강의였습니다. 리스크 관리 방법도 배울 수 있어서 좋았어요.', 16),

-- 온라인 쇼핑몰 창업 리뷰 (실제강의ID26으로 교체 필요)
('실제강의ID26', 'member071', 5, '온라인 쇼핑몰 창업부터 운영까지 모든 노하우를 배울 수 있었습니다. 쇼핑몰왕 강사님의 경험이 정말 유용했어요.', 26),
('실제강의ID26', 'member072', 4, '실전 경험을 바탕으로 한 내용이 유용했습니다. 체계적인 접근법이 좋았어요.', 19),
('실제강의ID26', 'member073', 5, '쇼핑몰 창업의 모든 것을 배울 수 있었습니다. 15년 경력의 전문가 강의라 더욱 신뢰할 수 있었어요.', 24),
('실제강의ID26', 'member074', 4, '온라인 쇼핑몰 운영의 핵심을 잘 짚어주는 강의였습니다. 추천합니다!', 17),
('실제강의ID26', 'member075', 5, '실전 경험을 바탕으로 한 노하우가 정말 유용했습니다. 성공 사례도 많아서 좋았어요.', 21);

-- 샘플 쿼리 예시
-- 1. 강의별 평균 평점과 리뷰 수 조회
-- SELECT 
--   l.title,
--   l.category,
--   AVG(lr.rating) as average_rating,
--   COUNT(lr.id) as review_count,
--   SUM(lr.likes) as total_likes
-- FROM public.lectures l
-- LEFT JOIN public.lecture_reviews lr ON l.id = lr.lecture_id
-- WHERE l.status = '사용'
-- GROUP BY l.id, l.title, l.category
-- ORDER BY average_rating DESC NULLS LAST;

-- 2. 특정 강의의 리뷰 조회 (최신순)
-- SELECT lr.*, l.title 
-- FROM public.lecture_reviews lr
-- JOIN public.lectures l ON lr.lecture_id = l.id
-- WHERE lr.lecture_id = '실제강의ID'
-- ORDER BY lr.created_at DESC;

-- 3. 평점별 리뷰 수 통계
-- SELECT rating, COUNT(*) as count, AVG(likes) as avg_likes
-- FROM public.lecture_reviews 
-- GROUP BY rating 
-- ORDER BY rating DESC;

-- 4. 카테고리별 평균 평점
-- SELECT 
--   l.category,
--   AVG(lr.rating) as avg_rating,
--   COUNT(lr.id) as total_reviews
-- FROM public.lectures l
-- LEFT JOIN public.lecture_reviews lr ON l.id = lr.lecture_id
-- WHERE l.status = '사용'
-- GROUP BY l.category
-- ORDER BY avg_rating DESC;

-- 5. 최근 리뷰 조회 (좋아요 순)
-- SELECT lr.*, l.title, l.category
-- FROM public.lecture_reviews lr
-- JOIN public.lectures l ON lr.lecture_id = l.id
-- ORDER BY lr.likes DESC, lr.created_at DESC 
-- LIMIT 10; 