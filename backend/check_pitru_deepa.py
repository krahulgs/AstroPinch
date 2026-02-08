
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
    lat = 24.18
    lng = 84.18
    timezone = "Asia/Kolkata"

    print(f"Calculating Pitru Dosha for {name}...")
    
    sidereal_data = VedicAstroEngine.calculate_sidereal_planets(
        year, month, day, hour, minute, lat, lng, timezone_str=timezone
    )
    
    # Calculate Doshas
    doshas = DoshaCalculator.calculate_doshas(sidereal_data)
    
    pitru = doshas.get('pitru_dosha', {})
    
    print("\nPlanetary Data for Pitru Dosha Check:")
    print(f"Ascendant: {sidereal_data['ascendant']['sign']} ({sidereal_data['ascendant']['longitude']}°)")
    
    for p in sidereal_data['planets']:
        if p['name'] in ['Sun', 'Saturn', 'Rahu', 'Ketu', 'Jupiter']:
            print(f"{p['name']}: {p['sign']} {p['position']}° (House {p['house']})")
            
    print("\nPitru Dosha Result:")
    print(f"Present: {pitru.get('present')}")
    print(f"Intensity: {pitru.get('intensity')}")
    print(f"Reason: {pitru.get('reason')}")
    print(f"Remedy: {pitru.get('remedy')}")

if __name__ == "__main__":
    check_pitru_dosha()
