# Security Tools Web Application

A comprehensive web application that integrates multiple security scanning tools through an intuitive interface. Built with modern web technologies and connected to our MCP Security Tools Server.

## Features

### 🛡️ Security Tools Integration
- **Nmap** - Network scanning and port discovery
- **Nikto** - Web server vulnerability scanning
- **SQLMap** - SQL injection testing
- **WPScan** - WordPress security scanning
- **DIRB** - Directory and file brute-forcing
- **SearchSploit** - Exploit database searching

### 🎨 Modern Web Interface
- Responsive design for all devices
- Real-time scan results
- Interactive dashboards
- Dark/Light theme support
- Live progress tracking

### 🔧 Advanced Features
- Multi-tool scanning workflows
- Scheduled scans
- Results export (PDF, JSON, CSV)
- Scan history and logging
- Team collaboration
- API access

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Frontend  │    │   Backend API   │    │  MCP Server     │
│   (React/Vue)   │◄──►│   (FastAPI)     │◄──►│  (Python)       │
│                 │    │                 │    │                 │
│ - Tool UI      │    │ - REST API      │    │ - Security      │
│ - Results      │    │ - WebSocket     │    │   Tools         │
│ - Dashboard    │    │ - Auth          │    │ - Docker        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for development)
- Python 3.8+

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/security-tools-webapp.git
cd security-tools-webapp
```

2. **Start with Docker Compose**
```bash
docker-compose up -d
```

3. **Access the application**
- Web Interface: http://localhost:3000
- API Documentation: http://localhost:8000/docs
- MCP Server: http://localhost:8001

### Development Setup

1. **Backend Development**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

2. **Frontend Development**
```bash
cd frontend
npm install
npm run dev
```

## Usage

### Running Security Scans

1. **Select a Tool** from the dashboard
2. **Configure Parameters** (target, ports, options)
3. **Execute Scan** with real-time progress
4. **View Results** in formatted output
5. **Export Reports** in multiple formats

### API Usage

```bash
# Start a nmap scan
curl -X POST "http://localhost:8000/api/v1/scan/nmap" \
  -H "Content-Type: application/json" \
  -d '{"target": "192.168.1.1", "ports": "22,80,443"}'

# Get scan results
curl "http://localhost:8000/api/v1/scan/results/scan_id"
```

## Configuration

### Environment Variables

```bash
# Backend Configuration
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
MCP_SERVER_URL=http://localhost:8001

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws

# Security
JWT_SECRET_KEY=your-secret-key
ALLOWED_ORIGINS=http://localhost:3000
```

### Security Settings

- JWT-based authentication
- Rate limiting
- Input validation
- CORS protection
- HTTPS enforcement (production)

## Deployment

### Docker Production

```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d

# With SSL certificates
docker-compose -f docker-compose.ssl.yml up -d
```

### Kubernetes

```bash
kubectl apply -f k8s/
```

## API Documentation

Full API documentation available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Security Considerations

⚠️ **Important**: This application provides access to powerful security tools.

- Only scan systems you own or have permission to test
- Use in authorized penetration testing scenarios
- Follow responsible disclosure practices
- Implement proper authentication in production
- Monitor usage and audit logs

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This tool is for educational and authorized security testing purposes only. Users are responsible for ensuring they have proper authorization before scanning any systems. The authors are not responsible for any misuse of this software.

## Support

- 📧 Email: support@example.com
- 💬 Discord: [Join our community](https://discord.gg/example)
- 📖 Documentation: [docs.example.com](https://docs.example.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/security-tools-webapp/issues)