
from services.vedic_astro_engine import VedicAstroEngine
import json

def test_utc():
    # Rahul Kumar Details
    lat, lng = 23.67, 86.15
    hour, minute = 18, 20
    
    y, m, d = 1976, 11, 12
    label = "Nov 12, 1976 (UTC)"
    
    print(f"Calculating for {label}...")
    sd = VedicAstroEngine.calculate_sidereal_planets(y, m, d, hour, minute, lat, lng, "UTC")
    doshas = VedicAstroEngine.calculate_doshas(sd)
    
    present_doshas = [k for k, v in doshas.items() if v['present']]
    
    result = {
        "ascendant": sd['ascendant']['sign'],
        "moon": next(p for p in sd['planets'] if p['name'] == 'Moon')['sign'],
        "doshas": present_doshas
    }
    
    print(json.dumps(result, indent=4))

if __name__ == "__main__":
    test_utc()
