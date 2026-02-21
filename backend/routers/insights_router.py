from fastapi import APIRouter, HTTPException
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from services.astrology_aggregator import AstrologyAggregator
from services.kerykeion_engine import KerykeionService
from services.numerology_service import get_numerology_data

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
    lang: str = "en"
    timezone: str = "Asia/Kolkata"
    profession: str = None
    marital_status: str = None 
    
class AnalysisRequest(BaseModel):
    name: str = "User"
    year: int
    month: int
    day: int
    hour: int = 12
    minute: int = 0
    location_name: str = "Unknown"
    latitude: float = 0.0
    longitude: float = 0.0
    timezone: str = "Asia/Kolkata"
    lang: str = "en"
    profession: str = None
    marital_status: str = None 

@router.post("/daily")
async def get_daily_insights(profile: dict):
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
                y, m, d = map(int, profile.get('birth_date', '2000-01-01').split('-'))
                h, min_ = map(int, profile.get('birth_time', '12:00').split(':'))
                chart = KerykeionService.calculate_chart(
                    "User", y, m, d, h, min_, 
                    "City", 
                    profile.get('latitude', 0), 
                    profile.get('longitude', 0),
                    profile.get('timezone', 'Asia/Kolkata')
                )
                sign = chart['sun_sign']
            except Exception as e:
                print(f"Sign Calc Error: {e}")
                sign = 'Aries' # Fallback
        
        # 2. Get Horoscope
        context = {
            "profession": profile.get("profession"),
            "marital_status": profile.get("marital_status"),
            "name": profile.get("name"),
            "birth_date": profile.get("birth_date")
        }
        lang = profile.get("lang", "en")
        
        horoscope = await AstrologyAggregator.get_dynamic_horoscope(sign, lang=lang, context=context, profile_data=profile)
        
        # 3. Get Alerts
        alerts = []
        if hasattr(AstrologyAggregator, 'get_cosmic_alerts'):
             alerts = AstrologyAggregator.get_cosmic_alerts(lang=lang)
        
        return {
            "horoscope": horoscope,
            "alerts": alerts,
            "sign": sign
        }

    except Exception as e:
        print(f"Daily Insight Error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/health")
async def get_health_analysis(request: AnalysisRequest):
    """
    Get detailed AI Health Analysis based on Astrology + Numerology.
    """
    # Ensure environment is loaded
    load_dotenv()
    key = os.getenv("GROQ_API_KEY")
    
    if not key:
        raise HTTPException(status_code=500, detail="Server Configuration Error: GROQ_API_KEY is missing. Please ensure it is set in backend/.env")

    try:
        # Use integers directly
        y, m, d = request.year, request.month, request.day
        h, min_ = request.hour, request.minute
        
        # 1. Fetch Vedic Data
        vedic_data = await AstrologyAggregator.get_vedic_full_report(
            request.name, y, m, d, 
            h, min_,
            request.latitude, request.longitude,
            lang=request.lang,
            timezone=request.timezone
        )
        
        # 2. Fetch Numerology Data with Health Flag
        # We pass vedic_data so the health prompt can use Dasha/Nakshatra
        context = {
            "profession": request.profession,
            "marital_status": request.marital_status
        }
        
        numerology_full = get_numerology_data(
            request.name, y, m, d,
            vedic_data=vedic_data,
            western_data=None, 
            context=context,
            lang=request.lang,
            gender="male", # Default, or add to request if needed
            include_health=True # Triggers the 10-point Health Analysis
        )
        
        if not numerology_full.get("health_analysis"):
            raise HTTPException(status_code=500, detail="Health analysis generation failed (AI Error)")
            
        return {"health_analysis": numerology_full.get("health_analysis")}
        
    except Exception as e:
        print(f"Health Endpoint Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
