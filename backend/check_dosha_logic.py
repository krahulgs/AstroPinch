
from services.vedic_astro_engine import VedicAstroEngine
import json

def check_pitru_dosha():
    # User's Birth Data (Oct 15, 1995, 10:30 AM, Bokaro)
    details = {
        "year": 1995, "month": 10, "day": 15,
        "hour": 10, "minute": 30,
        "lat": 23.67, "lng": 86.15,
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
    mars = next(p for p in sidereal_data['planets'] if p['name'] == 'Mars')
    asc = sidereal_data['ascendant']
    
    print(f"\n--- PLANETARY DATA ---")
    print(f"Ascendant: {asc['sign']} at {asc['longitude'] % 30:.2f} deg")
    print(f"Sun: House {sun['house']}, Sign {sun['sign']}, Longitude {sun['sidereal_longitude']:.2f}")
    print(f"Rahu: House {rahu['house']}, Sign {rahu['sign']}, Longitude {rahu['sidereal_longitude']:.2f}")
    print(f"Mars: House {mars['house']}, Sign {mars['sign']}, Longitude {mars['sidereal_longitude']:.2f}")
    
    print(f"\n--- DOSHA STATUS ---")
    print(f"Pitru Dosha: {'PRESENT' if doshas['pitru_dosha']['present'] else 'ABSENT'}")
    print(f"Reason: {doshas['pitru_dosha'].get('reason', 'N/A')}")
    print(f"Manglik: {'PRESENT' if doshas['manglik']['present'] else 'ABSENT'}")
    print(f"Manglik Reason: {doshas['manglik'].get('reason', 'N/A')}")
    
    # Manual Logic Check
    # Sun is in Libra (Oct 15). Rahu at that time was typically in Libra or Virgo.
    # Let's check distance
    dist = abs(sun['sidereal_longitude'] - rahu['sidereal_longitude'])
    print(f"\nSun-Rahu Distance: {dist:.2f} degrees")

if __name__ == "__main__":
    check_pitru_dosha()
