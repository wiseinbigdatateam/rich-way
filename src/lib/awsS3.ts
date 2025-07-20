import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// AWS S3 클라이언트 설정
const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION || 'ap-northeast-2',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = import.meta.env.VITE_AWS_S3_BUCKET || '';

// 이미지 업로드 함수
export const uploadImageToS3 = async (file: File, fileName: string): Promise<string> => {
  try {
    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      throw new Error('이미지 파일만 업로드 가능합니다.');
    }

    // 파일 크기 제한 (5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      throw new Error('파일 크기는 5MB 이하여야 합니다.');
    }

    // S3에 업로드할 명령 생성
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `expert-profiles/${fileName}`,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read', // 공개 읽기 권한
    });

    // S3에 업로드
    await s3Client.send(command);

    // 공개 URL 반환
    const publicUrl = `https://${BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION || 'ap-northeast-2'}.amazonaws.com/expert-profiles/${fileName}`;
    
    return publicUrl;
  } catch (error) {
    console.error('S3 업로드 오류:', error);
    throw new Error('이미지 업로드에 실패했습니다.');
  }
};

// 이미지 삭제 함수
export const deleteImageFromS3 = async (fileName: string): Promise<void> => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `expert-profiles/${fileName}`,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('S3 삭제 오류:', error);
    throw new Error('이미지 삭제에 실패했습니다.');
  }
};

// 파일명 생성 함수
export const generateFileName = (userId: string, originalName: string): string => {
  const timestamp = Date.now();
  const extension = originalName.split('.').pop();
  return `${userId}_${timestamp}.${extension}`;
};

// 이미지 URL에서 파일명 추출 함수
export const extractFileNameFromUrl = (url: string): string => {
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 1];
}; 