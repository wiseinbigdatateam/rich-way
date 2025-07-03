-- 개발 중 RLS를 임시로 비활성화하는 SQL
-- ⚠️ 주의: 프로덕션 환경에서는 사용하지 마세요!

-- 모든 테이블의 RLS 비활성화
ALTER TABLE members DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_post_likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_comment_likes DISABLE ROW LEVEL SECURITY;

-- 기존 정책들 삭제 (필요시)
DROP POLICY IF EXISTS "Users can view own profile" ON members;
DROP POLICY IF EXISTS "Users can update own profile" ON members;
DROP POLICY IF EXISTS "Admins can view all profiles" ON members;

DROP POLICY IF EXISTS "Anyone can view posts" ON community_posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON community_posts;
DROP POLICY IF EXISTS "Users can update own posts" ON community_posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON community_posts;

DROP POLICY IF EXISTS "Anyone can view comments" ON community_comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON community_comments;
DROP POLICY IF EXISTS "Users can update own comments" ON community_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON community_comments;

-- 확인 메시지
SELECT 'RLS has been disabled for development. Remember to re-enable for production!' AS warning; 