-- =============================================
-- 부자놀이터 현실적인 댓글 샘플 데이터
-- =============================================

-- 기존 샘플 댓글 삭제
DELETE FROM community_comments;

-- 게시글별 댓글 데이터 삽입
-- 1. 투자정보 카테고리 게시글 댓글들
INSERT INTO community_comments (post_id, parent_comment_id, member_user_id, content, likes, created_at) 
SELECT 
    p.id, NULL, '재테크마스터',
    '정말 유용한 정보네요! 특히 분산투자 부분이 인상적입니다. 저도 포트폴리오를 다시 점검해봐야겠어요.',
    23, NOW() - INTERVAL '3 hours'
FROM community_posts p WHERE p.category = '투자정보' LIMIT 1;

INSERT INTO community_comments (post_id, parent_comment_id, member_user_id, content, likes, created_at) 
SELECT 
    p.id, NULL, '주식초보123',
    '초보자 입장에서 정말 이해하기 쉽게 설명해주셨네요! PER, PBR 같은 지표들이 어려웠는데 많은 도움이 됐습니다. 혹시 추천하시는 증권사나 MTS 앱이 있나요?',
    15, NOW() - INTERVAL '2 hours 30 minutes'
FROM community_posts p WHERE p.category = '투자정보' LIMIT 1;

INSERT INTO community_comments (post_id, parent_comment_id, member_user_id, content, likes, created_at) 
SELECT 
    p.id, NULL, '투자왕김부자',
    '좋은 글이네요. 다만 요즘 같은 고금리 시대에는 채권 비중도 고려해볼만 합니다. 특히 국고채 3년물 수익률이 괜찮더라고요.',
    8, NOW() - INTERVAL '2 hours'
FROM community_posts p WHERE p.category = '투자정보' LIMIT 1;

-- 대댓글 추가
INSERT INTO community_comments (post_id, parent_comment_id, member_user_id, content, likes, created_at) 
SELECT 
    p.id, c.id, '글쓴이',
    '@주식초보123 증권사는 수수료 낮은 곳으로 추천드려요. 키움, 미래에셋, NH투자증권 정도가 괜찮습니다!',
    5, NOW() - INTERVAL '2 hours'
FROM community_posts p 
JOIN community_comments c ON p.id = c.post_id 
WHERE p.category = '투자정보' AND c.member_user_id = '주식초보123' LIMIT 1;

-- 2. 부동산 카테고리 게시글 댓글들
INSERT INTO community_comments (post_id, parent_comment_id, member_user_id, content, likes, created_at) 
SELECT 
    p.id, NULL, '부동산전문가',
    '부동산 vs 주식 비교 분석이 정말 객관적이네요. 요즘 같은 시기에는 둘 다 어려운 게 현실이죠. 분산투자가 답인 것 같습니다.',
    18, NOW() - INTERVAL '4 hours'
FROM community_posts p WHERE p.category = '부동산' LIMIT 1;

INSERT INTO community_comments (post_id, parent_comment_id, member_user_id, content, likes, created_at) 
SELECT 
    p.id, NULL, '아파트투자자',
    '지금 아파트 매수 타이밍이 맞을까요? 금리가 너무 높아서 고민이 많습니다. 혹시 지역별로 추천하시는 곳이 있나요?',
    12, NOW() - INTERVAL '3 hours 15 minutes'
FROM community_posts p WHERE p.category = '부동산' LIMIT 1;

INSERT INTO community_comments (post_id, parent_comment_id, member_user_id, content, likes, created_at) 
SELECT 
    p.id, NULL, '똘똘한한채',
    '똘똘한 한 채 vs 여러 채 고민이 많네요. 요즘 세금 정책도 자주 바뀌고... 정말 어려운 시대입니다.',
    9, NOW() - INTERVAL '2 hours 45 minutes'
FROM community_posts p WHERE p.category = '부동산' LIMIT 1;

-- 3. 주식 카테고리 게시글 댓글들
INSERT INTO community_comments (post_id, parent_comment_id, member_user_id, content, likes, created_at) 
SELECT 
    p.id, NULL, '삼성전자홀더',
    '삼성전자 장기보유 중인데 정말 답답하네요 ㅠㅠ 그래도 배당은 꾸준히 주니까 버티고 있습니다.',
    25, NOW() - INTERVAL '1 hour 30 minutes'
FROM community_posts p WHERE p.category = '주식' LIMIT 1;

