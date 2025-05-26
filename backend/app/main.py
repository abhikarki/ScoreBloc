from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .models import WalletRequest, WalletResponse
from .simulator import fetch_wallet_data
from .scorer import RiskScorer, RiskAnalysis
from datetime import datetime
from fastapi import HTTPException

app = FastAPI(title="Wallet Risk Analyzer", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Wallet Risk Analyzer API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/analyze", response_model=WalletResponse)
async def analyze_wallet(request: WalletRequest):
    try:
        wallet_data = await fetch_wallet_data(request.wallet_address)
        scorer = RiskScorer()
        risk_result = scorer.calculate_risk_score(wallet_data)
        risk_analysis = RiskAnalysis.from_wallet(wallet_data, risk_result)
        return WalletResponse.from_all(wallet_data, risk_analysis, risk_result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
