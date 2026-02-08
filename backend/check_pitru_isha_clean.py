
from services.vedic_astro_engine import VedicAstroEngine
from services.dosha_calculator import DoshaCalculator
import json

def check_isha():
    name = "Isha Kumari"
    year, month, day = 2001, 8, 31
    hour, minute = 11, 5
    lat, lng = 23.7957, 86.4304 # Dhanbad
    
    sidereal_data = VedicAstroEngine.calculate_sidereal_planets(
        year, month, day, hour, minute, lat, lng
    )
    
    doshas = DoshaCalculator.calculate_doshas(sidereal_data)
    
    p = doshas.get('pitru_dosha', {})
    print(f"PITRU DOSHA: {p.get('present')}")
    print(f"REASON: {p.get('reason')}")
    print(f"INTENSITY: {p.get('intensity')}")

if __name__ == "__main__":
    check_isha()
