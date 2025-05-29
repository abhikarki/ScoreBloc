from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.analyer import analyze_wallet

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.post("/analyze")
async def analyze(request: Request):
    data = await request.json()
    wallet_address = data.get("wallet_address")
    if not wallet_address:
        return {"error": "Wallet address is required"}

    try:
        result = await analyze_wallet(wallet_address)
        return result
    except Exception as e:
        return {"error": str(e)}