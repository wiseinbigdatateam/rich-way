#!/bin/bash

# EC2 배포 스크립트
echo "🚀 EC2 배포 시작..."

# 프로젝트 빌드
echo "📦 프로젝트 빌드 중..."
npm ci
npm run build

# Nginx 설정 (필요한 경우)
echo "🌐 Nginx 설정..."
sudo cp nginx.conf /etc/nginx/sites-available/rich-way
sudo ln -sf /etc/nginx/sites-available/rich-way /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# PM2로 애플리케이션 실행 (Node.js 서버인 경우)
echo "🔄 PM2로 애플리케이션 시작..."
pm2 delete rich-way || true
pm2 start npm --name "rich-way" -- start
pm2 save

echo "✅ 배포 완료!" 