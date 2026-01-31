import sys
import os
import json
import traceback
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from services.ai_service import generate_vedic_ai_summary

# Mock data
planets = [
    {"name": "Sun", "sign": "Aries", "house": 1, "sidereal_longitude": 10},
    {"name": "Moon", "sign": "Taurus", "house": 2, "sidereal_longitude": 40, "nakshatra": {"name": "Rohini"}},
    {"name": "Mars", "sign": "Aries", "house": 1, "sidereal_longitude": 5, "dignity": {"status": "Exalted"}},
    {"name": "Ascendant", "sign": "Aries", "house": 1, "sidereal_longitude": 0}
]
panchang = {"nakshatra": {"name": "Rohini"}}
dasha = {"active_mahadasha": "Sun", "active_antardasha": "Moon"}
doshas = {
    "manglik": {"present": True, "intensity": "Moderate", "reason": "Mars in 1st house"},
    "kaal_sarp": {"present": False, "intensity": "None", "type": "None"},
    "pitru_dosha": {"present": False, "intensity": "None"}
}

try:
    print("Attempting to generate AI summary...")
    result = generate_vedic_ai_summary(
        "Test User", planets, panchang, dasha, 
        context={"subscription_tier": "free"}, 
        doshas=doshas
    )
    # Check if result is the fallback
    if "cosmic balance" in str(result.get('dosha_check', {}).get('content', '')):
        print("FAILED: Received Fallback Response")
    else:
        print("SUCCESS!")
        print(json.dumps(result, indent=2))
except Exception as e:
    print(f"OUTER ERROR: {e}")
    traceback.print_exc()
