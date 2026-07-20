-- 강의 Q&A 테이블 생성
CREATE TABLE IF NOT EXISTS public.lecture_qna (
    id uuid not null default gen_random_uuid(),
    lecture_id uuid not null,
    member_user_id character varying(50) not null,
    content text not null,
    likes integer null default 0,
    answers_count integer null default 0,
    parent_id uuid null,
    created_at timestamp with time zone null default now(),
    constraint lecture_qna_pkey primary key (id),
    constraint fk_lecture_qna_lecture_id foreign KEY (lecture_id) references lectures (id) on delete CASCADE,
    constraint fk_lecture_qna_parent_id foreign KEY (parent_id) references lecture_qna (id) on delete CASCADE
) TABLESPACE pg_default;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_lecture_qna_lecture_id ON public.lecture_qna(lecture_id);
CREATE INDEX IF NOT EXISTS idx_lecture_qna_parent_id ON public.lecture_qna(parent_id);
CREATE INDEX IF NOT EXISTS idx_lecture_qna_member_user_id ON public.lecture_qna(member_user_id);
CREATE INDEX IF NOT EXISTS idx_lecture_qna_created_at ON public.lecture_qna(created_at);

-- RLS 활성화
ALTER TABLE public.lecture_qna ENABLE ROW LEVEL SECURITY;

-- RLS 정책 설정
-- 모든 사용자가 Q&A 조회 가능
CREATE POLICY "Anyone can view lecture Q&A" ON public.lecture_qna
    FOR SELECT USING (true);

-- 인증된 사용자만 Q&A 작성 가능
CREATE POLICY "Authenticated users can insert Q&A" ON public.lecture_qna
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 사용자는 자신의 Q&A만 수정/삭제 가능
CREATE POLICY "Users can update own Q&A" ON public.lecture_qna
    FOR UPDATE USING (member_user_id = auth.uid()::text);

CREATE POLICY "Users can delete own Q&A" ON public.lecture_qna
    FOR DELETE USING (member_user_id = auth.uid()::text);

-- 강의 Q&A 임시 데이터 삽입
-- 먼저 lectures 테이블의 실제 ID를 확인하고 아래 쿼리로 조회
-- SELECT id, title FROM public.lectures WHERE status = '사용' ORDER BY category, created_at;

-- 아래 INSERT 문에서 '실제강의ID' 부분을 위 쿼리 결과의 실제 ID로 교체해야 합니다.

-- 질문 데이터 (parent_id가 null인 경우)
INSERT INTO public.lecture_qna (lecture_id, member_user_id, content, likes, answers_count, parent_id) VALUES
-- 부동산 강의 질문들 (실제강의ID7로 교체 필요)
('실제강의ID7', 'member001', '안녕하세요! 부동산 투자 초보자인데, 현재 월 300만원 정도 모을 수 있는 상황입니다. 이 강의를 들으면 실제로 투자할 수 있을까요? 그리고 최소 자금은 얼마나 필요할까요?', 15, 2, null),
('실제강의ID7', 'member002', '부동산 투자를 시작하려고 하는데, 현재 부동산 시장이 불안정한 것 같아서 망설여집니다. 2025년 현재 시점에서 투자하기 좋은 시기인가요?', 8, 1, null),
('실제강의ID7', 'member003', '강의에서 다루는 내용 중에서 실제 투자 성공 사례가 많이 나오나요? 이론보다는 실전 경험담을 더 듣고 싶습니다.', 12, 1, null),
('실제강의ID7', 'member004', '지방에서 살고 있는데, 수도권 부동산 투자가 가능할까요? 원격으로 관리하는 방법도 알려주시나요?', 6, 1, null),
('실제강의ID7', 'member005', '부동산 투자로 월 수익 100만원 정도를 목표로 하고 있습니다. 이 강의를 들으면 가능할까요?', 20, 2, null),

