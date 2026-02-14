from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.astrology_aggregator import AstrologyAggregator
from services.kerykeion_engine import KerykeionService

router = APIRouter(
    prefix="/api/insights",
    tags=["insights"]
)

class DailyRequest(BaseModel):
    name: str = "User"
    birth_date: str # YYYY-MM-DD
    birth_time: str # HH:MM
    location_name: str = "Unknown"
    latitude: float = 0.0
    longitude: float = 0.0
    # Optional extras
    western_sign: str = None 

@router.post("/daily")
def get_daily_insights(profile: dict):
    """
    Get daily horoscope and alerts for a profile.
    """
    try:
        # 1. Determine Sign if not provided
        sign = profile.get('western_sign')
        if not sign:
            # Calculate it quickly
            # Parse date/time
            try:
                y, m, d = map(int, profile['birth_date'].split('-'))
                h, min_ = map(int, profile['birth_time'].split(':'))
                chart = KerykeionService.calculate_chart(
                    profile.get('name', 'User'), y, m, d, h, min_, 
                    profile.get('location_name', 'City'), 
                    profile.get('latitude', 0), 
                    profile.get('longitude', 0),
                    timezone_str=profile.get('timezone', 'Asia/Kolkata')
                )
                sign = chart['sun_sign']
            except:
                sign = 'Aries' # Fallback
        
        # 2. Get Horoscope
        context = {
            "profession": profile.get("profession"),
            "marital_status": profile.get("marital_status")
        }
        lang = profile.get("lang", "en")
        
        horoscope = AstrologyAggregator.get_dynamic_horoscope(sign, lang=lang, context=context, profile_data=profile)
        
        # 3. Get Alerts
        alerts = AstrologyAggregator.get_cosmic_alerts(lang=lang)
        
        return {
            "horoscope": horoscope,
            "alerts": alerts,
            "sign": sign
        }

    except Exception as e:
        print(f"Daily Insight Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
