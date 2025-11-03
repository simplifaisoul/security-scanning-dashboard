# Security Tools Web Application

A comprehensive web application that integrates multiple security scanning tools through an intuitive interface. Built with modern web technologies and connected to our MCP Security Tools Server.

## ✨ Features

### 🛡️ Security Tools Integration
- **Nmap** - Network scanning and port discovery
- **Nikto** - Web server vulnerability scanning  
- **SQLMap** - SQL injection testing
- **WPScan** - WordPress security scanning
- **DIRB** - Directory and file brute-forcing
- **SearchSploit** - Exploit database searching

### 🎨 Modern Web Interface
- 🌙 Beautiful dark theme with green accent colors
- 📱 Fully responsive design for all devices
- ⚡ Real-time scan results via WebSocket
- 📊 Interactive dashboards with animations
- 🎯 Live progress tracking
- 🎭 Smooth transitions and micro-interactions

### 🔧 Advanced Features
- 🔄 Multi-tool scanning workflows
- ⏰ Scheduled scans
- 📄 Results export (PDF, JSON, CSV)
- 📜 Scan history and logging
- 👥 Team collaboration
- 🔌 RESTful API access
- 🐳 Docker containerization

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

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for development)
- Python 3.8+ (for development)

### 🐳 Docker Deployment (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/simplifaisoul/security-tools-webapp.git
cd security-tools-webapp
```

2. **Start with Docker Compose**
```bash
docker compose up -d --build
```

3. **Access the application**
- 🌐 Web Interface: http://localhost:3000
- 📚 API Documentation: http://localhost:8000/docs
- 🔧 MCP Server: http://localhost:8001

### 💻 Development Setup

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
npm install --legacy-peer-deps
npm run dev
```

### 🔧 Environment Configuration

Create `.env` files in both frontend and backend directories:

**Backend (.env)**
```bash
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
MCP_SERVER_URL=http://localhost:8001
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
DATABASE_URL=postgresql://security_user:security_pass@localhost:5432/security_db
REDIS_URL=redis://localhost:6379/0
```

**Frontend (.env)**
```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/ws
```

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

## 🌟 Live Demo

Check out the live demo: [https://security-tools-webapp.vercel.app](https://security-tools-webapp.vercel.app)

## 📱 Screenshots

### Dashboard
![Security Dashboard](https://via.placeholder.com/800x400/0a0a0a/00ff88?text=Security+Dashboard+with+Real-time+Stats)

### Tool Configuration  
![Tool Configuration](https://via.placeholder.com/800x400/0a0a0a/00ff88?text=Advanced+Tool+Configuration+Interface)

### Scan Results
![Scan Results](https://via.placeholder.com/800x400/0a0a0a/00ff88?text=Interactive+Scan+Results+Visualization)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This tool is for educational and authorized security testing purposes only. Users are responsible for ensuring they have proper authorization before scanning any systems. The authors are not responsible for any misuse of this software.

## 🆘 Support

- 📧 Email: support@simplifai.dev
- 💬 Discord: [Join our community](https://discord.gg/simplifai)
- 📖 Documentation: [docs.simplifai.dev](https://docs.simplifai.dev)
- 🐛 Issues: [GitHub Issues](https://github.com/simplifaisoul/security-tools-webapp/issues)
- 🌟 Give us a star if you like this project!

## 🔗 Links

- [Live Demo](https://security-tools-webapp.vercel.app)
- [GitHub Repository](https://github.com/simplifaisoul/security-tools-webapp)
- [API Documentation](https://github.com/simplifaisoul/security-tools-webapp/blob/main/docs/API.md)
- [Security Tools MCP Server](https://github.com/simplifaisoul/security-mcp-tools)