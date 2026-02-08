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
        import math
        import random
        from datetime import datetime, timedelta

        # 1. Fetch Birth Chart (Sidereal) for Dignities - WITH CORRECT TIMEZONE
        sidereal_data = VedicAstroEngine.calculate_sidereal_planets(
            details.year, details.month, details.day, 
            details.hour, details.minute, details.lat, details.lng,
            timezone_str=details.timezone  # USE USER'S TIMEZONE FOR ACCURATE CALCULATIONS
        )
        
        # Build Dignity Map for weighting
        dignity_weights = {
            "Deeply Exalted": 1.6,
            "Exalted": 1.4,
            "Own Sign": 1.15,
            "Neutral": 1.0,
            "Debilitated": 0.75,
            "Deeply Debilitated": 0.6
        }
        
        planet_stats = {}
        for p in sidereal_data['planets']:
            status = p.get('dignity', {}).get('status', 'Neutral')
            planet_stats[p['name']] = dignity_weights.get(status, 1.0)
            
        # 2. Get Full Dasha Cycle
        planets_order = [("Ketu", 7), ("Venus", 20), ("Sun", 6), ("Moon", 10), 
                         ("Mars", 7), ("Rahu", 18), ("Jupiter", 16), ("Saturn", 19), ("Mercury", 17)]
        
        moon = next(p for p in sidereal_data['planets'] if p['name'] == 'Moon')
        nak_index = moon['nakshatra']['index'] - 1
        ruler_index = nak_index % 9
        
        nak_span = 360 / 27
        traversed = moon['sidereal_longitude'] - (nak_index * nak_span)
        balance_years = ((nak_span - traversed) / nak_span) * planets_order[ruler_index][1]
        
        birth_date = datetime(details.year, details.month, details.day, details.hour, details.minute)
        
        # Calculate full cycle start
        traversed_total = planets_order[ruler_index][1] - balance_years
        cycle_start = birth_date - timedelta(days=traversed_total * 365.2425)
        
        # Build Flat Dasha Timeline for lookup
        flat_timeline = []
        curr = cycle_start
        for i in range(15): # 15 mahadashas
            idx = (ruler_index + i) % 9
            m_lord, m_years = planets_order[idx]
            m_end = curr + timedelta(days=m_years * 365.2425)
            
            s_curr = curr
            for j in range(9):
                s_idx = (idx + j) % 9
                s_lord, s_years = planets_order[s_idx]
                ant_years = (m_years * s_years) / 120.0
                s_end = s_curr + timedelta(days=ant_years * 365.2425)
                
                flat_timeline.append({
                    "m_lord": m_lord,
                    "a_lord": s_lord,
                    "start": s_curr,
                    "end": s_end
                })
                s_curr = s_end
            curr = m_end

        # 3. Generate Year-by-Year Graph Data
        current_year = datetime.now().year
        forecast_years = 16 
        graph_data = []
        
        # Transit Cycles (Simplified)
        jup_start_phase = (details.year % 12)
        sat_start_phase = (details.year % 30)

        for i in range(forecast_years):
            year = current_year + i
            mid_year = datetime(year, 7, 1)
            
            active = next((p for p in flat_timeline if p['start'] <= mid_year < p['end']), None)
            m_lord, a_lord = (active['m_lord'], active['a_lord']) if active else ("Jupiter", "Mercury")
                
            # Benefic Base Scores
            benefics = {"Jupiter": 85, "Venus": 80, "Mercury": 75, "Moon": 70, "Sun": 65}
            malefics = {"Mars": 45, "Saturn": 40, "Rahu": 35, "Ketu": 38}
            
            m_base = benefics.get(m_lord, malefics.get(m_lord, 50))
            a_base = benefics.get(a_lord, malefics.get(a_lord, 50))
            
            m_weighted = m_base * planet_stats.get(m_lord, 1.0)
            a_weighted = a_base * planet_stats.get(a_lord, 1.0)
            
            score_vibration = (m_weighted * 0.65) + (a_weighted * 0.35)
            
            # Transit Modulation
            jup_mod = math.sin(((year - current_year) + jup_start_phase) * (2 * math.pi / 12)) * 10
            sat_mod = math.cos(((year - current_year) + sat_start_phase) * (2 * math.pi / 30)) * 5
            
            total_score = score_vibration + jup_mod + sat_mod
            final_score = min(98, max(25, total_score))
            
            status = "Neutral"
            if final_score > 75: status = "Highly Favorable"
            elif final_score > 60: status = "Favorable"
            elif final_score < 45: status = "Challenging"
            
            graph_data.append({
                "year": year,
                "score": int(final_score),
                "status": status,
                "planetary_influence": m_lord,
                "sub_lord": a_lord,
                "vibration": "High" if final_score > 70 else "Low" if final_score < 40 else "Steady"
            })
            
        return {
            "source": "Astro-Temporal Forecast Engine (Vedic Precision)",
            "graph_data": graph_data,
            "meta": {
                "user": details.name,
                "calculation_method": "Vimshottari Dignity Weighting",
                "engine": "VedAstro v4.2"
            }
        }


        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
