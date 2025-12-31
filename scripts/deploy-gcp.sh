#!/bin/bash
# Deploy Infinity Matrix to Google Cloud Run

set -e

PROJECT_ID="${GOOGLE_CLOUD_PROJECT:-}"
REGION="${DEPLOY_REGION:-us-central1}"
SERVICE_NAME="infinity-matrix"

if [ -z "$PROJECT_ID" ]; then
  echo "Error: GOOGLE_CLOUD_PROJECT environment variable is not set"
  exit 1
fi

echo "Deploying to Google Cloud Run..."
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo "Service: $SERVICE_NAME"

# Build container image
echo "Building container image..."
gcloud builds submit --tag "gcr.io/$PROJECT_ID/$SERVICE_NAME"

# Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --image "gcr.io/$PROJECT_ID/$SERVICE_NAME" \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300 \
  --max-instances 10 \
  --set-env-vars="MCP_SERVER_ENV=production" \
  --set-secrets="OPENAI_API_KEY=openai-api-key:latest,GITHUB_TOKEN=github-token:latest"

# Get service URL
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --format='value(status.url)')

echo "Deployment complete!"
echo "Service URL: $SERVICE_URL"
echo "Health check: $SERVICE_URL/health"
