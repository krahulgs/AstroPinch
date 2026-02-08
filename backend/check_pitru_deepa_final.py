
import sys
import os
from datetime import datetime

# Add the current directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'backend')))

from services.vedic_astro_engine import VedicAstroEngine
from services.dosha_calculator import DoshaCalculator

def check_pitru_dosha():
    name = "Deepa Kumari"
    year = 2004
    month = 9
    day = 30
    hour = 19
    minute = 3
    lat = 24.2023 # Patan, Palamu
    lng = 84.1778
    timezone = "Asia/Kolkata"

    print(f"--- PITRU DOSHA ANALYSIS FOR {name.upper()} ---")
    print(f"Date: {day}-{month}-{year}")
    print(f"Time: {hour}:{minute}")
    print(f"Location: Patan, Palamu, Jharkhand ({lat}, {lng})")
    print("-" * 40)
    
    sidereal_data = VedicAstroEngine.calculate_sidereal_planets(
        year, month, day, hour, minute, lat, lng, timezone_str=timezone
    )
    
    # Calculate Doshas
    doshas = DoshaCalculator.calculate_doshas(sidereal_data)
    pitru = doshas.get('pitru_dosha', {})
    
    print("\n[PLANETARY POSITIONS]")
    print(f"Ascendant: {sidereal_data['ascendant']['sign']} ({sidereal_data['ascendant']['longitude']:.2f}°)")
    
    # Sort planets for cleaner output
    relevant_planets = ['Sun', 'Saturn', 'Rahu', 'Ketu', 'Jupiter']
    found_planets = {p['name']: p for p in sidereal_data['planets']}
    
    for name in relevant_planets:
        p = found_planets.get(name)
        if p:
            print(f"{p['name']:<8}: {p['sign']:<12} {p['position']:>6.2f}° (House {p['house']})")
        else:
            print(f"{name:<8}: NOT FOUND")
            
    # Check 9th lord
    signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
    asc_sign = sidereal_data['ascendant']['sign']
    asc_idx = signs.index(asc_sign)
    sign_9_idx = (asc_idx + 8) % 12
    sign_9_name = signs[sign_9_idx]
    
    def get_sign_lord(sign_name):
        lords = {
            "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
            "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
            "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
        }
        return lords.get(sign_name, "Unknown")
        
    lord_9 = get_sign_lord(sign_9_name)
    lord_9_p = found_planets.get(lord_9) or next((p for p in sidereal_data['planets'] if p['name'] == lord_9), None)
    
    print(f"\n[9TH HOUSE INFO]")
    print(f"9th House Sign: {sign_9_name}")
    print(f"9th House Lord: {lord_9}")
    if lord_9_p:
        print(f"9th Lord Position: {lord_9_p['sign']} (House {lord_9_p['house']})")

    print("\n" + "="*40)
    print("PITRU DOSHA RESULT")
    print("="*40)
    print(f"Is Present: {pitru.get('present')}")
    print(f"Intensity:  {pitru.get('intensity')}")
    print(f"Reason:     {pitru.get('reason')}")
    print("-" * 40)
    print(f"Remedy:\n{pitru.get('remedy')}")
    print("="*40)

if __name__ == "__main__":
    check_pitru_dosha()
