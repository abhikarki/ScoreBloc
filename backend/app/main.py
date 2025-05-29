from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.analyzer import analyze_wallet

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, use your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(request: Request):
    data = await request.json()
    wallet_address = data.get("wallet_address")
    return await analyze_wallet(wallet_address)
