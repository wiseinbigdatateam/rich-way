import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';

// AWS S3 클라이언트 설정
const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION || 'ap-northeast-2',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = import.meta.env.VITE_AWS_S3_BUCKET || '';

// 대안 업로드 방법 (AWS SDK 문제 시 사용)
const uploadViaPresignedUrl = async (file: File, fileName: string): Promise<string> => {
  try {
    // 1. Presigned URL 생성
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `expert-profiles/${fileName}`,
      ContentType: file.type,
    });
    
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    // 2. Presigned URL로 직접 업로드
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Presigned URL 업로드 실패: ${response.status}`);
    }
    
    // 3. 공개 URL 반환
    const publicUrl = `https://${BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION || 'ap-northeast-2'}.amazonaws.com/expert-profiles/${fileName}`;
    return publicUrl;
  } catch (error) {
    console.error('Presigned URL 업로드 오류:', error);
    throw error;
  }
};

// lib-storage를 사용한 대안 업로드 방법
const uploadViaLibStorage = async (file: File, fileName: string): Promise<string> => {
  try {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: BUCKET_NAME,
        Key: `expert-profiles/${fileName}`,
        Body: file,
        ContentType: file.type,
        CacheControl: 'max-age=31536000',
      },
    });

    await upload.done();
    
    const publicUrl = `https://${BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION || 'ap-northeast-2'}.amazonaws.com/expert-profiles/${fileName}`;
    return publicUrl;
  } catch (error) {
    console.error('lib-storage 업로드 오류:', error);
    throw error;
  }
};

// 이미지 업로드 함수
export const uploadImageToS3 = async (file: File, fileName: string): Promise<string> => {
  try {
    // 환경 변수 검증
    if (!BUCKET_NAME) {
      throw new Error('S3 버킷 이름이 설정되지 않았습니다.');
    }

    // 파일 타입 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('지원하지 않는 이미지 형식입니다. (JPG, PNG, GIF, WebP만 가능)');
    }

    // 파일 크기 제한 (5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      throw new Error('파일 크기는 5MB 이하여야 합니다.');
    }

    // 파일명 검증
    if (!fileName || fileName.trim() === '') {
      throw new Error('유효하지 않은 파일명입니다.');
    }

    console.log('🔄 S3 업로드 시작:', { fileName, fileSize: file.size, fileType: file.type });

    // File 객체를 ArrayBuffer로 변환 (스트림 호환성 문제 해결)
    let uploadBody: Uint8Array | File;
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      uploadBody = new Uint8Array(arrayBuffer);
      console.log('📦 ArrayBuffer 변환 성공');
    } catch (bufferError) {
      console.warn('⚠️ ArrayBuffer 변환 실패, 원본 File 객체 사용:', bufferError);
      uploadBody = file;
    }

    // S3에 업로드할 명령 생성
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `expert-profiles/${fileName}`,
      Body: uploadBody,
      ContentType: file.type,
      CacheControl: 'max-age=31536000', // 1년 캐시
    });

    // S3에 업로드
    await s3Client.send(command);

    // 공개 URL 반환
    const publicUrl = `https://${BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION || 'ap-northeast-2'}.amazonaws.com/expert-profiles/${fileName}`;
    
    console.log('✅ S3 업로드 완료:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('❌ S3 업로드 오류:', error);
    
    // AWS SDK 오류인 경우 대안 방법들을 순차적으로 시도
    if (error instanceof Error && (
      error.message.includes('readableStream.getReader') ||
      error.message.includes('getReader is not a function')
    )) {
      console.log('🔄 AWS SDK 오류 감지, 대안 방법들을 시도합니다...');
      
      // 1. lib-storage 방법 시도
      try {
        console.log('📦 lib-storage 방법 시도...');
        const publicUrl = await uploadViaLibStorage(file, fileName);
        console.log('✅ lib-storage 업로드 성공:', publicUrl);
        return publicUrl;
      } catch (libStorageError) {
        console.warn('⚠️ lib-storage 방법 실패:', libStorageError);
        
        // 2. Presigned URL 방법 시도
        try {
          console.log('🔗 Presigned URL 방법 시도...');
          const publicUrl = await uploadViaPresignedUrl(file, fileName);
          console.log('✅ Presigned URL 업로드 성공:', publicUrl);
          return publicUrl;
        } catch (presignedError) {
          console.error('❌ 모든 대안 방법 실패:', { libStorageError, presignedError });
          throw new Error('파일 업로드에 실패했습니다. 잠시 후 다시 시도해주세요.');
        }
      }
    }
    
    // AWS 오류 메시지 처리
    if (error instanceof Error) {
      if (error.message.includes('AccessDenied')) {
        throw new Error('S3 접근 권한이 없습니다. AWS 설정을 확인해주세요.');
      } else if (error.message.includes('NoSuchBucket')) {
        throw new Error('S3 버킷을 찾을 수 없습니다. 버킷 이름을 확인해주세요.');
      } else if (error.message.includes('InvalidAccessKeyId')) {
        throw new Error('잘못된 AWS 액세스 키입니다. 환경 변수를 확인해주세요.');
      } else if (error.message.includes('SignatureDoesNotMatch')) {
        throw new Error('AWS 인증에 실패했습니다. 시크릿 키를 확인해주세요.');
      } else if (error.message.includes('readableStream.getReader')) {
        throw new Error('파일 처리 중 오류가 발생했습니다. 다른 이미지 파일을 시도해주세요.');
      }
    }
    
    throw new Error('이미지 업로드에 실패했습니다. 잠시 후 다시 시도해주세요.');
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

// S3 연결 테스트 함수
export const testS3Connection = async (): Promise<boolean> => {
  try {
    console.log('🔍 S3 연결 테스트 시작...');
    console.log('📋 설정 정보:', {
      region: import.meta.env.VITE_AWS_REGION,
      bucket: BUCKET_NAME,
      hasAccessKey: !!import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      hasSecretKey: !!import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
    });

    if (!BUCKET_NAME) {
      throw new Error('S3 버킷 이름이 설정되지 않았습니다.');
    }

    if (!import.meta.env.VITE_AWS_ACCESS_KEY_ID || !import.meta.env.VITE_AWS_SECRET_ACCESS_KEY) {
      throw new Error('AWS 인증 정보가 설정되지 않았습니다.');
    }

    // 간단한 테스트 파일 업로드 (1바이트 더미 데이터)
    const testFileName = `test-connection-${Date.now()}.txt`;
    const testData = new Blob(['test'], { type: 'text/plain' });
    
    let testBody: Uint8Array | Blob;
    try {
      const arrayBuffer = await testData.arrayBuffer();
      testBody = new Uint8Array(arrayBuffer);
    } catch (bufferError) {
      console.warn('⚠️ 테스트 데이터 ArrayBuffer 변환 실패, 원본 Blob 사용:', bufferError);
      testBody = testData;
    }
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `test/${testFileName}`,
      Body: testBody,
      ContentType: 'text/plain',
    });

    await s3Client.send(command);
    console.log('✅ S3 연결 테스트 성공!');
    
    // 테스트 파일 삭제
    const deleteCommand = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `test/${testFileName}`,
    });
    await s3Client.send(deleteCommand);
    
    return true;
  } catch (error) {
    console.error('❌ S3 연결 테스트 실패:', error);
    return false;
  }
}; 