-- =============================================
-- 부자놀이터 댓글 테이블 생성 스크립트
-- =============================================

-- 1. community_comments 테이블 생성
CREATE TABLE IF NOT EXISTS community_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL,
    parent_comment_id UUID NULL, -- 대댓글인 경우 부모 댓글 ID
    member_user_id VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 외래키 제약조건
    CONSTRAINT fk_community_comments_post_id 
        FOREIGN KEY (post_id) 
        REFERENCES community_posts(id) 
        ON DELETE CASCADE,
    
    -- 대댓글의 경우 부모 댓글 참조
    CONSTRAINT fk_community_comments_parent_id 
        FOREIGN KEY (parent_comment_id) 
        REFERENCES community_comments(id) 
        ON DELETE CASCADE,
    
    -- 내용은 필수이며 빈 문자열 불가
    CONSTRAINT chk_community_comments_content_not_empty 
        CHECK (LENGTH(TRIM(content)) > 0),
    
    -- 좋아요 수는 0 이상
    CONSTRAINT chk_community_comments_likes_positive 
        CHECK (likes >= 0)
);

-- 2. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_parent_id ON community_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_member_user_id ON community_comments(member_user_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_created_at ON community_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_comments_deleted ON community_comments(is_deleted, created_at DESC);

-- 3. 자동 업데이트 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_community_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. 트리거 생성
CREATE TRIGGER trigger_update_community_comments_updated_at
    BEFORE UPDATE ON community_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_community_comments_updated_at();

-- 5. RLS (Row Level Security) 정책 설정
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 댓글을 조회할 수 있음 (삭제되지 않은 댓글만)
CREATE POLICY "Anyone can view non-deleted comments" ON community_comments
    FOR SELECT USING (is_deleted = FALSE);

-- 인증된 사용자만 댓글을 작성할 수 있음
CREATE POLICY "Authenticated users can insert comments" ON community_comments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 작성자만 자신의 댓글을 수정할 수 있음
CREATE POLICY "Users can update their own comments" ON community_comments
    FOR UPDATE USING (auth.uid()::text = member_user_id);

-- 작성자만 자신의 댓글을 삭제할 수 있음 (실제로는 is_deleted = TRUE로 변경)
CREATE POLICY "Users can delete their own comments" ON community_comments
    FOR UPDATE USING (auth.uid()::text = member_user_id);

-- 6. 테이블 설명 추가
COMMENT ON TABLE community_comments IS '부자놀이터 게시글 댓글 테이블';
COMMENT ON COLUMN community_comments.id IS '댓글 고유 ID';
COMMENT ON COLUMN community_comments.post_id IS '게시글 ID (community_posts 참조)';
COMMENT ON COLUMN community_comments.parent_comment_id IS '부모 댓글 ID (대댓글인 경우)';
COMMENT ON COLUMN community_comments.member_user_id IS '작성자 ID (members 테이블의 user_id 참조)';
COMMENT ON COLUMN community_comments.content IS '댓글 내용';
COMMENT ON COLUMN community_comments.likes IS '좋아요 수';
COMMENT ON COLUMN community_comments.is_deleted IS '삭제 여부 (소프트 삭제)';
COMMENT ON COLUMN community_comments.created_at IS '작성일시';
COMMENT ON COLUMN community_comments.updated_at IS '수정일시';

-- =============================================
-- 테이블 구조 확인
-- =============================================
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'community_comments' 
ORDER BY ordinal_position; 