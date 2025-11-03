#!/bin/bash

# Security Tools Web App Deployment Script
# Deploys the application to production

set -e

echo "🚀 Deploying Security Tools Web Application..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "docker-compose.prod.yml" ]; then
    echo -e "${RED}Error: docker-compose.prod.yml not found${NC}"
    exit 1
fi

# Create production environment file
print_step "Creating production environment..."

# Backend production environment
cat > backend/.env.prod << EOF
# Production Backend Configuration
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000

# MCP Server
MCP_SERVER_URL=http://mcp-server:8000

# Security
JWT_SECRET_KEY=$(openssl rand -hex 64)
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://api.yourdomain.com

# Database
DATABASE_URL=postgresql://security_user:$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)@postgres:5432/security_db

# Redis
REDIS_URL=redis://redis:6379/0

# Production Settings
DEBUG=false
LOG_LEVEL=WARNING
MAX_CONCURRENT_SCANS=5
DEFAULT_SCAN_TIMEOUT=600
SCAN_RESULTS_RETENTION_DAYS=90
EOF

# Frontend production environment
cat > frontend/.env.prod << EOF
# Production Frontend Configuration
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
VITE_WS_URL=wss://api.yourdomain.com/ws
VITE_APP_NAME=Security Tools Dashboard
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
EOF

print_status "Production environment files created"

# Deploy using production compose
print_step "Starting production deployment..."

# Stop any existing services
docker-compose -f docker-compose.prod.yml down || true

# Build and start production services
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for services to be ready
print_step "Waiting for services to initialize..."
sleep 60

# Check service health
print_step "Verifying deployment..."

# Check backend
if curl -f http://localhost:8000/health &> /dev/null; then
    print_status "✅ Backend API is healthy"
else
    echo -e "${RED}❌ Backend API is not responding${NC}"
fi

# Check frontend
if curl -f http://localhost &> /dev/null; then
    print_status "✅ Frontend is healthy"
else
    echo -e "${RED}❌ Frontend is not responding${NC}"
fi

# Show deployment info
print_step "Deployment completed! 🎉"

echo ""
echo -e "${GREEN}🌐 Local Access Points:${NC}"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:8000"
echo "   API Documentation: http://localhost:8000/docs"
echo ""

echo -e "${GREEN}📋 Management Commands:${NC}"
echo "   View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "   Stop services: docker-compose -f docker-compose.prod.yml down"
echo "   Restart services: docker-compose -f docker-compose.prod.yml restart"
echo "   Update services: docker-compose -f docker-compose.prod.yml pull && docker-compose -f docker-compose.prod.yml up -d"
echo ""

echo -e "${YELLOW}🔧 Next Steps for Production:${NC}"
echo "   1. Configure your domain DNS to point to this server"
echo "   2. Set up SSL certificates (Let's Encrypt recommended)"
echo "   3. Update ALLOWED_ORIGINS in backend/.env.prod"
echo "   4. Configure firewall rules"
echo "   5. Set up monitoring and backups"
echo "   6. Review security settings"
echo ""

echo -e "${GREEN}🔗 GitHub Repository:${NC}"
echo "   https://github.com/simplifaisoul/security-scanning-dashboard"
echo ""

echo -e "${GREEN}✨ Deployment successful!${NC}"