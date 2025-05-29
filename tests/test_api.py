from fastapi.testclient import TestClient
from app.main import app
import cv2, numpy as np

client = TestClient(app)

def test_predict_route_no_hand():
    dummy = np.zeros((64, 64, 3), dtype=np.uint8)
    _, buf = cv2.imencode(".jpg", dummy)
    resp = client.post("/predict/predict", files={"file": ("x.jpg", buf.tobytes(), "image/jpeg")})
    print("Response status:", resp.status_code)
    print("Response content:", resp.text)
    assert resp.status_code == 422

def test_predict_route_valid_hand():
    with open("tests/sample_hand.jpg", "rb") as f:
        resp = client.post("/predict/predict", files={"file": ("hand.jpg", f, "image/jpeg")})
    assert resp.status_code == 200
