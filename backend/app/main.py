from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import predict, segment

app = FastAPI(
    title="Water Quality API",
    description="Prédiction de la qualité de l'eau à partir de mesures terrain",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router, prefix="/api/v1", tags=["prediction"])
app.include_router(segment.router, prefix="/api/v1", tags=["segmentation"])


@app.get("/")
async def root():
    return {"message": "Water Quality API - Bienvenue"}
