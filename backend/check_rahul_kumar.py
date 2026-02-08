
from services.vedic_astro_engine import VedicAstroEngine
import json

def check_rahul_kumar():
    # Rahul Kumar
    # 12-11-1976 • 6:20 PM
    # Bokaro, Jharkhand
    
    details = {
        "name": "Rahul Kumar",
        "year": 1976, "month": 11, "day": 12,
        "hour": 18, "minute": 20,
        "lat": 23.67, "lng": 86.15,
        "timezone": "Asia/Kolkata"
    }

    print(f"Checking Doshas for: {details['name']} ({details['year']}-{details['month']}-{details['day']} {details['hour']}:{details['minute']})")
    
    sidereal_data = VedicAstroEngine.calculate_sidereal_planets(
        details['year'], details['month'], details['day'], 
        details['hour'], details['minute'], 
        details['lat'], details['lng'], 
        timezone_str=details['timezone']
    )
    
    doshas = VedicAstroEngine.calculate_doshas(sidereal_data)
    
    sun = next(p for p in sidereal_data['planets'] if p['name'] == 'Sun')
    rahu = next(p for p in sidereal_data['planets'] if p['name'] == 'Rahu')
    ketu = next(p for p in sidereal_data['planets'] if p['name'] == 'Ketu')
    saturn = next(p for p in sidereal_data['planets'] if p['name'] == 'Saturn')
    asc = sidereal_data['ascendant']
    
    print(f"\n--- PLANETARY DATA ---")
    print(f"Ascendant: {asc['sign']} at {asc['longitude'] % 30:.2f} deg")
    print(f"Sun: House {sun['house']}, Sign {sun['sign']}, Longitude {sun['sidereal_longitude']:.2f}")
    print(f"Rahu: House {rahu['house']}, Sign {rahu['sign']}, Longitude {rahu['sidereal_longitude']:.2f}")
    print(f"Ketu: House {ketu['house']}, Sign {ketu['sign']}, Longitude {ketu['sidereal_longitude']:.2f}")
    print(f"Saturn: House {saturn['house']}, Sign {saturn['sign']}, Longitude {saturn['sidereal_longitude']:.2f}")
    
    # Check Distances
    sun_rahu_dist = min(abs(sun['sidereal_longitude'] - rahu['sidereal_longitude']), 360 - abs(sun['sidereal_longitude'] - rahu['sidereal_longitude']))
    print(f"Sun-Rahu Distance: {sun_rahu_dist:.2f} degrees")
    
    print(f"\n--- DOSHA STATUS ---")
    print(f"Pitru Dosha Present: {doshas['pitru_dosha']['present']}")
    print(f"Pitru Dosha Reason: {doshas['pitru_dosha'].get('reason', 'N/A')}")
    
    # Check 9th House logic
    print("\n--- 9th HOUSE CHECK ---")
    print(f"Rahu House: {rahu['house']}")
    
    # Standard Pitru Dosha rules often include:
    # 1. Sun + Rahu (Grahan Yoga)
    # 2. Sun + Saturn (Opposition/Conjunction)
    # 3. Rahu in 9th
    # 4. Sun in 9th afflicted
    
    sun_sat_dist = min(abs(sun['sidereal_longitude'] - saturn['sidereal_longitude']), 360 - abs(sun['sidereal_longitude'] - saturn['sidereal_longitude']))
    print(f"Sun-Saturn Distance: {sun_sat_dist:.2f} degrees")
    
    if sun['house'] == 9:
        print("Sun is in 9th House.")

if __name__ == "__main__":
    check_rahul_kumar()
