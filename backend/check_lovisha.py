
from services.vedic_astro_engine import VedicAstroEngine
import json

def check_lovisha():
    # Lovisha's approximate data based on DB fetch
    # 2002-09-02
    # Time? DB fetch truncated Time field. Let's assume 12:00 PM or check DB again
    # But wait, step 3760 truncated "Time: {p.birth...}"? No, step 3784 showed "Time:2002-09-02 18:35:00"
    # Wait, Step 3784 output was:
    # `DATA_START... Name:Lovisha... Date:2002-09-02... Time:18:35:00...`
    
    details = {
        "name": "Lovisha",
        "year": 2002, "month": 9, "day": 2,
        "hour": 18, "minute": 35,
        "lat": 30.316, "lng": 78.032,
        "timezone": "Asia/Kolkata"
    }

    print(f"Checking Doshas for: {details['year']}-{details['month']}-{details['day']} {details['hour']}:{details['minute']}")
    
    sidereal_data = VedicAstroEngine.calculate_sidereal_planets(
        details['year'], details['month'], details['day'], 
        details['hour'], details['minute'], 
        details['lat'], details['lng'], 
        timezone_str=details['timezone']
    )
    
    doshas = VedicAstroEngine.calculate_doshas(sidereal_data)
    
    sun = next(p for p in sidereal_data['planets'] if p['name'] == 'Sun')
    rahu = next(p for p in sidereal_data['planets'] if p['name'] == 'Rahu')
    
    print(f"\n--- PLANETARY DATA ---")
    print(f"Sun: House {sun['house']}, Sign {sun['sign']}, Longitude {sun['sidereal_longitude']:.2f}")
    print(f"Rahu: House {rahu['house']}, Sign {rahu['sign']}, Longitude {rahu['sidereal_longitude']:.2f}")
    
    diff = abs(sun['sidereal_longitude'] - rahu['sidereal_longitude'])
    diff = min(diff, 360 - diff)
    print(f"Sun-Rahu Distance: {diff:.2f} degrees")
    
    print(f"\n--- DOSHA STATUS ---")
    print(f"Pitru Dosha: {'PRESENT' if doshas['pitru_dosha']['present'] else 'ABSENT'}")
    print(f"Reason: {doshas['pitru_dosha'].get('reason', 'N/A')}")

if __name__ == "__main__":
    check_lovisha()
