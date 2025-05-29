import os
import httpx
from datetime import datetime
from dotenv import load_dotenv
from app.utils import get_wallet_age_days, classify_risk_level

load_dotenv
MORALIS_API_KEY = os.getenv("MORALIS_API_KEY")
HEADERS = {"X-API-Key": MORALIS_API_KEY}
Base_URL = "https://deep-index.moralis.io/api/v2.2"

async def analyze_wallet(wallet_address: str):
    async with httpx.AsyncClient() as client:
        # Get transactions
        tx_url = f"{Base_URL}/wallets/:{wallet_address}/history"
