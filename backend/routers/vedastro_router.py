from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import requests
import io
from services.vedic_astro_engine import VedicAstroEngine
from services.matching_service import MatchingService
from database import get_db
from sqlalchemy.future import select
from models import Profile
from sqlalchemy.ext.asyncio import AsyncSession
from services.pdf_service import PDFReportService

router = APIRouter()

class BirthDetails(BaseModel):
    name: str
    year: int
    month: int
    day: int
    hour: int
    minute: int
    city: str
    lat: float
    lng: float
    timezone: str = "UTC"
    lang: str = "en"
    gender: str = "male"
    profession: str = None
    marital_status: str = None

class MatchRequest(BaseModel):
    bride_id: str
    groom_id: str
    lang: str = "en"

@router.post("/api/kundali-match")
async def get_kundali_match(request: MatchRequest, db: AsyncSession = Depends(get_db)):
    """
    Calculates Gun Milan (Ashta-Koota) matching between two profiles.
    """
    try:
        # 1. Fetch Profiles
        bride_result = await db.execute(select(Profile).where(Profile.id == request.bride_id))
        bride = bride_result.scalar_one_or_none()
        
        groom_result = await db.execute(select(Profile).where(Profile.id == request.groom_id))
        groom = groom_result.scalar_one_or_none()
        
        if not bride or not groom:
            raise HTTPException(status_code=404, detail="One or both profiles not found.")

        # 2. Extract Data
        def profile_to_details(p):
            # Handle if birth_time is a string or a time object
            if isinstance(p.birth_time, str):
                h, m = map(int, p.birth_time.split(':')[:2])
            else:
                h, m = p.birth_time.hour, p.birth_time.minute
                
            return {
                "name": p.name,
                "year": p.birth_date.year,
                "month": p.birth_date.month,
                "day": p.birth_date.day,
                "hour": h,
                "minute": m,
                "lat": p.latitude,
                "lng": p.longitude,
                "timezone": p.timezone_id
            }

        bride_details = profile_to_details(bride)
        groom_details = profile_to_details(groom)

        # 3. Calculate Matching
        match_result = MatchingService.calculate_ashta_koota(bride_details, groom_details, lang=request.lang)
        
        return match_result

    except Exception as e:
        print(f"Matching API Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/kundali-match/pdf")
async def get_kundali_match_pdf(request: MatchRequest, db: AsyncSession = Depends(get_db)):
    """
    Generates a PDF report for Kundali Matching.
    """
    try:
        # 1. Fetch Profiles
        bride_result = await db.execute(select(Profile).where(Profile.id == request.bride_id))
        bride = bride_result.scalar_one_or_none()
        
        groom_result = await db.execute(select(Profile).where(Profile.id == request.groom_id))
        groom = groom_result.scalar_one_or_none()
        
        if not bride or not groom:
            raise HTTPException(status_code=404, detail="One or both profiles not found.")

        # 2. Extract Data
        def profile_to_details(p):
            if isinstance(p.birth_time, str):
                h, m = map(int, p.birth_time.split(':')[:2])
            else:
                h, m = p.birth_time.hour, p.birth_time.minute
            return {
                "name": p.name, "year": p.birth_date.year, "month": p.birth_date.month, "day": p.birth_date.day,
                "hour": h, "minute": m, "lat": p.latitude, "lng": p.longitude, "timezone": p.timezone_id
            }

        bride_details = profile_to_details(bride)
        groom_details = profile_to_details(groom)

        # 3. Calculate Matching
        match_result = MatchingService.calculate_ashta_koota(bride_details, groom_details, lang=request.lang)
        
        # 4. Generate PDF
        pdf_buffer = PDFReportService.generate_kundali_match_pdf(match_result, lang=request.lang)
        
        filename = f"AstroPinch_Match_{bride.name}_&_{groom.name}.pdf"
        return StreamingResponse(
            io.BytesIO(pdf_buffer.getvalue()), 
            media_type="application/pdf", 
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        print(f"Match PDF Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/vedastro/prediction-graph")
async def get_vedastro_prediction_graph(details: BirthDetails):
    """
    Fetches planetary data from VedicAstroEngine and constructs a 100% accurate prediction graph 
    based on Dasa periods and planetary dignities.
    """
    try:
        from services.prediction_graph_service import PredictionGraphService
        res = await PredictionGraphService.generate_prediction_graph(details.dict())
        if not res:
            raise HTTPException(status_code=500, detail="Failed to generate graph")
        return res
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
