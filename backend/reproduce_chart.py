from services.vedic_astro_engine import VedicAstroEngine
import json
import traceback

def test_chart_calculation():
    print("Calculating Chart for Rahul Kumar...")
    
    # Input Details
    name = "Rahul Kumar"
    year, month, day = 1976, 11, 12
    hour, minute = 18, 20
    
    # Bokaro Steel City Coordinates
    lat = 23.6693
    lng = 86.1511
    timezone = "Asia/Kolkata"

    try:
        data = VedicAstroEngine.calculate_sidereal_planets(
            year, month, day, hour, minute, lat, lng, timezone_str=timezone
        )
        
        with open("chart_debug.log", "w", encoding="utf-8") as f:
            f.write(f"Ascendant: {data['ascendant']['sign']} ({data['ascendant']['longitude']:.2f})\n")
            f.write(f"Ascendant Longitude: {data['ascendant']['longitude']}\n")
            f.write("\nPlanetary Positions:\n")
            for p in data['planets']:
                f.write(f"{p['name']}: {p['sign']} ({p['sidereal_longitude']:.2f}) - House {p['house']}\n")
                
        print("Logged to chart_debug.log")
            
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    test_chart_calculation()
