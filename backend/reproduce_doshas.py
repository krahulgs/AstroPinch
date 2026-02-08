
from services.vedic_astro_engine import VedicAstroEngine
import json

def test_rahul_kumar():
    name = "Rahul Kumar"
    year = 1976
    month = 11
    day = 12
    hour = 18
    minute = 20
    lat = 23.67
    lng = 86.15
    timezone = "Asia/Kolkata"

    # 1. First test with Nov 12
    print(f"Testing for {name}, Date: {day}/{month}/{year}, Time: {hour}:{minute}")
    sidereal_data = VedicAstroEngine.calculate_sidereal_planets(year, month, day, hour, minute, lat, lng, timezone)
    doshas = VedicAstroEngine.calculate_doshas(sidereal_data)
    
    print("\n--- SIDEREAL POSITIONS ---")
    for p in sidereal_data['planets']:
        print(f"{p['name']}: {p['sign']} {p['position']} (House {p['house']})")
    
    print("\n--- DOSHAS ---")
    for d_name, d_val in doshas.items():
        if d_val['present']:
            print(f"{d_name}: {d_val['intensity']} - {d_val['reason']}")

    # 2. Test with Dec 11 just in case
    print("\n\n" + "="*50)
    month = 12
    day = 11
    print(f"Testing for {name}, Date: {day}/{month}/{year}, Time: {hour}:{minute}")
    sidereal_data = VedicAstroEngine.calculate_sidereal_planets(year, month, day, hour, minute, lat, lng, timezone)
    doshas = VedicAstroEngine.calculate_doshas(sidereal_data)
    
    print("\n--- SIDEREAL POSITIONS ---")
    for p in sidereal_data['planets']:
        print(f"{p['name']}: {p['sign']} {p['position']} (House {p['house']})")
    
    print("\n--- DOSHAS ---")
    for d_name, d_val in doshas.items():
        if d_val['present']:
            print(f"{d_name}: {d_val['intensity']} - {d_val['reason']}")

if __name__ == "__main__":
    test_rahul_kumar()
