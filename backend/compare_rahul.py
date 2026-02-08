
from services.vedic_astro_engine import VedicAstroEngine
import json

def compare_dates():
    # Rahul Kumar Details
    lat, lng = 23.67, 86.15
    hour, minute = 18, 20
    
    dates = [
        (1976, 11, 12, "Nov 12, 1976 (IST)"),
        (1976, 12, 11, "Dec 11, 1976 (IST)")
    ]
    
    results = {}
    
    for y, m, d, label in dates:
        print(f"Calculating for {label}...")
        sd = VedicAstroEngine.calculate_sidereal_planets(y, m, d, hour, minute, lat, lng, "Asia/Kolkata")
        doshas = VedicAstroEngine.calculate_doshas(sd)
        
        present_doshas = [k for k, v in doshas.items() if v['present']]
        
        results[label] = {
            "ascendant": sd['ascendant']['sign'],
            "moon": next(p for p in sd['planets'] if p['name'] == 'Moon')['sign'],
            "doshas": present_doshas
        }
        
    print(json.dumps(results, indent=4))

if __name__ == "__main__":
    compare_dates()
