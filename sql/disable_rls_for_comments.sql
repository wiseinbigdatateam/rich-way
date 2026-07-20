-- =============================================
-- RLS 정책 비활성화 (개발 환경용)
-- =============================================

-- 1. community_comments 테이블의 RLS 비활성화
ALTER TABLE community_comments DISABLE ROW LEVEL SECURITY;

-- 2. community_post_likes 테이블의 RLS 비활성화 (필요시)
ALTER TABLE community_post_likes DISABLE ROW LEVEL SECURITY;

-- 3. community_comment_likes 테이블의 RLS 비활성화 (필요시)
ALTER TABLE community_comment_likes DISABLE ROW LEVEL SECURITY;

-- 4. community_posts 테이블의 RLS 비활성화 (필요시)
ALTER TABLE community_posts DISABLE ROW LEVEL SECURITY;

-- 확인
SELECT 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'community_%'; 