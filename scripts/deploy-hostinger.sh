#!/bin/bash
# Deploy Infinity Matrix to Hostinger via FTP

set -e

HOSTINGER_FTP_HOST="${HOSTINGER_FTP_HOST:-}"
HOSTINGER_FTP_USER="${HOSTINGER_FTP_USER:-}"
HOSTINGER_FTP_PASSWORD="${HOSTINGER_FTP_PASSWORD:-}"
DEPLOY_PATH="/public_html/infinity-matrix"

if [ -z "$HOSTINGER_FTP_HOST" ] || [ -z "$HOSTINGER_FTP_USER" ] || [ -z "$HOSTINGER_FTP_PASSWORD" ]; then
  echo "Error: Hostinger FTP credentials not set"
  echo "Please set: HOSTINGER_FTP_HOST, HOSTINGER_FTP_USER, HOSTINGER_FTP_PASSWORD"
  exit 1
fi

echo "Building application..."
npm run build

echo "Deploying to Hostinger..."
echo "Host: $HOSTINGER_FTP_HOST"
echo "Path: $DEPLOY_PATH"

# Install lftp if not available
if ! command -v lftp &> /dev/null; then
  echo "Installing lftp..."
  sudo apt-get update && sudo apt-get install -y lftp
fi

# Upload files via FTP
lftp -u "$HOSTINGER_FTP_USER,$HOSTINGER_FTP_PASSWORD" "$HOSTINGER_FTP_HOST" <<EOF
set ssl:verify-certificate no
mkdir -p $DEPLOY_PATH
mirror -R dist/ $DEPLOY_PATH/
mirror -R packages/server/ $DEPLOY_PATH/server/
put .env.example $DEPLOY_PATH/.env.example
bye
EOF

echo "Deployment to Hostinger complete!"
echo "Please configure your environment variables on the server"
