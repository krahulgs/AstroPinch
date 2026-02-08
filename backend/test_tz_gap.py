
from services.vedic_astro_engine import VedicAstroEngine
import json

def test_timezone_gap():
    name = "Rahul Kumar"
    year = 1976
    month = 11
    day = 12
    hour = 18
    minute = 20
    lat = 23.67
    lng = 86.15
    
    # Test 1: Asia/Kolkata
    print("Testing with Asia/Kolkata...")
    sd_ist = VedicAstroEngine.calculate_sidereal_planets(year, month, day, hour, minute, lat, lng, "Asia/Kolkata")
    doshas_ist = VedicAstroEngine.calculate_doshas(sd_ist)
    
    # Test 2: UTC
    print("Testing with UTC...")
    sd_utc = VedicAstroEngine.calculate_sidereal_planets(year, month, day, hour, minute, lat, lng, "UTC")
    doshas_utc = VedicAstroEngine.calculate_doshas(sd_utc)
    
    print("\nResult IST:")
    for d, v in doshas_ist.items():
        if v['present']: print(f" - {d}")
        
    print("\nResult UTC:")
    for d, v in doshas_utc.items():
        if v['present']: print(f" - {d}")

if __name__ == "__main__":
    test_timezone_gap()
