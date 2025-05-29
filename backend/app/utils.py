from datetime import datetime

def get_wallet_age_days(timestamp: str) -> int:
    try:
        dt = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
        return (datetime.now() - dt).days
    except:
        return 0
    

def classify_risk_level(score: int) -> str:
    if score >= 80: return "Low Risk"
    if score >= 60: return "Medium Risk"
    if score >= 40: return "High Risk"
    return "Very High Risk"