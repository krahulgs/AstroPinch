
import sys
import os
from datetime import datetime

# Add the current directory to sys.path so we can import modules
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'backend')))

from services.vedic_astro_engine import VedicAstroEngine
from services.dosha_calculator import DoshaCalculator

def check_kapsarpa():
    name = "Deepa Kumari"
    year = 2004
    month = 9
    day = 30
    hour = 19
    minute = 3
    lat = 24.18  # Patan, Palamu approx lat
    lng = 84.18  # Patan, Palamu approx lng
    timezone = "Asia/Kolkata"

    print(f"Calculating for {name} ({day}-{month}-{year} {hour}:{minute})")
    
    sidereal_data = VedicAstroEngine.calculate_sidereal_planets(
        year, month, day, hour, minute, lat, lng, timezone_str=timezone
    )
    
    # Calculate Doshas
    doshas = DoshaCalculator.calculate_doshas(sidereal_data)
    
    # Print planetary positions for manual verification
    print("\nPlanetary Positions:")
    for p in sidereal_data['planets']:
        print(f"{p['name']}: {p['sign']} {p['position']}° (Lon: {p['sidereal_longitude']}°)")
    
    print(f"\nAscendant: {sidereal_data['ascendant']['sign']} {sidereal_data['ascendant']['longitude']}°")
    
    print("\nDosha Result:")
    ks = doshas.get('kaal_sarp', {})
    print(f"Present: {ks.get('present')}")
    print(f"Intensity: {ks.get('intensity')}")
    print(f"Reason: {ks.get('reason')}")
    print(f"Remedy: {ks.get('remedy')}")

if __name__ == "__main__":
    check_kapsarpa()
