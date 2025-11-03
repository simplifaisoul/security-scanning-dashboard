#!/bin/bash

# Security Tools Web App Setup Script
# This script sets up the complete security tools web application

set -e

echo "🚀 Setting up Security Tools Web Application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_status "Docker and Docker Compose are installed"
}

# Check if we're in the right directory
check_directory() {
    if [ ! -f "docker-compose.yml" ]; then
        print_error "docker-compose.yml not found. Please run this script from the project root."
        exit 1
    fi
    
    print_status "Project directory verified"
}

# Create necessary directories
create_directories() {
    print_step "Creating necessary directories..."
    
    mkdir -p logs/{nginx,app,scans}
    mkdir -p uploads
    mkdir -p reports
    mkdir -p ssl
    
    print_status "Directories created"
}

# Generate environment files
generate_env_files() {
    print_step "Generating environment files..."
    
    # Backend .env
    if [ ! -f "backend/.env" ]; then
        cat > backend/.env << EOF
# Backend Configuration
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000

# MCP Server
MCP_SERVER_URL=http://mcp-server:8000

# Security
JWT_SECRET_KEY=$(openssl rand -hex 32)
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000

# Database
DATABASE_URL=postgresql://security_user:$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)@postgres:5432/security_db

# Redis
REDIS_URL=redis://redis:6379/0

# File Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=104857600

# Scan Configuration
MAX_CONCURRENT_SCANS=3
DEFAULT_SCAN_TIMEOUT=300
SCAN_RESULTS_RETENTION_DAYS=30

# Logging
LOG_LEVEL=INFO
LOG_FILE=./logs/app.log
EOF
        print_status "Backend .env file created"
    else
        print_warning "Backend .env file already exists"
    fi
    
    # Frontend .env
    if [ ! -f "frontend/.env" ]; then
        cat > frontend/.env << EOF
# Frontend Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/ws
VITE_APP_NAME=Security Tools Dashboard
VITE_APP_VERSION=1.0.0
EOF
        print_status "Frontend .env file created"
    else
        print_warning "Frontend .env file already exists"
    fi
}

# Build and start services
build_and_start() {
    print_step "Building and starting services..."
    
    # Build images
    print_status "Building Docker images..."
    docker-compose build
    
    # Start services
    print_status "Starting services..."
    docker-compose up -d
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 30
    
    # Check service health
    check_service_health
}

# Check service health
check_service_health() {
    print_step "Checking service health..."
    
    # Check backend
    if curl -f http://localhost:8000/health &> /dev/null; then
        print_status "✅ Backend API is healthy"
    else
        print_error "❌ Backend API is not responding"
    fi
    
    # Check frontend
    if curl -f http://localhost:3000 &> /dev/null; then
        print_status "✅ Frontend is healthy"
    else
        print_error "❌ Frontend is not responding"
    fi
    
    # Check MCP server
    if curl -f http://localhost:8001 &> /dev/null; then
        print_status "✅ MCP Server is healthy"
    else
        print_warning "⚠️  MCP Server may still be starting up"
    fi
}

# Show next steps
show_next_steps() {
    print_step "Setup completed! 🎉"
    
    echo ""
    echo -e "${GREEN}🌐 Access Points:${NC}"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:8000"
    echo "   API Documentation: http://localhost:8000/docs"
    echo "   MCP Server: http://localhost:8001"
    echo ""
    
    echo -e "${GREEN}📋 Useful Commands:${NC}"
    echo "   View logs: docker-compose logs -f"
    echo "   Stop services: docker-compose down"
    echo "   Restart services: docker-compose restart"
    echo "   View running containers: docker-compose ps"
    echo ""
    
    echo -e "${GREEN}🔧 Development:${NC}"
    echo "   Frontend dev: cd frontend && npm run dev"
    echo "   Backend dev: cd backend && uvicorn main:app --reload"
    echo ""
    
    echo -e "${YELLOW}⚠️  Important Security Notes:${NC}"
    echo "   - Only scan systems you own or have permission to test"
    echo "   - Change default passwords and secrets in production"
    echo "   - Use HTTPS in production environments"
    echo "   - Implement proper authentication and authorization"
    echo "   - Monitor logs for suspicious activity"
    echo ""
}

# Main execution
main() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║           Security Tools Web Application Setup                ║"
    echo "║                    Version 1.0.0                           ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    
    check_docker
    check_directory
    create_directories
    generate_env_files
    build_and_start
    show_next_steps
}

# Handle script interruption
trap 'print_error "Setup interrupted. Exiting..."; exit 1' INT

# Run main function
main "$@"