-- 기초코어 강의 질문들 (실제강의ID1로 교체 필요)
('실제강의ID1', 'member006', '월 300만원으로 정말 내집마련이 가능한가요? 구체적인 방법을 알려주시나요?', 25, 2, null),
('실제강의ID1', 'member007', '대출 한도가 낮은 직장인도 이 강의를 들으면 도움이 될까요?', 10, 1, null),
('실제강의ID1', 'member008', '강의에서 제공하는 가계부 템플릿을 실제로 사용해보신 분 있나요? 효과가 어떤가요?', 7, 1, null),
('실제강의ID1', 'member009', '내집마련 로드맵이 정말 체계적으로 잘 되어있나요? 단계별로 따라하기 쉬운가요?', 18, 1, null),
('실제강의ID1', 'member010', '직장인에게 맞는 내집마련 전략이 구체적으로 나오나요?', 14, 2, null),

-- 투자 강의 질문들 (실제강의ID19로 교체 필요)
('실제강의ID19', 'member011', '주식투자 완전 초보자인데, 이 강의를 들으면 실제로 투자할 수 있을까요?', 22, 2, null),
('실제강의ID19', 'member012', 'ETF 투자와 개별 주식 투자 중 어떤 것이 초보자에게 더 적합한가요?', 16, 1, null),
('실제강의ID19', 'member013', '강의에서 다루는 리스크 관리 방법이 실용적인가요?', 9, 1, null),
('실제강의ID19', 'member014', '15년 경력의 투자자 강사님이라니 신뢰할 수 있겠네요. 실제 수익률은 어느 정도인가요?', 30, 2, null),
('실제강의ID19', 'member015', '주식투자로 월 수익 50만원 정도를 목표로 하고 있습니다. 가능할까요?', 28, 1, null),

-- 세무 강의 질문들 (실제강의ID13으로 교체 필요)
('실제강의ID13', 'member016', '절세 방법을 배우면 실제로 얼마나 세금을 줄일 수 있나요?', 19, 2, null),
('실제강의ID13', 'member017', '세무사가 직접 알려주는 정보라니 신뢰할 수 있겠네요. 실무에 바로 적용 가능한가요?', 13, 1, null),
('실제강의ID13', 'member018', '20년 경력의 세무사 강의라니 정말 전문적이겠네요. 구체적인 사례가 많이 나오나요?', 17, 1, null),
('실제강의ID13', 'member019', '절세 전략을 배우면 합법적으로 세금을 얼마나 줄일 수 있나요?', 21, 2, null),
('실제강의ID13', 'member020', '실무에 바로 적용 가능한 절세 팁이 많이 나오나요?', 11, 1, null),

-- 창업사업 강의 질문들 (실제강의ID25로 교체 필요)
('실제강의ID25', 'member021', '1인 창업을 시작하려고 하는데, 이 강의를 들으면 실제로 창업할 수 있을까요?', 24, 2, null),
('실제강의ID25', 'member022', '아이디어부터 수익화까지 정말 완벽한 가이드인가요?', 15, 1, null),
('실제강의ID25', 'member023', '20년간 다양한 1인 창업을 성공시킨 강사님이라니 정말 믿을 수 있겠네요. 성공 사례가 많이 나오나요?', 26, 2, null),
('실제강의ID25', 'member024', '창업 초기 자금이 적어도 시작할 수 있는 방법을 알려주시나요?', 12, 1, null),
('실제강의ID25', 'member025', '온라인 쇼핑몰 창업에 관심이 있는데, 이 강의가 도움이 될까요?', 18, 1, null);

