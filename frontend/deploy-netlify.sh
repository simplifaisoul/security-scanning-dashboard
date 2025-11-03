#!/bin/bash

# Security Tools Web App - Netlify Deployment Script
# This script helps deploy the frontend to Netlify

echo "🚀 Security Tools Web App - Netlify Deployment"
echo "================================================"

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the frontend directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
if [ -z "$NETLIFY_SITE_ID" ]; then
    echo "📝 No site ID found. Creating new site..."
    netlify init
else
    echo "📝 Deploying to existing site..."
fi

# Deploy
netlify deploy --prod --dir=dist

echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure your backend URL in Netlify environment variables"
echo "2. Set up CORS on your backend to allow your Netlify domain"
echo "3. Test the deployment"
echo ""
echo "🔧 Environment variables to set in Netlify dashboard:"
echo "- VITE_API_BASE_URL=https://your-backend-api.com/api/v1"
echo "- VITE_WS_URL=wss://your-backend-api.com/ws"