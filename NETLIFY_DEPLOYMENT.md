# Security Tools Web App - Netlify Deployment Guide

## Overview
This guide explains how to deploy the Security Tools Web App frontend to Netlify while maintaining communication with your backend API.

## Prerequisites
- Netlify account
- Backend API deployed and accessible (e.g., on Railway, Heroku, AWS, etc.)
- Git repository with your code

## Configuration Files Created

### 1. `netlify.toml`
- Main Netlify configuration
- Build settings and environment variables
- Security headers
- Redirects for API proxy

### 2. `public/_redirects`
- Fallback redirects for SPA routing
- API proxy redirects

### 3. Environment Files
- `.env.example` - Development template
- `.env.production` - Production variables

## Deployment Steps

### Step 1: Configure Backend URL
Update the backend URL in both:
- `netlify.toml` (line 18, 22, 28, 33)
- `public/_redirects` (line 2, 3)
- `.env.production`

Replace `https://your-backend-api.com` with your actual backend URL.

### Step 2: Set Up Netlify Environment Variables
In Netlify dashboard > Site settings > Build & deploy > Environment:
```
VITE_API_BASE_URL=https://your-backend-api.com/api/v1
VITE_WS_URL=wss://your-backend-api.com/ws
VITE_ENABLE_ANALYTICS=true
```

### Step 3: Deploy to Netlify

#### Option A: Git Integration
1. Push your code to GitHub/GitLab/Bitbucket
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `frontend/dist`
5. Deploy

#### Option B: Manual Drag & Drop
1. Run `npm run build` in frontend directory
2. Drag the `frontend/dist` folder to Netlify deploy page

### Step 4: Configure CORS on Backend
Ensure your backend allows requests from your Netlify domain:
```javascript
// Example for FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-app.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Backend Deployment Options

### Option 1: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy backend
railway login
railway init
railway up
```

### Option 2: Heroku
```bash
# Install Heroku CLI
heroku create your-security-tools-api
git push heroku main
```

### Option 3: AWS/Google Cloud
Deploy using Docker container or serverless functions.

## WebSocket Support
For WebSocket connections in production:
1. Backend must support WSS (WebSocket Secure)
2. Configure SSL certificates on backend
3. Update `VITE_WS_URL` to use `wss://` protocol

## Testing the Deployment

### 1. Frontend Test
- Visit your Netlify URL
- Check browser console for API connection errors
- Test basic navigation

### 2. API Connection Test
```javascript
// Test in browser console
fetch('/api/v1/tools')
  .then(r => r.json())
  .then(console.log)
```

### 3. WebSocket Test
```javascript
// Test WebSocket connection
const ws = new WebSocket('wss://your-backend-api.com/ws');
ws.onopen = () => console.log('WebSocket connected');
```

## Troubleshooting

### Common Issues

#### 1. CORS Errors
- Add Netlify domain to backend CORS whitelist
- Check preflight requests are handled

#### 2. API 404 Errors
- Verify backend URL in environment variables
- Check redirect rules in `netlify.toml`

#### 3. WebSocket Connection Failed
- Ensure backend supports WSS
- Check firewall/proxy settings
- Verify WebSocket endpoint path

#### 4. Build Failures
- Check Node.js version (set to 18 in netlify.toml)
- Verify all dependencies are in package.json

### Debug Mode
Enable debug logging:
```javascript
// In browser console
localStorage.setItem('debug', 'true')
```

## Security Considerations

### 1. Environment Variables
- Never commit sensitive data to Git
- Use Netlify environment variables for secrets
- Rotate API keys regularly

### 2. API Security
- Implement rate limiting on backend
- Use JWT authentication
- Validate all inputs

### 3. HTTPS Only
- Force HTTPS in production
- Use secure cookies
- Implement HSTS headers

## Performance Optimization

### 1. Build Optimization
- Code splitting configured in vite.config.js
- Vendor chunks separated
- Source maps enabled for debugging

### 2. Caching
- Static assets cached for 1 year
- API responses should include cache headers
- Consider CDN for backend API

### 3. Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist/stats.html
```

## Monitoring and Analytics

### 1. Netlify Analytics
Enable in Netlify dashboard for basic metrics.

### 2. Custom Analytics
Add Google Analytics or similar:
```javascript
// In main.jsx
import { VITE_ENABLE_ANALYTICS } from './env'
if (VITE_ENABLE_ANALYTICS) {
  // Initialize analytics
}
```

### 3. Error Tracking
Consider Sentry or similar for error tracking.

## Maintenance

### 1. Updates
- Regularly update dependencies
- Monitor security advisories
- Test deployments in preview

### 2. Backups
- Backup backend database regularly
- Version control your configuration
- Document deployment process

### 3. Scaling
- Monitor performance metrics
- Scale backend as needed
- Consider CDN for static assets

## Support

For issues with:
- **Netlify Deployment**: Check Netlify docs
- **Backend API**: Review your backend deployment
- **CORS Issues**: Verify backend configuration
- **WebSocket**: Check network and SSL setup