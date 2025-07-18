# 🚀 AWS 배포를 위한 GitHub Actions Extension 사용 가이드

## 📋 목차
1. [GitHub Secrets 설정](#1-github-secrets-설정)
2. [AWS IAM 사용자 생성](#2-aws-iam-사용자-생성)
3. [S3 버킷 설정](#3-s3-버킷-설정)
4. [CloudFront 배포 설정](#4-cloudfront-배포-설정)
5. [EC2 배포 설정 (선택사항)](#5-ec2-배포-설정-선택사항)
6. [배포 테스트](#6-배포-테스트)

---

## 1. GitHub Secrets 설정

### 1.1 GitHub 저장소에서 Secrets 설정하기

1. **GitHub 저장소 접속**
   - https://github.com/wiseinbigdatateam/rich-way 접속

2. **Settings 탭 클릭**
   - 저장소 상단의 "Settings" 탭 클릭

3. **Secrets and variables → Actions 클릭**
   - 왼쪽 사이드바에서 "Secrets and variables" → "Actions" 클릭

4. **New repository secret 버튼 클릭**

5. **다음 Secrets 추가:**

#### 필수 Secrets:
```
AWS_ACCESS_KEY_ID: AWS IAM 사용자의 Access Key ID
AWS_SECRET_ACCESS_KEY: AWS IAM 사용자의 Secret Access Key
S3_BUCKET: S3 버킷 이름 (예: rich-way-website)
```

#### 선택적 Secrets (CloudFront 사용 시):
```
CLOUDFRONT_DISTRIBUTION_ID: CloudFront 배포 ID
```

#### 선택적 Secrets (EC2 배포 시):
```
EC2_HOST: EC2 인스턴스의 퍼블릭 IP 또는 도메인
EC2_USERNAME: SSH 사용자명 (보통 ubuntu 또는 ec2-user)
EC2_SSH_KEY: EC2 접속용 SSH 프라이빗 키
```

---

## 2. AWS IAM 사용자 생성

### 2.1 AWS Console에서 IAM 사용자 생성

1. **AWS Console 접속**
   - https://console.aws.amazon.com 접속

2. **IAM 서비스로 이동**
   - 검색창에 "IAM" 입력 후 클릭

3. **사용자 생성**
   - 왼쪽 메뉴에서 "사용자" 클릭
   - "사용자 생성" 버튼 클릭

4. **사용자 세부 정보**
   ```
   사용자 이름: github-actions-deploy
   액세스 유형: 프로그래밍 방식 액세스
   ```

5. **권한 설정**
   - "기존 정책 직접 연결" 선택
   - 다음 정책들 추가:
     - `AmazonS3FullAccess` (S3 배포용)
     - `CloudFrontFullAccess` (CloudFront 무효화용)

6. **태그 설정 (선택사항)**
   ```
   Key: Purpose
   Value: GitHub Actions Deployment
   ```

7. **검토 및 생성**
   - 설정 내용 확인 후 "사용자 생성" 클릭

8. **액세스 키 저장**
   - 생성된 Access Key ID와 Secret Access Key를 안전한 곳에 저장
   - 이 정보를 GitHub Secrets에 등록

---

## 3. S3 버킷 설정

### 3.1 S3 버킷 생성

1. **S3 서비스로 이동**
   - AWS Console에서 "S3" 검색 후 클릭

2. **버킷 생성**
   - "버킷 만들기" 버튼 클릭

3. **버킷 설정**
   ```
   버킷 이름: rich-way-website (전역적으로 고유해야 함)
   리전: 아시아 태평양 (서울) ap-northeast-2
   ```

4. **퍼블릭 액세스 설정**
   - "퍼블릭 액세스 차단" 체크 해제
   - 경고 확인 후 "버킷 생성" 클릭

### 3.2 S3 버킷 정책 설정

1. **버킷 선택 후 "권한" 탭 클릭**

2. **버킷 정책 편집**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::rich-way-website/*"
       }
     ]
   }
   ```

3. **정적 웹사이트 호스팅 활성화**
   - "속성" 탭 클릭
   - "정적 웹사이트 호스팅" 섹션에서 "편집" 클릭
   - "정적 웹사이트 호스팅 사용" 체크
   - 인덱스 문서: `index.html`
   - 오류 문서: `index.html` (SPA용)

---

## 4. CloudFront 배포 설정

### 4.1 CloudFront 배포 생성

1. **CloudFront 서비스로 이동**
   - AWS Console에서 "CloudFront" 검색 후 클릭

2. **배포 생성**
   - "배포 생성" 버튼 클릭

3. **원본 설정**
   ```
   원본 도메인: S3 버킷 선택 (rich-way-website.s3.ap-northeast-2.amazonaws.com)
   원본 경로: 비워두기
   원본 액세스: "예, OAC 사용" 선택
   ```

4. **기본 캐시 동작**
   ```
   뷰어 프로토콜 정책: "HTTPS만" 선택
   캐시 정책: "CachingOptimized" 선택
   ```

5. **배포 설정**
   ```
   가격 클래스: "모든 엣지 로케이션 사용" 선택
   대체 도메인 이름: 도메인이 있다면 입력
   SSL 인증서: 기본값 사용
   ```

6. **배포 생성**
   - 설정 확인 후 "배포 생성" 클릭

7. **배포 ID 복사**
   - 생성된 배포의 ID를 복사하여 GitHub Secrets에 등록

---

## 5. EC2 배포 설정 (선택사항)

### 5.1 EC2 인스턴스 설정

1. **EC2 인스턴스 생성**
   - Ubuntu Server 22.04 LTS 선택
   - 적절한 인스턴스 타입 선택 (t2.micro 또는 t3.micro)

2. **보안 그룹 설정**
   ```
   SSH (22): 0.0.0.0/0
   HTTP (80): 0.0.0.0/0
   HTTPS (443): 0.0.0.0/0
   ```

3. **키 페어 생성**
   - 새 키 페어 생성 또는 기존 키 페어 선택
   - 다운로드한 .pem 파일을 안전한 곳에 보관

### 5.2 EC2 서버 설정

1. **SSH로 EC2 접속**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

2. **필요한 소프트웨어 설치**
   ```bash
   sudo apt update
   sudo apt install -y nginx nodejs npm git
   ```

3. **프로젝트 디렉토리 생성**
   ```bash
   sudo mkdir -p /var/www/rich-way
   sudo chown ubuntu:ubuntu /var/www/rich-way
   ```

4. **Nginx 설정**
   ```bash
   sudo nano /etc/nginx/sites-available/rich-way
   ```

   다음 내용 입력:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;
       root /var/www/rich-way/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

5. **Nginx 활성화**
   ```bash
   sudo ln -s /etc/nginx/sites-available/rich-way /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

## 6. 배포 테스트

### 6.1 GitHub Actions 실행 확인

1. **코드 푸시**
   ```bash
   git add .
   git commit -m "배포 테스트"
   git push origin main
   ```

2. **Actions 탭에서 실행 확인**
   - GitHub 저장소의 "Actions" 탭 클릭
   - 워크플로우 실행 상태 확인

### 6.2 배포 결과 확인

1. **S3 배포 확인**
   - AWS S3 Console에서 파일 업로드 확인
   - S3 웹사이트 URL로 접속 테스트

2. **CloudFront 배포 확인**
   - CloudFront 배포 URL로 접속 테스트
   - 캐시 무효화 확인

3. **EC2 배포 확인 (선택사항)**
   - EC2 퍼블릭 IP로 접속 테스트

---

## 🔧 문제 해결

### 일반적인 문제들:

1. **권한 오류**
   - IAM 사용자 권한 확인
   - S3 버킷 정책 확인

2. **빌드 실패**
   - Node.js 버전 확인
   - 의존성 설치 확인

3. **배포 실패**
   - GitHub Secrets 설정 확인
   - AWS 리전 설정 확인

### 로그 확인 방법:
- GitHub Actions 탭에서 워크플로우 클릭
- 실패한 스텝 클릭하여 상세 로그 확인

---

## 📞 지원

문제가 발생하면 다음을 확인해주세요:
1. GitHub Actions 로그
2. AWS CloudWatch 로그
3. 브라우저 개발자 도구 콘솔

모든 설정이 완료되면 main 브랜치에 푸시할 때마다 자동으로 AWS에 배포됩니다! 🎉 