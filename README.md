# AI-Powered Phishing URL Detector

A comprehensive MERN stack application with Machine Learning integration for detecting phishing URLs, featuring a modern dashboard and real-time threat intelligence from VirusTotal and PhishTank.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-18.x-green.svg)
![Python](https://img.shields.io/badge/python-3.11-blue.svg)
![React](https://img.shields.io/badge/react-18.x-blue.svg)

## 🌟 Features

- **AI-Powered Detection**: Machine learning model trained to identify phishing URLs with high accuracy
- **Real-Time Analysis**: Instant URL scanning and threat assessment
- **Threat Intelligence**: Integration with VirusTotal and PhishTank APIs
- **Interactive Dashboard**: Beautiful React-based UI with charts and analytics
- **Scan History**: Track all analyzed URLs with detailed results
- **User Authentication**: Secure JWT-based authentication system
- **RESTful API**: Well-documented API for integration

## 🏗️ Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Frontend │────────▶│  Express API    │────────▶│  MongoDB        │
│  (Vite + TW)    │         │  (Node.js)      │         │                 │
│                 │         │                 │         │                 │
└─────────────────┘         └────────┬────────┘         └─────────────────┘
                                     │
                                     │
                    ┌────────────────┴────────────────┐
                    │                                  │
                    ▼                                  ▼
         ┌─────────────────┐              ┌─────────────────┐
         │  ML Service     │              │  Threat Intel   │
         │  (Flask/Python) │              │  APIs           │
         │                 │              │  - VirusTotal   │
         │  - Random Forest│              │  - PhishTank    │
         │  - Feature Ext. │              │                 │
         └─────────────────┘              └─────────────────┘
```

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **Python** 3.11 or higher
- **MongoDB** 7.x or higher
- **Docker** (optional, for containerized deployment)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Ai
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Setup ML Service

```bash
cd ml_service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python app.py
```

### 5. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7

# Or use local MongoDB installation
mongod
```

## 🐳 Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **ML Service**: http://localhost:5001
- **MongoDB**: localhost:27017

## 📚 API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### URL Analysis

#### Analyze URL
```http
POST /api/url/analyze
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://example.com"
}
```

#### Get Scan Result
```http
GET /api/url/scan/:scanId
Authorization: Bearer <token>
```

#### Get Scan History
```http
GET /api/url/history?page=1&limit=10
Authorization: Bearer <token>
```

### Threat Intelligence

#### Get Threat Feed
```http
GET /api/threat/feed?severity=high&threatType=phishing
Authorization: Bearer <token>
```

#### Check URL in Threat Database
```http
POST /api/threat/check
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://example.com"
}
```

### Statistics

#### Get Dashboard Stats
```http
GET /api/stats/dashboard
Authorization: Bearer <token>
```

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/phish_detector
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
ML_SERVICE_URL=http://localhost:5001
VIRUSTOTAL_API_KEY=your-virustotal-api-key
PHISHTANK_API_KEY=your-phishtank-api-key
```

### ML Service Environment Variables

Create `ml_service/.env`:

```env
PORT=5001
DEBUG=True
MODEL_PATH=models/phishing_detector.pkl
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### ML Service Tests
```bash
cd ml_service
pytest
```

## 📊 ML Model Details

The phishing detection model uses:
- **Algorithm**: Random Forest Classifier
- **Features**: 27 URL-based features including:
  - Length-based metrics
  - Character frequency analysis
  - Protocol and security indicators
  - Suspicious pattern detection
  - Domain characteristics

### Feature Extraction

The model analyzes:
- URL length, domain length, path length
- Special character counts (dots, hyphens, @, etc.)
- HTTPS usage
- IP address in URL
- Suspicious keywords
- Subdomain depth
- Query parameters

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Helmet.js security headers
- CORS configuration
- Input validation with Joi
- SQL injection prevention (NoSQL)

## 📈 Performance

- **Average Analysis Time**: < 2 seconds
- **Model Accuracy**: ~95% (on training data)
- **API Response Time**: < 100ms (cached)
- **Concurrent Users**: Supports 1000+ with proper scaling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [VirusTotal](https://www.virustotal.com/) - Threat intelligence API
- [PhishTank](https://www.phishtank.com/) - Phishing URL database
- [scikit-learn](https://scikit-learn.org/) - Machine learning library
- [React](https://reactjs.org/) - Frontend framework
- [Express](https://expressjs.com/) - Backend framework

## 📞 Support

For support, email support@example.com or open an issue in the repository.

## 🗺️ Roadmap

- [ ] Add more ML models (Neural Networks, SVM)
- [ ] Real-time threat feed updates
- [ ] Browser extension
- [ ] Mobile app (React Native)
- [ ] Advanced reporting and analytics
- [ ] Multi-language support
- [ ] API rate limiting tiers
- [ ] Webhook notifications

---

**Built with ❤️ using MERN Stack + Machine Learning**
