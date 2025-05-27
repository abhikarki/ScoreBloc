from pydantic import BaseModel, validator
from typing import Dict, List, Any
import re

class WalletRequest(BaseModel):
    wallet_address: str

    @validator('wallet_address')
    def validate_ethereum_address(cls, v):
        if not re.match(r'^0x[a-fA-F0-9]{40}$', v):
            raise ValueError('Invalid Ethereum address format')
        return v.lower()

class RiskAnalysis(BaseModel):
    risk_score: int
    risk_level: str
    wallet_age_days: int
    total_transactions: int
    token_diversity: int
    suspicious_interactions: int
    contract_approvals: int
    balance_eth: float
    warnings: List[str]

class WalletResponse(BaseModel):
    wallet_address: str
    risk_analysis: RiskAnalysis
    tx_summary: Dict[str, Any]
    token_distribution: List[Dict[str, Any]]
    wallet_metadata: Dict[str, Any]
    activity_timeline: List[Dict[str, Any]]