INSERT INTO community_comments (post_id, parent_comment_id, member_user_id, content, likes, created_at) 
SELECT 
    p.id, NULL, '코스닥개미',
    '코스닥 종목 추천해주세요! 이차전지, 바이오 쪽으로 관심이 많은데 어떤 종목이 유망할까요?',
    7, NOW() - INTERVAL '1 hour'
FROM community_posts p WHERE p.category = '주식' LIMIT 1;

INSERT INTO community_comments (post_id, parent_comment_id, member_user_id, content, likes, created_at) 
SELECT 
    p.id, NULL, '가치투자자',
    '기술적 분석보다는 기업의 펀더멘털이 중요하다고 생각합니다. ROE, 부채비율, 영업이익률 등을 꼼꼼히 봐야죠.',
    14, NOW() - INTERVAL '45 minutes'
FROM community_posts p WHERE p.category = '주식' LIMIT 1;

-- 4. 암호화폐 카테고리 게시글 댓글들
INSERT INTO community_comments (post_id, parent_comment_id, member_user_id, content, likes, created_at) 
SELECT 
    p.id, NULL, '비트코인맥시',
    '비트코인은 디지털 금이라고 생각합니다. 장기적으로는 분명 상승할 거예요. 다만 변동성이 크니까 여유자금으로만!',
    20, NOW() - INTERVAL '5 hours'
FROM community_posts p WHERE p.category = '암호화폐' LIMIT 1;

INSERT INTO community_comments (post_id, parent_comment_id, member_user_id, content, likes, created_at) 
SELECT 
    p.id, NULL, '알트코인러버',
    '이더리움, 솔라나 어떻게 보시나요? NFT 시장이 다시 살아나면서 관련 코인들도 관심받을 것 같은데...',
    11, NOW() - INTERVAL '4 hours 20 minutes'
FROM community_posts p WHERE p.category = '암호화폐' LIMIT 1;

INSERT INTO community_comments (post_id, parent_comment_id, member_user_id, content, likes, created_at) 
SELECT 
    p.id, NULL, '코인실패자',
    '작년에 코인으로 큰 손실 봤습니다 ㅠㅠ 정말 조심하세요. 절대 빌려서 투자하지 마시고, 잃어도 괜찮은 돈으로만 하세요.',
    16, NOW() - INTERVAL '3 hours 30 minutes'
FROM community_posts p WHERE p.category = '암호화폐' LIMIT 1;

-- 5. 창업 카테고리 게시글 댓글들
INSERT INTO community_comments (post_id, parent_comment_id, member_user_id, content, likes, created_at) 
SELECT 
    p.id, NULL, '예비창업가',
    '창업 준비 중인데 정말 도움되는 글이네요! 특히 초기 자금 조달 부분이 궁금했는데 많이 배웠습니다.',
    13, NOW() - INTERVAL '2 hours 15 minutes'
FROM community_posts p WHERE p.category = '창업' LIMIT 1;

INSERT INTO community_comments (post_id, parent_comment_id, member_user_id, content, likes, created_at) 
SELECT 
    p.id, NULL, '카페사장',
    '카페 창업 3년차입니다. 정말 쉽지 않네요. 임대료, 인건비, 재료비... 모든 게 다 올랐어요. 그래도 포기하지 않고 열심히 하고 있습니다!',
    19, NOW() - INTERVAL '1 hour 45 minutes'
FROM community_posts p WHERE p.category = '창업' LIMIT 1;

-- 6. 질문답변 카테고리 게시글 댓글들
INSERT INTO community_comments (post_id, parent_comment_id, member_user_id, content, likes, created_at) 
SELECT 
    p.id, NULL, '재테크전문가',
    '20대 재테크는 정말 중요합니다! 복리의 마법을 경험하려면 일찍 시작하는 게 최고예요. 적금부터 시작해서 점진적으로 투자 비중을 늘려가세요.',
    22, NOW() - INTERVAL '3 hours 45 minutes'
FROM community_posts p WHERE p.category = '질문답변' LIMIT 1;

INSERT INTO community_comments (post_id, parent_comment_id, member_user_id, content, likes, created_at) 
SELECT 
    p.id, NULL, '20대직장인',
    '저도 비슷한 고민 중이에요! 월 100만원 정도 저축하고 있는데, 어떻게 배분하는 게 좋을까요? 적금 50, 투자 50 이렇게?',
    8, NOW() - INTERVAL '2 hours 30 minutes'