-- 답변 데이터 (parent_id가 질문의 id를 참조)
-- 부동산 강의 답변들
INSERT INTO public.lecture_qna (lecture_id, member_user_id, content, likes, answers_count, parent_id) VALUES
-- 첫 번째 질문에 대한 답변들
('실제강의ID7', 'instructor001', '안녕하세요! 부동산 투자 초보자시군요. 월 300만원으로도 충분히 투자가 가능합니다. 강의에서는 최소 자금부터 시작해서 단계별로 늘려가는 방법을 구체적으로 알려드립니다. 특히 첫 번째 수업에서 "내 노후준비에 필요한 자금 계산법"을 다루고 있어서, 목표에 맞는 투자 계획을 세우실 수 있을 거예요. 최소 자금은 지역에 따라 다르지만, 1000만원부터 시작 가능합니다!', 45, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID7' AND parent_id IS NULL LIMIT 1)),
('실제강의ID7', 'member026', '저도 초보자였는데 이 강의 듣고 실제로 투자 시작했습니다! 월 250만원으로 시작해서 지금은 월 50만원 수익 나고 있어요. 강사님이 단계별로 차근차근 알려주셔서 따라하기 쉬웠습니다.', 23, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID7' AND parent_id IS NULL LIMIT 1)),

-- 두 번째 질문에 대한 답변
('실제강의ID7', 'instructor001', '좋은 질문이네요! 2025년 현재 부동산 시장은 오히려 투자하기 좋은 시기입니다. 강의에서 "실제 사례로 배우는 부동산으로 부자되는 공식" 부분에서 현재 시장 상황에 맞는 전략을 구체적으로 다루고 있어요. 불안정한 시장일 때 오히려 기회가 많다는 걸 실제 사례를 통해 보여드립니다!', 31, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID7' AND parent_id IS NULL OFFSET 1 LIMIT 1)),

-- 세 번째 질문에 대한 답변
('실제강의ID7', 'instructor001', '네! 강의의 70% 이상이 실제 투자 성공 사례로 구성되어 있습니다. 특히 세 번째 수업에서 "실제 사례로 배우는 부동산으로 부자되는 공식"에서는 제가 직접 경험한 사례들을 상세히 다루고 있어요. 이론보다는 실전 경험담을 원하신다면 정말 만족하실 거예요!', 38, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID7' AND parent_id IS NULL OFFSET 2 LIMIT 1)),

-- 네 번째 질문에 대한 답변
('실제강의ID7', 'instructor001', '지방에서도 충분히 가능합니다! 강의에서 "수도권 투자 vs 지방 투자 선택하는 기준"을 구체적으로 다루고 있어요. 원격 관리 방법도 상세히 알려드리며, 실제로 지방에서 수도권 부동산을 관리하고 있는 수강생들의 사례도 포함되어 있습니다.', 27, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID7' AND parent_id IS NULL OFFSET 3 LIMIT 1)),

-- 다섯 번째 질문에 대한 답변들
('실제강의ID7', 'instructor001', '월 수익 100만원 목표는 충분히 가능합니다! 강의에서 "부동산이 자동으로 절약하는 구조 만드는 법"을 구체적으로 알려드리고 있어요. 실제로 수강생 중 월 100만원 이상 수익을 내고 있는 분들이 많습니다. 체계적인 접근법을 배우시면 목표 달성 가능합니다!', 52, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID7' AND parent_id IS NULL OFFSET 4 LIMIT 1)),
('실제강의ID7', 'member027', '저도 월 80만원 목표로 시작했는데, 지금은 월 120만원 나고 있어요! 강사님이 알려주신 방법대로 하니까 정말 효과가 있었습니다. 특히 입지 선별법이 정말 유용했어요.', 29, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID7' AND parent_id IS NULL OFFSET 4 LIMIT 1));

-- 기초코어 강의 답변들
INSERT INTO public.lecture_qna (lecture_id, member_user_id, content, likes, answers_count, parent_id) VALUES
-- 첫 번째 질문에 대한 답변들
('실제강의ID1', 'instructor002', '네! 월 300만원으로도 충분히 내집마련이 가능합니다. 강의에서 "내집마련 로드맵"을 단계별로 구체적으로 알려드리고 있어요. 특히 대출 상품 비교와 절약 방법을 상세히 다루고 있어서, 목표 달성이 가능합니다!', 67, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID1' AND parent_id IS NULL LIMIT 1)),
('실제강의ID1', 'member028', '저도 월 280만원으로 시작해서 3년 만에 내집 마련했습니다! 강사님이 알려주신 가계부 작성법과 절약 팁이 정말 도움이 되었어요.', 34, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID1' AND parent_id IS NULL LIMIT 1)),

-- 두 번째 질문에 대한 답변
('실제강의ID1', 'instructor002', '대출 한도가 낮아도 걱정하지 마세요! 강의에서 "대출 한도 증액 방법"과 "신용점수 올리는 노하우"를 구체적으로 다루고 있어요. 직장인에게 맞는 대출 전략을 알려드립니다!', 41, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID1' AND parent_id IS NULL OFFSET 1 LIMIT 1)),

-- 세 번째 질문에 대한 답변
('실제강의ID1', 'instructor002', '네! 가계부 템플릿을 실제로 사용해보신 수강생들의 후기가 매우 좋습니다. 엑셀 파일로 제공되며, 사용법도 상세히 설명드립니다. 실제로 월 20만원 이상 절약 효과를 보신 분들이 많아요!', 28, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID1' AND parent_id IS NULL OFFSET 2 LIMIT 1)),

-- 네 번째 질문에 대한 답변
('실제강의ID1', 'instructor002', '네! 내집마련 로드맵이 정말 체계적으로 잘 되어있습니다. 1단계부터 5단계까지 단계별로 따라하기 쉽게 구성되어 있어요. 각 단계별 체크리스트도 제공되므로 놓치는 부분 없이 진행할 수 있습니다!', 39, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID1' AND parent_id IS NULL OFFSET 3 LIMIT 1)),

-- 다섯 번째 질문에 대한 답변들
('실제강의ID1', 'instructor002', '네! 직장인에게 특화된 내집마련 전략을 구체적으로 다루고 있어요. 월급쟁이의 특성을 고려한 절약법, 투자법, 대출 전략을 알려드립니다!', 45, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID1' AND parent_id IS NULL OFFSET 4 LIMIT 1)),
('실제강의ID1', 'member029', '직장인으로서 정말 유용한 강의였어요! 특히 월급날 관리법과 연말정산 활용법이 실용적이었습니다.', 22, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID1' AND parent_id IS NULL OFFSET 4 LIMIT 1));

-- 투자 강의 답변들
INSERT INTO public.lecture_qna (lecture_id, member_user_id, content, likes, answers_count, parent_id) VALUES
-- 첫 번째 질문에 대한 답변들
('실제강의ID19', 'instructor003', '네! 주식투자 완전 초보자도 충분히 따라할 수 있습니다. 기초부터 차근차근 알려드리며, 실제 투자 실습도 포함되어 있어요. 특히 "주식투자 왕초보 탈출" 커리큘럼이 정말 체계적으로 잘 되어있습니다!', 73, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID19' AND parent_id IS NULL LIMIT 1)),
('실제강의ID19', 'member030', '저도 완전 초보자였는데 이 강의 듣고 실제로 투자 시작했습니다! 강사님이 어려운 용어도 쉽게 설명해주셔서 이해하기 쉬웠어요.', 31, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID19' AND parent_id IS NULL LIMIT 1)),

-- 두 번째 질문에 대한 답변
('실제강의ID19', 'instructor003', '초보자에게는 ETF 투자를 먼저 추천합니다! 강의에서 "ETF 투자 마스터" 부분에서 안전하고 꾸준한 수익을 만드는 방법을 구체적으로 다루고 있어요. 개별 주식은 기초를 다진 후에 시작하시면 됩니다!', 47, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID19' AND parent_id IS NULL OFFSET 1 LIMIT 1)),

-- 세 번째 질문에 대한 답변
('실제강의ID19', 'instructor003', '네! 리스크 관리가 투자의 핵심이라고 생각합니다. 강의에서 "리스크 관리 방법"을 상세히 다루고 있으며, 실제 투자 포트폴리오 구성법도 알려드립니다!', 35, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID19' AND parent_id IS NULL OFFSET 2 LIMIT 1)),

-- 네 번째 질문에 대한 답변들
('실제강의ID19', 'instructor003', '15년간의 투자 경험을 바탕으로 한 실전 노하우를 모두 공개합니다! 연평균 수익률은 15-20% 정도이며, 실제 투자 기록도 함께 보여드립니다. 이론이 아닌 실전 경험을 바탕으로 한 강의입니다!', 89, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID19' AND parent_id IS NULL OFFSET 3 LIMIT 1)),
('실제강의ID19', 'member031', '저도 이 강의 듣고 투자 시작했는데, 지금까지 연평균 18% 수익률 나고 있어요! 강사님의 전략이 정말 효과적이었습니다.', 42, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID19' AND parent_id IS NULL OFFSET 3 LIMIT 1)),

-- 다섯 번째 질문에 대한 답변
('실제강의ID19', 'instructor003', '월 수익 50만원 목표는 충분히 가능합니다! 다만 단기간이 아닌 장기적인 관점에서 접근해야 합니다. 강의에서 "꾸준한 수익 창출 전략"을 구체적으로 알려드리고 있어요!', 56, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID19' AND parent_id IS NULL OFFSET 4 LIMIT 1));

-- 세무 강의 답변들
INSERT INTO public.lecture_qna (lecture_id, member_user_id, content, likes, answers_count, parent_id) VALUES
-- 첫 번째 질문에 대한 답변들
('실제강의ID13', 'instructor004', '절세 방법을 제대로 적용하면 연간 100만원~500만원 정도 세금을 줄일 수 있습니다! 강의에서 "합법적인 절세 전략"을 구체적으로 다루고 있으며, 개인 상황에 맞는 맞춤형 절세 방법을 알려드립니다!', 78, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID13' AND parent_id IS NULL LIMIT 1)),
('실제강의ID13', 'member032', '저도 이 강의 듣고 절세 방법 적용했는데, 작년에 300만원 세금 절약했습니다! 세무사가 직접 알려주는 정보라서 정말 신뢰할 수 있었어요.', 45, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID13' AND parent_id IS NULL LIMIT 1)),

-- 두 번째 질문에 대한 답변
('실제강의ID13', 'instructor004', '네! 20년간 세무사로 일하면서 쌓은 실무 경험을 바탕으로 한 강의입니다. 이론이 아닌 실제 적용 가능한 절세 방법을 알려드리며, 실무에서 바로 사용할 수 있는 팁들이 가득합니다!', 52, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID13' AND parent_id IS NULL OFFSET 1 LIMIT 1)),

-- 세 번째 질문에 대한 답변
('실제강의ID13', 'instructor004', '네! 20년간 다양한 고객들의 절세 사례를 바탕으로 한 구체적인 사례들이 많이 나옵니다. 개인, 법인, 상속 등 다양한 상황별 절세 전략을 다루고 있어요!', 61, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID13' AND parent_id IS NULL OFFSET 2 LIMIT 1)),

-- 네 번째 질문에 대한 답변들
('실제강의ID13', 'instructor004', '절세 전략을 제대로 적용하면 연간 10-30% 정도 세금을 줄일 수 있습니다! 강의에서 "효과적인 절세 전략"을 단계별로 알려드리며, 개인 상황에 맞는 맞춤형 방법을 제시합니다!', 69, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID13' AND parent_id IS NULL OFFSET 3 LIMIT 1)),
('실제강의ID13', 'member033', '저도 절세 전략 적용해서 연간 25% 세금 절약했습니다! 실무에 바로 적용 가능한 팁들이 정말 많았어요.', 38, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID13' AND parent_id IS NULL OFFSET 3 LIMIT 1)),

-- 다섯 번째 질문에 대한 답변
('실제강의ID13', 'instructor004', '네! 실무에 바로 적용 가능한 절세 팁들이 정말 많습니다. 특히 연말정산, 부동산 절세, 투자 절세 등 실생활에 바로 적용할 수 있는 방법들을 구체적으로 다루고 있어요!', 44, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID13' AND parent_id IS NULL OFFSET 4 LIMIT 1));

-- 창업사업 강의 답변들
INSERT INTO public.lecture_qna (lecture_id, member_user_id, content, likes, answers_count, parent_id) VALUES
-- 첫 번째 질문에 대한 답변들
('실제강의ID25', 'instructor005', '네! 1인 창업을 시작할 수 있도록 아이디어부터 수익화까지 모든 과정을 구체적으로 알려드립니다. 특히 "1인 창업 성공 로드맵"이 정말 체계적으로 잘 되어있어서 따라하기 쉽습니다!', 82, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID25' AND parent_id IS NULL LIMIT 1)),
('실제강의ID25', 'member034', '저도 이 강의 듣고 온라인 쇼핑몰 창업했습니다! 지금은 월 200만원 수익 나고 있어요. 강사님이 알려주신 방법대로 하니까 정말 성공할 수 있었습니다.', 51, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID25' AND parent_id IS NULL LIMIT 1)),

-- 두 번째 질문에 대한 답변
('실제강의ID25', 'instructor005', '네! 아이디어부터 수익화까지 완벽한 가이드입니다. 20년간 다양한 1인 창업을 성공시킨 경험을 바탕으로 한 실전 노하우를 모두 공개합니다!', 58, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID25' AND parent_id IS NULL OFFSET 1 LIMIT 1)),

-- 세 번째 질문에 대한 답변들
('실제강의ID25', 'instructor005', '네! 20년간 성공시킨 다양한 1인 창업 사례들이 가득합니다. 온라인 쇼핑몰, 유튜브, 블로그, 프리랜서 등 다양한 분야의 성공 사례를 구체적으로 다루고 있어요!', 71, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID25' AND parent_id IS NULL OFFSET 2 LIMIT 1)),
('실제강의ID25', 'member035', '저도 이 강의 듣고 유튜브 채널 시작했는데, 지금은 월 150만원 수익 나고 있어요! 성공 사례들이 정말 도움이 되었습니다.', 39, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID25' AND parent_id IS NULL OFFSET 2 LIMIT 1)),

-- 네 번째 질문에 대한 답변
('실제강의ID25', 'instructor005', '네! 창업 초기 자금이 적어도 시작할 수 있는 방법을 구체적으로 알려드립니다. 특히 "제로원 창업 전략"에서 최소 자금으로 시작하는 방법을 상세히 다루고 있어요!', 46, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID25' AND parent_id IS NULL OFFSET 3 LIMIT 1)),

-- 다섯 번째 질문에 대한 답변
('실제강의ID25', 'instructor005', '네! 온라인 쇼핑몰 창업에 특화된 강의도 별도로 제공하고 있습니다. 15년 경력의 전문가가 알려주는 온라인 쇼핑몰 운영 노하우를 모두 배우실 수 있어요!', 53, 0, (SELECT id FROM public.lecture_qna WHERE lecture_id = '실제강의ID25' AND parent_id IS NULL OFFSET 4 LIMIT 1));

-- 샘플 쿼리 예시
-- 1. 강의별 Q&A 수 조회
-- SELECT 
--   l.title,
--   l.category,
--   COUNT(q.id) as total_qna,
--   COUNT(CASE WHEN q.parent_id IS NULL THEN 1 END) as questions,
--   COUNT(CASE WHEN q.parent_id IS NOT NULL THEN 1 END) as answers
-- FROM public.lectures l
-- LEFT JOIN public.lecture_qna q ON l.id = q.lecture_id
-- WHERE l.status = '사용'
-- GROUP BY l.id, l.title, l.category
-- ORDER BY total_qna DESC;

-- 2. 특정 강의의 질문과 답변 조회 (최신순)
-- SELECT 
--   q.*,
--   CASE WHEN q.parent_id IS NULL THEN '질문' ELSE '답변' END as type
-- FROM public.lecture_qna q
-- WHERE q.lecture_id = '실제강의ID'
-- ORDER BY q.created_at DESC;

-- 3. 질문별 답변 수와 좋아요 수 통계
-- SELECT 
--   q.id,
--   q.content,
--   q.likes,
--   q.answers_count,
--   COUNT(a.id) as actual_answers
-- FROM public.lecture_qna q
-- LEFT JOIN public.lecture_qna a ON q.id = a.parent_id
-- WHERE q.parent_id IS NULL
-- GROUP BY q.id, q.content, q.likes, q.answers_count
-- ORDER BY q.likes DESC;

-- 4. 카테고리별 Q&A 통계
-- SELECT 
--   l.category,
--   COUNT(q.id) as total_qna,
--   AVG(q.likes) as avg_likes
-- FROM public.lectures l
-- LEFT JOIN public.lecture_qna q ON l.id = q.lecture_id
-- WHERE l.status = '사용'
-- GROUP BY l.category
-- ORDER BY total_qna DESC;

-- 5. 최근 Q&A 조회 (좋아요 순)
-- SELECT 
--   q.*,
--   l.title as lecture_title,
--   l.category
-- FROM public.lecture_qna q
-- JOIN public.lectures l ON q.lecture_id = l.id
-- ORDER BY q.likes DESC, q.created_at DESC 
-- LIMIT 10; 