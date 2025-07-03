-- =============================================
-- 부자놀이터 댓글 샘플 데이터 삽입 스크립트
-- =============================================

-- 주의: 이 스크립트를 실행하기 전에 community_posts 테이블에 게시글이 있어야 합니다.

-- 1. 기존 샘플 댓글 데이터 삭제 (재실행 시)
DELETE FROM community_comments WHERE member_user_id IN ('재테크마스터', '주식초보', '투자왕', '투자고수', '부동산전문가');

-- 2. 샘플 댓글 데이터 삽입
-- 첫 번째 게시글에 대한 댓글들
INSERT INTO community_comments (id, post_id, parent_comment_id, member_user_id, content, likes, created_at) VALUES
-- 일반 댓글
('11111111-1111-1111-1111-111111111111', 
 (SELECT id FROM community_posts LIMIT 1), 
 NULL, 
 '재테크마스터', 
 '정말 유용한 정보네요! 특히 리스크 관리 부분이 인상적입니다. 저도 분산투자의 중요성을 늘 강조하는데, 이렇게 체계적으로 정리해주시니 초보자분들께 큰 도움이 될 것 같습니다.', 
 15, 
 NOW() - INTERVAL '2 hours'),

('22222222-2222-2222-2222-222222222222', 
 (SELECT id FROM community_posts LIMIT 1), 
 NULL, 
 '주식초보', 
 '초보자 입장에서 정말 이해하기 쉽게 설명해주셨네요. 감사합니다! 특히 PER, PBR 같은 지표들이 어려웠는데 이제 조금 이해가 됩니다. 추가로 질문이 있는데, 처음 투자할 때 얼마 정도부터 시작하는 게 좋을까요?', 
 8, 
 NOW() - INTERVAL '1 hour 30 minutes'),

('33333333-3333-3333-3333-333333333333', 
 (SELECT id FROM community_posts LIMIT 1), 
 NULL, 
 '투자왕', 
 'PER, PBR 관련해서 더 자세한 설명이 있으면 좋겠어요. 특히 업종별로 적정 PER이 다른데, 이런 부분도 다뤄주시면 감사하겠습니다.', 
 5, 
 NOW() - INTERVAL '45 minutes'),

-- 대댓글들
('44444444-4444-4444-4444-444444444444', 
 (SELECT id FROM community_posts LIMIT 1), 
 '11111111-1111-1111-1111-111111111111', 
 '투자고수', 
 '감사합니다! 리스크 관리가 정말 중요하죠. 많은 분들이 수익만 생각하시는데, 손실 관리가 더 중요하다고 생각합니다.', 
 3, 
 NOW() - INTERVAL '1 hour 45 minutes'),

('55555555-5555-5555-5555-555555555555', 
 (SELECT id FROM community_posts LIMIT 1), 
 '22222222-2222-2222-2222-222222222222', 
 '투자고수', 
 '좋은 질문이네요! 처음에는 100만원 정도로 시작해서 경험을 쌓으시는 것을 추천드립니다. 무엇보다 잃어도 괜찮은 금액으로 시작하는 게 중요해요.', 
 7, 
 NOW() - INTERVAL '1 hour 15 minutes'),

('66666666-6666-6666-6666-666666666666', 
 (SELECT id FROM community_posts LIMIT 1), 
 '33333333-3333-3333-3333-333333333333', 
 '부동산전문가', 
 '업종별 PER은 정말 중요한 포인트입니다. IT는 보통 20-30, 제조업은 10-15 정도가 적정선이라고 보시면 됩니다. 다만 성장성도 함께 고려해야 해요.', 
 4, 
 NOW() - INTERVAL '30 minutes');

-- 3. 두 번째 게시글에 대한 댓글 (있다면)
INSERT INTO community_comments (id, post_id, parent_comment_id, member_user_id, content, likes, created_at) 
SELECT 
    '77777777-7777-7777-7777-777777777777',
    p.id,
    NULL,
    '재테크마스터',
    '부동산과 주식의 비교 분석이 정말 객관적이네요. 요즘 같은 시기에는 분산투자가 더욱 중요한 것 같습니다.',
    12,
    NOW() - INTERVAL '3 hours'
FROM community_posts p 
WHERE p.id != (SELECT id FROM community_posts LIMIT 1) 
LIMIT 1;

-- 4. 댓글 개수 업데이트 (community_posts 테이블의 answers_count 필드)
UPDATE community_posts 
SET answers_count = (
    SELECT COUNT(*) 
    FROM community_comments 
    WHERE community_comments.post_id = community_posts.id 
    AND community_comments.is_deleted = FALSE
);

-- =============================================
-- 결과 확인 쿼리
-- =============================================

-- 댓글과 대댓글 구조 확인
SELECT 
    c.id,
    c.post_id,
    c.parent_comment_id,
    c.member_user_id,
    LEFT(c.content, 50) || '...' as content_preview,
    c.likes,
    c.created_at,
    CASE 
        WHEN c.parent_comment_id IS NULL THEN '댓글'
        ELSE '대댓글'
    END as comment_type
FROM community_comments c
ORDER BY c.post_id, c.created_at, c.parent_comment_id NULLS FIRST;

-- 게시글별 댓글 개수 확인
SELECT 
    p.title,
    p.answers_count as stored_count,
    COUNT(c.id) as actual_count
FROM community_posts p
LEFT JOIN community_comments c ON p.id = c.post_id AND c.is_deleted = FALSE
GROUP BY p.id, p.title, p.answers_count
ORDER BY p.created_at DESC; 