FROM community_posts p WHERE p.category = '질문답변' LIMIT 1;

-- 7. 성공사례 카테고리 게시글 댓글들
INSERT INTO community_comments (post_id, parent_comment_id, member_user_id, content, likes, created_at) 
SELECT 
    p.id, NULL, '부러운사람',
    '와... 정말 대단하시네요! 10년만에 1억이라니... 저도 따라해보겠습니다. 혹시 구체적인 포트폴리오 비율 알려주실 수 있나요?',
    31, NOW() - INTERVAL '6 hours'
FROM community_posts p WHERE p.category = '성공사례' LIMIT 1;

INSERT INTO community_comments (post_id, parent_comment_id, member_user_id, content, likes, created_at) 
SELECT 
    p.id, NULL, '절약왕자',
    '절약의 힘이 정말 크네요. 저도 가계부 쓰기 시작했는데 새는 돈이 정말 많더라고요. 작은 것부터 실천해야겠어요!',
    17, NOW() - INTERVAL '4 hours 30 minutes'
FROM community_posts p WHERE p.category = '성공사례' LIMIT 1;

-- 8. 자유게시판 카테고리 게시글 댓글들
INSERT INTO community_comments (post_id, parent_comment_id, member_user_id, content, likes, created_at) 
SELECT 
    p.id, NULL, '일반인',
    '요즘 경제 상황이 정말 어렵네요. 물가는 오르고 금리는 높고... 서민들은 어떻게 살라는 건지 ㅠㅠ',
    24, NOW() - INTERVAL '1 hour 20 minutes'
FROM community_posts p WHERE p.category = '자유게시판' LIMIT 1;

INSERT INTO community_comments (post_id, parent_comment_id, member_user_id, content, likes, created_at) 
SELECT 
    p.id, NULL, '긍정맨',
    '힘든 시기지만 이럴 때일수록 기회를 찾아야 한다고 생각해요! 위기가 곧 기회라고 하잖아요. 모두 화이팅!',
    12, NOW() - INTERVAL '50 minutes'
FROM community_posts p WHERE p.category = '자유게시판' LIMIT 1;

-- 추가 대댓글들
INSERT INTO community_comments (post_id, parent_comment_id, member_user_id, content, likes, created_at) 
SELECT 
    p.id, c.id, '부동산전문가',
    '@아파트투자자 지금은 관망하시는 게 좋을 것 같아요. 내년 상반기쯤 되면 상황이 좀 더 명확해질 것 같습니다.',
    6, NOW() - INTERVAL '2 hours 30 minutes'
FROM community_posts p 
JOIN community_comments c ON p.id = c.post_id 
WHERE p.category = '부동산' AND c.member_user_id = '아파트투자자' LIMIT 1;

INSERT INTO community_comments (post_id, parent_comment_id, member_user_id, content, likes, created_at) 
SELECT 
    p.id, c.id, '삼성전자홀더',
    '@코스닥개미 이차전지는 LG에너지솔루션, 바이오는 셀트리온 계열 어떠신가요? 다만 변동성 크니까 조심하세요!',
    4, NOW() - INTERVAL '45 minutes'
FROM community_posts p 
JOIN community_comments c ON p.id = c.post_id 
WHERE p.category = '주식' AND c.member_user_id = '코스닥개미' LIMIT 1;

-- 게시글별 댓글 개수 업데이트
UPDATE community_posts 
SET answers_count = (
    SELECT COUNT(*) 
    FROM community_comments 
    WHERE community_comments.post_id = community_posts.id 
    AND community_comments.is_deleted = FALSE
);

-- =============================================
-- 결과 확인
-- =============================================
SELECT 
    p.category,
    p.title,
    p.answers_count,
    COUNT(c.id) as actual_comments
FROM community_posts p
LEFT JOIN community_comments c ON p.id = c.post_id AND c.is_deleted = FALSE
GROUP BY p.id, p.category, p.title, p.answers_count
ORDER BY p.created_at DESC;

-- 댓글 내용 미리보기
SELECT 
    p.category,
    LEFT(p.title, 30) || '...' as post_title,
    c.member_user_id,
    LEFT(c.content, 50) || '...' as comment_preview,
    c.likes,
    CASE 
        WHEN c.parent_comment_id IS NULL THEN '댓글'
        ELSE '대댓글'
    END as type
FROM community_posts p
JOIN community_comments c ON p.id = c.post_id
ORDER BY p.category, c.created_at DESC; 