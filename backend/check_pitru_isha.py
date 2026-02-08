
from services.vedic_astro_engine import VedicAstroEngine
from services.dosha_calculator import DoshaCalculator
import json

def check_isha():
    name = "Isha Kumari"
    year, month, day = 2001, 8, 31
    hour, minute = 11, 5
    lat, lng = 23.7957, 86.4304 # Dhanbad
    
    print(f"Calculating for {name}...")
    sidereal_data = VedicAstroEngine.calculate_sidereal_planets(
        year, month, day, hour, minute, lat, lng
    )
    
    doshas = DoshaCalculator.calculate_doshas(sidereal_data)
    
    print("\n--- DOSHA RESULTS ---")
    print(json.dumps(doshas, indent=2))
    
    if doshas['pitru_dosha']['present']:
        print("\nPITRU DOSHA FOUND!")
        print(f"Reason: {doshas['pitru_dosha']['reason']}")
        print(f"Intensity: {doshas['pitru_dosha']['intensity']}")
    else:
        print("\nPITRU DOSHA NOT FOUND.")

if __name__ == "__main__":
    check_isha()
