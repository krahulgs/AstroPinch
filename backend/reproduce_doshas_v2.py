
import os
import sys
# Add current directory to path
sys.path.append(os.getcwd())

from services.vedic_astro_engine import VedicAstroEngine
import json

def test_rahul_kumar():
    name = "Rahul Kumar"
    year = 1976
    lat = 23.67
    lng = 86.15
    timezone = "Asia/Kolkata"
    hour = 18
    minute = 20

    results = []

    # Dates to check
    dates = [(11, 12), (12, 11)] # (month, day)

    for month, day in dates:
        print(f"\nRUNNING TEST FOR: {day}/{month}/{year} {hour}:{minute}")
        sidereal_data = VedicAstroEngine.calculate_sidereal_planets(year, month, day, hour, minute, lat, lng, timezone)
        doshas = VedicAstroEngine.calculate_doshas(sidereal_data)
        
        output = {
            "date": f"{day}/{month}/{year}",
            "planets": [],
            "doshas": []
        }
        
        for p in sidereal_data['planets']:
            output["planets"].append(f"{p['name']}: {p['sign']} {p['position']} (House {p['house']})")
        
        for d_name, d_val in doshas.items():
            if d_val['present']:
                output["doshas"].append(f"{d_name}: {d_val['intensity']} - {d_val['reason']}")
        
        results.append(output)

    with open("rahul_kumar_test_results.json", "w") as f:
        json.dump(results, f, indent=4)
    
    print("\nResults saved to rahul_kumar_test_results.json")

if __name__ == "__main__":
    test_rahul_kumar()
