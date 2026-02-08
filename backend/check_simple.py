
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

    sidereal_data = VedicAstroEngine.calculate_sidereal_planets(
        year, month, day, hour, minute, lat, lng, timezone_str=timezone
    )
    
    # Calculate Doshas
    doshas = DoshaCalculator.calculate_doshas(sidereal_data)
    pitru = doshas.get('pitru_dosha', {})
    
    print("PRESENT:", pitru.get('present'))
    print("INTENSITY:", pitru.get('intensity'))
    print("REASON:", pitru.get('reason'))
    print("REMEDY:", pitru.get('remedy'))

if __name__ == "__main__":
    check_pitru_dosha()
