from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator
from app.routers import predict

app = FastAPI(title="Maze Gesture Game", version="1.0.0")

@app.get("/")
def read_root():
    return {"message": "Welcome"}

app.include_router(predict.router)

Instrumentator().instrument(app).expose(app)
