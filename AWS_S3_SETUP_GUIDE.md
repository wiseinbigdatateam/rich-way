# AWS S3 설정 가이드

## 📋 **필요한 AWS 설정**

### **1. AWS 계정 생성**
- [AWS Console](https://aws.amazon.com/ko/)에서 계정 생성
- 결제 정보 등록 (무료 티어 사용 가능)

### **2. S3 버킷 생성**

#### **버킷 생성 단계:**
1. AWS Console → S3 서비스 접속
2. "버킷 만들기" 클릭
3. 버킷 설정:
   ```
   버킷 이름: expert-profile-images-{your-unique-id}
   리전: 아시아 태평양 (서울) ap-northeast-2
   퍼블릭 액세스 차단: 해제 (이미지 공개 필요)
   버킷 소유권: ACL 활성화
   ```

#### **버킷 권한 설정:**
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::expert-profile-images-{your-unique-id}/*"
        }
    ]
}
```

#### **CORS 설정:**
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

### **3. IAM 사용자 생성**

#### **IAM 사용자 생성:**
1. AWS Console → IAM 서비스 접속
2. "사용자" → "사용자 생성"
3. 사용자 이름: `expert-image-uploader`
4. 액세스 키 생성: 프로그래밍 방식 액세스

#### **권한 정책 연결:**
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:GetObject"
            ],
            "Resource": "arn:aws:s3:::expert-profile-images-{your-unique-id}/*"
        }
    ]
}
```

### **4. 환경 변수 설정**

#### **`.env` 파일에 추가:**
```env
# AWS S3 설정
VITE_AWS_REGION=ap-northeast-2
VITE_AWS_S3_BUCKET=expert-profile-images-{your-unique-id}
VITE_AWS_ACCESS_KEY_ID=your-access-key-id
VITE_AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

## 🔧 **설치된 패키지**

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

## 📁 **생성된 파일**

- `src/lib/awsS3.ts` - S3 업로드 유틸리티 함수
- `AWS_S3_SETUP_GUIDE.md` - 이 가이드 문서

## 🚀 **사용 방법**

### **1. 환경 변수 설정**
```bash
cp env.example .env
# .env 파일에서 AWS 설정값 입력
```

### **2. 개발 서버 실행**
```bash
npm run dev
```

### **3. 테스트**
1. 관리자 로그인
2. 전문가 관리 → 전문가 추가
3. "사진 업로드" 버튼 클릭
4. 이미지 선택 후 업로드 확인

## ⚠️ **주의사항**

### **보안:**
- Access Key는 절대 공개 저장소에 커밋하지 마세요
- `.env` 파일은 `.gitignore`에 포함되어 있는지 확인
- 프로덕션에서는 IAM Role 사용 권장

### **비용:**
- S3 Standard 스토리지: GB당 월 $0.023
- PUT 요청: 1,000개당 $0.0005
- GET 요청: 1,000개당 $0.0004
- 전송: GB당 $0.09

### **제한사항:**
- 파일 크기: 최대 5MB
- 지원 형식: 이미지 파일만 (jpg, png, gif 등)
- 파일명: `{user_id}_{timestamp}.{extension}` 형식

## 🔄 **Supabase Storage에서 S3로 마이그레이션**

기존 Supabase Storage에서 S3로 변경되었습니다:

**변경 전 (Supabase):**
```typescript
const { data, error } = await supabase.storage
  .from('profile-images')
  .upload(fileName, file, { upsert: true });
```

**변경 후 (AWS S3):**
```typescript
const publicUrl = await uploadImageToS3(file, fileName);
```

## 🛠️ **문제 해결**

### **CORS 오류:**
- S3 버킷 CORS 설정 확인
- 올바른 Origin 설정

### **권한 오류:**
- IAM 사용자 권한 확인
- 버킷 정책 설정 확인

### **업로드 실패:**
- 파일 크기 제한 확인 (5MB)
- 파일 형식 확인 (이미지만)
- 네트워크 연결 확인 