from fastapi import FastAPI, HTTPException, Request
# Force reload, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.kerykeion_engine import KerykeionService
from services.external_apis import ExternalAPIService
from services.astrology_aggregator import AstrologyAggregator
from services.numerology_service import get_numerology_data
from services.ai_service import generate_numerology_insights
from generate_report import ReportGenerator
from routers import profile_router, auth_router, insights_router, chat_router, vedastro_router
from database import engine, Base

app = FastAPI()

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(f"Validation Error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )

# Database Initialization
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Include Routers
app.include_router(auth_router.router)
app.include_router(profile_router.router)
app.include_router(insights_router.router)
app.include_router(chat_router.router)
app.include_router(vedastro_router.router)

# Allow CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for development to avoid issues
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from typing import Optional, List

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
    timezone: Optional[str] = None
    lang: str = "en"
    gender: str = "male"
    profession: Optional[str] = None
    marital_status: Optional[str] = None
    subscription_tier: str = "free"

@app.get("/")
def read_root():
    return {"message": "AstroPinch Backend is running"}

@app.post("/api/chart")
def get_chart(details: BirthDetails):
    chart_data = KerykeionService.calculate_chart(
        details.name, details.year, details.month, details.day,
        details.hour, details.minute, details.city, details.lat, details.lng, details.timezone,
        lang=details.lang
    )
    
    if not chart_data:
        raise HTTPException(status_code=500, detail="Failed to calculate chart")
    
    return chart_data

@app.post("/api/chart/svg")
def get_chart_svg(details: BirthDetails):
    svg_content = KerykeionService.generate_svg(
        details.name, details.year, details.month, details.day,
        details.hour, details.minute, details.city, details.lat, details.lng, details.timezone,
        lang=details.lang
    )
    if not svg_content:
        raise HTTPException(status_code=500, detail="Failed to generate SVG")
        
    return {"svg": svg_content}

@app.post("/api/chart/svg/lunar")
def get_lunar_chart_svg(details: BirthDetails):
    svg_content = KerykeionService.generate_svg(
        details.name, details.year, details.month, details.day,
        details.hour, details.minute, details.city, details.lat, details.lng, details.timezone,
        chart_type="Lunar", lang=details.lang
    )
    if not svg_content:
        raise HTTPException(status_code=500, detail="Failed to generate Lunar SVG")
        
    return {"svg": svg_content}

@app.post("/api/chart/svg/kundali")
def get_kundali_svg(details: BirthDetails):
    svg_content = AstrologyAggregator.get_kundali_svg(
        details.name, details.year, details.month, details.day,
        details.hour, details.minute, details.lat, details.lng,
        lang=details.lang
    )
    if not svg_content:
        raise HTTPException(status_code=500, detail="Failed to generate Kundali SVG")
    return {"svg": svg_content}

@app.post("/api/chart/analysis")
def get_chart_analysis(details: BirthDetails):
    analysis = AstrologyAggregator.get_kundali_analysis(
        details.year, details.month, details.day,
        details.hour, details.minute, details.lat, details.lng,
        lang=details.lang,
        timezone=details.timezone
    )
    return analysis

@app.post("/api/chart/lagna/north")
def get_lagna_chart_north(details: BirthDetails):
    """Generate Lagna (D1) chart in North Indian style"""
    try:
        from services.vedic_astro_engine import VedicAstroEngine
        from services.chart_generator import ChartGenerator
        import base64
        
        # Get sidereal data
        sidereal_data = VedicAstroEngine.calculate_sidereal_planets(
            details.year, details.month, details.day,
            details.hour, details.minute, details.lat, details.lng,
            timezone_str=details.timezone
        )
        
        # Generate chart
        img_buffer = ChartGenerator.generate_lagna_chart_north_indian(sidereal_data)
        img_base64 = base64.b64encode(img_buffer.read()).decode('utf-8')
        
        return {"image": f"data:image/png;base64,{img_base64}"}
    except Exception as e:
        print(f"Lagna North Chart Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chart/lagna/south")
def get_lagna_chart_south(details: BirthDetails):
    """Generate Lagna (D1) chart in South Indian style"""
    try:
        from services.vedic_astro_engine import VedicAstroEngine
        from services.chart_generator import ChartGenerator
        import base64
        
        # Get sidereal data
        sidereal_data = VedicAstroEngine.calculate_sidereal_planets(
            details.year, details.month, details.day,
            details.hour, details.minute, details.lat, details.lng,
            timezone_str=details.timezone
        )
        
        # Generate chart
        img_buffer = ChartGenerator.generate_lagna_chart_south_indian(sidereal_data)
        img_base64 = base64.b64encode(img_buffer.read()).decode('utf-8')
        
        return {"image": f"data:image/png;base64,{img_base64}"}
    except Exception as e:
        print(f"Lagna South Chart Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chart/navamsa/north")
def get_navamsa_chart_north(details: BirthDetails):
    """Generate Navamsa (D9) chart in North Indian style"""
    try:
        from services.vedic_astro_engine import VedicAstroEngine
        from services.chart_generator import ChartGenerator
        import base64
        
        # Get sidereal data
        sidereal_data = VedicAstroEngine.calculate_sidereal_planets(
            details.year, details.month, details.day,
            details.hour, details.minute, details.lat, details.lng,
            timezone_str=details.timezone
        )
        
        # Calculate divisional charts
        divisional_data = VedicAstroEngine.calculate_divisional_charts(sidereal_data)
        
        # Generate chart
        img_buffer = ChartGenerator.generate_navamsa_chart_north_indian(divisional_data)
        img_base64 = base64.b64encode(img_buffer.read()).decode('utf-8')
        
        return {"image": f"data:image/png;base64,{img_base64}"}
    except Exception as e:
        print(f"Navamsa North Chart Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chart/navamsa/south")
def get_navamsa_chart_south(details: BirthDetails):
    """Generate Navamsa (D9) chart in South Indian style"""
    try:
        from services.vedic_astro_engine import VedicAstroEngine
        from services.chart_generator import ChartGenerator
        import base64
        
        # Get sidereal data
        sidereal_data = VedicAstroEngine.calculate_sidereal_planets(
            details.year, details.month, details.day,
            details.hour, details.minute, details.lat, details.lng,
            timezone_str=details.timezone
        )
        
        # Calculate divisional charts
        divisional_data = VedicAstroEngine.calculate_divisional_charts(sidereal_data)
        
        # Generate chart
        img_buffer = ChartGenerator.generate_navamsa_chart_south_indian(divisional_data)
        img_base64 = base64.b64encode(img_buffer.read()).decode('utf-8')
        
        return {"image": f"data:image/png;base64,{img_base64}"}
    except Exception as e:
        print(f"Navamsa South Chart Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predictions/best")
def get_best_prediction(details: BirthDetails):
    context = {"profession": details.profession, "marital_status": details.marital_status}
    aggregated_data = AstrologyAggregator.get_aggregated_best_prediction(
        details.name, details.year, details.month, details.day,
        details.hour, details.minute, details.city, details.lat, details.lng, details.timezone,
        lang=details.lang,
        context=context
    )
    return aggregated_data

@app.post("/api/astrology/vedic")
def get_vedic_report(details: BirthDetails):
    """
    Returns full Vedic Astrology report including Sidereal Planets, Panchang, and Dasha.
    """
    try:
        data = AstrologyAggregator.get_vedic_full_report(
            details.name,
            details.year, details.month, details.day,
            details.hour, details.minute,
            details.lat, details.lng,
            lang=details.lang,
            timezone=details.timezone
        )
        return data
    except Exception as e:
        print(f"Vedic Calc Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/horoscope/{sign}")
def get_daily_horoscope(sign: str, lang: str = "en"):
    horoscope = AstrologyAggregator.get_dynamic_horoscope(sign, lang=lang)
    return horoscope

@app.post("/api/numerology")
def get_numerology(details: BirthDetails):
    """Calculate numerology numbers using external APIs and generate AI insights"""
    try:
        context = {"profession": details.profession, "marital_status": details.marital_status}
        # Get numerology data from external APIs (Roxy/RapidAPI) or fallback
        numbers = get_numerology_data(
            details.name,
            details.year,
            details.month,
            details.day,
            context=context,
            lang=details.lang,
            gender=details.gender
        )
        
        # Generate AI insights only if not already provided (e.g. by Groq/Gemini in service)
        if "ai_insights" not in numbers:
            insights = generate_numerology_insights(numbers, context=context)
            numbers.update(insights)
        
        # Combine results
        result = numbers
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate numerology: {str(e)}")

@app.post("/api/report/consolidated")
def get_consolidated_report(details: BirthDetails):
    """
    Generate a comprehensive report combining Numerology, Western Astrology, and Vedic Analysis.
    """
    try:
        context = {
            "profession": details.profession, 
            "marital_status": details.marital_status,
            "subscription_tier": details.subscription_tier
        }
        report = ReportGenerator.generate_consolidated_report(
            details.name,
            details.year,
            details.month,
            details.day,
            details.hour,
            details.minute,
            details.city,
            details.lat,
            details.lng,
            details.timezone,
            context=context,
            lang=details.lang,
            gender=details.gender
        )
        return report
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Report generation error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate report: {str(e)}")

@app.post("/api/report/pdf")
def get_pdf_report(details: BirthDetails):
    """
    Generate PDF Report
    """
    try:
        from services.pdf_service import PDFReportService
        from fastapi.responses import StreamingResponse
        import io
        
        # 1. Generate Data Report
        context = {"profession": details.profession, "marital_status": details.marital_status}
        report_data = ReportGenerator.generate_consolidated_report(
            details.name,
            details.year,
            details.month,
            details.day,
            details.hour,
            details.minute,
            details.city,
            details.lat,
            details.lng,
            details.timezone,
            context=context,
            lang=details.lang
        )
        
        # 2. Generate PDF
        pdf_buffer = PDFReportService.generate_pdf_report(report_data, lang=details.lang)
        
        # 3. Return Stream
        filename = f"AstroPinch_Report_{details.name.replace(' ', '_')}.pdf"
        return StreamingResponse(
            io.BytesIO(pdf_buffer.getvalue()), 
            media_type="application/pdf", 
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except Exception as e:
        import traceback
        error_msg = f"PDF Generation Error: {str(e)}\n{traceback.format_exc()}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=f"PDF Generation Failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
