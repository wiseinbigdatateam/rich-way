-- =============================================
-- 부자놀이터 댓글 시스템 빠른 설정
-- =============================================

-- 1. 댓글 테이블 생성
CREATE TABLE IF NOT EXISTS community_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
    member_user_id VARCHAR(100) NOT NULL,
    content TEXT NOT NULL CHECK (LENGTH(TRIM(content)) > 0),
    likes INTEGER DEFAULT 0 CHECK (likes >= 0),
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_parent_id ON community_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_created_at ON community_comments(created_at DESC);

-- 3. 샘플 댓글 데이터 삽입
INSERT INTO community_comments (post_id, member_user_id, content, likes, created_at) 
SELECT 
    p.id,
    '재테크마스터',
    '정말 유용한 정보네요! 특히 리스크 관리 부분이 인상적입니다.',
    15,
    NOW() - INTERVAL '2 hours'
FROM community_posts p LIMIT 1;

INSERT INTO community_comments (post_id, member_user_id, content, likes, created_at) 
SELECT 
    p.id,
    '주식초보',
    '초보자 입장에서 정말 이해하기 쉽게 설명해주셨네요. 감사합니다!',
    8,
    NOW() - INTERVAL '1 hour'
FROM community_posts p LIMIT 1;

INSERT INTO community_comments (post_id, member_user_id, content, likes, created_at) 
SELECT 
    p.id,
    '투자왕',
    'PER, PBR 관련해서 더 자세한 설명이 있으면 좋겠어요.',
    5,
    NOW() - INTERVAL '30 minutes'
FROM community_posts p LIMIT 1;

-- 4. 댓글 개수 업데이트
UPDATE community_posts 
SET answers_count = (
    SELECT COUNT(*) 
    FROM community_comments 
    WHERE community_comments.post_id = community_posts.id 
    AND community_comments.is_deleted = FALSE
);

-- 5. 결과 확인
SELECT 
    p.title,
    p.answers_count,
    c.member_user_id,
    LEFT(c.content, 30) || '...' as content_preview
FROM community_posts p
LEFT JOIN community_comments c ON p.id = c.post_id
ORDER BY p.created_at DESC, c.created_at; 