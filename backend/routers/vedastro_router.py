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
        start_year = current_year - 10
        end_year = current_year + 50
        total_range = end_year - start_year
        
        graph_data = []
        
        # Transit Cycles (Simplified)
        jup_start_phase = (details.year % 12)
        sat_start_phase = (details.year % 30)

        # 3. Generate Year-by-Year Graph Data
        current_year = datetime.now().year
        start_year = current_year - 10
        end_year = current_year + 50
        total_range = end_year - start_year
        
        graph_data = []

        # --- ADVANCED CALCULATION PREP ---
        # 1. Determine Lagna (Ascendant) Sign Index (1-12)
        ascendant = next((p for p in sidereal_data['planets'] if p['name'] == 'Ascendant'), None)
        lagna_sign_id = ascendant['sign_id'] if ascendant else 1

        # 2. Functional Nature Table (Simplified for all 12 Lagnas)
        # 1: Aries -> Benefics: Sun, Mars, Jup. Malefics: Mer, Ven, Sat.
        functional_nature = {
            1: {"benefic": ["Sun", "Mars", "Jupiter"], "malefic": ["Mercury", "Venus", "Saturn"]},
            2: {"benefic": ["Sun", "Saturn", "Mercury"], "malefic": ["Jupiter", "Moon", "Mars"]}, # Taurus
            3: {"benefic": ["Mercury", "Venus", "Saturn"], "malefic": ["Jupiter", "Mars", "Sun"]}, # Gemini
            4: {"benefic": ["Moon", "Mars", "Jupiter"], "malefic": ["Saturn", "Mercury", "Venus"]}, # Cancer
            5: {"benefic": ["Sun", "Mars", "Jupiter"], "malefic": ["Venus", "Saturn", "Mercury"]}, # Leo
            6: {"benefic": ["Mercury", "Venus", "Saturn"], "malefic": ["Jupiter", "Sun", "Mars"]}, # Virgo
            7: {"benefic": ["Venus", "Mercury", "Saturn"], "malefic": ["Jupiter", "Sun", "Mars"]}, # Libra
            8: {"benefic": ["Jupiter", "Moon", "Sun"], "malefic": ["Mercury", "Venus", "Saturn"]}, # Scorpio
            9: {"benefic": ["Jupiter", "Sun", "Mars"], "malefic": ["Venus", "Saturn", "Mercury"]}, # Sagittarius
            10: {"benefic": ["Saturn", "Venus", "Mercury"], "malefic": ["Jupiter", "Moon", "Mars"]}, # Capricorn
            11: {"benefic": ["Saturn", "Venus", "Mercury"], "malefic": ["Jupiter", "Moon", "Mars"]}, # Aquarius
            12: {"benefic": ["Jupiter", "Moon", "Mars"], "malefic": ["Venus", "Saturn", "Mercury"]}  # Pisces
        }
        
        lagna_nature = functional_nature.get(lagna_sign_id, {"benefic": [], "malefic": []})

        # 3. Determine House Placements (Rashi based)
        # Map planet name -> House number (1-12) from Lagna
        planet_houses = {}
        for p in sidereal_data['planets']:
            if p['name'] == 'Ascendant': continue
            # House = (PlanetSign - LagnaSign + 1) normalized to 1-12
            h_idx = (p['sign_id'] - lagna_sign_id) % 12
            planet_houses[p['name']] = h_idx + 1

        # 4. Moon Sign for Sade Sati
        moon_data = next((p for p in sidereal_data['planets'] if p['name'] == 'Moon'), None)
        moon_sign_id = moon_data['sign_id'] if moon_data else 1
        
        # --- END PREP ---

        for i in range(total_range):
            year = start_year + i
            mid_year = datetime(year, 7, 1) # Sample mid-year
            
            # --- DASHA COMPONENT (55% Weight) ---
            active_dasha = next((p for p in flat_timeline if p['start'] <= mid_year < p['end']), None)
            
            if active_dasha:
                m_lord = active_dasha['m_lord']
                a_lord = active_dasha['a_lord']
            else:
                m_lord, a_lord = ("Jupiter", "Mercury") # Fallback

            # Calculate Strength for Dasha Lord (0-100)
            def get_planet_strength(planet_name):
                score = 50 # Base
                
                # Dignity (Already calculated in planet_stats: 0.6 to 1.6 multiplier)
                dignity_mult = planet_stats.get(planet_name, 1.0)
                score += (dignity_mult - 1.0) * 50
                
                # Functional Nature
                if planet_name in lagna_nature['benefic']:
                    score += 15
                elif planet_name in lagna_nature['malefic']:
                    score -= 10
                
                # House Placement (Natal)
                # Upachaya: 3, 6, 10, 11 (Growth)
                # Dusthana: 6, 8, 12 (Suffering)
                # Kendra: 1, 4, 7, 10 (Power)
                # Trikona: 1, 5, 9 (Luck)
                
                house = planet_houses.get(planet_name, 1)
                is_malefic_natural = planet_name in ["Sun", "Mars", "Saturn", "Rahu", "Ketu"]
                
                if house in [1, 4, 7, 10]: # Kendra
                    score += 10
                elif house in [5, 9]: # Trikona
                    score += 15
                elif house == 11: # Labha (Gain) - Good for all
                    score += 15
                elif house == 3: # Sahaja - Good for Malefics
                    if is_malefic_natural: score += 10
                    else: score += 0 # Neutral/Slight neg for benefics
                elif house == 6: # Ari (Enemy) - Good for Malefics, Bad for Benefics
                    if is_malefic_natural: score += 10
                    else: score -= 15
                elif house == 8: # Randhra (Death/Transform) - Bad for all mostly
                    score -= 20
                elif house == 12: # Vyaya (Loss) - Bad for all mostly
                    score -= 15
                
                return max(10, min(100, score))

            m_score = get_planet_strength(m_lord)
            a_score = get_planet_strength(a_lord)
            
            # --- CONTEXTUAL ADJUSTMENTS (Profession & Marital Status) ---
            # Profession Significators
            prof_sig = []
            if details.profession:
                p = details.profession.lower()
                if "government" in p: prof_sig = ["Sun", "Saturn", "Mars"]
                elif "private" in p or "job" in p: prof_sig = ["Saturn", "Mercury", "Venus"]
                elif "business" in p: prof_sig = ["Mercury", "Jupiter", "Venus"]
                elif "self" in p: prof_sig = ["Sun", "Mars", "Mercury"]
                elif "student" in p: prof_sig = ["Mercury", "Jupiter", "Moon"]
                elif "unemploy" in p: prof_sig = ["Saturn", "Rahu"] # Struggle
                elif "retire" in p: prof_sig = ["Saturn", "Jupiter", "Ketu"]
                elif "other" in p: prof_sig = ["Rahu", "Mercury"]

            # Marital Significators
            marital_sig = []
            if details.marital_status:
                m = details.marital_status.lower()
                if "single" in m: marital_sig = ["Venus", "Jupiter"] 
                elif "married" in m: marital_sig = ["Venus", "Mars"]
                elif "divorce" in m: marital_sig = ["Mars", "Saturn", "Ketu"]
                elif "widow" in m: marital_sig = ["Saturn", "Mars"]
                elif "separate" in m: marital_sig = ["Saturn", "Mars", "Rahu"]

            
            # Dasha Context Bonus
            if m_lord in prof_sig: m_score += 10
            if a_lord in prof_sig: a_score += 10
            if m_lord in marital_sig: m_score += 5
            if a_lord in marital_sig: a_score += 5
            
            m_score = min(100, m_score)
            a_score = min(100, a_score)

            # Weighted Dasha Score
            dasha_score = (m_score * 0.45) + (a_score * 0.55)

            # --- TRANSIT COMPONENT (45% Weight) ---
            # REAL-TIME CALCULATION using Engine
            try:
                transit_data = VedicAstroEngine.calculate_sidereal_planets(
                    year, 7, 1, 12, 0, details.lat, details.lng, timezone_str=details.timezone
                )
                
                transit_planets = {p['name']: p for p in transit_data['planets']}
                
                # Get Transit Sign IDs
                sat_t_sign = transit_planets['Saturn']['sign_id']
                jup_t_sign = transit_planets['Jupiter']['sign_id']
                rahu_t_sign = transit_planets['Rahu']['sign_id']
                ketu_t_sign = transit_planets['Ketu']['sign_id']
                
                transit_score = 50
                status_extras = []
                
                # 1. Saturn Transit (from Moon)
                sat_from_moon = (sat_t_sign - moon_sign_id) % 12 + 1
                
                if sat_from_moon in [12, 1, 2]: # Sade Sati
                    transit_score -= 30
                    status_extras.append("Sade Sati")
                elif sat_from_moon in [4, 8]: # Dhaiya
                    transit_score -= 20
                    status_extras.append("Dhaiya")
                elif sat_from_moon in [3, 6, 11]: # Upachaya
                    transit_score += 20
                    status_extras.append("Growth Phase")
                    
                # 2. Jupiter Transit (from Moon)
                jup_from_moon = (jup_t_sign - moon_sign_id) % 12 + 1
                
                if jup_from_moon in [2, 5, 7, 9, 11]: # Good positions
                    transit_score += 25
                    if jup_from_moon == 5: status_extras.append("Creative Spike")
                    if jup_from_moon == 9: status_extras.append("Fortune Rise")
                elif jup_from_moon in [6, 8, 12]: # Bad
                    transit_score -= 10
                    
                # 3. Rahu/Ketu Transit
                rahu_from_moon = (rahu_t_sign - moon_sign_id) % 12 + 1
                if rahu_from_moon in [3, 6, 11]: transit_score += 10
                
                ketu_from_moon = (ketu_t_sign - moon_sign_id) % 12 + 1
                if ketu_from_moon in [3, 6, 11]: transit_score += 5
                    
                # 4. Check Dasha Lord in Transit
                m_lord_transit = transit_planets.get(m_lord)
                if m_lord_transit:
                    if "Exalted" in m_lord_transit.get('dignity', {}).get('status', ''):
                        transit_score += 15
                    elif "Debilitated" in m_lord_transit.get('dignity', {}).get('status', ''):
                        transit_score -= 10

                # 5. CONTEXTUAL TRANSITS
                # Career check (10th from Moon)
                tenth_from_moon = (moon_sign_id + 9) % 12 + 1
                if sat_t_sign == tenth_from_moon:
                    if details.profession and "employ" in details.profession.lower():
                        transit_score += 10 
                        status_extras.append("Career Peak")
                    elif details.profession and "business" in details.profession.lower():
                         transit_score += 5
                         status_extras.append("Business Focus")
                
                if jup_t_sign == tenth_from_moon:
                    transit_score += 15
                    status_extras.append("Career Expansion")

                # Relationship check (7th from Moon)
                seventh_from_moon = (moon_sign_id + 6) % 12 + 1
                if jup_t_sign == seventh_from_moon:
                    if details.marital_status and "single" in details.marital_status.lower():
                        transit_score += 20
                        status_extras.append("Relationship Yoga")
                    elif details.marital_status and "married" in details.marital_status.lower():
                        transit_score += 10
                        status_extras.append("Marital Harmony")
                        
            except Exception as e:
                # Fallback if engine fails for some year
                print(f"Transit calc error {year}: {e}")
                transit_score = 50
                status_extras = []

            # --- FINAL CALCULATION ---
            total_score = (dasha_score * 0.55) + (transit_score * 0.45)
            final_score = min(99, max(20, total_score))
            
            status = "Neutral"
            if final_score > 75: status = "Excellent"
            elif final_score > 60: status = "Favorable"
            elif final_score < 40: status = "Challenging"
            elif final_score < 30: status = "Very Challenging"
            
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
