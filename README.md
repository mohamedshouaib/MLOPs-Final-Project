# MLOps Final Project - Hand Gesture Maze Navigation API

## Project Overview

This repository contains the backend API, mlflow files and frontend for a hand gesture-controlled maze navigation game. The system uses machine learning to recognize hand gestures (numbers or arrow signs) and translates them into maze navigation commands. This is the production-ready API component of the MLOps final project.

## 🎯 Project Description

Players navigate through a maze using hand gestures captured via webcam. The ML model processes the hand signs and converts them into directional commands, creating an interactive gaming experience that combines computer vision, machine learning, and web technologies.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │──▶│    Backend API  │───▶│   ML Model      │
│   (React/JS)    │    │  (Flask/FastAPI)│    │   (Hand Gesture)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Monitoring    │
                       │   (Grafana)     │
                       └─────────────────┘
```

## 🚀 Features

- **Hand Gesture Recognition**: Real-time processing of hand gestures for maze navigation
- **RESTful API**: Clean, documented API endpoints for frontend integration
- **Model Serving**: Efficient ML model deployment with prediction endpoints
- **Monitoring & Metrics**: Comprehensive system monitoring with Grafana dashboards
- **Containerized Deployment**: Docker-based deployment for scalability
- **Unit Testing**: Comprehensive test coverage for reliability

## 📁 Project Structure

```
.
├── app/
│   ├── __pycache__/
│   ├── models/          # ML model files and utilities
│   ├── routes/          # API route handlers
│   ├── utils/           # Helper functions and utilities
│   └── main.py          # Application entry point
├── assets/              # Static assets
├── grafana/
│   ├── provisioning/    # Grafana configuration
│   ├── dashboards.yml
│   └── datasources.yml
├── tests/
│   ├── sample_hand.jpg  # Test images
│   └── test_api.py      # Unit tests
├── docker-compose.yml   # Multi-service orchestration
├── dockerfile          # Container configuration
├── requirements.txt     # Python dependencies
├── prometheus.yml       # Metrics collection config
└── README.md           # This file
```

## 🛠️ Technology Stack

- **Backend Framework**: Flask/FastAPI
- **Machine Learning**: TensorFlow/PyTorch, OpenCV
- **Containerization**: Docker, Docker Compose
- **Monitoring**: Prometheus, Grafana
- **Testing**: pytest, unittest
- **Deployment**: AWS/Cloud platform

## 📊 Monitoring Metrics

We track three key categories of metrics to ensure system reliability and performance:

### 1. Model-Related Metrics
- **Prediction Confidence Score**: Monitors the confidence level of hand gesture predictions
- **Prediction Latency**: Tracks the time taken for model inference
- **Model Accuracy**: Real-time accuracy measurements

**Reasoning**: These metrics help us detect model drift, performance degradation, and ensure predictions are reliable enough for real-time gaming.

### 2. Data-Related Metrics
- **Input Image Quality**: Monitors image resolution, brightness, and clarity
- **Gesture Detection Rate**: Tracks successful gesture detection vs. failed attempts
- **Data Processing Time**: Measures preprocessing pipeline performance

**Reasoning**: Poor input data quality directly impacts user experience. These metrics help identify camera issues, lighting problems, or preprocessing bottlenecks.

### 3. Server-Related Metrics
- **API Response Time**: Tracks endpoint latency
- **Request Rate**: Monitors API calls per second
- **Error Rate**: Tracks HTTP error responses (4xx, 5xx)
- **CPU/Memory Usage**: System resource utilization

**Reasoning**: These metrics ensure the API can handle user load and maintain responsive performance during gameplay.

## 🔧 Installation & Setup

### Prerequisites
- Python 3.8+
- Docker & Docker Compose
- Git

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd MLOPS-FINAL-PROJECT
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Run the application**
```bash
python app/main.py
```

### Docker Deployment

1. **Build and run with Docker Compose**
```bash
docker-compose up --build
```

2. **Access services**
- API: http://localhost:5000
- Grafana Dashboard: http://localhost:3000
- Prometheus: http://localhost:9090

## 📡 API Endpoints

### Health Check
```http
GET /health
```
Returns API status and health information.

### Gesture Prediction
```http
POST /predict
Content-Type: multipart/form-data

Body: image file
```
Processes hand gesture image and returns navigation command.

**Response Example:**
```json
{
  "gesture": "peace",
  "confidence": 0.95,
  "timestamp": "2025-05-29T10:30:00Z",
  "processing_time": 0.15
}
```

### Metrics
```http
GET /metrics
```
Returns Prometheus-formatted metrics for monitoring.

## 🧪 Testing

Run the test suite:
```bash
# Run all tests
python -m pytest tests/

# Run with coverage
python -m pytest tests/ --cov=app

# Run specific test file
python -m pytest tests/test_api.py -v
```

## 📈 Monitoring Dashboard

The Grafana dashboard provides real-time visualization of:
- Model prediction accuracy and latency
- API response times and error rates
- System resource utilization
- Data quality metrics

Access the dashboard at `http://localhost:3000` with credentials:
- Username: `admin`
- Password: `admin`

## 🚀 Deployment

### Cloud Deployment Steps

1. **Prepare deployment configuration**
2. **Set up CI/CD pipeline** (GitHub Actions/GitLab CI)
3. **Deploy to cloud platform** (AWS, Azure, GCP)
4. **Configure monitoring and logging**
5. **Set up domain and SSL certificates**

### Environment Variables
```bash
# Model configuration
MODEL_PATH=/app/models/hand_gesture_model.h5
CONFIDENCE_THRESHOLD=0.8

# API configuration
API_HOST=0.0.0.0
API_PORT=5000
DEBUG=False

# Monitoring
PROMETHEUS_PORT=8000
```

## 🔄 Model Integration

The API integrates with the ML model trained in the research repository:
- Model artifacts are loaded at startup
- Preprocessing pipeline matches training configuration
- Prediction results are formatted for frontend consumption
- Model versioning supported through MLflow integration

## 🤝 Frontend Integration

This API is designed to work with the provided frontend repository. Key integration points:
- CORS configured for frontend domain
- Standardized response formats
- WebSocket support for real-time updates (if implemented)
- Error handling with user-friendly messages

## 📝 Development Notes

- **Code Style**: Follow PEP 8 guidelines
- **Logging**: Comprehensive logging for debugging and monitoring
- **Error Handling**: Graceful error handling with appropriate HTTP status codes
- **Security**: Input validation and sanitization implemented
- **Performance**: Optimized for real-time gesture recognition

## 🐛 Troubleshooting

### Common Issues

1. **Model Loading Errors**
   - Verify model file path and format
   - Check Python environment and dependencies

2. **High Prediction Latency**
   - Monitor system resources
   - Consider model optimization techniques

3. **Poor Gesture Recognition**
   - Check camera quality and lighting
   - Verify preprocessing pipeline


## 👥 Contributors

- mohamed shouaib - Backend Development & MLOps Implementation

## 📄 License

This project is part of an iti assignment for MLOps coursework.