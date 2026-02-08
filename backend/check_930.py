
from services.vedic_astro_engine import VedicAstroEngine
import json

def check_930pm():
    details = {
        "year": 1995, "month": 10, "day": 15,
        "hour": 21, "minute": 30,
        "lat": 23.67, "lng": 86.15,
        "timezone": "Asia/Kolkata"
    }
    
    sidereal_data = VedicAstroEngine.calculate_sidereal_planets(
        details['year'], details['month'], details['day'], 
        details['hour'], details['minute'], 
        details['lat'], details['lng'], 
        timezone_str=details['timezone']
    )
    
    doshas = VedicAstroEngine.calculate_doshas(sidereal_data)
    asc = sidereal_data['ascendant']
    mars = next(p for p in sidereal_data['planets'] if p['name'] == 'Mars')
    
    print(f"Time: {details['hour']}:{details['minute']}")
    print(f"Ascendant: {asc['sign']} at {asc['longitude'] % 30:.2f} deg")
    print(f"Mars: Sign {mars['sign']}, House {mars['house']}")
    print(f"Pitru Dosha: {doshas['pitru_dosha']['present']}")

if __name__ == "__main__":
    check_930pm()
