-- =============================================
-- 좋아요 샘플 데이터 삽입 스크립트
-- =============================================

-- 1. 기존 좋아요 데이터 삭제 (재실행 시)
DELETE FROM community_comment_likes;
DELETE FROM community_post_likes;

-- 2. 게시글 좋아요 샘플 데이터 삽입
-- 첫 번째 게시글 (투자 가이드)에 여러 좋아요
INSERT INTO community_post_likes (post_id, member_user_id) VALUES
((SELECT id FROM community_posts WHERE title LIKE '%투자 초보자를 위한%' LIMIT 1), 'kerow@hanmail.net'),
((SELECT id FROM community_posts WHERE title LIKE '%투자 초보자를 위한%' LIMIT 1), '재테크마스터'),
((SELECT id FROM community_posts WHERE title LIKE '%투자 초보자를 위한%' LIMIT 1), '주식초보'),
((SELECT id FROM community_posts WHERE title LIKE '%투자 초보자를 위한%' LIMIT 1), '부동산왕'),
((SELECT id FROM community_posts WHERE title LIKE '%투자 초보자를 위한%' LIMIT 1), '코인투자자');

-- 두 번째 게시글 (부동산 vs 주식)에 좋아요
INSERT INTO community_post_likes (post_id, member_user_id) VALUES
((SELECT id FROM community_posts WHERE title LIKE '%부동산 vs 주식%' LIMIT 1), 'kerow@hanmail.net'),
((SELECT id FROM community_posts WHERE title LIKE '%부동산 vs 주식%' LIMIT 1), '재테크마스터'),
((SELECT id FROM community_posts WHERE title LIKE '%부동산 vs 주식%' LIMIT 1), '투자고수');

-- 세 번째 게시글 (재테크 성공담)에 좋아요
INSERT INTO community_post_likes (post_id, member_user_id) VALUES
((SELECT id FROM community_posts WHERE title LIKE '%재테크 성공담%' LIMIT 1), '주식초보'),
((SELECT id FROM community_posts WHERE title LIKE '%재테크 성공담%' LIMIT 1), '부동산왕'),
((SELECT id FROM community_posts WHERE title LIKE '%재테크 성공담%' LIMIT 1), '코인투자자'),
((SELECT id FROM community_posts WHERE title LIKE '%재테크 성공담%' LIMIT 1), '창업가'),
((SELECT id FROM community_posts WHERE title LIKE '%재테크 성공담%' LIMIT 1), '경제분석가');

-- 네 번째 게시글 (코인 실패담)에 좋아요
INSERT INTO community_post_likes (post_id, member_user_id) VALUES
((SELECT id FROM community_posts WHERE title LIKE '%코인 투자 실패담%' LIMIT 1), 'kerow@hanmail.net'),
((SELECT id FROM community_posts WHERE title LIKE '%코인 투자 실패담%' LIMIT 1), '재테크마스터');

-- 다섯 번째 게시글 (펀드 질문)에 좋아요
INSERT INTO community_post_likes (post_id, member_user_id) VALUES
((SELECT id FROM community_posts WHERE title LIKE '%펀드 투자%' LIMIT 1), '투자고수'),
((SELECT id FROM community_posts WHERE title LIKE '%펀드 투자%' LIMIT 1), '주식초보'),
((SELECT id FROM community_posts WHERE title LIKE '%펀드 투자%' LIMIT 1), '부동산왕');

-- 3. 댓글 좋아요 샘플 데이터 삽입
-- 분산투자 관련 댓글에 좋아요
INSERT INTO community_comment_likes (comment_id, member_user_id) VALUES
((SELECT id FROM community_comments WHERE content LIKE '%분산투자가 정말 중요%' LIMIT 1), 'kerow@hanmail.net'),
((SELECT id FROM community_comments WHERE content LIKE '%분산투자가 정말 중요%' LIMIT 1), '주식초보'),
((SELECT id FROM community_comments WHERE content LIKE '%분산투자가 정말 중요%' LIMIT 1), '부동산왕');

-- PER/PBR 관련 댓글에 좋아요
INSERT INTO community_comment_likes (comment_id, member_user_id) VALUES
((SELECT id FROM community_comments WHERE content LIKE '%PER 15배 이하%' LIMIT 1), '재테크마스터'),
((SELECT id FROM community_comments WHERE content LIKE '%PER 15배 이하%' LIMIT 1), '투자고수');

