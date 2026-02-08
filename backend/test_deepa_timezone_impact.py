
import sys
import os
from datetime import datetime

# Add the current directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'backend')))

from services.vedic_astro_engine import VedicAstroEngine
from services.dosha_calculator import DoshaCalculator

def test_deepa_variants():
    name = "Deepa Kumari"
    year = 2004
    month = 9
    day = 30
    hour = 19
    minute = 3
    lat = 24.18
    lng = 84.18

    print("--- Variant 1: Asia/Kolkata (Correct) ---")
    data1 = VedicAstroEngine.calculate_sidereal_planets(year, month, day, hour, minute, lat, lng, timezone_str="Asia/Kolkata")
    doshas1 = DoshaCalculator.calculate_doshas(data1)
    print(f"Moon: {data1['planets'][1]['position']}° {data1['planets'][1]['sign']}")
    print(f"Kaal Sarp Present: {doshas1['kaal_sarp']['present']}")

    print("\n--- Variant 2: UTC (Incorrect Default) ---")
    data2 = VedicAstroEngine.calculate_sidereal_planets(year, month, day, hour, minute, lat, lng, timezone_str="UTC")
    doshas2 = DoshaCalculator.calculate_doshas(data2)
    print(f"Moon: {data2['planets'][1]['position']}° {data2['planets'][1]['sign']}")
    print(f"Kaal Sarp Present: {doshas2['kaal_sarp']['present']}")
    print(f"Reason: {doshas2['kaal_sarp']['reason']}")

if __name__ == "__main__":
    test_deepa_variants()
