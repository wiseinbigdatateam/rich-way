-- =============================================
-- 게시글 좋아요 테이블 생성 스크립트
-- =============================================

-- 1. community_post_likes 테이블 생성
CREATE TABLE IF NOT EXISTS community_post_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL,
    member_user_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 외래키 제약조건
    CONSTRAINT fk_post_likes_post_id 
        FOREIGN KEY (post_id) 
        REFERENCES community_posts(id) 
        ON DELETE CASCADE,
    
    -- 한 사용자가 같은 게시글에 중복 좋아요 방지
    CONSTRAINT uq_post_likes_user_post 
        UNIQUE (post_id, member_user_id)
);

-- 2. 댓글 좋아요 테이블 생성
CREATE TABLE IF NOT EXISTS community_comment_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    comment_id UUID NOT NULL,
    member_user_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 외래키 제약조건
    CONSTRAINT fk_comment_likes_comment_id 
        FOREIGN KEY (comment_id) 
        REFERENCES community_comments(id) 
        ON DELETE CASCADE,
    
    -- 한 사용자가 같은 댓글에 중복 좋아요 방지
    CONSTRAINT uq_comment_likes_user_comment 
        UNIQUE (comment_id, member_user_id)
);

-- 3. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON community_post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON community_post_likes(member_user_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON community_comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON community_comment_likes(member_user_id);

-- 4. 좋아요 수 업데이트 함수 생성
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE community_posts 
        SET likes = (
            SELECT COUNT(*) 
            FROM community_post_likes 
            WHERE post_id = NEW.post_id
        )
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE community_posts 
        SET likes = (
            SELECT COUNT(*) 
            FROM community_post_likes 
            WHERE post_id = OLD.post_id
        )
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE community_comments 
        SET likes = (
            SELECT COUNT(*) 
            FROM community_comment_likes 
            WHERE comment_id = NEW.comment_id
        )
        WHERE id = NEW.comment_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE community_comments 
        SET likes = (
            SELECT COUNT(*) 
            FROM community_comment_likes 
            WHERE comment_id = OLD.comment_id
        )
        WHERE id = OLD.comment_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 5. 트리거 생성
CREATE TRIGGER trigger_update_post_likes_count
    AFTER INSERT OR DELETE ON community_post_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_post_likes_count();

CREATE TRIGGER trigger_update_comment_likes_count
    AFTER INSERT OR DELETE ON community_comment_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_comment_likes_count();

-- 6. 댓글 수 업데이트 함수 및 트리거
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE community_posts 
        SET answers_count = (
            SELECT COUNT(*) 
            FROM community_comments 
            WHERE post_id = NEW.post_id AND is_deleted = FALSE
        )
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE community_posts 
        SET answers_count = (
            SELECT COUNT(*) 
            FROM community_comments 
            WHERE post_id = NEW.post_id AND is_deleted = FALSE
        )
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE community_posts 
        SET answers_count = (
            SELECT COUNT(*) 
            FROM community_comments 
            WHERE post_id = OLD.post_id AND is_deleted = FALSE
        )
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_comments_count
    AFTER INSERT OR UPDATE OR DELETE ON community_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_post_comments_count();

-- 7. 테이블 설명 추가
COMMENT ON TABLE community_post_likes IS '게시글 좋아요 테이블';
COMMENT ON TABLE community_comment_likes IS '댓글 좋아요 테이블';

-- =============================================
-- 결과 확인
-- =============================================
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('community_post_likes', 'community_comment_likes')
ORDER BY table_name, ordinal_position; 