-- 강남 부동산 관련 댓글에 좋아요
INSERT INTO community_comment_likes (comment_id, member_user_id) VALUES
((SELECT id FROM community_comments WHERE content LIKE '%강남은 아직도%' LIMIT 1), 'kerow@hanmail.net'),
((SELECT id FROM community_comments WHERE content LIKE '%강남은 아직도%' LIMIT 1), '코인투자자'),
((SELECT id FROM community_comments WHERE content LIKE '%강남은 아직도%' LIMIT 1), '창업가');

-- 삼성전자 관련 댓글에 좋아요
INSERT INTO community_comment_likes (comment_id, member_user_id) VALUES
((SELECT id FROM community_comments WHERE content LIKE '%삼성전자는 배당주로%' LIMIT 1), '재테크마스터'),
((SELECT id FROM community_comments WHERE content LIKE '%삼성전자는 배당주로%' LIMIT 1), '주식초보');

-- 비트코인 관련 댓글에 좋아요
INSERT INTO community_comment_likes (comment_id, member_user_id) VALUES
((SELECT id FROM community_comments WHERE content LIKE '%비트코인 ETF 승인%' LIMIT 1), '투자고수'),
((SELECT id FROM community_comments WHERE content LIKE '%비트코인 ETF 승인%' LIMIT 1), '부동산왕'),
((SELECT id FROM community_comments WHERE content LIKE '%비트코인 ETF 승인%' LIMIT 1), '경제분석가');

-- 카페 창업 관련 댓글에 좋아요
INSERT INTO community_comment_likes (comment_id, member_user_id) VALUES
((SELECT id FROM community_comments WHERE content LIKE '%카페 창업은 정말%' LIMIT 1), 'kerow@hanmail.net'),
((SELECT id FROM community_comments WHERE content LIKE '%카페 창업은 정말%' LIMIT 1), '코인투자자');

-- 20대 재테크 관련 댓글에 좋아요
INSERT INTO community_comment_likes (comment_id, member_user_id) VALUES
((SELECT id FROM community_comments WHERE content LIKE '%20대는 주식 위주로%' LIMIT 1), '재테크마스터'),
((SELECT id FROM community_comments WHERE content LIKE '%20대는 주식 위주로%' LIMIT 1), '투자고수'),
((SELECT id FROM community_comments WHERE content LIKE '%20대는 주식 위주로%' LIMIT 1), '주식초보');

-- 1억 모으기 관련 댓글에 좋아요
INSERT INTO community_comment_likes (comment_id, member_user_id) VALUES
((SELECT id FROM community_comments WHERE content LIKE '%정말 부럽습니다%' LIMIT 1), '부동산왕'),
((SELECT id FROM community_comments WHERE content LIKE '%정말 부럽습니다%' LIMIT 1), '코인투자자'),
((SELECT id FROM community_comments WHERE content LIKE '%정말 부럽습니다%' LIMIT 1), '창업가'),
((SELECT id FROM community_comments WHERE content LIKE '%정말 부럽습니다%' LIMIT 1), '경제분석가');

-- 경제 상황 관련 댓글에 좋아요
INSERT INTO community_comment_likes (comment_id, member_user_id) VALUES
((SELECT id FROM community_comments WHERE content LIKE '%요즘 경제가 어려워서%' LIMIT 1), 'kerow@hanmail.net'),
((SELECT id FROM community_comments WHERE content LIKE '%요즘 경제가 어려워서%' LIMIT 1), '재테크마스터'),
((SELECT id FROM community_comments WHERE content LIKE '%요즘 경제가 어려워서%' LIMIT 1), '투자고수');

-- =============================================
-- 결과 확인
-- =============================================

-- 게시글별 좋아요 수 확인
SELECT 
    cp.title,
    cp.likes as current_likes,
    COUNT(cpl.id) as actual_likes
FROM community_posts cp
LEFT JOIN community_post_likes cpl ON cp.id = cpl.post_id
GROUP BY cp.id, cp.title, cp.likes
ORDER BY actual_likes DESC;

-- 댓글별 좋아요 수 확인
SELECT 
    LEFT(cc.content, 50) as comment_preview,
    cc.likes as current_likes,
    COUNT(ccl.id) as actual_likes
FROM community_comments cc
LEFT JOIN community_comment_likes ccl ON cc.id = ccl.comment_id
GROUP BY cc.id, cc.content, cc.likes
HAVING COUNT(ccl.id) > 0
ORDER BY actual_likes DESC;

-- 전체 좋아요 통계
SELECT 
    '게시글 좋아요' as type,
    COUNT(*) as total_count
FROM community_post_likes
UNION ALL
SELECT 
    '댓글 좋아요' as type,
    COUNT(*) as total_count
FROM community_comment_likes; 