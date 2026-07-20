-- 대안: members.id (UUID)를 사용하는 외래키 설정
-- user_id 컬럼 추가가 어려운 경우 이 방법을 사용하세요.

-- 1. 현재 members 테이블 구조 확인
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'members' 
ORDER BY ordinal_position;

-- 2. community_posts 테이블의 member_user_id를 UUID로 변경
-- (기존 데이터가 있다면 백업 후 진행)

-- 기존 외래키 제약조건 제거
ALTER TABLE community_posts DROP CONSTRAINT IF EXISTS fk_community_posts_member;

-- member_user_id 컬럼을 UUID 타입으로 변경
ALTER TABLE community_posts ALTER COLUMN member_user_id TYPE UUID USING member_user_id::UUID;

-- 새로운 외래키 제약조건 추가 (members.id 참조)
ALTER TABLE community_posts 
ADD CONSTRAINT fk_community_posts_member 
FOREIGN KEY (member_user_id) REFERENCES members(id) 
ON DELETE CASCADE ON UPDATE CASCADE;

-- 3. community_comments 테이블도 동일하게 수정
ALTER TABLE community_comments DROP CONSTRAINT IF EXISTS fk_community_comments_member;

-- member_user_id 컬럼을 UUID 타입으로 변경
ALTER TABLE community_comments ALTER COLUMN member_user_id TYPE UUID USING member_user_id::UUID;

-- 새로운 외래키 제약조건 추가 (members.id 참조)
ALTER TABLE community_comments 
ADD CONSTRAINT fk_community_comments_member 
FOREIGN KEY (member_user_id) REFERENCES members(id) 
ON DELETE CASCADE ON UPDATE CASCADE;

-- 4. 좋아요 테이블들도 수정
ALTER TABLE community_post_likes DROP CONSTRAINT IF EXISTS fk_post_likes_member;
ALTER TABLE community_comment_likes DROP CONSTRAINT IF EXISTS fk_comment_likes_member;

-- member_user_id 컬럼을 UUID 타입으로 변경
ALTER TABLE community_post_likes ALTER COLUMN member_user_id TYPE UUID USING member_user_id::UUID;
ALTER TABLE community_comment_likes ALTER COLUMN member_user_id TYPE UUID USING member_user_id::UUID;

-- 새로운 외래키 제약조건 추가
ALTER TABLE community_post_likes 
ADD CONSTRAINT fk_post_likes_member 
FOREIGN KEY (member_user_id) REFERENCES members(id) 
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE community_comment_likes 
ADD CONSTRAINT fk_comment_likes_member 
FOREIGN KEY (member_user_id) REFERENCES members(id) 
ON DELETE CASCADE ON UPDATE CASCADE;

-- 5. 인덱스 재생성
DROP INDEX IF EXISTS idx_community_posts_member_user_id;
DROP INDEX IF EXISTS idx_community_comments_member_user_id;
DROP INDEX IF EXISTS idx_post_likes_user_id;
DROP INDEX IF EXISTS idx_comment_likes_user_id;

CREATE INDEX idx_community_posts_member_user_id ON community_posts(member_user_id);
CREATE INDEX idx_community_comments_member_user_id ON community_comments(member_user_id);
CREATE INDEX idx_post_likes_user_id ON community_post_likes(member_user_id);
CREATE INDEX idx_comment_likes_user_id ON community_comment_likes(member_user_id);

-- 완료 메시지
SELECT 'Foreign keys now reference members.id (UUID) instead of user_id' AS status;

-- 주의사항 출력
SELECT 'IMPORTANT: You need to update your application code to use members.id instead of user_id for foreign key relationships!' AS warning; 