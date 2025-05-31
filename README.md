
# 🧠 MLOps Final Project – Hand Gesture Classification & Monitoring

This project serves a trained hand gesture classification model via a REST API, and provides complete monitoring with Prometheus and Grafana. It follows MLOps best practices including containerization, logging, metrics, and model versioning.

---

## 📁 Project Structure

```plaintext
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── models/              # ML models (e.g., LightGBM, SVM, RF)
│   ├── routers/             # API route handlers
│   ├── utils/               # Utility functions
│   └── __pycache__/
│
├── grafana/
│   └── provisioning/
│       ├── dashboards.yml   # Pre-configured Grafana dashboard
│       └── datasources.yml  # Prometheus as a Grafana datasource
│
├── tests/
│   ├── sample_hand.jpg      # Example image for testing
│   └── test_api.py          # Test script for API inference
│
├── docker-compose.yml       # Multi-container app definition
├── dockerfile               # Dockerfile for API container
├── prometheus.yml           # Prometheus scrape config
├── requirements.txt         # Python dependencies
└── README.md                # You're here!
```

---

## 🚀 How to Run

1. **Build & Run all services using Docker Compose**:

```bash
docker-compose up --build
```

2. **Access Services:**
   - API (FastAPI Docs): http://localhost:8000/docs
   - Grafana Dashboard: http://localhost:3000/
     - Login: `admin` / `admin`
   - Prometheus: http://localhost:9090/

---

## 📏 Selected Monitoring Metrics

We track 3 types of key metrics using Prometheus and visualize them in Grafana:

1. **Model-related**:  
   - ✅ **Accuracy** of LightGBM, Random Forest, and SVM models during training/evaluation.
   - ✅ **Inference latency** for each API request (automatically exported to Prometheus).

2. **Data-related**:  
   - ✅ **Gesture class distribution** and **data completeness** are monitored to ensure model is trained on a well-balanced dataset.

3. **Server-related**:  
   - ✅ **CPU and memory usage** of the API container are monitored in Grafana.
   - ✅ **Request count and average latency** per endpoint.

---

## 🧪 Test the API

Once the app is running, you can test the model inference endpoint:

```bash
python tests/test_api.py
```

This script sends a request with `sample_hand.jpg` and prints the predicted gesture.

Or manually via `curl`:

```bash
curl -X POST http://localhost:8000/predict \
     -F "file=@tests/sample_hand.jpg"
```

---

## 🧱 Models Used

This project supports the following models:
- ✅ Random Forest
- ✅ Support Vector Machine (SVM)
- ✅ LR

Each model is trained and evaluated, and the **best performing model is served via the API**.

---

## 📊 MLOps Tooling

| Tool         | Purpose                           |
|--------------|-----------------------------------|
| FastAPI      | REST API to serve model           |
| Docker       | Containerization                  |
| Docker Compose | Multi-container orchestration  |
| Prometheus   | Metrics collection                |
| Grafana      | Metrics visualization             |
| MLflow       | Model tracking & experiment logging |

---

## 🛠️ Requirements

Install dependencies if running locally:

```bash
pip install -r requirements.txt
```

---

## ✨ Screenshots

screen shoots in assets folder

---

## 📬 Contact

For questions or issues, feel free to contact mohamedshouaib – ITI MLOps Track.
