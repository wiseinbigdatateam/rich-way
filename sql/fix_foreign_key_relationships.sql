-- 외래키 관계 수정을 위한 SQL
-- 실행 전에 기존 데이터 백업을 권장합니다.
-- ⚠️ 주의: add_missing_columns.sql을 먼저 실행하세요!

-- 1. community_posts 테이블이 없다면 생성
CREATE TABLE IF NOT EXISTS community_posts (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    answers_count INTEGER DEFAULT 0,
    parent_id INTEGER,
    member_user_id VARCHAR(50) NOT NULL, -- members.user_id를 참조
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ishot BOOLEAN DEFAULT FALSE
);

-- 2. 기존 외래키 제약조건이 있다면 제거
ALTER TABLE community_posts DROP CONSTRAINT IF EXISTS fk_community_posts_member;

-- 3. 올바른 외래키 제약조건 추가
ALTER TABLE community_posts 
ADD CONSTRAINT fk_community_posts_member 
FOREIGN KEY (member_user_id) REFERENCES members(user_id) 
ON DELETE CASCADE ON UPDATE CASCADE;

-- 4. community_comments 테이블의 외래키도 수정
ALTER TABLE community_comments DROP CONSTRAINT IF EXISTS fk_community_comments_member;

ALTER TABLE community_comments 
ADD CONSTRAINT fk_community_comments_member 
FOREIGN KEY (member_user_id) REFERENCES members(user_id) 
ON DELETE CASCADE ON UPDATE CASCADE;

-- 5. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_community_posts_member_user_id ON community_posts(member_user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at);

-- 6. RLS 정책 설정
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 게시글 조회 가능
CREATE POLICY "Anyone can view posts" ON community_posts
    FOR SELECT USING (true);

-- 로그인한 사용자만 게시글 작성 가능
CREATE POLICY "Authenticated users can create posts" ON community_posts
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 작성자만 자신의 게시글 수정/삭제 가능
CREATE POLICY "Users can update own posts" ON community_posts
    FOR UPDATE USING (member_user_id = (SELECT user_id FROM members WHERE id = auth.uid()));

CREATE POLICY "Users can delete own posts" ON community_posts
    FOR DELETE USING (member_user_id = (SELECT user_id FROM members WHERE id = auth.uid()));

-- 7. updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_community_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_community_posts_updated_at 
    BEFORE UPDATE ON community_posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_community_posts_updated_at();

-- 8. 테이블 및 컬럼 설명 추가
COMMENT ON TABLE community_posts IS '커뮤니티 게시글 테이블';
COMMENT ON COLUMN community_posts.member_user_id IS '작성자 ID (members.user_id 참조)';
COMMENT ON COLUMN community_posts.category IS '게시글 카테고리';
COMMENT ON COLUMN community_posts.ishot IS 'HOT 게시글 여부';

-- 실행 완료 메시지
SELECT 'Foreign key relationships have been fixed successfully!' AS status; 