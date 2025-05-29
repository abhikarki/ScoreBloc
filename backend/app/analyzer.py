import os
from moralis import evm_api
from dotenv import load_dotenv
from datetime import datetime
from app.utils import get_wallet_age_days, classify_risk_level

load_dotenv()
api_key = os.getenv("MORALIS_API_KEY")

async def analyze_wallet(wallet_address: str):
    params = {
        "chain": "eth",
        "order": "DESC",
        "address": wallet_address
    }

    # Fetch wallet history
    history = evm_api.wallets.get_wallet_history(api_key=api_key, params=params)
    transactions = history.get("result", [])

    if not transactions:
        return {"error": "No transactions found"}

    # Extract metrics
    tx_count = len(transactions)

    erc20_tokens = set()

    for tx in transactions:
        for transfer in tx.get("erc20_transfer", []):
            symbol = transfer.get("token_symbol")
            if symbol:
                erc20_tokens.add(symbol)

    token_diversity = len(erc20_tokens)


    first_tx_time = transactions[-1]["block_timestamp"]
    last_tx_time = transactions[0]["block_timestamp"]
    wallet_age_days = get_wallet_age_days(first_tx_time)

    # Volume
    total_volume_eth = sum(
        int(tx.get("value", "0")) / 1e18
        for tx in transactions
        if "value" in tx
    )

    balance_eth = 0  # optional: call Moralis balance endpoint

    # Risk Score
    score = (
        min(wallet_age_days / 365, 1.0) * 25 +
        min(tx_count / 1000, 1.0) * 25 +
        min(token_diversity / 20, 1.0) * 25 +
        (1.0 if total_volume_eth > 1 else 0.5) * 25
    )
    risk_score = round(score)
    risk_level = classify_risk_level(risk_score)

    return {
        "wallet_address": wallet_address.lower(),
        "risk_analysis": {
            "risk_score": risk_score,
            "risk_level": risk_level,
            "wallet_age_days": wallet_age_days,
            "total_transactions": tx_count,
            "token_diversity": token_diversity,
            "suspicious_interactions": 0,
            "contract_approvals": 0,
            "balance_eth": round(balance_eth, 4),
            "warnings": ["New wallet warning"] if wallet_age_days < 30 else []
        },
        "tx_summary": {
            "first_transaction": first_tx_time,
            "last_transaction": last_tx_time,
            "total_volume_eth": round(total_volume_eth, 3),
            "average_tx_per_day": round(tx_count / (wallet_age_days or 1), 2)
        },
        "token_distribution": [],  
        "activity_timeline": [],   
        "wallet_metadata": {
            "analysis_timestamp": datetime.utcnow().isoformat(),
            "data_sources": ["Moralis"],
            "component_scores": {
                "wallet_age": min(wallet_age_days / 365, 1.0),
                "transaction_count": min(tx_count / 1000, 1.0),
                "token_diversity": min(token_diversity / 20, 1.0),
                "scam_interactions": 1.0,
                "flash_loan_usage": 1.0,
                "contract_approvals": 0.6,
                "blacklist_match": 1.0
            }
        }
    }
