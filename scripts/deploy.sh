#!/bin/bash

# Morning Reader - Google Cloud Run Deployment Script
# Usage: ./deploy.sh [--dry-run]

set -e  # Exit on any error

# 1. 配置参数 (支持环境变量覆盖，否则从 gcloud 获取)
PROJECT_ID="${PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}"
SERVICE_NAME="${SERVICE_NAME:-morning-reader}"
REGION="${REGION:-asia-northeast1}"
VERSION=$(git describe --tags --always 2>/dev/null || echo "latest")

# 验证 PROJECT_ID
if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: PROJECT_ID not set and gcloud project not configured"
    echo "   Run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "🚀 Starting Deployment for $SERVICE_NAME (v$VERSION)..."
echo "   Project: $PROJECT_ID"
echo "   Region:  $REGION"

# 2. 检查必要文件
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found in root directory"
    exit 1
fi

# 3. Dry-run 模式检测
DRY_RUN=false
if [ "$1" == "--dry-run" ]; then
    DRY_RUN=true
    echo "🔍 Dry-run mode enabled - no actual deployment will occur"
fi

# 4. 构建参数 (仅 VITE_* 用于前端构建，排除敏感 SECRET)
SUBSTITUTIONS="_SERVICE_NAME=$SERVICE_NAME,_VERSION=$VERSION"
while read -r line || [[ -n "$line" ]]; do
    # 跳过注释和空行
    [[ $line =~ ^#.*$ ]] && continue
    [[ -z "$line" ]] && continue
    
    # 仅处理 VITE_ 开头，但排除 SECRET 字样
    if [[ $line == VITE_* ]] && [[ ! $line == *SECRET* ]]; then
        KEY=$(echo "$line" | cut -d'=' -f1)
        VAL=$(echo "$line" | cut -d'=' -f2-)
        SUBSTITUTIONS="$SUBSTITUTIONS,_$KEY=$VAL"
    fi
done < .env

# 5. 后端运行时环境变量 (排除 VITE_、PORT、和敏感日志)
# 包含: SUPABASE_*, GEMINI_*, JWT_*, ALLOWED_ORIGINS 等
# 使用 @ 作为分隔符，因为环境变量值中可能包含逗号和冒号（如 URLs）
ENV_VARS=""
while read -r line || [[ -n "$line" ]]; do
    [[ $line =~ ^#.*$ ]] && continue
    [[ -z "$line" ]] && continue
    [[ $line == VITE_* ]] && continue
    [[ $line == PORT=* ]] && continue
    [[ $line == DEV_ORIGIN=* ]] && continue  # 跳过开发环境专用变量
    
    # 使用 @ 作为分隔符
    if [ -n "$ENV_VARS" ]; then
        ENV_VARS="$ENV_VARS@$line"
    else
        ENV_VARS="$line"
    fi
done < .env

echo "📋 Build substitutions prepared (${#SUBSTITUTIONS} chars)"

if [ "$DRY_RUN" = true ]; then
    echo "📦 [DRY-RUN] Would build with:"
    echo "   Substitutions: ${SUBSTITUTIONS:0:100}..."
    echo "🚢 [DRY-RUN] Would deploy with:"
    echo "   Env vars: ${ENV_VARS:0:100}..."
    exit 0
fi

# 6. 使用 Cloud Build 构建并推送镜像
echo "📦 Building container image via Cloud Build..."
if ! gcloud builds submit --config cloudbuild.yaml \
    --substitutions="$SUBSTITUTIONS" .; then
    echo "❌ Build failed!"
    exit 1
fi

# 7. 部署到 Cloud Run
echo "🚢 Deploying to Cloud Run..."
if ! gcloud run deploy "$SERVICE_NAME" \
    --image "gcr.io/$PROJECT_ID/$SERVICE_NAME:latest" \
    --platform managed \
    --region "$REGION" \
    --allow-unauthenticated \
    --set-env-vars "^@^$ENV_VARS" \
    --memory 512Mi \
    --cpu 1 \
    --timeout 300 \
    --min-instances 0 \
    --max-instances 10 \
    --concurrency 80; then
    echo "❌ Deployment failed!"
    exit 1
fi

echo ""
echo "✅ Deployment Complete!"
echo "🏷️  Version: $VERSION"
echo "🔗 Service URL: $(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --format='value(status.url)')"